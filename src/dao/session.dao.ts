import { db } from '../lib/firebase';
import type { Sesion } from '../types/session';

export const SessionDAO = {
    async findByUser(usuarioId: string): Promise<Sesion[]> {
        const snapshot = await db.collection('sesiones')
            .where('usuarioId', '==', usuarioId)
            .orderBy('fecha', 'desc')
            .get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Sesion[];
    },

    async findByChef(chefId: string): Promise<Sesion[]> {
        const snapshot = await db.collection('sesiones')
            .where('chefId', '==', chefId)
            .orderBy('fecha', 'desc')
            .get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Sesion[];
    },

    async findById(id: string): Promise<Sesion | null> {
        const doc = await db.collection('sesiones').doc(id).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() } as Sesion;
    },

    async findConflict(chefId: string, fecha: string, hora: string): Promise<boolean> {
        const snapshot = await db.collection('sesiones')
            .where('chefId', '==', chefId)
            .where('fecha', '==', fecha)
            .where('hora', '==', hora)
            .where('estado', 'in', ['pendiente', 'confirmada'])
            .get();
        return !snapshot.empty;
    },

    async create(data: Omit<Sesion, 'id'>): Promise<Sesion> {
        const ref = await db.collection('sesiones').add(data);
        return { id: ref.id, ...data };
    },

    async update(id: string, data: Partial<Omit<Sesion, 'id'>>): Promise<Sesion> {
        const updateData = { ...data, actualizadoEn: new Date().toISOString() };
        await db.collection('sesiones').doc(id).update(updateData);
        const updated = await db.collection('sesiones').doc(id).get();
        return { id: updated.id, ...updated.data() } as Sesion;
    },

    async delete(id: string): Promise<void> {
        await db.collection('sesiones').doc(id).delete();
    },
};