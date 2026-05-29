"use server"
import { decryptDataforResponse, encryptData } from "@/app/api/services/auth/Encrptdecrpt";
import urls from "@/app/url";
import { authOptions } from "@/utils/authOptions";
import axios from "axios";
import https from 'https';
import { getServerSession } from "next-auth";

export async function getStudentSubjectiveMarkDetailAction(Data:string) {
    const session = await getServerSession(authOptions);
    const agent = new https.Agent({
            rejectUnauthorized: false, // Disable SSL certificate validation
          });

    let requestBody = {
        data: Data
      };
 
      try {
        const response = await axios.post(`${urls.baseurl}/Examination/GetStudentSubjectiveMarks`,         
          
            requestBody,
            {
                headers: {
                    'Authorization': `Bearer ${session?.user?.token}`, // Add the Bearer token from process.env
                    'Content-Type': 'application/json', // Specify the content type
                    'Cache-Control': 'no-store',  // Disable caching
                },
                httpsAgent: agent, 
            });

        // // Log the response data
        //  console.log('API Response data fetched:');
        // console.log(response);
        const ApiData =response.data;
       
        return {
            message: 'User registration successful!',
            status: 'success',
            ApiData
          
        };
    } catch (error) {
        //console.log(error)
        return {
            message: 'User registration failed.',
            status: 'error',
        };
    }
   
   
}
