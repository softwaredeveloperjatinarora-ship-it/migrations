"use client";
import { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Grid from "@mui/material/Grid";
import Image from "next/image";
import StarRateIcon from "@mui/icons-material/StarRate";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import {
    Box,
    Card,
    Stack,
    Typography,
    CardContent,
    IconButton,
    TextField,
    Button,
    Paper,
    Snackbar,
    CircularProgress,
    Skeleton,
    Autocomplete,
} from "@mui/material";
import { useTheme } from "@mui/system";
import { AppState } from "@/store/store";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { getSaveAppointmentRating } from "@/app/actions/homeAction/BookAppointment/GetSaveRating";
import { useSession } from "next-auth/react";
import { decryptDataforResponse, encryptData } from "@/app/api/services/auth/Encrptdecrpt";
import React from "react";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";

type RatingType = {
    meetingId: number;
    meetingDate: string;
    meetingType: string;
    attendanceStatus: string;
    isPresent: boolean;
    meetingWith: string;
    authority: string;
    meetingReason: string;
    rating?: number;
    feedback?: string;
    loading?: boolean;
};



const RatingComponent = () => {
    const customizer = useSelector((state: AppState) => state.customizer);
    const router = useRouter();
    const theme = useTheme();
    const { data: session } = useSession();
    const borderColor = theme.palette.divider;

    const [inputValue, setInputValue] = React.useState('');


    const [age, setAge] = React.useState('1');
    const handleChange = (event: any) => {
        setAge(event.target.value);
    };


    const [showSnackBar, setShowSnackBar] = useState({
        message: "",
        show: false,
    });
    const [meetings, setMeetings] = useState<RatingType[] | null>(null);
    const [loadingStatus, setLoadingStatus] = useState({
        loading: false,
        error: false,
        data: false,
    });
    const [fetchData, setFetchData] = useState(false);






    const [remarksArray, setRemarksArray] = useState<string[]>([]);
    const [value, setValue] = React.useState<string | null>(remarksArray[0]);



    useEffect(() => {
        (async () => {
            setLoadingStatus({ loading: true, error: false, data: false });
            const formfields = {
                Type: "GetData",
            };

            if (!session || !session.user || !session.user.token) {
                throw new Error("Session or token is missing");
            }

            let splitValue = session.user.token.split("NEXT2121ANG");
            const credentialsJson = JSON.stringify(formfields);


            const { Data } = encryptData(credentialsJson, splitValue[1]);
            const response =
                await getSaveAppointmentRating(Data);

            let apiData = response.ApiData;
            const decryptedData = decryptDataforResponse(apiData, splitValue[1]);
            const parsedData = JSON.parse(decryptedData);

          



            const predefinedRemarksString = parsedData[0]?.preDefineRemarks || "";
            const predefinedRemarksArray = predefinedRemarksString
                .split(",")
                .map((remark: string) => remark.trim()); // Trims whitespace around each remark

            setRemarksArray(predefinedRemarksArray);

          






            if (response.statusCode === 200) {
                parsedData &&
                    parsedData.forEach((ele: any) => {
                        meetings && meetings.length > 0
                            ? setMeetings((prev: any) => [
                                ...prev,
                                {
                                    ...ele,
                                    rating: 0,
                                    feedback: "",
                                    loading: false,
                                },
                            ])
                            : setMeetings((prev) => [
                                {
                                    ...ele,
                                    rating: 0,
                                    feedback: "",
                                    loading: false,
                                },
                            ]);
                    });
                setMeetings(parsedData!);
                setLoadingStatus({
                    loading: false,
                    error: false,
                    data: parsedData!.length > 0,
                });
            } else {
                if (response.statusCode === 401) {
                    router.push("/");
                } else {
                    setLoadingStatus({
                        loading: false,
                        error: true,
                        data: false,
                    });
                }
            }
        })();
    }, [fetchData]);






    function formatDate(dateString: string): string {
        if (dateString) {
            const [mm, dd, yy] = dateString.split("-");
            let meetingDate = `${dd}-${mm}-${yy}`;
            const date = new Date(meetingDate);
            return date.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
            });
        } else return "Invalid";
    }

    function handleRatingClick(rating: number, index: number) {
        let temp = [...meetings!];
        for (let i = 0; i < temp.length; i++) {
            if (temp[i].meetingId == index) temp[i].rating = rating;
        }

        setMeetings(temp);
    }

    const handleRatingSubmitClick = async (index: number) => {
        let temp = [...meetings!];
        let targetIndex = temp.findIndex(
            (meeting) => meeting.meetingId === index
        );

        if (targetIndex !== -1) {
            let target = { ...temp[targetIndex], loading: true };
            temp[targetIndex] = target;
            setMeetings(temp);
            if (
                target?.rating === 0 ||
                target?.rating === undefined ||
                target?.rating == null
            ) {
                {
                    setShowSnackBar({
                        message: "Rating is required",
                        show: true,
                    });
                    temp[targetIndex].loading = false;
                    setMeetings([...temp]);
                }
            } else if (!target.feedback?.trim()) {
                {
                    setShowSnackBar({
                        message: "Feedback is required",
                        show: true,
                    });
                    temp[targetIndex].loading = false;
                    setMeetings([...temp]);
                }
            } else {
                let { meetingId, rating, feedback } = target;
                const formfields1 = {
                    Type: "Save",
                    AppointmentId: meetingId,
                    Rating: rating,
                    StudentFeedback: feedback + (value ? " :: " + value : ""),
                };

                if (!session || !session.user || !session.user.token) {
                    throw new Error("Session or token is missing");
                }

                let splitValue = session.user.token.split("NEXT2121ANG");
                const credentialsJson1 = JSON.stringify(formfields1);


                const { Data } = encryptData(credentialsJson1, splitValue[1]);

                const response = await getSaveAppointmentRating(Data);

                if (response.statusCode === 200) {
                    meetings &&
                        setMeetings((prev: any) =>
                            prev.filter(
                                (meeting: any) => meeting.meetingId !== index
                            )
                        );
                    setShowSnackBar({
                        message: "Meeting Rating has been saved successfully",
                        show: true,
                    });
                    setFetchData(!fetchData);
                    temp[targetIndex].loading = false;
                    setMeetings([...temp]);
                } else {
                    if (response.statusCode === 401) {
                        router.push("/");
                    } else {
                        setShowSnackBar({
                            message: "Failed to save the Rating",
                            show: true,
                        });
                        temp[targetIndex].loading = false;
                        setMeetings([...temp]);
                    }
                }
            }
        }
    };
    return (
        <Stack gap={2}>
            <Typography variant="subtitle1" sx={{ textAlign: "justify" }}>
                <b> Note : </b>Dear Student, Your previous appointment request
                has been closed by the concerned authority. You are required to
                provide the feedback for the same to proceed further.
            </Typography>
            {loadingStatus.loading ? (
                <LoadingSkeleton />
            ) : loadingStatus.error ? (
                <Card
                    sx={{
                        padding: 0,
                        border: `1px solid ${borderColor}`,
                        backgroundColor: "transparent",
                        position: "relative",
                        boxShadow: `0 4px 6px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.1)`,
                    }}
                    elevation={9}
                    variant={"outlined"}
                >
                    <CardContent>
                        <Box>
                            <Typography
                                variant="h5"
                                textAlign={"center"}
                                color="error"
                            >
                                {" "}
                                Oops!! Some unexpected error occured. <br />
                                Please try again.
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            ) : loadingStatus.data ? (
                <Stack gap={2}>
                    {meetings &&
                        meetings.map((meeting, i) => (
                            <Grid
                                key={meeting.meetingId}
                                size={{
                                    lg: 4,
                                    sm: 4,
                                    xs: 12,
                                }}
                            >
                                <Card
                                    sx={{
                                        padding: 0,
                                        border: `1px solid ${borderColor}`,
                                        backgroundColor: "transparent",
                                        position: "relative",
                                        boxShadow: `0 4px 6px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.1)`,
                                    }}
                                    elevation={9}
                                    variant={"outlined"}
                                >
                                    <Image
                                        src={
                                            meeting.isPresent
                                                ? "/images/Homepageimage/top-info-shape.png"
                                                : "/images/Homepageimage/top-error-shape.png"
                                        }
                                        alt={
                                            meeting.isPresent
                                                ? "Present"
                                                : "Absent"
                                        }
                                        className="top-img"
                                        width={59}
                                        height={81}
                                    />
                                    <CardContent>
                                        <Stack gap={1}>
                                            <Stack
                                                direction={"row"}
                                                gap={2}
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Box
                                                    height="20px"
                                                    width="20px"
                                                    bgcolor={
                                                        meeting.isPresent
                                                            ? "info.main"
                                                            : "error.main"
                                                    }
                                                ></Box>
                                                <Typography
                                                    variant="body1"
                                                    fontWeight={"bold"}
                                                >
                                                    {meeting.attendanceStatus}{" "}
                                                </Typography>
                                                <Typography
                                                    variant="body1"
                                                    fontWeight={"bold"}
                                                    color="info"
                                                >
                                                    {formatDate(
                                                        meeting.meetingDate
                                                    )}
                                                </Typography>
                                            </Stack>
                                            <Stack
                                                direction={"row"}
                                                gap={1}
                                                marginTop={2}
                                            >
                                                <Box
                                                    sx={{
                                                        whiteSpace: "normal",
                                                        wordWrap: "break-word",
                                                        display: "flex",
                                                        gap: "10px",
                                                    }}
                                                >
                                                    <b> Authority Name : </b>
                                                    <Typography variant="subtitle1">
                                                        {meeting.meetingWith +
                                                            ""}
                                                    </Typography>
                                                    <span>-</span>
                                                    <Typography
                                                        variant="subtitle1"
                                                        color="primary"
                                                    >
                                                        <u>
                                                            {meeting.authority +
                                                                " "}
                                                        </u>
                                                    </Typography>
                                                </Box>
                                            </Stack>

                                            <Stack direction={"row"} gap={1}>
                                                <Typography
                                                    variant="body1"
                                                    textAlign={"justify"}
                                                >
                                                    <b
                                                        style={{
                                                            marginRight: 1,
                                                        }}
                                                    >
                                                        Purpose :
                                                    </b>
                                                    {" " +
                                                        meeting.meetingReason}
                                                </Typography>
                                            </Stack>
                                            <Stack direction={"row"} gap={1}>
                                                <Typography
                                                    variant="body1"
                                                    textAlign={"justify"}
                                                >
                                                    <b
                                                        style={{
                                                            marginRight: 1,
                                                        }}
                                                    >
                                                        Meeting Type :
                                                    </b>
                                                    {" " +
                                                        meeting.meetingType +
                                                        " Meeting"}
                                                </Typography>
                                            </Stack>
                                            <Stack
                                                // direction={"row"}
                                                // gap={1}
                                                // sx={{
                                                //     display: "flex",
                                                //     alignItems: "center",
                                                // }}

                                                direction={"row"} gap={1}
                                            >
                                                <Typography
                                                    variant="body1"
                                                    fontWeight={"bold"}
                                                >
                                                    Rate Meeting :
                                                </Typography>



                                                <Stack
                                                    direction={"row"}
                                                    gap={"4px"}
                                                >
                                                    {[1, 2, 3, 4, 5].map(
                                                        (star, index) => {
                                                            return (
                                                                <Paper
                                                                    sx={{
                                                                        bgcolor:
                                                                            "transparent",
                                                                        boxShadow: 0,
                                                                    }}
                                                                    key={index}
                                                                    onClick={() =>
                                                                        handleRatingClick(
                                                                            star,
                                                                            meeting.meetingId
                                                                        )
                                                                    }
                                                                >
                                                                    {star <=
                                                                        (meeting?.rating ??
                                                                            0) ? (
                                                                        <StarRateIcon color="primary" />
                                                                    ) : (
                                                                        <StarBorderIcon color="primary" />
                                                                    )}
                                                                </Paper>
                                                            );
                                                        }
                                                    )}
                                                </Stack>

                                            </Stack>

                                            {meeting.rating && meeting.rating <= 2 &&
                                                <Stack
                                                    direction={"row"}
                                                    gap={{ lg: 1, xs: 0 }}
                                                    sx={{
                                                        display: "flex",
                                                        // alignItems: "center",
                                                        flexDirection: { lg: "row", xs: "column" },
                                                    }}
                                                >

                                                    <Autocomplete
                                                        options={remarksArray}
                                                        value={value ?? null}
                                                        onChange={(event: any, newValue: string | null) => {
                                                            setValue(newValue);
                                                        }}
                                                        inputValue={inputValue ?? ""}
                                                        onInputChange={(event, newInputValue) => {
                                                            setInputValue(newInputValue);
                                                        }}
                                                        id="controllable-states-demo"
                                                        sx={{ width: {lg:"300px"} }}
                                                        renderInput={(params) => (
                                                            <CustomTextField
                                                                {...params}
                                                                placeholder="Select"
                                                                aria-label="Controllable"
                                                            />
                                                        )}
                                                    />

                                                    <Typography
                                                        color="textSecondary"
                                                        variant="subtitle2"
                                                        sx={{
                                                            mt: 1,
                                                        }}
                                                    >{value ? value : ""}</Typography>



                                                </Stack>}


                                            <TextField
                                                id="outlined-textarea"
                                                label="Meeting Feedback"
                                                placeholder="Meeting Feedback"
                                                rows={3}
                                                value={meeting.feedback}
                                                onChange={(e) => {
                                                    let temp = [...meetings];
                                                    for (
                                                        let i = 0;
                                                        i < temp.length;
                                                        i++
                                                    ) {
                                                        if (
                                                            temp[i].meetingId ==
                                                            meeting.meetingId
                                                        ) {
                                                            temp[i].feedback =
                                                                e.target.value.trim();
                                                        }
                                                    }

                                                    setMeetings(temp);
                                                }}
                                                sx={{
                                                    width: "100%",
                                                    borderRadius: "4px",
                                                }}
                                                multiline
                                            />
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    placeContent: "center",
                                                }}
                                            >
                                                <Button
                                                    variant="outlined"
                                                    size="large"
                                                    color="primary"
                                                    sx={{
                                                        borderRadius: "8px",
                                                        fontWeight: "bold",
                                                        letterSpacing: 1,
                                                        display: "flex",
                                                        placeContent: "center",
                                                        alignItems: "center",
                                                        minWidth: 120,
                                                        maxHeight: 40,
                                                    }}
                                                    onClick={() =>
                                                        handleRatingSubmitClick(
                                                            meeting.meetingId
                                                        )
                                                    }
                                                    disabled={meeting.loading}
                                                >
                                                    {meeting.loading ? (
                                                        <CircularProgress
                                                            size={25}
                                                        />
                                                    ) : (
                                                        "Submit"
                                                    )}
                                                </Button>
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                </Stack>
            ) : (
                <Card
                    sx={{
                        padding: 0,
                        border: `1px solid ${borderColor}`,
                        backgroundColor: "transparent",
                        position: "relative",
                        boxShadow: `0 4px 6px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.1)`,
                    }}
                    elevation={9}
                    variant={"outlined"}
                >
                    <CardContent>
                        <Box>
                            <Typography
                                variant="h5"
                                textAlign={"center"}
                                color="error"
                            >
                                {" "}
                                No Meeting&apos;s rating is pending.
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            )}

            <Snackbar
                open={showSnackBar.show}
                autoHideDuration={3000}
                onClose={() => setShowSnackBar({ message: "", show: false })}
                message={showSnackBar.message}
                sx={{
                    marginLeft: "auto",
                    marginRight: "auto",
                }}
                action={
                    <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        onClick={() =>
                            setShowSnackBar({
                                message: "",
                                show: false,
                            })
                        }
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            />
        </Stack>
    );
};

const LoadingSkeleton = () => {
    return (
        <Card
            sx={{
                backgroundColor: "transparent",
                position: "relative",
                boxShadow: `0 4px 6px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.1)`,
            }}
            elevation={9}
            variant={"outlined"}
        >
            <Stack gap={1}>
                <Stack
                    direction={"row"}
                    gap={2}
                    sx={{ display: "flex", alignItems: "center" }}
                >
                    {" "}
                    <Skeleton
                        variant="circular"
                        height={25}
                        width={25}
                    ></Skeleton>
                    <Skeleton variant="text" height={30} width={70}></Skeleton>
                    <Skeleton variant="text" height={30} width={150}></Skeleton>
                </Stack>
                <Stack
                    direction={"row"}
                    gap={2}
                    sx={{ display: "flex", alignItems: "center" }}
                >
                    {" "}
                    <Skeleton variant="text" height={30} width={120}></Skeleton>
                    <Skeleton variant="text" height={30} width={180}></Skeleton>
                    <Skeleton variant="text" height={30} width={80}></Skeleton>
                </Stack>
                <Stack
                    direction={"row"}
                    gap={2}
                    sx={{ display: "flex", alignItems: "center" }}
                >
                    {" "}
                    <Skeleton variant="text" height={30} width={80}></Skeleton>
                    <Skeleton variant="text" height={30} width={400}></Skeleton>
                </Stack>
                <Stack
                    direction={"row"}
                    gap={2}
                    sx={{ display: "flex", alignItems: "center" }}
                >
                    {" "}
                    <Skeleton variant="text" height={30} width={130}></Skeleton>
                    <Skeleton variant="text" height={30} width={120}></Skeleton>
                </Stack>
                <Stack
                    direction={"row"}
                    gap={2}
                    sx={{ display: "flex", alignItems: "center" }}
                >
                    {" "}
                    <Skeleton variant="text" height={30} width={80}></Skeleton>
                    <Skeleton variant="text" height={30} width={250}></Skeleton>
                </Stack>
                <Stack
                    direction={"row"}
                    gap={2}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        overflow: "hidden",
                    }}
                >
                    {" "}
                    <Skeleton
                        variant="rectangular"
                        height={140}
                        width={1500}
                        sx={{ borderRadius: "8px" }}
                    ></Skeleton>
                </Stack>
                <Stack
                    direction={"row"}
                    gap={2}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        overflow: "hidden",
                        placeContent: "center",
                    }}
                >
                    {" "}
                    <Skeleton
                        variant="rectangular"
                        height={40}
                        width={120}
                        sx={{ borderRadius: "8px" }}
                    ></Skeleton>
                </Stack>
            </Stack>
        </Card>
    );
};

export default RatingComponent;
