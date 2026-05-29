"use server"
export interface Company{
  name:string;
  internshipPlacement:boolean;
  category:string;
  package:string;
  bestOption:boolean;
  }
export interface Course{
  courseCode:string;
  courseName:string;
  termId:number;
  grade:string;
  slotTitle:string;
}
export interface CompetitiveExamType{
  examType:string;
  score:number;
}
export interface BenefitStatus{
    courseCode: string;
    courseName: string;
    companyName: string;
    status: string;
    resultUpdate: string;
}
