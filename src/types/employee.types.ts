export interface Employee {
  id: number;
  name: string;
  age: number;
  designation: string;
  hiring_date: string;
  date_of_birth: string;
  salary: number;
  photo_path: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateEmployeeDTO {
  name: string;
  age: number;
  designation: string;
  hiring_date: string;
  date_of_birth: string;
  salary: number;
  photo_path?: string | null;
}

export interface UpdateEmployeeDTO {
  name?: string;
  age?: number;
  designation?: string;
  hiring_date?: string;
  date_of_birth?: string;
  salary?: number;
  photo_path?: string | null;
}