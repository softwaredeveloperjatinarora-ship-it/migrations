// addPackets.ts
"use server"
import axios from 'axios';
import { getServerSession } from "next-auth";
import { authOptions } from '@/utils/authOptions';
import https from 'https';
import urls from "@/app/url";

export async function addPkts(formData: FormData) {
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
        const response = await axios.post(`${urls.baseurl}/DistanceExamination/AddPackets`,

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
                message: 'Packet added successfully!',
                status: 'success',
                success: true,
                data: response.data
            };
        }
    } catch (error) {
        console.error('Error adding packet:', error);
        return {
            message: 'Failed to add packet.',
            status: 'error',
            success: false
        };
    }
}
