'use server'
export interface Student{
    name:string;
    regno:string;
}
export interface Supervisor{
  name:string;
  uid:number;
  department:string;
  specialization:string;
  groupCount:number;
}
export interface SupervisorDetails{
    uid:number;
    name:string;
    parentDomain:string;
    areaOfSpecializationInterest:string[];
}
export interface ResearchPublicationInterface{
  id: number;
  course: string;
  logRequestId: number;
  GroupCode: string;
  title: string;
  journalName: string;
  volume: string;
  publicationYear: string;
  pageFrom: number;
  pageTo: number;
  indexingAgency: string;
  impactFactor: string;
  issnNo: string;
  onlineLink: string;
  file: string;
  sjr: string;
  isAffiliated: boolean;
  recommendation: string;
  supervisorRemarks: string;
  isFinalSubmitted: boolean
}
export interface PatentInterface{
  id: number;
  course: string;
  session: number;
  logRequestId: number;
  GroupCode: string;
  title: string;
  dateOfFiling: string;
  DiaryNumber: number;
  file: string;
  recommendation: string;
  guideRemarks: string;
  isFinalSubmitted: boolean;
}
export interface BookChapterInterface{
  id: number;
  course: string;
  title: string;
  session: number;
  entryDate: string;
  file: string;
  recommendation: boolean;
  guideRemarks: string;
  isFinalSubmitted: boolean;
}