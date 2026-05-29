
import { NextResponse } from 'next/server'; 
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
 
export async function middleware(req: NextRequest) {
  const cookieStore = cookies();
  const sessionCookie = (await cookieStore).get('next-auth.session-token');
 
  if (!sessionCookie) {

  //return NextResponse.redirect(new URL('/dashboard', req.url));
   return NextResponse.redirect(new URL('https://ums.lpu.in/lpuums/', req.url));
  }
  
  return NextResponse.next();
}

export const config = {
//  matcher: [], // Only apply middleware to these pages
matcher: ['/dashboard/decadashboard/:path*'],
};



// import { signIn } from 'next-auth/react';
// import { NextRequest, NextResponse } from 'next/server';

// export function middleware(request: NextRequest) {
//   const url = request.nextUrl.clone();
//   // const token = url.pathname.split('/').pop();
//   const token = url.pathname.split("/").filter(Boolean).at(-1); // gets last segment
//   console.log("Token middlware:", token);
//   if (token && token.length >= 96) {
//     // Reconstruct the base URL to redirect to
//     const basePath = url.pathname.split('/').slice(0, -1).join('/') || '/';
//     url.pathname = basePath;
//     signInWithToken(token);
//     // url.searchParams.set('token', token); // optionally pass token via query
    
    
//   }
//   async function signInWithToken(token: string) {
//     const result = await signIn("credentials", {
//         redirect: false,
//         urlParam: token,
//       });
//       console.log("SignIn result:", result);
//       return result;
//   }
//   return NextResponse.next();
// }

// // Apply middleware only to matching routes

// export const config = {
//   matcher: ['/dashboard/:path*',  '/admin'], // Only apply middleware to these pages
// };
