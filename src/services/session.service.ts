import { SessionDAO } from '../dao/session.dao';
import { userDAO } from '../dao/user.dao';
import type { Sesion, EstadoSesion } from '../types/session';

export const SessionService = {
    async getByUser(usuarioId: string): Promise<Sesion[]> {
        return SessionDAO.findByUser(usuarioId);
    },

    async getByChef(chefId: string): Promise<Sesion[]> {
        return SessionDAO.findByChef(chefId);
    },

    async getById(id: string): Promise<Sesion> {
        const sesion = await SessionDAO.findById(id);
        if (!sesion) {
            throw { status: 404, code: 'not_found', message: 'Sesión no encontrada' };
        }
        return sesion;
    },

    async create(usuarioId: string, data: {
        chefId: string;
        fecha: string;
        hora: string;
        duracionMin: number;
        notas?: string;
    }): Promise<Sesion> {
        const usuario = await userDAO.findById(usuarioId);
        if (!usuario) {
            throw { status: 404, code: 'not_found', message: 'Usuario no encontrado' };
        }

        const conflicto = await SessionDAO.findConflict(data.chefId, data.fecha, data.hora);
        if (conflicto) {
            throw { status: 409, code: 'conflict', message: 'El chef ya tiene una sesión en ese horario' };
        }

        const { db } = await import('../lib/firebase');
        const chefDoc = await db.collection('usuarios').doc(data.chefId).get();
        const chefNombre = chefDoc.data()?.['displayName'] ?? 'Chef';

        const ahora = new Date().toISOString();
        return SessionDAO.create({
            usuarioId,
            usuarioNombre: usuario.nombre,
            chefId: data.chefId,
            chefNombre,
            fecha: data.fecha,
            hora: data.hora,
            duracionMin: data.duracionMin,
            estado: 'pendiente',
            notas: data.notas,
            creadoEn: ahora,
            actualizadoEn: ahora,
        });
    },

    async update(id: string, usuarioId: string, rol: string, data: {
        estado?: EstadoSesion;
        notas?: string;
    }): Promise<Sesion> {
        const sesion = await SessionDAO.findById(id);
        if (!sesion) {
            throw { status: 404, code: 'not_found', message: 'Sesión no encontrada' };
        }

        if (rol === 'premium' && sesion.usuarioId !== usuarioId) {
            throw { status: 403, code: 'forbidden', message: 'No tienes permiso para modificar esta sesión' };
        }

        if (rol === 'chef' && sesion.chefId !== usuarioId) {
            throw { status: 403, code: 'forbidden', message: 'No tienes permiso para modificar esta sesión' };
        }

        if (rol === 'premium' && data.estado && !['cancelada'].includes(data.estado)) {
            throw { status: 403, code: 'forbidden', message: 'Solo puedes cancelar la sesión' };
        }

        if (sesion.estado === 'cancelada') {
            throw { status: 400, code: 'invalid_state', message: 'No se puede modificar una sesión cancelada' };
        }

        return SessionDAO.update(id, data);
    },

    async delete(id: string, usuarioId: string): Promise<void> {
        const sesion = await SessionDAO.findById(id);
        if (!sesion) {
            throw { status: 404, code: 'not_found', message: 'Sesión no encontrada' };
        }

        if (sesion.estado !== 'cancelada') {
            throw { status: 400, code: 'invalid_state', message: 'Solo se pueden eliminar sesiones canceladas' };
        }

        if (sesion.usuarioId !== usuarioId) {
            throw { status: 403, code: 'forbidden', message: 'No tienes permiso para eliminar esta sesión' };
        }

        return SessionDAO.delete(id);
    },
};