import { z } from 'zod';

export const suggestRecipeSchema = z.object({
    ingredientes: z.array(z.string().min(1)).min(1, 'Debes proporcionar al menos un ingrediente'),
    restricciones: z.array(z.string()).optional(),
    porciones: z.number().int().min(1).max(20).optional(),
});