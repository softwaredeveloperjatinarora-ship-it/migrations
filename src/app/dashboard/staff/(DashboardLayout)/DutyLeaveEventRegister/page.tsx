import PageContainer from "@/app/components/container/PageContainer";
import DutyLeaveEventRegistration from "@/app/components/StaffViews/DutyLeaveEventRegistration/DutyLeaveEventRegistration";
import AutoLoginss from "@/utils/logins";

export default async function DutyLeaveEventRegister() {
  return (
    <PageContainer
      title="Student Event Group Registration"
      description="this is Student Event Group Registration"
    >
      <DutyLeaveEventRegistration />
    </PageContainer>
  );
}
