export type MediaType = 'image' | 'video';

export interface MediaItem {
  id: string;
  type: MediaType;
  url: string;
  name: string;
  duration?: number;
  aspectRatio?: string;
  file?: File;
}

export interface AudioTrack {
  id: string;
  title: string;
  category: string;
  duration: string;
  url: string;
  isCustom?: boolean;
}

export interface BusinessCategory {
  id: string;
  name: string;
  iconName: string;
  description: string;
  recommendedTone: string;
  sampleIdea: string;
  keywords: string[];
}

export interface AIOptimizationResult {
  headline: string;
  optimizedCopy: string;
  callToAction: string;
  socialPostCaption: string;
  hashtags: string[];
  voiceoverScript: string;
  bestPostingTimes: string[];
  targetAudienceInsights: string;
}

export type AvatarDisplayMode = 'circle-pip' | 'bottom-card' | 'audio-only';

export interface AIVoice {
  id: string;
  name: string;
  avatarRole: string;
  avatarImage: string;
  gender: 'Femenina' | 'Masculina';
  style: string;
  description: string;
  previewQuote: string;
  recommendedFor: string;
  apiVoiceName: string; // Kore, Fenrir, Puck, Zephyr, Charon
  badge: string;
  accentColor: string;
}

export type AnimationEffect = 'kenburns' | 'neonpulse' | 'elegantfade' | 'glitchurban' | 'storyzoom';

export interface AnimatedTemplate {
  id: AnimationEffect;
  name: string;
  description: string;
  badge: string;
  previewBg: string;
  transitionType: string;
}

export interface ScheduledPost {
  id: string;
  businessName: string;
  headline: string;
  date: string;
  time: string;
  platforms: ('instagram' | 'facebook' | 'tiktok' | 'whatsapp')[];
  caption: string;
  hashtags: string[];
  status: 'scheduled' | 'published' | 'draft';
}

export interface EducationLesson {
  id: string;
  category: 'Diseño Móvil' | 'Copywriting' | 'Estrategia de Redes' | 'Ventas WhatsApp';
  title: string;
  readTimeMinutes: number;
  summary: string;
  bulletPoints: string[];
  proTip: string;
}

export interface ExportedVideo {
  blob: Blob;
  file: File;
  videoUrl: string;
  filename: string;
  mimeType: string;
  extension: string;
  duration: number;
}

export type ImageFitMode = 'contain' | 'cover';

export interface AdDisplaySettings {
  imageFitMode: ImageFitMode;
  showOverlayTexts: boolean; // Master toggle: clean photo/video vs overlay text cards
  showPromoBadge: boolean;
  showHeadlineBox: boolean;
  showCtaButton: boolean;
}
