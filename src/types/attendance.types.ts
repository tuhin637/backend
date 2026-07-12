export interface Attendance {
  id: number;
  employee_id: number;
  date: string;
  check_in_time: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAttendanceDTO {
  employee_id: number;
  date: string;
  check_in_time: string;
}

export interface UpdateAttendanceDTO {
  date?: string;
  check_in_time?: string;
}