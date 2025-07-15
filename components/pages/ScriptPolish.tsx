
import React, { useState, useCallback } from 'react';
import { generateContent } from '../../services/geminiService';
import Header from '../layout/Header';
import Card from '../ui/Card';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';
import Loader from '../ui/Loader';
import CopyToClipboardButton from '../ui/CopyToClipboardButton';

const ScriptPolish: React.FC = () => {
  const [originalScript, setOriginalScript] = useState('');
  const [polishedScript, setPolishedScript] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalScript) return;

    setLoading(true);
    setPolishedScript('');
    setError('');

    const prompt = `Review the following short film dialogue or scene. Your task is to polish it by improving the pacing, emotional depth, and realism. Make the dialogue sound more natural and impactful for actors to perform, while retaining the core meaning and character voices. Format the output cleanly.\n\nOriginal Script:\n\n${originalScript}`;
    
    try {
      const response = await generateContent({ contents: prompt });
      setPolishedScript(response.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [originalScript]);

  return (
    <div className="max-w-6xl mx-auto">
      <Header
        title="ScriptPolish"
        subtitle="Enhance your short film dialogue for pacing, emotion, and realism."
        icon={(
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
          </svg>
        )}
      />

      <form onSubmit={handleSubmit}>
        <Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="original-script" className="block text-sm font-medium text-slate-600 mb-2">Original Dialogue / Scene</label>
                    <TextArea
                        id="original-script"
                        value={originalScript}
                        onChange={(e) => setOriginalScript(e.target.value)}
                        placeholder="Paste your scene here..."
                        rows={15}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Polished Version</label>
                    <div className="h-full rounded-md bg-slate-100 border border-slate-200">
                      {loading ? (
                          <div className="h-full flex items-center justify-center">
                              <Loader text="Polishing..."/>
                          </div>
                      ) : polishedScript ? (
                          <pre className="text-slate-800 whitespace-pre-wrap font-sans p-4 h-full overflow-y-auto">{polishedScript}</pre>
                      ) : (
                          <div className="h-full flex items-center justify-center border-dashed border-transparent">
                              <p className="text-slate-500">Suggestions will appear here</p>
                          </div>
                      )}
                    </div>
                </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
                <Button type="submit" isLoading={loading} disabled={!originalScript}>
                    Polish Script
                </Button>
                {polishedScript && <CopyToClipboardButton textToCopy={polishedScript} />}
            </div>
            {error && <p className="mt-4 text-red-600">{error}</p>}
        </Card>
      </form>
    </div>
  );
};

export default ScriptPolish;