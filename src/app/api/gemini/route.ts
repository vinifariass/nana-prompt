import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { requireSession } from "@/server/auth/session";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: Request) {
  try {
    // Proteger rota contra robôs/acesso público
    await requireSession();

    const { prompt, action } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "O prompt é obrigatório" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let finalPrompt = prompt;

    if (action === "enhance_prompt") {
      finalPrompt = `You are "Nana", an elite AI prompt engineer specialized in creating professional photography prompts.

The user's basic idea: "${prompt}"

Your task: Transform this into a structured JSON object optimized for AI image generators (Stable Diffusion, Midjourney, DALL-E).

Return ONLY valid JSON in this exact format:
{
  "enhanced_prompt": "Full detailed prompt in English combining all elements below into one cohesive sentence",
  "style": "photorealistic | anime | artistic | cinematic | editorial",
  "lighting": "studio softbox | golden hour | dramatic rim light | neon | natural diffused",
  "camera": "85mm f/1.4 portrait | 35mm wide angle | 50mm street | 200mm telephoto | macro",
  "composition": "rule of thirds | centered | dutch angle | symmetrical | leading lines",
  "mood": "epic | intimate | mysterious | vibrant | melancholic",
  "quality_tags": "masterpiece, 8k, ultra detailed, professional photography, award winning",
  "negative_prompts": "blurry, low quality, watermark, text, deformed, ugly, duplicate"
}

Rules:
- enhanced_prompt must be a single paragraph combining style + lighting + camera + mood naturally
- Choose the most fitting values for each field based on the user's idea
- Return ONLY the JSON, no markdown, no backticks, no explanation`;
    }

    const result = await model.generateContent(finalPrompt);
    const response = result.response;
    const text = response.text();

    // Se foi enhance_prompt, tenta parsear o JSON
    if (action === "enhance_prompt") {
      try {
        const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const parsed = JSON.parse(cleaned);
        return NextResponse.json({
          text: parsed.enhanced_prompt,
          metadata: {
            style: parsed.style,
            lighting: parsed.lighting,
            camera: parsed.camera,
            composition: parsed.composition,
            mood: parsed.mood,
            quality_tags: parsed.quality_tags,
            negative_prompts: parsed.negative_prompts,
          },
        });
      } catch {
        // Fallback: retorna texto bruto se JSON falhar
        return NextResponse.json({ text });
      }
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Erro na API do Gemini:", error);
    return NextResponse.json(
      { error: "Erro ao processar requisição" },
      { status: 500 }
    );
  }
}
