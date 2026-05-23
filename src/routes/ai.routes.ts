import { Router } from 'express';
import { AIController } from '../controllers/ai.controller';
import { verifySession } from '../middlewares/verifySession';
import { verifyRole } from '../middlewares/verifyRole';
import { validate } from '../middlewares/validate';
import { suggestRecipeSchema } from '../schemas/ai.schema';

const router = Router();

router.post(
    '/suggest-recipe',
    verifySession,
    verifyRole(['premium', 'chef']),
    validate(suggestRecipeSchema),
    AIController.suggestRecipe,
);

export default router;