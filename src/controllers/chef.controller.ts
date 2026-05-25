import { Request, Response, NextFunction } from 'express';
import { chefService } from '../services/chef.service';
import { ListChefsInput, ChefAvailabilityInput, UpdateDisponibilidadInput } from '../schemas/chef.schema';

export async function listChefs(req: Request, res: Response, next: NextFunction) {
    try {
        const filters = req.query as unknown as ListChefsInput;
        const chefs = await chefService.listChefs(filters);
        res.json(chefs);
    } catch (error) {
        next(error);
    }
}

export async function getChef(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params['id'] as string;
        const chef = await chefService.getChef(id);
        res.json(chef);
    } catch (error) {
        next(error);
    }
}

export async function getChefAvailability(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params['id'] as string;
        const filters = req.query as unknown as ChefAvailabilityInput;
        const availability = await chefService.getAvailability(id, filters);
        res.json(availability);
    } catch (error) {
        next(error);
    }
}

export async function updateDisponibilidad(req: Request, res: Response, next: NextFunction) {
    try {
        const chefId = req.user!.uid;
        const data = req.body as UpdateDisponibilidadInput;
        const result = await chefService.updateDisponibilidad(chefId, data);
        res.json(result);
    } catch (error) {
        next(error);
    }
}

export async function getMiDisponibilidad(req: Request, res: Response, next: NextFunction) {
    try {
        const chefId = req.user!.uid;
        const doc = await (await import('../lib/firebase')).db.collection('usuarios').doc(chefId).get();
        const data = doc.data() ?? {};
        res.json({
            slotsDisponibles: data['slotsDisponibles'] ?? ['09:00', '11:00', '13:00', '16:00', '18:00'],
            diasDisponibles: data['diasDisponibles'] ?? [1, 2, 3, 4, 5],
        });
    } catch (error) {
        next(error);
    }
}