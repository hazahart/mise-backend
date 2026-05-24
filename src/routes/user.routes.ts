import {Router} from 'express';
import {verifySession} from '../middlewares/verifySession';
import {verifyInternalSecret} from '../middlewares/verifyInternalSecret';
import {validate} from '../middlewares/validate';
import {updateUsuarioSchema, updateRoleSchema} from '../schemas/user.schema';
import {getMe, updateMe, updateUserRole} from '../controllers/user.controller';

const router = Router();

router.get('/me', verifySession, getMe);
router.patch('/me', verifySession, validate(updateUsuarioSchema), updateMe);
router.post('/me/role', verifyInternalSecret, validate(updateRoleSchema), updateUserRole);

export default router;