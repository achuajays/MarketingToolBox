
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './components/pages/Dashboard';
import ArtPromptBuilder from './components/pages/ArtPromptBuilder';
import SocialCarouselWriter from './components/pages/SocialCarouselWriter';
import CaptionRewriter from './components/pages/CaptionRewriter';
import LyricsFormatter from './components/pages/LyricsFormatter';
import BlogPostToThread from './components/pages/BlogPostToThread';
import ScriptPolish from './components/pages/ScriptPolish';
import HookLine from './components/pages/HookLine';
import PlotWeaver from './components/pages/PlotWeaver';
import VoiceToneStylist from './components/pages/VoiceToneStylist';
import ClipCutter from './components/pages/ClipCutter';
import MoodboardPromptAssistant from './components/pages/MoodboardPromptAssistant';
import ThreadBoiler from './components/pages/ThreadBoiler';
import ChorusBuilder from './components/pages/ChorusBuilder';
import ToneShifter from './components/pages/ToneShifter';
import ProductDescriptionStylist from './components/pages/ProductDescriptionStylist';
import CharacterDialogForge from './components/pages/CharacterDialogForge';
import QuoteRecast from './components/pages/QuoteRecast';
import PodcastTitleGenerator from './components/pages/PodcastTitleGenerator';
import ContentClusterPlanner from './components/pages/ContentClusterPlanner';
import ReelHooks from './components/pages/ReelHooks';
import PenName from './components/pages/PenName';
import MicCheck from './components/pages/MicCheck';
import PromptBooster from './components/pages/PromptBooster';
import CoverBot from './components/pages/CoverBot';
import TagDrop from './components/pages/TagDrop';
import NewsletterChef from './components/pages/NewsletterChef';
import SloganStitcher from './components/pages/SloganStitcher';
import SceneSeed from './components/pages/SceneSeed';
import CharacterVoiceGenerator from './components/pages/CharacterVoiceGenerator';
import { Analytics } from "@vercel/analytics/react";


const App: React.FC = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/art-prompt-builder" element={<ArtPromptBuilder />} />
        <Route path="/social-carousel-writer" element={<SocialCarouselWriter />} />
        <Route path="/caption-rewriter" element={<CaptionRewriter />} />
        <Route path="/lyrics-formatter" element={<LyricsFormatter />} />
        <Route path="/blog-post-to-thread" element={<BlogPostToThread />} />
        <Route path="/script-polish" element={<ScriptPolish />} />
        <Route path="/hookline-optimizer" element={<HookLine />} />
        <Route path="/plot-weaver" element={<PlotWeaver />} />
        <Route path="/voicetone-stylist" element={<VoiceToneStylist />} />
        <Route path="/clip-cutter" element={<ClipCutter />} />
        <Route path="/moodboard-prompt-assistant" element={<MoodboardPromptAssistant />} />
        <Route path="/thread-boiler" element={<ThreadBoiler />} />
        <Route path="/chorus-builder" element={<ChorusBuilder />} />
        <Route path="/tone-shifter" element={<ToneShifter />} />
        <Route path="/product-description-stylist" element={<ProductDescriptionStylist />} />
        <Route path="/character-dialog-forge" element={<CharacterDialogForge />} />
        <Route path="/quote-recast" element={<QuoteRecast />} />
        <Route path="/podcast-title-generator" element={<PodcastTitleGenerator />} />
        <Route path="/content-cluster-planner" element={<ContentClusterPlanner />} />
        <Route path="/reel-hooks" element={<ReelHooks />} />
        <Route path="/pen-name" element={<PenName />} />
        <Route path="/mic-check" element={<MicCheck />} />
        <Route path="/prompt-booster" element={<PromptBooster />} />
        <Route path="/cover-bot" element={<CoverBot />} />
        <Route path="/tag-drop" element={<TagDrop />} />
        <Route path="/newsletter-chef" element={<NewsletterChef />} />
        <Route path="/slogan-stitcher" element={<SloganStitcher />} />
        <Route path="/scene-seed" element={<SceneSeed />} />
        <Route path="/character-voice-generator" element={<CharacterVoiceGenerator />} />
      </Routes>
      </Analytics>
    </MainLayout>
  );
};

export default App;
