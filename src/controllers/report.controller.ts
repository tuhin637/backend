import { Request, Response } from 'express';
import { ReportService } from '../services/report.service';

const reportService = new ReportService();

export class ReportController {
  async monthlyAttendance(req: Request, res: Response): Promise<void> {
    try {
      const month = req.query.month as string | undefined;

      if (!month || !/^\d{4}-\d{2}$/.test(month)) {
        res.status(400).json({ message: 'month query param is required in YYYY-MM format' });
        return;
      }

      const employeeId = req.query.employee_id ? Number(req.query.employee_id) : undefined;
      const report = await reportService.monthlyAttendance(month, employeeId);

      res.status(200).json({ data: report });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
}