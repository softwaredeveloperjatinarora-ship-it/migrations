// "use server";
// import axios from "axios";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/utils/authOptions";
// import https from "https";
// import urls from "@/app/url";

// export async function getTimeTableGroupingAction(credentialsJson: any, splitValue: any) {
//     const session = await getServerSession(authOptions);
//     console.log("re body",credentialsJson);

//     if (!session?.user?.token) {
//         throw new Error("Token is undefined");
//     }

//     const agent = new https.Agent({
//         rejectUnauthorized: false, // Disable SSL certificate validation
//     });



//     let requestBody = {
//         data: credentialsJson, // The encrypted data
//     };
    
//     try {
//         const response = await axios.post(
//             `http://172.18.12.25:81/api/TimeTable/GetGrouping`,  // Ensure the correct endpoint
//               requestBody,
//             {
//                 headers: {
//                     Authorization: `Bearer ${splitValue}`, // Authorization header with bearer token
//                       "Content-Type": "application/json",
//                 },
//                 // params: requestBody
//                 // httpsAgent: agent, // Disable SSL certificate verification
//             }
//         );

    

//         return {
//             message: "Data fetched successfully",
//             status: "success",
//             ApiData: response.data,

//         };

//     } catch (error: unknown) {

//         let errorMessage = "An unknown error occurred";

//         if (error instanceof Error) {
//             errorMessage = error.message;
//         } else if (axios.isAxiosError(error)) {
//             errorMessage = error.response?.data?.message || error.message || "API request failed";
//         }
//         return {
//             message: errorMessage,
//             status: "error",
//         };
//     }
// }





















"use server";
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import https from "https";
import urls from "@/app/url";

export async function getTimeTableGroupingAction( credentialsJson: any) {
  const session = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJMb2dpbk5hbWUiOiIzMzM5OCIsIkRlcGFydG1lbnROYW1lIjoiTi9BIiwiUm9sbElkIjoiNTAiLCJlbWFpbElkIjoiTi9BIiwiTkFNRSI6IkFzaGlzaCBTaGFybWEiLCJpc0FjdGl2ZSI6IlRydWUiLCJVbmlxdWVpZCI6IjBiMGNhZDEzLWZmYzMtNDk0OC1iYzZiLWU5NmM1N2M3OWM1OCIsIklzUGFyZW50IjoiRmFsc2UiLCJVc2VyVHlwZSI6Ik4vQSIsIlNwZWNpYWxCbG9jayI6Ik4vQSIsIklzT1RQQmFzZWQiOiJUcnVlIiwiSXNPVFBWYWxpZCI6IlRydWUiLCJuYmYiOjE3NTQ5OTI0NzQsImV4cCI6MTc4NjUyODQ3NCwiaWF0IjoxNzU0OTkyNDc0LCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo3MTI1LyIsImF1ZCI6Imh0dHBzOi8vbG9jYWxob3N0OjcxMjUvIn0.B7DaBVkiAhjF52oABMKoWYtzimpxnCSGFpgBiuWLh9k";



  const agent = new https.Agent({
    rejectUnauthorized: false, // Disable SSL certificate validation
  });
 




  try {
    const response = await axios.post(
     `http://172.18.12.25:81/api/TimeTable/GetGrouping`,  // Ensure the correct endpoint
      credentialsJson,
      {
        headers: {
          Authorization: `Bearer ${session}`, // Authorization header with bearer token
          "Content-Type": "application/json",
        },
        httpsAgent: agent, // Disable SSL certificate verification
      }
    );

    return {
      message: "successfully",
      status: "success",
      ApiData: response.data,
    };
  } catch (error: unknown) {

    let errorMessage = "An unknown error occurred";

    if (error instanceof Error) {
        errorMessage = error.message;
    } else if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message || "API request failed";
    }
    return {
        message: errorMessage,
        status: "error",
    };
}
}
