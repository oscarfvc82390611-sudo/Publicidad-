import React, { useState } from 'react';
import { AIVoice, AIOptimizationResult, AvatarDisplayMode } from '../types';
import { AI_VOICES } from '../data/mockTemplatesAndData';
import {
  Volume2,
  Pause,
  Check,
  Sparkles,
  Mic,
  MicOff,
  UserCheck,
  Radio,
  Layers,
  CircleDot,
  FileText
} from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface Step6VoiceSelectProps {
  selectedVoice: AIVoice;
  onSelectVoice: (voice: AIVoice) => void;
  enableVoiceover: boolean;
  onToggleVoiceover: (enabled: boolean) => void;
  avatarDisplayMode: AvatarDisplayMode;
  onSelectAvatarDisplayMode: (mode: AvatarDisplayMode) => void;
  aiResult: AIOptimizationResult | null;
  baseText: string;
}

export const Step6VoiceSelect: React.FC<Step6VoiceSelectProps> = ({
  selectedVoice,
  onSelectVoice,
  enableVoiceover,
  onToggleVoiceover,
  avatarDisplayMode,
  onSelectAvatarDisplayMode,
  aiResult,
  baseText
}) => {
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [playingMode, setPlayingMode] = useState<'sample' | 'script'>('sample');
  const [genderFilter, setGenderFilter] = useState<'all' | 'Masculina' | 'Femenina'>('all');

  const filteredVoices = AI_VOICES.filter((voice) => {
    if (genderFilter === 'all') return true;
    return voice.gender === genderFilter;
  });

  const handleTestAvatar = async (voice: AIVoice, mode: 'sample' | 'script' = 'sample') => {
    // Automatically select the voice when the user auditions it
    onSelectVoice(voice);

    if (playingVoiceId === voice.id && playingMode === mode) {
      audioEngine.stopAll();
      setPlayingVoiceId(null);
      return;
    }

    setPlayingVoiceId(voice.id);
    setPlayingMode(mode);

    if (mode === 'sample') {
      // Direct high-fidelity precomputed studio WAV playback
      const handled = audioEngine.playAvatarSample(
        voice.id,
        () => {},
        () => setPlayingVoiceId(null)
      );

      if (!handled) {
        // Fallback
        await audioEngine.speakVoiceover(
          voice.previewQuote,
          voice.apiVoiceName,
          () => {},
          () => setPlayingVoiceId(null),
          voice.id,
          true
        );
      }
    } else {
      // Test with custom AI script
      const scriptToSpeak =
        aiResult?.voiceoverScript ||
        baseText ||
        `${voice.previewQuote}`;

      await audioEngine.speakVoiceover(
        scriptToSpeak,
        voice.apiVoiceName,
        () => {},
        () => setPlayingVoiceId(null),
        voice.id,
        false
      );
    }
  };

  return (
    <section id="step-6-voice" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-rose-950/40">
            6
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Avatares de IA & Locución Humana Elegante
              <span className="text-[11px] font-semibold bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Sin sonido robótico
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Voces moduladas de estudio con entonación comercial real, pausas orgánicas y presencia de avatar en pantalla.
            </p>
          </div>
        </div>

        {/* Master Toggle */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => {
              const next = !enableVoiceover;
              onToggleVoiceover(next);
              if (!next) {
                audioEngine.stopAll();
                setPlayingVoiceId(null);
              }
            }}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition cursor-pointer ${
              enableVoiceover
                ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md shadow-rose-950/30'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {enableVoiceover ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
            <span>{enableVoiceover ? 'Locutor & Avatar Activo' : 'Sin Locución'}</span>
          </button>
        </div>
      </div>

      {enableVoiceover && (
        <>
          {/* Avatar Screen Display Style Selector */}
          <div className="mb-5 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-rose-400" /> Modo de visualización del Avatar en tu anuncio:
              </span>
              <span className="text-[11px] text-slate-400">
                Selecciona cómo aparecerá el presentador en el video
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onSelectAvatarDisplayMode('circle-pip')}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex items-center gap-2.5 ${
                  avatarDisplayMode === 'circle-pip'
                    ? 'bg-rose-950/50 border-rose-500/80 text-white shadow-sm ring-1 ring-rose-500/40'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center justify-center shrink-0">
                  <CircleDot className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold leading-tight">Burbuja Flotante PIP</p>
                  <p className="text-[10px] text-slate-400">Círculo moderno con aura de voz</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onSelectAvatarDisplayMode('bottom-card')}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex items-center gap-2.5 ${
                  avatarDisplayMode === 'bottom-card'
                    ? 'bg-rose-950/50 border-rose-500/80 text-white shadow-sm ring-1 ring-rose-500/40'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center shrink-0">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold leading-tight">Tarjeta de Presentador</p>
                  <p className="text-[10px] text-slate-400">Banner inferior tipo noticiero/show</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onSelectAvatarDisplayMode('audio-only')}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex items-center gap-2.5 ${
                  avatarDisplayMode === 'audio-only'
                    ? 'bg-rose-950/50 border-rose-500/80 text-white shadow-sm ring-1 ring-rose-500/40'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center justify-center shrink-0">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold leading-tight">Solo Voz en Off</p>
                  <p className="text-[10px] text-slate-400">Audio publicitario sin foto</p>
                </div>
              </button>
            </div>
          </div>

          {/* Voice Filter Pills */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setGenderFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                genderFilter === 'all'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-950/40'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              Todas las Voces ({AI_VOICES.length})
            </button>
            <button
              type="button"
              onClick={() => setGenderFilter('Masculina')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                genderFilter === 'Masculina'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-950/40'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <span>Voces Masculinas</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-950/80 text-blue-200 border border-blue-400/20">
                {AI_VOICES.filter((v) => v.gender === 'Masculina').length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setGenderFilter('Femenina')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                genderFilter === 'Femenina'
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-950/40'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <span>Voces Femeninas</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-pink-950/80 text-pink-200 border border-pink-400/20">
                {AI_VOICES.filter((v) => v.gender === 'Femenina').length}
              </span>
            </button>
          </div>

          {/* Avatar Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredVoices.map((voice) => {
              const isSelected = selectedVoice.id === voice.id;
              const isPlayingSample = playingVoiceId === voice.id && playingMode === 'sample';
              const isPlayingScript = playingVoiceId === voice.id && playingMode === 'script';
              const isAnyPlaying = playingVoiceId === voice.id;

              return (
                <div
                  key={voice.id}
                  onClick={() => onSelectVoice(voice)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                    isSelected
                      ? 'bg-gradient-to-b from-rose-950/40 to-slate-900 border-rose-500 shadow-xl shadow-rose-950/30 ring-2 ring-rose-500/40'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  {/* Top Badge */}
                  {voice.badge && (
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800/90 text-amber-300 border border-amber-400/30 shadow-sm">
                        {voice.badge}
                      </span>
                    </div>
                  )}

                  <div>
                    {/* Avatar Portrait & Identity */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="relative">
                        <img
                          src={voice.avatarImage}
                          alt={voice.name}
                          className={`w-14 h-14 rounded-2xl object-cover border-2 shadow-md transition-all ${
                            isSelected
                              ? 'border-rose-400 shadow-rose-950/50'
                              : 'border-slate-700'
                          } ${isAnyPlaying ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-950 animate-pulse' : ''}`}
                          referrerPolicy="no-referrer"
                        />
                        {isAnyPlaying && (
                          <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 items-center justify-center text-[8px] text-white">
                              🎙️
                            </span>
                          </span>
                        )}
                      </div>

                      <div className="flex-1 pr-16">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-white leading-snug">
                            {voice.name.split(' ')[0]}
                          </h3>
                          <span className="text-[10px] font-medium text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded">
                            {voice.gender}
                          </span>
                        </div>
                        <p className="text-[11px] font-semibold text-rose-300/90 mt-0.5 line-clamp-1">
                          {voice.avatarRole}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {voice.style}
                        </p>
                      </div>
                    </div>

                    {/* Audio Equalizer visualizer when playing */}
                    {isAnyPlaying && (
                      <div className="mb-3 bg-amber-950/40 border border-amber-500/30 rounded-xl px-3 py-1.5 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                          {isPlayingSample ? 'Audio de estudio en vivo...' : 'Leyendo guion con IA...'}
                        </span>
                        <div className="flex items-center gap-0.5 h-3">
                          <span className="w-1 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s] h-full" />
                          <span className="w-1 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.15s] h-2" />
                          <span className="w-1 bg-amber-400 rounded-full animate-bounce h-3" />
                          <span className="w-1 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.2s] h-2.5" />
                        </div>
                      </div>
                    )}

                    {/* Preview Quote Box */}
                    <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800/80 mb-3">
                      <p className="text-[11px] text-slate-300 italic line-clamp-2">
                        &ldquo;{voice.previewQuote}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/60">
                    <div className="flex items-center gap-1.5">
                      {/* Primary Audio Audition Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTestAvatar(voice, 'sample');
                        }}
                        className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                          isPlayingSample
                            ? 'bg-amber-500 text-white shadow-md ring-2 ring-amber-400'
                            : 'bg-slate-800 hover:bg-slate-700 text-rose-300 hover:text-white border border-slate-700 hover:border-rose-500/50'
                        }`}
                      >
                        {isPlayingSample ? (
                          <>
                            <Pause className="w-3.5 h-3.5" />
                            <span>Detener</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Escuchar voz</span>
                          </>
                        )}
                      </button>

                      {/* Script test button if AI script exists */}
                      {aiResult?.voiceoverScript && (
                        <button
                          type="button"
                          title="Probar cómo lee tu guion optimizado"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTestAvatar(voice, 'script');
                          }}
                          className={`py-2 px-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1 transition cursor-pointer border ${
                            isPlayingScript
                              ? 'bg-rose-600 text-white border-rose-500'
                              : 'bg-slate-900 text-slate-300 hover:text-white border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <FileText className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-[11px]">Mi Guion</span>
                        </button>
                      )}
                    </div>

                    {/* Dedicated Primary Selection Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectVoice(voice);
                      }}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/40 ring-1 ring-emerald-400'
                          : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>✓ Voz {voice.gender} Seleccionada para el Video</span>
                        </>
                      ) : (
                        <span>Usar Voz {voice.gender} ({voice.name.split(' ')[0]})</span>
                      )}
                    </button>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 px-1">
                      <span className="font-medium text-slate-400">{voice.gender === 'Femenina' ? '👩 Presentadora' : '👨 Presentador'}</span>
                      <span className="truncate max-w-[170px] text-right">{voice.recommendedFor}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
};
