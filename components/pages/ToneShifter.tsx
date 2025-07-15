
import React, { useState, useCallback } from 'react';
import { generateContent } from '../../services/geminiService';
import Header from '../layout/Header';
import Card from '../ui/Card';
import TextArea from '../ui/TextArea';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Loader from '../ui/Loader';
import CopyToClipboardButton from '../ui/CopyToClipboardButton';

const ToneShifter: React.FC = () => {
  const [paragraph, setParagraph] = useState('');
  const [targetVoice, setTargetVoice] = useState('');
  const [rewrittenText, setRewrittenText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paragraph || !targetVoice) return;

    setLoading(true);
    setRewrittenText('');
    setError('');

    const prompt = `Rewrite the following paragraph in the specific voice and tone of "${targetVoice}". Capture the linguistic style, attitude, vocabulary, and sentence structure associated with that brand, persona, or style. The meaning should be preserved, but the delivery completely transformed.\n\nOriginal Paragraph:\n"${paragraph}"`;
    
    try {
      const response = await generateContent({ contents: prompt });
      setRewrittenText(response.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [paragraph, targetVoice]);

  return (
    <div className="max-w-6xl mx-auto">
      <Header
        title="ToneShifter - Brand Voice Converter"
        subtitle="Rewrite text in the voice of famous brands, people, or styles."
        icon={(
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        )}
      />

      <form onSubmit={handleSubmit}>
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="original-paragraph" className="block text-sm font-medium text-slate-600 mb-2">Original Text</label>
              <TextArea
                id="original-paragraph"
                value={paragraph}
                onChange={(e) => setParagraph(e.target.value)}
                placeholder="Place your original text here..."
                rows={10}
              />
              <div className="mt-4">
                  <label htmlFor="target-voice" className="block text-sm font-medium text-slate-600 mb-2">Target Voice</label>
                  <Input 
                    id="target-voice"
                    value={targetVoice}
                    onChange={(e) => setTargetVoice(e.target.value)}
                    placeholder="e.g., Wendy's Twitter, The Calm App, Elon Musk"
                  />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Shifted Tone</label>
              <div className="h-full rounded-md bg-slate-100 border border-slate-200">
                {loading ? (
                    <div className="h-full flex items-center justify-center">
                        <Loader text="Shifting tone..."/>
                    </div>
                ) : rewrittenText ? (
                    <pre className="text-slate-800 whitespace-pre-wrap font-sans p-4 h-full overflow-y-auto">{rewrittenText}</pre>
                ) : (
                    <div className="h-full flex items-center justify-center border-dashed border-transparent">
                        <p className="text-slate-500">Your rewritten text will appear here.</p>
                    </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <Button type="submit" isLoading={loading} disabled={!paragraph || !targetVoice}>
              Shift Tone
            </Button>
            {rewrittenText && <CopyToClipboardButton textToCopy={rewrittenText} />}
          </div>
          {error && <p className="mt-4 text-red-600">{error}</p>}
        </Card>
      </form>
    </div>
  );
};

export default ToneShifter;