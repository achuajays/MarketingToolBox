import React, { useState, useCallback } from 'react';
import { generateContent } from '../../services/geminiService';
import { SchemaType } from '../../types';
import Header from '../layout/Header';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Loader from '../ui/Loader';
import CopyToClipboardButton from '../ui/CopyToClipboardButton';
import { safeJsonParse } from '../../utils/json';

interface ThreadBlueprint {
  hook: string;
  keyPoints: string[];
  cta: string;
}

const ThreadBoiler: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [blueprint, setBlueprint] = useState<ThreadBlueprint | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;

    setLoading(true);
    setBlueprint(null);
    setError('');

    const prompt = `Create a blueprint for a Twitter/X thread on the following topic. The blueprint must be a JSON object with three keys: "hook" (a compelling opening tweet to grab attention), "keyPoints" (a JSON array of 3-5 strings, each being a main point for a tweet in the thread), and "cta" (a final call-to-action or concluding tweet).\n\nTopic: ${topic}`;

    const responseSchema = {
        type: SchemaType.OBJECT,
        properties: {
            hook: { type: SchemaType.STRING },
            keyPoints: {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING }
            },
            cta: { type: SchemaType.STRING },
        },
        required: ['hook', 'keyPoints', 'cta']
    };

    try {
      const response = await generateContent({
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema,
        }
      });
      const [parsedData, parseError] = safeJsonParse<ThreadBlueprint>(response.text);
       if (parseError) {
          setError(`Failed to parse response from AI. ${parseError.message}`);
          return;
      }
      setBlueprint(parsedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [topic]);

  return (
    <div className="max-w-4xl mx-auto">
      <Header
        title="ThreadBoiler - X Thread Blueprint Generator"
        subtitle="Get the perfect structure for your next viral thread."
        icon={(
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V10a2 2 0 012-2h8zM7 8H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l4-4h2" />
          </svg>
        )}
      />

      <Card>
        <form onSubmit={handleSubmit}>
          <label htmlFor="thread-topic" className="block text-sm font-medium text-slate-600 mb-2">Thread Topic</label>
          <Input
            id="thread-topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., The future of frontend development"
          />
          <Button type="submit" isLoading={loading} disabled={!topic} className="mt-4">
            Generate Blueprint
          </Button>
        </form>
      </Card>

      {loading && <div className="mt-6"><Loader text="Boiling thread..." /></div>}
      {error && <Card className="mt-6 border-red-400"><p className="text-red-600">{error}</p></Card>}

      {blueprint && (
        <div className="mt-8 space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">Hook (Tweet 1)</h3>
            <p className="text-slate-700">{blueprint.hook}</p>
             <div className="mt-4 flex justify-end">
                <CopyToClipboardButton textToCopy={blueprint.hook} />
            </div>
          </Card>

          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2 ml-1">Key Points (Tweets 2-{blueprint.keyPoints.length + 1})</h3>
            <div className="space-y-4">
                {blueprint.keyPoints.map((point, index) => (
                    <Card key={index} className="flex items-start gap-4 bg-slate-50">
                         <div className="flex-shrink-0 text-sm font-bold text-slate-400 pt-1">{index + 2}</div>
                         <p className="flex-grow text-slate-700">{point}</p>
                         <CopyToClipboardButton textToCopy={point} />
                    </Card>
                ))}
            </div>
          </div>
          
          <Card>
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">CTA (Final Tweet)</h3>
            <p className="text-slate-700">{blueprint.cta}</p>
             <div className="mt-4 flex justify-end">
                <CopyToClipboardButton textToCopy={blueprint.cta} />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ThreadBoiler;