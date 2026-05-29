
"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
    Typography,
    CircularProgress,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TextField,
    Box,
    useMediaQuery,
    useTheme,
    Card,
    Divider,
    Paper,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { useSession } from "next-auth/react";
import {
    encryptData,
    decryptDataforResponse,
} from "@/app/api/services/auth/Encrptdecrpt";
import { getAllMessagesAction } from "@/app/actions/homeAction/AllMessages/getAllMessagesAction";

type Props = {
    onData: (value: any) => void;
};

const AllMessageClient = ({ onData }: Props) => {
    const { data: session } = useSession();
    const [msgdata, setMsgData] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [subjectSearch, setSubjectSearch] = useState("");
    const [descSearch, setDescSearch] = useState("");

    const tableContainerRef = useRef<HTMLDivElement>(null);   // For desktop
    const mobileContainerRef = useRef<HTMLDivElement>(null);  // For mobile

    const theme = useTheme();
    const isCompact = useMediaQuery(theme.breakpoints.down("lg"));

    const fetchData = async (pageIndex: number) => {
        try {
            setLoading(true);
            setError(null);

            if (!session?.user?.token) throw new Error("Session token is missing");

            const splitValue = session.user?.token.split("NEXT2121ANG");
            if (!splitValue[1]) throw new Error("Invalid token format");

            const formfields = {
                Ssubject: null,
                Description: null,
                PageIndex: pageIndex,
                PageCount: null,
                PageSize: null,
            };

            const credentialsJson = JSON.stringify(formfields);
            const { Data } = encryptData(credentialsJson, splitValue[1]);

            const response = await getAllMessagesAction(Data);
            const decryptedData = decryptDataforResponse(response.ApiData, splitValue[1]);
            const parsedData = JSON.parse(decryptedData);

            if (!Array.isArray(parsedData)) throw new Error("Parsed data is not an array");

            if (pageIndex === 1 && parsedData[0]?.TotalMessages) {
                onData(parsedData[0].TotalMessages);
            }

            if (parsedData.length === 0) {
                setHasMore(false);
            } else {
                setMsgData((prev) => [...prev, ...parsedData]);
            }
        } catch (err) {
            setError("Failed to fetch messages.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(page);
    }, [page]);

    // Shared scroll handler
    const handleScroll = useCallback(() => {
        if (loading || !hasMore) return;

        const container = isCompact ? mobileContainerRef.current : tableContainerRef.current;
        if (container) {
            const { scrollTop, scrollHeight, clientHeight } = container;
            if (scrollTop + clientHeight >= scrollHeight * 0.8) {
                setPage(prev => prev + 1);
            }
        }
    }, [loading, hasMore, isCompact]);

    useEffect(() => {
        const container = isCompact ? mobileContainerRef.current : tableContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll, isCompact]);

    const filteredMessages = msgdata.filter((msg) => {
        const subjectMatch = msg.SUBJECT?.toLowerCase().includes(subjectSearch.toLowerCase());
        const descMatch = msg.Announcement?.toLowerCase().includes(descSearch.toLowerCase());
        return subjectMatch && descMatch;
    });

    return (
        <Box sx={{ width: "100%", padding: 2, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Search & Info */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: { lg: "space-between", xs: "center", md: "space-between" },
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                    flexShrink: 0,
                    marginBottom: "10px"
                }}
            >
                <Typography variant="h6" sx={{ fontSize: { xs: 13 }, whiteSpace: "nowrap", color:"secondary.main"  }}>
                    Kindly Scroll down to view more detail
                </Typography>

                <Box
                    sx={{
                        width: { xs: "100%", lg: "auto" },
                        display: "flex",
                        flexDirection: { xs: "column", lg: "row", md: "row", sm: "row" },
                        alignItems: { lg: "center", xs: "stretch", sm: "center" },
                        gap: 1,
                    }}
                >
                    <Box sx={{ width: { xs: "100%", sm: 200 } }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Search by Subject"
                            value={subjectSearch}
                            onChange={(e) => setSubjectSearch(e.target.value)}
                        />
                    </Box>
                    <Box sx={{ width: { xs: "100%", sm: 200 } }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Search by Description"
                            value={descSearch}
                            onChange={(e) => setDescSearch(e.target.value)}
                        />
                    </Box>
                </Box>
            </Box>

            {/* Content */}
            {error && (
                <Typography color="error" textAlign="center" mt={2}>
                    {error}
                </Typography>
            )}

            <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                {isCompact ? (
                    <Box ref={mobileContainerRef} sx={{ overflowY: 'auto', flex: 1 }}>
                        {filteredMessages.map((item, index) => (
                            <React.Fragment key={index}>
                                <Box sx={{ display: "flex", alignItems: "center", margin: "10px 0", width: "98%", padding: "7px" }}>
                                    <Card sx={{
                                        cursor: "default",
                                        borderLeft: `2px solid ${theme.palette.primary.main}`,
                                        display: "flex",
                                        flexDirection: "column",
                                        boxShadow: "none",
                                        borderRadius: 0,
                                        padding: 1,
                                        wordBreak: "break-word",
                                    }}>
                                        <Typography fontWeight="bold" sx={{ wordBreak: "break-word" }}>
                                            <Typography component="span" sx={{ marginRight: 1 }}>{item.SrNo}.)</Typography>
                                            <Typography component="span" color="primary.main">{item.SUBJECT}</Typography>
                                            <Typography component="span" sx={{
                                                fontSize: "0.8em",
                                                fontWeight: "bold",
                                                color: "secondary.main",
                                                padding: "3px",
                                                whiteSpace: "nowrap",
                                                display: "inline-block",
                                                float: "right",
                                            }}>{item.AnnouncementDate}</Typography>
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                wordBreak: "break-word", mt: 1, '& a': {
                                                    color: 'inherit', // or use a specific color like '#000' if you want
                                                    textDecoration: 'none', // optional styling
                                                    transition: 'none', // remove transition if needed
                                                },
                                            }}
                                            dangerouslySetInnerHTML={{ __html: item.Announcement }}
                                        />
                                        {item.FileName && (
                                            <Box mt={1}>
                                                <Icon
                                                    icon="entypo:attachment"
                                                    style={{ fontSize: "20px", cursor: "pointer" }}
                                                    onClick={() => {
                                                        item.FileName;
                                                    }}
                                                />
                                            </Box>
                                        )}
                                    </Card>
                                </Box>
                                {index !== filteredMessages.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </Box>
                ) : (
                    <Paper elevation={0} sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <TableContainer
                            ref={tableContainerRef}
                            sx={{
                                flex: 1,
                                overflow: 'auto',
                                "&::-webkit-scrollbar": {
                                    width: "8px",
                                    height: "8px",
                                    marginTop: "18px"
                                },
                                "&::-webkit-scrollbar-thumb": {
                                    borderRadius: "2px",
                                   
                                },
                            }}
                        >
                            <Table >
                                <TableHead sx={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "background.paper" }}>
                                    <TableRow>
                                        <TableCell align="center"><b>SrNo</b></TableCell>
                                        <TableCell align="center"><b>Subject</b></TableCell>
                                        <TableCell align="center"><b>Description</b></TableCell>
                                        <TableCell align="center"><b>Attachment</b></TableCell>
                                        <TableCell align="center"><b>Entry Date</b></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredMessages.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell align="center">{row.SrNo}</TableCell>
                                            <TableCell align="center" sx={{ whiteSpace: "normal", wordBreak: "break-word", maxWidth: 200 }}>
                                                {row.SUBJECT}
                                            </TableCell>
                                            <TableCell
                                                align="left"
                                                sx={{
                                                    verticalAlign: "top",
                                                    whiteSpace: "normal",
                                                    wordBreak: "break-word",
                                                    maxWidth: 600,
                                                    overflowWrap: "break-word",
                                                    '& a': {
                                                        color: 'inherit',
                                                        textDecoration: 'none',
                                                    },
                                                }}
                                                dangerouslySetInnerHTML={{ __html: row.Announcement }}
                                            />

                                            <TableCell align="center">
                                                {row.FileName ? (
                                                    <Icon
                                                        icon="entypo:attachment"
                                                        style={{ fontSize: "22px", cursor: "pointer" }}
                                                        onClick={() => row.FileName}
                                                    />
                                                ) : (
                                                    <Box sx={{ visibility: "hidden" }}>
                                                        <Icon icon="entypo:attachment" style={{ fontSize: "22px" }} />
                                                    </Box>
                                                )}
                                            </TableCell>
                                            <TableCell align="center">{row.AnnouncementDate}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                )}

                {loading && (
                    <Box display="flex" justifyContent="center" mt={2}>
                        <CircularProgress />
                    </Box>
                )}

                {!loading && filteredMessages.length === 0 && (
                    <Typography textAlign="center" mt={2}>No messages found.</Typography>
                )}
            </Box>
        </Box>
    );
};

export default AllMessageClient;
