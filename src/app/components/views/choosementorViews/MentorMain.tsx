'use client';
import React, { useEffect } from 'react';
import { Typography, Box, Card, Alert } from '@mui/material';
import { getGetCurrentMentorData } from '@/app/actions/MentorChooseAction/getMentorDetailAction';
import Loading from '@/app/loading';
import { MentorDetailsProps } from '@/app/api/interfaces/studentdashboard/MentorInterFace';
import MentorDetails from '@/app/components/views/choosementorViews/MentorDetails';
import AllMentors from '@/app/components/views/choosementorViews/AllMentors';
 
import { decryptDataforResponse } from '@/app/api/services/auth/Encrptdecrpt';
import { useSession } from 'next-auth/react';
import Breadcrumb from '@/app/dashboard/staff/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';

const BCrumb = [
    {
        to: "/dashboard",
        title: "Home",
        icon: "ic:baseline-home"
    },
    {
        title: "Choose Mentor",
    },
];



const StudentMentorPreferencePage = () => {
    const [mentorDetailsData, setMentorDetailsData] = React.useState<MentorDetailsProps>({
        Mentoruid: '',
        dept_name: '',
        MentorName: '',
        School: '',
        Picture: '',
        PreferenceOne: '',
        PreferenceTwo: '',
        PreferenceThree: '',
        headline: '',
        SeatLeft: '',
        CheakAcess: ''
    });
    const [showMentorDetails, setShowMentorDetails] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const { data: session } = useSession();



    useEffect(() => {
        const fetchpreferenceData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getGetCurrentMentorData();

                if (response.status === "success") {
                    let splitValue = String(session?.user?.token).split("NEXT2121ANG");
                    const decryptedData = decryptDataforResponse(
                        response.ApiData,
                        splitValue[1]
                    );

                    const parsed = JSON.parse(decryptedData);
                    if (!parsed) {
                        throw new Error('Failed to fetch mentor details. No data received.');
                    }
                    // console.log("current",parsed[0])

                    setMentorDetailsData(parsed[0]);


                    //   onDataFetched?.(parsed); // ✅ Use directly if it's a function
                } else {
                    setError(response.message);
                }
            } catch (err) {
                console.log("Error fetching mentor data:", err);
                setError(err instanceof Error ? err.message : "Failed to load mentor data");



            } finally {
                setLoading(false);
            }
        };

        fetchpreferenceData();
    }, []);


    if (loading) {
        return <Loading />;
    }

    if (error) {
        return (
            <Box >
                <Breadcrumb title="Choose Mentor" items={BCrumb} titleIcon="hugeicons:mentoring" />
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
                <Typography>
                    Unable to load mentor details. Please try again later or contact support.
                </Typography>
            </Box>
        );
    }

    return (
        <Box >

            <Breadcrumb title="Choose Mentor" items={BCrumb} titleIcon="hugeicons:mentoring" />
            <Card>
                {mentorDetailsData.CheakAcess !== 'not applicable' ? (
                    !showMentorDetails ? (
                        <MentorDetails
                            {...mentorDetailsData}
                            setShowMentorDetails={setShowMentorDetails}
                            isallowSelection={mentorDetailsData.CheakAcess}
                        />
                    ) : (
                        <AllMentors isallowSelection={mentorDetailsData.CheakAcess || ''} />
                    )
                ) : (
                    <Box>
                        <Alert severity="info" sx={{ mb: 2 }}>
                            Access Restricted
                        </Alert>
                        <Typography>This interface is not supported for you</Typography>
                    </Box>
                )}
            </Card>
        </Box>

    );
};

export default StudentMentorPreferencePage;