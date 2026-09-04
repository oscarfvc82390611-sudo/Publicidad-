import React from 'react';
import { Sparkles, GraduationCap, Calendar, Video, Smartphone } from 'lucide-react';

interface HeaderProps {
  onOpenAcademy: () => void;
  onScrollToSchedule: () => void;
  onScrollToPreview: () => void;
  onStartCleanAd?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAcademy,
  onScrollToSchedule,
  onScrollToPreview,
  onStartCleanAd
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-rose-950/40">
            <Video className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight leading-none font-['Outfit',sans-serif]">
                Creador de Publicidad Móvil
              </h1>
              <span className="bg-rose-500/20 text-rose-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-rose-500/30">
                PRO IA
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Crea anuncios cinematográficos para cualquier negocio desde el celular
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onStartCleanAd && (
            <button
              id="btn-start-clean-ad"
              type="button"
              onClick={onStartCleanAd}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-rose-500/50 text-slate-200 hover:text-white transition text-xs font-semibold cursor-pointer shadow-sm"
              title="Comenzar una nueva publicidad desde cero en limpio"
            >
              <span className="text-amber-400">✨</span>
              <span className="hidden sm:inline">Nueva Publicidad en Limpio</span>
              <span className="sm:hidden">En Limpio</span>
            </button>
          )}

          <button
            id="btn-open-academy"
            type="button"
            onClick={onOpenAcademy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-900/60 transition text-xs font-medium cursor-pointer"
          >
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">Academia</span>
            <span className="sm:hidden">Academia</span>
          </button>

          <button
            id="btn-quick-schedule"
            type="button"
            onClick={onScrollToSchedule}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition text-xs font-medium cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Programador de Redes</span>
            <span className="sm:hidden">Agendar</span>
          </button>

          <button
            id="btn-quick-preview"
            type="button"
            onClick={onScrollToPreview}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white shadow-md shadow-rose-950/50 text-xs font-semibold cursor-pointer transition"
          >
            <Smartphone className="w-4 h-4" />
            <span>Ver Anuncio</span>
          </button>
        </div>
      </div>
    </header>
  );
};
