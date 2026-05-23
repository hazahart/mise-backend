import type { Request, Response, NextFunction } from 'express';
import { AIService } from '../services/ai.service';

export const AIController = {
    async suggestRecipe(req: Request, res: Response, next: NextFunction) {
        try {
            const receta = await AIService.suggestRecipe(req.body);
            res.json(receta);
        } catch (error) {
            next(error);
        }
    },
};