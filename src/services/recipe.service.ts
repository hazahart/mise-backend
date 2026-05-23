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

  async create(data: Omit<Receta, "id">): Promise<Receta> {
    return RecipeDAO.create(data);
  },

  async update(id: string, data: Partial<Omit<Receta, "id">>): Promise<Receta> {
    const existe = await RecipeDAO.findById(id);
    if (!existe) {
      throw { status: 404, code: "not_found", message: "Receta no encontrada" };
    }
    return RecipeDAO.update(id, data);
  },

  async remove(id: string): Promise<void> {
    const existe = await RecipeDAO.findById(id);
    if (!existe) {
      throw { status: 404, code: "not_found", message: "Receta no encontrada" };
    }
    return RecipeDAO.remove(id);
  },
};
