"use server";

import axios from 'axios';
import { getServerSession } from "next-auth";
import { authOptions } from '@/utils/authOptions';
import https from 'https';
import urls from '@/app/url';

export async function getEmployeeDetails() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.token) {
    return {
      status: 'error',
      message: 'Authentication failed. Please log in again.',
    };
  }

  const agent = new https.Agent({
    rejectUnauthorized: false,
  });

  try {
     const TOKEN =   session?.user?.token
    // const TOKEN =   process.env.TOKEN;
// session?.user?.token;//
    
    const response = await axios.get(
      `${urls.basewebapiurl}/MouBridge/GetEmployeeDetails`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
        },
        httpsAgent: agent,
      }
    );

    // Return actual API response directly
    return response.data.item1;

  } catch (error: any) {
    return {
      status: 'error',
      message:
        error.response?.data?.message ||
        error.message ||
        'Server error',
    };
  }
}
// "use server";
// import axios from 'axios';
// import { getServerSession } from "next-auth";
// import { authOptions } from '@/utils/authOptions';
// import https from 'https';
// import urls from '@/app/url';

// export async function getEmployeeDetails() {
//   const session = await getServerSession(authOptions);
  
//   if (!session?.user?.token) {
//     return {
//       message: 'Authentication failed. Please log in again.',
//       status: 'error',
//     };
//   }
  
//   const agent = new https.Agent({
//     rejectUnauthorized: false,
//   });
//   try {
//     const baseUrl = process.env.NEXT_PUBLIC_WEBAPI_URL_PROD;
//   const fullUrl = `${baseUrl}/MouBridge/GetEmployeeDetails`;
//    const TOKEN = process.env.TOKEN;
//     const response = await axios.get(
//       `${urls.basewebapiurl}/MouBridge/GetEmployeeDetails`,
//       {
//         headers: {
//           'Authorization': `Bearer ${TOKEN}`,
//           'Content-Type': 'application/json',
//         },
//         httpsAgent: agent,
//       }
//     );

//     return {
//       status: 'success',
//       item1: response.data,
//     };
//   } catch (error: any) {
//     return {
//       message: error.response?.data?.message || error.message || "Server error",
//       status: 'error',
//     };
//   }
// }


// 'use server';

 
// import axios from 'axios';
// import https from 'https';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/utils/authOptions';

// export async function getEmployeeDetails() {
//   const session = await getServerSession(authOptions);
//   const token = session?.user?.token;

//   const agent = new https.Agent({ rejectUnauthorized: false });

//   try {
//     const baseUrl = process.env.NEXT_PUBLIC_WEBAPI_URL_PROD;
//     const fullUrl = `${baseUrl}/MouBridge/GetEmployeeDetails`;
//     const TOKEN = process.env.TOKEN;
//     const response = await axios.post(fullUrl, null, {
//       headers: { Authorization: `Bearer ${TOKEN}` },
//       httpsAgent: agent,
//     });

//     return {
//       message: 'Employee details fetched successfully',
//       status: 'success',
//       ApiData: response.data,
//     };
//   } catch (error: unknown) {
//     const msg = axios.isAxiosError(error)
//       ? error.response?.data?.message || error.message
//       : error instanceof Error
//         ? error.message
//         : 'Unknown error';
//     return { message: msg, status: 'error' };
//   }
// }
