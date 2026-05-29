export interface StudentDetails {
    StudentMobile: string
    StudentEmail: string
    ExtendedYear: string
    ApplicationSubmitted: boolean
    ParentContact: string
  }


  export interface StudentDegreeExtensionApplication {
    Vid: number
    ContactNo: string
    Email: string
    ParentContactNo: string
    FileName: string
    ExtendedYear: string
  }

  export interface StudentApplicationList {
    Email: string
    ParentContactNo: string
    ContactNo: string
    EntryTime: string
    EntryDate: string
    ApplicationFile: string
    ExtendedYear: number
    IsEnabled: boolean
    Status: string
  }