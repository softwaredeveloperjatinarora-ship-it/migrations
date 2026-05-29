
"use server";
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import https from "https";
import urls from "@/app/url";

export async function getEventSearchListAction(Data:string) {
  const session = await getServerSession(authOptions);
 

  const agent = new https.Agent({
    rejectUnauthorized: false, // Disable SSL certificate validation
  });


  let requestBody = {
    data: Data, // The encrypted data
  };

  try {
    const response = await axios.post(
      `${urls.baseurl}/Profile/DisplayEventSearchList`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`, // Authorization header with bearer token
          "Content-Type": "application/json", // Content type is JSON
        },
        httpsAgent: agent, // Disable SSL certificate verification
      }
    );

    const ApiData = response.data;

    return {
      message: "upcoming Event data fetched successfully",
      status: "success",
      ApiData,
    };
  } catch (error) {
   
    return {
      message: "User registration failed.",
      status: "error",
    };
  }
}
