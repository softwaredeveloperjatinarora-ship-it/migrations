"use server";

import axios from "axios";

import https from "https";
import urls from "@/app/url";

export async function resetPassword({
  password,
  token,
}: {
  password: string;
  token: string | null;
}) {
  // console.log("serverreset", password, token);

  const agent = new https.Agent({
    rejectUnauthorized: false,
  });

  const requestBody = {
    password: password,
    token: token,
  };

  try {
    const response = await axios.post(
      `${urls.baseurl}/Profile/resetpassword`,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
        httpsAgent: agent,
      }
    );

    return {
      message: "verify user successfully",
      status: "success",
      ApiData: response.data,
    };
  } catch (error: any) {
    return {
      message: error.response?.data?.message || "Failed to verify user",
      status: "error",
    };
  }
}
