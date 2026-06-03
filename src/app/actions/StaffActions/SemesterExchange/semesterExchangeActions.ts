"use server";

import axios, { AxiosRequestConfig } from "axios";
import https from "https";
import { getServerSession } from "next-auth";
import urls from "@/app/url";
import { authOptions } from "@/utils/authOptions";
import type {
  ApiActionResult,
  SemesterExchangeApplication,
  SemesterExchangeRemark,
  SemesterExchangeUniversity,
} from "@/app/api/interfaces/semesterExchange/interfaces";

const DEFAULT_PROJECTS_API = "https://projectsapi.lpu.in";
const TEMP_API_TOKEN = process.env.TEMP_PROJECTS_API_TOKEN || "efbe6b124c61d4c4f200554ae79360ca0373908d0fb073fd546813daa1e64e08255e940af97296a1d8e4779f9be38dcd6c302054c6414fb5e525da20f2d0fee63958d261ed8eecb7aa6342b907fe1c0f7ab7b1d6bbbcc30097895b1da18fb91cd8fbcc3f1f60157b0902734c51494c83c46e554ed43d75c7e6ab4bf5a403462842539b4a40eb451c716ea3230e5706c4df7d15aeb07b78ef8b9ca7e2f2c71c2079c83f78dc704afb725097fe939afa72f52500debb65efc694153a77273dd227d19a36910be617f9e21f15e380272b900d39199d5a1194dd5120047622b42d3804cde0ae43cc0e03398e06e9074ef0fe220280423326bd11a04c6b84169d0f553e81ba6433e697bf87605059916fd7dceddc57526df4c4098494869728b141108f3c9dbf39f0cf83d71ba60075339826fc458d78d32665440bf253558955e9358656748c1f42ff8e99bc28bb0de1fa3e143c1b2ab3e56436648621e4e754783a3f871c765d9f23f459343e949ec433d9e085a1ca3b2741cc9cbbe2adb3a808046602d015c931c7a6db0860f5b8caac7996a89790c20b32b1a3be09613c569e22eb74b240a4ca39816ff9c5a012debf0c6b0ee9c2c553337711f642548a921741dd193a30243525d49c145a9b52b672a12ccd876d118ee7c6fe1bc010d7395ff2df2f7b86459e6706c3541fe8de6adf0de7bdac09afa321ba7eef32e652a5ef54194f17a567c581a53f05ed55038b30da1e0011c945b690e3f841d948a75bd36d568f541cbff078d53be697a2558abed66f8f836ecba28d8fd527b415cb9b06016359d92f8cf291b9b0f4118a9a0c53767099cb3644b83f05447b250e72bcc941a68e48b638c4dd1aa8c7784700e2130441ddcd83a65f683c22878635bd83721be893999c2138b588ee040f5ddf9379dbb3fd8fb13e972809bfec378a9c3fed34";
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

type QueryValue = string | number | boolean | null | undefined;
type QueryParams = Record<string, QueryValue>;

function getBaseUrl() {
  return (urls.basewebapiurl || urls.baseurl || DEFAULT_PROJECTS_API).replace(/\/$/, "");
}

function buildUrl(path: string, params?: QueryParams) {
  const cleanPath = path
    .replace(/^\/+/, "")
    .replace(/SemesterExchangeStudentBridge\s+\//g, "SemesterExchangeStudentBridge/");
  const target = new URL(`${getBaseUrl()}/${cleanPath}`);

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") target.searchParams.set(key, String(value));
  });

  return target.toString();
}

async function authHeaders(isFormData = false) {
  const session = await getServerSession(authOptions);
  const token = TEMP_API_TOKEN || session?.user?.token;

  if (!token) {
    throw new Error("Token is undefined");
  }

  return {
    Authorization: `Bearer ${token}`,
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
  };
}

function toActionError<T = unknown>(error: unknown): ApiActionResult<T> {
  let errorMessage = "An unknown error occurred";

  if (axios.isAxiosError(error)) {
    errorMessage = error.response?.data?.message || error.response?.data?.title || error.message || "API request failed";
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return { message: errorMessage, status: "error" };
}

async function semesterExchangeRequest<T>(config: AxiosRequestConfig, successMessage: string): Promise<ApiActionResult<T>> {
  try {
    const response = await axios.request<T>({ ...config, httpsAgent });
    return { message: successMessage, status: "success", ApiData: response.data };
  } catch (error) {
    return toActionError<T>(error);
  }
}

async function get<T>(path: string, params?: QueryParams, message = "Data fetched successfully") {
  return semesterExchangeRequest<T>({ method: "GET", url: buildUrl(path, params), headers: await authHeaders() }, message);
}

async function post<T>(path: string, data: unknown, isFormData = false, message = "Data saved successfully") {
  return semesterExchangeRequest<T>({ method: "POST", url: buildUrl(path), data, headers: await authHeaders(isFormData) }, message);
}

export async function getSemesterExchangeFolderUrlAction() {
  return "https://files.lpu.in/umsweb/webftp/DIA/SemesterExchangedocuments/";
}

export async function getStudentByIdAction() {
  return get("api/SemesterExchangeStudentBridge/GetStudentById");
}

export async function getAllApplicationDetailsAction() {
  return get<SemesterExchangeApplication[]>("api/SemesterExchangeStudentBridge/GetAllApplicationDetails");
}

export async function getIdWiseDocumentsAction(applicationId: number, regNo: string) {
  return get("api/SemesterExchangeStudentBridge/GetIdWiseDocuments", { ApplicationId: applicationId, RegNo: regNo });
}

export async function getPendingListsAction(applicationId: number) {
  return get("api/SemesterExchangeStudentBridge/GetPendingUploadList", { ApplicationId: applicationId });
}

export async function getStatusCheckListDocumentsAction(applicationId: number) {
  return get("api/SemesterExchangeStudentBridge/GetStatusCheckListDocuments", { ApplicationId: applicationId });
}

export async function getIdWiseUploadedDocumentsStatusAction(applicationId: number, regNo: string) {
  return get("api/SemesterExchangeStudentBridge/GetIdWiseUploadedDocumentsStatus", { ApplicationId: applicationId, RegNo: regNo });
}

export async function getCheckListDocumentsAction() {
  return get("api/SemesterExchangeStudentBridge/GetCheckListDocuments");
}

export async function getAllCheckListDocsAction() {
  return get("api/SemesterExchangeStudentBridge/GetAllCheckListDocs");
}

export async function getCheckListDocsAction(applicationId: number, regNo: string) {
  return get("api/SemesterExchangeStudentBridge/GetAllUploadedCheckListDocuments", { ApplicationId: applicationId, RegNo: regNo });
}

export async function getIdWiseUploadedDocumentListAction(applicationId: number, docName: string) {
  return get("api/SemesterExchangeStudentBridge/GetIdWiseUploadedDocumentList", { ApplicationId: applicationId, docName });
}

export async function getUniversityDetailsAction() {
  return get<SemesterExchangeUniversity[]>("api/SemesterExchangeStudentBridge/GetAllUniversityDetails");
}

export async function addStudentEntryForApprovalAction(data: unknown) {
  return post("api/SemesterExchangeStudentBridge/CreateSemesterExchangeStudentBridge Data", data);
}

export async function addUniversityAction(data: unknown) {
  return post("api/SemesterExchangeStudentBridge/CreateUniversityData", data);
}

export async function addSECheckListDocumentsAction(data: FormData) {
  return post("api/SemesterExchangeStudentBridge/SemesterExchangeCheckListDocumentInsert", data, true);
}

export async function uploadInterviewDocumentsAction(data: FormData) {
  return post("api/SemesterExchangeStudentBridge/SemesterExchangeUploadInterviewSchedule", data, true);
}

export async function uploadCourseMappingAction(data: FormData) {
  return post("api/SemesterExchangeStudentBridge/SemesterExchangeUploadCourseMapping", data, true);
}

export async function approveCheckListDocumentAction(data: FormData) {
  return post("api/SemesterExchangeStudentBridge/ApproveCheckListDocument", data, true);
}

export async function changeStatusCheckListDocAction(data: FormData) {
  return post("api/SemesterExchangeStudentBridge/ChangeStatusCheckListDoc", data, true);
}

export async function createUniversityUsingExcelSheetAction(data: unknown) {
  return post("api/SemesterExchangeStudentBridge/CreateUniversityUsingExcelSheet", data);
}

export async function deleteUniversityRecordAction(data: unknown) {
  return post("api/SemesterExchangeStudentBridge/DeleteUniversityData", data);
}

export async function updateUniversityAction(data: unknown) {
  return post("api/SemesterExchangeStudentBridge/UpdateUniversityData", data);
}

export async function uploadInterviewDocumentTwoAction(data: FormData) {
  return post("api/SemesterExchangeStudentBridge/SemesterExchangeUploadInterviewSchedule2", data, true);
}

export async function getStudentDetailsWithMarksAction(regdno: string) {
  return get("api/SemesterExchangeStudentBridge/GetStudentResultWithGrades", { regdno });
}

export async function getApplicationDetailsByIdAction(registrationNo: string) {
  return get<SemesterExchangeApplication>("api/SemesterExchangeStudentBridge/GetStudentApplicationDetails", { RegistrationNo: registrationNo });
}

export async function semesterExchangeNewRegistrationFormAction(data: FormData) {
  return post("api/SemesterExchangeStudentBridge/SemesterExchangeNewRegistration", data, true);
}

export async function getStudentDetailsByIdAction(registrationNo: string) {
  return get("api/SemesterExchangeStudentBridge/GetStudentDetailsById", { RegistrationNo: registrationNo });
}

export async function updateApplicationDetailsAction(data: FormData) {
  return post("api/SemesterExchangeStudentBridge/UpdateSemesterExchangeStudentBridge Details", data, true);
}

export async function getAllApplicationsAction() {
  return get<SemesterExchangeApplication[]>("api/SemesterExchangeStudentBridge/AllSemesterExchangeApplication");
}

export async function sendApproveRequestAction(data: FormData) {
  return post("api/SemesterExchangeStudentBridge/ApproveStudent", data, true);
}

export async function studentEvaluationAddNewAction(data: FormData) {
  return post("api/SemesterExchangeStudentBridge/InsertRecordSEInterviewEvaluation", data, true);
}

export async function sendForwardRequestAction(data: FormData) {
  return post("api/SemesterExchangeStudentBridge/ForwardStudenttoHOD", data, true);
}

export async function getStuDetailsWithImageAction(regNo: string) {
  return get("api/SemesterExchangeStudentBridge/GetStudentDetailsWithImage", { RegNo: regNo });
}

export async function getUniversityListsAction(programCode: string) {
  return get<SemesterExchangeUniversity[]>("api/SemesterExchangeStudentBridge/GetUniversityListforProgramCode", { ProgramCode: programCode });
}

export async function fetchAllProgramCodesListAction() {
  return get("api/SemesterExchangeStudentBridge/GetAllProgramCodesList");
}

export async function updateDocumentsAction(data: FormData) {
  return post("api/SemesterExchangeStudentBridge/UpdateSemesterExchangeDocuments", data, true);
}

export async function updateCounsellingRemarksAction(data: FormData) {
  return post("api/SemesterExchangeStudentBridge/UpdateCounsellingRemarks", data, true);
}

export async function getEvaluationRemarksAction(regNo: string) {
  return get<SemesterExchangeRemark[]>("api/SemesterExchangeStudentBridge/GetInterviewEvaluationRemarks", { RegNo: regNo });
}

export async function getAllRemarksAction() {
  return get<SemesterExchangeRemark[]>("api/SemesterExchangeStudentBridge/GetSemesterExchangeAllUserRemarks");
}

export async function getUniversitiesAction() {
  return get<SemesterExchangeUniversity[]>("api/SemesterExchangeStudentBridge/GetUniversityLists");
}

export async function getStudentAllPreviousMarksAction(registrationNo: string) {
  return get("api/SemesterExchangeStudentBridge/GetStudentPreviousMarksDetails", { RegistrationNo: registrationNo });
}


