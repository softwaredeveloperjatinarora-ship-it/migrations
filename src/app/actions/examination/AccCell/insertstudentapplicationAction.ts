"use server";
import { StudentDegreeExtensionApplication } from "@/app/api/interfaces/Examination/studentdegreeextensioninterface";
import { encryptData } from "@/app/api/services/auth/Encrptdecrpt";
import urls from "@/app/url";
import { authOptions } from "@/utils/authOptions";
import axios from "axios";
import https from "https";
import { getServerSession } from "next-auth";

export async function insertStudentApplicationAction(
 Data: string
) {
  // Get the session to access the token
    const session = await getServerSession(authOptions);
    const agent = new https.Agent({
    rejectUnauthorized: false, // Disable SSL certificate validation
  });
 
  let requestBody = {
    data: Data,
  };
  try {
    const response = await axios.post(
      `${urls.baseurl}/DegreeExtension/InsertStudentApplication`,

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

    const ApiData = response.data;
    return {
      message: "User registration successful!",
      status: "success",
      ApiData,
    };
  } catch (error) {
    //console.log(error)
    return {
      message: error,
      status: "error",
    };
  }
}
