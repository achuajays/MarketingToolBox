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

interface NewsletterSections {
  headline: string;
  intro: string;
  quote: string;
  toolRecommendation: string;
  meme: string;
}

const NewsletterChef: React.FC = () => {
  const [theme, setTheme] = useState('');
  const [sections, setSections] = useState<NewsletterSections | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!theme) return;

    setLoading(true);
    setSections(null);
    setError('');

    const prompt = `Create newsletter sections for the following weekly theme. Return a JSON object with:
- "headline": A catchy newsletter headline
- "intro": A warm, engaging introduction paragraph
- "quote": An inspiring or relevant quote with attribution
- "toolRecommendation": A tool/resource recommendation with brief description
- "meme": A description of a relevant meme or funny observation

Weekly Theme: ${theme}`;

    const responseSchema = {
      type: SchemaType.OBJECT,
      properties: {
        headline: { type: SchemaType.STRING },
        intro: { type: SchemaType.STRING },
        quote: { type: SchemaType.STRING },
        toolRecommendation: { type: SchemaType.STRING },
        meme: { type: SchemaType.STRING },
      },
      required: ['headline', 'intro', 'quote', 'toolRecommendation', 'meme']
    };

    try {
      const response = await generateContent({
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema,
        }
      });

      const [parsedData, parseError] = safeJsonParse<NewsletterSections>(response.text);
      if (parseError) {
        setError(`Failed to parse response from AI. ${parseError.message}`);
        return;
      }
      setSections(parsedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [theme]);

  return (
    <div className="max-w-4xl mx-auto">
      <Header
        title="Newsletter Chef - Newsletter Section Composer"
        subtitle="Generate complete newsletter sections from headlines to memes."
        icon={(
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        )}
      />

      <Card>
        <form onSubmit={handleSubmit}>
          <label htmlFor="theme" className="block text-sm font-medium text-slate-600 mb-2">Weekly Theme</label>
          <Input
            id="theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="e.g., Productivity hacks for remote workers, AI tools for creators"
          />
          <Button type="submit" isLoading={loading} disabled={!theme} className="mt-4">
            Cook Newsletter
          </Button>
        </form>
      </Card>

      {loading && <div className="mt-6"><Loader text="Cooking newsletter..." /></div>}
      {error && <Card className="mt-6 border-red-400"><p className="text-red-600">{error}</p></Card>}

      {sections && (
        <div className="mt-8 space-y-6">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">📰 Headline</h3>
            <p className="text-slate-700 text-xl font-bold">{sections.headline}</p>
            <div className="mt-4 flex justify-end">
              <CopyToClipboardButton textToCopy={sections.headline} />
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <h3 className="text-lg font-semibold text-green-600 mb-2">👋 Introduction</h3>
            <p className="text-slate-700">{sections.intro}</p>
            <div className="mt-4 flex justify-end">
              <CopyToClipboardButton textToCopy={sections.intro} />
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <h3 className="text-lg font-semibold text-purple-600 mb-2">💭 Quote of the Week</h3>
            <blockquote className="text-slate-700 italic border-l-4 border-purple-300 pl-4">
              {sections.quote}
            </blockquote>
            <div className="mt-4 flex justify-end">
              <CopyToClipboardButton textToCopy={sections.quote} />
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
            <h3 className="text-lg font-semibold text-orange-600 mb-2">🛠️ Tool Recommendation</h3>
            <p className="text-slate-700">{sections.toolRecommendation}</p>
            <div className="mt-4 flex justify-end">
              <CopyToClipboardButton textToCopy={sections.toolRecommendation} />
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <h3 className="text-lg font-semibold text-yellow-600 mb-2">😂 Meme Corner</h3>
            <p className="text-slate-700">{sections.meme}</p>
            <div className="mt-4 flex justify-end">
              <CopyToClipboardButton textToCopy={sections.meme} />
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Complete Newsletter Template</h3>
            <div className="bg-slate-100 p-4 rounded-md">
              <pre className="text-slate-700 whitespace-pre-wrap font-sans text-sm">
{`${sections.headline}

${sections.intro}

💭 Quote of the Week:
${sections.quote}

🛠️ Tool Recommendation:
${sections.toolRecommendation}

😂 Meme Corner:
${sections.meme}`}
              </pre>
            </div>
            <div className="mt-4 flex justify-end">
              <CopyToClipboardButton textToCopy={`${sections.headline}\n\n${sections.intro}\n\n💭 Quote of the Week:\n${sections.quote}\n\n🛠️ Tool Recommendation:\n${sections.toolRecommendation}\n\n😂 Meme Corner:\n${sections.meme}`} />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default NewsletterChef;