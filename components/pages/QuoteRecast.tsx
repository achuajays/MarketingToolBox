import React, { useState, useCallback } from 'react';
import { generateContent } from '../../services/geminiService';
import { SchemaType } from '../../types';
import Header from '../layout/Header';
import Card from '../ui/Card';
import TextArea from '../ui/TextArea';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Loader from '../ui/Loader';
import CopyToClipboardButton from '../ui/CopyToClipboardButton';
import { safeJsonParse } from '../../utils/json';

interface RecastResult {
  rewrittenQuote: string;
}

const QuoteRecast: React.FC = () => {
  const [quote, setQuote] = useState('');
  const [tone, setTone] = useState('');
  const [result, setResult] = useState<RecastResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quote || !tone) return;

    setLoading(true);
    setResult(null);
    setError('');

    const prompt = `Rewrite the following quote to fit a new tone, making it fresh and relevant while preserving the core message.
- Original Quote: "${quote}"
- New Tone: "${tone}"

Return a JSON object with a single key "rewrittenQuote".`;

    const responseSchema = {
      type: SchemaType.OBJECT,
      properties: {
        rewrittenQuote: { type: SchemaType.STRING },
      },
      required: ['rewrittenQuote']
    };

    try {
      const response = await generateContent({
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema,
        }
      });
      const [parsedData, parseError] = safeJsonParse<RecastResult>(response.text);
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
  }, [quote, tone]);

  return (
    <div className="max-w-4xl mx-auto">
      <Header
        title="QuoteRecast"
        subtitle="Rewrite old quotes to make them tweet-ready or match your brand voice."
        icon={(
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4a14.95 14.95 0 0114.65 12.35M20 20a14.95 14.95 0 01-14.65-12.35" />
          </svg>
        )}
      />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="original-quote" className="block text-sm font-medium text-slate-600 mb-2">Original Quote</label>
            <TextArea id="original-quote" value={quote} onChange={(e) => setQuote(e.target.value)} placeholder="e.g., 'The only way to do great work is to love what you do.' - Steve Jobs" rows={3} />
          </div>
          <div>
            <label htmlFor="new-tone" className="block text-sm font-medium text-slate-600 mb-2">New Tone / Style</label>
            <Input id="new-tone" value={tone} onChange={(e) => setTone(e.target.value)} placeholder="e.g., modern & tweet-ready, empathetic and professional" />
          </div>
          <Button type="submit" isLoading={loading} disabled={!quote || !tone}>
            Recast Quote
          </Button>
        </form>
      </Card>

      {loading && <div className="mt-6"><Loader text="Recasting quote..." /></div>}
      {error && <Card className="mt-6 border-red-400"><p className="text-red-600">{error}</p></Card>}

      {result && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-2">Recast Quote</h2>
          <Card className="bg-slate-50">
            <p className="text-slate-700 text-lg italic">"{result.rewrittenQuote}"</p>
            <div className="mt-4 flex justify-end">
              <CopyToClipboardButton textToCopy={result.rewrittenQuote} />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default QuoteRecast;