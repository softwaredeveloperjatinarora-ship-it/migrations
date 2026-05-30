'use server';

/**
 * POST Action: updateCounsellingRemarks
 * Endpoint: /SemesterExchangeStudent/UpdateCounsellingRemarks
 * Saves or updates counselling remarks for a student application.
 *
 * @param registrationNo    - Student registration number
 * @param applicationId     - Application ID
 * @param counsellingRemarks - Free-text counselling remarks
 *
 * Success condition: response.data.item1[0].returnId > 0
 * Duplicate:         response.data.item1[0].returnId === -1
 */

import axios from 'axios';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import https from 'https';
import urls from '@/app/url';

export async function updateCounsellingRemarks(
  registrationNo: string,
  applicationId: string,
  counsellingRemarks: string,
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.token) {
    throw new Error('Token is undefined');
  }

  const agent = new https.Agent({ rejectUnauthorized: false });
   const TOKEN = process.env.TOKEN;
  const formData = new FormData();
  formData.append('RegistrationNo',     registrationNo);
  formData.append('ApplicationId',      applicationId);
  formData.append('CounsellingRemarks', counsellingRemarks);

  try {
    const response = await axios.post(
      `${urls.basewebapiurl}/SemesterExchangeStudentBridge/UpdateCounsellingRemarks`,
      formData,
      {
        headers: {
          // Authorization: `Bearer ${session?.user?.token}`,
          Authorization: `Bearer ${TOKEN}`,
        },
        httpsAgent: agent,
      },
    );

    return {
      message: 'Counselling remarks updated successfully',
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
