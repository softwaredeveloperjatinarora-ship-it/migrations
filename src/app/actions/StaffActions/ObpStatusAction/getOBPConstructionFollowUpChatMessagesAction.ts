"use server";

import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import https from "https";
import urls from "@/app/url";

export async function getOBPConstructionFollowUpChatMessages(
  LoginName: string | number,
  StageAllocationId: string | number,
  MetricId: string | number,
  token?: string,
) {
  let sessionToken = token;

  // If no token provided, try to get from server session
  if (!sessionToken) {
    const session = await getServerSession(authOptions);
    console.log("SERVER SESSION:", session);
    sessionToken = session?.user?.token;
  }

  console.log("Using basewebapiurl:", urls.basewebapiurl);

  const agent = new https.Agent({
    rejectUnauthorized: false,
  });

  if (!sessionToken) {
    return {
      message: "User not authenticated or token is missing",
      status: "error",
    };
  }

  try {
    // Send IDs as payload in request body with POST
    const payload = {
      LoginName,
      StageAllocationId,
      MetricId,
    };

    const fullUrl = `${urls.basewebapiurl}/PlanningBridge/GetOBPConstructionFollowUpChatMessages`;
    console.log("Full API URL:", fullUrl);
    console.log("Request Method: POST");
    console.log("Payload:", payload);

    const response = await axios.post(
      fullUrl,
      payload,
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          "Content-Type": "application/json",
        },
        httpsAgent: agent,
      },
    );

    const ApiData = response.data;
    console.log(
      "GetOBPConstructionFollowUpChatMessages API Response:",
      ApiData,
    );

    return {
      message: "Chat messages fetched successfully",
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
    console.error(
      "Error in getOBPConstructionFollowUpChatMessages:",
      errorMessage,
    );
    return {
      message: errorMessage,
      status: "error",
    };
  }
}
