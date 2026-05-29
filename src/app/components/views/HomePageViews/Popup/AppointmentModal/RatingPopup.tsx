



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
} from "@mui/material";
import * as React from "react";
import { useMediaQuery } from "@mui/system";
import theme from "@/utils/theme";
import RatingComponent from "./AppointmentRatingComponent";

type AppointmentModalType = {
    handleClose: () => void;
    open: boolean;
};

const AppointmentModalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
};

const RatingPopup = ({ open, handleClose }: AppointmentModalType) => {
    const isSmallScreen = useMediaQuery(theme.breakpoints.between("xs", "sm"));

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
                                    color="error"
                                >
                                    Rate Your Previous Appointment
                                </Typography>
                                <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    sx={{ p: 0.5, ml: "auto" }}
                                    onClick={handleClose}
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
                        <RatingComponent />
                    </CardContent>
                </Card>
            </Box>
        </Modal>
    );
};

export default RatingPopup;
