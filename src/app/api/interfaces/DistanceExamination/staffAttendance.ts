// Staff Attendance File
export interface FormData {
  examDate?: string;
  chooseType?: string;
  employeeId?: string;
  Timing?: string
}

export interface FormErrors {
  examDate?: string;
  chooseType?: string;
  employeeId?: string;
  Timing?: string
}

// Attendance File
export interface PropsInterface {
  open: boolean;
  onClose: () => void;
  selectedDate?:string
  selectedTime?:string
  data?:any
}