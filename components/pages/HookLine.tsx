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

const HookLine: React.FC = () => {
  const [idea, setIdea] = useState('');
  const [hooks, setHooks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea) return;

    setLoading(true);
    setHooks([]);
    setError('');

    const prompt = `Create 5 strong, scroll-stopping hook lines (the first line of a caption) for a social media post based on the provided idea. Each hook should be short, intriguing, and designed to grab attention immediately. Use a mix of questions, bold statements, and curiosity-gaps. Return a JSON array of 5 strings.\n\nIdea: "${idea}"`;
    
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
      if (Array.isArray(parsedData)) {
        setHooks(parsedData);
      } else {
        throw new Error("API did not return a valid array of strings.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [idea]);

  return (
    <div className="max-w-4xl mx-auto">
      <Header
        title="HookLine - Instagram 1st Line Optimizer"
        subtitle="Craft the perfect opening line to stop the scroll."
        icon={(
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V8a2 2 0 10-4 0v8m-3 0h10M5 16a4 4 0 108 0h-8z" />
          </svg>
        )}
      />

      <Card>
        <form onSubmit={handleSubmit}>
          <label htmlFor="post-idea" className="block text-sm font-medium text-slate-600 mb-2">Caption or Post Idea</label>
          <TextArea
            id="post-idea"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="e.g., My top 3 productivity hacks for developers"
            rows={4}
          />
          <Button type="submit" isLoading={loading} disabled={!idea} className="mt-4">
            Generate Hooks
          </Button>
        </form>
      </Card>

      {loading && <div className="mt-6"><Loader text="Writing hooks..." /></div>}
      {error && <Card className="mt-6 border-red-400"><p className="text-red-600 whitespace-pre-wrap">{error}</p></Card>}

      {hooks.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-2">Generated Hook Lines</h2>
          <div className="space-y-3">
            {hooks.map((hook, index) => (
              <Card key={index} className="flex justify-between items-center group bg-slate-50 hover:bg-slate-100 transition-colors">
                <p className="text-slate-700">{hook}</p>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <CopyToClipboardButton textToCopy={hook} />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HookLine;