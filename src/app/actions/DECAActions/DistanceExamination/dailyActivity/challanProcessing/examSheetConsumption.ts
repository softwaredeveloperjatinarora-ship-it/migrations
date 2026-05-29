"use server"
import axios from 'axios';
import { getServerSession } from "next-auth";
import { authOptions } from '@/utils/authOptions';
import https from 'https';
import urls from "@/app/url";

export async function getExamSheetConsumption(formfields: string) {

    const session = await getServerSession(authOptions);

    if (!session?.user?.token) {
        throw new Error("Token is undefined");
    }

    const agent = new https.Agent({
        rejectUnauthorized: false,
    });


    let requestBody = {
        data: formfields
    }

    try {
        const response = await axios.post(`${urls.baseurl}/DistanceExamination/ExamSheetconsumption`,
            requestBody,
            {
                headers: {
                    'Authorization': `Bearer ${session?.user?.token}`,
                    'Content-Type': 'application/json',
                },
                httpsAgent: agent,
            });

        if (response.status === 200) {
            return {
                status: true,
                data: response.data,
            };
        }
    }
    catch (error: any) {
        console.error('Error in Exam sheet consumption:', error);

        let errorDetails = {};

        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
            errorDetails = {
                responseData: error.response.data,
                status: error.response.status
            };
        }

        const errorMessage = error.response?.data?.message ||
            error.message ||
            'Error in Exam sheet consumption';

        return {
            message: errorMessage,
            status: 'error',
            debug: {
                error: errorDetails,
                requestSent: formfields
            }
        };
    }
}

// {
//     "EDate": "2025-03-19",
//     "CenterNo":"501",
//     "SheetType":"theory"
// }