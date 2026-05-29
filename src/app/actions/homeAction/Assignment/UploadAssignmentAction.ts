"use server";
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

import https from "https";
import urls from "@/app/url";

export async function UploadAssignmentAction(file: File) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.token) {
        throw new Error("Token is undefined");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("VId", "0")
    // formData.append("fileName",newFileName );
    formData.append("folderPath","Assignments/");

    const agent = new https.Agent({
        rejectUnauthorized: false, // Disable SSL certificate validation
    });

    try {
        const response = await axios.post(
            `${urls.baseurl}/Values/upload`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${session?.user?.token}`, // Authorization header with bearer token
                },
                httpsAgent: agent, // Disable SSL certificate verification
            }
        );

        const ApiData = response.data;

        return {
            message: "Assignment uploaded successfully",
            status: "success",
            ApiData, // Return the decrypted data
        };
    } catch (error: unknown) {
        let errorMessage = "An unknown error occurred";
        let apiErrorResponse = null;
    
        if (axios.isAxiosError(error)) {
          errorMessage = error.response?.data?.message || 
                        error.response?.data?.error ||
                        error.message || 
                        "API request failed";
          apiErrorResponse = error.response?.data;
          
          if (error.response?.status) {
            errorMessage = `[${error.response.status}] ${errorMessage}`;
          }
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
    
        return {
          status: "error",
          message: errorMessage,
          apiResponse: apiErrorResponse // Include API error response if available
        };
      }
}
