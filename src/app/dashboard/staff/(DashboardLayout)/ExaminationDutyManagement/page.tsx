import PageContainer from "@/app/components/container/PageContainer";
import ExaminationDutyManagementDashboard from "@/app/components/StaffViews/ExaminationDutyManagement/ExaminationDutyManagement";
 
  export default async function ExamDutyManagement() {
  return (
    <PageContainer  title="Examination Duty Dashboad"   description="This is Examination Duty Dashboard" >      
        
        <ExaminationDutyManagementDashboard/>
        
     </PageContainer>
  );
};