"use server";

import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import https from "https";
import urls from "@/app/url";

export interface InsertFollowUpRemarkParams {
  LoginName: string | number;
  StageAllocationId: string | number;
  MetricId?: string | number;
  FollowupRemarks: string;
  StageSupportingDocument?: string;
}

export async function insertOBPProjectFollowUpRemarks(
  params: InsertFollowUpRemarkParams,
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
    // Send params as multipart/form-data
    const formData = new FormData();
    formData.append('StageAllocationId', String(params.StageAllocationId));
    formData.append('LoginName', params.LoginName?.toString() || '');
    formData.append('FollowupRemarks', params.FollowupRemarks || '');
    formData.append('SupportingDocument', '');
    formData.append('SupportingDocumentName', '');

    const fullUrl = `${urls.basewebapiurl}/PlanningBridge/InsertOBPProjectFollowupRemarksUser`;
    console.log("Full API URL:", fullUrl);
    console.log("Request Method: POST");
    console.log("Payload (FormData):", {
      StageAllocationId: params.StageAllocationId,
      LoginName: params.LoginName,
      FollowupRemarks: params.FollowupRemarks,
      SupportingDocument: '',
      SupportingDocumentName: '',
    });

    const response = await axios.post(
      fullUrl,
      formData,
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          'Content-Type': 'multipart/form-data',
        },
        httpsAgent: agent,
      },
    );

    const ApiData = response.data;
    console.log(
      "InsertOBPProjectFollowupRemarksUser API Response:",
      ApiData,
    );

    return {
      message: "Follow-up remark inserted successfully",
      status: "success",
      ApiData,
    };
  } catch (error: unknown) {
    let errorMessage = "An unknown error occurred";
    let errorDetails: any = null;

    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message || "API request failed";
      // Convert headers to plain object to avoid Next.js serialization error
      const headersObj: Record<string, string> = {};
      if (error.response?.headers) {
        // Handle AxiosHeaders or regular headers object
        const headers = error.response.headers as any;
        if (typeof headers.forEach === 'function') {
          headers.forEach((value: any, key: any) => {
            headersObj[key] = value;
          });
        } else {
          // If headers is a plain object, just use it directly
          Object.assign(headersObj, headers);
        }
      }
      errorDetails = {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: headersObj,
      };
      console.error(
        "Error in insertOBPProjectFollowUpRemarks - Axios Error:",
        errorDetails
      );
    } else if (error instanceof Error) {
      errorMessage = error.message;
      console.error(
        "Error in insertOBPProjectFollowUpRemarks:",
        error
      );
    }
    return {
      message: errorMessage,
      status: "error",
      errorDetails,
    };
  }
}
