import React, { useState } from 'react';
import { BusinessCategory } from '../types';
import { BUSINESS_CATEGORIES } from '../data/mockTemplatesAndData';
import {
  Sparkles,
  Utensils,
  ShoppingBag,
  Scissors,
  Dumbbell,
  Home,
  Smartphone,
  Car,
  HeartHandshake,
  GraduationCap,
  Briefcase,
  Gift,
  Search,
  Check,
  Building2
} from 'lucide-react';

interface Step3BusinessTypeProps {
  selectedCategory: BusinessCategory;
  customBusinessName: string;
  onSelectCategory: (cat: BusinessCategory) => void;
  onChangeCustomName: (name: string) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-5 h-5 text-amber-400" />,
  Utensils: <Utensils className="w-5 h-5 text-orange-400" />,
  ShoppingBag: <ShoppingBag className="w-5 h-5 text-pink-400" />,
  Scissors: <Scissors className="w-5 h-5 text-rose-400" />,
  Dumbbell: <Dumbbell className="w-5 h-5 text-emerald-400" />,
  Home: <Home className="w-5 h-5 text-sky-400" />,
  Smartphone: <Smartphone className="w-5 h-5 text-cyan-400" />,
  Car: <Car className="w-5 h-5 text-blue-400" />,
  HeartHandshake: <HeartHandshake className="w-5 h-5 text-teal-400" />,
  GraduationCap: <GraduationCap className="w-5 h-5 text-indigo-400" />,
  Briefcase: <Briefcase className="w-5 h-5 text-purple-400" />,
  Gift: <Gift className="w-5 h-5 text-fuchsia-400" />
};

export const Step3BusinessType: React.FC<Step3BusinessTypeProps> = ({
  selectedCategory,
  customBusinessName,
  onSelectCategory,
  onChangeCustomName
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const isOther = selectedCategory.id === 'otro_negocio';

  const filteredCategories = BUSINESS_CATEGORIES.filter((cat) => {
    if (cat.id === 'otro_negocio') return true; // Always show 'OTRO TIPO DE NEGOCIO'
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      cat.name.toLowerCase().includes(q) ||
      cat.description.toLowerCase().includes(q) ||
      cat.keywords.some((k) => k.toLowerCase().includes(q))
    );
  });

  const popularOtherSuggestions = [
    'Pastelería & Tortas Personalizadas',
    'Cerrajería 24 Horas',
    'Estudio de Tatuajes & Piercing',
    'Decoración & Globos para Fiestas',
    'Lavandería & Tintorería Express',
    'Agencia de Viajes & Excursiones',
    'Ferretería & Materiales',
    'Clases de Baile & Ritmos',
    'Venta de Repuestos & Baterías',
    'Diseño Gráfico & Imprenta Digital'
  ];

  return (
    <section id="step-3-business" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-sm">
            3
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Escoger tipo de negocio
              <span className="text-xs text-emerald-300 font-medium bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                {isOther && customBusinessName ? customBusinessName : selectedCategory.name}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Selecciona tu sector o pulsa &ldquo;OTRO TIPO DE NEGOCIO&rdquo; para personalizar cualquier actividad comercial.
            </p>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="input-search-business"
            placeholder="Buscar tu rubro o servicio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>
      </div>

      {/* Featured Card: OTRO TIPO DE NEGOCIO */}
      <div
        id="card-otro-tipo-negocio"
        onClick={() => {
          const otro = BUSINESS_CATEGORIES.find((c) => c.id === 'otro_negocio')!;
          onSelectCategory(otro);
        }}
        className={`mb-4 p-4 rounded-xl border transition cursor-pointer ${
          isOther
            ? 'bg-gradient-to-r from-emerald-950/50 via-teal-950/40 to-slate-900 border-emerald-500 shadow-lg shadow-emerald-950/40'
            : 'bg-slate-950/80 border-dashed border-emerald-500/50 hover:border-emerald-400 hover:bg-emerald-950/20'
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-emerald-300 tracking-wide">
                  ⭐ OTRO TIPO DE NEGOCIO
                </h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">
                  Personalizado
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                ¿Tu negocio no está en la lista? Escribe exactamente qué vendes o qué servicio ofreces.
              </p>
            </div>
          </div>

          <div
            className={`w-6 h-6 rounded-full border flex items-center justify-center transition shrink-0 ${
              isOther
                ? 'bg-emerald-500 border-emerald-400 text-black'
                : 'border-slate-700 bg-slate-900'
            }`}
          >
            {isOther && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </div>
        </div>

        {/* Custom Input Field when selected */}
        {isOther && (
          <div className="mt-3 pt-3 border-t border-emerald-500/20" onClick={(e) => e.stopPropagation()}>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Escribe el nombre o rubro exacto de tu negocio:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="input-custom-business-name"
                value={customBusinessName}
                onChange={(e) => onChangeCustomName(e.target.value)}
                placeholder="Ej: Taller de Cerrajería 24H, Venta de Perfumes Árabes, Escuela de Natación..."
                className="flex-1 px-3.5 py-2 text-sm bg-slate-950 border border-emerald-500/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                autoFocus
              />
            </div>

            {/* Quick Suggestions Chips */}
            <div className="mt-2.5">
              <span className="text-[11px] text-slate-400 block mb-1.5">Sugerencias rápidas:</span>
              <div className="flex flex-wrap gap-1.5">
                {popularOtherSuggestions.map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => onChangeCustomName(sug)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-emerald-900/40 text-slate-300 hover:text-emerald-200 border border-slate-800 hover:border-emerald-500/40 transition cursor-pointer"
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
        {filteredCategories
          .filter((cat) => cat.id !== 'otro_negocio')
          .map((cat) => {
            const isSelected = selectedCategory.id === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat)}
                className={`p-3 rounded-xl border flex items-start justify-between gap-3 cursor-pointer transition ${
                  isSelected
                    ? 'bg-emerald-950/30 border-emerald-500 shadow-md shadow-emerald-950/20'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                    {ICON_MAP[cat.iconName] || <Building2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs font-bold leading-snug ${isSelected ? 'text-emerald-300' : 'text-slate-200'}`}>
                      {cat.name}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-1 transition ${
                    isSelected
                      ? 'bg-emerald-500 border-emerald-400 text-black'
                      : 'border-slate-700 bg-slate-900'
                  }`}
                >
                  {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
};
