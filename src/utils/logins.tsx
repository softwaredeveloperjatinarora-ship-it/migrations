 

"use client";
import { signIn, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function AutoLoginss() {
  const pathname = usePathname();
  const router = useRouter();
  const hasRun = useRef(false);
  const { data: session, status } = useSession();

  const pathSegments = pathname.split("/").filter(Boolean);
  const cleanRedirectPath = "/" + pathSegments.slice(0, -1).join("/"); 
  const lastSegment = pathSegments.at(-1);
  //const isToken = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(lastSegment || "");
   const isToken = /^[A-Fa-f0-9]{64,}$/.test(lastSegment || "");

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (session && isToken) {
      router.push(cleanRedirectPath);
      return;
    }

    if (!lastSegment || status === "authenticated") return;

    const autoLogin = async () => {
      try {
        debugger;
        // Instead of calling API here, just call signIn with params
        const result = await signIn("credentials", {
          redirect: false,
          username: lastSegment, // pass last segment as login name         
          route: pathname,       // pass route to decide API inside NextAuth
        });
        if (!result || result.error) {
          router.push("/studentdashboard");
        } else {
          router.push(cleanRedirectPath);
        }
      } catch {
      }
    };

    autoLogin();
  }, [pathname, session, status, router, cleanRedirectPath, lastSegment, isToken]);

  return null;
}
