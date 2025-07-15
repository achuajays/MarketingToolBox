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

const SloganStitcher: React.FC = () => {
  const [brandName, setBrandName] = useState('');
  const [vibe, setVibe] = useState('');
  const [slogans, setSlogans] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName || !vibe) return;

    setLoading(true);
    setSlogans([]);
    setError('');

    const prompt = `Generate 5 punchy, memorable brand taglines/slogans for the following brand and vibe. Each slogan should be short (2-6 words), catchy, and capture the brand essence. Return a JSON array of 5 strings.

Brand Name: ${brandName}
Brand Vibe: ${vibe}`;

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
        setSlogans(parsedData);
      } else {
        setError("AI response was not in the expected format (array of strings).");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [brandName, vibe]);

  return (
    <div className="max-w-4xl mx-auto">
      <Header
        title="Slogan Stitcher - Brand Tagline Composer"
        subtitle="Generate punchy, memorable slogans that capture your brand essence."
        icon={(
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
        )}
      />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="brand-name" className="block text-sm font-medium text-slate-600 mb-2">Brand Name</label>
              <Input
                id="brand-name"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g., TechFlow, GreenLeaf, UrbanStyle"
              />
            </div>
            <div>
              <label htmlFor="vibe" className="block text-sm font-medium text-slate-600 mb-2">Brand Vibe</label>
              <Input
                id="vibe"
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
                placeholder="e.g., innovative & trustworthy, eco-friendly & calm"
              />
            </div>
          </div>
          <Button type="submit" isLoading={loading} disabled={!brandName || !vibe}>
            Stitch Slogans
          </Button>
        </form>
      </Card>

      {loading && <div className="mt-6"><Loader text="Stitching slogans..." /></div>}
      {error && <Card className="mt-6 border-red-400"><p className="text-red-600">{error}</p></Card>}

      {slogans.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Generated Slogans</h2>
          <div className="space-y-4">
            {slogans.map((slogan, index) => (
              <Card key={index} className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
                <div className="flex justify-between items-center">
                  <div className="flex-grow">
                    <div className="text-center py-6">
                      <p className="text-2xl font-bold text-indigo-600 mb-2">{brandName}</p>
                      <p className="text-lg text-slate-700 italic">"{slogan}"</p>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <CopyToClipboardButton textToCopy={slogan} />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="mt-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Slogan Usage Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-slate-700 mb-1">Best Practices:</h4>
                <ul className="text-slate-600 space-y-1">
                  <li>• Keep it under 6 words</li>
                  <li>• Make it memorable and rhythmic</li>
                  <li>• Reflect your brand values</li>
                  <li>• Test with your target audience</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-700 mb-1">Usage Ideas:</h4>
                <ul className="text-slate-600 space-y-1">
                  <li>• Website headers and footers</li>
                  <li>• Social media bios</li>
                  <li>• Business cards and marketing</li>
                  <li>• Email signatures</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SloganStitcher;