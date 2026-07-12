import { Request, Response } from 'express';
import { EmployeeService } from '../services/employee.service';

const employeeService = new EmployeeService();

export class EmployeeController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      console.log('req.file:', req.file);
      console.log('req.body:', req.body);

      const { name, age, designation, hiring_date, date_of_birth, salary } = req.body;
      const photo_path = req.file ? req.file.filename : null;

      const employee = await employeeService.create({
        name,
        age: Number(age),
        designation,
        hiring_date,
        date_of_birth,
        salary: Number(salary),
        photo_path,
      });

      res.status(201).json(employee);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const search = req.query.search as string | undefined;
      const page = req.query.page ? Number(req.query.page) : undefined;
      const limit = req.query.limit ? Number(req.query.limit) : undefined;

      const result = await employeeService.findAll({ search, page, limit });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const employee = await employeeService.findById(id);

      if (!employee) {
        res.status(404).json({ message: 'Employee not found' });
        return;
      }

      res.status(200).json(employee);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const updateData: Record<string, unknown> = { ...req.body };

      if (req.file) {
        updateData.photo_path = req.file.filename;
      }

      const employee = await employeeService.update(id, updateData);

      if (!employee) {
        res.status(404).json({ message: 'Employee not found' });
        return;
      }

      res.status(200).json(employee);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const employee = await employeeService.findById(id);

      if (!employee) {
        res.status(404).json({ message: 'Employee not found' });
        return;
      }

      await employeeService.softDelete(id);
      res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
}