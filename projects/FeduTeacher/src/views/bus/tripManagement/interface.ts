export interface QueryTripListParams {
  name: string;
}

export interface QueryTripStudentListParams {
  pid: string;
  studentName: string;
}

export interface CreateOrEditTripParams {
  name: string;
  description: string;
  id?: string;
}
