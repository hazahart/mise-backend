import { Router } from 'express';
import { verifySession } from '../middlewares/verifySession';
import { verifyRole } from '../middlewares/verifyRole';
import { validate } from '../middlewares/validate';
import { updateDisponibilidadSchema } from '../schemas/chef.schema';
import { listChefs, getChef, getChefAvailability, updateDisponibilidad, getMiDisponibilidad } from '../controllers/chef.controller';

const router = Router();

router.get('/', verifySession, verifyRole(['premium', 'chef']), listChefs);
router.get('/me/disponibilidad', verifySession, verifyRole(['chef']), getMiDisponibilidad);
router.patch('/me/disponibilidad', verifySession, verifyRole(['chef']), validate(updateDisponibilidadSchema), updateDisponibilidad);
router.get('/:id', verifySession, getChef);
router.get('/:id/availability', verifySession, verifyRole(['premium', 'chef']), getChefAvailability);

export default router;