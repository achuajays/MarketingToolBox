
import React, { useState, useCallback } from 'react';
import { generateContent } from '../../services/geminiService';
import Header from '../layout/Header';
import Card from '../ui/Card';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';
import Loader from '../ui/Loader';
import CopyToClipboardButton from '../ui/CopyToClipboardButton';

const LyricsFormatter: React.FC = () => {
  const [originalLyrics, setOriginalLyrics] = useState('');
  const [formattedLyrics, setFormattedLyrics] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalLyrics) return;

    setLoading(true);
    setFormattedLyrics('');
    setError('');

    const prompt = `Review the following song lyrics. Your task is to improve the rhythm, flow, and structure, and suggest stronger rhyming words where appropriate. Keep the original theme and meaning intact. Format the output cleanly with verse and chorus labels. Add subtle beat/rhythm hints like (pause) or (faster) where it enhances the song.\n\nLyrics:\n\n${originalLyrics}`;
    
    try {
      const response = await generateContent({ contents: prompt });
      setFormattedLyrics(response.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [originalLyrics]);

  return (
    <div className="max-w-6xl mx-auto">
      <Header
        title="Lyrics Formatter"
        subtitle="Refine your song lyrics with improved rhythm, rhymes, and structure."
        icon={(
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-12v10c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
          </svg>
        )}
      />

      <form onSubmit={handleSubmit}>
        <Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="original-lyrics" className="block text-sm font-medium text-slate-600 mb-2">Original Lyrics</label>
                    <TextArea
                        id="original-lyrics"
                        value={originalLyrics}
                        onChange={(e) => setOriginalLyrics(e.target.value)}
                        placeholder="Pour your heart out here..."
                        rows={15}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Formatted Lyrics</label>
                    {loading ? (
                        <div className="h-full flex items-center justify-center bg-slate-100 rounded-md">
                            <Loader text="Formatting..."/>
                        </div>
                    ) : formattedLyrics ? (
                        <div className="h-full bg-slate-100 border border-slate-200 rounded-md p-4">
                            <pre className="text-slate-800 whitespace-pre-wrap font-sans h-full overflow-y-auto">{formattedLyrics}</pre>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center bg-white border border-dashed border-slate-300 rounded-md">
                            <p className="text-slate-400">Suggestions will appear here</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
                <Button type="submit" isLoading={loading} disabled={!originalLyrics}>
                    Format Lyrics
                </Button>
                {formattedLyrics && <CopyToClipboardButton textToCopy={formattedLyrics} />}
            </div>
            {error && <p className="mt-4 text-red-600">{error}</p>}
        </Card>
      </form>
    </div>
  );
};

export default LyricsFormatter;