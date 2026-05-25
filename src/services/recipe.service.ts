import { RecipeDAO } from "../dao/recipe.dao";
import { CategoryDAO } from "../dao/category.dao";
import { auth } from "../lib/firebase";
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

  async getByChef(chefId: string): Promise<Receta[]> {
    return RecipeDAO.findByChef(chefId);
  },

  async create(chefId: string, data: {
    titulo: string;
    descripcion: string;
    categoriaId: string;
    nuevaCategoria?: { nombre: string; descripcion: string; imagenUrl?: string | null };
    imagenUrl?: string | null;
    videoUrl?: string | null;
    tiempoEstimadoMin: number;
    dificultad: "facil" | "media" | "dificil";
    esPremium: boolean;
    ingredientes: Receta["ingredientes"];
    pasos: Receta["pasos"];
  }): Promise<Receta> {
    const chefUser = await auth.getUser(chefId);
    const chefNombre = chefUser.displayName ?? 'Chef';

    let categoriaId = data.categoriaId;
    let categoriaNombre = '';

    if (data.nuevaCategoria) {
      const nueva = await CategoryDAO.create({
        nombre: data.nuevaCategoria.nombre,
        descripcion: data.nuevaCategoria.descripcion,
        imagenUrl: data.nuevaCategoria.imagenUrl ?? null,
        totalRecetas: 0,
      });
      categoriaId = nueva.id;
      categoriaNombre = nueva.nombre;
    } else {
      const categoria = await CategoryDAO.findById(categoriaId);
      if (!categoria) {
        throw { status: 404, code: "not_found", message: "Categoría no encontrada" };
      }
      categoriaNombre = categoria.nombre;
    }

    return RecipeDAO.create({
      ...data,
      categoriaId,
      chefId,
      chefNombre,
      categoriaNombre,
      imagenUrl: data.imagenUrl ?? null,
      videoUrl: data.videoUrl ?? null,
      totalIngredientes: data.ingredientes.length,
      creadoEn: new Date().toISOString(),
    } as unknown as Omit<Receta, "id">);
  },

  async update(id: string, chefId: string, data: Partial<Omit<Receta, "id">> & { nuevaCategoria?: { nombre: string; descripcion: string; imagenUrl?: string | null } }): Promise<Receta> {
    const existe = await RecipeDAO.findById(id);
    if (!existe) {
      throw { status: 404, code: "not_found", message: "Receta no encontrada" };
    }
    if (existe.chefId !== chefId) {
      throw { status: 403, code: "forbidden", message: "No tienes permiso para editar esta receta" };
    }

    if (data.nuevaCategoria) {
      const nueva = await CategoryDAO.create({
        nombre: data.nuevaCategoria.nombre,
        descripcion: data.nuevaCategoria.descripcion,
        imagenUrl: data.nuevaCategoria.imagenUrl ?? null,
        totalRecetas: 0,
      });
      data.categoriaId = nueva.id;
      data.categoriaNombre = nueva.nombre;
      delete data.nuevaCategoria;
    } else if (data.categoriaId && data.categoriaId !== existe.categoriaId) {
      const categoria = await CategoryDAO.findById(data.categoriaId);
      if (categoria) data.categoriaNombre = categoria.nombre;
    }

    return RecipeDAO.update(id, data);
  },

  async remove(id: string, chefId: string): Promise<void> {
    const existe = await RecipeDAO.findById(id);
    if (!existe) {
      throw { status: 404, code: "not_found", message: "Receta no encontrada" };
    }
    if (existe.chefId !== chefId) {
      throw { status: 403, code: "forbidden", message: "No tienes permiso para eliminar esta receta" };
    }
    return RecipeDAO.remove(id);
  },
};