import React, { useState, useCallback } from 'react';
import { generateContent } from '../../services/geminiService';
import { SchemaType } from '../../types';
import Header from '../layout/Header';
import Card from '../ui/Card';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';
import Loader from '../ui/Loader';
import CopyToClipboardButton from '../ui/CopyToClipboardButton';
import { safeJsonParse } from '../../utils/json';

const MoodboardPromptAssistant: React.FC = () => {
  const [brief, setBrief] = useState('');
  const [prompts, setPrompts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brief) return;

    setLoading(true);
    setPrompts([]);
    setError('');

    const prompt = `Based on the following theme or client brief, generate a "Midjourney Prompt Pack" for creating a visual moodboard. Provide 5 distinct, detailed, and imaginative prompts. Each prompt should explore a different facet of the theme (e.g., color palette, typography style, key imagery, texture & materials, overall atmosphere). The prompts should be formatted for maximum visual output. Return a JSON array of 5 strings.\n\nTheme/Brief:\n\n${brief}`;

    const responseSchema = {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING }
    };

    try {
      const response = await generateContent({
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema,
        }
      });
      const [parsedData, parseError] = safeJsonParse<string[]>(response.text);

      if (parseError) {
          setError(`Failed to parse response from AI. ${parseError.message}`);
          return;
      }
       if (Array.isArray(parsedData) && parsedData.every(item => typeof item === 'string')) {
          setPrompts(parsedData);
      } else {
          setError("AI response was not in the expected format (array of strings).");
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [brief]);

  return (
    <div className="max-w-4xl mx-auto">
      <Header
        title="Moodboard Prompt Assistant"
        subtitle="Generate a pack of art prompts from a single theme or brief."
        icon={(
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
        )}
      />

      <Card>
        <form onSubmit={handleSubmit}>
          <label htmlFor="client-brief" className="block text-sm font-medium text-slate-600 mb-2">Theme or Client Brief</label>
          <TextArea
            id="client-brief"
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            placeholder="e.g., A minimalist, eco-friendly coffee brand targeting Gen-Z. Keywords: earthy, calm, authentic, sustainable."
            rows={6}
          />
          <Button type="submit" isLoading={loading} disabled={!brief} className="mt-4">
            Generate Prompt Pack
          </Button>
        </form>
      </Card>

      {loading && <div className="mt-6"><Loader text="Designing prompts..." /></div>}
      {error && <Card className="mt-6 border-red-400"><p className="text-red-600 whitespace-pre-wrap">{error}</p></Card>}

      {prompts.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-2">Generated Prompt Pack</h2>
          <div className="space-y-4">
            {prompts.map((p, index) => (
              <Card key={index} className="bg-slate-50">
                 <p className="text-slate-700 mb-4">{p}</p>
                 <div className="flex justify-end">
                    <CopyToClipboardButton textToCopy={p} />
                 </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodboardPromptAssistant;