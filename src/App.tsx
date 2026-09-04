import React, { useState } from 'react';
import { Header } from './components/Header';
import { Step1MediaUpload } from './components/Step1MediaUpload';
import { Step2AudioSelect } from './components/Step2AudioSelect';
import { Step3BusinessType } from './components/Step3BusinessType';
import { Step4BaseText } from './components/Step4BaseText';
import { Step5AIOptimizer } from './components/Step5AIOptimizer';
import { Step6VoiceSelect } from './components/Step6VoiceSelect';
import { Step7TemplatesAndEffects } from './components/Step7TemplatesAndEffects';
import { LiveAdPreviewPlayer } from './components/LiveAdPreviewPlayer';
import { Step8ScheduleAndPublish } from './components/Step8ScheduleAndPublish';
import { MarketingAcademyModal } from './components/MarketingAcademyModal';

import {
  MediaItem,
  AudioTrack,
  BusinessCategory,
  AIVoice,
  AnimatedTemplate,
  AIOptimizationResult,
  AvatarDisplayMode,
  AdDisplaySettings
} from './types';
import {
  BUSINESS_CATEGORIES,
  SAMPLE_DEFAULT_MEDIA,
  ROYALTY_FREE_TRACKS,
  AI_VOICES,
  ANIMATED_TEMPLATES
} from './data/mockTemplatesAndData';
import { Sparkles, ArrowDown, GraduationCap, CheckCircle2 } from 'lucide-react';

export default function App() {
  // State 1: Media items (photos / videos)
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(SAMPLE_DEFAULT_MEDIA);

  // State 2: Audio track & volume
  const [selectedTrack, setSelectedTrack] = useState<AudioTrack | null>(ROYALTY_FREE_TRACKS[0]);
  const [musicVolume, setMusicVolume] = useState<number>(0.30);

  // State 3: Business Category & custom business name
  const [selectedCategory, setSelectedCategory] = useState<BusinessCategory>(BUSINESS_CATEGORIES[0]); // General / Negocio Local
  const [customBusinessName, setCustomBusinessName] = useState<string>('');

  // State 4: Base Text & Goal
  const [baseText, setBaseText] = useState<string>('');
  const [advertisingGoal, setAdvertisingGoal] = useState<string>('ventas');

  // State 5: AI Optimization Result (starts null for clean slate)
  const [aiResult, setAiResult] = useState<AIOptimizationResult | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // State 6: Voice & Avatar Selection
  const [selectedVoice, setSelectedVoice] = useState<AIVoice>(AI_VOICES[0]); // Valentina
  const [enableVoiceover, setEnableVoiceover] = useState<boolean>(true);
  const [avatarDisplayMode, setAvatarDisplayMode] = useState<AvatarDisplayMode>('circle-pip');

  // State 7: Animated template & visual effects
  const [selectedTemplate, setSelectedTemplate] = useState<AnimatedTemplate>(ANIMATED_TEMPLATES[0]); // Ken Burns
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '1:1' | '16:9'>('9:16');
  const [promoBadgeText, setPromoBadgeText] = useState<string>('🔥 OFERTA ESPECIAL');
  const [brandColor, setBrandColor] = useState<string>('#e11d48');

  // State 8: Image Fit Mode & Overlay Display Controls
  const [displaySettings, setDisplaySettings] = useState<AdDisplaySettings>({
    imageFitMode: 'contain',
    showOverlayTexts: true,
    showPromoBadge: true,
    showHeadlineBox: true,
    showCtaButton: true
  });

  // Education Modal
  const [isAcademyOpen, setIsAcademyOpen] = useState<boolean>(false);

  // Handlers for Step 1
  const handleAddMedia = (newItems: MediaItem[]) => {
    setMediaItems((prev) => [...prev, ...newItems]);
  };
  const handleRemoveMedia = (id: string) => {
    setMediaItems((prev) => prev.filter((item) => item.id !== id));
  };
  const handleUseSampleMedia = () => {
    setMediaItems(SAMPLE_DEFAULT_MEDIA);
  };
  const handleClearAllMedia = () => {
    setMediaItems([]);
  };

  // Reset all state for a brand new clean ad project
  const handleResetCleanAd = () => {
    setMediaItems([]);
    setBaseText('');
    setAiResult(null);
    setCustomBusinessName('');
    setPromoBadgeText('🔥 OFERTA ESPECIAL');
    setSelectedCategory(BUSINESS_CATEGORIES[0]);
    setSelectedTrack(ROYALTY_FREE_TRACKS[0]);
    setDisplaySettings({
      imageFitMode: 'contain',
      showOverlayTexts: true,
      showPromoBadge: true,
      showHeadlineBox: true,
      showCtaButton: true
    });
    scrollToSection('step-1-media');
  };

  // Handlers for Step 5 (Gemini AI API)
  const handleGenerateAI = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/optimize-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessType: selectedCategory.name,
          customBusiness: customBusinessName,
          baseText: baseText || `Promoción y servicios de ${customBusinessName || selectedCategory.name}`,
          goal: advertisingGoal,
          tone: selectedCategory.recommendedTone
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAiResult(data);
      } else {
        console.error('Error al generar copy con IA');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-rose-500 selection:text-white">
      {/* Header */}
      <Header
        onOpenAcademy={() => setIsAcademyOpen(true)}
        onScrollToSchedule={() => scrollToSection('step-8-schedule')}
        onScrollToPreview={() => scrollToSection('ad-live-preview')}
        onStartCleanAd={handleResetCleanAd}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* Intro banner */}
        <div className="rounded-2xl bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-slate-900 border border-rose-500/20 p-5 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="bg-rose-500/20 text-rose-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-rose-500/30 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Estudio Publicitario Móvil Profesional
                </span>
                <span className="text-xs text-slate-400">Paso a paso guiado</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-['Outfit',sans-serif]">
                Convierte tus fotos del celular en anuncios cinematográficos para redes
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
                Sigue cada paso ordenado verticalmente: sube tus fotos o videos, añade música, escoge cualquier tipo de negocio (¡o personaliza el tuyo con <strong>OTRO TIPO DE NEGOCIO</strong>!), optimiza el texto con IA, elige una voz hiper-realista y programa tus publicaciones.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAcademyOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-950/50 flex items-center justify-center gap-2 transition cursor-pointer shrink-0"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Ver Consejos de Diseño & Marketing</span>
            </button>
          </div>
        </div>

        {/* STEP 1: Subir fotos o videos */}
        <Step1MediaUpload
          mediaItems={mediaItems}
          onAddMedia={handleAddMedia}
          onRemoveMedia={handleRemoveMedia}
          onUseSampleMedia={handleUseSampleMedia}
          onClearAllMedia={handleClearAllMedia}
        />

        {/* Vertical Step Connector Indicator */}
        <div className="flex justify-center -my-2">
          <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 shadow-sm">
            <ArrowDown className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* STEP 2: Subir música */}
        <Step2AudioSelect
          selectedTrack={selectedTrack}
          onSelectTrack={setSelectedTrack}
          musicVolume={musicVolume}
          onChangeVolume={setMusicVolume}
        />

        <div className="flex justify-center -my-2">
          <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 shadow-sm">
            <ArrowDown className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* STEP 3: Escoger tipo de negocio */}
        <Step3BusinessType
          selectedCategory={selectedCategory}
          customBusinessName={customBusinessName}
          onSelectCategory={setSelectedCategory}
          onChangeCustomName={setCustomBusinessName}
        />

        <div className="flex justify-center -my-2">
          <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 shadow-sm">
            <ArrowDown className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* STEP 4: Escribir texto base */}
        <Step4BaseText
          baseText={baseText}
          onChangeBaseText={setBaseText}
          selectedCategory={selectedCategory}
          customBusinessName={customBusinessName}
          advertisingGoal={advertisingGoal}
          onChangeGoal={setAdvertisingGoal}
          onOptimizeWithAI={handleGenerateAI}
          isAiLoading={isAiLoading}
        />

        <div className="flex justify-center -my-2">
          <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 shadow-sm">
            <ArrowDown className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* STEP 5: Que la IA complemente dicho texto */}
        <Step5AIOptimizer
          baseText={baseText}
          selectedCategory={selectedCategory}
          customBusinessName={customBusinessName}
          advertisingGoal={advertisingGoal}
          aiResult={aiResult}
          onApplyResult={setAiResult}
          isLoading={isAiLoading}
          onGenerate={handleGenerateAI}
        />

        <div className="flex justify-center -my-2">
          <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 shadow-sm">
            <ArrowDown className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* STEP 6: Escoger voz profesional de IA y estilo Avatar */}
        <Step6VoiceSelect
          selectedVoice={selectedVoice}
          onSelectVoice={setSelectedVoice}
          enableVoiceover={enableVoiceover}
          onToggleVoiceover={setEnableVoiceover}
          avatarDisplayMode={avatarDisplayMode}
          onSelectAvatarDisplayMode={setAvatarDisplayMode}
          aiResult={aiResult}
          baseText={baseText}
        />

        <div className="flex justify-center -my-2">
          <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 shadow-sm">
            <ArrowDown className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* STEP 7: Plantillas animadas y transiciones cinematográficas */}
        <Step7TemplatesAndEffects
          selectedTemplate={selectedTemplate}
          onSelectTemplate={setSelectedTemplate}
          aspectRatio={aspectRatio}
          onChangeAspectRatio={setAspectRatio}
          promoBadgeText={promoBadgeText}
          onChangePromoBadgeText={setPromoBadgeText}
          brandColor={brandColor}
          onChangeBrandColor={setBrandColor}
        />

        <div className="flex justify-center -my-2">
          <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 shadow-sm">
            <ArrowDown className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* REPRODUCTOR EN VIVO (Las fotos toman vida con movimiento, música y voz) */}
        <LiveAdPreviewPlayer
          mediaItems={mediaItems}
          selectedTrack={selectedTrack}
          selectedVoice={selectedVoice}
          enableVoiceover={enableVoiceover}
          avatarDisplayMode={avatarDisplayMode}
          selectedTemplate={selectedTemplate}
          aspectRatio={aspectRatio}
          promoBadgeText={promoBadgeText}
          brandColor={brandColor}
          aiResult={aiResult}
          baseText={baseText}
          selectedCategory={selectedCategory}
          customBusinessName={customBusinessName}
          musicVolume={musicVolume}
          displaySettings={displaySettings}
          onUpdateDisplaySettings={setDisplaySettings}
        />

        <div className="flex justify-center -my-2">
          <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 shadow-sm">
            <ArrowDown className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* STEP 8: Herramienta de programación automático para redes sociales */}
        <Step8ScheduleAndPublish
          aiResult={aiResult}
          baseText={baseText}
          selectedCategory={selectedCategory}
          customBusinessName={customBusinessName}
        />
      </main>

      {/* Integrated Education Modal: Academia de Marketing & Diseño */}
      <MarketingAcademyModal
        isOpen={isAcademyOpen}
        onClose={() => setIsAcademyOpen(false)}
        selectedCategory={selectedCategory}
        customBusinessName={customBusinessName}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 px-4 text-center text-xs text-slate-500 mt-12">
        <p>
          Creador de Publicidad Móvil • Diseñado para todo tipo de negocio con IA Gemini, movimiento cinematográfico y locución profesional.
        </p>
      </footer>
    </div>
  );
}
