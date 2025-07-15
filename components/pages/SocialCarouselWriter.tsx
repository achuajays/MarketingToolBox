import React, { useState, useCallback } from 'react';
import { generateContent } from '../../services/geminiService';
import type { CarouselData } from '../../types';
import { SchemaType } from '../../types';
import Header from '../layout/Header';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import Loader from '../ui/Loader';
import CopyToClipboardButton from '../ui/CopyToClipboardButton';

const TONES = ['Professional', 'Casual', 'Witty', 'Inspirational', 'Enthusiastic'];

const SocialCarouselWriter: React.FC = () => {
  const [idea, setIdea] = useState('');
  const [tone, setTone] = useState(TONES[0]);
  const [carouselData, setCarouselData] = useState<CarouselData | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea) return;

    setLoading(true);
    setCarouselData(null);
    setError('');

    const prompt = `Write a 5-slide social media carousel about the following topic. The tone should be ${tone}. The output must be a JSON object with keys "slide1", "slide2", "slide3", "slide4", "slide5". Each key's value should be an object with "title" and "body" properties.\n\nTopic: "${idea}"`;

    const responseSchema = {
      type: SchemaType.OBJECT,
      properties: {
        slide1: { type: SchemaType.OBJECT, properties: { title: { type: SchemaType.STRING }, body: { type: SchemaType.STRING } } },
        slide2: { type: SchemaType.OBJECT, properties: { title: { type: SchemaType.STRING }, body: { type: SchemaType.STRING } } },
        slide3: { type: SchemaType.OBJECT, properties: { title: { type: SchemaType.STRING }, body: { type: SchemaType.STRING } } },
        slide4: { type: SchemaType.OBJECT, properties: { title: { type: SchemaType.STRING }, body: { type: SchemaType.STRING } } },
        slide5: { type: SchemaType.OBJECT, properties: { title: { type: SchemaType.STRING }, body: { type: SchemaType.STRING } } },
      }
    };

    try {
      const response = await generateContent({ 
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema,
        }
       });
      const jsonData = JSON.parse(response.text);
      setCarouselData(jsonData);
      setCurrentSlide(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [idea, tone]);

  const slides = carouselData ? Object.values(carouselData) : [];

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);

  const exportToJson = () => {
    if (!carouselData) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(carouselData, null, 2))}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "carousel_data.json";
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Header
        title="Social Carousel Writer"
        subtitle="Generate engaging 5-slide carousels for your social media channels."
        icon={(
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        )}
      />

      <Card>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="idea" className="block text-sm font-medium text-slate-600 mb-2">Carousel Topic</label>
            <Input
              id="idea"
              type="text"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="e.g., a guide to React hooks"
            />
          </div>
          <div>
            <label htmlFor="tone" className="block text-sm font-medium text-slate-600 mb-2">Tone of Voice</label>
            <Select id="tone" value={tone} onChange={(e) => setTone(e.target.value)}>
              {TONES.map(t => <option key={t} value={t}>{t}</option>)}
            </Select>
          </div>
          <div className="md:col-span-2">
            <Button type="submit" isLoading={loading} disabled={!idea}>
              Generate Carousel
            </Button>
          </div>
        </form>
      </Card>
      
      {loading && <div className="mt-6"><Loader /></div>}
      {error && <Card className="mt-6 border-red-400"><p className="text-red-600">{error}</p></Card>}

      {slides.length > 0 && (
        <div className="mt-8">
            <h2 className="text-lg font-semibold text-slate-800 mb-2">Carousel Preview</h2>
            <div className="relative">
                <Card className="min-h-[250px] flex flex-col justify-center items-center text-center bg-slate-100">
                    <h3 className="text-xl font-bold text-indigo-600 mb-2">{slides[currentSlide].title}</h3>
                    <p className="text-slate-700 whitespace-pre-wrap">{slides[currentSlide].body}</p>
                </Card>
                <button onClick={prevSlide} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 p-2 bg-white border border-slate-300 rounded-full hover:bg-slate-100 transition-colors text-slate-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button onClick={nextSlide} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 p-2 bg-white border border-slate-300 rounded-full hover:bg-slate-100 transition-colors text-slate-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-slate-600 bg-white/60 backdrop-blur-sm px-2 py-1 rounded-full">
                    {currentSlide + 1} / {slides.length}
                </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
                <Button variant="secondary" onClick={exportToJson}>Export as JSON</Button>
                <CopyToClipboardButton textToCopy={JSON.stringify(carouselData, null, 2)} />
            </div>
        </div>
      )}
    </div>
  );
};

export default SocialCarouselWriter;