import PageContainer from "@/app/components/container/PageContainer";
import SemesterExchangeStaffDashboard from "@/app/components/StaffViews/SemesterExchange/SemesterExchangeStaffDashboard";

const SemesterExchangeStaffDashboardPage = () => {
  return (
    <PageContainer title="Semester Exchange Staff Dashboard" description="Role-based semester exchange staff module">
      <SemesterExchangeStaffDashboard />
    </PageContainer>
  );
};

export default SemesterExchangeStaffDashboardPage;


// import PageContainer from "@/app/components/container/PageContainer";
// import DynamicDashboard from "@/app/components/StaffViews/SemesterExchange/DynamicDashboard";
// export default async function SemesterExchangeDashboardPage() {
//   return (
//     <PageContainer
//       title="Semester Exchange — Faculty Dashboard"
//       description="This is  Semester Exchange — Faculty Dashboard Page"
//     >
//       <DynamicDashboard />
//     </PageContainer>
//   );
// }
