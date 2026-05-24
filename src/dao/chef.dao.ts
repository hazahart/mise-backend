import {auth, db} from '../lib/firebase';

export class ChefDAO {

    async findAll(filters: { especialidad?: string; disponible?: boolean }) {
        const listResult = await auth.listUsers();

        let chefs = await Promise.all(
            listResult.users
                .filter(u => u.customClaims?.rol === 'chef')
                .map(async u => {
                    const doc = await db.collection('usuarios').doc(u.uid).get();
                    const data = doc.data() ?? {};
                    return {
                        id: u.uid,
                        nombre: u.displayName ?? '',
                        especialidad: data.especialidad ?? null,
                        bio: data.bio ?? null,
                        fotoUrl: u.photoURL ?? null,
                        disponible: data.disponible ?? true,
                    };
                })
        );

        if (filters.especialidad) {
            chefs = chefs.filter(c => c.especialidad === filters.especialidad);
        }

        if (filters.disponible !== undefined) {
            chefs = chefs.filter(c => c.disponible === filters.disponible);
        }

        return chefs;
    }

    async findById(chefId: string) {
        try {
            const user = await auth.getUser(chefId);
            if (user.customClaims?.rol !== 'chef') return null;

            const doc = await db.collection('usuarios').doc(chefId).get();
            const data = doc.data() ?? {};

            return {
                id: user.uid,
                nombre: user.displayName ?? '',
                especialidad: data.especialidad ?? null,
                bio: data.bio ?? null,
                fotoUrl: user.photoURL ?? null,
                disponible: data.disponible ?? true,
            };
        } catch {
            return null;
        }
    }

    async getAvailability(chefId: string, fecha: string) {
        const slots = [
            `${fecha}T09:00:00Z`,
            `${fecha}T11:00:00Z`,
            `${fecha}T13:00:00Z`,
            `${fecha}T16:00:00Z`,
            `${fecha}T18:00:00Z`,
        ];

        try {
            const snapshot = await db.collection('sesiones')
                .where('chefId', '==', chefId)
                .where('fecha', '>=', `${fecha}T00:00:00Z`)
                .where('fecha', '<=', `${fecha}T23:59:59Z`)
                .where('estado', '!=', 'cancelada')
                .get();

            const ocupados = snapshot.docs.map(d => d.data().fecha as string);
            const disponibles = slots.filter(s => !ocupados.includes(s));

            return {chefId, fecha, slotsDisponibles: disponibles};
        } catch {
            return {chefId, fecha, slotsDisponibles: slots};
        }
    }
}

export const chefDAO = new ChefDAO();