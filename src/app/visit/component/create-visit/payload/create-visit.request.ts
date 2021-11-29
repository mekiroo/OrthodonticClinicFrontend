export interface CreateVisitRequest {
  patientId: number;
  employeeId: number;
  visitTypeId: number;
  description: string;
  date: string;
  startTime: string;
}
