import React, { useState, useCallback } from 'react';
import { generateContent } from '../../services/geminiService';
import { SchemaType } from '../../types';
import Header from '../layout/Header';
import Card from '../ui/Card';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';
import Loader from '../ui/Loader';
import CopyToClipboardButton from '../ui/CopyToClipboardButton';
import { safeJsonParse } from '../../utils/json';

const CoverBot: React.FC = () => {
  const [content, setContent] = useState('');
  const [thumbnailTexts, setThumbnailTexts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;

    setLoading(true);
    setThumbnailTexts([]);
    setError('');

    const prompt = `Generate 5 YouTube-style thumbnail text headlines for the following video topic or blog post. The headlines should be attention-grabbing, use power words, and be optimized for thumbnails (short, punchy, emotional). Return a JSON array of 5 strings.

Content: ${content}`;

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
        setThumbnailTexts(parsedData);
      } else {
        setError("AI response was not in the expected format (array of strings).");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [content]);

  return (
    <div className="max-w-4xl mx-auto">
      <Header
        title="CoverBot - Thumbnail Headline Generator"
        subtitle="Generate click-worthy thumbnail text for your YouTube videos and blog posts."
        icon={(
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )}
      />

      <Card>
        <form onSubmit={handleSubmit}>
          <label htmlFor="content" className="block text-sm font-medium text-slate-600 mb-2">Video Topic or Blog Post</label>
          <TextArea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="e.g., How to build a successful morning routine that actually works"
            rows={4}
          />
          <Button type="submit" isLoading={loading} disabled={!content} className="mt-4">
            Generate Thumbnail Headlines
          </Button>
        </form>
      </Card>

      {loading && <div className="mt-6"><Loader text="Creating headlines..." /></div>}
      {error && <Card className="mt-6 border-red-400"><p className="text-red-600">{error}</p></Card>}

      {thumbnailTexts.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Generated Thumbnail Headlines</h2>
          <div className="space-y-4">
            {thumbnailTexts.map((text, index) => (
              <Card key={index} className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
                <div className="flex justify-between items-center">
                  <div className="flex-grow">
                    <div className="bg-red-600 text-white px-4 py-8 rounded-lg text-center">
                      <p className="text-xl font-bold uppercase tracking-wide">{text}</p>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <CopyToClipboardButton textToCopy={text} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <Card className="mt-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Thumbnail Design Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-slate-700 mb-1">Text Guidelines:</h4>
                <ul className="text-slate-600 space-y-1">
                  <li>• Use bold, sans-serif fonts</li>
                  <li>• Keep text large and readable</li>
                  <li>• Use contrasting colors</li>
                  <li>• Limit to 6-8 words max</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-700 mb-1">Visual Elements:</h4>
                <ul className="text-slate-600 space-y-1">
                  <li>• Add arrows or circles for emphasis</li>
                  <li>• Use bright, eye-catching colors</li>
                  <li>• Include facial expressions</li>
                  <li>• Create visual hierarchy</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CoverBot;