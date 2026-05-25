import type { Request, Response, NextFunction } from 'express';
import { SessionService } from '../services/session.service';

export const SessionController = {
    async getMySessions(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.uid;
            const rol = req.userRole ?? 'free';
            const sesiones = rol === 'chef'
                ? await SessionService.getByChef(userId)
                : await SessionService.getByUser(userId);
            res.json(sesiones);
        } catch (error) {
            next(error);
        }
    },

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const sesion = await SessionService.getById(req.params['id'] as string);
            res.json(sesion);
        } catch (error) {
            next(error);
        }
    },

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.uid;
            const sesion = await SessionService.create(userId, req.body);
            res.status(201).json(sesion);
        } catch (error) {
            next(error);
        }
    },

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.uid;
            const rol = req.userRole ?? 'free';
            const sesion = await SessionService.update(
                req.params['id'] as string,
                userId,
                rol,
                req.body,
            );
            res.json(sesion);
        } catch (error) {
            next(error);
        }
    },

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.uid;
            await SessionService.delete(req.params['id'] as string, userId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    },
    
    async getChefSessions(req: Request, res: Response, next: NextFunction) {
        try {
            const chefId = req.user!.uid;
            const sesiones = await SessionService.getByChef(chefId);
            res.json(sesiones);
        } catch (error) {
            next(error);
        }
    },
};