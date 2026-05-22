import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { verifyInternalSecret } from '../middlewares/verifyInternalSecret';
import { validate } from '../middlewares/validate';
import { createCategoriaSchema, updateCategoriaSchema } from '../schemas/category.schema';

console.log('verifyInternalSecret:', typeof verifyInternalSecret);
console.log('validate:', typeof validate);
console.log('createCategoriaSchema:', typeof createCategoriaSchema);
console.log('CategoryController.create:', typeof CategoryController.create);

const router = Router();

router.get('/', CategoryController.getAll);
router.get('/:id', CategoryController.getById);
router.post('/', verifyInternalSecret, validate(createCategoriaSchema), CategoryController.create);
router.patch('/:id', verifyInternalSecret, validate(updateCategoriaSchema), CategoryController.update);
router.delete('/:id', verifyInternalSecret, CategoryController.remove);

export default router;