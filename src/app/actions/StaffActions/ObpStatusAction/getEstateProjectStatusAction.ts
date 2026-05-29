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

export async function getEstateProjectStatus(projectId: string, token?: string) {
  let sessionToken = token;

  // If no token provided, try to get from server session
  if (!sessionToken) {
    const session = await getServerSession(authOptions);
    sessionToken = session?.user?.token;
  }

  const agent = new https.Agent({
    rejectUnauthorized: false, // Disable SSL certificate validation
  });

  if (!sessionToken) {
    return {
      message: "User not authenticated or token is missing",
      status: "error",
    };
  }

  try {
    const fullUrl = `${urls.basewebapiurl}/PlanningBridge/GetEstateProjectStatus?ProjectId=${projectId}`;
    console.log("Full API URL:", fullUrl);
    console.log("Request Method: POST");

    const response = await axios.post(
      fullUrl,
      {},
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`, // Authorization header with bearer token
          "Content-Type": "application/json", // Content type is JSON
        },
        httpsAgent: agent, // Disable SSL certificate verification
      },
    );

    const ApiData = response.data;

    return {
      message: "Estate project status fetched successfully",
      status: "success",
      ApiData,
    };
  } catch (error: unknown) {
    let errorMessage = "An unknown error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (axios.isAxiosError(error)) {
      errorMessage =
        error.response?.data?.message || error.message || "API request failed";
    }
    console.error("Error in getEstateProjectStatus:", errorMessage);
    return {
      message: errorMessage,
      status: "error",
    };
  }
}
