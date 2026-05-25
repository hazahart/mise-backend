import { auth, db } from '../lib/firebase';

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
        try {
            const doc = await db.collection('usuarios').doc(chefId).get();
            const data = doc.data() ?? {};
            const slots: string[] = data['slotsDisponibles'] ?? ['09:00', '11:00', '13:00', '16:00', '18:00'];
            const diasDisponibles: number[] = data['diasDisponibles'] ?? [1, 2, 3, 4, 5];

            const diaSemana = new Date(fecha + 'T12:00:00').getDay();
            if (!diasDisponibles.includes(diaSemana)) {
                return { chefId, fecha, slotsDisponibles: [] };
            }

            const snapshot = await db.collection('sesiones')
                .where('chefId', '==', chefId)
                .where('fecha', '==', fecha)
                .where('estado', 'in', ['pendiente', 'confirmada'])
                .get();

            const ocupados = snapshot.docs.map(d => d.data().hora as string);
            const disponibles = slots.filter(s => !ocupados.includes(s));

            return { chefId, fecha, slotsDisponibles: disponibles };
        } catch {
            return { chefId, fecha, slotsDisponibles: [] };
        }
    }

    async updateDisponibilidad(chefId: string, data: { slots: string[]; diasDisponibles?: number[] }) {
        await db.collection('usuarios').doc(chefId).set({
            slotsDisponibles: data.slots,
            ...(data.diasDisponibles && { diasDisponibles: data.diasDisponibles }),
        }, { merge: true });
    }
}

export const chefDAO = new ChefDAO();