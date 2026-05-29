'use server'
export interface Supervisor{
    name:string;
    uid:number;
    discipline:string;
    specialization:string;
}
export interface SupervisorInfo{
    sitting:string;
    specialization:string;
    bioStatement:string;
    qualifications:SupervisorQualification[];
    researchProfileDetails:ResearchProfileDetails[];
}
export interface SupervisorQualification{
    degree:string;
    collegeName:string;
    universityName:string;
}
export interface ResearchProfileDetails {
  paperTitle: string;
  nameOfJournal: string;
  indexedIn: string;
  role: string;
  sjrFactor: number;
  impactFactor: number | null;
  volumeNo: number;
  pageNo: string;
  year: number;
}
export interface BookedSlot {
  uid: number;
  supervisor: string;
  discipline: string;
  officialEmailId: string;
  mobileNo: string;
  slotDate: string;
  slotTime: string;
  venue: string;
  category: 'Accept' | 'Reschedule';
  fileUpload: string;
  attachment?: string | null;
}
