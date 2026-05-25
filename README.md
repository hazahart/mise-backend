# Mise — Backend

API REST para la plataforma de recetas de cocina Mise. Construida con Express.js, TypeScript y Firebase.

## Stack

- **Runtime:** Node.js 24
- **Framework:** Express.js 5
- **Lenguaje:** TypeScript 6
- **Base de datos:** Firestore (Firebase)
- **Autenticación:** Firebase Authentication (JWT)
- **Tiempo real:** Firebase Realtime Database
- **Pagos:** Stripe
- **IA:** Gemini 2.5 Flash (@google/generative-ai)
- **Deploy:** Render

## Producción

https://mise-backend-igbg.onrender.com

## Endpoints principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /health | Health check |
| GET | /categories | Listar categorías |
| GET | /recipes | Listar recetas |
| GET | /recipes/today | Recetas del día (premium) |
| GET | /recipes/chef/mis-recetas | Recetas del chef autenticado |
| POST | /recipes | Crear receta (chef) |
| PATCH | /recipes/:id | Editar receta (chef) |
| DELETE | /recipes/:id | Eliminar receta (chef) |
| GET | /chefs | Listar chefs |
| GET | /chefs/:id | Obtener chef |
| GET | /chefs/:id/availability | Disponibilidad del chef |
| PATCH | /chefs/me/disponibilidad | Actualizar disponibilidad (chef) |
| GET | /users/me | Perfil del usuario autenticado |
| PATCH | /users/me | Actualizar perfil |
| PATCH | /users/me/onboarding | Completar onboarding |
| GET | /sessions | Mis sesiones (usuario) |
| GET | /sessions/chef | Mis sesiones (chef) |
| POST | /sessions | Crear sesión |
| PATCH | /sessions/:id | Actualizar sesión |
| POST | /payments/create-checkout-session | Crear sesión de pago Stripe |
| DELETE | /payments/subscription | Cancelar suscripción |
| POST | /payments/webhook | Webhook de Stripe |
| POST | /ai/suggest-recipe | Sugerir receta con IA |

## Variables de entorno

```env
NODE_ENV=production
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
FIREBASE_DATABASE_URL=
GEMINI_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_MONTHLY=
STRIPE_PRICE_YEARLY=
INTERNAL_SECRET=
FRONTEND_URL=
```

## Instalación local

```bash
git clone https://github.com/hazahart/mise-backend
cd mise-backend
npm install
cp .env.example .env
npm run dev
```

## Scripts

```bash
npm run dev
npm run build
npm start
npx ts-node -r dotenv/config src/scripts/seed.ts
```

## Roles de usuario

| Rol | Descripción |
|-----|-------------|
| `free` | Usuario registrado sin suscripción |
| `premium` | Usuario con suscripción activa |
| `chef` | Chef profesional con panel de gestión |

## Autores

- **Gustavo Ramírez Mireles** — [Hazahart](https://github.com/hazahart)
- **Vanessa Fernanda Arreola Garcia** — [VanessaFAG](https://github.com/VanessaFAG)

**Materia:** Tópicos Avanzados de Desarrollo Web  
**Institución:** TECNM en Celaya
