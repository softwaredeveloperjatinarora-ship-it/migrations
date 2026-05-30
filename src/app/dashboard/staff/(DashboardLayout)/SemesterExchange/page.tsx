/**
 * page.tsx
 * Route: /staff/SemesterExchange  (inside DashboardLayout)
 *
 * Next.js App Router server page for the Semester Exchange Faculty Dashboard.
 * Auth is handled by (DashboardLayout) — no token plumbing needed here.
 * Simply renders the DynamicDashboard client component.
 */

import DynamicDashboard from '@/app/components/StaffViews/SemesterExchange/DynamicDashboard';
import '@/app/components/StaffViews/SemesterExchange/DynamicDashboard.css';

export const metadata = {
  title: 'Semester Exchange — Faculty Dashboard',
};

export default function SemesterExchangeDashboardPage() {
  return <DynamicDashboard />;
}
