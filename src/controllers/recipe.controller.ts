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
      const receta = await RecipeService.getById(req.params["id"] as string);
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
};
