export type ApiActionStatus = "success" | "error";

export interface ApiActionResult<T = unknown> {
  message: string;
  status: ApiActionStatus;
  ApiData?: T;
}

export interface SemesterExchangeApplication {
  ApplicationId?: number;
  RegistrationNo?: string;
  RegNo?: string;
  StudentName?: string;
  Name?: string;
  ProgramCode?: string;
  UniversityName?: string;
  Status?: string;
  [key: string]: unknown;
}

export interface SemesterExchangeUniversity {
  UniversityId?: number;
  UniversityName?: string;
  Country?: string;
  ProgramCode?: string;
  IsActive?: boolean;
  [key: string]: unknown;
}

export interface SemesterExchangeRemark {
  RegistrationNo?: string;
  RegNo?: string;
  Remarks?: string;
  CreatedBy?: string;
  CreatedOn?: string;
  [key: string]: unknown;
}
