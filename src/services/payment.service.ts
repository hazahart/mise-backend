import Stripe from 'stripe';
import { userDAO } from '../dao/user.dao';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
    apiVersion: '2026-04-22.dahlia',
});

const PLANES: Record<string, string> = {
    monthly: process.env.STRIPE_PRICE_MONTHLY ?? '',
    yearly: process.env.STRIPE_PRICE_YEARLY ?? '',
};

export const PaymentService = {
    async createCheckoutSession(userId: string, email: string, plan: 'monthly' | 'yearly') {
        const usuario = await userDAO.findById(userId);
        if (!usuario) {
            throw { status: 404, code: 'not_found', message: 'Usuario no encontrado' };
        }

        if (usuario.rol === 'premium' && usuario.suscripcionActiva) {
            throw {
                status: 400,
                code: 'already_subscribed',
                message: `Ya tienes una suscripción activa${usuario.suscripcionExpira ? ` que vence el ${new Date(usuario.suscripcionExpira).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}` : ''}`,
            };
        }

        let customerId = usuario.stripeCustomerId;

        if (!customerId) {
            const customer = await stripe.customers.create({ email });
            customerId = customer.id;
        }

        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            line_items: [{ price: PLANES[plan], quantity: 1 }],
            mode: 'subscription',
            success_url: `${process.env.FRONTEND_URL}/suscripcion/exito?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/suscripcion/cancelado`,
            metadata: { userId },
        });

        return { sessionId: session.id, checkoutUrl: session.url };
    },

    async cancelSubscription(userId: string) {
        const usuario = await userDAO.findById(userId);
        if (!usuario) {
            throw { status: 404, code: 'not_found', message: 'Usuario no encontrado' };
        }

        if (usuario.rol !== 'premium' || !usuario.suscripcionActiva) {
            throw { status: 400, code: 'no_active_subscription', message: 'No tienes una suscripción activa' };
        }

        const { db } = await import('../lib/firebase');
        const doc = await db.collection('usuarios').doc(userId).get();
        const stripeSubscriptionId = doc.data()?.['stripeSubscriptionId'] as string | undefined;

        if (!stripeSubscriptionId) {
            throw { status: 400, code: 'no_subscription_id', message: 'No se encontró el ID de suscripción' };
        }

        const subscription = await stripe.subscriptions.update(stripeSubscriptionId, {
            cancel_at_period_end: true,
        });

        const subData = subscription as unknown as Record<string, unknown>;
        const items = subData['items'] as { data: Array<Record<string, unknown>> };
        const firstItem = items?.data?.[0];
        const periodEnd = firstItem?.['current_period_end'] as number | undefined;
        const expira = periodEnd ? new Date(periodEnd * 1000).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }) : null;

        return {
            message: `Tu suscripción se cancelará al final del periodo${expira ? `. Mantendrás acceso premium hasta el ${expira}` : ''}`,
        };
    },

    async handleWebhook(payload: Buffer, signature: string) {
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? '';
        let event: ReturnType<typeof stripe.webhooks.constructEvent>;

        try {
            event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
        } catch {
            throw { status: 400, code: 'invalid_signature', message: 'Firma del webhook inválida' };
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const userId = session.metadata?.userId;
            if (!userId) return;

            const subscriptionId = typeof session.subscription === 'string'
                ? session.subscription
                : session.subscription?.id;

            if (!subscriptionId) return;

            const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
                expand: ['items.data.price'],
            });

            const subData = subscription as unknown as Record<string, unknown>;
            const items = subData['items'] as { data: Array<Record<string, unknown>> };
            const firstItem = items?.data?.[0];
            const periodEnd = firstItem?.['current_period_end'] as number | undefined;
            const expira = periodEnd ? new Date(periodEnd * 1000).toISOString() : null;

            await userDAO.updateRole(userId, {
                nuevoRol: 'premium',
                stripeCustomerId: typeof session.customer === 'string' ? session.customer : session.customer?.id ?? '',
                stripeSubscriptionId: subscriptionId,
                ...(expira && { suscripcionExpira: expira }),
            });
        }

        if (event.type === 'customer.subscription.deleted') {
            const subscription = event.data.object;
            const customerId = typeof subscription.customer === 'string'
                ? subscription.customer
                : subscription.customer.id;

            const usuario = await userDAO.findByStripeCustomerId(customerId);
            if (!usuario) return;

            await userDAO.updateRole(usuario.id, { nuevoRol: 'free' });
        }
    },
};