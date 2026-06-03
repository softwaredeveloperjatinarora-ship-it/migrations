"use server";

import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import https from "https";
import urls from "@/app/url";

export async function getApplicationDetailsById(registrationNo: string) {
  const session = await getServerSession(authOptions);
  const token = session?.user?.token;
  // const token = process.env.TOKEN;
  if (!session?.user?.token) {
    return { status: "error", message: "Authentication failed. Please log in again." };
  }

  const agent = new https.Agent({ rejectUnauthorized: false });
  try {
    const response = await axios.get(
      `${urls.basewebapiurl}/SemesterExchangeStudentBridge/GetStudentApplicationDetails`,
      {
        params: { RegistrationNo: registrationNo },
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        httpsAgent: agent,
      },
    );
    
    return response.data.item1;
  } catch (error: any) {
    return { status: "error", message: error.response?.data?.message || error.message || "Server error" };
  }
}
