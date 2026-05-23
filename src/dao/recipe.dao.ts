import { db } from "../lib/firebase";
import type { Receta } from "../types/catalog";

export const RecipeDAO = {
  async findAll(
    filters: {
      categoriaId?: string;
      limit?: number;
      page?: number;
    } = {},
  ): Promise<{ data: Receta[]; total: number }> {
    let query: FirebaseFirestore.Query = db.collection("recetas");

    if (filters.categoriaId) {
      query = query.where("categoriaId", "==", filters.categoriaId);
    }

    const totalSnap = await query.count().get();
    const total = totalSnap.data().count;

    const limit = filters.limit ?? 10;
    const page = filters.page ?? 1;
    const offset = (page - 1) * limit;

    query = query.orderBy("creadoEn", "desc").limit(limit).offset(offset);

    const snapshot = await query.get();
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Receta[];

    return { data, total };
  },

  async findById(id: string): Promise<Receta | null> {
    const doc = await db.collection("recetas").doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Receta;
  },

  async findByCategory(categoriaId: string): Promise<Receta[]> {
    const snapshot = await db
      .collection("recetas")
      .where("categoriaId", "==", categoriaId)
      .orderBy("creadoEn", "desc")
      .get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Receta[];
  },

  async findToday(): Promise<Receta[]> {
    const snapshot = await db
      .collection("recetas")
      .where("esPremium", "==", true)
      .orderBy("creadoEn", "desc")
      .limit(6)
      .get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Receta[];
  },
};
