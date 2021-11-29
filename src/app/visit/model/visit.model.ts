export interface Visit {
  id: number;
  visitTypeId: number;
  visitTypeName: string;
  visitStatus: string;
  description: string;
  patientId: number;
  patientFirstName: string;
  patientLastName: string;
  employeeId: number;
  employeeFirstName: string;
  employeeLastName: string;
  date: string;
  startTime: string;
  endTime: string;
}
