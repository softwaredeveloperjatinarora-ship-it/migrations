"use server"
import axios from 'axios';
import { getServerSession } from "next-auth";
import { authOptions } from '@/utils/authOptions';
import https from 'https';
import urls from "@/app/url";

export async function getstudentAction(formData: FormData) {
    const session = await getServerSession(authOptions);

    const agent = new https.Agent({
        rejectUnauthorized: false, // Disable SSL certificate validation
    });

    // Extract the encrypted data from FormData
    const encryptedData = formData.get('data') as string;

    if (!encryptedData) {
        return {
            message: 'No encrypted data provided.',
            status: 'error',
        };
    }

    // Prepare request body with encrypted data
    let requestBody = {
        data: encryptedData
    };
    try {
        // Production API call
        const response = await axios.post(`${urls.baseurl}/DistanceExamination/Getmaterial`,

            requestBody,
            {
                headers: {
                    'Authorization': `Bearer ${session?.user?.token}`,
                    'Content-Type': 'application/json',
                },
                httpsAgent: agent,
            }
        );

        // Return the encrypted response data to be decrypted on client side
        const ApiData = response.data;
        console.log("getmater",ApiData )
    if (response.status === 200) {
        return {
            message: 'Data fetched successfully!',
            status: 'success',
            encryptedData: ApiData
        };
    }
    } catch (error) {
        console.error('Error fetching API:', error);
        return {
            message: 'Data fetch failed.',
            status: 'error',
        };
    }
}