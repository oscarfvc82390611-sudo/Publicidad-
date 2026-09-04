import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "25mb" }));

  // API Route: Health Check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", hasGeminiKey: !!process.env.GEMINI_API_KEY });
  });

  // API Route: AI Copy Optimization & Complement
  app.post("/api/ai/optimize-copy", async (req, res) => {
    try {
      const { businessType, customBusiness, baseText, goal, tone } = req.body;
      const ai = getAiClient();

      const businessName = businessType === "OTRO TIPO DE NEGOCIO" && customBusiness
        ? customBusiness
        : (businessType || "Negocio General");

      if (!ai) {
        // High-quality fallback if no API key is set
        return res.json({
          headline: `¡Lo mejor en ${businessName} ya está aquí!`,
          optimizedCopy: `${baseText ? baseText.trim() + " " : ""}Descubre la máxima calidad, atención insuperable y promociones exclusivas que transformarán tu experiencia. ¡Visítanos hoy mismo y comprueba la diferencia!`,
          callToAction: "¡Haz tu pedido o contáctanos por WhatsApp hoy mismo!",
          socialPostCaption: `🔥 ¡ATENCIÓN! En ${businessName} tenemos algo preparado especialmente para ti.\n\n✨ ${baseText || "La mejor calidad y el servicio que mereces en un solo lugar."}\n\n👉 Escríbenos directamente o toca el enlace en nuestro perfil para aprovechar esta oferta por tiempo limitado.\n\n📍 Envíos y atención personalizada todos los días.`,
          hashtags: [
            `#${businessName.replace(/\s+/g, '')}`,
            "#OfertaEspecial",
            "#CalidadGarantizada",
            "#Tendencia",
            "#NegocioLocal",
            "#PromocionDelDia",
            "#MarketingDigital"
          ],
          voiceoverScript: `¿Buscas lo mejor en ${businessName}? ${baseText ? baseText : "Tenemos justo lo que necesitas con la mejor calidad y servicio"}. No dejes pasar esta oportunidad exclusiva. ¡Escríbenos ahora mismo y aprovecha nuestra promoción especial!`,
          bestPostingTimes: [
            "Lunes a Viernes: 12:30 PM - 2:00 PM (Hora de almuerzo)",
            "Lunes a Jueves: 7:00 PM - 9:30 PM (Pico nocturno en redes)",
            "Sábados: 11:00 AM - 3:00 PM (Mayor interacción en fin de semana)"
          ],
          targetAudienceInsights: `Clientes interesados en ${businessName}, personas locales activas en redes sociales buscando soluciones confiables y promociones atractivas.`
        });
      }

      const prompt = `Actúa como un director creativo y estratega de marketing digital experto en publicidad para redes sociales (Instagram, TikTok, Facebook, WhatsApp Business).
El usuario quiere crear una publicidad profesional para su negocio:
- Tipo de negocio: "${businessName}"
- Texto base / Idea del usuario: "${baseText || "Promoción destacada de nuestro negocio"}"
- Objetivo publicitario: "${goal || "Ventas y clientes potenciales"}"
- Tono deseado: "${tone || "Persuasivo, dinámico y muy profesional"}"

Genera una respuesta en español estructurada con:
1. Un titular magnético (headline) para el video/foto.
2. Un texto publicitario optimizado (optimizedCopy) que tome el texto base del usuario y lo complemente con técnicas de copywriting (gancho, beneficio claro, urgencia).
3. Un llamado a la acción claro y contundente (callToAction).
4. El copy completo para la publicación en redes sociales (socialPostCaption), con formato limpio, saltos de línea y emojis estratégicos.
5. Lista de 6 a 8 hashtags recomendados de alto impacto.
6. Un guion de voz en off (voiceoverScript) de 15 a 25 segundos, ideal para que una voz profesional lo narre de forma natural y persuasiva.
7. Horarios recomendados de publicación para este tipo específico de negocio.
8. Consejos breves sobre la audiencia objetivo para este negocio.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              headline: { type: Type.STRING },
              optimizedCopy: { type: Type.STRING },
              callToAction: { type: Type.STRING },
              socialPostCaption: { type: Type.STRING },
              hashtags: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              voiceoverScript: { type: Type.STRING },
              bestPostingTimes: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              targetAudienceInsights: { type: Type.STRING }
            },
            required: ["headline", "optimizedCopy", "callToAction", "socialPostCaption", "hashtags", "voiceoverScript", "bestPostingTimes", "targetAudienceInsights"]
          }
        }
      });

      const responseText = response.text?.trim();
      if (!responseText) {
        throw new Error("Respuesta vacía de Gemini");
      }
      const data = JSON.parse(responseText);
      return res.json(data);
    } catch (err: any) {
      console.error("Error en /api/ai/optimize-copy:", err);
      return res.status(500).json({
        error: "No se pudo generar la optimización con IA.",
        details: err?.message || String(err)
      });
    }
  });

function pcmToWav(pcmBuffer: Buffer, sampleRate = 24000, numChannels = 1, bitsPerSample = 16): Buffer {
  const header = Buffer.alloc(44);
  const dataLen = pcmBuffer.length;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);

  header.write("RIFF", 0);
  header.writeUInt32LE(dataLen + 36, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36);
  header.writeUInt32LE(dataLen, 40);

  return Buffer.concat([header, pcmBuffer]);
}

const ttsCache = new Map<string, { audioData: string; mimeType: string; voice: string }>();

  // API Route: Professional AI Voice Text-To-Speech (Gemini Flash TTS with WAV conversion & Avatar Persona)
  app.post("/api/ai/tts", async (req, res) => {
    try {
      const { text, voiceName = "Kore" } = req.body;
      if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "Se requiere un texto válido para la locución." });
      }

      const cleanText = text.trim();
      const validVoices = ["Kore", "Fenrir", "Puck", "Zephyr", "Charon", "Orus", "Aoede", "Leda"];
      const selectedVoice = validVoices.includes(voiceName) ? voiceName : "Fenrir";
      const cacheKey = `${selectedVoice}:${cleanText}`;

      // Check cache first
      if (ttsCache.has(cacheKey)) {
        return res.json({
          available: true,
          ...ttsCache.get(cacheKey)!
        });
      }

      const ai = getAiClient();
      if (!ai) {
        return res.status(200).json({
          available: false,
          message: "Sin API key, usando sintetizador de voz del navegador."
        });
      }

      // Tailored vocal instructions by avatar persona
      let personaDirection = "Locuta este anuncio publicitario con tono profesional, claro y natural en español latino:";
      if (selectedVoice === "Zephyr") {
        personaDirection = "Locuta este anuncio como presentadora ejecutiva elegante, refinada, cálida y de alta gama en español latino:";
      } else if (selectedVoice === "Fenrir") {
        personaDirection = "Locuta este anuncio como locutor masculino seguro, dinámico, enérgico y altamente convincente en español latino comercial:";
      } else if (selectedVoice === "Orus") {
        personaDirection = "Locuta este anuncio como locutor de radio y trailers con voz masculina grave, barítono potente, profunda y de gran impacto en español latino:";
      } else if (selectedVoice === "Aoede") {
        personaDirection = "Locuta este anuncio como locutora cálida, cercana, serena, amigable y muy confiable en español latino:";
      } else if (selectedVoice === "Puck") {
        personaDirection = "Locuta este anuncio como joven dinámico, fresco, amigable, entusiasta y con ritmo viral de redes sociales en español latino:";
      } else if (selectedVoice === "Leda") {
        personaDirection = "Locuta este anuncio como locutora comercial alegre, chispeante, entusiasta y orientada a promociones flash en español latino:";
      } else if (selectedVoice === "Charon") {
        personaDirection = "Locuta este anuncio como narrador sénior institucional, formal, profundo y que inspira total confianza en español latino:";
      } else if (selectedVoice === "Kore") {
        personaDirection = "Locuta este anuncio como presentadora comercial cálida, persuasiva y con ritmo dinámico de ventas en español latino:";
      }

      const prompt = `${personaDirection} "${cleanText.slice(0, 380)}"`;
      const modelsToTry = ["gemini-2.5-flash-preview-tts", "gemini-3.1-flash-tts-preview", "gemini-2.5-pro-preview-tts"];

      let audioBuffer: Buffer | null = null;
      let lastError: any = null;

      for (const model of modelsToTry) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: [{ parts: [{ text: prompt }] }],
            config: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: selectedVoice },
                },
              },
            },
          });

          const candidatePart = response.candidates?.[0]?.content?.parts?.[0];
          const rawBase64 = candidatePart?.inlineData?.data;
          if (rawBase64) {
            const rawPcm = Buffer.from(rawBase64, "base64");
            audioBuffer = pcmToWav(rawPcm, 24000, 1, 16);
            break;
          }
        } catch (err: any) {
          lastError = err;
          // Try next model if quota/rate-limited
          continue;
        }
      }

      if (audioBuffer && audioBuffer.length > 44) {
        const payload = {
          audioData: audioBuffer.toString("base64"),
          mimeType: "audio/wav",
          voice: selectedVoice
        };
        ttsCache.set(cacheKey, payload);
        return res.json({
          available: true,
          ...payload
        });
      }

      return res.json({
        available: false,
        message: "No se pudo generar audio con los modelos TTS (límite de cuota alcanzado), usando modo sintetizador avanzado.",
        details: lastError?.message
      });
    } catch (err: any) {
      console.error("Error en /api/ai/tts:", err);
      return res.json({
        available: false,
        error: err?.message || "Error al generar voz TTS con IA"
      });
    }
  });

  // API Route: Educational Marketing Tips for Business
  app.post("/api/ai/marketing-tip", async (req, res) => {
    try {
      const { businessType, topic } = req.body;
      const ai = getAiClient();

      if (!ai) {
        return res.json({
          tipTitle: `Estrategia de impacto para ${businessType || "tu negocio"}`,
          actionableAdvice: "Capta la atención en los primeros 2.5 segundos: muestra el beneficio directo antes de presentarte. Usa subtítulos en tamaño grande porque más del 70% de usuarios ven videos sin audio en el celular.",
          checklist: [
            "Limpia la lente de la cámara del celular antes de grabar",
            "Usa luz natural lateral o frente a una ventana",
            "Muestra personas reales disfrutando tu producto o servicio",
            "Coloca siempre un llamado a la acción al final del video"
          ]
        });
      }

      const prompt = `Proporciona un micro-consejo práctico y accionable de marketing digital y diseño para un negocio de tipo "${businessType || "General"}".
Tema o enfoque: "${topic || "Crear anuncios que conviertan en redes sociales"}".
Devuelve un JSON con:
- tipTitle: Título claro y llamativo (máximo 8 palabras)
- actionableAdvice: Explicación directa y aplicable hoy mismo (máximo 3 oraciones)
- checklist: Lista de 4 pasos prácticos esenciales para mejorar sus anuncios`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              tipTitle: { type: Type.STRING },
              actionableAdvice: { type: Type.STRING },
              checklist: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["tipTitle", "actionableAdvice", "checklist"]
          }
        }
      });

      const responseText = response.text?.trim();
      if (responseText) {
        return res.json(JSON.parse(responseText));
      }
      throw new Error("Respuesta inválida");
    } catch (err: any) {
      console.error("Error en /api/ai/marketing-tip:", err);
      return res.json({
        tipTitle: "Regla de oro publicitaria",
        actionableAdvice: "Enfócate en el problema que resuelves para el cliente, no solo en las características de tu negocio. Una buena oferta con fecha límite duplica las conversiones.",
        checklist: [
          "Destaca un beneficio principal",
          "Incluye un precio o descuento visible",
          "Agrega botón de WhatsApp directo",
          "Reutiliza la misma publicación en Reels, TikTok y Estados"
        ]
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
