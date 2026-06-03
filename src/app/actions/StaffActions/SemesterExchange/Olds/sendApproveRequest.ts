'use server';

/**
 * POST Action: sendApproveRequest
 * Endpoint: /SemesterExchangeStudent/ApproveStudent
 * Accepts or disapproves a student application.
 *
 * @param registrationNo  - Student registration number
 * @param action          - 'Accept' | 'Disapprove'
 * @param approvalRemarks - Required when action = 'Disapprove'
 *
 * Success condition: response.data.item1[0].msg === 'Approved'
 */

import axios from 'axios';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import https from 'https';
import urls from '@/app/url';

export async function sendApproveRequest(
  registrationNo: string,
  action: 'Accept' | 'Disapprove',
  approvalRemarks?: string,
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.token) {
    throw new Error('Token is undefined');
  }

  const agent = new https.Agent({ rejectUnauthorized: false });
 const token = session?.user?.token;
//  const TOKEN = process.env.TOKEN;
  const formData = new FormData();
  formData.append('RegistrationNo', registrationNo);
  formData.append('Action', action);
  if (approvalRemarks) {
    formData.append('ApprovalRemarks', approvalRemarks);
  }

  try {
    const response = await axios.post(
      `${urls.basewebapiurl}/SemesterExchangeStudentBridge/ApproveStudent`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          // Authorization: `Bearer ${TOKEN}`,
        },
        httpsAgent: agent,
      },
    );

    return {
      message: 'Request processed successfully',
      status: 'success',
      ApiData: response.data,
    };
  } catch (error: unknown) {
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (axios.isAxiosError(error)) {
      errorMessage =
        error.response?.data?.message || error.message || 'API request failed';
    }
    return { message: errorMessage, status: 'error' };
  }
}
