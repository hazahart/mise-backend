import { RecipeDAO } from "../dao/recipe.dao";
import { auth, db } from "../lib/firebase";
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

    const categoriaDoc = await db.collection('categorias').doc(data.categoriaId).get();
    const categoriaNombre = categoriaDoc.data()?.['nombre'] ?? data.categoriaId;

    return RecipeDAO.create({
      ...data,
      chefId,
      chefNombre,
      categoriaNombre,
      imagenUrl: data.imagenUrl ?? null,
      videoUrl: data.videoUrl ?? null,
      totalIngredientes: data.ingredientes.length,
      creadoEn: new Date().toISOString(),
    } as unknown as Omit<Receta, "id">);
  },

  async update(id: string, chefId: string, data: Partial<Omit<Receta, "id">>): Promise<Receta> {
    const existe = await RecipeDAO.findById(id);
    if (!existe) {
      throw { status: 404, code: "not_found", message: "Receta no encontrada" };
    }
    if (existe.chefId !== chefId) {
      throw { status: 403, code: "forbidden", message: "No tienes permiso para editar esta receta" };
    }

    if (data.categoriaId && data.categoriaId !== existe.categoriaId) {
      const categoriaDoc = await db.collection('categorias').doc(data.categoriaId).get();
      data.categoriaNombre = categoriaDoc.data()?.['nombre'] ?? data.categoriaId;
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