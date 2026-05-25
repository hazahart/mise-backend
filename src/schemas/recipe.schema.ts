import { z } from "zod";

const ingredienteSchema = z.object({
  nombre: z.string().min(1),
  cantidad: z.string().min(1),
  unidad: z.string().min(1),
});

const pasoSchema = z.object({
  orden: z.number().int().min(1),
  descripcion: z.string().min(1),
  tiempoMin: z.number().int().min(0).optional(),
});

const nuevaCategoriaSchema = z.object({
  nombre: z.string().min(1),
  descripcion: z.string().min(1),
  imagenUrl: z.string().url().nullable().optional().default(null),
});

export const createRecetaSchema = z.object({
  titulo: z.string().min(1, "El título es requerido"),
  descripcion: z.string().min(1, "La descripción es requerida"),
  categoriaId: z.string().optional().default(''),
  nuevaCategoria: nuevaCategoriaSchema.optional(),
  imagenUrl: z.string().url().nullable().optional().default(null),
  videoUrl: z.string().url().nullable().optional().default(null),
  tiempoEstimadoMin: z.number().int().min(1),
  dificultad: z.enum(["facil", "media", "dificil"]),
  esPremium: z.boolean().default(false),
  ingredientes: z.array(ingredienteSchema).min(1),
  pasos: z.array(pasoSchema).min(1),
}).refine(data => data.categoriaId || data.nuevaCategoria, {
  message: "Debes seleccionar una categoría o crear una nueva",
});

export const updateRecetaSchema = z.object({
  titulo: z.string().min(1).optional(),
  descripcion: z.string().min(1).optional(),
  categoriaId: z.string().min(1).optional(),
  categoriaNombre: z.string().min(1).optional(),
  nuevaCategoria: nuevaCategoriaSchema.optional(),
  imagenUrl: z.string().url().nullable().optional(),
  videoUrl: z.string().url().nullable().optional(),
  tiempoEstimadoMin: z.number().int().min(1).optional(),
  dificultad: z.enum(["facil", "media", "dificil"]).optional(),
  esPremium: z.boolean().optional(),
  ingredientes: z.array(ingredienteSchema).min(1).optional(),
  pasos: z.array(pasoSchema).min(1).optional(),
});