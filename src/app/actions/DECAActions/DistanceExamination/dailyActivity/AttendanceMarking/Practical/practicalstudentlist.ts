"use server"
import axios from 'axios';
import { getServerSession } from "next-auth";
import { authOptions } from '@/utils/authOptions';
import https from 'https';
import urls from "@/app/url";


export async function practicalstudentlist(formfields: any) {

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

    let requestBody = {
        data: formfields
    }

    try {
        const response = await axios.post(`${urls.baseurl}/DistanceExamination/GetPracticalStudentListing`,
            requestBody,
            {
                headers: {
                    'Authorization': `Bearer ${session?.user?.token}`,
                    'Content-Type': 'application/json',
                },
                httpsAgent: agent
            })
          if (response.status === 200) {
            return {
                status: true,
                data: response.data,
            };
        }


    } catch (error: any) {
        console.error('Failed to consume sheets', error);

        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        }

        const errorMessage = error.response?.data?.message ||
            error.message ||
            'Failed to consume sheets';

        return {
            message: errorMessage,
            status: 'error',
            error: error.response?.data || error.message
        };
    }
}