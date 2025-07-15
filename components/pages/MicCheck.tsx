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

interface MicCheckResult {
  openingLine: string;
  sponsorBlurb: string;
}

const TONES = ['Professional', 'Casual', 'Energetic', 'Warm', 'Authoritative'];

const MicCheck: React.FC = () => {
  const [podcastTitle, setPodcastTitle] = useState('');
  const [tone, setTone] = useState(TONES[0]);
  const [result, setResult] = useState<MicCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!podcastTitle) return;

    setLoading(true);
    setResult(null);
    setError('');

    const prompt = `Create podcast opening content for the following podcast title and tone. Return a JSON object with:
- "openingLine": A compelling opening line to start the episode (1-2 sentences)
- "sponsorBlurb": A smooth sponsor transition/blurb template (2-3 sentences with [SPONSOR] placeholder)

Podcast Title: ${podcastTitle}
Tone: ${tone}`;

    const responseSchema = {
      type: SchemaType.OBJECT,
      properties: {
        openingLine: { type: SchemaType.STRING },
        sponsorBlurb: { type: SchemaType.STRING },
      },
      required: ['openingLine', 'sponsorBlurb']
    };

    try {
      const response = await generateContent({
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema,
        }
      });

      const [parsedData, parseError] = safeJsonParse<MicCheckResult>(response.text);
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
  }, [podcastTitle, tone]);

  return (
    <div className="max-w-4xl mx-auto">
      <Header
        title="MicCheck - Podcast Opener Writer"
        subtitle="Generate compelling opening lines and sponsor blurbs for your podcast."
        icon={(
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        )}
      />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="podcast-title" className="block text-sm font-medium text-slate-600 mb-2">Podcast Title</label>
              <Input
                id="podcast-title"
                value={podcastTitle}
                onChange={(e) => setPodcastTitle(e.target.value)}
                placeholder="e.g., The Startup Journey, Tech Talk Daily"
              />
            </div>
            <div>
              <label htmlFor="tone" className="block text-sm font-medium text-slate-600 mb-2">Tone</label>
              <Select id="tone" value={tone} onChange={(e) => setTone(e.target.value)}>
                {TONES.map(t => <option key={t} value={t}>{t}</option>)}
              </Select>
            </div>
          </div>
          <Button type="submit" isLoading={loading} disabled={!podcastTitle}>
            Generate Opener
          </Button>
        </form>
      </Card>

      {loading && <div className="mt-6"><Loader text="Writing opener..." /></div>}
      {error && <Card className="mt-6 border-red-400"><p className="text-red-600">{error}</p></Card>}

      {result && (
        <div className="mt-8 space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">Opening Line</h3>
            <p className="text-slate-700 text-lg">{result.openingLine}</p>
            <div className="mt-4 flex justify-end">
              <CopyToClipboardButton textToCopy={result.openingLine} />
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">Sponsor Blurb Template</h3>
            <p className="text-slate-700">{result.sponsorBlurb}</p>
            <div className="mt-4 flex justify-end">
              <CopyToClipboardButton textToCopy={result.sponsorBlurb} />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MicCheck;