import React, { useState } from 'react';
import { EducationLesson, BusinessCategory } from '../types';
import { EDUCATION_LESSONS } from '../data/mockTemplatesAndData';
import {
  GraduationCap,
  X,
  BookOpen,
  Camera,
  Sparkles,
  Palette,
  Clock,
  CheckCircle2,
  Lightbulb,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

interface MarketingAcademyModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: BusinessCategory;
  customBusinessName: string;
}

export const MarketingAcademyModal: React.FC<MarketingAcademyModalProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  customBusinessName
}) => {
  const [activeLessonId, setActiveLessonId] = useState<string>(EDUCATION_LESSONS[0].id);
  const [aiTip, setAiTip] = useState<{
    tipTitle: string;
    actionableAdvice: string;
    checklist: string[];
  } | null>(null);
  const [isLoadingTip, setIsLoadingTip] = useState(false);

  const businessDisplayName =
    selectedCategory.id === 'otro_negocio' && customBusinessName
      ? customBusinessName
      : selectedCategory.name;

  const currentLesson =
    EDUCATION_LESSONS.find((l) => l.id === activeLessonId) || EDUCATION_LESSONS[0];

  const handleFetchAiTip = async () => {
    setIsLoadingTip(true);
    try {
      const res = await fetch('/api/ai/marketing-tip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessType: businessDisplayName,
          topic: 'Cómo maximizar ventas y atención con anuncios de celular'
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAiTip(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingTip(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="modal-academy"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white leading-tight font-['Outfit',sans-serif]">
                Academia Integrada de Diseño & Marketing Digital
              </h2>
              <p className="text-xs text-slate-400">
                Aprende técnicas profesionales para crear publicidad que convierta desde el móvil
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Lessons Horizontal Navigation */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {EDUCATION_LESSONS.map((lesson) => {
              const isSelected = activeLessonId === lesson.id;
              return (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => setActiveLessonId(lesson.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-950/50'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {lesson.title.split(':')[0]}
                </button>
              );
            })}
          </div>

          {/* Active Lesson View */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-bold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-500/30">
                {currentLesson.category} • Lectura de {currentLesson.readTimeMinutes} min
              </span>
            </div>

            <h3 className="text-base font-bold text-white mb-2 font-['Outfit',sans-serif]">
              {currentLesson.title}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 mb-3.5">
              {currentLesson.summary}
            </p>

            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
              Puntos Clave Accionables:
            </h4>
            <ul className="space-y-2 mb-4">
              {currentLesson.bulletPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <div className="p-3 rounded-xl bg-gradient-to-r from-amber-950/40 via-yellow-950/20 to-slate-900 border border-amber-500/30 flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-bold text-amber-300 block mb-0.5">
                  Consejo Pro para tu celular:
                </span>
                <p className="text-xs text-amber-100/90 leading-relaxed">
                  {currentLesson.proTip}
                </p>
              </div>
            </div>
          </div>

          {/* AI Tailored Advice for this specific business */}
          <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                  Consejo de Marketing Personalizado para &ldquo;{businessDisplayName}&rdquo;
                </h4>
              </div>

              <button
                type="button"
                onClick={handleFetchAiTip}
                disabled={isLoadingTip}
                className="text-xs bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/40 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto disabled:opacity-50"
              >
                {isLoadingTip ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Consultando estratega IA...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generar Consejo para mi negocio</span>
                  </>
                )}
              </button>
            </div>

            {aiTip ? (
              <div className="space-y-2.5">
                <p className="text-xs font-bold text-white">
                  {aiTip.tipTitle}
                </p>
                <p className="text-xs text-slate-300 leading-relaxed bg-indigo-950/20 p-2.5 rounded-lg border border-indigo-500/20">
                  {aiTip.actionableAdvice}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {aiTip.checklist.map((item, i) => (
                    <div
                      key={i}
                      className="text-[11px] text-slate-300 bg-slate-900 p-2 rounded-md border border-slate-800 flex items-start gap-1.5"
                    >
                      <span className="text-indigo-400 font-bold">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                Toca el botón superior para que la IA analice las mejores prácticas publicitarias de {businessDisplayName} y te entregue una estrategia directa.
              </p>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition cursor-pointer"
          >
            Cerrar Academia
          </button>
        </div>
      </div>
    </div>
  );
};
