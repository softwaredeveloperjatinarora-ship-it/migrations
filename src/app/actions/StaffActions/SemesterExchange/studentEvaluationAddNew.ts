'use server';

/**
 * POST Action: studentEvaluationAddNew
 * Endpoint: /SemesterExchangeStudent/InsertRecordSEInterviewEvaluation
 * Submits interview evaluation marks for a student.
 *
 * @param registrationNo          - Student registration number
 * @param academicsMarks          - 0-100
 * @param communicationSkillsMarks - 0-100
 * @param attitudeMarks           - 0-100
 * @param extraCurricularMarks    - 0-100
 * @param knowledgeMarks          - 0-100
 * @param comments                - Optional remarks text
 * @param remarksBy               - 'HOD' | 'HOW' | 'Faculty' etc.
 *
 * Success condition: response.data.item1[0].returnData > 0
 * Duplicate upload: response.data.item1[0].returnData === '-1'
 */

import axios from 'axios';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import https from 'https';
import urls from '@/app/url';

export interface EvaluationPayload {
  registrationNo: string;
  academicsMarks: number;
  communicationSkillsMarks: number;
  attitudeMarks: number;
  extraCurricularMarks: number;
  knowledgeMarks: number;
  comments?: string;
  remarksBy: string;
}

export async function studentEvaluationAddNew(payload: EvaluationPayload) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.token) {
    throw new Error('Token is undefined');
  }

  const agent = new https.Agent({ rejectUnauthorized: false });
 const TOKEN = process.env.TOKEN;
  const totalMarks =
    payload.academicsMarks +
    payload.communicationSkillsMarks +
    payload.attitudeMarks +
    payload.extraCurricularMarks +
    payload.knowledgeMarks;

  const formData = new FormData();
  formData.append('RegistrationNo',           payload.registrationNo);
  formData.append('AcademicsMarks',           String(payload.academicsMarks));
  formData.append('CommunicationSkillsMarks', String(payload.communicationSkillsMarks));
  formData.append('AttitudeMarks',            String(payload.attitudeMarks));
  formData.append('ExtraCurricularMarks',     String(payload.extraCurricularMarks));
  formData.append('KnowledgeMarks',           String(payload.knowledgeMarks));
  formData.append('TotalMarks',               String(totalMarks));
  formData.append('Comments',                 payload.comments ?? '');
  formData.append('RemarksBy',                payload.remarksBy);

  try {
    const response = await axios.post(
      `${urls.basewebapiurl}/SemesterExchangeStudentBridge/InsertRecordSEInterviewEvaluation`,
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
      message: 'Evaluation submitted successfully',
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
