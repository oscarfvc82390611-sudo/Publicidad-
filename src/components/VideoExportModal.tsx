import React, { useState } from 'react';
import { ExportedVideo } from '../types';
import {
  X,
  Download,
  Share2,
  CheckCircle2,
  Smartphone,
  ExternalLink,
  Sparkles,
  Info,
  Play
} from 'lucide-react';
import { saveVideoToMobileOrShare, triggerDirectDownload } from '../utils/videoAdExporter';

interface VideoExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  exportedVideo: ExportedVideo | null;
  businessName: string;
  headlineText: string;
  ctaText: string;
}

export const VideoExportModal: React.FC<VideoExportModalProps> = ({
  isOpen,
  onClose,
  exportedVideo,
  businessName,
  headlineText,
  ctaText
}) => {
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  if (!isOpen || !exportedVideo) return null;

  const handleSaveToPhone = async () => {
    try {
      const result = await saveVideoToMobileOrShare(
        exportedVideo.file,
        `Anuncio - ${businessName}`,
        `${headlineText}\n\n${ctaText}`
      );
      if (result.method === 'web-share') {
        setSaveSuccess('¡Menú de tu celular abierto! Selecciona "Guardar video" para enviarlo a tu galería.');
      } else {
        setSaveSuccess('¡Descargando archivo de video en tu dispositivo!');
      }
      setTimeout(() => setSaveSuccess(null), 6000);
    } catch (e) {
      triggerDirectDownload(exportedVideo.file, exportedVideo.filename);
      setSaveSuccess('¡Descarga iniciada en tu celular!');
      setTimeout(() => setSaveSuccess(null), 5000);
    }
  };

  const handleDirectDownload = () => {
    triggerDirectDownload(exportedVideo.file, exportedVideo.filename);
    setSaveSuccess('¡Video descargado directamente a tus archivos!');
    setTimeout(() => setSaveSuccess(null), 5000);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `¡Mira el nuevo anuncio de ${businessName}!\n\n${headlineText}\n👉 ${ctaText}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const fileSizeMB = (exportedVideo.blob.size / (1024 * 1024)).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                ¡Tu Video Publicitario está listo!
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                  HD
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Archivo de video generado ({exportedVideo.extension.toUpperCase()} • {fileSizeMB} MB)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Video Player */}
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-[9/16] max-h-[340px] mx-auto border border-slate-800 shadow-2xl flex items-center justify-center">
            <video
              src={exportedVideo.videoUrl}
              controls
              playsInline
              autoPlay
              loop
              className="w-full h-full object-contain"
            />
          </div>

          {/* Alert / Success Toast */}
          {saveSuccess && (
            <div className="bg-emerald-950/80 border border-emerald-500/40 rounded-xl p-3 flex items-start gap-2.5 animate-in slide-in-from-top-2">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-200 font-medium leading-relaxed">
                {saveSuccess}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-1">
            {/* Primary: Save to Phone Gallery / Share */}
            <button
              type="button"
              onClick={handleSaveToPhone}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>Guardar en Fotos / Galería del Celular</span>
            </button>

            {/* Direct File Download */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleDirectDownload}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Descargar {exportedVideo.extension.toUpperCase()}</span>
              </button>

              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="py-2.5 px-3 rounded-xl bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-200 text-xs font-semibold border border-emerald-600/40 flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Abrir WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Mobile Instruction Guide */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
              <Info className="w-3.5 h-3.5 text-rose-400" />
              <span>¿Cómo guardar el video en la Galería de tu celular?</span>
            </div>

            <div className="text-[11px] text-slate-400 space-y-1.5 leading-relaxed">
              <p>
                <strong className="text-slate-200">📱 En iPhone (iOS):</strong> Al pulsar el botón verde arriba, aparecerá el menú de compartir de Apple. Desliza hacia abajo y toca <span className="text-amber-300 font-semibold">&ldquo;Guardar video&rdquo;</span>. El video se guardará en tu app <strong className="text-slate-300">Fotos</strong>.
              </p>
              <p>
                <strong className="text-slate-200">🤖 En Android:</strong> Pulsa el botón verde y elige <span className="text-amber-300 font-semibold">&ldquo;Guardar en Fotos&rdquo;</span> o pulsa <span className="text-slate-300 font-semibold">&ldquo;Descargar MP4&rdquo;</span>. Aparecerá de inmediato en tu app <strong className="text-slate-300">Galería</strong> o <strong className="text-slate-300">Google Fotos</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 truncate max-w-[240px]">
            {exportedVideo.filename}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
