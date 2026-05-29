'use server';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import { decryptDataforResponse, encryptData } from '@/app/api/services/auth/Encrptdecrpt';
import https from 'https';
import urls from '@/app/url';

export interface OBPInsertEstateProjectStatusRequest {
  ProjectId: number;
  GoAheaddate?: string | null;
  CompletionDate?: string | null;
  Location?: string | null;
  BlockSector?: string | null;
  Surrounding?: string | null;
  LocationRemarks?: string | null;
  StructureDrawing?: string | null;
  StructureDrawingRemarks?: string | null;
  StructureFileUpload?: string | null;
  StructureFileExt?: string | null;
  VerifyArchStructure?: string | null;
  VerifyArchStructureRemarks?: string | null;
  VerifyFileUpload?: string | null;
  VerifyFileExt?: string | null;
  CreatedBy?: string | null;
}

export async function insertEstateProjectStatus(
  estateProject: OBPInsertEstateProjectStatusRequest,
  token?: string
) {
  let sessionToken = token;

  // If no token provided, try to get from server session
  if (!sessionToken) {
    const session = await getServerSession(authOptions);
    sessionToken = session?.user?.token;
  }

  const agent = new https.Agent({
    rejectUnauthorized: false, // Disable SSL certificate validation
  });

  if (!sessionToken) {
    return {
      message: 'User not authenticated or token is missing',
      status: 'error',
    };
  }

  try {
    // Create FormData and append all fields
    const formData = new FormData();

    formData.append('ProjectId', estateProject.ProjectId.toString());

    if (estateProject.CreatedBy !== undefined && estateProject.CreatedBy !== null) {
      formData.append('CreatedBy', estateProject.CreatedBy);
    }

    if (estateProject.GoAheaddate !== undefined && estateProject.GoAheaddate !== null) {
      formData.append('GoAheaddate', estateProject.GoAheaddate);
    }

    if (estateProject.CompletionDate !== undefined && estateProject.CompletionDate !== null) {
      formData.append('CompletionDate', estateProject.CompletionDate);
    }

    if (estateProject.Location !== undefined && estateProject.Location !== null) {
      formData.append('Location', estateProject.Location);
    }

    if (estateProject.BlockSector !== undefined && estateProject.BlockSector !== null) {
      formData.append('BlockSector', estateProject.BlockSector);
    }

    if (estateProject.Surrounding !== undefined && estateProject.Surrounding !== null) {
      formData.append('Surrounding', estateProject.Surrounding);
    }

    if (estateProject.LocationRemarks !== undefined && estateProject.LocationRemarks !== null) {
      formData.append('LocationRemarks', estateProject.LocationRemarks);
    }

    if (estateProject.StructureDrawing !== undefined && estateProject.StructureDrawing !== null) {
      formData.append('StructureDrawing', estateProject.StructureDrawing);
    }

    if (
      estateProject.StructureDrawingRemarks !== undefined &&
      estateProject.StructureDrawingRemarks !== null
    ) {
      formData.append('StructureDrawingRemarks', estateProject.StructureDrawingRemarks);
    }

    // Handle file upload - send the base64 file content and extension
    if (
      estateProject.StructureFileUpload !== undefined &&
      estateProject.StructureFileUpload !== null
    ) {
      formData.append('StructureFileUpload', estateProject.StructureFileUpload);
    }

    // StructureFileExt is needed by C# API for FTP upload
    if (estateProject.StructureFileExt !== undefined && estateProject.StructureFileExt !== null) {
      formData.append('StructureFileExt', estateProject.StructureFileExt);
    }

    if (
      estateProject.VerifyArchStructure !== undefined &&
      estateProject.VerifyArchStructure !== null
    ) {
      formData.append('VerifyArchStructure', estateProject.VerifyArchStructure);
    }

    if (
      estateProject.VerifyArchStructureRemarks !== undefined &&
      estateProject.VerifyArchStructureRemarks !== null
    ) {
      formData.append('VerifyArchStructureRemarks', estateProject.VerifyArchStructureRemarks);
    }

    // Handle verification file upload - send the base64 file content and extension
    if (estateProject.VerifyFileUpload !== undefined && estateProject.VerifyFileUpload !== null) {
      formData.append('VerifyFileUpload', estateProject.VerifyFileUpload);
    }

    // VerifyFileExt is needed by C# API for FTP upload
    if (estateProject.VerifyFileExt !== undefined && estateProject.VerifyFileExt !== null) {
      formData.append('VerifyFileExt', estateProject.VerifyFileExt);
    }

    // Note: CreatedBy is set on server side from _userContext.LoginName

    const response = await axios.post(
      `${urls.basewebapiurl}/PlanningBridge/InsertEstateProjectStatus`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`, // Authorization header with bearer token
          // "Content-Type": "application/json", // Content type is multipart/form-data
          'Content-Type': 'multipart/form-data', // Content type is multipart/form-data
        },
        httpsAgent: agent, // Disable SSL certificate verification
        validateStatus: status => status < 500, // Resolve promise for status < 500
      }
    );

    // Handle non-2xx responses
    if (response.status >= 400) {
      console.error('API Error Response:', response.data);
      console.error('API Error Status:', response.status);
      return {
        message:
          typeof response.data === 'string'
            ? response.data
            : JSON.stringify(response.data) || `Server error: ${response.status}`,
        status: 'error',
        errorStatus: response.status,
        ApiData: response.data,
      };
    }

    const ApiData = response.data;
    console.log('Insert Estate Project Status API Response:', ApiData);

    // SP returns: Select 1 as status (success) or Select 0 as status (failure)
    // Response structure: { item1: [{ status: "1" }] }
    const spStatus = ApiData?.item1?.[0]?.status;
    console.log('SP status:', spStatus, '| item1:', JSON.stringify(ApiData?.item1));

    if (spStatus === '1' || spStatus === 1) {
      return {
        message: 'Estate project status inserted successfully',
        status: 'success',
        ApiData,
      };
    }

    return {
      message: 'Insertion failed. Please try again.',
      status: 'error',
      ApiData,
    };
  } catch (error: unknown) {
    let errorMessage = 'An unknown error occurred';
    let errorStatus = 0;

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (axios.isAxiosError(error)) {
      console.error('Full error response:', error.response);
      // Log detailed error information for debugging
      if (error.response) {
        console.error('Error Status:', error.response.status);
        console.error('Error Data:', error.response.data);
        console.error('Error Data Type:', typeof error.response.data);
        console.error('Error Headers:', error.response.headers);

        // Handle different response data types
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data && typeof error.response.data === 'object') {
          errorMessage =
            error.response.data.message ||
            error.response.data.error ||
            JSON.stringify(error.response.data);
        } else {
          errorMessage = error.message || 'API request failed';
        }
      } else {
        errorMessage = error.message || 'Network error occurred';
      }
      errorStatus = error.response?.status || 0;
    }
    console.error('Error in insertEstateProjectStatus:', errorMessage);
    return {
      message: errorMessage,
      status: 'error',
      errorStatus: errorStatus,
    };
  }
}
