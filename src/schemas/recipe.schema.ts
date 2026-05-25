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

export const createRecetaSchema = z.object({
  titulo: z.string().min(1, "El título es requerido"),
  descripcion: z.string().min(1, "La descripción es requerida"),
  categoriaId: z.string().min(1, "La categoría es requerida"),
  imagenUrl: z.string().url().nullable().optional().default(null),
  videoUrl: z.string().url().nullable().optional().default(null),
  tiempoEstimadoMin: z.number().int().min(1),
  dificultad: z.enum(["facil", "media", "dificil"]),
  esPremium: z.boolean().default(false),
  ingredientes: z.array(ingredienteSchema).min(1),
  pasos: z.array(pasoSchema).min(1),
});

export const updateRecetaSchema = z.object({
  titulo: z.string().min(1).optional(),
  descripcion: z.string().min(1).optional(),
  categoriaId: z.string().min(1).optional(),
  categoriaNombre: z.string().min(1).optional(),
  imagenUrl: z.string().url().nullable().optional(),
  videoUrl: z.string().url().nullable().optional(),
  tiempoEstimadoMin: z.number().int().min(1).optional(),
  dificultad: z.enum(["facil", "media", "dificil"]).optional(),
  esPremium: z.boolean().optional(),
  ingredientes: z.array(ingredienteSchema).min(1).optional(),
  pasos: z.array(pasoSchema).min(1).optional(),
});