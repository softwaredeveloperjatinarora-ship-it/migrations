"use server";
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import https from "https";
import urls from "@/app/url";

export async function saveadminAction( Data: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.token) {
    throw new Error("Token is undefined");
  }

  const agent = new https.Agent({
    rejectUnauthorized: false, // Disable SSL certificate validation
  });
 


  let requestBody = {
    data: Data, // The encrypted data
  };

  try {
    const response = await axios.post(
      `${urls.baseurl}/DSRHostelSession/SaveHostelData`,  // Ensure the correct endpoint
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`, // Authorization header with bearer token
          "Content-Type": "application/json",
        },
        httpsAgent: agent, // Disable SSL certificate verification
      }
    );

    return {
      message: "Password changed successfully",
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
