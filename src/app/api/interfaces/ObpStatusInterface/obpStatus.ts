export interface OBPProjectData {
  sNo: string;
  steps: string;
  architect: {
    statusOfDrawing: string;
    startDate: string;
    endDate: string;
  };
  departmentWiseSteps: string;
  drawingNo?: string;
  architectureIssueDate?: string;
  nottingSheet: string;
  civilHandover: {
    startDate: string;
    endDate: string;
    stageCompleteDate?: string;
    status: 'done' | 'pending' | '';
  };
  electrical: {
    startDate: string;
    endDate: string;
    stageCompleteDate?: string;
    status: 'done' | 'pending' | '';
  };
  it: {
    startDate: string;
    endDate: string;
    stageCompleteDate?: string;
    status: 'done' | 'pending' | '';
  };
  itInfra: {
    startDate: string;
    endDate: string;
    stageCompleteDate?: string;
    status: 'done' | 'pending' | '';
  };
  drawingNumber: string;
  endDate: string;
  notingSheetId: string;
  metricId: number;
  stageMetricCount: number;
}
