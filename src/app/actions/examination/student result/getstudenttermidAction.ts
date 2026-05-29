"use server"
import { encryptData } from "@/app/api/services/auth/Encrptdecrpt";
import urls from "@/app/url";
import { authOptions } from "@/utils/authOptions";
import axios from "axios";
import https from 'https';
import { console } from "inspector";
import { getServerSession } from "next-auth";



export async function getStudentTermIdAction() {
      const agent = new https.Agent({
            rejectUnauthorized: false, // Disable SSL certificate validation
          });
    const formfields = {
      Vid: 0,
    };
    const session = await getServerSession(authOptions);
    if (!session?.user?.token) {
        throw new Error("Token is undefined");
      }
    let splitValue  =session.user.token.split('NEXT2121ANG');         
    const credentialsJson = JSON.stringify(formfields); 
    //EncrytData
    const { Data } = encryptData(credentialsJson,splitValue[1]);
    let requestBody = {
        data: Data
      };
      debugger
      try {
        const response = await axios.post(`${urls.baseurl}/Examination/GetStudentTermId`,         
          
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
