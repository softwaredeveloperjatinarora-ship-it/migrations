"use server";
import { encryptData } from "@/app/api/services/auth/Encrptdecrpt";

import axios from "axios";
import https from "https";
import urls from "@/app/url";
import {getServerSession} from "next-auth";
import {authOptions} from "../../../../utils/authOptions";

export async function getseatingPlanAction() 
{
  const session = await getServerSession(authOptions);
  const agent = new https.Agent({
    rejectUnauthorized: false, // Disable SSL certificate validation
  });
  const formfields = {
    Vid: 0,
  };
  if (!session?.user?.token) {
    throw new Error("Token is undefined");
  }
  let splitValue = session.user.token.split("NEXT2121ANG");
  const credentialsJson = JSON.stringify(formfields);

  //EncrytData
  const { Data } = encryptData(credentialsJson, splitValue[1]);
  let requestBody = {
    data: Data,
  };
  debugger;
  try {
    const response = await axios.post(
      `${urls.baseurl}/Conduct/GetSeatingPlan`,

      requestBody,
      {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`, // Add the Bearer token from process.env
          "Content-Type": "application/json", // Specify the content type
          "Cache-Control": "no-store", // Disable caching
        },
        httpsAgent: agent,
      }
    );

    // // Log the response data
    // console.log('API Response data fetched:');
    //console.log(response);
    const ApiData = response.data;
    return {
      message: "User registration successful!",
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
