

'use client';
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import RTL from '@/app/dashboard/staff/(DashboardLayout)/layout/shared/customizer/RTL';
import { ThemeSettings } from '@/utils/theme/Theme';
import { useSelector } from 'react-redux';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import type { AppState } from '@/store/store';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import '@/utils/i18n';
import NextTopLoader from 'nextjs-toploader';
import { useActivityTracker } from '@/utils/useActivityTracker';
import { disableConsoleInProduction } from '@/utils/consoleblocker';
import AutoLoginss from '@/utils/logins';
import { usePathname } from "next/navigation";
import Login from './(auth)/(auth1)/login/page';

interface MyAppProps {
  children: React.ReactNode;
  session?: Session;
}

disableConsoleInProduction();
const MyApp = ({ children, session }: MyAppProps) => {
  const theme = ThemeSettings();
  const customizer = useSelector((state: AppState) => state.customizer);
const pathname = usePathname();
 const allowedtokenRoutes = ["/dashboard/staff", "/dashboard/placement"];
 const protectedRoutes = ["/dashboard/DECA" ];

debugger;
   // Split the path into segments
  const segments = pathname.split("/").filter(Boolean);
  const lastSegment = segments.at(-1);

  // Check if last segment looks like a JWT token
  // const isToken = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(lastSegment || "");
  const isToken = /^[A-Fa-f0-9]{64,}$/.test(lastSegment || "");
  const isProtectedRoute = protectedRoutes.some(r => pathname.startsWith(r));
  // Check if path starts with one of the allowed routes
  const startsWithtokenAllowed = allowedtokenRoutes.some(route =>
    pathname.startsWith(route)
  );
 
  const shouldShowAutoLogin = startsWithtokenAllowed && isToken;

  return (
    
    <SessionProvider
      // session={session}
      refetchOnWindowFocus={true}
    >
      <NextTopLoader
        color="#5D87FF"
        height={3}
        showSpinner={false}
      />
      <AppRouterCacheProvider options={{ enableCssLayer: true }}>
        <ThemeProvider theme={theme}> 
          <RTL direction={customizer.activeDir}>
            <CssBaseline enableColorScheme />
            <ActivityTrackerWrapper>
             {shouldShowAutoLogin && <AutoLoginss />}
             {isProtectedRoute && <Login/>}
              {children}
            </ActivityTrackerWrapper>
          </RTL>
        </ThemeProvider>
      </AppRouterCacheProvider>
    </SessionProvider>
  );
};

// Wrapper component for proper provider nesting
const ActivityTrackerWrapper = ({ children }: { children: React.ReactNode }) => {
  useActivityTracker();
  return <>{children}</>;
};

export default MyApp;