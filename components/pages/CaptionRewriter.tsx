import React, { useState, useCallback } from 'react';
import { generateContent } from '../../services/geminiService';
import { SchemaType } from '../../types';
import type { RewrittenCaptions } from '../../types';
import Header from '../layout/Header';
import Card from '../ui/Card';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';
import Loader from '../ui/Loader';
import CopyToClipboardButton from '../ui/CopyToClipboardButton';

type CaptionStyle = 'funny' | 'inspiring' | 'sharp';

const CaptionRewriter: React.FC = () => {
  const [caption, setCaption] = useState('');
  const [rewrittenCaptions, setRewrittenCaptions] = useState<RewrittenCaptions | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<CaptionStyle>('funny');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption) return;

    setLoading(true);
    setRewrittenCaptions(null);
    setError('');

    const prompt = `Rewrite the following caption in three distinct styles: funny (humorous, light-hearted), inspiring (motivational, uplifting), and sharp (concise, direct, impactful). The output must be a JSON object with keys "funny", "inspiring", and "sharp".\n\nCaption: "${caption}"`;

    const responseSchema = {
      type: SchemaType.OBJECT,
      properties: {
        funny: { type: SchemaType.STRING },
        inspiring: { type: SchemaType.STRING },
        sharp: { type: SchemaType.STRING },
      }
    };
    
    try {
      const response = await generateContent({ 
          contents: prompt,
          config: {
              responseMimeType: "application/json",
              responseSchema
          }
      });
      const jsonData = JSON.parse(response.text);
      setRewrittenCaptions(jsonData);
      setActiveTab('funny');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [caption]);

  const tabs: { id: CaptionStyle; label: string }[] = [
    { id: 'funny', label: '😂 Funny' },
    { id: 'inspiring', label: '✨ Inspiring' },
    { id: 'sharp', label: '🔪 Sharp' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <Header
        title="Caption Rewriter"
        subtitle="Instantly rewrite your captions in multiple styles to fit your audience."
        icon={(
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 17l-4 4-1.414-1.414L10.586 10 17 3.586a1 1 0 011.414 0L20 5m-5 5l2.293 2.293a1 1 0 010 1.414L15 17l-4 4-1.414-1.414L11.586 14 17 8.586a1 1 0 011.414 0L20 10" />
          </svg>
        )}
      />

      <Card>
        <form onSubmit={handleSubmit}>
          <label htmlFor="caption" className="block text-sm font-medium text-slate-600 mb-2">Original Caption</label>
          <TextArea
            id="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Paste your caption here..."
          />
          <Button type="submit" isLoading={loading} disabled={!caption} className="mt-4">
            Rewrite Captions
          </Button>
        </form>
      </Card>
      
      {loading && <div className="mt-6"><Loader /></div>}
      {error && <Card className="mt-6 border-red-400"><p className="text-red-600">{error}</p></Card>}

      {rewrittenCaptions && (
        <div className="mt-8">
            <h2 className="text-lg font-semibold text-slate-800 mb-2">Rewritten Versions</h2>
            <Card>
                <div className="border-b border-slate-200">
                    <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`${
                                    activeTab === tab.id
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
                            >
                            {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="py-4">
                    <p className="text-slate-700 whitespace-pre-wrap min-h-[80px]">{rewrittenCaptions[activeTab]}</p>
                    <div className="mt-4 flex justify-end">
                        <CopyToClipboardButton textToCopy={rewrittenCaptions[activeTab]} />
                    </div>
                </div>
            </Card>
        </div>
      )}
    </div>
  );
};

export default CaptionRewriter;