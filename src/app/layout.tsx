
import React from "react";
import { Providers } from "@/store/providers";
import MyApp from "./app";
import "./global.css";
import DevtoolsBlocker from "@/utils/DevtoolsBlocker";
import AutoLoginss from "@/utils/logins";
import { SessionProvider } from "next-auth/react";


export const metadata = {
  title: "LPU",
  description: "LPU",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.cdnfonts.com/css/birthday-2"
          rel="stylesheet"
        />

        {process.env.NODE_ENV === "production" && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  // Immediate check before React hydration
                  function redirectToGoogle() {
                    try {
                      sessionStorage.setItem('devtools_blocked', 'true');
                     // window.location.href = 'https://google.com';
                    } catch(e) {
                     // window.location.replace('https://google.com');
                    }
                  }
                  
                  // First check if we've already detected and blocked
                  if (sessionStorage.getItem('devtools_blocked') === 'true') {
                    //redirectToGoogle();
                    return;
                  }
                  
                  var threshold = 160;

                  // Immediate size check (works when DevTools is already open on the side)
                  if (window.outerWidth - window.innerWidth > threshold || 
                      window.outerHeight - window.innerHeight > threshold) {
                  //  redirectToGoogle();
                    return;
                  }
                  
                  // Check for Firefox and Chrome DevTools objects
                  if ((window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized) || 
                      (window.chrome && window.chrome.devtools)) {
                    //redirectToGoogle();
                    return;
                  }

                  // Debug method using debugger keyword
                  var startTime = new Date().getTime();
                  debugger;
                  if (new Date().getTime() - startTime > 100) {
                   // redirectToGoogle();
                    return;
                  }
                  
                  // Console timing check (works for console-based DevTools)
                  try {
                    startTime = new Date().getTime();
                    // console.log("DevTools Detection");
                    console.clear();
                    if (new Date().getTime() - startTime > 100) {
                    //  redirectToGoogle();
                    }
                  } catch(e) {}
                })();
              `,
            }}
          />
        )}
      </head>
      <body>
     
       
      
        <Providers>
          {/* <AutoLoginss /> */}
          <MyApp session={undefined}>{children}</MyApp>
        </Providers>
       
      </body>
    </html>
  );
}