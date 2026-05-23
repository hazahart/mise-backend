import { auth, db } from '../lib/firebase';

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
                    stripeCustomerId: null,
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
                    stripeCustomerId: null,
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
                stripeCustomerId: data['stripeCustomerId'] ?? null,
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
            stripeCustomerId: data['stripeCustomerId'] ?? null,
        };
    }

    async update(userId: string, data: { nombre?: string; fotoUrl?: string }) {
        await auth.updateUser(userId, {
            ...(data.nombre && { displayName: data.nombre }),
            ...(data.fotoUrl && { photoURL: data.fotoUrl }),
        });
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
            ...(data.stripeCustomerId && { stripeCustomerId: data.stripeCustomerId }),
            ...(data.stripeSubscriptionId && { stripeSubscriptionId: data.stripeSubscriptionId }),
            ...(data.suscripcionExpira && { suscripcionExpira: data.suscripcionExpira }),
        }, { merge: true });
        return this.findById(userId);
    }
}

export const userDAO = new UserDAO();