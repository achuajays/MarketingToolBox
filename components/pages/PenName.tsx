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

interface PenNameResult {
  penNames: string[];
  bios: string[];
}

const PenName: React.FC = () => {
  const [niche, setNiche] = useState('');
  const [result, setResult] = useState<PenNameResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!niche) return;

    setLoading(true);
    setResult(null);
    setError('');

    const prompt = `Generate 5 unique pen names and corresponding short bios for a creator in the following niche. Return a JSON object with:
- "penNames": An array of 5 creative pen names
- "bios": An array of 5 corresponding short bios (2-3 sentences each)

Creator Niche: ${niche}`;

    const responseSchema = {
      type: SchemaType.OBJECT,
      properties: {
        penNames: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING }
        },
        bios: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING }
        },
      },
      required: ['penNames', 'bios']
    };

    try {
      const response = await generateContent({
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema,
        }
      });

      const [parsedData, parseError] = safeJsonParse<PenNameResult>(response.text);
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
  }, [niche]);

  return (
    <div className="max-w-4xl mx-auto">
      <Header
        title="PenName - AI Pseudonym & Bio Generator"
        subtitle="Generate unique pen names and professional bios for your creative persona."
        icon={(
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )}
      />

      <Card>
        <form onSubmit={handleSubmit}>
          <label htmlFor="niche" className="block text-sm font-medium text-slate-600 mb-2">Creator Niche</label>
          <Input
            id="niche"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder="e.g., Tech blogger, Romance novelist, Food critic, Travel writer"
          />
          <Button type="submit" isLoading={loading} disabled={!niche} className="mt-4">
            Generate Pen Names
          </Button>
        </form>
      </Card>

      {loading && <div className="mt-6"><Loader text="Creating personas..." /></div>}
      {error && <Card className="mt-6 border-red-400"><p className="text-red-600">{error}</p></Card>}

      {result && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Generated Pen Names & Bios</h2>
          <div className="space-y-4">
            {result.penNames.map((name, index) => (
              <Card key={index} className="bg-slate-50">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-indigo-600">{name}</h3>
                  <CopyToClipboardButton textToCopy={`${name}\n\n${result.bios[index]}`} />
                </div>
                <p className="text-slate-700">{result.bios[index]}</p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PenName;