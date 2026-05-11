import {Request, Response, NextFunction} from 'express';
import {chefService} from '../services/chef.service';
import {ListChefsInput, ChefAvailabilityInput} from '../schemas/chef.schema';

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
        const {id} = req.params;
        const chef = await chefService.getChef(id);
        res.json(chef);
    } catch (error) {
        next(error);
    }
}

export async function getChefAvailability(req: Request, res: Response, next: NextFunction) {
    try {
        const {id} = req.params;
        const filters = req.query as unknown as ChefAvailabilityInput;
        const availability = await chefService.getAvailability(id, filters);
        res.json(availability);
    } catch (error) {
        next(error);
    }
}