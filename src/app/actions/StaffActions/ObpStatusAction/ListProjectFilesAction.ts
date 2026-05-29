"use server";
import axios from 'axios';
import { getServerSession } from "next-auth";
import { authOptions } from '@/utils/authOptions';
import https from 'https';
import urls from '@/app/url';

export async function ListProjectFiles(folderpath: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.token) {
    return {
      message: 'Authentication failed. Please log in again.',
      status: 'error',
    };
  }

  const agent = new https.Agent({
    rejectUnauthorized: false,
  });

  try {
    const response = await axios.get(
      `${urls.basewebapiurl}/PlanningBridge/ListFilesInFolder?folderpath=${encodeURIComponent(folderpath)}`,
      {
        headers: {
          'Authorization': `Bearer ${session?.user?.token}`,
          'Content-Type': 'application/json',
        },
        httpsAgent: agent,
      }
    );

    return {
      status: 'success',
      files: response.data || [],
    };
  } catch (error: any) {
    console.error("List files error:", error);
    return {
      message: error.response?.statusText || error.message || "Server error",
      status: 'error',
    };
  }
}
  