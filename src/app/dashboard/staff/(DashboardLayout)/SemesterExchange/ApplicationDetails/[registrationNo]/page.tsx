import PageContainer from "@/app/components/container/PageContainer";
import SemesterExchangeApplicationDetails from "@/app/components/StaffViews/SemesterExchange/SemesterExchangeApplicationDetails";

interface Props {
  params: { registrationNo: string };
}

const ApplicationDetailsPage = ({ params }: Props) => {
  return (
    <PageContainer title="Application Details" description="Semester Exchange student application details">
      <SemesterExchangeApplicationDetails registrationNo={params.registrationNo} />
    </PageContainer>
  );
};

export default ApplicationDetailsPage;
