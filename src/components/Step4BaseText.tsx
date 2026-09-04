import React from 'react';
import { Type, Sparkles, HelpCircle, MessageSquare } from 'lucide-react';
import { BusinessCategory } from '../types';

interface Step4BaseTextProps {
  baseText: string;
  onChangeBaseText: (val: string) => void;
  selectedCategory: BusinessCategory;
  customBusinessName: string;
  advertisingGoal: string;
  onChangeGoal: (goal: string) => void;
  onOptimizeWithAI?: () => void;
  isAiLoading?: boolean;
}

const GOALS = [
  { id: 'ventas', label: 'Ventas Rápidas & Oferta Especial' },
  { id: 'whatsapp', label: 'Conseguir Mensajes de WhatsApp' },
  { id: 'visitas', label: 'Atraer Clientes al Local / Tienda' },
  { id: 'marca', label: 'Reconocimiento & Prestigio de Marca' }
];

export const Step4BaseText: React.FC<Step4BaseTextProps> = ({
  baseText,
  onChangeBaseText,
  selectedCategory,
  customBusinessName,
  advertisingGoal,
  onChangeGoal,
  onOptimizeWithAI,
  isAiLoading
}) => {
  const businessDisplayName =
    selectedCategory.id === 'otro_negocio' && customBusinessName
      ? customBusinessName
      : selectedCategory.name;

  const handleUseExample = () => {
    onChangeBaseText(selectedCategory.sampleIdea);
  };

  return (
    <section id="step-4-text" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold text-sm">
            4
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Escribir texto o idea base
              {baseText.trim().length > 0 && (
                <span className="text-xs text-sky-300 font-medium bg-sky-950/60 px-2 py-0.5 rounded-full border border-sky-500/30">
                  {baseText.trim().split(/\s+/).length} palabras
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-400">
              Escribe qué quieres anunciar (tu producto, oferta, descuento o beneficio). La IA lo complementará y optimizará en el siguiente paso.
            </p>
          </div>
        </div>

        <button
          type="button"
          id="btn-use-idea-example"
          onClick={handleUseExample}
          className="text-xs bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-sky-200 border border-sky-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Cargar ejemplo sugerido</span>
          <span className="sm:hidden">Ejemplo</span>
        </button>
      </div>

      {/* Goal selector */}
      <div className="mb-3">
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
          Objetivo principal de esta publicidad:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {GOALS.map((g) => {
            const isSelected = advertisingGoal === g.id;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => onChangeGoal(g.id)}
                className={`py-2 px-2.5 rounded-xl text-xs font-medium border text-center transition cursor-pointer ${
                  isSelected
                    ? 'bg-sky-950/50 border-sky-400 text-sky-200 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {g.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Textarea */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
          <span>Tu mensaje, oferta o detalles:</span>
          <span className="text-[11px] text-slate-500 font-normal">
            No te preocupes si es corto o informal, la IA lo perfeccionará
          </span>
        </label>
        <div className="relative">
          <textarea
            id="input-base-text"
            rows={3}
            value={baseText}
            onChange={(e) => onChangeBaseText(e.target.value)}
            placeholder={`Ejemplo para ${businessDisplayName}: Promo especial de este fin de semana, 20% de descuento en el primer servicio o compra, envíos gratis y pedidos al WhatsApp 310-000-0000...`}
            className="w-full p-3 text-sm bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
          />
        </div>

        {/* Quick Action Bar under textarea */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
          <div className="flex items-center gap-2">
            {baseText.trim().length > 0 && (
              <button
                type="button"
                onClick={() => onChangeBaseText('')}
                className="text-[11px] text-slate-400 hover:text-rose-300 transition cursor-pointer"
              >
                Limpiar texto
              </button>
            )}
          </div>

          {onOptimizeWithAI && (
            <button
              type="button"
              onClick={onOptimizeWithAI}
              disabled={isAiLoading || !baseText.trim()}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-sky-600 hover:from-purple-500 hover:to-sky-500 text-white text-xs font-bold shadow-md shadow-purple-950/40 flex items-center gap-1.5 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
              <span>{isAiLoading ? 'Optimizando con IA...' : '✨ Complementar este texto con IA'}</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
