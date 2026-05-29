"use server";
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import https from "https";
import urls from "@/app/url";

export async function getProjectStatusStructureDrawingStatus(token?: string) {
  let sessionToken = token;
  // If no token provided, try to get from server session
  if (!sessionToken) {
    const session = await getServerSession(authOptions);
    console.log("SERVER SESSION:", session);
    sessionToken = session?.user?.token;
  }

  console.log(urls.basewebapiurl);

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
    const fullUrl = `${urls.basewebapiurl}/PlanningBridge/GetProjectStatusStructureDrawingStatus`;
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
    console.log("Project Status Structure Drawing Status API Response:", ApiData);
    console.log("Full Response Object:", response);

    return {
      message: "Project status structure drawing status fetched successfully",
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
    console.error("Error in getProjectStatusStructureDrawingStatus:", errorMessage);
    return {
      message: errorMessage,
      status: "error",
    };
  }
}
