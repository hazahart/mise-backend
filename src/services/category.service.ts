import { CategoryDAO } from "../dao/category.dao";
import type { Categoria } from "../types/catalog";

export const CategoryService = {
  async getAll(): Promise<Categoria[]> {
    return CategoryDAO.findAll();
  },

  async getById(id: string): Promise<Categoria> {
    const categoria = await CategoryDAO.findById(id);
    if (!categoria) {
      throw {
        status: 404,
        code: "not_found",
        message: "Categoría no encontrada",
      };
    }
    return categoria;
  },

  async create(data: Omit<Categoria, "id">): Promise<Categoria> {
    return CategoryDAO.create(data);
  },

  async update(
    id: string,
    data: Partial<Omit<Categoria, "id">>,
  ): Promise<Categoria> {
    const existe = await CategoryDAO.findById(id);
    if (!existe) {
      throw {
        status: 404,
        code: "not_found",
        message: "Categoría no encontrada",
      };
    }
    return CategoryDAO.update(id, data);
  },

  async remove(id: string): Promise<void> {
    const existe = await CategoryDAO.findById(id);
    if (!existe) {
      throw {
        status: 404,
        code: "not_found",
        message: "Categoría no encontrada",
      };
    }
    return CategoryDAO.remove(id);
  },
};
