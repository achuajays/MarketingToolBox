import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenAI } from 'https://esm.sh/@google/genai@0.14.2';
import { corsHeaders } from '../_shared/cors.ts';

/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
if (!GEMINI_API_KEY) {
  console.error("CRITICAL: GEMINI_API_KEY environment variable is not set!");
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY! });

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (!GEMINI_API_KEY) {
       throw new Error("The GEMINI_API_KEY is not configured on the server.");
    }
    
    const params = await req.json();
    const model = 'gemini-2.5-flash';

    const response = await ai.models.generateContent({ model, ...params });
    
    // Return a simplified response body that the client expects.
    const responseData = {
        text: response.text
    };

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("Error in Supabase function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
