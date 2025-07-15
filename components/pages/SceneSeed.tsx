import React, { useState, useCallback } from 'react';
import { generateContent } from '../../services/geminiService';
import { SchemaType } from '../../types';
import Header from '../layout/Header';
import Card from '../ui/Card';
import Select from '../ui/Select';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Loader from '../ui/Loader';
import CopyToClipboardButton from '../ui/CopyToClipboardButton';
import { safeJsonParse } from '../../utils/json';

interface SceneResult {
  title: string;
  setting: string;
  characters: string;
  conflict: string;
  scene: string;
}

const GENRES = ['Drama', 'Comedy', 'Thriller', 'Horror', 'Romance', 'Sci-Fi', 'Fantasy', 'Mystery'];

const SceneSeed: React.FC = () => {
  const [genre, setGenre] = useState(GENRES[0]);
  const [setting, setSetting] = useState('');
  const [scene, setScene] = useState<SceneResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!setting) return;

    setLoading(true);
    setScene(null);
    setError('');

    const prompt = `Generate a compelling short film scene based on the following genre and setting. Return a JSON object with:
- "title": A catchy scene title
- "setting": Detailed description of the location and atmosphere
- "characters": Brief description of 2-3 main characters in the scene
- "conflict": The central conflict or tension
- "scene": A detailed scene description with dialogue and action (3-4 paragraphs)

Genre: ${genre}
Setting: ${setting}`;

    const responseSchema = {
      type: SchemaType.OBJECT,
      properties: {
        title: { type: SchemaType.STRING },
        setting: { type: SchemaType.STRING },
        characters: { type: SchemaType.STRING },
        conflict: { type: SchemaType.STRING },
        scene: { type: SchemaType.STRING },
      },
      required: ['title', 'setting', 'characters', 'conflict', 'scene']
    };

    try {
      const response = await generateContent({
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema,
        }
      });

      const [parsedData, parseError] = safeJsonParse<SceneResult>(response.text);
      if (parseError) {
        setError(`Failed to parse response from AI. ${parseError.message}`);
        return;
      }
      setScene(parsedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [genre, setting]);

  return (
    <div className="max-w-4xl mx-auto">
      <Header
        title="SceneSeed - Short Film Scene Generator"
        subtitle="Generate compelling scenes with conflict for your short films."
        icon={(
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
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
              <label htmlFor="setting" className="block text-sm font-medium text-slate-600 mb-2">Setting</label>
              <Input
                id="setting"
                value={setting}
                onChange={(e) => setSetting(e.target.value)}
                placeholder="e.g., abandoned subway station, cozy coffee shop"
              />
            </div>
          </div>
          <Button type="submit" isLoading={loading} disabled={!setting}>
            Plant Scene Seed
          </Button>
        </form>
      </Card>

      {loading && <div className="mt-6"><Loader text="Growing scene..." /></div>}
      {error && <Card className="mt-6 border-red-400"><p className="text-red-600">{error}</p></Card>}

      {scene && (
        <div className="mt-8 space-y-6">
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <h3 className="text-lg font-semibold text-purple-600 mb-2">🎬 Scene Title</h3>
            <p className="text-slate-700 text-xl font-bold">{scene.title}</p>
            <div className="mt-4 flex justify-end">
              <CopyToClipboardButton textToCopy={scene.title} />
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">🏗️ Setting</h3>
            <p className="text-slate-700">{scene.setting}</p>
            <div className="mt-4 flex justify-end">
              <CopyToClipboardButton textToCopy={scene.setting} />
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">👥 Characters</h3>
            <p className="text-slate-700">{scene.characters}</p>
            <div className="mt-4 flex justify-end">
              <CopyToClipboardButton textToCopy={scene.characters} />
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">⚡ Conflict</h3>
            <p className="text-slate-700">{scene.conflict}</p>
            <div className="mt-4 flex justify-end">
              <CopyToClipboardButton textToCopy={scene.conflict} />
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">🎭 Scene</h3>
            <div className="bg-slate-100 p-4 rounded-md">
              <pre className="text-slate-700 whitespace-pre-wrap font-sans">{scene.scene}</pre>
            </div>
            <div className="mt-4 flex justify-end">
              <CopyToClipboardButton textToCopy={scene.scene} />
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Complete Scene Package</h3>
            <div className="bg-slate-100 p-4 rounded-md">
              <pre className="text-slate-700 whitespace-pre-wrap font-sans text-sm">
{`TITLE: ${scene.title}
GENRE: ${genre}

SETTING:
${scene.setting}

CHARACTERS:
${scene.characters}

CONFLICT:
${scene.conflict}

SCENE:
${scene.scene}`}
              </pre>
            </div>
            <div className="mt-4 flex justify-end">
              <CopyToClipboardButton textToCopy={`TITLE: ${scene.title}\nGENRE: ${genre}\n\nSETTING:\n${scene.setting}\n\nCHARACTERS:\n${scene.characters}\n\nCONFLICT:\n${scene.conflict}\n\nSCENE:\n${scene.scene}`} />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SceneSeed;