"use client";
import CloseIcon from "@mui/icons-material/Close";

import {
    Modal,
    Box,
    Card,
    CardHeader,
    Stack,
    Typography,
    Divider,
    CardContent,
    IconButton,
    Tab,
    Tabs,
} from "@mui/material";
import * as React from "react";
import { useMediaQuery } from "@mui/system";
import theme from "@/utils/theme";
import AppointmentComponent from "./BookAppointmentComponet";
import RatingComponent from "./AppointmentRatingComponent";

type AppointmentModalType = {
    handleClose: () => void;
    open: boolean;
    roleId: 3 | 20;
    AuthCode:any
};
const AppointmentModalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    // width: "400",
    bgcolor: "background.paper",
    // border: "2px solid #205781",
    boxShadow: 24,
};
const ModalComponent = ({
    open,
    handleClose,
    roleId,
    AuthCode
}: AppointmentModalType) => {
    const [currentTab, setCurrentTab] = React.useState("Appointment");
    const isSmallScreen = useMediaQuery(theme.breakpoints.between("xs", "sm"));

    const handleTabChange = (
        event: any,
        newValue: React.SetStateAction<string>
    ) => {
        setCurrentTab(newValue);
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box
                sx={{
                    ...AppointmentModalStyle,
                    width: isSmallScreen ? "90vw" : "70vw",
                }}
            >
                <Card sx={{ padding: 0 }} elevation={9} variant={"outlined"}>
                    <CardHeader
                        title={
                            <Stack direction={"row"}>
                                <Typography
                                    variant="h5"
                                    letterSpacing={1}
                                    // color="error"
                                >
                                    Book Appointment and Rate Previous meetings
                                </Typography>
                                <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    sx={{ p: 0.5, ml: "auto" }}
                                    onClick={() => handleClose()}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Stack>
                        }
                    />
                    <Divider />
                    <CardContent
                        sx={{
                            paddingY: 2,
                            height: isSmallScreen ? "50vh" : "70vh",
                            overflowY: "auto",
                            scrollbarWidth: "thin",
                        }}
                    >
                        <Tabs
                            value={currentTab}
                            onChange={handleTabChange}
                            // TabIndicatorProps={{
                            //     style: { backgroundColor: "#2563EB" },
                            // }}
                            sx={{
                                "& .MuiTab-root": {
                                    textTransform: "none",
                                    fontWeight: 500,
                                   
                                    "&.Mui-selected": {
                                       
                                    },
                                },
                            }}
                        >
                            <Tab value="Appointment" label="Book Appointment" />
                            <Tab
                                value="Rating"
                                label="Rate Your Previous Appointment"
                            />
                        </Tabs>
                        <Box sx={{ marginY: 2 }}></Box>
                        {currentTab === "Appointment" ? (
                            <AppointmentComponent
                                roleId={roleId}
                                authorityType={AuthCode}
                            />
                        ) : (
                            <RatingComponent />
                        )}
                    </CardContent>
                </Card>
            </Box>
        </Modal>
    );
};

export default ModalComponent;
