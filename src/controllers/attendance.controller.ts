import { Request, Response } from 'express';
import { AttendanceService } from '../services/attendance.service';

const attendanceService = new AttendanceService();

export class AttendanceController {
  async upsert(req: Request, res: Response): Promise<void> {
    try {
      const { employee_id, date, check_in_time } = req.body;
      const attendance = await attendanceService.upsert({
        employee_id: Number(employee_id),
        date,
        check_in_time,
      });
      res.status(201).json(attendance);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const employee_id = req.query.employee_id ? Number(req.query.employee_id) : undefined;
      const date = req.query.date as string | undefined;
      const from = req.query.from as string | undefined;
      const to = req.query.to as string | undefined;

      const data = await attendanceService.findAll({ employee_id, date, from, to });
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const attendance = await attendanceService.findById(id);

      if (!attendance) {
        res.status(404).json({ message: 'Attendance record not found' });
        return;
      }

      res.status(200).json(attendance);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const attendance = await attendanceService.update(id, req.body);

      if (!attendance) {
        res.status(404).json({ message: 'Attendance record not found' });
        return;
      }

      res.status(200).json(attendance);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const attendance = await attendanceService.findById(id);

      if (!attendance) {
        res.status(404).json({ message: 'Attendance record not found' });
        return;
      }

      await attendanceService.delete(id);
      res.status(200).json({ message: 'Attendance record deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
}