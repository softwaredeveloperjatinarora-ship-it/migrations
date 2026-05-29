// Interface for Item
export interface Item {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
    username: string;
    phone: string;
  }
  
  // Interface for FormData
  export interface FormData {
    firstName: string;
    lastName: string;
    email: string;
  }

  export interface Attendance {
    CourseCode: string;
    CourseName: string;
    AttendanceDate: string;
    AttendanceTime: string;
    AttendanceType: string;
    AttendanceCode: string;
    Name: string;
    LoginName: string;
    BlockReason: string;
    DutyLeave: string;
  }