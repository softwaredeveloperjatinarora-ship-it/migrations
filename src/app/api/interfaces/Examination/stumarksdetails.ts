export interface StudentMarksDetails {
  TermId: string;
  CourseCode: string;
  CourseName: string;
  IsImproved: string;
  Assessment: Assessment[];
}

export interface Assessment {
  ExamType: string;
  ExamTypeDesc: string;
  MaxMarks: string;
  MarksObt: string;
  wMaxMarks: string;
  WMarksObt: string;
  ExamAttendance: string;
  RoomNo: string;
}

export interface StudentTermId {
  TermId: string;
}

export interface StudentSubjectiveMarks {
  TermId: number;
  CourseCode: string;
  Description: string;
  ExamDate: string;
  Session: string;
  Qno: number;
  MarksMax: number;
  MarksObtained: string;
  MarksObtainedAfterScrutiny: any;
}
