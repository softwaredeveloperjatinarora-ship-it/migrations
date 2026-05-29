"use server";

import axios, { AxiosRequestConfig } from "axios";
import https from "https";
import { getServerSession } from "next-auth";
import urls from "@/app/url";
import { authOptions } from "@/utils/authOptions";
import type { DownloadMouFilePayload, MouActivity, MouDocument } from "@/app/api/interfaces/mouDocuments/interfaces";

const DEFAULT_PROJECTS_API = "https://projectsapi.lpu.in";
const TEMP_API_TOKEN = process.env.TEMP_PROJECTS_API_TOKEN || "efbe6b124c61d4c4f200554ae79360ca0373908d0fb073fd546813daa1e64e08255e940af97296a1d8e4779f9be38dcd6c302054c6414fb5e525da20f2d0fee63958d261ed8eecb7aa6342b907fe1c0f7ab7b1d6bbbcc30097895b1da18fb91cd8fbcc3f1f60157b0902734c51494c83c46e554ed43d75c7e6ab4bf5a403462842539b4a40eb451c716ea3230e5706c4df7d15aeb07b78ef8b9ca7e2f2c71c2079c83f78dc704afb725097fe939afa72f52500debb65efc694153a77273dd227d19a36910be617f9e21f15e380272b900d39199d5a1194dd5120047622b42d3804cde0ae43cc0e03398e06e9074ef0fe220280423326bd11a04c6b84169d0f553e81ba6433e697bf87605059916fd7dceddc57526df4c4098494869728b141108f3c9dbf39f0cf83d71ba60075339826fc458d78d32665440bf253558955e9358656748c1f42ff8e99bc28bb0de1fa3e143c1b2ab3e56436648621e4e754783a3f871c765d9f23f459343e949ec433d9e085a1ca3b2741cc9cbbe2adb3a808046602d015c931c7a6db0860f5b8caac7996a89790c20b32b1a3be09613c569e22eb74b240a4ca39816ff9c5a012debf0c6b0ee9c2c553337711f642548a921741dd193a30243525d49c145a9b52b672a12ccd876d118ee7c6fe1bc010d7395ff2df2f7b86459e6706c3541fe8de6adf0de7bdac09afa321ba7eef32e652a5ef54194f17a567c581a53f05ed55038b30da1e0011c945b690e3f841d948a75bd36d568f541cbff078d53be697a2558abed66f8f836ecba28d8fd527b415cb9b06016359d92f8cf291b9b0f4118a9a0c53767099cb3644b83f05447b250e72bcc941a68e48b638c4dd1aa8c7784700e2130441ddcd83a65f683c22878635bd83721be893999c2138b588ee040f5ddf9379dbb3fd8fb13e972809bfec378a9c3fed34";
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

type ApiActionStatus = "success" | "error";

interface ApiActionResult<T = unknown> {
  message: string;
  status: ApiActionStatus;
  ApiData?: T;
}

type QueryValue = string | number | boolean | null | undefined;
type QueryParams = Record<string, QueryValue>;

function getBaseUrl() {
  return (urls.basewebapiurl || urls.baseurl || DEFAULT_PROJECTS_API).replace(/\/$/, "");
}

function buildUrl(path: string, params?: QueryParams) {
  const target = new URL(`${getBaseUrl()}/${path.replace(/^\/+/, "")}`);

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") target.searchParams.set(key, String(value));
  });

  return target.toString();
}

async function authHeaders(isFormData = false, accept?: string) {
  const session = await getServerSession(authOptions);
  const token = TEMP_API_TOKEN || session?.user?.token;

  if (!token) {
    throw new Error("Token is undefined");
  }

  return {
    Authorization: `Bearer ${token}`,
    ...(accept ? { Accept: accept } : {}),
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

async function mouRequest<T>(config: AxiosRequestConfig, successMessage: string): Promise<ApiActionResult<T>> {
  try {
    const response = await axios.request<T>({ ...config, httpsAgent });
    return { message: successMessage, status: "success", ApiData: response.data };
  } catch (error) {
    return toActionError<T>(error);
  }
}

async function get<T>(path: string, params?: QueryParams, message = "Data fetched successfully") {
  return mouRequest<T>({ method: "GET", url: buildUrl(path, params), headers: await authHeaders() }, message);
}

async function post<T>(path: string, data: unknown, isFormData = false, message = "Data saved successfully") {
  return mouRequest<T>({ method: "POST", url: buildUrl(path), data, headers: await authHeaders(isFormData) }, message);
}

export async function getRenewedMouDetailsAction(mouId: number | string) {
  return get("api/Mou/GetRenewedMouDetails", { MouId: mouId });
}

export async function getEmployeeDetailsAction() {
  return get("api/Mou/GetEmployeeDetails");
}

export async function mouRenewalDetailsAction(data: FormData) {
  return post("api/Mou/MouRenewalInsertNewRecord", data, true);
}

export async function mouDocumentUploadAction(data: FormData) {
  return post("api/Mou/MouDocumentInsert", data, true);
}

export async function getAllUploadedDocumentsAction() {
  return get<MouDocument[]>("api/Mou/GetAllUploadedDocuments");
}

export async function approveDocumentAction(data: FormData) {
  return post("api/Mou/ApprovalAction", data, true);
}

export async function mouDocumentUpdateFileAction(data: FormData) {
  return post("api/Mou/MouDocumentUpdateFile", data, true);
}

export async function getUIDWiseUploadedDocumentsAction(uid: string) {
  return get<MouDocument[]>("api/Mou/GetUIDWiseMouDocumentDetails", { Uid: uid });
}

export async function mouActivityInsertAction(data: FormData) {
  return post("api/Mou/MouActivityInsert", data, true);
}

export async function getUIDWiseMouActivityDetailsAction(uid: string) {
  return get<MouActivity[]>("api/Mou/GetUIDWiseMouActivityDetails", { Uid: uid });
}

export async function getAllUploadedActivitiesAction() {
  return get<MouActivity[]>("api/Mou/GetAllMouActivityDetails");
}

export async function mouActivityUpdateFileAction(data: FormData) {
  return post("api/Mou/MouActivityUpdateFile", data, true);
}

export async function approveActivityAction(data: FormData) {
  return post("api/Mou/ActivityApprovalAction", data, true);
}

export async function getEmployeeDataAction() {
  return get("api/Mou/GetAllEmployeeData");
}

export async function mouDocumentsForApprovalAction(uid: string) {
  return get<MouDocument[]>("api/Mou/GetMouDocumentsforApproval", { Uid: uid });
}

export async function mouNewActivityPlanAddNewAction(data: FormData) {
  return post("api/Mou/MouNewActivityPlan", data, true);
}

export async function insertMouActivityActionTakenAction(data: FormData) {
  return post("api/Mou/MouActivityActionTakenInsert", data, true);
}

export async function mouDocumentsToTakeActionAction(uid: string) {
  return get<MouDocument[]>("api/Mou/GetMouDocumentstoTakeAction", { Uid: uid });
}

export async function mouActionsTakenDataAction(uid: string, sessionId: string | number) {
  return get("api/Mou/GetMouActivityActionTakenWithSession", { Uid: uid, SessionId: sessionId });
}

export async function approveMouActionTakenDocumentAction(data: FormData) {
  return post("api/Mou/MouActionTakenDocumentApproval", data, true);
}

export async function mouGetAllActivitiesAssignedAction(uid: string) {
  return get<MouActivity[]>("api/Mou/GetAllActivitiesAssigned", { Uid: uid });
}

export async function updateSchoolDivisionAction(data: FormData) {
  return post("api/Mou/MouUpdateSchoolInvolved", data, true);
}

export async function mouActivityAndActionDetailsAction(startDate: string, endDate: string) {
  return get("api/Mou/GetAllMouActivityAndActionDetails", { StartDate: startDate, EndDate: endDate });
}

export async function getAllMouActivitiesAction() {
  return get<MouActivity[]>("api/Mou/GetAllMouActivityCategories");
}

export async function updateMOUActionPlanMasterAction(data: FormData) {
  return post("api/Mou/MOUActionPlanMaster", data, true);
}

export async function getAllMouDocumentDetailsAction() {
  return get<MouDocument[]>("api/Mou/GetAllMouDocumentDetails");
}

export async function getMouActivityActionTakenDetailsAction(mouId: string | number) {
  return get("api/Mou/GetMouActivityActionTakenDetails", { Mouid: mouId });
}

export async function getAllMouActivitiesForAdminActionAction(sessionId: string | number) {
  return get<MouActivity[]>("api/Mou/GetAllMouActivitiesForAdminAction", { SessionId: sessionId });
}

export async function getAllMouActivitiesForExportToExcelAction(uid: string) {
  return get<MouActivity[]>("api/Mou/GetAllMouActivitiesForExportToExcel", { UID: uid });
}

export async function getMouDocumentToAssignActivityAction(uid: string) {
  return get<MouDocument[]>("api/Mou/GetMouDocumentsToAssignActivity", { Uid: uid });
}

export async function getAllOBPPlannerSessionsAction() {
  return get("api/LpuObpAutomation/GetOBPPlannerSessions");
}

export async function getAllActivitiesAssignedWithSessionAction(uid: string, sessionId: string | number) {
  return get<MouActivity[]>("api/Mou/GetAllActivitiesAssignedwithSession", { Uid: uid, SessionId: sessionId });
}

export async function getMouDocumentsToAssignActivityWithSessionAction(uid: string, sessionId: string | number) {
  return get<MouDocument[]>("api/Mou/GetMouDocumentsToAssignActivityWithSession", { Uid: uid, SessionId: sessionId });
}

export async function activityPlanUpdateUIDAction(data: FormData) {
  return post("api/Mou/MouActivityPlanUpdateUID", data, true);
}

export async function getAllActivitiesAction() {
  return get<MouActivity[]>("api/Mou/GetMouActivityProperties");
}

export async function downloadMOUFileAction(payload: DownloadMouFilePayload) {
  return mouRequest<ArrayBuffer>(
    {
      method: "POST",
      url: buildUrl("api/Mou/DownloadMOUFiles/MOUDownloadFiles"),
      data: { fileName: payload.fileName, folderPath: payload.folderPath ?? "" },
      responseType: "arraybuffer",
      headers: await authHeaders(false, "*/*"),
    },
    "File downloaded successfully",
  );
}

export async function mouReminderEmailAction(data: FormData) {
  return post("api/Mou/MouSendPendingReminderEmail", data, true);
}




