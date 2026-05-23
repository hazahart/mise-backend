import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { verifySession } from '../middlewares/verifySession';
import { validate } from '../middlewares/validate';
import { createCheckoutSessionSchema } from '../schemas/payment.schema';

const router = Router();

router.post(
    '/create-checkout-session',
    verifySession,
    validate(createCheckoutSessionSchema),
    PaymentController.createCheckoutSession,
);

router.post('/webhook', PaymentController.handleWebhook);

export default router;