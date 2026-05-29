"use server";
import axios from 'axios';
import { getServerSession } from "next-auth";
import { authOptions } from '@/utils/authOptions';
import https from 'https';
import urls from '@/app/url';

export async function DownloadSupportingDocument(folderpath: string, filename: string) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.token) {
    return {
      message: 'Authentication failed. Please log in again.',
      status: 'error',
    };
  }
  
  const agent = new https.Agent({
    rejectUnauthorized: false,
  });

  try {
    const fullUrl = `${urls.basewebapiurl}/PlacementBridge/DownloadAFileFromFTP?folderpath=${encodeURIComponent(folderpath)}&filename=${encodeURIComponent(filename)}`;
    console.log("Download URL:", fullUrl);
    
    const response = await axios.get(
      fullUrl,
      {
        headers: {
          'Authorization': `Bearer ${session?.user?.token}`,
          'Content-Type': 'application/json',
        },
        httpsAgent: agent,
        responseType: "arraybuffer", 
      }
    );

    const buffer = Buffer.from(response.data as ArrayBuffer);
    const base64 = buffer.toString("base64");
    const mime = response.headers["content-type"] || guessMimeFromFilename(filename) || "application/octet-stream";
    
    return {
      status: "ok",
      filename,
      mime,
      base64,
    };
  } catch (error: any) {
    console.error("Download error:", error);
    return {
      message: error.response?.statusText || error.message || "Server error",
      status: "error",
      error: error.response?.status || error.message,
    };
  }
}

function guessMimeFromFilename(filename: string = "") {
  if (filename.endsWith(".pdf")) return "application/pdf";
  if (filename.match(/\.(jpe?g|jpg)$/i)) return "image/jpeg";
  if (filename.endsWith(".png")) return "image/png";
  if (filename.endsWith(".zip")) return "application/zip";
  if (filename.endsWith(".rar")) return "application/vnd.rar";
  return null;
}
