import { RecipeDAO } from "../dao/recipe.dao";
import type { Receta } from "../types/catalog";

export const RecipeService = {
  async getAll(
    filters: {
      categoriaId?: string;
      limit?: number;
      page?: number;
    } = {},
  ): Promise<{ data: Receta[]; total: number }> {
    return RecipeDAO.findAll(filters);
  },

  async getById(id: string): Promise<Receta> {
    const receta = await RecipeDAO.findById(id);
    if (!receta) {
      throw { status: 404, code: "not_found", message: "Receta no encontrada" };
    }
    return receta;
  },

  async getByCategory(categoriaId: string): Promise<Receta[]> {
    return RecipeDAO.findByCategory(categoriaId);
  },

  async getToday(): Promise<Receta[]> {
    return RecipeDAO.findToday();
  },
};
