import React, { useRef, useState } from 'react';
import { AudioTrack } from '../types';
import { Music, Upload, Play, Pause, Volume2, Check, Sparkles } from 'lucide-react';
import { ROYALTY_FREE_TRACKS } from '../data/mockTemplatesAndData';
import { audioEngine } from '../utils/audioEngine';

interface Step2AudioSelectProps {
  selectedTrack: AudioTrack | null;
  onSelectTrack: (track: AudioTrack) => void;
  musicVolume: number;
  onChangeVolume: (vol: number) => void;
}

export const Step2AudioSelect: React.FC<Step2AudioSelectProps> = ({
  selectedTrack,
  onSelectTrack,
  musicVolume,
  onChangeVolume
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [customTracks, setCustomTracks] = useState<AudioTrack[]>([]);

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const customTrack: AudioTrack = {
      id: `custom-audio-${Date.now()}`,
      title: file.name.replace(/\.[^/.]+$/, ""),
      category: 'Música de tu celular',
      duration: 'Audio personalizado',
      url: URL.createObjectURL(file),
      isCustom: true
    };

    setCustomTracks(prev => [customTrack, ...prev]);
    onSelectTrack(customTrack);
  };

  const togglePreview = (track: AudioTrack) => {
    if (playingTrackId === track.id) {
      audioEngine.stopAll();
      setPlayingTrackId(null);
    } else {
      audioEngine.playMusic(track.url, musicVolume, false);
      setPlayingTrackId(track.id);
    }
  };

  const allTracks = [...customTracks, ...ROYALTY_FREE_TRACKS];

  return (
    <section id="step-2-audio" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-sm">
            2
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Subir música o audio de fondo
              {selectedTrack && (
                <span className="inline-flex items-center gap-1 text-xs text-amber-300 font-medium bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30">
                  <Check className="w-3 h-3" /> {selectedTrack.title.slice(0, 22)}...
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-400">
              Sube una canción o pista desde tu celular, o elige una de nuestras pistas cinematográficas libres de derechos.
            </p>
          </div>
        </div>

        {/* Volume slider */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          <Volume2 className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px] text-slate-400">Volumen:</span>
          <input
            type="range"
            min="0.05"
            max="1"
            step="0.05"
            value={musicVolume}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              onChangeVolume(val);
              audioEngine.setMusicVolume(val);
            }}
            className="w-16 accent-amber-500 cursor-pointer"
          />
          <span className="text-[11px] text-amber-400 font-mono w-7">
            {Math.round(musicVolume * 100)}%
          </span>
        </div>
      </div>

      {/* Upload button from mobile */}
      <div className="mb-4">
        <input
          ref={fileInputRef}
          type="file"
          id="input-audio-file"
          accept="audio/*"
          className="hidden"
          onChange={handleAudioUpload}
        />
        <button
          id="btn-upload-music-phone"
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600/20 via-orange-600/20 to-amber-600/20 border border-amber-500/40 hover:border-amber-400 text-amber-200 hover:text-white transition cursor-pointer font-medium text-sm group"
        >
          <Upload className="w-4 h-4 text-amber-400 group-hover:scale-110 transition" />
          <span>Subir pista de música desde mi celular (MP3, WAV, M4A)</span>
        </button>
      </div>

      {/* Tracks Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {allTracks.map((track) => {
          const isSelected = selectedTrack?.id === track.id;
          const isPlaying = playingTrackId === track.id;

          return (
            <div
              key={track.id}
              onClick={() => onSelectTrack(track)}
              className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition ${
                isSelected
                  ? 'bg-amber-950/30 border-amber-500/80 shadow-md shadow-amber-950/30'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePreview(track);
                  }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition cursor-pointer ${
                    isPlaying
                      ? 'bg-amber-500 text-black shadow-lg animate-pulse'
                      : 'bg-slate-800 hover:bg-amber-500/20 text-amber-400 border border-slate-700'
                  }`}
                  title={isPlaying ? 'Pausar muestra' : 'Escuchar muestra'}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </button>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className={`text-xs font-semibold truncate ${isSelected ? 'text-amber-200' : 'text-slate-200'}`}>
                      {track.title}
                    </p>
                    {track.isCustom && (
                      <span className="bg-rose-500/20 text-rose-300 text-[9px] px-1.5 py-0.2 rounded border border-rose-500/30">
                        Tu Celular
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <span>{track.category}</span>
                    <span>•</span>
                    <span className="font-mono text-slate-500">{track.duration}</span>
                  </p>
                </div>
              </div>

              <div className="shrink-0">
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition ${
                    isSelected
                      ? 'bg-amber-500 border-amber-400 text-black'
                      : 'border-slate-700 bg-slate-900'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
