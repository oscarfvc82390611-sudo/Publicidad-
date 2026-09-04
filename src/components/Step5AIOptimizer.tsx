import React, { useState } from 'react';
import { AIOptimizationResult, BusinessCategory } from '../types';
import {
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Megaphone,
  Hash,
  Clock,
  Target,
  Mic,
  MessageSquare,
  Flame,
  Share2
} from 'lucide-react';

interface Step5AIOptimizerProps {
  baseText: string;
  selectedCategory: BusinessCategory;
  customBusinessName: string;
  advertisingGoal: string;
  aiResult: AIOptimizationResult | null;
  onApplyResult: (result: AIOptimizationResult) => void;
  isLoading: boolean;
  onGenerate: () => void;
}

export const Step5AIOptimizer: React.FC<Step5AIOptimizerProps> = ({
  baseText,
  selectedCategory,
  customBusinessName,
  advertisingGoal,
  aiResult,
  onApplyResult,
  isLoading,
  onGenerate
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const businessDisplayName =
    selectedCategory.id === 'otro_negocio' && customBusinessName
      ? customBusinessName
      : selectedCategory.name;

  const handleCopy = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <section id="step-5-ai" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold text-sm">
            5
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Que la IA complemente y optimice dicho texto
              {aiResult && (
                <span className="text-xs text-purple-300 font-medium bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-500/30 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Optimizado
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-400">
              Gemini AI complementará tu texto con técnicas de copywriting, titulares magnéticos, hashtags virales y guion para voz.
            </p>
          </div>
        </div>
      </div>

      {/* Main AI Generation CTA Button */}
      <div className="mb-5">
        <button
          id="btn-generate-ai-copy"
          type="button"
          onClick={onGenerate}
          disabled={isLoading}
          className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white font-bold text-sm shadow-lg shadow-purple-950/50 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Optimizando con IA y analizando algoritmos de redes sociales...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition" />
              <span>
                {aiResult
                  ? '✨ Regenerar y crear nuevas variantes con IA'
                  : `✨ Complementar y Optimizar texto para ${businessDisplayName}`}
              </span>
            </>
          )}
        </button>
      </div>

      {/* AI Results Display */}
      {aiResult ? (
        <div className="space-y-4">
          {/* Card 1: Headline & Optimized copy */}
          <div className="bg-slate-950 p-4 rounded-xl border border-purple-500/30">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Flame className="w-4 h-4 text-amber-400" /> Titular Magnético para la Publicidad
              </span>
              <button
                type="button"
                onClick={() => handleCopy(aiResult.headline, 'headline')}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === 'headline' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>Copiar</span>
              </button>
            </div>
            <p className="text-base font-extrabold text-white mb-3 tracking-tight font-['Outfit',sans-serif]">
              &ldquo;{aiResult.headline}&rdquo;
            </p>

            <span className="text-xs font-semibold text-slate-400 block mb-1">
              Texto publicitario complementado:
            </span>
            <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/70 p-3 rounded-lg border border-slate-800">
              {aiResult.optimizedCopy}
            </p>
          </div>

          {/* Card 2: Voiceover Script & Call to action */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Mic className="w-3.5 h-3.5 text-indigo-400" /> Guion para Voz Profesional (Paso 6)
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(aiResult.voiceoverScript, 'voice')}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {copiedSection === 'voice' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>Copiar</span>
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic bg-indigo-950/20 p-2.5 rounded-lg border border-indigo-500/20">
                &ldquo;{aiResult.voiceoverScript}&rdquo;
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Megaphone className="w-3.5 h-3.5 text-rose-400" /> Llamado a la Acción (CTA)
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(aiResult.callToAction, 'cta')}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {copiedSection === 'cta' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>Copiar</span>
                </button>
              </div>
              <p className="text-xs font-bold text-rose-200 bg-rose-950/20 p-2.5 rounded-lg border border-rose-500/20">
                {aiResult.callToAction}
              </p>
            </div>
          </div>

          {/* Card 3: Social Media Post Caption & Hashtags */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Share2 className="w-3.5 h-3.5" /> Copy listo para Instagram, TikTok y Facebook
              </span>
              <button
                type="button"
                id="btn-copy-full-post"
                onClick={() =>
                  handleCopy(
                    `${aiResult.socialPostCaption}\n\n${aiResult.hashtags.join(' ')}`,
                    'full_post'
                  )
                }
                className="text-xs bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-500/40 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition"
              >
                {copiedSection === 'full_post' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>Copiar Publicación Completa</span>
              </button>
            </div>
            <pre className="text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 max-h-48 overflow-y-auto">
              {aiResult.socialPostCaption}
            </pre>

            {/* Hashtags */}
            <div className="mt-3">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mb-1.5">
                <Hash className="w-3 h-3 text-emerald-400" /> Hashtags sugeridos por IA:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {aiResult.hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] bg-slate-900 border border-slate-700 text-emerald-400 px-2 py-0.5 rounded-md font-mono"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Card 4: Best Posting times & Audience Strategy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider mb-2">
                <Clock className="w-3.5 h-3.5" /> Horarios de Mayor Alcance para {businessDisplayName}
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {aiResult.bestPostingTimes.map((time, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>{time}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5 uppercase tracking-wider mb-2">
                <Target className="w-3.5 h-3.5" /> Sugerencia de Audiencia Objetivo
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {aiResult.targetAudienceInsights}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 px-4 rounded-xl bg-slate-950/40 border border-slate-800/80">
          <p className="text-xs text-slate-400">
            Haz clic en el botón superior para que la IA tome tu mensaje y lo convierta en un anuncio profesional de alto impacto.
          </p>
        </div>
      )}
    </section>
  );
};
