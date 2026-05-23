import { z } from 'zod';

export const createCheckoutSessionSchema = z.object({
    plan: z.enum(['monthly', 'yearly'], {
        error: 'El plan debe ser monthly o yearly',
    }),
});