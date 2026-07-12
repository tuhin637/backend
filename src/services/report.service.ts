import db from '../config/db';

interface AttendanceReportRow {
  employee_id: number;
  name: string;
  days_present: number;
  times_late: number;
}

export class ReportService {
  async monthlyAttendance(month: string, employeeId?: number): Promise<AttendanceReportRow[]> {
    const [year, monthNum] = month.split('-');
    const startDate = `${year}-${monthNum}-01`;
    const lastDay = new Date(Number(year), Number(monthNum), 0).getDate();
    const endDate = `${year}-${monthNum}-${String(lastDay).padStart(2, '0')}`;

    const query = db('attendance as a')
      .join('employees as e', 'a.employee_id', 'e.id')
      .whereNull('e.deleted_at')
      .andWhereBetween('a.date', [startDate, endDate])
      .groupBy('e.id', 'e.name')
      .select('e.id as employee_id', 'e.name')
      .count('a.id as days_present')
      .sum(
        db.raw("CASE WHEN a.check_in_time > '09:45:00' THEN 1 ELSE 0 END as times_late"),
      );

    if (employeeId) {
      query.andWhere('e.id', employeeId);
    }

    const rows = (await query) as unknown as {
      employee_id: number;
      name: string;
      days_present: string;
      times_late: string;
    }[];

    return rows.map((row) => ({
      employee_id: row.employee_id,
      name: row.name,
      days_present: Number(row.days_present),
      times_late: Number(row.times_late),
    }));
  }
}