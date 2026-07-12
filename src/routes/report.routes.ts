import { Router } from 'express';
import { ReportController } from '../controllers/report.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const reportController = new ReportController();

router.use(authMiddleware);

router.get('/attendance', (req, res) => reportController.monthlyAttendance(req, res));

export default router;