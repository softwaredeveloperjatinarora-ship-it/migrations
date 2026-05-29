"use server"
import axios from 'axios';
import { getServerSession } from "next-auth";
import { authOptions } from '@/utils/authOptions';
import https from 'https';
import urls from "@/app/url";

export async function updateRoomAction(formfields: any) {
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
        const response = await axios.post(`${urls.baseurl}/DistanceExamination/UpdateRoom`,
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


    } catch (error) {
        console.error('Error updating room:', error);

        if (axios.isAxiosError(error) && error.response) {
            return {
                message: error.response.data?.message || 'Failed to update room',
                status: 'error',
                error: error.response.data
            };
        }

        return {
            message: 'Failed to update room. Server error.',
            status: 'error',
        };
    }
}