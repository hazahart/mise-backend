import {users} from '../lib/appwrite';

export class UserDAO {

    async findById(userId: string) {
        try {
            const user = await users.get(userId);
            const prefs = user.prefs as Record<string, string>;

            return {
                id: user.$id,
                nombre: user.name,
                email: user.email,
                fotoUrl: prefs.fotoUrl ?? null,
                rol: prefs.rol ?? 'free',
                suscripcionActiva: prefs.suscripcionActiva === 'true',
                suscripcionExpira: prefs.suscripcionExpira ?? null,
                stripeCustomerId: prefs.stripeCustomerId ?? null,
            };
        } catch {
            return null;
        }
    }

    async update(userId: string, data: { nombre?: string; fotoUrl?: string }) {
        if (data.nombre) {
            await users.updateName(userId, data.nombre);
        }

        if (data.fotoUrl) {
            const current = await users.getPrefs(userId);
            await users.updatePrefs(userId, {
                ...current,
                fotoUrl: data.fotoUrl,
            });
        }

        return this.findById(userId);
    }

    async updateRole(userId: string, data: {
        nuevoRol: string;
        stripeCustomerId?: string;
        stripeSubscriptionId?: string;
        suscripcionExpira?: string;
    }) {
        const current = await users.getPrefs(userId);

        await users.updatePrefs(userId, {
            ...current,
            rol: data.nuevoRol,
            suscripcionActiva: data.nuevoRol === 'premium' ? 'true' : 'false',
            ...(data.stripeCustomerId && {stripeCustomerId: data.stripeCustomerId}),
            ...(data.stripeSubscriptionId && {stripeSubscriptionId: data.stripeSubscriptionId}),
            ...(data.suscripcionExpira && {suscripcionExpira: data.suscripcionExpira}),
        });

        return this.findById(userId);
    }
}

export const userDAO = new UserDAO();