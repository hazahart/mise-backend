import {z} from 'zod';

export const updateUsuarioSchema = z.object({
    nombre: z.string().min(2).max(100).optional(),
    fotoUrl: z.string().url().optional(),
}).refine(data => Object.keys(data).length > 0, {
    message: 'Debes enviar al menos un campo para actualizar',
});

export const updateRoleSchema = z.object({
    userId: z.string().min(1),
    nuevoRol: z.enum(['free', 'premium', 'chef']),
    stripeCustomerId: z.string().optional(),
    stripeSubscriptionId: z.string().optional(),
    suscripcionExpira: z.string().datetime().optional(),
});

export type UpdateUsuarioInput = z.infer<typeof updateUsuarioSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;