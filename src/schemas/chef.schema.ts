import {z} from 'zod';

export const listChefsSchema = z.object({
    especialidad: z.string().optional(),
    disponible: z.coerce.boolean().optional(),
});

export const chefAvailabilitySchema = z.object({
    fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido, usa YYYY-MM-DD'),
});

export type ListChefsInput = z.infer<typeof listChefsSchema>;
export type ChefAvailabilityInput = z.infer<typeof chefAvailabilitySchema>;