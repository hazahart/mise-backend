export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
  imagenUrl: string | null;
  totalRecetas: number;
}

export interface Receta {
  id: string;
  titulo: string;
  descripcion: string;
  categoriaId: string;
  categoriaNombre: string;
  chefId: string;
  chefNombre: string;
  imagenUrl: string | null;
  tiempoEstimadoMin: number;
  dificultad: "facil" | "media" | "dificil";
  esPremium: boolean;
  ingredientes: Ingrediente[];
  pasos: Paso[];
  totalIngredientes: number;
  creadoEn: string;
}

export interface Ingrediente {
  nombre: string;
  cantidad: string;
  unidad: string;
}

export interface Paso {
  orden: number;
  descripcion: string;
  tiempoMin?: number;
}
