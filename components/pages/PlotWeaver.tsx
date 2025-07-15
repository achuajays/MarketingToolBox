import React, { useState, useCallback } from 'react';
import { generateContent } from '../../services/geminiService';
import { SchemaType } from '../../types';
import Header from '../layout/Header';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Loader from '../ui/Loader';
import { safeJsonParse } from '../../utils/json';
import Select from '../ui/Select';

interface Character {
    archetype: string;
    description: string;
}

interface PlotData {
    conflictArc: string;
    characters: Character[];
    setting: string;
}

const GENRES = ['Sci-Fi', 'Fantasy', 'Mystery', 'Thriller', 'Romance', 'Horror'];

const PlotWeaver: React.FC = () => {
  const [genre, setGenre] = useState(GENRES[0]);
  const [theme, setTheme] = useState('');
  const [plotData, setPlotData] = useState<PlotData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!theme) return;

    setLoading(true);
    setPlotData(null);
    setError('');

    const prompt = `Generate a basic fiction plot outline for a story.
- Genre: ${genre}
- Theme: ${theme}

Provide a main conflict arc, three key character archetypes with brief descriptions, and a compelling setting description. Return a JSON object with keys: "conflictArc" (string), "characters" (an array of objects with "archetype" and "description" strings), and "setting" (string).`;
    
    const responseSchema = {
        type: SchemaType.OBJECT,
        properties: {
            conflictArc: { type: SchemaType.STRING },
            characters: {
                type: SchemaType.ARRAY,
                items: {
                    type: SchemaType.OBJECT,
                    properties: {
                        archetype: { type: SchemaType.STRING },
                        description: { type: SchemaType.STRING },
                    },
                    required: ['archetype', 'description']
                }
            },
            setting: { type: SchemaType.STRING },
        },
        required: ['conflictArc', 'characters', 'setting']
    };

    try {
      const response = await generateContent({
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema,
        }
      });
      const [parsedData, parseError] = safeJsonParse<PlotData>(response.text);
      if (parseError) {
          setError(`Failed to parse response from AI. ${parseError.message}`);
          return;
      }
      setPlotData(parsedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [genre, theme]);

  return (
    <div className="max-w-4xl mx-auto">
      <Header
        title="PlotWeaver"
        subtitle="Generate a complete story outline from a genre and theme."
        icon={(
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        )}
      />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-slate-600 mb-2">Genre</label>
              <Select id="genre" value={genre} onChange={(e) => setGenre(e.target.value)}>
                {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
              </Select>
            </div>
            <div>
              <label htmlFor="theme" className="block text-sm font-medium text-slate-600 mb-2">Theme</label>
              <Input id="theme" type="text" value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="e.g., Redemption, Betrayal, Found Family" />
            </div>
          </div>
          <Button type="submit" isLoading={loading} disabled={!theme}>
            Weave Plot
          </Button>
        </form>
      </Card>

      {loading && <div className="mt-6"><Loader text="Weaving your plot..." /></div>}
      {error && <Card className="mt-6 border-red-400"><p className="text-red-600">{error}</p></Card>}

      {plotData && (
        <div className="mt-8 space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">Conflict Arc</h3>
            <p className="text-slate-700 whitespace-pre-wrap">{plotData.conflictArc}</p>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">Characters</h3>
            <div className="space-y-3">
              {plotData.characters.map((char, index) => (
                <div key={index} className="p-3 bg-slate-100 rounded-md border border-slate-200">
                  <h4 className="font-semibold text-slate-800">{char.archetype}</h4>
                  <p className="text-slate-600 text-sm">{char.description}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">Setting</h3>
            <p className="text-slate-700 whitespace-pre-wrap">{plotData.setting}</p>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PlotWeaver;