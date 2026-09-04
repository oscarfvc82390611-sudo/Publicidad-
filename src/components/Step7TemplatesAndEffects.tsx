import React from 'react';
import { AnimatedTemplate, AnimationEffect } from '../types';
import { ANIMATED_TEMPLATES } from '../data/mockTemplatesAndData';
import { Clapperboard, Layers, Smartphone, Square, Monitor, Check, Tag } from 'lucide-react';

interface Step7TemplatesAndEffectsProps {
  selectedTemplate: AnimatedTemplate;
  onSelectTemplate: (tpl: AnimatedTemplate) => void;
  aspectRatio: '9:16' | '1:1' | '16:9';
  onChangeAspectRatio: (ratio: '9:16' | '1:1' | '16:9') => void;
  promoBadgeText: string;
  onChangePromoBadgeText: (badge: string) => void;
  brandColor: string;
  onChangeBrandColor: (color: string) => void;
}

const BADGE_PRESETS = [
  '🔥 OFERTA EXCLUSIVA',
  '✨ NUEVO LANZAMIENTO',
  '🚚 ENVÍOS GRATIS HOY',
  '⭐ 100% GARANTIZADO',
  '💥 50% DE DESCUENTO',
  '📲 ESCRÍBENOS AHORA'
];

const COLOR_PALETTES = [
  { name: 'Rojo Pasión', hex: '#e11d48' },
  { name: 'Ámbar Dorado', hex: '#d97706' },
  { name: 'Verde Esmeralda', hex: '#059669' },
  { name: 'Azul Confianza', hex: '#2563eb' },
  { name: 'Púrpura Neón', hex: '#9333ea' },
  { name: 'Grafito Minimalista', hex: '#334155' }
];

export const Step7TemplatesAndEffects: React.FC<Step7TemplatesAndEffectsProps> = ({
  selectedTemplate,
  onSelectTemplate,
  aspectRatio,
  onChangeAspectRatio,
  promoBadgeText,
  onChangePromoBadgeText,
  brandColor,
  onChangeBrandColor
}) => {
  return (
    <section id="step-7-templates" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30 flex items-center justify-center font-bold text-sm">
            7
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Plantillas animadas y transiciones cinematográficas
              <span className="text-xs text-violet-300 font-medium bg-violet-950/60 px-2 py-0.5 rounded-full border border-violet-500/30">
                {selectedTemplate.name.split('(')[0]}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Efectos de cámara que dan vida a tus fotos fijas haciéndolas ver como tomas cinematográficas en movimiento.
            </p>
          </div>
        </div>
      </div>

      {/* Format / Aspect Ratio Selector */}
      <div className="mb-5 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
        <label className="block text-xs font-semibold text-slate-300 mb-2">
          Formato de pantalla para redes sociales:
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onChangeAspectRatio('9:16')}
            className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
              aspectRatio === '9:16'
                ? 'bg-violet-950/60 border-violet-500 text-violet-200 shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4 text-violet-400" />
            <span>9:16 (Reels/TikTok)</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeAspectRatio('1:1')}
            className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
              aspectRatio === '1:1'
                ? 'bg-violet-950/60 border-violet-500 text-violet-200 shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Square className="w-4 h-4 text-violet-400" />
            <span>1:1 (Feed Cuadrado)</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeAspectRatio('16:9')}
            className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
              aspectRatio === '16:9'
                ? 'bg-violet-950/60 border-violet-500 text-violet-200 shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-4 h-4 text-violet-400" />
            <span>16:9 (Horizontal)</span>
          </button>
        </div>
      </div>

      {/* Templates Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-5">
        {ANIMATED_TEMPLATES.map((template) => {
          const isSelected = selectedTemplate.id === template.id;

          return (
            <div
              key={template.id}
              onClick={() => onSelectTemplate(template)}
              className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-violet-950/30 border-violet-500 ring-1 ring-violet-500/50 shadow-md shadow-violet-950/40'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-white leading-tight">
                    {template.name}
                  </span>
                  <span className="text-[10px] bg-violet-500/20 text-violet-300 px-1.5 py-0.5 rounded font-medium shrink-0">
                    {template.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
                  {template.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
                <span className="truncate">{template.transitionType}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-violet-400 shrink-0 ml-1" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Promo Badge & Brand Color */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-amber-400" />
            Etiqueta destacada en pantalla:
          </label>
          <input
            type="text"
            value={promoBadgeText}
            onChange={(e) => onChangePromoBadgeText(e.target.value)}
            placeholder="Ej: 🔥 OFERTA POR TIEMPO LIMITADO"
            className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 mb-2"
          />
          <div className="flex flex-wrap gap-1">
            {BADGE_PRESETS.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => onChangePromoBadgeText(b)}
                className="text-[10px] px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition cursor-pointer"
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Color de acento publicitario:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {COLOR_PALETTES.map((pal) => {
              const isSelected = brandColor === pal.hex;
              return (
                <button
                  key={pal.hex}
                  type="button"
                  onClick={() => onChangeBrandColor(pal.hex)}
                  className={`flex items-center gap-1.5 p-1.5 rounded-lg border text-[11px] font-medium transition cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-white text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: pal.hex }}
                  />
                  <span className="truncate">{pal.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
