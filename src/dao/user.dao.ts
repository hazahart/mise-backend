import {auth, db} from '../lib/firebase';

export class UserDAO {

    async findById(userId: string) {
        try {
            console.log('Buscando usuario:', userId);
            const user = await auth.getUser(userId);
            console.log('Firebase Auth user:', user.uid);
            const doc = await db.collection('usuarios').doc(userId).get();
            console.log('Firestore doc exists:', doc.exists);
            console.log('Firestore data:', doc.data());
            const data = doc.data() ?? {};

            return {
                id: user.uid,
                nombre: user.displayName ?? '',
                email: user.email ?? '',
                fotoUrl: user.photoURL ?? null,
                rol: data.rol ?? 'free',
                suscripcionActiva: data.suscripcionActiva ?? false,
                suscripcionExpira: data.suscripcionExpira ?? null,
                stripeCustomerId: data.stripeCustomerId ?? null,
            };
        } catch {
            return null;
        }
    }

    async update(userId: string, data: { nombre?: string; fotoUrl?: string }) {
        await auth.updateUser(userId, {
            ...(data.nombre && {displayName: data.nombre}),
            ...(data.fotoUrl && {photoURL: data.fotoUrl}),
        });

        return this.findById(userId);
    }

    async updateRole(userId: string, data: {
        nuevoRol: string;
        stripeCustomerId?: string;
        stripeSubscriptionId?: string;
        suscripcionExpira?: string;
    }) {
        await auth.setCustomUserClaims(userId, {rol: data.nuevoRol});

        await db.collection('usuarios').doc(userId).set({
            rol: data.nuevoRol,
            suscripcionActiva: data.nuevoRol === 'premium',
            ...(data.stripeCustomerId && {stripeCustomerId: data.stripeCustomerId}),
            ...(data.stripeSubscriptionId && {stripeSubscriptionId: data.stripeSubscriptionId}),
            ...(data.suscripcionExpira && {suscripcionExpira: data.suscripcionExpira}),
        }, {merge: true});

        return this.findById(userId);
    }
}

export const userDAO = new UserDAO();