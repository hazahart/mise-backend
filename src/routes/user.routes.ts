import { Router } from 'express';
import { verifySession } from '../middlewares/verifySession';
import { verifyInternalSecret } from '../middlewares/verifyInternalSecret';
import { validate } from '../middlewares/validate';
import { updateUsuarioSchema, updateRoleSchema, completeOnboardingSchema } from '../schemas/user.schema';
import { getMe, updateMe, completeOnboarding, updateUserRole, getUserById } from '../controllers/user.controller';

const router = Router();

router.get('/me', verifySession, getMe);
router.get('/:id', verifySession, getUserById);
router.patch('/me', verifySession, validate(updateUsuarioSchema), updateMe);
router.patch('/me/onboarding', verifySession, validate(completeOnboardingSchema), completeOnboarding);
router.post('/me/role', verifyInternalSecret, validate(updateRoleSchema), updateUserRole);

export default router;