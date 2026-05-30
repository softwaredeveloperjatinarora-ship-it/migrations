'use server';

/**
 * GET Action: getEvaluationRemarks
 * Endpoint: /SemesterExchangeStudent/GetEvaluationRemarks
 * Returns evaluation marks for a specific student (by registrationNo).
 * Response shape: { item1: EvaluationData[] }
 *
 * @param registrationNo - The student's registration number.
 */

import axios from 'axios';
import https from 'https';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';

export async function getEvaluationRemarks(registrationNo: string) {
  const session = await getServerSession(authOptions);
  const token = session?.user?.token;
   const TOKEN = process.env.TOKEN;
  const agent = new https.Agent({ rejectUnauthorized: false });

  try {
    const baseUrl = process.env.NEXT_PUBLIC_WEBAPI_URL_PROD;
    const fullUrl = `${baseUrl}/SemesterExchangeStudentBridge/GetEvaluationRemarks?RegistrationNo=${encodeURIComponent(registrationNo)}`;

    const response = await axios.post(fullUrl, null, {
      // headers: { Authorization: `Bearer ${token}` },
      headers: { Authorization: `Bearer ${TOKEN}` },
      httpsAgent: agent,
    });

    return {
      message: 'Evaluation remarks fetched successfully',
      status: 'success',
      ApiData: response.data,
    };
  } catch (error: unknown) {
    const msg = axios.isAxiosError(error)
      ? error.response?.data?.message || error.message
      : error instanceof Error
        ? error.message
        : 'Unknown error';
    return { message: msg, status: 'error' };
  }
}
