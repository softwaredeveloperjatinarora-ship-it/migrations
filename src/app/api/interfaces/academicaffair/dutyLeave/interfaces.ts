"use server"
export interface DutyLeave{
    days:number; 
    fromDate:string;
    toDate:string;
    reason:string;
    appliedOn:string;
    approvalStatus:string;
}
export interface Objectives{
    objective:string
  }