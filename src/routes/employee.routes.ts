import { Router } from 'express';
import { EmployeeController } from '../controllers/employee.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createEmployeeSchema, updateEmployeeSchema } from '../validators/employee.validator';
import { upload } from '../config/multer.config';

const router = Router();
const employeeController = new EmployeeController();

router.use(authMiddleware);

router.get('/', (req, res) => employeeController.findAll(req, res));
router.get('/:id', (req, res) => employeeController.findById(req, res));

router.post(
  '/',
  upload.single('photo'),
  validate(createEmployeeSchema),
  (req, res) => employeeController.create(req, res),
);

router.put(
  '/:id',
  upload.single('photo'),
  validate(updateEmployeeSchema),
  (req, res) => employeeController.update(req, res),
);

router.delete('/:id', (req, res) => employeeController.delete(req, res));

export default router;