
export type Department = {
  id:number
  name:string
  status:number
  created_at:Date
  updated_at:Date
}

export interface FilterQuery {
  textSearch?: string;
  searchField?: string;
  page?: number;
  pageSize?: number;
  sortOrder?: 'asc' | 'desc';
  sortField?: string;
  status?: string;
}

export const initialDepartmentData: Partial<Department> = {
  name:"test"
};