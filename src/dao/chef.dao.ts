import {users, databases} from '../lib/appwrite';
import {Query} from 'node-appwrite';

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID!;
const SESSIONS_TABLE = 'sesiones';

export class ChefDAO {

    async findAll(filters: { especialidad?: string; disponible?: boolean }) {
        const allUsers = await users.list();

        let chefs = allUsers.users
            .filter(u => (u.prefs as Record<string, string>).rol === 'chef')
            .map(u => {
                const prefs = u.prefs as Record<string, string>;
                return {
                    id: u.$id,
                    nombre: u.name,
                    especialidad: prefs.especialidad ?? null,
                    bio: prefs.bio ?? null,
                    fotoUrl: prefs.fotoUrl ?? null,
                    disponible: prefs.disponible === 'true',
                };
            });

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
            const user = await users.get(chefId);
            const prefs = user.prefs as Record<string, string>;

            if (prefs.rol !== 'chef') return null;

            return {
                id: user.$id,
                nombre: user.name,
                especialidad: prefs.especialidad ?? null,
                bio: prefs.bio ?? null,
                fotoUrl: prefs.fotoUrl ?? null,
                disponible: prefs.disponible === 'true',
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
            const sesiones = await databases.listDocuments(DATABASE_ID, SESSIONS_TABLE, [
                Query.equal('chefId', chefId),
                Query.greaterThanEqual('fecha', `${fecha}T00:00:00Z`),
                Query.lessThan('fecha', `${fecha}T23:59:59Z`),
                Query.notEqual('estado', 'cancelada'),
            ]);

            const ocupados = sesiones.documents.map(s => s.fecha as string);
            const disponibles = slots.filter(s => !ocupados.includes(s));

            return {
                chefId,
                fecha,
                slotsDisponibles: disponibles,
            };
        } catch {
            return {
                chefId,
                fecha,
                slotsDisponibles: slots,
            };
        }
    }
}

export const chefDAO = new ChefDAO();