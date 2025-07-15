import React, { useState, useCallback } from 'react';
import { generateContent } from '../../services/geminiService';
import Header from '../layout/Header';
import Card from '../ui/Card';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';
import Loader from '../ui/Loader';
import CopyToClipboardButton from '../ui/CopyToClipboardButton';

const PromptBooster: React.FC = () => {
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalPrompt) return;

    setLoading(true);
    setEnhancedPrompt('');
    setError('');

    const prompt = `Enhance the following AI art prompt by adding specific details about style, lighting, camera lens, composition, emotion, and artistic techniques. Make it more vivid and detailed while preserving the original concept. The enhanced prompt should be optimized for AI art generators like DALL-E, Midjourney, or Firefly.

Original prompt: "${originalPrompt}"

Enhanced prompt:`;

    try {
      const response = await generateContent({ contents: prompt });
      setEnhancedPrompt(response.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [originalPrompt]);

  return (
    <div className="max-w-6xl mx-auto">
      <Header
        title="PromptBooster - AI Prompt Rewriter for Artists"
        subtitle="Transform basic prompts into detailed, optimized instructions for AI art generators."
        icon={(
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )}
      />

      <form onSubmit={handleSubmit}>
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="original-prompt" className="block text-sm font-medium text-slate-600 mb-2">Original Prompt</label>
              <TextArea
                id="original-prompt"
                value={originalPrompt}
                onChange={(e) => setOriginalPrompt(e.target.value)}
                placeholder="e.g., a cat sitting on a chair"
                rows={10}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Enhanced Prompt</label>
              <div className="h-full rounded-md bg-slate-100 border border-slate-200">
                {loading ? (
                  <div className="h-full flex items-center justify-center">
                    <Loader text="Boosting prompt..." />
                  </div>
                ) : enhancedPrompt ? (
                  <pre className="text-slate-800 whitespace-pre-wrap font-sans p-4 h-full overflow-y-auto">{enhancedPrompt}</pre>
                ) : (
                  <div className="h-full flex items-center justify-center border-dashed border-transparent">
                    <p className="text-slate-500">Enhanced prompt will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <Button type="submit" isLoading={loading} disabled={!originalPrompt}>
              Boost Prompt
            </Button>
            {enhancedPrompt && <CopyToClipboardButton textToCopy={enhancedPrompt} />}
          </div>
          {error && <p className="mt-4 text-red-600">{error}</p>}
        </Card>
      </form>

      {enhancedPrompt && (
        <div className="mt-8">
          <Card>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Tips for Using Enhanced Prompts</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-blue-50 p-3 rounded-md">
                <h4 className="font-semibold text-blue-800 mb-1">DALL-E</h4>
                <p className="text-blue-700">Works best with detailed descriptions and artistic styles</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-md">
                <h4 className="font-semibold text-purple-800 mb-1">Midjourney</h4>
                <p className="text-purple-700">Excels with camera settings and lighting descriptions</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-md">
                <h4 className="font-semibold text-orange-800 mb-1">Firefly</h4>
                <p className="text-orange-700">Responds well to emotion and composition details</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PromptBooster;