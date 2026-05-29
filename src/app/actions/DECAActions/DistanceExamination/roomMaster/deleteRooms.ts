"use server"
import axios from 'axios';
import { getServerSession } from "next-auth";
import { authOptions } from '@/utils/authOptions';
import { decryptDataforResponse, encryptData } from '@/app/api/services/auth/Encrptdecrpt';
import https from 'https';

export async function deleteRoomsAction(formData: FormData) {
    const session = await getServerSession(authOptions);
    
    const centerNo = formData.get('CenterNo');
    const roomId = formData.get('roomId');
    const empId = formData.get('empId');

    const agent = new https.Agent({
        rejectUnauthorized: false, // Disable SSL certificate validation
    });

    const formfields = {
        "CenterNo": centerNo,
        "RoomId": roomId,
        "EmpId": empId
    }

    const splitValue = session?.user?.token?.split('NEXT2121ANG');
    if (!splitValue || splitValue.length < 2) {
        throw new Error('Invalid token format');
    }
    const credentialsJson = JSON.stringify(formfields);
    
    const { Data } = encryptData(credentialsJson, splitValue[1]);
    let requestBody = {
        data: Data
    };

    try {
        const response = await axios.post('https://172.18.12.25/baseapi/api/DistanceExamination/DeleteRoom',
            requestBody,
            {
                headers: {
                    'Authorization': `Bearer ${session?.user?.token}`,
                    'Content-Type': 'application/json',
                },
                httpsAgent: agent,
            });

        let splitValue = String(session?.user?.token).split('NEXT2121ANG');
        const ApiData = response.data;
        const decryptedData = JSON.parse(decryptDataforResponse(ApiData, splitValue[1]));
        
        console.log(decryptedData);
            if (response.status === 200) {
        return {
            message: 'Room deleted successfully!',
            status: 'success',
            decryptedData
        };
    }
    } catch (error) {
        console.error('Error deleting room:', error);
        return {
            message: 'Failed to delete room.',
            status: 'error',
        };
    }
}