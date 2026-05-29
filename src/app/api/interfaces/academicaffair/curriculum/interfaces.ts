"use server"
export interface CourseOutcome{ CourseOutcome:string;UnitMapping:string;BloomLevel:string; }
export interface AcademicTask {
    academicTask:string;
    objective:string;
    detail:string;
    nature:string;
    weightage:number;
    mode:string;
    marks:number;
    allottmentSubmission:string;
    compulsory:boolean;
    courseOutcomes:string[];
}
export interface Course{ code:string; name:string; }