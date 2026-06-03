'use server';

/**
 * POST Action: sendForwardRequest
 * Endpoint: /SemesterExchangeStudent/ForwardStudenttoHOD
 * Forwards a student application to HoD, HoW, or Faculty.
 *
 * @param registrationNo - Student registration number
 * @param targetUID      - Employee code of the receiving authority
 * @param userAction     - 'Hod' | 'How' | 'Faculty'
 *
 * Success condition: response.data.item1[0].msg === 'Success'
 */

import axios from 'axios';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import https from 'https';
import urls from '@/app/url';

export async function sendForwardRequest(
  registrationNo: string,
  targetUID: string,
  userAction: 'Hod' | 'How' | 'Faculty',
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.token) {
    throw new Error('Token is undefined');
  }

  const agent = new https.Agent({ rejectUnauthorized: false });
  
//  const TOKEN = process.env.TOKEN;
  const formData = new FormData();
  formData.append('RegistrationNo', registrationNo);
  formData.append('HODUID', targetUID);       // API param name kept as-is
  formData.append('UserAction', userAction);  // 'Hod' | 'How' | 'Faculty'

  try {
    const response = await axios.post(
      `${urls.basewebapiurl}/SemesterExchangeStudentBridge/ForwardStudenttoHOD`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
          // Authorization: `Bearer ${TOKEN}`,
        },
        httpsAgent: agent,
      },
    );

    return {
      message: 'Forward request sent successfully',
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
