import { Router } from 'express';
import { SessionController } from '../controllers/session.controller';
import { verifySession } from '../middlewares/verifySession';
import { verifyRole } from '../middlewares/verifyRole';
import { validate } from '../middlewares/validate';
import { createSesionSchema, updateSesionSchema } from '../schemas/session.schema';

const router = Router();

router.get('/', verifySession, verifyRole(['premium', 'chef']), SessionController.getMySessions);
router.get('/chef', verifySession, verifyRole(['chef']), SessionController.getChefSessions);
router.get('/:id', verifySession, verifyRole(['premium', 'chef']), SessionController.getById);
router.post('/', verifySession, verifyRole(['premium']), validate(createSesionSchema), SessionController.create);
router.patch('/:id', verifySession, verifyRole(['premium', 'chef']), validate(updateSesionSchema), SessionController.update);
router.delete('/:id', verifySession, verifyRole(['premium']), SessionController.delete);

export default router;