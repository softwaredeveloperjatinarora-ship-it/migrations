"use server";
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import https from "https";
import urls from "@/app/url";

export async function getStudentProfileData(formfields: any) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.token) {
        return {
            status: "error",
            message: "Authentication failed. Please log in again.",
        };
    }

    const agent = new https.Agent({
        rejectUnauthorized: false,
    });

    const requestBody = {
        data: formfields,
    };

    try {
        const response = await axios.post( `${urls.baseurl}/DistanceExamination/DEGetStudentInfo`,
            requestBody,
            {
                headers: {
                    Authorization: `Bearer ${session.user?.token}`,
                    "Content-Type": "application/json",
                },
                httpsAgent: agent,
            }
        );

        if (!response?.data) {
            return {
                status: "error",
                message: "No student found.",
                data: null,
            };
        }

           if (response.status === 200) {
            return {
                status: true,
                data: response.data,
            };
        }
    } catch (error: any) {
        console.error("Failed to fetch student profile data", error);

        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
            console.error("Response headers:", error.response.headers);
        }

        const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch student profile data";

        return {
            status: "error",
            message: errorMessage,
            error: error.response?.data || error.message,
        };
    }
}
