import PageContainer from "@/app/components/container/PageContainer";
import SemesterExchangeStaffDashboard from "@/app/components/StaffViews/SemesterExchange/SemesterExchangeStaffDashboard";

interface PageProps {
  params: Promise<{ dashboardPath?: string[] }>;
}

export default async function SemesterExchangeStaffDashboardPage({ params }: PageProps) {
  // Await the routing array from Next.js
  const { dashboardPath } = await params;
  const pathSegments = dashboardPath || [];

  // Allowed dynamic role prefixes matching your Angular configuration
  const allowedRoutes = [
    'SMAdmin', 
    'DashboardDIAHOD', 
    'DashboardHOW', 
    'DashboardHOD', 
    'FacultyDashboard'
  ];

  // Look for any valid role key anywhere inside your current active URL segments
  const activeRoute = pathSegments.find(segment => allowedRoutes.includes(segment));

  // If no matching key is found, fallback securely to a 404 block
  if (!activeRoute) {
    return (
      <PageContainer title="Error" description="Page not found">
        {/* <div style={{ padding: '40px', textAlign: 'center', color: '#ff4d4f' }}>
          <h3 style={{ fontSize: '24px', marginBottom: '10px' }}>404 - Dashboard Not Found</h3>
          <p>The URL layout structure or route identifier is invalid.</p>
        </div> */}
        <SemesterExchangeStaffDashboard />
      </PageContainer>
    );
  }

  // Active route verified! Render your dashboard natively.
  return (
    <PageContainer 
      title={`Semester Exchange Staff Dashboard - ${activeRoute}`} 
      description="Role-based semester exchange staff module"
    >
      <SemesterExchangeStaffDashboard />
    </PageContainer>
  );
}


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
