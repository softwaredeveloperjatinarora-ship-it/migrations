'use server';

import axios from 'axios';
import https from 'https';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';

export async function getArchitectureDrawingFollowup(projectId: string) {
  const session = await getServerSession(authOptions);
  const token = session?.user?.token;

  const agent = new https.Agent({ rejectUnauthorized: false });

  try {
    // /api/PlanningBridge/GetArchitectureDrawingFollowup
    const baseUrl = process.env.NEXT_PUBLIC_WEBAPI_URL_PROD;
    const fullUrl = `${baseUrl}/PlanningBridge/GetArchitectureDrawingFollowup?projectId=${encodeURIComponent(projectId)}`;
    const response = await axios.post(fullUrl, null, {
      headers: { Authorization: `Bearer ${token}` },
      httpsAgent: agent,
    });
    return { message: 'Messages fetched successfully', status: 'success', ApiData: response.data };
  } catch (error: unknown) {
    const msg = axios.isAxiosError(error)
      ? error.response?.data?.message || error.message
      : error instanceof Error
        ? error.message
        : 'Unknown error';
    return { message: msg, status: 'error' };
  }
}
