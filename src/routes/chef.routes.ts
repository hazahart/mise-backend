import {Router} from 'express';
import {verifySession} from '../middlewares/verifySession';
import {verifyRole} from '../middlewares/verifyRole';
import {listChefs, getChef, getChefAvailability} from '../controllers/chef.controller';

const router = Router();

router.get('/', verifySession, verifyRole(['premium', 'chef']), listChefs);
router.get('/:id', verifySession, getChef);
router.get('/:id/availability', verifySession, verifyRole(['premium', 'chef']), getChefAvailability);

export default router;