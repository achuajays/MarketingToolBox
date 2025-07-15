import React, { useState, useCallback } from 'react';
import { generateContent } from '../../services/geminiService';
import { SchemaType } from '../../types';
import Header from '../layout/Header';
import Card from '../ui/Card';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';
import Loader from '../ui/Loader';
import CopyToClipboardButton from '../ui/CopyToClipboardButton';
import { safeJsonParse } from '../../utils/json';

interface PodcastResult {
  title: string;
  description: string;
  timestamps: string[];
}

const PodcastTitleGenerator: React.FC = () => {
  const [theme, setTheme] = useState('');
  const [result, setResult] = useState<PodcastResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!theme) return;

    setLoading(true);
    setResult(null);
    setError('');

    const prompt = `Generate a podcast episode based on the following theme/topic. Return a JSON object with:
- "title": A catchy, engaging podcast episode title
- "description": A compelling 2-3 sentence episode description
- "timestamps": An array of 5-7 timestamp topics (format: "00:00 - Topic name")

Theme/Topic: ${theme}`;

    const responseSchema = {
      type: SchemaType.OBJECT,
      properties: {
        title: { type: SchemaType.STRING },
        description: { type: SchemaType.STRING },
        timestamps: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING }
        },
      },
      required: ['title', 'description', 'timestamps']
    };

    try {
      const response = await generateContent({
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema,
        }
      });

      const [parsedData, parseError] = safeJsonParse<PodcastResult>(response.text);
      if (parseError) {
        setError(`Failed to parse response from AI. ${parseError.message}`);
        return;
      }
      setResult(parsedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [theme]);

  return (
    <div className="max-w-4xl mx-auto">
      <Header
        title="Podcast Title & Episode Generator"
        subtitle="Generate catchy titles, descriptions, and timestamps for your podcast episodes."
        icon={(
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        )}
      />

      <Card>
        <form onSubmit={handleSubmit}>
          <label htmlFor="theme" className="block text-sm font-medium text-slate-600 mb-2">Episode Theme/Topic</label>
          <TextArea
            id="theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="e.g., The future of remote work and its impact on company culture"
            rows={3}
          />
          <Button type="submit" isLoading={loading} disabled={!theme} className="mt-4">
            Generate Episode
          </Button>
        </form>
      </Card>

      {loading && <div className="mt-6"><Loader text="Generating episode..." /></div>}
      {error && <Card className="mt-6 border-red-400"><p className="text-red-600">{error}</p></Card>}

      {result && (
        <div className="mt-8 space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">Episode Title</h3>
            <p className="text-slate-700 text-xl font-medium">{result.title}</p>
            <div className="mt-4 flex justify-end">
              <CopyToClipboardButton textToCopy={result.title} />
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">Episode Description</h3>
            <p className="text-slate-700">{result.description}</p>
            <div className="mt-4 flex justify-end">
              <CopyToClipboardButton textToCopy={result.description} />
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">Timestamps</h3>
            <div className="space-y-2">
              {result.timestamps.map((timestamp, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                  <span className="text-slate-700 font-mono text-sm">{timestamp}</span>
                  <CopyToClipboardButton textToCopy={timestamp} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PodcastTitleGenerator;