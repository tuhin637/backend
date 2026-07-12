import { Router } from 'express';
import { AttendanceController } from '../controllers/attendance.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createAttendanceSchema, updateAttendanceSchema } from '../validators/attendance.validator';

const router = Router();
const attendanceController = new AttendanceController();

router.use(authMiddleware);

router.get('/', (req, res) => attendanceController.findAll(req, res));
router.get('/:id', (req, res) => attendanceController.findById(req, res));
router.post('/', validate(createAttendanceSchema), (req, res) =>
  attendanceController.upsert(req, res),
);
router.put('/:id', validate(updateAttendanceSchema), (req, res) =>
  attendanceController.update(req, res),
);
router.delete('/:id', (req, res) => attendanceController.delete(req, res));

export default router;