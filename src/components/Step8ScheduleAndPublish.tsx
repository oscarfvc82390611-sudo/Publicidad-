import React, { useState } from 'react';
import { ScheduledPost, AIOptimizationResult, BusinessCategory } from '../types';
import {
  Calendar,
  Clock,
  Send,
  Share2,
  Check,
  Instagram,
  Facebook,
  MessageCircle,
  Copy,
  Plus,
  Trash2,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface Step8ScheduleAndPublishProps {
  aiResult: AIOptimizationResult | null;
  baseText: string;
  selectedCategory: BusinessCategory;
  customBusinessName: string;
}

export const Step8ScheduleAndPublish: React.FC<Step8ScheduleAndPublishProps> = ({
  aiResult,
  baseText,
  selectedCategory,
  customBusinessName
}) => {
  const businessDisplayName =
    selectedCategory.id === 'otro_negocio' && customBusinessName
      ? customBusinessName
      : selectedCategory.name;

  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('19:30');
  const [selectedPlatforms, setSelectedPlatforms] = useState<('instagram' | 'facebook' | 'tiktok' | 'whatsapp')[]>([
    'instagram',
    'tiktok',
    'facebook',
    'whatsapp'
  ]);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([
    {
      id: 'demo-post-1',
      businessName: businessDisplayName,
      headline: aiResult?.headline || 'Gran Oferta de Fin de Semana',
      date: '2026-09-05',
      time: '19:30',
      platforms: ['instagram', 'tiktok', 'facebook', 'whatsapp'],
      caption: aiResult?.socialPostCaption || '¡No te pierdas nuestra nueva promoción!',
      hashtags: aiResult?.hashtags || ['#NegocioLocal', '#Oferta'],
      status: 'scheduled'
    }
  ]);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [justScheduled, setJustScheduled] = useState(false);

  const togglePlatform = (p: 'instagram' | 'facebook' | 'tiktok' | 'whatsapp') => {
    if (selectedPlatforms.includes(p)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter((item) => item !== p));
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  const handleSchedule = () => {
    const newPost: ScheduledPost = {
      id: `post-${Date.now()}`,
      businessName: businessDisplayName,
      headline: aiResult?.headline || (baseText ? baseText.slice(0, 40) : 'Publicación Publicitaria'),
      date,
      time,
      platforms: [...selectedPlatforms],
      caption: aiResult?.socialPostCaption || baseText || '¡Descubre lo mejor de nuestro negocio!',
      hashtags: aiResult?.hashtags || ['#Marketing', '#Negocio'],
      status: 'scheduled'
    };

    setScheduledPosts((prev) => [newPost, ...prev]);
    setJustScheduled(true);
    setTimeout(() => setJustScheduled(false), 3500);
  };

  const handleDeletePost = (id: string) => {
    setScheduledPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleShareDirect = async () => {
    const shareText = `${aiResult?.socialPostCaption || baseText}\n\n${aiResult?.hashtags?.join(' ') || ''}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Publicidad: ${businessDisplayName}`,
          text: shareText
        });
      } catch (err) {
        // User cancelled or share not supported
      }
    } else {
      navigator.clipboard.writeText(shareText);
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2500);
    }
  };

  return (
    <section id="step-8-schedule" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center font-bold text-sm">
            8
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Herramienta de programación automática para redes sociales
            </h2>
            <p className="text-xs text-slate-400">
              Asegura visibilidad constante en todas tus plataformas digitales publicando en los horarios pico recomendados.
            </p>
          </div>
        </div>
      </div>

      {/* Date & Time Input Box */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-teal-400" /> Fecha de publicación:
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-teal-400" /> Hora estratégica:
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Horario óptimo sugerido por IA:
            </label>
            <button
              type="button"
              onClick={() => {
                setTime('19:45');
              }}
              className="w-full px-3 py-2 text-xs bg-teal-950/60 hover:bg-teal-900/60 border border-teal-500/40 text-teal-200 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>Aplicar 7:45 PM (Pico nocturno)</span>
            </button>
          </div>
        </div>

        {/* Platform Checkboxes */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Canales de difusión simultánea:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => togglePlatform('instagram')}
              className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-medium transition cursor-pointer ${
                selectedPlatforms.includes('instagram')
                  ? 'bg-gradient-to-r from-pink-950/40 to-purple-950/40 border-pink-500 text-pink-200'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <span className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-pink-400" />
                <span>Instagram Reels</span>
              </span>
              {selectedPlatforms.includes('instagram') && <Check className="w-3.5 h-3.5 text-pink-400" />}
            </button>

            <button
              type="button"
              onClick={() => togglePlatform('tiktok')}
              className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-medium transition cursor-pointer ${
                selectedPlatforms.includes('tiktok')
                  ? 'bg-slate-900 border-teal-400 text-teal-200'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="font-bold text-teal-400 text-xs">TT</span>
                <span>TikTok Video</span>
              </span>
              {selectedPlatforms.includes('tiktok') && <Check className="w-3.5 h-3.5 text-teal-400" />}
            </button>

            <button
              type="button"
              onClick={() => togglePlatform('facebook')}
              className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-medium transition cursor-pointer ${
                selectedPlatforms.includes('facebook')
                  ? 'bg-blue-950/40 border-blue-500 text-blue-200'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <span className="flex items-center gap-2">
                <Facebook className="w-4 h-4 text-blue-400" />
                <span>Facebook Ads</span>
              </span>
              {selectedPlatforms.includes('facebook') && <Check className="w-3.5 h-3.5 text-blue-400" />}
            </button>

            <button
              type="button"
              onClick={() => togglePlatform('whatsapp')}
              className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-medium transition cursor-pointer ${
                selectedPlatforms.includes('whatsapp')
                  ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <span className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Estados</span>
              </span>
              {selectedPlatforms.includes('whatsapp') && <Check className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
          </div>
        </div>

        {/* Action button: Schedule */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-2">
          <button
            type="button"
            id="btn-schedule-post-now"
            onClick={handleSchedule}
            className="w-full sm:w-auto flex-1 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md shadow-teal-950/50 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Programar Publicación Automática en Redes</span>
          </button>

          <button
            type="button"
            id="btn-share-direct-phone"
            onClick={handleShareDirect}
            className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            {copiedCaption ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>¡Copiado para publicar ahora!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-teal-400" />
                <span>Publicar Ahora desde el Celular</span>
              </>
            )}
          </button>
        </div>

        {justScheduled && (
          <div className="mt-3 p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              ¡Anuncio programado exitosamente para el <strong>{date}</strong> a las{' '}
              <strong>{time}</strong>! Se activará la alerta y recordatorio automático en tus canales.
            </span>
          </div>
        )}
      </div>

      {/* Scheduled Queue List */}
      <div>
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-teal-400" /> Publicaciones en Cola de Difusión ({scheduledPosts.length}):
        </h3>

        <div className="space-y-2">
          {scheduledPosts.map((post) => (
            <div
              key={post.id}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-white truncate">
                    {post.headline}
                  </span>
                  <span className="text-[10px] bg-teal-500/20 text-teal-400 border border-teal-500/30 px-1.5 py-0.2 rounded font-medium">
                    Programado
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 text-slate-300">
                    <Calendar className="w-3 h-3 text-teal-400" /> {post.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <Clock className="w-3 h-3 text-teal-400" /> {post.time}
                  </span>
                  <span>•</span>
                  <span className="text-slate-500">
                    Canales: {post.platforms.join(', ')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(post.caption);
                  }}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                  title="Copiar texto de publicación"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeletePost(post.id)}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                  title="Eliminar de la cola"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
