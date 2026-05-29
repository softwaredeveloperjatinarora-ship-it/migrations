import PageContainer from "@/app/components/container/PageContainer";
import ObpStatusApprovalLandingPage from "@/app/components/StaffViews/ObpStatusApproval/ObpStatusApprovalLandingPage";

export default function Page() {
  return (
    <PageContainer title="OBP Project " description="This is OBP Project Form Dashboard">
      <ObpStatusApprovalLandingPage />
    </PageContainer>
  );
}
