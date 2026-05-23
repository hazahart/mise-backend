import { z } from "zod";

export const createCategoriaSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  descripcion: z.string().min(1, "La descripción es requerida"),
  imagenUrl: z.string().url().nullable().optional().default(null),
  totalRecetas: z.number().int().min(0).optional().default(0),
});

export const updateCategoriaSchema = z.object({
  nombre: z.string().min(1).optional(),
  descripcion: z.string().min(1).optional(),
  imagenUrl: z.string().url().nullable().optional(),
  totalRecetas: z.number().int().min(0).optional(),
});
