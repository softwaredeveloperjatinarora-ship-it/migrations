import PageContainer from "@/app/components/container/PageContainer";
import ObpProjectForm from "@/app/components/StaffViews/ObpStatusApproval/ObpProjectForm";
export default function Page() {
  return (
    <PageContainer title="OBP Project " description="This is OBP Project Form Dashboard">
      <ObpProjectForm />
    </PageContainer>
  );
}
