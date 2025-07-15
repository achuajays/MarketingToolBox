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

interface VoiceProfile {
  tone: string;
  vocabulary: string;
  speechPatterns: string;
  idioms: string[];
  sampleDialogue: string[];
}

const CharacterVoiceGenerator: React.FC = () => {
  const [characterBackground, setCharacterBackground] = useState('');
  const [voiceProfile, setVoiceProfile] = useState<VoiceProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!characterBackground) return;

    setLoading(true);
    setVoiceProfile(null);
    setError('');

    const prompt = `Create a unique dialogue voice profile for a character based on their background. Return a JSON object with:
- "tone": Overall speaking tone and attitude
- "vocabulary": Types of words and language level they use
- "speechPatterns": How they structure sentences and speak
- "idioms": An array of 5 unique phrases or expressions they might use
- "sampleDialogue": An array of 3 example dialogue lines in their voice

Character Background: ${characterBackground}`;

    const responseSchema = {
      type: SchemaType.OBJECT,
      properties: {
        tone: { type: SchemaType.STRING },
        vocabulary: { type: SchemaType.STRING },
        speechPatterns: { type: SchemaType.STRING },
        idioms: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING }
        },
        sampleDialogue: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING }
        },
      },
      required: ['tone', 'vocabulary', 'speechPatterns', 'idioms', 'sampleDialogue']
    };

    try {
      const response = await generateContent({
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema,
        }
      });

      const [parsedData, parseError] = safeJsonParse<VoiceProfile>(response.text);
      if (parseError) {
        setError(`Failed to parse response from AI. ${parseError.message}`);
        return;
      }
      setVoiceProfile(parsedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [characterBackground]);

  return (
    <div className="max-w-4xl mx-auto">
      <Header
        title="Character Voice Generator - Fiction Voice Assistant"
        subtitle="Create unique dialogue tones and speech patterns for your characters."
        icon={(
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      />

      <Card>
        <form onSubmit={handleSubmit}>
          <label htmlFor="character-background" className="block text-sm font-medium text-slate-600 mb-2">Character Background</label>
          <TextArea
            id="character-background"
            value={characterBackground}
            onChange={(e) => setCharacterBackground(e.target.value)}
            placeholder="e.g., A 60-year-old retired sea captain from Maine who now runs a small bookshop. Gruff exterior but secretly loves poetry."
            rows={4}
          />
          <Button type="submit" isLoading={loading} disabled={!characterBackground} className="mt-4">
            Generate Voice Profile
          </Button>
        </form>
      </Card>

      {loading && <div className="mt-6"><Loader text="Creating voice..." /></div>}
      {error && <Card className="mt-6 border-red-400"><p className="text-red-600">{error}</p></Card>}

      {voiceProfile && (
        <div className="mt-8 space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">🎭 Tone</h3>
            <p className="text-slate-700">{voiceProfile.tone}</p>
            <div className="mt-4 flex justify-end">
              <CopyToClipboardButton textToCopy={voiceProfile.tone} />
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">📚 Vocabulary</h3>
            <p className="text-slate-700">{voiceProfile.vocabulary}</p>
            <div className="mt-4 flex justify-end">
              <CopyToClipboardButton textToCopy={voiceProfile.vocabulary} />
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">🗣️ Speech Patterns</h3>
            <p className="text-slate-700">{voiceProfile.speechPatterns}</p>
            <div className="mt-4 flex justify-end">
              <CopyToClipboardButton textToCopy={voiceProfile.speechPatterns} />
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">💬 Signature Idioms & Expressions</h3>
            <div className="space-y-2">
              {voiceProfile.idioms.map((idiom, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                  <span className="text-slate-700 italic">"{idiom}"</span>
                  <CopyToClipboardButton textToCopy={idiom} />
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">🎬 Sample Dialogue</h3>
            <div className="space-y-3">
              {voiceProfile.sampleDialogue.map((dialogue, index) => (
                <div key={index} className="bg-slate-100 p-3 rounded-md">
                  <p className="text-slate-700">"{dialogue}"</p>
                  <div className="mt-2 flex justify-end">
                    <CopyToClipboardButton textToCopy={dialogue} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Complete Voice Profile</h3>
            <div className="bg-slate-100 p-4 rounded-md">
              <pre className="text-slate-700 whitespace-pre-wrap font-sans text-sm">
{`CHARACTER VOICE PROFILE

TONE:
${voiceProfile.tone}

VOCABULARY:
${voiceProfile.vocabulary}

SPEECH PATTERNS:
${voiceProfile.speechPatterns}

SIGNATURE EXPRESSIONS:
${voiceProfile.idioms.map(idiom => `• "${idiom}"`).join('\n')}

SAMPLE DIALOGUE:
${voiceProfile.sampleDialogue.map((dialogue, i) => `${i + 1}. "${dialogue}"`).join('\n')}`}
              </pre>
            </div>
            <div className="mt-4 flex justify-end">
              <CopyToClipboardButton textToCopy={`CHARACTER VOICE PROFILE\n\nTONE:\n${voiceProfile.tone}\n\nVOCABULARY:\n${voiceProfile.vocabulary}\n\nSPEECH PATTERNS:\n${voiceProfile.speechPatterns}\n\nSIGNATURE EXPRESSIONS:\n${voiceProfile.idioms.map(idiom => `• "${idiom}"`).join('\n')}\n\nSAMPLE DIALOGUE:\n${voiceProfile.sampleDialogue.map((dialogue, i) => `${i + 1}. "${dialogue}"`).join('\n')}`} />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CharacterVoiceGenerator;