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

interface ProductDescriptions {
  seoFriendly: string;
  casual: string;
  storytelling: string;
}

type DescriptionStyle = keyof ProductDescriptions;

const ProductDescriptionStylist: React.FC = () => {
  const [details, setDetails] = useState('');
  const [descriptions, setDescriptions] = useState<ProductDescriptions | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<DescriptionStyle>('seoFriendly');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details) return;

    setLoading(true);
    setDescriptions(null);
    setError('');

    const prompt = `Write 3 versions of a product description based on the details provided. The output must be a JSON object with keys: "seoFriendly" (includes keywords, detailed specs, focuses on benefits), "casual" (uses a friendly, conversational, and relatable tone), and "storytelling" (weaves a narrative around the product, its creation, or its ideal user).\n\nProduct Details:\n\n${details}`;

    const responseSchema = {
        type: SchemaType.OBJECT,
        properties: {
            seoFriendly: { type: SchemaType.STRING },
            casual: { type: SchemaType.STRING },
            storytelling: { type: SchemaType.STRING },
        },
        required: ['seoFriendly', 'casual', 'storytelling']
    };
    
    try {
      const response = await generateContent({ 
          contents: prompt,
          config: {
              responseMimeType: "application/json",
              responseSchema
          }
      });
      const [parsedData, parseError] = safeJsonParse<ProductDescriptions>(response.text);
       if (parseError) {
          setError(`Failed to parse response from AI. ${parseError.message}`);
          return;
      }
      setDescriptions(parsedData);
      setActiveTab('seoFriendly');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [details]);

  const tabs: { id: DescriptionStyle; label: string }[] = [
    { id: 'seoFriendly', label: '📊 SEO-Friendly' },
    { id: 'casual', label: '👋 Casual' },
    { id: 'storytelling', label: '📖 Storytelling' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <Header
        title="Product Description Stylist"
        subtitle="Generate SEO, casual, and storytelling copy for your products."
        icon={(
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2zM14 14h.01M14 10h5a2 2 0 012 2v5a2 2 0 01-2 2h-5a2 2 0 01-2-2v-5a2 2 0 012-2z" />
          </svg>
        )}
      />

      <Card>
        <form onSubmit={handleSubmit}>
          <label htmlFor="product-details" className="block text-sm font-medium text-slate-600 mb-2">Product Details</label>
          <TextArea
            id="product-details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="e.g., Hand-poured soy wax candle, lavender scent, 8oz, amber glass jar, cotton wick, 40-hour burn time."
            rows={6}
          />
          <Button type="submit" isLoading={loading} disabled={!details} className="mt-4">
            Generate Descriptions
          </Button>
        </form>
      </Card>
      
      {loading && <div className="mt-6"><Loader text="Writing copy..."/></div>}
      {error && <Card className="mt-6 border-red-400"><p className="text-red-600">{error}</p></Card>}

      {descriptions && (
        <div className="mt-8">
            <h2 className="text-lg font-semibold text-slate-800 mb-2">Generated Descriptions</h2>
            <Card>
                <div className="border-b border-slate-200">
                    <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`${
                                    activeTab === tab.id
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
                            >
                            {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="py-4">
                    <p className="text-slate-700 whitespace-pre-wrap min-h-[100px]">{descriptions[activeTab]}</p>
                    <div className="mt-4 flex justify-end">
                        <CopyToClipboardButton textToCopy={descriptions[activeTab]} />
                    </div>
                </div>
            </Card>
        </div>
      )}
    </div>
  );
};

export default ProductDescriptionStylist;