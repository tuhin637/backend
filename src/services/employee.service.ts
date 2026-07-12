import db from '../config/db';
import { Employee, CreateEmployeeDTO, UpdateEmployeeDTO } from '../types/employee.types';

interface ListFilters {
  search?: string;
  page?: number;
  limit?: number;
}

export class EmployeeService {
  async create(data: CreateEmployeeDTO): Promise<Employee> {
    const [id] = await db<Employee>('employees').insert(data);
    const employee = await db<Employee>('employees').where({ id }).first();
    if (!employee) {
      throw new Error('Failed to create employee');
    }
    return employee;
  }

  async findAll(filters: ListFilters): Promise<{ data: Employee[]; total: number }> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const offset = (page - 1) * limit;

    const query = db<Employee>('employees').whereNull('deleted_at');

    if (filters.search) {
      query.andWhere('name', 'like', `%${filters.search}%`);
    }

    const countQuery = query.clone();
    const totalResult = await countQuery.count<{ count: string }[]>('id as count').first();
    const total = totalResult ? Number(totalResult.count) : 0;

    const data = await query.clone().offset(offset).limit(limit).orderBy('id', 'desc');

    return { data, total };
  }

  async findById(id: number): Promise<Employee | undefined> {
    return db<Employee>('employees').where({ id }).whereNull('deleted_at').first();
  }

  async update(id: number, data: UpdateEmployeeDTO): Promise<Employee | undefined> {
    await db<Employee>('employees')
      .where({ id })
      .update({ ...data, updated_at: db.fn.now() });
    return this.findById(id);
  }

  async softDelete(id: number): Promise<void> {
    await db<Employee>('employees').where({ id }).update({ deleted_at: db.fn.now() });
  }
}