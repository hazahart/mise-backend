import { Router } from 'express';
import { RecipeController } from '../controllers/recipe.controller';
import { verifySession } from '../middlewares/verifySession';
import { verifyRole } from '../middlewares/verifyRole';
import { validate } from '../middlewares/validate';
import { createRecetaSchema, updateRecetaSchema } from '../schemas/recipe.schema';

const router = Router();

router.get('/', RecipeController.getAll);
router.get('/today', verifySession, verifyRole(['premium', 'chef']), RecipeController.getToday);
router.get('/chef/mis-recetas', verifySession, verifyRole(['chef']), RecipeController.getByChef);
router.get('/:id', RecipeController.getById);
router.post('/', verifySession, verifyRole(['chef']), validate(createRecetaSchema), RecipeController.create);
router.patch('/:id', verifySession, verifyRole(['chef']), validate(updateRecetaSchema), RecipeController.update);
router.delete('/:id', verifySession, verifyRole(['chef']), RecipeController.remove);

export default router;