 

// import DynamicDashboard from '@/app/components/StaffViews/SemesterExchange/DynamicDashboard';
// import '@/app/components/StaffViews/SemesterExchange/DynamicDashboard.css';

// export const metadata = {
//   title: 'Semester Exchange — Faculty Dashboard',
// };

// export default function SemesterExchangeDashboardPage() {
//   return <DynamicDashboard />;
// }



import PageContainer from "@/app/components/container/PageContainer";
import DynamicDashboard from "@/app/components/StaffViews/SemesterExchange/DynamicDashboard";
export default async function SemesterExchangeDashboardPage() {
  return (
    <PageContainer
      title="Semester Exchange — Faculty Dashboard"
      description="This is  Semester Exchange — Faculty Dashboard Page"
    >
      <DynamicDashboard />
    </PageContainer>
  );
}
