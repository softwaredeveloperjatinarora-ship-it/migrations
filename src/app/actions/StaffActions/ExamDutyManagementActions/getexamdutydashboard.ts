"use server";
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import {
  decryptDataforResponse,
  encryptData,
} from "@/app/api/services/auth/Encrptdecrpt";
import https from "https";
import urls from "@/app/url";



export async function getExamDutyTypesAction(selectedDate: string) {
  const session = await getServerSession(authOptions);


  const agent = new https.Agent({
    rejectUnauthorized: false, // Disable SSL certificate validation
  });
 

  let requestBody = {
     ExamHeldDate:selectedDate
  };

 console.log('Url is',urls);
 console.log(`${urls.basewebapiurl}/ExaminationPaper/GetExamDutyTypes`);
  
  try {
    const response = await axios.post(
      `${urls.basewebapiurl}/ExaminationPaper/GetExamDutyTypes `,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`, // Authorization header with bearer token
          "Content-Type": "application/json", // Content type is JSON
        },
        httpsAgent: agent, // Disable SSL certificate verification
      }
    );

    const ApiData = response.data;
    console.log('API Data is',ApiData);
 
    return {
      message: "ExamDuty data fetched successfully",
      status: "success",
      ApiData, // Return the decrypted data
    };
  } catch (error: unknown) {

    let errorMessage = "An unknown error occurred";

    if (error instanceof Error) {
        errorMessage = error.message;
    } else if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message || "API request failed";
    }
    return {
        message: errorMessage,
        status: "error",
    };
}
}
export async function getExamDutyManagementAction(selectedDate: string) {
  const session = await getServerSession(authOptions);


  const agent = new https.Agent({
    rejectUnauthorized: false, // Disable SSL certificate validation
  });

//   const formfields = {
  
//   };

//   if (!session?.user?.token) {
//     throw new Error("Token is undefined");
//   }
//   let splitValue = session.user.token.split("NEXT2121ANG");
//   const credentialsJson = JSON.stringify(formfields);

//   // Encrypt the data
//   const { Data } = encryptData(credentialsJson, splitValue[1]);

  let requestBody = {
     ExamHeldDate:selectedDate
  };

 
  try {
    const response = await axios.post(
      `${urls.basewebapiurl}/ExaminationPaper/GetExamDutyTimeSlot `,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`, // Authorization header with bearer token
          "Content-Type": "application/json", // Content type is JSON
        },
        httpsAgent: agent, // Disable SSL certificate verification
      }
    );

    const ApiData = response.data;
 
    return {
      message: "ExamDuty data fetched successfully",
      status: "success",
      ApiData, // Return the decrypted data
    };
  } catch (error: unknown) {

    let errorMessage = "An unknown error occurred";

    if (error instanceof Error) {
        errorMessage = error.message;
    } else if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message || "API request failed";
    }
    return {
        message: errorMessage,
        status: "error",
    };
}
}

export async function getExamDutyTrendsAction(payload:any) {
  const session = await getServerSession(authOptions);


  const agent = new https.Agent({
    rejectUnauthorized: false, // Disable SSL certificate validation
  });
 
 
 
  try {
    const response = await axios.post(
      `${urls.basewebapiurl}/ExaminationPaper/GetExamDutyTrends `,
      payload,
      {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`, // Authorization header with bearer token
          "Content-Type": "application/json", // Content type is JSON
        },
        httpsAgent: agent, // Disable SSL certificate verification
      }
    );

    const ApiData = response.data;
 
    return {
      message: "ExamDuty data fetched successfully",
      status: "success",
      ApiData, // Return the decrypted data
    };
  } catch (error: unknown) {

    let errorMessage = "An unknown error occurred";

    if (error instanceof Error) {
        errorMessage = error.message;
    } else if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message || "API request failed";
    }
    return {
        message: errorMessage,
        status: "error",
    };
}
}




export async function GetExamDutyDistributionAction(payload:any) {
  const session = await getServerSession(authOptions);


  const agent = new https.Agent({
    rejectUnauthorized: false, // Disable SSL certificate validation
  });
 
 
 
  try {
    const response = await axios.post(
      `${urls.basewebapiurl}/ExaminationPaper/GetExamDutyTypeDistribution `,
      payload,
      {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`, // Authorization header with bearer token
          "Content-Type": "application/json", // Content type is JSON
        },
        httpsAgent: agent, // Disable SSL certificate verification
      }
    );

    const ApiData = response.data;
 
    return {
      message: "Duty Type Distribution data fetched successfully",
      status: "success",
      ApiData, // Return the decrypted data
    };
  } catch (error: unknown) {

    let errorMessage = "An unknown error occurred";

    if (error instanceof Error) {
        errorMessage = error.message;
    } else if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message || "API request failed";
    }
    return {
        message: errorMessage,
        status: "error",
    };
}
}

export async function GetExamDutyRoomAnswersheetsAction(payload:any) {
  const session = await getServerSession(authOptions);


  const agent = new https.Agent({
    rejectUnauthorized: false, // Disable SSL certificate validation
  });
 
 
 
  try {
    const response = await axios.post(
      `${urls.basewebapiurl}/ExaminationPaper/GetExamDutyRoomAnswersheets `,
      payload,
      {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`, // Authorization header with bearer token
          "Content-Type": "application/json", // Content type is JSON
        },
        httpsAgent: agent, // Disable SSL certificate verification
      }
    );

    const ApiData = response.data;
 
    return {
      message: "Room Detail with Answer Sheets data fetched successfully",
      status: "success",
      ApiData, // Return the decrypted data
    };
  } catch (error: unknown) {

    let errorMessage = "An unknown error occurred";

    if (error instanceof Error) {
        errorMessage = error.message;
    } else if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message || "API request failed";
    }
    return {
        message: errorMessage,
        status: "error",
    };
}
}


export async function getExamDutyCenterDetailAction(payload:any) {
  const session = await getServerSession(authOptions);


  const agent = new https.Agent({
    rejectUnauthorized: false, // Disable SSL certificate validation
  });
 
 
 
  try {
    const response = await axios.post(
      `${urls.basewebapiurl}/ExaminationPaper/GetExamDutyCenterWiseDetail `,
      payload,
      {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`, // Authorization header with bearer token
          "Content-Type": "application/json", // Content type is JSON
        },
        httpsAgent: agent, // Disable SSL certificate verification
      }
    );

    const ApiData = response.data;
 
    return {
      message: "ExamDuty data fetched successfully",
      status: "success",
      ApiData, // Return the decrypted data
    };
  } catch (error: unknown) {

    let errorMessage = "An unknown error occurred";

    if (error instanceof Error) {
        errorMessage = error.message;
    } else if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message || "API request failed";
    }
    return {
        message: errorMessage,
        status: "error",
    };
}
}


export async function getExamDutyCenterRoomsListAction(payload:any) {
  const session = await getServerSession(authOptions);


  const agent = new https.Agent({
    rejectUnauthorized: false, // Disable SSL certificate validation
  });
 
 
 
  try {
    const response = await axios.post(
      `${urls.basewebapiurl}/ExaminationPaper/GetExamDutyCenterRoomList `,
      payload,
      {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`, // Authorization header with bearer token
          "Content-Type": "application/json", // Content type is JSON
        },
        httpsAgent: agent, // Disable SSL certificate verification
      }
    );

    const ApiData = response.data;
 
    return {
      message: "ExamDuty data fetched successfully",
      status: "success",
      ApiData, // Return the decrypted data
    };
  } catch (error: unknown) {

    let errorMessage = "An unknown error occurred";

    if (error instanceof Error) {
        errorMessage = error.message;
    } else if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message || "API request failed";
    }
    return {
        message: errorMessage,
        status: "error",
    };
}
}



export async function getExamDutyCenterUMCCasesListAction(payload:any) {
  const session = await getServerSession(authOptions);


  const agent = new https.Agent({
    rejectUnauthorized: false, // Disable SSL certificate validation
  });
 
 
 
  try {
    const response = await axios.post(
      `${urls.basewebapiurl}/ExaminationPaper/GetExamDutyUMCCases `,
      payload,
      {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`, // Authorization header with bearer token
          "Content-Type": "application/json", // Content type is JSON
        },
        httpsAgent: agent, // Disable SSL certificate verification
      }
    );

    const ApiData = response.data;
 
    return {
      message: "ExamDuty data fetched successfully",
      status: "success",
      ApiData, // Return the decrypted data
    };
  } catch (error: unknown) {

    let errorMessage = "An unknown error occurred";

    if (error instanceof Error) {
        errorMessage = error.message;
    } else if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message || "API request failed";
    }
    return {
        message: errorMessage,
        status: "error",
    };
}
}


