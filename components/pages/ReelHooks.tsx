import React, { useState, useCallback } from 'react';
import { generateContent } from '../../services/geminiService';
import { SchemaType } from '../../types';
import Header from '../layout/Header';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import Loader from '../ui/Loader';
import CopyToClipboardButton from '../ui/CopyToClipboardButton';
import { safeJsonParse } from '../../utils/json';

interface ReelScript {
  hook: string;
  body: string;
  cta: string;
}

const VIBES = ['Energetic', 'Chill', 'Educational', 'Funny', 'Inspirational', 'Dramatic'];

const ReelHooks: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [vibe, setVibe] = useState(VIBES[0]);
  const [script, setScript] = useState<ReelScript | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;

    setLoading(true);
    setScript(null);
    setError('');

    const prompt = `Create a short video script for Reels/TikTok/YouTube Shorts with the following topic and vibe. Structure it as a 3-part format and return a JSON object with:
- "hook": A compelling opening line to grab attention (5-10 words)
- "body": The main content/message (2-3 sentences)
- "cta": A strong call-to-action ending (1-2 sentences)

Topic: ${topic}
Vibe: ${vibe}`;

    const responseSchema = {
      type: SchemaType.OBJECT,
      properties: {
        hook: { type: SchemaType.STRING },
        body: { type: SchemaType.STRING },
        cta: { type: SchemaType.STRING },
      },
      required: ['hook', 'body', 'cta']
    };

    try {
      const response = await generateContent({
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema,
        }
      });

      const [parsedData, parseError] = safeJsonParse<ReelScript>(response.text);
      if (parseError) {
        setError(`Failed to parse response from AI. ${parseError.message}`);
        return;
      }
      setScript(parsedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [topic, vibe]);

  return (
    <div className="max-w-4xl mx-auto">
      <Header
        title="ReelHooks - Short Video Script Generator"
        subtitle="Generate engaging scripts for Reels, TikTok, and YouTube Shorts."
        icon={(
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-slate-600 mb-2">Topic</label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Morning routine for productivity"
              />
            </div>
            <div>
              <label htmlFor="vibe" className="block text-sm font-medium text-slate-600 mb-2">Vibe</label>
              <Select id="vibe" value={vibe} onChange={(e) => setVibe(e.target.value)}>
                {VIBES.map(v => <option key={v} value={v}>{v}</option>)}
              </Select>
            </div>
          </div>
          <Button type="submit" isLoading={loading} disabled={!topic}>
            Generate Script
          </Button>
        </form>
      </Card>

      {loading && <div className="mt-6"><Loader text="Creating script..." /></div>}
      {error && <Card className="mt-6 border-red-400"><p className="text-red-600">{error}</p></Card>}

      {script && (
        <div className="mt-8 space-y-6">
          <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
            <h3 className="text-lg font-semibold text-pink-600 mb-2">🎣 Hook</h3>
            <p className="text-slate-700 text-xl font-medium">{script.hook}</p>
            <div className="mt-4 flex justify-end">
              <CopyToClipboardButton textToCopy={script.hook} />
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">📝 Body</h3>
            <p className="text-slate-700 whitespace-pre-wrap">{script.body}</p>
            <div className="mt-4 flex justify-end">
              <CopyToClipboardButton textToCopy={script.body} />
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <h3 className="text-lg font-semibold text-green-600 mb-2">🎯 Call to Action</h3>
            <p className="text-slate-700 whitespace-pre-wrap">{script.cta}</p>
            <div className="mt-4 flex justify-end">
              <CopyToClipboardButton textToCopy={script.cta} />
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Complete Script</h3>
            <div className="bg-slate-100 p-4 rounded-md">
              <pre className="text-slate-700 whitespace-pre-wrap font-sans">
{`🎣 HOOK:
${script.hook}

📝 BODY:
${script.body}

🎯 CTA:
${script.cta}`}
              </pre>
            </div>
            <div className="mt-4 flex justify-end">
              <CopyToClipboardButton textToCopy={`${script.hook}\n\n${script.body}\n\n${script.cta}`} />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ReelHooks;