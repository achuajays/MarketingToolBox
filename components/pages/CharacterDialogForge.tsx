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

const CharacterDialogForge: React.FC = () => {
  const [sceneContext, setSceneContext] = useState('');
  const [characterTraits, setCharacterTraits] = useState('');
  const [dialogLines, setDialogLines] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sceneContext || !characterTraits) return;

    setLoading(true);
    setDialogLines([]);
    setError('');

    const prompt = `Write 5 potential lines of dialogue for a character in the given scene. The dialogue must reflect the character's traits. Return a JSON array of strings.\n\nScene Context:\n${sceneContext}\n\nCharacter Traits:\n${characterTraits}`;

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
          console.error("Received text that failed to parse:", response.text);
          return;
      }

      if (Array.isArray(parsedData) && parsedData.every(item => typeof item === 'string')) {
          setDialogLines(parsedData);
      } else {
          setError("AI response was not in the expected format (array of strings).");
          console.error("Unexpected data format:", parsedData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [sceneContext, characterTraits]);

  return (
    <div className="max-w-4xl mx-auto">
      <Header
        title="Character Dialog Forge"
        subtitle="Generate authentic dialogue lines based on character and scene."
        icon={(
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.284-1.255-.778-1.682M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.284-1.255-.778-1.682m0 0A5.03 5.03 0 0112 15a5.03 5.03 0 014.222 1.318M12 12a3 3 0 100-6 3 3 0 000 6z" />
          </svg>
        )}
      />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="scene-context" className="block text-sm font-medium text-slate-600 mb-2">Scene Context</label>
            <TextArea id="scene-context" value={sceneContext} onChange={(e) => setSceneContext(e.target.value)} placeholder="e.g., A tense negotiation in a dimly lit warehouse." rows={3} />
          </div>
          <div>
            <label htmlFor="character-traits" className="block text-sm font-medium text-slate-600 mb-2">Character Traits</label>
            <TextArea id="character-traits" value={characterTraits} onChange={(e) => setCharacterTraits(e.target.value)} placeholder="e.g., Cynical veteran detective, world-weary but with a hidden sense of justice." rows={3} />
          </div>
          <Button type="submit" isLoading={loading} disabled={!sceneContext || !characterTraits}>
            Forge Dialogue
          </Button>
        </form>
      </Card>

      {loading && <div className="mt-6"><Loader text="Writing dialogue..." /></div>}
      {error && <Card className="mt-6 border-red-400"><p className="text-red-600 whitespace-pre-wrap">{error}</p></Card>}

      {dialogLines.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-2">Generated Dialogue Lines</h2>
          <div className="space-y-3">
            {dialogLines.map((line, index) => (
              <Card key={index} className="flex justify-between items-center bg-slate-50">
                <p className="text-slate-700 flex-grow">"{line}"</p>
                <div className="ml-4 flex-shrink-0">
                  <CopyToClipboardButton textToCopy={line} />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterDialogForge;