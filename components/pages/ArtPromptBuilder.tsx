
import React, { useState, useCallback } from 'react';
import { generateContent } from '../../services/geminiService';
import type { ArtPromptHistoryItem } from '../../types';
import useLocalStorage from '../../hooks/useLocalStorage';
import Header from '../layout/Header';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Loader from '../ui/Loader';
import CopyToClipboardButton from '../ui/CopyToClipboardButton';

const ArtPromptBuilder: React.FC = () => {
  const [idea, setIdea] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useLocalStorage<ArtPromptHistoryItem[]>('artPromptHistory', []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea) return;

    setLoading(true);
    setGeneratedPrompt('');
    setError('');

    const prompt = `Convert this idea into an optimized, detailed, and imaginative art generation prompt suitable for models like Midjourney or DALL-E. The prompt should be a single, copyable block of text. Focus on visual details, style, composition, and lighting.\n\nIdea: "${idea}"`;

    try {
      const response = await generateContent({ contents: prompt });
      const newPrompt = response.text;
      setGeneratedPrompt(newPrompt);
      const newHistoryItem: ArtPromptHistoryItem = { id: new Date().toISOString(), idea, prompt: newPrompt };
      setHistory([newHistoryItem, ...history.slice(0, 9)]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [idea, history, setHistory]);

  return (
    <div className="max-w-4xl mx-auto">
      <Header
        title="Art Prompt Builder"
        subtitle="Turn your simple ideas into rich, detailed prompts for AI art generators."
        icon={(
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
          </svg>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
            <Card>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="idea" className="block text-sm font-medium text-slate-600 mb-2">Your Idea</label>
                    <Input
                        id="idea"
                        type="text"
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                        placeholder="e.g., a serene sunset in Tokyo"
                    />
                    <Button type="submit" isLoading={loading} disabled={!idea} className="mt-4">
                        Generate Prompt
                    </Button>
                </form>
            </Card>

            {loading && <div className="mt-6"><Loader /></div>}
            {error && <Card className="mt-6 border-red-400"><p className="text-red-600">{error}</p></Card>}
            
            {generatedPrompt && (
                <div className="mt-6">
                    <h2 className="text-lg font-semibold text-slate-800 mb-2">Generated Prompt</h2>
                    <Card>
                        <p className="text-slate-700 whitespace-pre-wrap">{generatedPrompt}</p>
                        <div className="mt-4 flex justify-end gap-2">
                            <CopyToClipboardButton textToCopy={generatedPrompt} />
                        </div>
                    </Card>
                </div>
            )}
        </div>

        <div className="md:col-span-1">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">History</h3>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {history.length > 0 ? history.map(item => (
                    <div key={item.id} className="bg-slate-100 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-200" onClick={() => { setIdea(item.idea); setGeneratedPrompt(item.prompt)}}>
                        <p className="text-sm font-medium text-slate-800 truncate">{item.idea}</p>
                        <p className="text-xs text-slate-500 mt-1 truncate">{item.prompt}</p>
                    </div>
                )) : (
                    <p className="text-sm text-slate-500">No history yet.</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ArtPromptBuilder;