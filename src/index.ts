import "dotenv/config";
import { validateEnv } from "./lib/env";

validateEnv();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import "./lib/firebase";
import userRoutes from "./routes/user.routes";
import chefRoutes from "./routes/chef.routes";
import categoryRoutes from "./routes/category.routes";
import recipeRoutes from "./routes/recipe.routes";
import { errorHandler } from "./middlewares/errorHandler";
import aiRoutes from './routes/ai.routes';
import paymentRoutes from './routes/payment.routes';
import sessionRoutes from './routes/session.routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(morgan("dev"));

app.use('/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

app.use("/users", userRoutes);
app.use("/chefs", chefRoutes);
app.use("/categories", categoryRoutes);
app.use("/recipes", recipeRoutes);
app.use('/ai', aiRoutes);
app.use('/payments', paymentRoutes);
app.use('/sessions', sessionRoutes);

app.use((req, res) => {
  res.status(404).json({
    code: "not_found",
    message: `Ruta ${req.method} ${req.path} no encontrada`,
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Mise backend corriendo en http://localhost:${PORT}`);
});

export default app;
