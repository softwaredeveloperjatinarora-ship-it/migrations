'use server'
import axios from '@/utils/axios';

export const getOJTAttendanceCount = async () => {
  try {
    const response = await axios.post(`http://172.18.12.25/profile/api/OJTDashboard/OJTAttendanceCount`, {
   
         OJTId: "2642"
        

    });


    // Return the message or an empty string if undefined
    return response.data; 
  } catch (error) {
    console.error("Error fetching attendance data:", error); // Log the error
    throw error;
  }
}






