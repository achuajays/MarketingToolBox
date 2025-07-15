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

interface ContentItem {
  day: number;
  platform: string;
  format: string;
  topic: string;
  description: string;
}

interface ContentCluster {
  niche: string;
  contentItems: ContentItem[];
}

const ContentClusterPlanner: React.FC = () => {
  const [niche, setNiche] = useState('');
  const [cluster, setCluster] = useState<ContentCluster | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!niche) return;

    setLoading(true);
    setCluster(null);
    setError('');

    const prompt = `Create a 30-day content calendar for the following niche/product. Include a mix of platforms (Instagram, YouTube, Twitter, Blog) and formats (posts, stories, videos, threads). Return a JSON object with:
- "niche": The niche/product name
- "contentItems": An array of 30 objects, each with "day" (1-30), "platform", "format", "topic", and "description"

Niche/Product: ${niche}`;

    const responseSchema = {
      type: SchemaType.OBJECT,
      properties: {
        niche: { type: SchemaType.STRING },
        contentItems: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              day: { type: SchemaType.INTEGER },
              platform: { type: SchemaType.STRING },
              format: { type: SchemaType.STRING },
              topic: { type: SchemaType.STRING },
              description: { type: SchemaType.STRING },
            },
            required: ['day', 'platform', 'format', 'topic', 'description']
          }
        },
      },
      required: ['niche', 'contentItems']
    };

    try {
      const response = await generateContent({
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema,
        }
      });

      const [parsedData, parseError] = safeJsonParse<ContentCluster>(response.text);
      if (parseError) {
        setError(`Failed to parse response from AI. ${parseError.message}`);
        return;
      }
      setCluster(parsedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [niche]);

  const exportToCSV = () => {
    if (!cluster) return;
    
    const csvContent = [
      'Day,Platform,Format,Topic,Description',
      ...cluster.contentItems.map(item => 
        `${item.day},"${item.platform}","${item.format}","${item.topic}","${item.description}"`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${cluster.niche}-content-calendar.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getPlatformColor = (platform: string) => {
    const colors: { [key: string]: string } = {
      'Instagram': 'bg-pink-100 text-pink-800',
      'YouTube': 'bg-red-100 text-red-800',
      'Twitter': 'bg-blue-100 text-blue-800',
      'Blog': 'bg-green-100 text-green-800',
      'TikTok': 'bg-purple-100 text-purple-800',
      'LinkedIn': 'bg-indigo-100 text-indigo-800',
    };
    return colors[platform] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Header
        title="Content Cluster Planner"
        subtitle="Generate a comprehensive 30-day content calendar across multiple platforms."
        icon={(
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-1 12a2 2 0 002 2h6a2 2 0 002-2L16 7m-6 0V3a2 2 0 012-2h4a2 2 0 012 2v4" />
          </svg>
        )}
      />

      <Card>
        <form onSubmit={handleSubmit}>
          <label htmlFor="niche" className="block text-sm font-medium text-slate-600 mb-2">Niche or Product</label>
          <Input
            id="niche"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder="e.g., Sustainable fashion brand, Fitness coaching, Tech tutorials"
          />
          <Button type="submit" isLoading={loading} disabled={!niche} className="mt-4">
            Generate Content Calendar
          </Button>
        </form>
      </Card>

      {loading && <div className="mt-6"><Loader text="Planning content..." /></div>}
      {error && <Card className="mt-6 border-red-400"><p className="text-red-600">{error}</p></Card>}

      {cluster && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-slate-800">30-Day Content Calendar for {cluster.niche}</h2>
            <Button variant="secondary" onClick={exportToCSV}>Export to CSV</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cluster.contentItems.map((item) => (
              <Card key={item.day} className="bg-slate-50">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-bold text-slate-500">Day {item.day}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlatformColor(item.platform)}`}>
                    {item.platform}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded">{item.format}</span>
                </div>
                <h4 className="font-semibold text-slate-800 mb-1">{item.topic}</h4>
                <p className="text-sm text-slate-600 mb-3">{item.description}</p>
                <div className="flex justify-end">
                  <CopyToClipboardButton textToCopy={`Day ${item.day}: ${item.topic}\n${item.description}`} />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentClusterPlanner;