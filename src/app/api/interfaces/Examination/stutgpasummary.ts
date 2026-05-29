export interface StudentTGPASummary {
 
    Category: string
    TGPASem1: string
    TGPASem2: string
    TGPASem3: string
    TGPASem4: any
    TGPASem5: any
    TGPASem6: any
    TGPASem7: any
    TGPASem8: any
    TGPASem9: any
    TGPASem10: any
    TGPASem11: any
    TGPASem12: any
    TGPASem13: any
    TGPASem14: any
  }

  export interface StudentGradeCount {
    GradeNum: number
    Grade: string
    RecordCount: number
  }

  export interface StudentComponentWiseMarks {
    TermId: string
    CA:any
    MidTermTheory: any
    EndTermTheory: any
    EndTermPractical: any
  }
  
  export interface StudentGrades {
    RegisterationNumber: string
    TermId: string
    Semester: number
    Cgpa: number
    Tgpa: number
    Sgpa: number
    TermPercentage: number
    Courses: CourseWiseGrades[]
  }
  
  export interface CourseWiseGrades {
    Srno: number
    CourseCode: string
    Course: string
    Credit: number
    Grade: string
    MarksMax: any
    MarksObtd: any
    Status: any
    DsrnO: number
    EG: string
    SGPA: number
    NetPercentage: any
    IsCgpaProgram: boolean
    RFType: string
  }


  export interface StudentDefaulterStatus {
    RegdNo: string
    Description: string
    OfficeAddress: string
  }
  