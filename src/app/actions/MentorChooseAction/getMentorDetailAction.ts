'use server'
import axios from '@/utils/axios';
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import {
  decryptDataforResponse,
  encryptData,
} from "@/app/api/services/auth/Encrptdecrpt";
import https from "https";
import urls from "@/app/url";






export async function getGetPreferenceData() {
  const session = await getServerSession(authOptions);

  const agent = new https.Agent({
    rejectUnauthorized: false, // Disable SSL certificate validation
  });

  const formfields = {

    Value: "GetPreferenceData"


  };

  if (!session?.user?.token) {
    throw new Error("Token is undefined");
  }
  let splitValue = session.user.token.split("NEXT2121ANG");
  const credentialsJson = JSON.stringify(formfields);

  // Encrypt the data
  const { Data } = encryptData(credentialsJson, splitValue[1]);

  let requestBody = {
    data: Data, // The encrypted data
  };

  try {
    const response = await axios.post(
      `${urls.baseurl}/Academic/GetMentorPreferencefromStudents`,
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
      message: "Announcement data fetched successfully",
      status: "success",
      ApiData, // Return the decrypted data
    };
  } catch (error: any) {
    return {
      message: error.message,
      status: "error",
    };
  }
}






export async function getGetCurrentMentorData() {
  const session = await getServerSession(authOptions);

  const agent = new https.Agent({
    rejectUnauthorized: false, // Disable SSL certificate validation
  });

  const formfields = {
    Value: "GetCurrentMentor"
  };

  if (!session?.user?.token) {
    throw new Error("Token is undefined");
  }
  let splitValue = session.user.token.split("NEXT2121ANG");
  const credentialsJson = JSON.stringify(formfields);

  // Encrypt the data
  const { Data } = encryptData(credentialsJson, splitValue[1]);

  let requestBody = {
    data: Data, // The encrypted data
  };

  try {
    const response = await axios.post(
      `${urls.baseurl}/Academic/GetMentorPreferencefromStudents`,
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
      message: "Announcement data fetched successfully",
      status: "success",
      ApiData, // Return the decrypted data
    };
  } catch (error: any) {
    return {
      message: error.message,
      status: "error",
    };
  }
}



export const getMentorDetailAction = async (FacultyUID: number | string) => {
  try {
    const response = await axios.post(`http://172.18.12.25:90/api/Student/SaveMentor`, {
      FacultyUID: FacultyUID.toString()
    });
    // console.log(response.data);
    // Convert to string or return empty string if null
    return response.data[0]?.msg || '';
  } catch (error) {
    console.log("Error fetching access rights:", error);
    throw error;
  }
}
