import db from '../config/db';
import { Attendance, CreateAttendanceDTO, UpdateAttendanceDTO } from '../types/attendance.types';

interface ListFilters {
  employee_id?: number;
  date?: string;
  from?: string;
  to?: string;
}

export class AttendanceService {
  async upsert(data: CreateAttendanceDTO): Promise<Attendance> {
    const existing = await db<Attendance>('attendance')
      .where({ employee_id: data.employee_id, date: data.date })
      .first();

    if (existing) {
      await db<Attendance>('attendance')
        .where({ id: existing.id })
        .update({ check_in_time: data.check_in_time, updated_at: db.fn.now() });

      const updated = await db<Attendance>('attendance').where({ id: existing.id }).first();
      if (!updated) {
        throw new Error('Failed to update attendance');
      }
      return updated;
    }

    const [id] = await db<Attendance>('attendance').insert(data);
    const created = await db<Attendance>('attendance').where({ id }).first();
    if (!created) {
      throw new Error('Failed to create attendance');
    }
    return created;
  }

  async findAll(filters: ListFilters): Promise<Attendance[]> {
    const query = db<Attendance>('attendance');

    if (filters.employee_id) {
      query.andWhere('employee_id', filters.employee_id);
    }
    if (filters.date) {
      query.andWhere('date', filters.date);
    }
    if (filters.from) {
      query.andWhere('date', '>=', filters.from);
    }
    if (filters.to) {
      query.andWhere('date', '<=', filters.to);
    }

    return query.orderBy('date', 'desc');
  }

  async findById(id: number): Promise<Attendance | undefined> {
    return db<Attendance>('attendance').where({ id }).first();
  }

  async update(id: number, data: UpdateAttendanceDTO): Promise<Attendance | undefined> {
    await db<Attendance>('attendance')
      .where({ id })
      .update({ ...data, updated_at: db.fn.now() });
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await db<Attendance>('attendance').where({ id }).del();
  }
}