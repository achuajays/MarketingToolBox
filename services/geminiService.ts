import { createClient } from '@supabase/supabase-js';
import type { GenerateContentParameters, SimplifiedGenerateContentResponse } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL?.trim();
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

// Validate URL format
const isValidUrl = (url: string | undefined): boolean => {
    if (!url) return false;
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

// Check if Supabase is properly configured
const useSupabase = SUPABASE_URL && SUPABASE_ANON_KEY && isValidUrl(SUPABASE_URL);

let supabase: any = null;

if (useSupabase) {
    try {
        supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
    } catch (error) {
        console.warn('Failed to initialize Supabase client:', error);
        supabase = null;
    }
}

export const generateContent = async (params: GenerateContentParameters): Promise<SimplifiedGenerateContentResponse> => {
    // Check if any API is configured
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY?.trim();
    
    if (!useSupabase && !GEMINI_API_KEY) {
        throw new Error(`No API configuration found. Please configure either:

1. Supabase (Recommended):
   - VITE_SUPABASE_URL=https://your-project.supabase.co
   - VITE_SUPABASE_ANON_KEY=your_anon_key

2. Direct Gemini API (Development):
   - VITE_GEMINI_API_KEY=your_gemini_key

Add these to your .env.local file and restart the server.`);
    }

    // If Supabase is configured, use the edge function
    if (supabase) {
        try {
            const { data, error } = await supabase.functions.invoke('gemini', {
                body: params,
            });

            if (error) {
                throw error;
            }

            if (typeof data?.text !== 'string') {
              throw new Error("Invalid or unexpected response from the AI function.");
            }
            
            return data as SimplifiedGenerateContentResponse;
        } catch (error) {
            console.error("Error calling Supabase Edge Function:", error);
            if (error instanceof Error) {
                const message = error.message.includes('Failed to fetch') 
                    ? 'Failed to fetch. This may be a CORS issue or a problem with the Supabase function.' 
                    : error.message;
                throw new Error(`Error calling Supabase Edge Function:\n${message}`);
            }
            throw new Error("An unknown error occurred while calling the Supabase function.");
        }
    }
    
    // Fallback: Direct API call (for development/testing)
    
    if (!GEMINI_API_KEY) {
        throw new Error("No API configuration found. Please set up either Supabase edge functions or provide a GEMINI_API_KEY.");
    }
    
    try {
        // This is a simplified fallback - in production, you should use Supabase edge functions
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: params.contents }] }],
                generationConfig: params.config || {}
            }),
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!text) {
            throw new Error("No text content in API response");
        }
        
        return { text };
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Error calling Gemini API:\n${error.message}`);
        }
        throw new Error("An unknown error occurred while calling the API.");
    }
};
