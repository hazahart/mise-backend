import type { Request, Response, NextFunction } from "express";
import { CategoryService } from "../services/category.service";

export const CategoryController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const categorias = await CategoryService.getAll();
      res.json(categorias);
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const categoria = await CategoryService.getById(
        req.params["id"] as string,
      );
      res.json(categoria);
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const categoria = await CategoryService.create(req.body);
      res.status(201).json(categoria);
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const categoria = await CategoryService.update(
        req.params["id"] as string,
        req.body,
      );
      res.json(categoria);
    } catch (error) {
      next(error);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await CategoryService.remove(req.params["id"] as string);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
