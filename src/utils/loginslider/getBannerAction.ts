"use server";
import urls from "@/app/url";
import axios from "axios";
import https from "https";

export async function getBannerAction() {
  const agent = new https.Agent({
    rejectUnauthorized: false,
  });


  let requestBody = {

  };

  try {
    const response = await axios.post(

      `${urls.baseurl}/Profile/GetPromotionalforLogin `,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json"
        },
        httpsAgent: agent,
      }
    );

    const ApiData = response.data;

    return {
      message: "Promotional data fetched successfully",
      status: "success",
      ApiData,
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