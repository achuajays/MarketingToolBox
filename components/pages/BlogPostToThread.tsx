import React, { useState, useCallback } from 'react';
import { generateContent } from '../../services/geminiService';
import { SchemaType } from '../../types';
import Header from '../layout/Header';
import Card from '../ui/Card';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';
import Loader from '../ui/Loader';
import CopyToClipboardButton from '../ui/CopyToClipboardButton';

export default function BlogPostToThread() {
  const [inputContent, setInputContent] = useState('');
  const [thread, setThread] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent) return;

    setLoading(true);
    setThread([]);
    setError('');

    const prompt = `Turn the following blog post content (which could be a URL or pasted text) into a concise and engaging 8-10 tweet Twitter thread. Each tweet should be a string in a JSON array. Start with a strong hook and end with a concluding tweet. Use emojis appropriately. \n\nContent:\n\n${inputContent}`;
    
    const responseSchema = {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING }
    };

    let responseText = '';
    try {
      const response = await generateContent({ 
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema,
        }
      });
      responseText = response.text;
      
      let jsonText = responseText.trim();
      // Handle cases where the API wraps the JSON in markdown
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.slice(7, -3).trim();
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.slice(3, -3).trim();
      }

      const jsonData = JSON.parse(jsonText);
      if (Array.isArray(jsonData)) {
        setThread(jsonData);
      } else {
        throw new Error("API did not return a valid JSON array.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Failed to parse thread. ${errorMessage}\nReceived: "${responseText}"`);
      setThread([]);
    } finally {
      setLoading(false);
    }
  }, [inputContent]);

  const copyAll = () => {
    const threadText = thread.map((tweet, index) => `${index + 1}/${thread.length}\n${tweet}`).join('\n\n');
    navigator.clipboard.writeText(threadText);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Header
        title="Blog Post to Thread"
        subtitle="Convert any article or text into a viral Twitter thread in seconds."
        icon={(
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        )}
      />

      <Card>
        <form onSubmit={handleSubmit}>
          <label htmlFor="blog-content" className="block text-sm font-medium text-slate-600 mb-2">Blog Post URL or Text</label>
          <TextArea
            id="blog-content"
            value={inputContent}
            onChange={(e) => setInputContent(e.target.value)}
            placeholder="Paste a URL or the full text of your blog post here..."
            rows={8}
          />
          <Button type="submit" isLoading={loading} disabled={!inputContent} className="mt-4">
            Generate Thread
          </Button>
        </form>
      </Card>

      {loading && <div className="mt-6"><Loader text="Threading..."/></div>}
      {error && <Card className="mt-6 border-red-400"><p className="text-red-600 whitespace-pre-wrap">{error}</p></Card>}

      {thread.length > 0 && (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-slate-800">Generated Thread ({thread.length} Tweets)</h2>
              <Button variant="secondary" onClick={copyAll}>Copy All Tweets</Button>
            </div>
            <div className="space-y-4">
                {thread.map((tweet, index) => (
                    <Card key={index} className="bg-slate-50">
                        <div className="flex gap-4 items-start">
                            <div className="flex-shrink-0 text-sm font-bold text-slate-400 pt-1">{index + 1}</div>
                            <p className="flex-grow text-slate-700 whitespace-pre-wrap">{tweet}</p>
                            <div className="flex-shrink-0">
                                <CopyToClipboardButton textToCopy={tweet} />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
      )}
    </div>
  );
}