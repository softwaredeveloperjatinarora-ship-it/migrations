"use server"
import axios from 'axios';
import { getServerSession } from "next-auth";
import { authOptions } from '@/utils/authOptions';
import https from 'https';
import urls from "@/app/url";

export async function updateStaffAction(formfields: any) {

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
        const response = await axios.post(`${urls.baseurl}/DistanceExamination/UpdateStaff`,
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
            message: 'Staff updated successfully!',
            status: 'success',
            data: response.data
        };
    }
    } catch (error) {
        console.error('Error updating staff:', error);
        return {
            message: 'Failed to update staff.',
            status: 'error',
        };
    }
}