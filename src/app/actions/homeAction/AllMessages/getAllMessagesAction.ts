"use server";
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import {
  decryptDataforResponse,
  encryptData,
} from "@/app/api/services/auth/Encrptdecrpt";
import https from "https";
import urls from "@/app/url";
import { redirect } from "next/navigation";

export async function getAllMessagesAction(Data:any) {
  const session = await getServerSession(authOptions);


  const agent = new https.Agent({
    rejectUnauthorized: false, // Disable SSL certificate validation
  });

  // const formfields = {
  //   Ssubject: null,
  //   Description: null,
  //   PageIndex: 1,
  //   PageCount: null,
  //   PageSize: null
  // }


  if (!session?.user?.token) {
    throw new Error("Token is undefined");
  }
  // let splitValue = session.user.token.split("NEXT2121ANG");
  // const credentialsJson = JSON.stringify(formfields);

  // // Encrypt the data
  // const { Data } = encryptData(credentialsJson, splitValue[1]);

  let requestBody = {
    data: Data, // The encrypted data
  };

  try {
    const response = await axios.post(
      `${urls.baseurl}/Profile/GetMyMessageStudent`,
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
      message: "Messages data fetched successfully",
      status: "success",
      ApiData, // Return the decrypted data
    };
  } catch (error) {
    
    return {
      message: "User registration failed.",
      status: "error",
    };
  }
}
