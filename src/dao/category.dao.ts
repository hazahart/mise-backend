import { db } from "../lib/firebase";
import type { Categoria } from "../types/catalog";

export const CategoryDAO = {
  async findAll(): Promise<Categoria[]> {
    const snapshot = await db.collection("categorias").get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Categoria[];
  },

  async findById(id: string): Promise<Categoria | null> {
    const doc = await db.collection("categorias").doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Categoria;
  },

  async create(data: Omit<Categoria, "id">): Promise<Categoria> {
    const id = data.nombre
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-");
    await db.collection("categorias").doc(id).set(data);
    return { id, ...data };
  },

  async update(
    id: string,
    data: Partial<Omit<Categoria, "id">>,
  ): Promise<Categoria> {
    await db.collection("categorias").doc(id).update(data);
    const updated = await db.collection("categorias").doc(id).get();
    return { id: updated.id, ...updated.data() } as Categoria;
  },

  async remove(id: string): Promise<void> {
    await db.collection("categorias").doc(id).delete();
  },
};
