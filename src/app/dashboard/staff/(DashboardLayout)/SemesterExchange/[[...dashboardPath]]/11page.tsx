// import PageContainer from "@/app/components/container/PageContainer";
// import SemesterExchangeStaffDashboard from "@/app/components/StaffViews/SemesterExchange/SemesterExchangeStaffDashboard";

// const SemesterExchangeStaffDashboardPage = () => {
//   return (
//     <PageContainer title="Semester Exchange Staff Dashboard" description="Role-based semester exchange staff module">
//       <SemesterExchangeStaffDashboard />
//     </PageContainer>
//   );
// };

// export default SemesterExchangeStaffDashboardPage;

import PageContainer from "@/app/components/container/PageContainer";
import SemesterExchangeStaffDashboard from "@/app/components/StaffViews/SemesterExchange/SemesterExchangeStaffDashboard";

interface PageProps {
  params: Promise<{ dashboardPath?: string[] }>;
}

export default async function SemesterExchangeStaffDashboardPage({ params }: PageProps) {
  // Await the routing array from Next.js
  const { dashboardPath } = await params;

  // Debugging array layout: e.g., if path is /SemesterExchange/SMAdmin/12416769, 
  // dashboardPath might be ['SMAdmin', '12416769']
  const pathSegments = dashboardPath || [];

  // Allowed legacy routes to match against
  const allowedRoutes = [
    'SMAdmin', 
    'DashboardDIAHOD', 
    'DashboardHOW', 
    'DashboardHOD', 
    'FacultyDashboard'
  ];

  // Look for any valid route match within the URL segments
  const activeRoute = pathSegments.find(segment => allowedRoutes.includes(segment));

  // If no matching route prefix is found anywhere in the URL string, show 404
  if (!activeRoute) {
    return (
      <PageContainer title="Error" description="Page not found">
        <div style={{ padding: '40px', textAlign: 'center', color: '#ff4d4f' }}>
          <h3 style={{ fontSize: '24px', marginBottom: '10px' }}>404 - Dashboard Not Found</h3>
          <p>The URL layout structure or route identifier is invalid.</p>
        </div>
      </PageContainer>
    );
  }

  // If a valid route was found, render the dashboard normally
  return (
    <PageContainer 
      title="Semester Exchange Staff Dashboard" 
      description="Role-based semester exchange staff module"
    >
      <SemesterExchangeStaffDashboard />
    </PageContainer>
  );
}