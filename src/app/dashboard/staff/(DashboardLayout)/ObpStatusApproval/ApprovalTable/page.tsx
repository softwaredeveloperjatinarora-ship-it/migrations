import PageContainer from "@/app/components/container/PageContainer";
import ObpStatusApporvalTable from "@/app/components/StaffViews/ObpStatusApproval/ObpStatusApporvalTable";
export default function Page() {
  return (
    <PageContainer title="OBP Project " description="This is OBP Project Form Dashboard">
      <ObpStatusApporvalTable />
    </PageContainer>
  );
}
