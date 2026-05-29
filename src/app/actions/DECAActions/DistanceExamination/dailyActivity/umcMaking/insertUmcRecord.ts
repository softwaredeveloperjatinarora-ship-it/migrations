"use server"
import axios from 'axios';
import { getServerSession } from "next-auth";
import { authOptions } from '@/utils/authOptions';
import https from 'https';
import urls from "@/app/url";

export async function insertUmcRecord(formfields: string) {

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
        const response = await axios.post(`${urls.baseurl}/DistanceExamination/PunchUmcRecord `,
            requestBody,
            {
                headers: {
                    'Authorization': `Bearer ${session?.user?.token}`,
                    'Content-Type': 'application/json',
                },
                httpsAgent: agent,
            });
        console.log("response", response.data)
        return response.data
        // return {
        //     status: true,
        //     data: response.data,
        // };

    }
    catch (error: any) {
        console.error('Error in inserting umc records', error);

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
            'server error in inserting umc records';

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
//     "RegdNo":"22400010267",
//     "CourseCode":"CSE111",
//     "TermId":"24252",
//     "UmcReason":"Testing",
//     "SheetNo":"123",
//     "NewSheetNo": "225",
//     "UmcMarkedBy": "501",
//     "ExamType":"5",
//     "UmcCaughtBy":"28388",
//     "PrintedSlips":1,
//     "HandwrittenSlips":2,
//     "UmcRemarks":"Testing"
// }