import React, { useRef } from 'react';
import { MediaItem } from '../types';
import { Upload, Image as ImageIcon, Video as VideoIcon, Trash2, Plus, Sparkles, CheckCircle2 } from 'lucide-react';
import { SAMPLE_DEFAULT_MEDIA } from '../data/mockTemplatesAndData';

interface Step1MediaUploadProps {
  mediaItems: MediaItem[];
  onAddMedia: (items: MediaItem[]) => void;
  onRemoveMedia: (id: string) => void;
  onUseSampleMedia: () => void;
  onClearAllMedia?: () => void;
}

export const Step1MediaUpload: React.FC<Step1MediaUploadProps> = ({
  mediaItems,
  onAddMedia,
  onRemoveMedia,
  onUseSampleMedia,
  onClearAllMedia
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newItems: MediaItem[] = [];
    Array.from(files).forEach((file) => {
      const isVideo = file.type.startsWith('video');
      const isImage = file.type.startsWith('image');

      if (!isImage && !isVideo) return;

      const url = URL.createObjectURL(file);
      newItems.push({
        id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        type: isVideo ? 'video' : 'image',
        url,
        name: file.name,
        file
      });
    });

    if (newItems.length > 0) {
      onAddMedia(newItems);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  return (
    <section id="step-1-media" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold text-sm">
            1
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Subir fotos o videos
              {mediaItems.length > 0 && (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" /> {mediaItems.length} {mediaItems.length === 1 ? 'archivo' : 'archivos'}
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-400">
              Sube fotos o videos desde tu celular. Las fotos cobrarán vida con movimiento y efectos cinematográficos.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {mediaItems.length > 0 && onClearAllMedia && (
            <button
              type="button"
              onClick={onClearAllMedia}
              className="text-xs bg-slate-800/80 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer"
              title="Quitar todas las fotos para subir las tuyas propias"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Vaciar</span>
            </button>
          )}

          <button
            id="btn-use-samples"
            type="button"
            onClick={onUseSampleMedia}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-amber-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Usar fotos de muestra</span>
            <span className="sm:hidden">Muestra</span>
          </button>
        </div>
      </div>

      {/* Upload Drag & Drop Area */}
      <div
        id="dropzone-media"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-700 hover:border-rose-500/70 bg-slate-950/50 hover:bg-rose-950/10 rounded-xl p-6 text-center cursor-pointer transition group"
      >
        <input
          ref={fileInputRef}
          type="file"
          id="input-media-files"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="w-12 h-12 rounded-full bg-slate-800 group-hover:bg-rose-900/40 text-slate-300 group-hover:text-rose-400 flex items-center justify-center mx-auto mb-3 transition">
          <Upload className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-slate-200 mb-1">
          Toca aquí para seleccionar fotos o videos desde tu celular
        </p>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Admite formatos JPG, PNG, WEBP, MP4 y WEBM. Puedes subir varias fotos a la vez para crear una historia animada.
        </p>
      </div>

      {/* Media Thumbnails List */}
      {mediaItems.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Archivos añadidos ({mediaItems.length}):</span>
            <span className="text-slate-500">Se alternarán en la animación publicitaria</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {mediaItems.map((item, index) => (
              <div
                key={item.id}
                className="relative group rounded-xl overflow-hidden bg-slate-950 border border-slate-800 aspect-[9/16] shadow-sm"
              >
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <video
                    src={item.url}
                    className="w-full h-full object-cover"
                    muted
                  />
                )}

                {/* Badge Type */}
                <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[10px] font-medium text-white flex items-center gap-1">
                  {item.type === 'image' ? (
                    <ImageIcon className="w-2.5 h-2.5 text-amber-400" />
                  ) : (
                    <VideoIcon className="w-2.5 h-2.5 text-rose-400" />
                  )}
                  <span>{index + 1}</span>
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveMedia(item.id);
                  }}
                  className="absolute top-1.5 right-1.5 p-1 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white shadow opacity-90 group-hover:opacity-100 transition cursor-pointer"
                  title="Eliminar foto o video"
                >
                  <Trash2 className="w-3 h-3" />
                </button>

                <div className="absolute bottom-0 inset-x-0 p-1 bg-gradient-to-t from-black/80 to-transparent text-[10px] text-slate-300 truncate text-center">
                  {item.name}
                </div>
              </div>
            ))}

            {/* Quick Add more button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl border border-dashed border-slate-700 hover:border-slate-500 flex flex-col items-center justify-center text-slate-400 hover:text-slate-200 aspect-[9/16] p-2 transition cursor-pointer bg-slate-950/40"
            >
              <Plus className="w-6 h-6 mb-1 text-slate-500" />
              <span className="text-[11px] font-medium text-center">Añadir más</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
