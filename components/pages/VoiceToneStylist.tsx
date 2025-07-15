
import React, { useState, useCallback } from 'react';
import { generateContent } from '../../services/geminiService';
import Header from '../layout/Header';
import Card from '../ui/Card';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';
import Loader from '../ui/Loader';
import CopyToClipboardButton from '../ui/CopyToClipboardButton';
import Select from '../ui/Select';

const TONES = ['Casual & Friendly', 'Professional & Authoritative', 'Quirky & Humorous', 'Enthusiastic & Energetic'];

const VoiceToneStylist: React.FC = () => {
  const [script, setScript] = useState('');
  const [tone, setTone] = useState(TONES[0]);
  const [rewrittenScript, setRewrittenScript] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!script) return;

    setLoading(true);
    setRewrittenScript('');
    setError('');

    const prompt = `Rewrite the following script/outline in a "${tone}" tone. Adapt the language, phrasing, and sentence structure to perfectly match the selected voice, but keep the core information and key messages intact. The goal is to change the delivery, not the substance.\n\nOriginal Script:\n\n${script}`;
    
    try {
      const response = await generateContent({ contents: prompt });
      setRewrittenScript(response.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [script, tone]);

  return (
    <div className="max-w-6xl mx-auto">
      <Header
        title="VoiceTone Stylist"
        subtitle="Rewrite your YouTube or podcast script in a different voice."
        icon={(
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        )}
      />

      <form onSubmit={handleSubmit}>
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="original-script" className="block text-sm font-medium text-slate-600 mb-2">Original Script / Outline</label>
              <TextArea
                id="original-script"
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder="Paste your script or outline here..."
                rows={12}
              />
               <div className="mt-4">
                 <label htmlFor="tone" className="block text-sm font-medium text-slate-600 mb-2">Target Tone</label>
                <Select id="tone" value={tone} onChange={(e) => setTone(e.target.value)}>
                  {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                </Select>
               </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Rewritten Script</label>
               <div className="h-full rounded-md bg-slate-100 border border-slate-200">
                    {loading ? (
                        <div className="h-full flex items-center justify-center">
                            <Loader text="Styling voice..."/>
                        </div>
                    ) : rewrittenScript ? (
                        <pre className="text-slate-800 whitespace-pre-wrap font-sans p-4 h-full overflow-y-auto">{rewrittenScript}</pre>
                    ) : (
                        <div className="h-full flex items-center justify-center border-dashed border-transparent">
                            <p className="text-slate-500">Your rewritten script will appear here</p>
                        </div>
                    )}
                </div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <Button type="submit" isLoading={loading} disabled={!script}>
              Restyle Script
            </Button>
            {rewrittenScript && <CopyToClipboardButton textToCopy={rewrittenScript} />}
          </div>
          {error && <p className="mt-4 text-red-600">{error}</p>}
        </Card>
      </form>
    </div>
  );
};

export default VoiceToneStylist;