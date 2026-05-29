// "use server";

// import axios from "axios";
// import https from "https";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/utils/authOptions";
// import { encryptData, decryptDataforResponse } from "@/app/api/services/auth/Encrptdecrpt";

// export async function GetCenterNo(centerData?: any) {
//   const session = await getServerSession(authOptions);
//   if (!session?.user?.token) {
//     return {
//       message: 'Unauthorized: No token found',
//       status: 'error',
//       success: false
//     };
//   }

//   // Split the token using your format
//   const splitValue = session.user?.token.split('NEXT2121ANG');
//   if (splitValue.length < 2) {
//     return {
//       message: 'Invalid token format',
//       status: 'error',
//       success: false
//     };
//   }

//   // Prepare your data (this can be customized based on actual data expected)
//   const formData = {
//     "EmpId": 28388, // Replace or extract dynamically if needed
//   };

//   try {
//     const jsonData = JSON.stringify(formData);

//     // Encrypt data with key from split token
//     const { Data: encryptedPayload } = encryptData(jsonData, splitValue[1]);
//     console.log(encryptedPayload);

//     const requestBody = { data: encryptedPayload };

//     // HTTPS agent (skip SSL for dev)
//     const agent = new https.Agent({
//       rejectUnauthorized: false
//     });

//     // Make secure API call
//     const response = await axios.post(
//       "https://172.18.12.25/baseapi/api/DistanceExamination/GetCenterNo",
//       requestBody,
//       {
//         httpsAgent: agent,
//         headers: {
//           Authorization: `Bearer ${session.user?.token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     // Decrypt the response
//     const decrypted = decryptDataforResponse(response.data, splitValue[1]);
//     const parsed = JSON.parse(decrypted);
//     console.log(parsed)
//     return parsed[0].CenterNo
//     // message: "Center data retrieved successfully",
//     // status: "success",
//     // success: true,

//   } catch (error: any) {
//     console.error("Error in GetCenterNo:", error);

//     if (axios.isAxiosError(error) && error.response) {
//       return {
//         message: error.response.data?.message || 'Failed to get center data',
//         status: 'error',
//         success: false,
//         error: error.response.data
//       };
//     }

//     return {
//       message: "Unexpected error occurred",
//       status: "error",
//       success: false
//     };
//   }
// }


"use server"
import axios from 'axios';
import { getServerSession } from "next-auth";
import { authOptions } from '@/utils/authOptions';
import https from 'https';
import urls from "@/app/url";

export async function GetCenterNo(centerNumber:string) {
    
    const session = await getServerSession(authOptions);

    if (!session?.user?.token) {
        throw new Error("Token is undefined");
    }

    const agent = new https.Agent({
        rejectUnauthorized: false,
    });


    let requestBody = {
        data: centerNumber
    }
    console.log("requestBody", requestBody)
    try {
        const response = await axios.post(`${urls.baseurl}/DistanceExamination/GetCenterNo`,
            requestBody,
            {
                headers: {
                    'Authorization': `Bearer ${session?.user?.token}`,
                    'Content-Type': 'application/json',
                },
                httpsAgent: agent,
            });

           if (response.status === 200) {
            return {
                status: true,
                data: response.data,
            };
        }
    }
    catch (error: any) {
       console.error("Error in GetCenterNo:", error);

    if (axios.isAxiosError(error) && error.response) {
      return {
        message: error.response.data?.message || 'Failed to get center data',
        status: 'error',
        success: false,
        error: error.response.data
      };
    }

    return {
      message: "Unexpected error occurred",
      status: "error",
      success: false
    };
  }
}
