import type { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/payment.service';

export const PaymentController = {
    async createCheckoutSession(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.uid;
            const email = req.user!.email ?? '';
            const { plan } = req.body;
            const result = await PaymentService.createCheckoutSession(userId, email, plan);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async cancelSubscription(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.uid;
            const result = await PaymentService.cancelSubscription(userId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async handleWebhook(req: Request, res: Response, next: NextFunction) {
        try {
            const signature = req.headers['stripe-signature'] as string;
            await PaymentService.handleWebhook(req.body as Buffer, signature);
            res.json({ received: true });
        } catch (error) {
            next(error);
        }
    },
};