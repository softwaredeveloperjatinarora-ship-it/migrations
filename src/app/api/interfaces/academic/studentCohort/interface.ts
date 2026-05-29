"use server"

export interface Companies {
    Id: string;
    CohortId: string;
    Type: string;
    Website: string;
    Name: string;
    Salary: string;
  }

  export interface Cohort {
    Id: string;
    Cohort: string;
    Companies: Companies[];
    CohortSkills: CohortSkill[];
  }
  export interface RoadmapCourses {
    internalC: internal[];
    externalC: external[];
  }
  export  interface internal {
    term: string;
    courseCode: string;
    Name: string;
    requiredGrade: string;
    grade : string;
  }
  export interface external {
    CohortId: string;
    CohortName: string;
    ExternalName: string;
    ExternalType: string;
    File : string;
    Name: string;
    Term: string;
    URL: string;
  }

  export  interface SkillSource {
    Type: string;
    CohortId: string;
    Id: string;
    SourceName: string;
    Term: string;
    URL: string | null;
    StartDate: string | null;
    EndDate: string | null;
    Grade: string;
    SkillId: string;
  }
  export  interface CohortSkill {
    Id: string;
    CohortId: string;
    Skill: string;
    ReqdProficiency: string;
    CohortSkillSources: SkillSource[];
  }
