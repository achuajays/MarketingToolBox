import React, { useState, useCallback } from 'react';
import { generateContent } from '../../services/geminiService';
import { SchemaType } from '../../types';
import Header from '../layout/Header';
import Card from '../ui/Card';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';
import Loader from '../ui/Loader';
import CopyToClipboardButton from '../ui/CopyToClipboardButton';
import { safeJsonParse } from '../../utils/json';
import Select from '../ui/Select';

interface ChorusResult {
  hook: string;
  chorus: string;
}

const GENRES = ['Pop', 'Rock', 'Hip-Hop', 'Electronic', 'Folk', 'R&B'];
const MOODS = ['Uplifting', 'Melancholic', 'Energetic', 'Romantic', 'Aggressive'];

const ChorusBuilder: React.FC = () => {
  const [genre, setGenre] = useState(GENRES[0]);
  const [mood, setMood] = useState(MOODS[0]);
  const [theme, setTheme] = useState('');
  const [result, setResult] = useState<ChorusResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!theme) return;

    setLoading(true);
    setResult(null);
    setError('');

    const prompt = `Generate a catchy chorus and a hook for a song.\n- Genre: ${genre}\n- Mood: ${mood}\n- Theme: ${theme}\n\nReturn a JSON object with keys "hook" (a short, memorable phrase or line) and "chorus" (a 4-line chorus with a clear and effective rhyme pattern like AABB or ABAB).`;
    
    const responseSchema = {
        type: SchemaType.OBJECT,
        properties: {
            hook: { type: SchemaType.STRING, description: 'A short, memorable phrase or line.' },
            chorus: { type: SchemaType.STRING, description: 'A 4-line chorus with a rhyme pattern.' },
        },
        required: ['hook', 'chorus']
    };

    try {
      const response = await generateContent({
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema,
        }
      });

      const [parsedData, parseError] = safeJsonParse<ChorusResult>(response.text);
      if (parseError) {
          setError(`Failed to parse response from AI. ${parseError.message}`);
          return;
      }
      setResult(parsedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [genre, mood, theme]);

  return (
    <div className="max-w-4xl mx-auto">
      <Header
        title="ChorusBuilder"
        subtitle="Generate hooks and choruses to kickstart your songwriting."
        icon={(
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-12v10c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
          </svg>
        )}
      />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-slate-600 mb-2">Genre</label>
              <Select id="genre" value={genre} onChange={e => setGenre(e.target.value)}>
                {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
              </Select>
            </div>
            <div>
              <label htmlFor="mood" className="block text-sm font-medium text-slate-600 mb-2">Mood</label>
              <Select id="mood" value={mood} onChange={e => setMood(e.target.value)}>
                {MOODS.map(m => <option key={m} value={m}>{m}</option>)}
              </Select>
            </div>
          </div>
          <div>
            <label htmlFor="theme" className="block text-sm font-medium text-slate-600 mb-2">Theme / Idea</label>
            <TextArea id="theme" value={theme} onChange={e => setTheme(e.target.value)} placeholder="e.g., overcoming adversity, a summer romance, finding yourself" rows={3} />
          </div>
          <Button type="submit" isLoading={loading} disabled={!theme}>
            Build Chorus
          </Button>
        </form>
      </Card>

      {loading && <div className="mt-6"><Loader text="Writing music..." /></div>}
      {error && <Card className="mt-6 border-red-400"><p className="text-red-600">{error}</p></Card>}

      {result && (
        <div className="mt-8 space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">Generated Hook</h3>
            <p className="text-slate-700 whitespace-pre-wrap">{result.hook}</p>
            <div className="mt-4 flex justify-end">
              <CopyToClipboardButton textToCopy={result.hook} />
            </div>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">Generated Chorus</h3>
            <pre className="text-slate-700 whitespace-pre-wrap font-sans">{result.chorus}</pre>
            <div className="mt-4 flex justify-end">
              <CopyToClipboardButton textToCopy={result.chorus} />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ChorusBuilder;