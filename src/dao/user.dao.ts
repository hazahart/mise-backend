import { auth, db } from '../lib/firebase';
import type { CompleteOnboardingInput } from '../schemas/user.schema';

export class UserDAO {
    async findById(userId: string) {
        try {
            const user = await auth.getUser(userId);
            const docRef = db.collection('usuarios').doc(userId);
            const doc = await docRef.get();

            if (!doc.exists) {
                const nuevoUsuario = {
                    displayName: user.displayName ?? '',
                    rol: 'free',
                    suscripcionActiva: false,
                    suscripcionExpira: null,
                    suscripcionCancelada: false,
                    stripeCustomerId: null,
                    onboardingCompletado: false,
                    creadoEn: new Date().toISOString(),
                    ultimoAcceso: new Date().toISOString(),
                };
                await docRef.set(nuevoUsuario);
                return {
                    id: user.uid,
                    nombre: user.displayName ?? '',
                    email: user.email ?? '',
                    fotoUrl: user.photoURL ?? null,
                    rol: 'free',
                    suscripcionActiva: false,
                    suscripcionExpira: null,
                    suscripcionCancelada: false,
                    stripeCustomerId: null,
                    onboardingCompletado: false,
                    bio: null,
                    especialidad: null,
                };
            }

            await docRef.update({ ultimoAcceso: new Date().toISOString() });

            const data = doc.data() ?? {};
            return {
                id: user.uid,
                nombre: user.displayName ?? '',
                email: user.email ?? '',
                fotoUrl: user.photoURL ?? null,
                rol: data['rol'] ?? 'free',
                suscripcionActiva: data['suscripcionActiva'] ?? false,
                suscripcionExpira: data['suscripcionExpira'] ?? null,
                suscripcionCancelada: data['suscripcionCancelada'] ?? false,
                stripeCustomerId: data['stripeCustomerId'] ?? null,
                onboardingCompletado: data['onboardingCompletado'] ?? false,
                bio: data['bio'] ?? null,
                especialidad: data['especialidad'] ?? null,
            };
        } catch {
            return null;
        }
    }

    async findByStripeCustomerId(stripeCustomerId: string) {
        const snapshot = await db.collection('usuarios')
            .where('stripeCustomerId', '==', stripeCustomerId)
            .limit(1)
            .get();
        if (snapshot.empty) return null;
        const doc = snapshot.docs[0];
        const user = await auth.getUser(doc.id);
        const data = doc.data();
        return {
            id: doc.id,
            nombre: user.displayName ?? '',
            email: user.email ?? '',
            fotoUrl: user.photoURL ?? null,
            rol: data['rol'] ?? 'free',
            suscripcionActiva: data['suscripcionActiva'] ?? false,
            suscripcionExpira: data['suscripcionExpira'] ?? null,
            suscripcionCancelada: data['suscripcionCancelada'] ?? false,
            stripeCustomerId: data['stripeCustomerId'] ?? null,
            onboardingCompletado: data['onboardingCompletado'] ?? false,
            bio: data['bio'] ?? null,
            especialidad: data['especialidad'] ?? null,
        };
    }

    async update(userId: string, data: { nombre?: string; fotoUrl?: string; bio?: string; especialidad?: string }) {
        await auth.updateUser(userId, {
            ...(data.nombre && { displayName: data.nombre }),
            ...(data.fotoUrl && { photoURL: data.fotoUrl }),
        });
        await db.collection('usuarios').doc(userId).set({
            ...(data.bio !== undefined && { bio: data.bio }),
            ...(data.especialidad !== undefined && { especialidad: data.especialidad }),
        }, { merge: true });
        return this.findById(userId);
    }

    async completeOnboarding(userId: string, data: CompleteOnboardingInput) {
        await auth.updateUser(userId, {
            displayName: data.nombre,
            ...(data.fotoUrl && { photoURL: data.fotoUrl }),
        });

        await auth.setCustomUserClaims(userId, { rol: data.rol });

        await db.collection('usuarios').doc(userId).set({
            rol: data.rol,
            bio: data.bio ?? null,
            especialidad: data.especialidad ?? null,
            onboardingCompletado: true,
            suscripcionActiva: false,
        }, { merge: true });

        return this.findById(userId);
    }

    async updateRole(userId: string, data: {
        nuevoRol: string;
        stripeCustomerId?: string;
        stripeSubscriptionId?: string;
        suscripcionExpira?: string;
    }) {
        await auth.setCustomUserClaims(userId, { rol: data.nuevoRol });
        await db.collection('usuarios').doc(userId).set({
            rol: data.nuevoRol,
            suscripcionActiva: data.nuevoRol === 'premium',
            suscripcionCancelada: false,
            ...(data.stripeCustomerId && { stripeCustomerId: data.stripeCustomerId }),
            ...(data.stripeSubscriptionId && { stripeSubscriptionId: data.stripeSubscriptionId }),
            ...(data.suscripcionExpira && { suscripcionExpira: data.suscripcionExpira }),
        }, { merge: true });
        return this.findById(userId);
    }
}

export const userDAO = new UserDAO();