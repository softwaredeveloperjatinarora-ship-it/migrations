
// approvePackets.ts
"use server"
import axios from 'axios';
import { getServerSession } from "next-auth";
import { authOptions } from '@/utils/authOptions';
import https from 'https';

export async function aprovePkts(formData: FormData) {
    const session = await getServerSession(authOptions);

    const agent = new https.Agent({
        rejectUnauthorized: false,
    });

    // Extract the encrypted data from FormData
    const encryptedData = formData.get('data') as string;

    if (!encryptedData) {
        return {
            message: 'No encrypted data provided.',
            status: 'error',
            success: false
        };
    }

    // Prepare request body with encrypted data
    let requestBody = {
        data: encryptedData
    };


    try {
        // Production API call
        const response = await axios.post(
            'https://172.18.12.25/baseapi/api/DistanceExamination/ApprovePackets',
            requestBody,
            {
                headers: {
                    'Authorization': `Bearer ${session?.user?.token}`,
                    'Content-Type': 'application/json',
                },
                httpsAgent: agent,
            }
        );

    if (response.status === 200) {
        return {
            message: 'All packets approved successfully!',
            status: 'success',
            success: true,
            data: response.data
        };
    }
    } catch (error) {
        console.error('Error approving packets:', error);
        return {
            message: 'Failed to approve packets.',
            status: 'error',
            success: false
        };
    }
}