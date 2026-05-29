"use server";

import axios from "axios";

import https from "https";
import urls from "@/app/url";

export async function confirmEmail(selectedEmail: string) {
  // console.log("serveremail", selectedEmail);
  const agent = new https.Agent({
    rejectUnauthorized: false,
  });

  const requestBody = {
    email: selectedEmail,
  };

  try {
    const response = await axios.post(
      `${urls.baseurl}/Profile/selecetdmail`,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
        httpsAgent: agent,
      }
    );

    return {
      message: "selected mail  send successfully",
      status: "success",
      ApiData: response.data,
    };
  } catch (error: any) {
    return {
      message: error.response?.data?.message || "Failed to send selected mail",
      status: "error",
    };
  }
}
