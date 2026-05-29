
"use server"
import axios from 'axios';
import { getServerSession } from "next-auth";
import { authOptions } from '@/utils/authOptions';
import https from 'https';
import urls from "@/app/url";

export async function deletePkts(formData: FormData) {
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
console.log(`${urls.baseurl}/DistanceExamination/Removepacket`);
    try {

        const response = await axios.post(`${urls.baseurl}/DistanceExamination/Removepacket`,

            requestBody,
            {
                headers: {
                    'Authorization': `Bearer ${session?.user?.token}`,
                    'Content-Type': 'application/json',
                },
                httpsAgent: agent,
            }
        );
        console.log("Delete Packet Response:", response);
    if (response.status === 200) {
        return {
            message: 'Packet deleted successfully!',
            status: 'success',
            success: true,
            data: response.data
        };
    }
    } catch (error) {
        console.error('Error deleting packet:', error);
        return {
            message: 'Failed to delete packet.',
            status: 'error',
            success: false
        };
    }
}
