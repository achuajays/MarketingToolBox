
import React, { useState, useCallback } from 'react';
import { generateContent } from '../../services/geminiService';
import Header from '../layout/Header';
import Card from '../ui/Card';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';
import Loader from '../ui/Loader';
import CopyToClipboardButton from '../ui/CopyToClipboardButton';

const ClipCutter: React.FC = () => {
  const [idea, setIdea] = useState('');
  const [script, setScript] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea) return;

    setLoading(true);
    setScript('');
    setError('');

    const prompt = `Break down the following long-form content idea into a script for a 30-second YouTube Short. The script should have a strong hook, 2-3 quick key points, and a call to action. Format it as a simple text block with visual cues or actions in parentheses, like (Quick zoom) or (Text on screen: ...). The total spoken word count should be around 90-110 words.\n\nIdea:\n\n${idea}`;
    
    try {
      const response = await generateContent({ contents: prompt });
      setScript(response.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [idea]);

  return (
    <div className="max-w-4xl mx-auto">
      <Header
        title="ClipCutter - Shorts Script Formatter"
        subtitle="Turn big ideas into short-form video scripts."
        icon={(
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121M12 12l2.879 2.879M12 12L9.121 14.879M10 16a6 6 0 110-12 6 6 0 010 12zM18 8a6 6 0 11-12 0 6 6 0 0112 0z" />
          </svg>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <form onSubmit={handleSubmit}>
              <label htmlFor="long-idea" className="block text-sm font-medium text-slate-600 mb-2">Long-form Content Idea</label>
              <TextArea
                id="long-idea"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="e.g., A full tutorial on how to bake sourdough bread from scratch."
                rows={8}
              />
              <Button type="submit" isLoading={loading} disabled={!idea} className="mt-4">
                Generate Shorts Script
              </Button>
            </form>
          </Card>
           {error && <Card className="border-red-400"><p className="text-red-600">{error}</p></Card>}
        </div>
        
        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-800">Generated Script</h2>
            {loading ? (
                <Loader text="Scripting..."/>
            ) : script ? (
                <Card className="bg-slate-50">
                    <pre className="text-slate-700 whitespace-pre-wrap font-sans">{script}</pre>
                    <div className="mt-4 flex justify-end">
                        <CopyToClipboardButton textToCopy={script} />
                    </div>
                </Card>
            ) : (
                <Card className="flex items-center justify-center min-h-[200px] border-dashed border-slate-300 bg-slate-50">
                    <p className="text-slate-400">Your script will appear here.</p>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
};

export default ClipCutter;