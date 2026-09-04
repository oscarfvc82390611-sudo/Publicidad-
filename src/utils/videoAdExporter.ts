import {
  MediaItem,
  AnimatedTemplate,
  AIVoice,
  AvatarDisplayMode,
  AudioTrack,
  ExportedVideo,
  AdDisplaySettings,
  ImageFitMode
} from '../types';
import { audioEngine, base64ToArrayBuffer } from './audioEngine';

export interface ExportVideoOptions {
  mediaItems: MediaItem[];
  selectedTemplate: AnimatedTemplate;
  selectedVoice: AIVoice;
  enableVoiceover: boolean;
  avatarDisplayMode?: AvatarDisplayMode;
  aspectRatio: '9:16' | '1:1' | '16:9';
  promoBadgeText: string;
  headlineText: string;
  pitchText: string;
  voiceoverScript?: string;
  ctaText: string;
  businessName: string;
  categoryName: string;
  brandColor: string;
  selectedTrack: AudioTrack | null;
  musicVolume: number;
  durationSeconds?: number;
  displaySettings?: AdDisplaySettings;
  onProgress?: (progressPercent: number, statusText: string) => void;
}

// Check which video MIME type is best supported by current browser (iOS Safari vs Chrome Android/Desktop)
export function getOptimalVideoMimeType(): { mimeType: string; extension: string } {
  if (typeof window === 'undefined' || typeof MediaRecorder === 'undefined') {
    return { mimeType: 'video/webm', extension: 'webm' };
  }

  const preferredFormats = [
    { mime: 'video/mp4;codecs=avc1,mp4a.40.2', ext: 'mp4' },
    { mime: 'video/mp4;codecs=avc1', ext: 'mp4' },
    { mime: 'video/mp4', ext: 'mp4' },
    { mime: 'video/webm;codecs=vp9,opus', ext: 'webm' },
    { mime: 'video/webm;codecs=vp8,opus', ext: 'webm' },
    { mime: 'video/webm', ext: 'webm' }
  ];

  for (const fmt of preferredFormats) {
    if (MediaRecorder.isTypeSupported(fmt.mime)) {
      return { mimeType: fmt.mime, extension: fmt.ext };
    }
  }

  return { mimeType: 'video/webm', extension: 'webm' };
}

// Helper to load HTML images with CORS safety
function loadImage(url: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      // Retry without anonymous flag in case of strict origin response
      const fallback = new Image();
      fallback.onload = () => resolve(fallback);
      fallback.onerror = () => resolve(null);
      fallback.src = url;
    };
    img.src = url;
  });
}

// Draw rounded rectangle helper for canvas
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// Multiline text wrapping helper
function wrapAndDrawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number = 3
): number {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  let linesCount = 0;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
      linesCount++;
      if (linesCount >= maxLines - 1 && n < words.length - 1) {
        // Truncate remaining
        const remaining = words.slice(n).join(' ');
        const truncated = remaining.slice(0, 24) + '...';
        ctx.fillText(truncated, x, currentY);
        return currentY + lineHeight;
      }
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
  return currentY + lineHeight;
}

// Main video exporter function
export async function renderAndExportVideo(options: ExportVideoOptions): Promise<ExportedVideo> {
  const {
    mediaItems,
    selectedTemplate,
    selectedVoice,
    enableVoiceover,
    avatarDisplayMode,
    aspectRatio,
    promoBadgeText,
    headlineText,
    pitchText,
    voiceoverScript,
    ctaText,
    businessName,
    categoryName,
    selectedTrack,
    musicVolume,
    durationSeconds = 8.5,
    displaySettings,
    onProgress
  } = options;

  onProgress?.(5, 'Iniciando motor de renderizado de video...');

  // 1. Dimensions setup based on aspect ratio
  let width = 720;
  let height = 1280; // 9:16 HD vertical (Reels, TikTok, WhatsApp Status)
  if (aspectRatio === '1:1') {
    width = 720;
    height = 720;
  } else if (aspectRatio === '16:9') {
    width = 1280;
    height = 720;
  }

  // 2. Offscreen Canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) {
    throw new Error('No se pudo inicializar el contexto 2D del Canvas');
  }

  // 3. Preload all media images and avatar
  onProgress?.(15, 'Cargando fotos de alta definición...');
  const loadedMediaImages: HTMLImageElement[] = [];
  for (const item of mediaItems) {
    if (item.url) {
      const img = await loadImage(item.url);
      if (img) loadedMediaImages.push(img);
    }
  }

  // Fallback default image if none loaded
  if (loadedMediaImages.length === 0) {
    const fallbackCanvas = document.createElement('canvas');
    fallbackCanvas.width = width;
    fallbackCanvas.height = height;
    const fctx = fallbackCanvas.getContext('2d')!;
    fctx.fillStyle = '#0f172a';
    fctx.fillRect(0, 0, width, height);
    const fImg = new Image();
    fImg.src = fallbackCanvas.toDataURL();
    loadedMediaImages.push(fImg);
  }

  // Preload Avatar image if voiceover is on
  let loadedAvatarImg: HTMLImageElement | null = null;
  if (selectedVoice?.avatarImage) {
    loadedAvatarImg = await loadImage(selectedVoice.avatarImage);
  }

  // 4. Setup AudioContext and Stream Mixing
  onProgress?.(25, 'Sincronizando voz de locutor y música de fondo...');
  let audioContext: AudioContext | null = null;
  let audioDest: MediaStreamAudioDestinationNode | null = null;
  let voiceDurationSeconds = 0;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioContext = new AudioContextClass();
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      audioDest = audioContext.createMediaStreamDestination();

      // Mix Voiceover if enabled: use exact voiceover script as heard in preview
      if (enableVoiceover && selectedVoice) {
        const scriptToSpeak =
          voiceoverScript ||
          pitchText ||
          `${headlineText}. ${ctaText}`;

        onProgress?.(28, `Sincronizando voz de ${selectedVoice.name.split(' ')[0]} con tu guion...`);

        const voiceData = await audioEngine.getVoiceoverArrayBuffer(
          scriptToSpeak,
          selectedVoice.apiVoiceName,
          selectedVoice.id
        );

        if (voiceData && voiceData.arrayBuffer) {
          try {
            const voiceBuffer = await audioContext.decodeAudioData(voiceData.arrayBuffer.slice(0));
            voiceDurationSeconds = voiceBuffer.duration;
            if (audioContext && audioDest) {
              const source = audioContext.createBufferSource();
              source.buffer = voiceBuffer;
              const gainNode = audioContext.createGain();
              gainNode.gain.value = 1.0;
              source.connect(gainNode);
              gainNode.connect(audioDest);
              source.start(audioContext.currentTime + 0.3); // Smooth 300ms lead-in
            }
          } catch (voiceDecodeErr) {
            console.warn('Notice decoding voice audio:', voiceDecodeErr);
          }
        }
      }

      // Mix Background Music or Harmonic Bed
      if (selectedTrack && selectedTrack.url) {
        let musicDecoded = false;
        try {
          // Fetch raw audio stream to decode reliably (supports custom uploaded mobile MP3, WAV, M4A)
          const trackResp = await fetch(selectedTrack.url);
          if (trackResp.ok) {
            const trackArrayBuf = await trackResp.arrayBuffer();
            const musicBuffer = await audioContext.decodeAudioData(trackArrayBuf.slice(0));
            const musicSource = audioContext.createBufferSource();
            musicSource.buffer = musicBuffer;
            musicSource.loop = true;
            const musicGain = audioContext.createGain();
            // Respect user's selected music volume directly
            musicGain.gain.value = Math.max(0.05, Math.min(1, musicVolume));
            musicSource.connect(musicGain);
            musicGain.connect(audioDest);
            musicSource.start(0);
            musicDecoded = true;
          }
        } catch (fetchErr) {
          console.warn('Direct audio decoding note, using warm harmonic ambient bed:', fetchErr);
        }

        if (!musicDecoded) {
          createHarmonicBackingTrack(audioContext, audioDest, musicVolume);
        }
      } else {
        createHarmonicBackingTrack(audioContext, audioDest, 0.25);
      }
    }
  } catch (audioErr) {
    console.warn('Audio setup notice:', audioErr);
  }

  // 5. Setup MediaRecorder with Optimal Supported MIME type
  const mimeInfo = getOptimalVideoMimeType();
  const canvasStream = canvas.captureStream(30);

  // Attach audio tracks to canvas stream if available
  if (audioDest && audioDest.stream.getAudioTracks().length > 0) {
    const audioTrack = audioDest.stream.getAudioTracks()[0];
    canvasStream.addTrack(audioTrack);
  }

  let recorder: MediaRecorder;
  try {
    recorder = new MediaRecorder(canvasStream, {
      mimeType: mimeInfo.mimeType,
      videoBitsPerSecond: 2800000 // 2.8 Mbps crisp mobile HD
    });
  } catch {
    // Fallback if specific codec is unsupported
    recorder = new MediaRecorder(canvasStream);
  }

  const recordedChunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) {
      recordedChunks.push(e.data);
    }
  };

  // Determine total duration: video must comfortably contain the complete voice narration
  let finalDurationSeconds = durationSeconds || 15;
  if (voiceDurationSeconds > 0) {
    // Ensure the voiceover completes with 1.2s outro breathing room
    finalDurationSeconds = Math.max(finalDurationSeconds, Math.ceil(voiceDurationSeconds + 1.2));
  }

  // 6. Execute Real-Time Frame Rendering Loop
  return new Promise((resolve, reject) => {
    recorder.onstop = () => {
      onProgress?.(96, 'Generando archivo de video final para tu celular...');
      try {
        const finalBlob = new Blob(recordedChunks, { type: mimeInfo.mimeType });
        const cleanBiz = businessName ? businessName.replace(/[^a-zA-Z0-9]/g, '_') : 'Mi_Negocio';
        const filename = `Anuncio_${cleanBiz}_${aspectRatio.replace(':', 'x')}.${mimeInfo.extension}`;
        const file = new File([finalBlob], filename, { type: mimeInfo.mimeType });
        const videoUrl = URL.createObjectURL(finalBlob);

        // Clean up audio context
        if (audioContext && audioContext.state !== 'closed') {
          audioContext.close().catch(() => {});
        }

        onProgress?.(100, '¡Video renderizado con éxito!');

        resolve({
          blob: finalBlob,
          file,
          videoUrl,
          filename,
          mimeType: mimeInfo.mimeType,
          extension: mimeInfo.extension,
          duration: finalDurationSeconds
        });
      } catch (err) {
        reject(err);
      }
    };

    recorder.onerror = (e) => {
      reject(new Error(`MediaRecorder error: ${e}`));
    };

    recorder.start(100);

    const startTime = performance.now();
    const totalDurationMs = finalDurationSeconds * 1000;

    function renderFrame() {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / totalDurationMs, 1);

      // Draw single frame on canvas
      drawAdFrame({
        ctx: ctx!,
        width,
        height,
        progress,
        elapsedSeconds: elapsed / 1000,
        mediaImages: loadedMediaImages,
        avatarImg: loadedAvatarImg,
        selectedVoice,
        enableVoiceover,
        avatarDisplayMode,
        selectedTemplate,
        promoBadgeText,
        headlineText,
        pitchText,
        ctaText,
        businessName,
        categoryName,
        displaySettings
      });

      const pct = Math.min(Math.round(25 + progress * 70), 95);
      onProgress?.(pct, `Renderizando animación y efectos (${pct}%)...`);

      if (progress < 1) {
        requestAnimationFrame(renderFrame);
      } else {
        setTimeout(() => {
          recorder.stop();
        }, 200);
      }
    }

    requestAnimationFrame(renderFrame);
  });
}

// Draw a warm harmonic commercial chord sequence for background music
function createHarmonicBackingTrack(
  audioCtx: AudioContext,
  dest: AudioNode,
  volume: number
) {
  try {
    const chordFrequencies = [261.63, 329.63, 392.0, 523.25]; // C major 7th chord
    const masterGain = audioCtx.createGain();
    masterGain.gain.value = Math.min(volume * 0.18, 0.18);
    masterGain.connect(dest);

    chordFrequencies.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08 / (idx + 1), audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();
    });
  } catch (e) {
    console.warn('Harmonic audio generator notice:', e);
  }
}

interface FrameParams {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  progress: number;
  elapsedSeconds: number;
  mediaImages: HTMLImageElement[];
  avatarImg: HTMLImageElement | null;
  selectedVoice: AIVoice;
  enableVoiceover: boolean;
  avatarDisplayMode?: AvatarDisplayMode;
  selectedTemplate: AnimatedTemplate;
  promoBadgeText: string;
  headlineText: string;
  pitchText: string;
  ctaText: string;
  businessName: string;
  categoryName: string;
  displaySettings?: AdDisplaySettings;
}

// Master Canvas frame renderer
function drawAdFrame(params: FrameParams) {
  const {
    ctx,
    width,
    height,
    progress,
    elapsedSeconds,
    mediaImages,
    avatarImg,
    selectedVoice,
    enableVoiceover,
    avatarDisplayMode = 'circle-pip',
    promoBadgeText,
    headlineText,
    pitchText,
    ctaText,
    businessName,
    categoryName,
    displaySettings
  } = params;

  // Options derived from displaySettings
  const imageFitMode = displaySettings?.imageFitMode || 'contain';
  const showOverlayTexts = displaySettings?.showOverlayTexts !== false;
  const showPromoBadge = showOverlayTexts && displaySettings?.showPromoBadge !== false;
  const showHeadlineBox = showOverlayTexts && displaySettings?.showHeadlineBox !== false;
  const showCtaButton = showOverlayTexts && displaySettings?.showCtaButton !== false;

  // Clear canvas
  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, width, height);

  // 1. Determine active media photo and smooth transition
  const totalPhotos = mediaImages.length;
  const photoDuration = 1 / Math.max(totalPhotos, 1);
  const currentPhotoIndex = Math.min(Math.floor(progress / photoDuration), totalPhotos - 1);
  const currentImg = mediaImages[currentPhotoIndex];
  const photoProgress = (progress % photoDuration) / photoDuration;

  if (currentImg && currentImg.width > 0) {
    const imgRatio = currentImg.width / currentImg.height;
    const canvasRatio = width / height;

    if (imageFitMode === 'contain') {
      // 1A. ELEGANT BLURRED BACKGROUND (Keeps canvas rich while showing flyer 100% complete)
      ctx.save();
      // Draw cover background with deep tint
      let bgW = width;
      let bgH = height;
      if (imgRatio > canvasRatio) {
        bgW = height * imgRatio;
      } else {
        bgH = width / imgRatio;
      }
      const bgX = (width - bgW) / 2;
      const bgY = (height - bgH) / 2;
      ctx.drawImage(currentImg, bgX, bgY, bgW, bgH);

      // Dark glass blur scrim over background
      ctx.fillStyle = 'rgba(10, 15, 29, 0.82)';
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // 1B. FOREGROUND PHOTO / FLYER (100% UNCLIPPED, PRESERVING FULL VISIBILITY)
      ctx.save();
      // Subtle gentle Ken Burns (only 2% scale, zero clipping of text/phone numbers)
      const scale = 1.0 + 0.02 * Math.sin(photoProgress * Math.PI);
      ctx.translate(width / 2, height / 2);
      ctx.scale(scale, scale);
      ctx.translate(-width / 2, -height / 2);

      let renderW: number;
      let renderH: number;
      const maxW = width * (showOverlayTexts ? 0.94 : 0.98);
      const maxH = height * (showOverlayTexts ? 0.88 : 0.98);

      if (imgRatio > canvasRatio) {
        renderW = maxW;
        renderH = renderW / imgRatio;
        if (renderH > maxH) {
          renderH = maxH;
          renderW = renderH * imgRatio;
        }
      } else {
        renderH = maxH;
        renderW = renderH * imgRatio;
        if (renderW > maxW) {
          renderW = maxW;
          renderH = renderW / imgRatio;
        }
      }

      const renderX = (width - renderW) / 2;
      const renderY = (height - renderH) / 2;

      // Soft shadow behind the unclipped flyer/photo
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 24;
      ctx.drawImage(currentImg, renderX, renderY, renderW, renderH);
      ctx.shadowBlur = 0;
      ctx.restore();
    } else {
      // 1C. COVER MODE (Screen-filling cinematic crop)
      ctx.save();
      const scale = 1.02 + 0.04 * photoProgress;
      ctx.translate(width / 2, height / 2);
      ctx.scale(scale, scale);
      ctx.translate(-width / 2, -height / 2);

      let renderW = width;
      let renderH = height;
      let renderX = 0;
      let renderY = 0;

      if (imgRatio > canvasRatio) {
        renderW = height * imgRatio;
        renderX = (width - renderW) / 2;
      } else {
        renderH = width / imgRatio;
        renderY = (height - renderH) / 2;
      }

      ctx.drawImage(currentImg, renderX, renderY, renderW, renderH);
      ctx.restore();
    }
  }

  // 2. High-Contrast Cinematic Vignette Gradients (ONLY when overlay texts are active)
  if (showOverlayTexts) {
    // Top gradient for badge and avatar
    const topGrad = ctx.createLinearGradient(0, 0, 0, height * 0.28);
    topGrad.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
    topGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.35)');
    topGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = topGrad;
    ctx.fillRect(0, 0, width, height * 0.28);

    // Bottom gradient for headline, pitch and CTA
    const bottomGrad = ctx.createLinearGradient(0, height * 0.48, 0, height);
    bottomGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    bottomGrad.addColorStop(0.35, 'rgba(0, 0, 0, 0.65)');
    bottomGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0.88)');
    bottomGrad.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
    ctx.fillStyle = bottomGrad;
    ctx.fillRect(0, height * 0.48, width, height * 0.52);
  }

  // 3. Top Glowing Progress Bar
  const barHeight = showOverlayTexts ? 5 : 3;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.fillRect(0, 0, width, barHeight);

  const barGrad = ctx.createLinearGradient(0, 0, width * progress, 0);
  barGrad.addColorStop(0, '#f43f5e');
  barGrad.addColorStop(0.5, '#f59e0b');
  barGrad.addColorStop(1, '#10b981');
  ctx.fillStyle = barGrad;
  ctx.fillRect(0, 0, width * progress, barHeight);

  // 4. Promo Badge at Top Center (Only if showPromoBadge is enabled)
  if (showPromoBadge) {
    const badgeText = promoBadgeText || 'OFERTA EXCLUSIVA';
    ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    const badgeMetrics = ctx.measureText(badgeText);
    const badgeW = Math.max(badgeMetrics.width + 36, 170);
    const badgeH = 32;
    const badgeX = (width - badgeW) / 2;
    const badgeY = 20;

    // Badge glow
    ctx.shadowColor = 'rgba(244, 63, 94, 0.5)';
    ctx.shadowBlur = 12;
    const badgeBgGrad = ctx.createLinearGradient(badgeX, badgeY, badgeX + badgeW, badgeY + badgeH);
    badgeBgGrad.addColorStop(0, '#e11d48');
    badgeBgGrad.addColorStop(1, '#d97706');
    ctx.fillStyle = badgeBgGrad;
    drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, 16);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Badge text
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(badgeText, width / 2, badgeY + badgeH / 2);
  }

  // 5. Presenter Avatar Display in Video (Only if showOverlayTexts and avatar mode is not audio-only)
  if (showOverlayTexts && enableVoiceover && avatarImg && avatarImg.width > 0 && avatarDisplayMode !== 'audio-only') {
    if (avatarDisplayMode === 'circle-pip') {
      // Circle Picture-in-Picture at top-left
      const avatarX = 24;
      const avatarY = 64;
      const avatarSize = 60;
      const radius = avatarSize / 2;

      // Pulse audio ring
      const pulse = (Math.sin(elapsedSeconds * 6) + 1) / 2;
      ctx.beginPath();
      ctx.arc(avatarX + radius, avatarY + radius, radius + 3 + pulse * 3, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(245, 158, 11, ${0.4 + pulse * 0.4})`;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Circular clip for avatar
      ctx.save();
      ctx.beginPath();
      ctx.arc(avatarX + radius, avatarY + radius, radius, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(avatarImg, avatarX, avatarY, avatarSize, avatarSize);
      ctx.restore();

      // Border outline
      ctx.beginPath();
      ctx.arc(avatarX + radius, avatarY + radius, radius, 0, Math.PI * 2);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Presenter Name Chip next to circle
      const chipX = avatarX + avatarSize + 10;
      const chipY = avatarY + 10;
      const chipW = 150;
      const chipH = 36;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      drawRoundedRect(ctx, chipX, chipY, chipW, chipH, 10);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`${selectedVoice.name.split(' ')[0]} (Locutor IA)`, chipX + 8, chipY + 5);

      ctx.font = '10px sans-serif';
      ctx.fillStyle = '#fde047';
      ctx.fillText('🎙️ En vivo con voz humana', chipX + 8, chipY + 20);
    } else if (avatarDisplayMode === 'bottom-card') {
      // Bottom card presenter banner above headline
      const cardW = width - 48;
      const cardH = 46;
      const cardX = 24;
      const cardY = height - 355;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 12);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Mini Avatar portrait
      ctx.save();
      ctx.beginPath();
      drawRoundedRect(ctx, cardX + 8, cardY + 6, 34, 34, 8);
      ctx.clip();
      ctx.drawImage(avatarImg, cardX + 8, cardY + 6, 34, 34);
      ctx.restore();

      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(selectedVoice.name, cardX + 50, cardY + 8);

      ctx.font = '10px sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(selectedVoice.avatarRole, cardX + 50, cardY + 24);

      // LIVE ON AIR badge
      const liveW = 70;
      const liveH = 22;
      const liveX = cardX + cardW - liveW - 8;
      const liveY = cardY + 12;
      ctx.fillStyle = 'rgba(225, 29, 72, 0.9)';
      drawRoundedRect(ctx, liveX, liveY, liveW, liveH, 6);
      ctx.fill();
      ctx.font = 'bold 10px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🔴 AL AIRE', liveX + liveW / 2, liveY + liveH / 2);
    }
  }

  // 6. Center-Bottom Main Headline Card (Only if showHeadlineBox is enabled)
  if (showHeadlineBox) {
    const boxMargin = 22;
    const boxW = width - boxMargin * 2;
    const boxY = height - 280;
    const boxH = 145;

    // Dark glass background for headline
    ctx.fillStyle = 'rgba(0, 0, 0, 0.82)';
    drawRoundedRect(ctx, boxMargin, boxY, boxW, boxH, 18);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Category & Business Tag inside box
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#fb7185';
    ctx.fillText(`★ ${businessName.toUpperCase()} • ${categoryName}`, boxMargin + 16, boxY + 12);

    // Headline Text
    ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 4;
    const nextY = wrapAndDrawText(
      ctx,
      headlineText,
      boxMargin + 16,
      boxY + 34,
      boxW - 32,
      28,
      2
    );
    ctx.shadowBlur = 0;

    // Pitch subtitle
    const subtitle = pitchText || '¡Aprovecha hoy promociones exclusivas con atención garantizada!';
    ctx.font = '13px sans-serif';
    ctx.fillStyle = '#cbd5e1';
    wrapAndDrawText(ctx, subtitle, boxMargin + 16, nextY + 4, boxW - 32, 17, 2);
  }

  // 7. Call To Action (CTA) Button at the Bottom (Only if showCtaButton is enabled)
  if (showCtaButton) {
    const ctaH = 50;
    const ctaW = width - 48;
    const ctaX = 24;
    const ctaY = height - 105;

    // Pulse effect on CTA
    const ctaPulse = (Math.sin(elapsedSeconds * 4) + 1) / 2;
    ctx.shadowColor = 'rgba(16, 185, 129, 0.6)';
    ctx.shadowBlur = 8 + ctaPulse * 6;

    // CTA Gradient (WhatsApp vibrant emerald to teal)
    const ctaGrad = ctx.createLinearGradient(ctaX, ctaY, ctaX + ctaW, ctaY + ctaH);
    ctaGrad.addColorStop(0, '#059669');
    ctaGrad.addColorStop(1, '#0d9488');
    ctx.fillStyle = ctaGrad;
    drawRoundedRect(ctx, ctaX, ctaY, ctaW, ctaH, 25);
    ctx.fill();
    ctx.shadowBlur = 0;

    // CTA Text and WhatsApp Icon
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 17px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`💬  ${ctaText}`, width / 2, ctaY + ctaH / 2);
  }

  // 8. Footer Brand Mark (Only if showOverlayTexts is active)
  if (showOverlayTexts) {
    ctx.font = '10px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`Creado para ${businessName} • Calidad HD`, width / 2, height - 30);
  }
}

// Mobile-first video saving and sharing helper
export async function saveVideoToMobileOrShare(
  file: File,
  title: string,
  text: string
): Promise<{ shared: boolean; method: 'web-share' | 'download' }> {
  // Check if Web Share API with files is available (iPhone Safari iOS 15+, Android Chrome)
  if (
    typeof navigator !== 'undefined' &&
    navigator.canShare &&
    navigator.canShare({ files: [file] })
  ) {
    try {
      await navigator.share({
        title,
        text,
        files: [file]
      });
      return { shared: true, method: 'web-share' };
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // User closed or canceled the native share dialog
        return { shared: false, method: 'web-share' };
      }
      console.warn('Web Share API error, falling back to direct download:', err);
    }
  }

  // Fallback: Direct browser file download
  triggerDirectDownload(file, file.name);
  return { shared: true, method: 'download' };
}

// Browser direct download trigger
export function triggerDirectDownload(blobOrFile: Blob | File, filename: string) {
  const url = URL.createObjectURL(blobOrFile);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 1500);
}
