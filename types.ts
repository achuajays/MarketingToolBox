export interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

export interface ArtPromptHistoryItem {
  id: string;
  idea: string;
  prompt: string;
}

export interface CarouselSlide {
  title: string;
  body: string;
}

export interface CarouselData {
  [key: string]: CarouselSlide;
}

export interface RewrittenCaptions {
  funny: string;
  inspiring: string;
  sharp: string;
}

// New local types to decouple from the @google/genai SDK on the frontend
export interface GenerateContentParameters {
  contents: any; // Can be string or a more complex object with parts
  config?: any; // Config object with properties like responseMimeType, responseSchema
}

export interface SimplifiedGenerateContentResponse {
  text: string;
}

export enum SchemaType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  INTEGER = 'INTEGER',
  BOOLEAN = 'BOOLEAN',
  ARRAY = 'ARRAY',
  OBJECT = 'OBJECT',
}