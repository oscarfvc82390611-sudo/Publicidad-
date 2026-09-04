// Audio Engine helper for mixing background music and avatar speech voiceover
import precomputedAvatarAudios from '../data/precomputedAvatarAudios.json';

// Helper to convert base64 to ArrayBuffer for Web Audio decoding
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// Mapping between avatar IDs and precomputed keys
const AVATAR_AUDIO_MAP: Record<string, string> = {
  voice_valentina: 'avatar_valentina',
  voice_mateo: 'avatar_mateo',
  voice_andres: 'avatar_mateo',
  voice_elena: 'avatar_sofia',
  voice_diego: 'avatar_mateo',
  voice_lucia: 'avatar_valentina',
  voice_camila: 'avatar_camila',
  voice_alejandro: 'avatar_alejandro',
  voice_sofia: 'avatar_sofia',
  // Backwards compatibility for raw apiVoiceNames
  Zephyr: 'avatar_valentina',
  Fenrir: 'avatar_mateo',
  Orus: 'avatar_mateo',
  Aoede: 'avatar_sofia',
  Puck: 'avatar_camila',
  Leda: 'avatar_valentina',
  Charon: 'avatar_alejandro',
  Kore: 'avatar_sofia'
};

class AudioEngine {
  private musicAudio: HTMLAudioElement | null = null;
  private voiceAudio: HTMLAudioElement | null = null;
  private audioCache: Map<string, string> = new Map();
  private rawAudioCache: Map<string, { base64: string; mimeType: string }> = new Map();
  private lastSynthesizedVoiceData: { base64: string; mimeType: string; voiceName: string; text: string } | null = null;

  public playMusic(url: string, volume: number = 0.35, loop: boolean = true) {
    if (this.musicAudio) {
      this.musicAudio.pause();
      this.musicAudio = null;
    }

    try {
      this.musicAudio = new Audio(url);
      this.musicAudio.volume = Math.max(0, Math.min(1, volume));
      this.musicAudio.loop = loop;
      this.musicAudio.play().catch(err => {
        console.warn("Autoplay audio blocked by browser policy until interaction:", err);
      });
    } catch (e) {
      console.error("Error playing music track:", e);
    }
  }

  public setMusicVolume(volume: number) {
    if (this.musicAudio) {
      this.musicAudio.volume = Math.max(0, Math.min(1, volume));
    }
  }

  public pauseMusic() {
    if (this.musicAudio) {
      this.musicAudio.pause();
    }
  }

  public stopAll() {
    if (this.musicAudio) {
      this.musicAudio.pause();
      this.musicAudio.currentTime = 0;
    }
    if (this.voiceAudio) {
      this.voiceAudio.pause();
      this.voiceAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  // Play pre-rendered studio quality neural WAV audio for an avatar
  public playAvatarSample(
    avatarId: string,
    onStart?: () => void,
    onEnd?: () => void
  ): boolean {
    this.stopAll();

    const audioKey = AVATAR_AUDIO_MAP[avatarId] || avatarId;
    const base64Wav = (precomputedAvatarAudios as Record<string, string>)[audioKey];

    if (base64Wav) {
      try {
        const audioUrl = this.base64ToUrl(base64Wav, "audio/wav");
        this.playAudioUrl(audioUrl, onStart, onEnd);
        return true;
      } catch (err) {
        console.error("Error playing precomputed avatar sample:", err);
      }
    }
    return false;
  }

  public async speakVoiceover(
    text: string,
    voiceName: string,
    onStart?: () => void,
    onEnd?: () => void,
    avatarId?: string,
    isSamplePreview: boolean = false
  ): Promise<void> {
    this.stopAll();

    // 1. If it's a sample preview or short text and we have precomputed studio WAV, use it immediately
    const key = avatarId ? (AVATAR_AUDIO_MAP[avatarId] || avatarId) : (AVATAR_AUDIO_MAP[voiceName] || '');
    const precomputed = (precomputedAvatarAudios as Record<string, string>)[key];

    if (isSamplePreview && precomputed) {
      const audioUrl = this.base64ToUrl(precomputed, "audio/wav");
      this.playAudioUrl(audioUrl, onStart, onEnd);
      return;
    }

    // 2. Check local client cache for custom text
    const cacheKey = `${voiceName}:${text.trim()}`;
    if (this.audioCache.has(cacheKey)) {
      const cachedUrl = this.audioCache.get(cacheKey)!;
      this.playAudioUrl(cachedUrl, onStart, onEnd);
      return;
    }

    // 3. Request server-side Neural Gemini TTS with WAV conversion
    try {
      const res = await fetch("/api/ai/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voiceName })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.available && data.audioData) {
          const mimeType = data.mimeType || "audio/wav";
          this.rawAudioCache.set(cacheKey, { base64: data.audioData, mimeType });
          this.lastSynthesizedVoiceData = {
            base64: data.audioData,
            mimeType,
            voiceName,
            text
          };
          const audioUrl = this.base64ToUrl(data.audioData, mimeType);
          this.audioCache.set(cacheKey, audioUrl);
          this.playAudioUrl(audioUrl, onStart, onEnd);
          return;
        }
      }
    } catch (e) {
      console.warn("Gemini TTS request exception, falling back to local avatar audio or vocal synthesis:", e);
    }

    // 4. If custom text generation was rate-limited or offline, but we have the avatar's studio voice:
    if (precomputed) {
      const audioUrl = this.base64ToUrl(precomputed, "audio/wav");
      this.playAudioUrl(audioUrl, onStart, onEnd);
      return;
    }

    // 5. Enhanced Browser Speech Synthesis fallback with distinct voice characteristics
    this.fallbackBrowserSpeech(text, voiceName, onStart, onEnd, avatarId);
  }

  // Retrieve exact ArrayBuffer of the voiceover speech for video exporter
  public async getVoiceoverArrayBuffer(
    text: string,
    voiceName: string,
    avatarId?: string
  ): Promise<{ arrayBuffer: ArrayBuffer; mimeType: string } | null> {
    const cleanText = text.trim();
    const cacheKey = `${voiceName}:${cleanText}`;

    // 1. Check in-memory exact match cache
    if (this.rawAudioCache.has(cacheKey)) {
      const cached = this.rawAudioCache.get(cacheKey)!;
      return {
        arrayBuffer: base64ToArrayBuffer(cached.base64),
        mimeType: cached.mimeType
      };
    }

    // 2. Check if recently synthesized audio was for this voice
    if (this.lastSynthesizedVoiceData && this.lastSynthesizedVoiceData.voiceName === voiceName) {
      return {
        arrayBuffer: base64ToArrayBuffer(this.lastSynthesizedVoiceData.base64),
        mimeType: this.lastSynthesizedVoiceData.mimeType
      };
    }

    // 3. Request high quality TTS directly from server
    if (cleanText) {
      try {
        const res = await fetch("/api/ai/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: cleanText, voiceName })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.available && data.audioData) {
            const mimeType = data.mimeType || "audio/wav";
            this.rawAudioCache.set(cacheKey, { base64: data.audioData, mimeType });
            this.lastSynthesizedVoiceData = {
              base64: data.audioData,
              mimeType,
              voiceName,
              text: cleanText
            };
            return {
              arrayBuffer: base64ToArrayBuffer(data.audioData),
              mimeType
            };
          }
        }
      } catch (err) {
        console.warn("Failed fetching voice TTS for export:", err);
      }
    }

    // 4. Fallback ONLY if custom generation was completely unavailable
    const key = avatarId ? (AVATAR_AUDIO_MAP[avatarId] || avatarId) : (AVATAR_AUDIO_MAP[voiceName] || '');
    const precomputed = (precomputedAvatarAudios as Record<string, string>)[key];
    if (precomputed) {
      return {
        arrayBuffer: base64ToArrayBuffer(precomputed),
        mimeType: "audio/wav"
      };
    }

    return null;
  }

  private base64ToUrl(base64: string, mimeType: string): string {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: mimeType });
    return URL.createObjectURL(blob);
  }

  private playAudioUrl(url: string, onStart?: () => void, onEnd?: () => void) {
    this.voiceAudio = new Audio(url);
    this.voiceAudio.volume = 0.95;
    
    if (onStart) onStart();

    this.voiceAudio.onended = () => {
      if (onEnd) onEnd();
    };

    this.voiceAudio.onerror = (e) => {
      console.warn("Audio playback error, finishing gracefully:", e);
      if (onEnd) onEnd();
    };

    this.voiceAudio.play().catch(err => {
      console.warn("Playback blocked by browser policy:", err);
      if (onEnd) onEnd();
    });
  }

  private fallbackBrowserSpeech(
    text: string,
    voiceName: string,
    onStart?: () => void,
    onEnd?: () => void,
    avatarId?: string
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';

    // Tailor pitch, rate, and volume to create dramatic variation between avatars
    const isMasculine =
      avatarId === 'voice_mateo' ||
      avatarId === 'voice_alejandro' ||
      avatarId === 'voice_andres' ||
      avatarId === 'voice_diego' ||
      voiceName === 'Fenrir' ||
      voiceName === 'Charon' ||
      voiceName === 'Orus';

    if (avatarId === 'voice_andres' || voiceName === 'Orus') {
      utterance.pitch = 0.65; // Extremely deep, resonant movie trailer baritone
      utterance.rate = 0.95;  // Powerful, assertive pace
    } else if (avatarId === 'voice_alejandro' || voiceName === 'Charon') {
      utterance.pitch = 0.72; // Very deep, prestigious baritone
      utterance.rate = 0.90;  // Formal, thoughtful pace
    } else if (avatarId === 'voice_mateo' || voiceName === 'Fenrir') {
      utterance.pitch = 0.85; // Confident masculine commercial voice
      utterance.rate = 1.05;  // Dynamic, energetic
    } else if (avatarId === 'voice_diego') {
      utterance.pitch = 1.05; // Fresh, youthful tech creator
      utterance.rate = 1.10;  // Fast and spontaneous
    } else if (avatarId === 'voice_elena' || voiceName === 'Aoede') {
      utterance.pitch = 0.96; // Warm, natural, comforting
      utterance.rate = 0.98;  // Conversational pace
    } else if (avatarId === 'voice_lucia' || voiceName === 'Leda') {
      utterance.pitch = 1.18; // Cheerful promotional retail voice
      utterance.rate = 1.08;  // Upbeat, sparkling sales pace
    } else if (avatarId === 'voice_camila' || voiceName === 'Puck') {
      utterance.pitch = 1.25; // Bright, youthful TikTok influencer
      utterance.rate = 1.15;  // Fast and bubbly
    } else if (avatarId === 'voice_sofia' || voiceName === 'Kore') {
      utterance.pitch = 1.12; // Warm sales consultant
      utterance.rate = 1.05;  // Active retail pace
    } else {
      // Valentina / Zephyr
      utterance.pitch = 1.02; // Elegant, refined, serene
      utterance.rate = 0.94;
    }

    // Try to pick gender-matching Spanish voices from system
    const voices = window.speechSynthesis.getVoices();
    const esVoices = voices.filter(v => v.lang.startsWith('es'));

    if (esVoices.length > 0) {
      if (isMasculine) {
        const maleVoice = esVoices.find(v =>
          /jorge|diego|carlos|pablo|male|hombre|raul|enrique/i.test(v.name)
        );
        if (maleVoice) utterance.voice = maleVoice;
      } else {
        const femaleVoice = esVoices.find(v =>
          /monica|paulina|sabina|female|mujer|helena|laura|elena/i.test(v.name)
        );
        if (femaleVoice) utterance.voice = femaleVoice;
      }
    }

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }
}

export const audioEngine = new AudioEngine();
