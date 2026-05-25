import { z } from 'zod';

export const listChefsSchema = z.object({
    especialidad: z.string().optional(),
    disponible: z.boolean().optional(),
});

export const chefAvailabilitySchema = z.object({
    fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const updateDisponibilidadSchema = z.object({
    slots: z.array(z.string().regex(/^\d{2}:\d{2}$/)).min(1),
    diasDisponibles: z.array(z.number().int().min(0).max(6)).optional(),
});

export type ListChefsInput = z.infer<typeof listChefsSchema>;
export type ChefAvailabilityInput = z.infer<typeof chefAvailabilitySchema>;
export type UpdateDisponibilidadInput = z.infer<typeof updateDisponibilidadSchema>;