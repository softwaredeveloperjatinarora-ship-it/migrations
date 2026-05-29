"use server";

import { authOptions } from "@/utils/authOptions";
import axios from "axios";
import { getServerSession } from "next-auth";
import https from "https";
import urls from "@/app/url";


export async function getSaveAppointmentRating(Data: string) {
    const session = await getServerSession(authOptions);
    const bearerToken = session?.user?.token;
    const agent = new https.Agent({
        rejectUnauthorized: false,
    });

    let requestBody = {
        data: Data,
    };

    try {
        const response = await axios.post(

            `${urls.baseurl}/Academic/SaveAndGetMeetingRating`,
            requestBody,
            {
                headers: {
                    Authorization: `Bearer ${bearerToken}`,
                    "Content-Type": "application/json",
                },
                httpsAgent: agent,
            }
        );

        const ApiData = response.data;

        return {
            message: "Rated successfully",
            status: "success",
            ApiData, // Return the decrypted data
            statusCode: response.status,
        };

    } catch (error) {
        return {
            statusCode: (error as any).status,
            data: null,
        };
    }
}
