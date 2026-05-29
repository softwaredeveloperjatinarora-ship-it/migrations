"use server";
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import {
  decryptDataforResponse,
  encryptData,
} from "@/app/api/services/auth/Encrptdecrpt";
import https from "https";
import urls from "@/app/url";

export async function gethostelactivitydsrAction() {
  const session = await getServerSession(authOptions);


  const agent = new https.Agent({
    rejectUnauthorized: false, // Disable SSL certificate validation
  });

  const formfields = {
  
  };

  if (!session?.user?.token) {
    throw new Error("Token is undefined");
  }
  let splitValue = session.user.token.split("NEXT2121ANG");
  const credentialsJson = JSON.stringify(formfields);

  // Encrypt the data
  const { Data } = encryptData(credentialsJson, splitValue[1]);

  let requestBody = {
    data: Data, // The encrypted data
  };

  try {
    const response = await axios.post(
      // `${urls.baseurl}/Profile/GetHostelDataforActivity `,
      
       `${urls.baseurl}/DSRHostelSession/GetAdminMentorsPendingData `,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`, // Authorization header with bearer token
          "Content-Type": "application/json", // Content type is JSON
        },
        httpsAgent: agent, // Disable SSL certificate verification
      }
    );

    const ApiData = response.data;

    return {
      message: "Announcement data fetched successfully",
      status: "success",
      ApiData, // Return the decrypted data
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
