import { createClient } from '@supabase/supabase-js';
import type { GenerateContentParameters, SimplifiedGenerateContentResponse } from '../types';

const SUPABASE_URL = 'https://tppghsndtbdsdgolpbbh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwcGdoc25kdGJkc2Rnb2xwYmJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMDE4MTAsImV4cCI6MjA2Nzc3NzgxMH0.gOa_df0VrCWHHunbOUuFNh7PESwrIWHTaCG2jEs9U9Y';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Supabase URL and Anon Key must be provided.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const generateContent = async (params: GenerateContentParameters): Promise<SimplifiedGenerateContentResponse> => {
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
            // The Supabase client often wraps the core error message
            const message = error.message.includes('Failed to fetch') 
                ? 'Failed to fetch. This may be a CORS issue or a problem with the Supabase function.' 
                : error.message;
            throw new Error(`Error calling Supabase Edge Function:\n${message}`);
        }
        throw new Error("An unknown error occurred while calling the Supabase function.");
    }
};
