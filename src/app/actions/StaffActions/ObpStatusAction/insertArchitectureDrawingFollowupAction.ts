'use server';

import axios from 'axios';
import https from 'https';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';

export interface InsertArchitectureDrawingFollowupParams {
  ProjectId: string;
  Message: string;
  SupportingDocument?: string;
  SupportingDocumentName?: string;
}

export async function insertArchitectureDrawingFollowup(
  params: InsertArchitectureDrawingFollowupParams
) {
  const session = await getServerSession(authOptions);
  const token = session?.user?.token;

  const agent = new https.Agent({ rejectUnauthorized: false });

  try {
    const formData = new FormData();
    formData.append('ProjectId', params.ProjectId);
    formData.append('Message', params.Message);
    formData.append('SupportingDocument', params.SupportingDocument ?? '');
    formData.append('SupportingDocumentName', params.SupportingDocumentName ?? '');

    const baseUrl = process.env.NEXT_PUBLIC_WEBAPI_URL_PROD;
    const fullUrl = `${baseUrl}/PlanningBridge/InsertArchitectureDrawingFollowup`;
    const response = await axios.post(fullUrl, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      httpsAgent: agent,
    });

    return { message: 'Message sent successfully', status: 'success', ApiData: response.data };
  } catch (error: unknown) {
    const msg = axios.isAxiosError(error)
      ? error.response?.data?.message || error.message
      : error instanceof Error
        ? error.message
        : 'Unknown error';
    return { message: msg, status: 'error' };
  }
}
