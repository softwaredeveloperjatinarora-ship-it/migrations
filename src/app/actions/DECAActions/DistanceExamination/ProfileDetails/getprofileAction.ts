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

export async function getprofileAction(formfields:string) {
  const session = await getServerSession(authOptions);
  const agent = new https.Agent({
    rejectUnauthorized: false, // Disable SSL certificate validation
  });

  if (!session?.user?.token) {
    throw new Error("Token is undefined");
  }

  let requestBody = {
    data: formfields,
  };

  try {
    console.log("Fetching profile with request body:", requestBody);
    const response = await axios.post(
      `${urls.baseurl}/DistanceExamination/GetFacultyProfile`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`, // Authorization header with bearer token
          "Content-Type": "application/json", // Content type is JSON
        },
        httpsAgent: agent, // Disable SSL certificate verification
      }
    );
console.log("Profile response:", response);
    const ApiData = response.data;
    return {
      message: "profile data fetched successfully",
      status: "success",
      data : ApiData, // Return the decrypted data
    };
  } catch (error: unknown) {
  console.error("Profile API error:", error);

  let errorMessage = "An unknown error occurred";

  if (axios.isAxiosError(error)) {
    console.error("Axios error details:", {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
    });
    errorMessage =
      error.response?.data?.message ||
      error.message ||
      "API request failed";
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return {
    message: errorMessage,
    status: "error",
  };

  }
}
