import { Router } from "express";
import { RecipeController } from "../controllers/recipe.controller";
import { verifySession } from "../middlewares/verifySession";
import { verifyRole } from "../middlewares/verifyRole";

const router = Router();

router.get("/", RecipeController.getAll);
router.get(
  "/today",
  verifySession,
  verifyRole(["premium", "chef"]),
  RecipeController.getToday,
);
router.get("/:id", RecipeController.getById);

export default router;
