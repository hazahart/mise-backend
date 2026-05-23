import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '');

interface SuggestRecipeInput {
    ingredientes: string[];
    restricciones?: string[];
    porciones?: number;
}

interface SuggestRecipeResponse {
    titulo: string;
    descripcion: string;
    tiempoEstimadoMin: number;
    dificultad: 'facil' | 'media' | 'dificil';
    ingredientes: { nombre: string; cantidad: string; unidad: string }[];
    pasos: { orden: number; descripcion: string; tiempoMin?: number }[];
}

export const AIService = {
    async suggestRecipe(input: SuggestRecipeInput): Promise<SuggestRecipeResponse> {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `Eres un chef profesional. Sugiere una receta detallada basada en los siguientes ingredientes disponibles.

Ingredientes disponibles: ${input.ingredientes.join(', ')}
${input.restricciones?.length ? `Restricciones alimentarias: ${input.restricciones.join(', ')}` : ''}
${input.porciones ? `Porciones: ${input.porciones}` : 'Porciones: 2'}

Responde ÚNICAMENTE con un JSON válido sin texto adicional, sin bloques de código, sin explicaciones. El JSON debe tener exactamente esta estructura:
{
  "titulo": "nombre de la receta",
  "descripcion": "descripción breve apetitosa",
  "tiempoEstimadoMin": número,
  "dificultad": "facil" | "media" | "dificil",
  "ingredientes": [
    { "nombre": "ingrediente", "cantidad": "cantidad", "unidad": "unidad" }
  ],
  "pasos": [
    { "orden": 1, "descripcion": "descripción del paso", "tiempoMin": número }
  ]
}`;

        try {
            const result = await model.generateContent(prompt);
            const text = result.response.text().trim();
            const clean = text.replace(/```json|```/g, '').trim();
            return JSON.parse(clean) as SuggestRecipeResponse;
        } catch {
            throw { status: 502, code: 'ai_error', message: 'Error al generar la receta con IA' };
        }
    },
};