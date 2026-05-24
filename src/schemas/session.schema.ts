import { z } from 'zod';

export const createSesionSchema = z.object({
    chefId: z.string().min(1, 'El chef es requerido'),
    fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe tener formato YYYY-MM-DD'),
    hora: z.string().regex(/^\d{2}:\d{2}$/, 'La hora debe tener formato HH:MM'),
    duracionMin: z.number().int().min(30).max(180),
    notas: z.string().max(500).optional(),
});

export const updateSesionSchema = z.object({
    estado: z.enum(['confirmada', 'cancelada', 'completada']).optional(),
    notas: z.string().max(500).optional(),
});