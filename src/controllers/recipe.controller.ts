import type { Request, Response, NextFunction } from "express";
import { RecipeService } from "../services/recipe.service";

export const RecipeController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const categoriaId = req.query["categoriaId"] as string | undefined;
      const limit = req.query["limit"] ? Number(req.query["limit"]) : undefined;
      const page = req.query["page"] ? Number(req.query["page"]) : undefined;
      const result = await RecipeService.getAll({ categoriaId, limit, page });
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const receta = await RecipeService.getById(req.params['id'] as string);
      if (receta.esPremium) {
        const token = req.headers.authorization?.split('Bearer ')[1];
        if (!token) {
          return res.status(403).json({ code: 'forbidden', message: 'Esta receta es exclusiva para usuarios premium' });
        }
        try {
          const { auth } = await import('../lib/firebase');
          const decoded = await auth.verifyIdToken(token);
          const rol = decoded.rol ?? 'free';
          if (rol === 'free') {
            return res.status(403).json({ code: 'forbidden', message: 'Esta receta es exclusiva para usuarios premium' });
          }
        } catch {
          return res.status(403).json({ code: 'forbidden', message: 'Esta receta es exclusiva para usuarios premium' });
        }
      }
      res.json(receta);
    } catch (error) {
      next(error);
    }
  },

  async getToday(req: Request, res: Response, next: NextFunction) {
    try {
      const recetas = await RecipeService.getToday();
      res.json(recetas);
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const chefId = req.user!.uid;
      const receta = await RecipeService.create(chefId, req.body);
      res.status(201).json(receta);
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const chefId = req.user!.uid;
      const receta = await RecipeService.update(
        req.params["id"] as string,
        chefId,
        req.body,
      );
      res.json(receta);
    } catch (error) {
      next(error);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const chefId = req.user!.uid;
      await RecipeService.remove(req.params["id"] as string, chefId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  async getByChef(req: Request, res: Response, next: NextFunction) {
    try {
      const chefId = req.user!.uid;
      const result = await RecipeService.getByChef(chefId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
};