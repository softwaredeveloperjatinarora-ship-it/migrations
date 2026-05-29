import PageContainer from "@/app/components/container/PageContainer";
import ArchitectDrawingChatPage from "@/app/components/StaffViews/ObpStatusApproval/ArchitectDrawingChatPage";

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ projectId?: string }>;
}) {
  const params = await searchParams;
  return (
    <PageContainer
      title="Architect Drawing Follow Up Chat"
      description="Follow up chat for architect drawings"
    >
      <ArchitectDrawingChatPage projectId={params?.projectId ?? ""} />
    </PageContainer>
  );
}
