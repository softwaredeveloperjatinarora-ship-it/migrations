"use server"
export interface ProgramOutcome {
    srNo:number,
    outcome:string;
    fullyAttained:boolean;
    somewhatAttained:boolean;
    cantSay:boolean;
    lowAttainment:boolean;
    noAttainment:boolean;
}