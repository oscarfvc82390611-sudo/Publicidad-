import React, { useState, useEffect, useRef } from 'react';
import {
  MediaItem,
  AudioTrack,
  AIVoice,
  AnimatedTemplate,
  AIOptimizationResult,
  BusinessCategory,
  AvatarDisplayMode,
  ExportedVideo,
  AdDisplaySettings,
  ImageFitMode
} from '../types';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  Share2,
  Maximize2,
  Sparkles,
  Smartphone,
  CheckCircle,
  ExternalLink,
  Loader2,
  Film,
  Sliders,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Check
} from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { renderAndExportVideo, saveVideoToMobileOrShare, triggerDirectDownload } from '../utils/videoAdExporter';
import { VideoExportModal } from './VideoExportModal';

interface LiveAdPreviewPlayerProps {
  mediaItems: MediaItem[];
  selectedTrack: AudioTrack | null;
  selectedVoice: AIVoice;
  enableVoiceover: boolean;
  avatarDisplayMode?: AvatarDisplayMode;
  selectedTemplate: AnimatedTemplate;
  aspectRatio: '9:16' | '1:1' | '16:9';
  promoBadgeText: string;
  brandColor: string;
  aiResult: AIOptimizationResult | null;
  baseText: string;
  selectedCategory: BusinessCategory;
  customBusinessName: string;
  musicVolume: number;
  displaySettings?: AdDisplaySettings;
  onUpdateDisplaySettings?: (settings: AdDisplaySettings) => void;
}

export const LiveAdPreviewPlayer: React.FC<LiveAdPreviewPlayerProps> = ({
  mediaItems,
  selectedTrack,
  selectedVoice,
  enableVoiceover,
  avatarDisplayMode = 'circle-pip',
  selectedTemplate,
  aspectRatio,
  promoBadgeText,
  brandColor,
  aiResult,
  baseText,
  selectedCategory,
  customBusinessName,
  musicVolume,
  displaySettings: propDisplaySettings,
  onUpdateDisplaySettings
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [adProgress, setAdProgress] = useState(0); // 0 to 100
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState('');
  const [exportedVideo, setExportedVideo] = useState<ExportedVideo | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  // Local fallback if not provided via props
  const [localDisplaySettings, setLocalDisplaySettings] = useState<AdDisplaySettings>({
    imageFitMode: 'contain',
    showOverlayTexts: true,
    showPromoBadge: true,
    showHeadlineBox: true,
    showCtaButton: true
  });

  const currentDisplaySettings = propDisplaySettings || localDisplaySettings;

  const updateSetting = (partial: Partial<AdDisplaySettings>) => {
    const updated = { ...currentDisplaySettings, ...partial };
    if (onUpdateDisplaySettings) {
      onUpdateDisplaySettings(updated);
    } else {
      setLocalDisplaySettings(updated);
    }
  };

  const businessDisplayName =
    selectedCategory.id === 'otro_negocio' && customBusinessName
      ? customBusinessName
      : selectedCategory.name;

  const headlineText =
    aiResult?.headline ||
    (baseText ? baseText.slice(0, 55) : `¡Descubre lo mejor en ${businessDisplayName}!`);

  const ctaText =
    aiResult?.callToAction || '¡Contáctanos hoy mismo!';

  const totalDurationSeconds = 15; // standard 15s commercial story

  // Animation cycle through images
  useEffect(() => {
    let interval: any;
    if (isPlaying && mediaItems.length > 0) {
      interval = setInterval(() => {
        setAdProgress((prev) => {
          const next = prev + (100 / (totalDurationSeconds * 10));
          if (next >= 100) {
            return 0;
          }
          return next;
        });
      }, 100);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, mediaItems.length]);

  // Switch photo every 3.5 seconds
  useEffect(() => {
    let mediaInterval: any;
    if (isPlaying && mediaItems.length > 1) {
      mediaInterval = setInterval(() => {
        setCurrentMediaIndex((prev) => (prev + 1) % mediaItems.length);
      }, 3500);
    }
    return () => clearInterval(mediaInterval);
  }, [isPlaying, mediaItems.length]);

  const handlePlayToggle = async () => {
    if (isPlaying) {
      audioEngine.stopAll();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);

      // Play music if selected
      if (selectedTrack && !isMuted) {
        audioEngine.playMusic(selectedTrack.url, musicVolume, true);
      }

      // Play voiceover if enabled
      if (enableVoiceover && !isMuted) {
        const script =
          aiResult?.voiceoverScript ||
          baseText ||
          `${headlineText}. ${ctaText}`;

        audioEngine.speakVoiceover(
          script,
          selectedVoice.apiVoiceName,
          () => {},
          () => {
            // Voiceover completed
          },
          selectedVoice.id,
          false
        );
      }
    }
  };

  const handleReset = () => {
    audioEngine.stopAll();
    setIsPlaying(false);
    setAdProgress(0);
    setCurrentMediaIndex(0);
  };

  const handleExport = async () => {
    if (isPlaying) {
      audioEngine.stopAll();
      setIsPlaying(false);
    }

    setIsExporting(true);
    setExportProgress(5);
    setExportStatus('Iniciando motor de video HD...');
    setExportSuccessMessage(null);

    const script =
      aiResult?.voiceoverScript ||
      baseText ||
      `${headlineText}. ${ctaText}`;

    try {
      const result = await renderAndExportVideo({
        mediaItems,
        selectedTemplate,
        selectedVoice,
        enableVoiceover,
        avatarDisplayMode: avatarDisplayMode as AvatarDisplayMode,
        aspectRatio,
        promoBadgeText,
        headlineText,
        pitchText: aiResult?.optimizedCopy || baseText || '¡Aprovecha hoy promociones exclusivas!',
        voiceoverScript: script,
        ctaText,
        businessName: businessDisplayName,
        categoryName: selectedCategory.name,
        brandColor,
        selectedTrack,
        musicVolume,
        durationSeconds: totalDurationSeconds,
        displaySettings: currentDisplaySettings,
        onProgress: (pct, status) => {
          setExportProgress(pct);
          setExportStatus(status);
        }
      });

      setExportedVideo(result);
      setIsExportModalOpen(true);
      setExportSuccessMessage('¡Video renderizado con éxito!');

      // If user is on a mobile device, attempt native share/save directly
      if (typeof window !== 'undefined' && window.innerWidth <= 768) {
        saveVideoToMobileOrShare(
          result.file,
          `Anuncio - ${businessDisplayName}`,
          `${headlineText}\n\n${ctaText}`
        ).catch(() => {});
      }
    } catch (err: any) {
      console.error('Error generando video publicitario:', err);
      alert('Hubo un detalle al renderizar el video. Por favor intenta de nuevo.');
    } finally {
      setIsExporting(false);
    }
  };

  const currentMedia = mediaItems[currentMediaIndex] || mediaItems[0];

  // Dynamic CSS animation classes based on chosen template
  const getAnimationClass = () => {
    if (!isPlaying) return '';
    switch (selectedTemplate.id) {
      case 'kenburns':
        return 'scale-115 translate-x-2 translate-y-1 transition-all duration-[4000ms] ease-out';
      case 'neonpulse':
        return 'scale-110 brightness-110 contrast-115 transition-all duration-700';
      case 'elegantfade':
        return 'opacity-95 scale-105 transition-all duration-[3000ms] ease-in-out';
      case 'glitchurban':
        return 'scale-112 rotate-0.5 transition-all duration-500';
      case 'storyzoom':
        return 'scale-110 transition-all duration-[2500ms] ease-in-out';
      default:
        return 'scale-110 transition-all duration-3000';
    }
  };

  // Aspect ratio sizing
  const getContainerDimensions = () => {
    switch (aspectRatio) {
      case '9:16':
        return 'w-[290px] h-[515px] sm:w-[320px] sm:h-[568px]';
      case '1:1':
        return 'w-[320px] h-[320px] sm:w-[380px] sm:h-[380px]';
      case '16:9':
        return 'w-[320px] h-[180px] sm:w-[480px] sm:h-[270px]';
    }
  };

  return (
    <section id="ad-live-preview" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center font-bold text-sm text-white">
              🎬
            </div>
            <h2 className="text-base font-bold text-white font-['Outfit',sans-serif]">
              Previsualizador y Reproductor Publicitario en Vivo
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Mira cómo tus fotos cobran vida con la plantilla animada, voz de IA y música sincronizada.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isExporting ? (
            <div className="flex items-center gap-3 bg-slate-950/90 border border-slate-700 px-4 py-2 rounded-2xl shadow-lg">
              <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-white">
                  {exportStatus || 'Procesando video...'} ({exportProgress}%)
                </span>
                <div className="w-36 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-150"
                    style={{ width: `${exportProgress}%` }}
                  />
                </div>
              </div>
            </div>
          ) : exportedVideo ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsExportModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-950/40 flex items-center gap-1.5 transition cursor-pointer"
              >
                <Smartphone className="w-4 h-4 text-emerald-200" />
                <span>Guardar en Celular / Galería</span>
              </button>
              <button
                type="button"
                onClick={handleExport}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition cursor-pointer"
                title="Volver a exportar"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleExport}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-950/40 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Exportar y Guardar en Celular</span>
            </button>
          )}
        </div>
      </div>

      {/* Display & Clean Photo Mode Settings Panel */}
      <div className="mb-5 bg-slate-950/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-rose-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Ajuste de Imagen & Opciones de Textos en Pantalla
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Controla cómo se muestra tu foto y si deseas cuadros o foto 100% limpia
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Option 1: Master Clean Photo Mode vs Overlay Texts */}
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                {currentDisplaySettings.showOverlayTexts ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-amber-400" />}
                Textos & Cuadros sobre el Video:
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${currentDisplaySettings.showOverlayTexts ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30' : 'bg-amber-950/80 text-amber-300 border border-amber-500/30'}`}>
                {currentDisplaySettings.showOverlayTexts ? 'Con Textos' : 'Foto Limpia'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                type="button"
                onClick={() => updateSetting({ showOverlayTexts: false })}
                className={`py-2 px-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                  !currentDisplaySettings.showOverlayTexts
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md ring-1 ring-amber-400'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-700'
                }`}
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>Foto Limpia (Sin Textos)</span>
              </button>

              <button
                type="button"
                onClick={() => updateSetting({ showOverlayTexts: true })}
                className={`py-2 px-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                  currentDisplaySettings.showOverlayTexts
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md ring-1 ring-emerald-400'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-700'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Mostrar Textos / Oferta</span>
              </button>
            </div>
          </div>

          {/* Option 2: Image Scale & Fit Mode */}
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
                Ajuste y Visibilidad de la Imagen:
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-950/80 text-sky-300 border border-sky-500/30">
                {currentDisplaySettings.imageFitMode === 'contain' ? 'Volante Completo' : 'Llenar Pantalla'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                type="button"
                onClick={() => updateSetting({ imageFitMode: 'contain' })}
                className={`py-2 px-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                  currentDisplaySettings.imageFitMode === 'contain'
                    ? 'bg-sky-600 text-white border-sky-500 shadow-md ring-1 ring-sky-400'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-700'
                }`}
              >
                <span>Volante Completo (Sin Recortes)</span>
              </button>

              <button
                type="button"
                onClick={() => updateSetting({ imageFitMode: 'cover' })}
                className={`py-2 px-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                  currentDisplaySettings.imageFitMode === 'cover'
                    ? 'bg-sky-600 text-white border-sky-500 shadow-md ring-1 ring-sky-400'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-700'
                }`}
              >
                <span>Llenar Pantalla (Cover)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Individual text toggles if master toggle is active */}
        {currentDisplaySettings.showOverlayTexts && (
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] text-slate-400 font-medium">Cuadros individuales en el video:</span>
            <div className="flex items-center gap-3 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={currentDisplaySettings.showPromoBadge}
                  onChange={(e) => updateSetting({ showPromoBadge: e.target.checked })}
                  className="rounded border-slate-700 text-rose-600 focus:ring-rose-500 h-3.5 w-3.5 cursor-pointer"
                />
                <span>Insignia Superior</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={currentDisplaySettings.showHeadlineBox}
                  onChange={(e) => updateSetting({ showHeadlineBox: e.target.checked })}
                  className="rounded border-slate-700 text-rose-600 focus:ring-rose-500 h-3.5 w-3.5 cursor-pointer"
                />
                <span>Cuadro de Titular</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={currentDisplaySettings.showCtaButton}
                  onChange={(e) => updateSetting({ showCtaButton: e.target.checked })}
                  className="rounded border-slate-700 text-rose-600 focus:ring-rose-500 h-3.5 w-3.5 cursor-pointer"
                />
                <span>Botón Inferior (WhatsApp/Llamado)</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Main Mockup Phone Frame */}
      <div className="flex flex-col items-center justify-center py-2">
        <div
          className={`relative rounded-[36px] p-2 bg-slate-950 border-4 border-slate-800 shadow-2xl shadow-black/80 flex flex-col items-center`}
        >
          {/* Top Speaker Pill Notch */}
          <div className="w-20 h-4 bg-slate-900 rounded-full mb-1.5 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-slate-950 border border-slate-800" />
          </div>

          {/* Phone Display Screen */}
          <div
            className={`relative overflow-hidden rounded-[26px] bg-black select-none ${getContainerDimensions()}`}
          >
            {/* Background Media */}
            {currentMedia ? (
              currentDisplaySettings.imageFitMode === 'contain' ? (
                // Contain Mode: blurred background + unclipped foreground
                <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
                  <img
                    src={currentMedia.url}
                    alt="Fondo"
                    className="absolute inset-0 w-full h-full object-cover blur-xl scale-125 opacity-45 transform origin-center"
                    referrerPolicy="no-referrer"
                  />
                  <img
                    src={currentMedia.url}
                    alt="Anuncio Publicitario Ajustado"
                    className={`relative z-10 max-w-full max-h-full object-contain drop-shadow-2xl transform origin-center ${getAnimationClass()}`}
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : currentMedia.type === 'image' ? (
                // Cover Mode
                <img
                  src={currentMedia.url}
                  alt="Anuncio Publicitario"
                  className={`w-full h-full object-cover transform origin-center ${getAnimationClass()}`}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <video
                  src={currentMedia.url}
                  autoPlay={isPlaying}
                  loop
                  muted
                  className={`w-full h-full object-cover transform origin-center ${getAnimationClass()}`}
                />
              )
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-500">
                <p className="text-xs">Sube tus fotos o videos en el Paso 1 para verlas aquí en movimiento</p>
              </div>
            )}

            {/* Dark Gradient Overlay for optimal readability (only when overlay texts are enabled) */}
            {currentDisplaySettings.showOverlayTexts && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60 pointer-events-none" />
            )}

            {/* Top Bar inside ad: Story progress bars */}
            <div className="absolute top-2.5 inset-x-3 flex gap-1 z-20">
              {mediaItems.map((_, idx) => (
                <div
                  key={idx}
                  className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden"
                >
                  <div
                    className="h-full bg-white transition-all duration-300"
                    style={{
                      width:
                        idx < currentMediaIndex
                          ? '100%'
                          : idx === currentMediaIndex
                          ? `${(adProgress % 100)}%`
                          : '0%'
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Top Badge: Promo label */}
            {currentDisplaySettings.showOverlayTexts && currentDisplaySettings.showPromoBadge && (
              <div className="absolute top-6 left-3 right-3 flex items-center justify-between z-20">
                <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                  <span
                    className="w-2 h-2 rounded-full animate-ping"
                    style={{ backgroundColor: brandColor }}
                  />
                  <span className="text-[10px] font-bold text-white tracking-wide uppercase">
                    {promoBadgeText || 'OFERTA ESPECIAL'}
                  </span>
                </div>

                <div className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 text-[9px] font-semibold text-slate-300">
                  {businessDisplayName}
                </div>
              </div>
            )}

            {/* Avatar Floating PIP Circle Overlay */}
            {currentDisplaySettings.showOverlayTexts && enableVoiceover && avatarDisplayMode === 'circle-pip' && (
              <div className="absolute top-14 left-3 z-20 flex items-center gap-2 bg-black/75 backdrop-blur-md p-1.5 pr-3 rounded-full border border-white/20 shadow-xl transition-all">
                <div className="relative">
                  <img
                    src={selectedVoice.avatarImage}
                    alt={selectedVoice.name}
                    className={`w-9 h-9 rounded-full object-cover border-2 ${
                      isPlaying
                        ? 'border-amber-400 ring-2 ring-amber-400/50 animate-pulse'
                        : 'border-white/50'
                    }`}
                    referrerPolicy="no-referrer"
                  />
                  {isPlaying && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border border-black flex items-center justify-center text-[7px] text-white">
                      🎙️
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold text-white leading-tight">
                      {selectedVoice.name.split(' ')[0]}
                    </span>
                    <span className="text-[8px] bg-rose-500/90 text-white px-1 rounded-full font-semibold">
                      Avatar IA
                    </span>
                  </div>
                  <span className="text-[8px] text-slate-300">
                    {isPlaying ? 'Presentando en vivo' : 'Voz de estudio'}
                  </span>
                </div>
              </div>
            )}

            {/* Avatar Presenter Card Overlay */}
            {currentDisplaySettings.showOverlayTexts && enableVoiceover && avatarDisplayMode === 'bottom-card' && (
              <div className="absolute bottom-[176px] inset-x-3.5 z-20">
                <div className="bg-black/85 backdrop-blur-md p-2 rounded-xl border border-white/20 flex items-center justify-between shadow-2xl">
                  <div className="flex items-center gap-2">
                    <img
                      src={selectedVoice.avatarImage}
                      alt={selectedVoice.name}
                      className={`w-8 h-8 rounded-lg object-cover border ${
                        isPlaying ? 'border-amber-400 ring-1 ring-amber-400' : 'border-slate-600'
                      }`}
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <p className="text-[10px] font-bold text-white flex items-center gap-1">
                        {selectedVoice.name.split(' ')[0]}
                        <span className="text-[8px] text-amber-300 font-semibold px-1 rounded bg-amber-950/80 border border-amber-500/40">
                          {selectedVoice.badge || 'Presentador'}
                        </span>
                      </p>
                      <p className="text-[8px] text-slate-300 truncate max-w-[130px]">
                        {selectedVoice.avatarRole}
                      </p>
                    </div>
                  </div>
                  {isPlaying && (
                    <div className="flex items-center gap-1 bg-emerald-950/80 border border-emerald-500/40 px-1.5 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-[8px] font-bold text-emerald-300">AL AIRE</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Animated Center Headline */}
            {currentDisplaySettings.showOverlayTexts && currentDisplaySettings.showHeadlineBox && (
              <div className="absolute bottom-20 inset-x-3.5 z-20">
                <div className="bg-black/75 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 shadow-2xl">
                  <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Destacado
                  </p>
                  <h3 className="text-sm sm:text-base font-extrabold text-white leading-snug drop-shadow-md font-['Outfit',sans-serif]">
                    {headlineText}
                  </h3>
                </div>
              </div>
            )}

            {/* Bottom Call To Action Button */}
            {currentDisplaySettings.showOverlayTexts && currentDisplaySettings.showCtaButton && (
              <div className="absolute bottom-3.5 inset-x-3.5 z-20">
                <button
                  type="button"
                  className="w-full py-2.5 px-3 rounded-xl text-white font-extrabold text-xs tracking-wide shadow-xl flex items-center justify-center gap-2 transform active:scale-95 transition cursor-pointer"
                  style={{
                    backgroundColor: brandColor,
                    boxShadow: `0 8px 20px -4px ${brandColor}80`
                  }}
                >
                  <span>{ctaText}</span>
                </button>
              </div>
            )}

            {/* Active Voiceover & Audio Indicator */}
            {isPlaying && (
              <div className="absolute top-14 right-3 z-20 flex items-center gap-1 bg-black/70 backdrop-blur-md px-2 py-1 rounded-full border border-white/10 text-[9px] text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{enableVoiceover ? `Voz ${selectedVoice.name.split(' ')[0]}` : 'Audio ON'}</span>
              </div>
            )}
          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="w-28 h-1 bg-slate-700 rounded-full mt-2" />
        </div>

        {/* Player Controls Bar */}
        <div className="mt-5 w-full max-w-md bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between gap-3 shadow-lg">
          <button
            type="button"
            id="btn-play-pause-ad"
            onClick={handlePlayToggle}
            className={`w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-lg transition cursor-pointer ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500'
                : 'bg-rose-600 hover:bg-rose-500'
            }`}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          <div className="flex-1">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span className="font-semibold text-slate-200">
                {isPlaying ? 'Reproduciendo Anuncio...' : 'Pausado'}
              </span>
              <span className="font-mono text-slate-400">
                {Math.round((adProgress / 100) * totalDurationSeconds)}s / {totalDurationSeconds}s
              </span>
            </div>
            {/* Progress bar */}
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-100"
                style={{ width: `${adProgress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleReset}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              title="Reiniciar reproducción"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                setIsMuted(!isMuted);
                if (!isMuted) {
                  audioEngine.pauseMusic();
                } else if (isPlaying && selectedTrack) {
                  audioEngine.playMusic(selectedTrack.url, musicVolume, true);
                }
              }}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              title={isMuted ? 'Activar sonido' : 'Silenciar'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              )}
            </button>
          </div>
        </div>

        {/* Quick Mobile Save Bar below phone mockup */}
        <div className="w-full max-w-sm mt-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl p-3 flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Smartphone className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-white leading-tight">
                {exportedVideo ? 'Video listo para tu celular' : 'Guardar en Fotos / Galería'}
              </p>
              <p className="text-[9px] text-slate-400">
                {exportedVideo ? `Archivo ${exportedVideo.extension.toUpperCase()} listo para compartir` : 'Crea el archivo de video con música y voz'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={exportedVideo ? () => setIsExportModalOpen(true) : handleExport}
            disabled={isExporting}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-[11px] font-bold shadow-md shadow-emerald-950/40 flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50 shrink-0"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>{exportProgress}%</span>
              </>
            ) : exportedVideo ? (
              <>
                <CheckCircle className="w-3 h-3 text-emerald-200" />
                <span>Abrir Video</span>
              </>
            ) : (
              <>
                <Download className="w-3 h-3" />
                <span>Guardar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Fullscreen Video Export Modal with Mobile Native Share */}
      {exportedVideo && (
        <VideoExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          exportedVideo={exportedVideo}
          businessName={businessDisplayName}
          headlineText={headlineText}
          ctaText={ctaText}
        />
      )}
    </section>
  );
};
