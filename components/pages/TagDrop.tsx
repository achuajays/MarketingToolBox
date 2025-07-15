import React, { useState, useCallback } from 'react';
import { generateContent } from '../../services/geminiService';
import { SchemaType } from '../../types';
import Header from '../layout/Header';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import Loader from '../ui/Loader';
import CopyToClipboardButton from '../ui/CopyToClipboardButton';
import { safeJsonParse } from '../../utils/json';

interface MusicMetadata {
  genre: string;
  tags: string[];
  description: string;
  playlistFit: string[];
}

const MOODS = ['Upbeat', 'Melancholic', 'Energetic', 'Chill', 'Romantic', 'Dark', 'Hopeful', 'Nostalgic'];

const TagDrop: React.FC = () => {
  const [songTitle, setSongTitle] = useState('');
  const [mood, setMood] = useState(MOODS[0]);
  const [metadata, setMetadata] = useState<MusicMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!songTitle) return;

    setLoading(true);
    setMetadata(null);
    setError('');

    const prompt = `Generate music metadata for the following song and mood. Return a JSON object with:
- "genre": The most fitting music genre
- "tags": An array of 8-10 relevant tags for music platforms
- "description": A compelling 2-3 sentence description for streaming platforms
- "playlistFit": An array of 5 playlist types this song would fit into

Song: ${songTitle}
Mood: ${mood}`;

    const responseSchema = {
      type: SchemaType.OBJECT,
      properties: {
        genre: { type: SchemaType.STRING },
        tags: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING }
        },
        description: { type: SchemaType.STRING },
        playlistFit: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING }
        },
      },
      required: ['genre', 'tags', 'description', 'playlistFit']
    };

    try {
      const response = await generateContent({
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema,
        }
      });

      const [parsedData, parseError] = safeJsonParse<MusicMetadata>(response.text);
      if (parseError) {
        setError(`Failed to parse response from AI. ${parseError.message}`);
        return;
      }
      setMetadata(parsedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [songTitle, mood]);

  return (
    <div className="max-w-4xl mx-auto">
      <Header
        title="TagDrop - Music Metadata Generator"
        subtitle="Generate genre, tags, descriptions, and playlist suggestions for your music."
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
              <label htmlFor="song-title" className="block text-sm font-medium text-slate-600 mb-2">Song Title</label>
              <Input
                id="song-title"
                value={songTitle}
                onChange={(e) => setSongTitle(e.target.value)}
                placeholder="e.g., Midnight Dreams, Electric Sunset"
              />
            </div>
            <div>
              <label htmlFor="mood" className="block text-sm font-medium text-slate-600 mb-2">Mood</label>
              <Select id="mood" value={mood} onChange={(e) => setMood(e.target.value)}>
                {MOODS.map(m => <option key={m} value={m}>{m}</option>)}
              </Select>
            </div>
          </div>
          <Button type="submit" isLoading={loading} disabled={!songTitle}>
            Generate Metadata
          </Button>
        </form>
      </Card>

      {loading && <div className="mt-6"><Loader text="Generating metadata..." /></div>}
      {error && <Card className="mt-6 border-red-400"><p className="text-red-600">{error}</p></Card>}

      {metadata && (
        <div className="mt-8 space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">Genre</h3>
            <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-medium">
              {metadata.genre}
            </span>
            <div className="mt-4 flex justify-end">
              <CopyToClipboardButton textToCopy={metadata.genre} />
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {metadata.tags.map((tag, index) => (
                <span key={index} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-sm">
                  #{tag}
                </span>
              ))}
            </div>
            <div className="flex justify-end">
              <CopyToClipboardButton textToCopy={metadata.tags.map(tag => `#${tag}`).join(' ')} />
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">Description</h3>
            <p className="text-slate-700">{metadata.description}</p>
            <div className="mt-4 flex justify-end">
              <CopyToClipboardButton textToCopy={metadata.description} />
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">Playlist Fit</h3>
            <div className="space-y-2">
              {metadata.playlistFit.map((playlist, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                  <span className="text-slate-700">🎵 {playlist}</span>
                  <CopyToClipboardButton textToCopy={playlist} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TagDrop;