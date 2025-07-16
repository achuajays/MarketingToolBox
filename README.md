# Run and deploy your AI Studio app

MarketingToolBox is a comprehensive AI-powered content creation suite with 30+ specialized tools for marketers, creators, and content professionals.

## Features

- **Art & Design**: Art Prompt Builder, Moodboard Assistant, Cover Bot
- **Social Media**: Carousel Writer, Caption Rewriter, Thread Boiler, Reel Hooks
- **Writing & Content**: Blog to Thread, Script Polish, Lyrics Formatter, Newsletter Chef
- **Character & Voice**: Character Dialog Forge, Voice Generator, Tone Shifter
- **Marketing**: Product Descriptions, Slogan Stitcher, Tag Drop
- **Audio & Video**: Podcast Tools, Mic Check, Clip Cutter
- **And many more specialized tools!**

## Run Locally

**Prerequisites:** Node.js 16+ and npm

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure your environment by creating a `.env.local` file:
   ```env
   # Option 1: Supabase (Recommended for production)
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Option 2: Direct Gemini API (Development only)
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```
   
   **Important:** Make sure your Supabase URL starts with `https://` and ends with `.supabase.co`

3. Run the app:
   ```bash
   npm run dev
   ```

## Deployment

### Using Supabase (Recommended)

1. Set up Supabase project
2. Deploy the edge function in `supabase/functions/gemini/`
3. Configure environment variables
4. Deploy to your preferred hosting platform

### Environment Variables

```env
# Supabase Configuration (Recommended)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Direct API (Development only)
VITE_GEMINI_API_KEY=your_gemini_api_key
```

## Architecture

- **Frontend**: React 19 with TypeScript
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **API**: Supabase Edge Functions (recommended) or direct Gemini API
- **State**: React hooks with localStorage for persistence

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.