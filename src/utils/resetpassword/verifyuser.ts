"use server";

import axios from "axios";

import https from "https";
import urls from "@/app/url";

export async function submitVerification(userId: string, age: string) {
  console.log("serveuser", userId, age);

  const agent = new https.Agent({
    rejectUnauthorized: false,
  });

  const requestBody = {
    userId: userId,
    age: age,
  };

  try {
    const response = await axios.post(
      `${urls.baseurl}/Profile/GetForgetPassword`,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
        httpsAgent: agent,
      }
    );
    console.log("responseemail", response.data);
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
