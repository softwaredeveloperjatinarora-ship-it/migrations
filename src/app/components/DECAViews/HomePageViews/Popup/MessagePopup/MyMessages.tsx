"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    Button,
    Box,
    Typography,
    CircularProgress,
    Card,
    Divider,
    IconButton,
} from "@mui/material";
import Scrollbar from "@/app/components/custom-scroll/Scrollbar";
import { useSession } from "next-auth/react";
import { getMessageAction } from "@/app/actions/homeAction/Message/getMessageAction";
import { decryptDataforResponse } from "@/app/api/services/auth/Encrptdecrpt";
import { useTheme } from "@mui/material/styles";
import { IconX } from "@tabler/icons-react";

const MyMessages: React.FC = () => {
    const { data: session } = useSession();
    const [loading, setLoading] = useState<boolean>(true);
    const [msgdata, setmsgdata] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const theme = useTheme();
    const [showAllMessages, setShowAllMessages] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            if (!session?.user?.token) throw new Error("Session token is missing");
            const response = await getMessageAction();
            let splitValue = String(session.user?.token).split("NEXT2121ANG");
            if (!splitValue[1]) throw new Error("Invalid token format");
            const decryptedData = decryptDataforResponse(response.ApiData, splitValue[1]);
            const parsedData = JSON.parse(decryptedData);
            if (!Array.isArray(parsedData)) throw new Error("Parsed data is not an array");
            setmsgdata(parsedData);
        } catch (err) {
            setError("Failed to fetch messages.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (

        <Box sx={{ width: "100%", height: "100%" }}>


            <Scrollbar sx={{ height: "calc(100vh - 150px)" }}>




                {loading && (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <CircularProgress />
                    </Box>
                )}
                {error && (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <Typography color="error">{error}</Typography>
                    </Box>
                )}
                {!loading && !error && msgdata.length > 0
                    ? msgdata.map((item, index) => (
                        <React.Fragment key={index}>
                            <Box

                                sx={{
                                    marginTop: "5px",
                                    display: "flex",
                                    alignItems: "center",
                                    mb: "7px",
                                    width: "98%",
                                    padding: "7px",
                                }}
                            >

                                <Card
                                    sx={{
                                        cursor: "default",
                                        borderLeft: `2px solid ${theme.palette.primary.main}`,
                                        display: "flex",
                                        flexDirection: "column",
                                        marginLeft: "15px",
                                        padding: "10px",
                                        boxShadow: "none",
                                        borderWidth: "0 0 0 3px",
                                        borderStyle: "solid",
                                        borderColor: "primary.main",
                                        borderRadius: 0,



                                    }}
                                >
                                    <Typography component="div" sx={{ fontWeight: "bolder" }}>
                                        <Typography
                                            component="span"
                                            sx={{
                                                color: "primary.main",

                                                fontWeight: "bolder",
                                            }}
                                        >
                                            {item.subject}
                                        </Typography>
                                        <Typography
                                            component="span"
                                            sx={{
                                                float: "right",
                                                fontSize: "0.8em",
                                                fontWeight: "bold",
                                                color: "secondary.main",
                                            }}
                                        >
                                            By {item.name}
                                        </Typography>
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            transition: "color 0.3s ease-in-out", '& a': {
                                                color: 'inherit', // or use a specific color like '#000' if you want
                                                textDecoration: 'none', // optional styling
                                                transition: 'none', // remove transition if needed
                                            },
                                        }}

                                        dangerouslySetInnerHTML={{ __html: item.announcement }}
                                    />
                                </Card>
                            </Box>
                            {index !== msgdata.length - 1 && <Divider sx={{ my: 2 }} />}
                        </React.Fragment>
                    ))
                    : !loading && !error && <Typography>No messages available.</Typography>}
            </Scrollbar>

        </Box>
    );
};

export default MyMessages;
