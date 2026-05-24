import 'dotenv/config';
import '../lib/firebase';
import { db } from '../lib/firebase';

const categorias = [
  { id: 'italiana', nombre: 'Italiana', descripcion: 'Pastas, risottos y clásicos de Italia', imagenUrl: null, totalRecetas: 3 },
  { id: 'mexicana', nombre: 'Mexicana', descripcion: 'Tacos, enchiladas y sabores de México', imagenUrl: null, totalRecetas: 2 },
  { id: 'japonesa', nombre: 'Japonesa', descripcion: 'Sushi, ramen y cocina japonesa', imagenUrl: null, totalRecetas: 2 },
  { id: 'mediterranea', nombre: 'Mediterránea', descripcion: 'Cocina fresca del Mediterráneo', imagenUrl: null, totalRecetas: 2 },
  { id: 'vegana', nombre: 'Vegana', descripcion: 'Recetas 100% de origen vegetal', imagenUrl: null, totalRecetas: 2 },
  { id: 'postres', nombre: 'Postres', descripcion: 'Dulces, tartas y postres del mundo', imagenUrl: null, totalRecetas: 2 },
];

const recetas = [
  {
    id: 'pasta-carbonara',
    titulo: 'Pasta Carbonara',
    descripcion: 'Clásica pasta italiana cremosa con huevo, queso y panceta.',
    categoriaId: 'italiana',
    categoriaNombre: 'Italiana',
    chefId: 'chef-demo',
    chefNombre: 'Marco Rossi',
    imagenUrl: null,
    tiempoEstimadoMin: 30,
    dificultad: 'media',
    esPremium: false,
    totalIngredientes: 5,
    ingredientes: [
      { nombre: 'Espagueti', cantidad: '200', unidad: 'g' },
      { nombre: 'Panceta', cantidad: '100', unidad: 'g' },
      { nombre: 'Huevo', cantidad: '2', unidad: 'piezas' },
      { nombre: 'Queso pecorino', cantidad: '50', unidad: 'g' },
      { nombre: 'Pimienta negra', cantidad: '1', unidad: 'cdta' },
    ],
    pasos: [
      { orden: 1, descripcion: 'Cocer la pasta en agua con sal hasta al dente.', tiempoMin: 10 },
      { orden: 2, descripcion: 'Dorar la panceta en sartén sin aceite.', tiempoMin: 5 },
      { orden: 3, descripcion: 'Mezclar huevos con queso rallado y pimienta.', tiempoMin: 3 },
      { orden: 4, descripcion: 'Mezclar pasta caliente con panceta, retirar del fuego y añadir la mezcla de huevo.', tiempoMin: 2 },
    ],
    creadoEn: new Date().toISOString(),
  },
  {
    id: 'risotto-funghi',
    titulo: 'Risotto ai Funghi',
    descripcion: 'Cremoso risotto italiano con champiñones y parmesano.',
    categoriaId: 'italiana',
    categoriaNombre: 'Italiana',
    chefId: 'chef-demo',
    chefNombre: 'Marco Rossi',
    imagenUrl: null,
    tiempoEstimadoMin: 40,
    dificultad: 'dificil',
    esPremium: true,
    totalIngredientes: 7,
    ingredientes: [
      { nombre: 'Arroz arborio', cantidad: '300', unidad: 'g' },
      { nombre: 'Champiñones', cantidad: '200', unidad: 'g' },
      { nombre: 'Caldo de verduras', cantidad: '1', unidad: 'L' },
      { nombre: 'Cebolla', cantidad: '1', unidad: 'pieza' },
      { nombre: 'Vino blanco', cantidad: '100', unidad: 'ml' },
      { nombre: 'Parmesano', cantidad: '80', unidad: 'g' },
      { nombre: 'Mantequilla', cantidad: '30', unidad: 'g' },
    ],
    pasos: [
      { orden: 1, descripcion: 'Sofreír cebolla en mantequilla hasta transparente.', tiempoMin: 5 },
      { orden: 2, descripcion: 'Añadir champiñones y saltear 5 minutos.', tiempoMin: 5 },
      { orden: 3, descripcion: 'Agregar arroz y tostar 2 minutos.', tiempoMin: 2 },
      { orden: 4, descripcion: 'Verter vino blanco y dejar evaporar.', tiempoMin: 3 },
      { orden: 5, descripcion: 'Añadir caldo caliente poco a poco removiendo constantemente.', tiempoMin: 20 },
      { orden: 6, descripcion: 'Retirar del fuego, añadir parmesano y mantequilla fría.', tiempoMin: 2 },
    ],
    creadoEn: new Date().toISOString(),
  },
  {
    id: 'tacos-al-pastor',
    titulo: 'Tacos al Pastor',
    descripcion: 'Tacos mexicanos con carne marinada en achiote y piña.',
    categoriaId: 'mexicana',
    categoriaNombre: 'Mexicana',
    chefId: 'chef-demo',
    chefNombre: 'Ana García',
    imagenUrl: null,
    tiempoEstimadoMin: 45,
    dificultad: 'media',
    esPremium: false,
    totalIngredientes: 8,
    ingredientes: [
      { nombre: 'Tortillas de maíz', cantidad: '12', unidad: 'piezas' },
      { nombre: 'Cerdo en tiras', cantidad: '500', unidad: 'g' },
      { nombre: 'Achiote', cantidad: '2', unidad: 'cdas' },
      { nombre: 'Piña', cantidad: '200', unidad: 'g' },
      { nombre: 'Cebolla', cantidad: '1', unidad: 'pieza' },
      { nombre: 'Cilantro', cantidad: '1', unidad: 'manojo' },
      { nombre: 'Limón', cantidad: '3', unidad: 'piezas' },
      { nombre: 'Salsa verde', cantidad: '100', unidad: 'ml' },
    ],
    pasos: [
      { orden: 1, descripcion: 'Marinar la carne con achiote, jugo de limón y especias por 2 horas.', tiempoMin: 120 },
      { orden: 2, descripcion: 'Asar la carne en sartén o plancha a fuego alto.', tiempoMin: 10 },
      { orden: 3, descripcion: 'Calentar tortillas en comal.', tiempoMin: 3 },
      { orden: 4, descripcion: 'Armar tacos con carne, piña, cebolla y cilantro.', tiempoMin: 5 },
    ],
    creadoEn: new Date().toISOString(),
  },
  {
    id: 'ramen-tonkotsu',
    titulo: 'Ramen Tonkotsu',
    descripcion: 'Ramen japonés con caldo cremoso de cerdo y chashu.',
    categoriaId: 'japonesa',
    categoriaNombre: 'Japonesa',
    chefId: 'chef-demo',
    chefNombre: 'Yuki Tanaka',
    imagenUrl: null,
    tiempoEstimadoMin: 180,
    dificultad: 'dificil',
    esPremium: true,
    totalIngredientes: 10,
    ingredientes: [
      { nombre: 'Fideos ramen', cantidad: '200', unidad: 'g' },
      { nombre: 'Huesos de cerdo', cantidad: '1', unidad: 'kg' },
      { nombre: 'Panceta de cerdo', cantidad: '300', unidad: 'g' },
      { nombre: 'Huevos', cantidad: '2', unidad: 'piezas' },
      { nombre: 'Salsa de soya', cantidad: '50', unidad: 'ml' },
      { nombre: 'Mirin', cantidad: '30', unidad: 'ml' },
      { nombre: 'Jengibre', cantidad: '20', unidad: 'g' },
      { nombre: 'Ajo', cantidad: '4', unidad: 'dientes' },
      { nombre: 'Cebolla verde', cantidad: '2', unidad: 'piezas' },
      { nombre: 'Nori', cantidad: '2', unidad: 'hojas' },
    ],
    pasos: [
      { orden: 1, descripcion: 'Blanquear los huesos en agua hirviendo 10 minutos.', tiempoMin: 10 },
      { orden: 2, descripcion: 'Cocer huesos a fuego alto por 3 horas hasta obtener caldo cremoso.', tiempoMin: 180 },
      { orden: 3, descripcion: 'Marinar y cocer la panceta con soya y mirin.', tiempoMin: 60 },
      { orden: 4, descripcion: 'Cocer huevos 7 minutos y marinar en soya.', tiempoMin: 7 },
      { orden: 5, descripcion: 'Cocer fideos y servir con caldo, chashu, huevo y toppings.', tiempoMin: 5 },
    ],
    creadoEn: new Date().toISOString(),
  },
  {
    id: 'buddha-bowl',
    titulo: 'Buddha Bowl',
    descripcion: 'Bowl vegano colorido con granos, verduras asadas y tahini.',
    categoriaId: 'vegana',
    categoriaNombre: 'Vegana',
    chefId: 'chef-demo',
    chefNombre: 'Laura Martínez',
    imagenUrl: null,
    tiempoEstimadoMin: 35,
    dificultad: 'facil',
    esPremium: false,
    totalIngredientes: 9,
    ingredientes: [
      { nombre: 'Quinoa', cantidad: '150', unidad: 'g' },
      { nombre: 'Garbanzos cocidos', cantidad: '200', unidad: 'g' },
      { nombre: 'Camote', cantidad: '1', unidad: 'pieza' },
      { nombre: 'Espinacas', cantidad: '100', unidad: 'g' },
      { nombre: 'Aguacate', cantidad: '1', unidad: 'pieza' },
      { nombre: 'Tomates cherry', cantidad: '100', unidad: 'g' },
      { nombre: 'Tahini', cantidad: '3', unidad: 'cdas' },
      { nombre: 'Limón', cantidad: '1', unidad: 'pieza' },
      { nombre: 'Semillas de sésamo', cantidad: '1', unidad: 'cda' },
    ],
    pasos: [
      { orden: 1, descripcion: 'Cocer la quinoa según instrucciones del paquete.', tiempoMin: 15 },
      { orden: 2, descripcion: 'Asar camote y garbanzos con aceite y especias a 200°C.', tiempoMin: 25 },
      { orden: 3, descripcion: 'Preparar aderezo de tahini con limón, agua y sal.', tiempoMin: 3 },
      { orden: 4, descripcion: 'Armar el bowl con quinoa de base y todos los ingredientes encima.', tiempoMin: 5 },
    ],
    creadoEn: new Date().toISOString(),
  },
  {
    id: 'tiramisu',
    titulo: 'Tiramisú',
    descripcion: 'Postre italiano clásico con mascarpone, café y cacao.',
    categoriaId: 'postres',
    categoriaNombre: 'Postres',
    chefId: 'chef-demo',
    chefNombre: 'Marco Rossi',
    imagenUrl: null,
    tiempoEstimadoMin: 30,
    dificultad: 'media',
    esPremium: true,
    totalIngredientes: 7,
    ingredientes: [
      { nombre: 'Mascarpone', cantidad: '500', unidad: 'g' },
      { nombre: 'Huevos', cantidad: '4', unidad: 'piezas' },
      { nombre: 'Azúcar', cantidad: '100', unidad: 'g' },
      { nombre: 'Café espresso', cantidad: '300', unidad: 'ml' },
      { nombre: 'Savoiardi', cantidad: '24', unidad: 'piezas' },
      { nombre: 'Cacao en polvo', cantidad: '30', unidad: 'g' },
      { nombre: 'Marsala', cantidad: '50', unidad: 'ml' },
    ],
    pasos: [
      { orden: 1, descripcion: 'Separar yemas y claras. Batir yemas con azúcar hasta blanquear.', tiempoMin: 5 },
      { orden: 2, descripcion: 'Incorporar mascarpone a las yemas con movimientos envolventes.', tiempoMin: 3 },
      { orden: 3, descripcion: 'Montar claras a punto de nieve e incorporar a la mezcla.', tiempoMin: 5 },
      { orden: 4, descripcion: 'Mojar savoiardi en café con marsala y colocar en molde.', tiempoMin: 5 },
      { orden: 5, descripcion: 'Alternar capas de crema y savoiardi. Refrigerar 4 horas.', tiempoMin: 240 },
    ],
    creadoEn: new Date().toISOString(),
  },
];

async function seed() {
  console.log('🌱 Iniciando seed...');

  console.log('📁 Seeding categorías...');
  for (const cat of categorias) {
    const { id, ...data } = cat;
    await db.collection('categorias').doc(id).set(data);
    console.log(`  ✅ ${cat.nombre}`);
  }

  console.log('🍽️ Seeding recetas...');
  for (const rec of recetas) {
    const { id, ...data } = rec;
    await db.collection('recetas').doc(id).set(data);
    console.log(`  ✅ ${rec.titulo}`);
  }

  console.log('✅ Seed completado');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Error en seed:', err);
  process.exit(1);
});