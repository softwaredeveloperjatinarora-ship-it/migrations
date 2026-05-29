"use client";
import React from "react";
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
} from "@mui/material";

import { MentorDetailsProps } from "../../../api/interfaces/studentdashboard/MentorInterFace";
import MentorDetails from "./MentorDetails";
import { IconX } from "@tabler/icons-react";



interface PopupProps {
    open: boolean;
    handleClose: () => void;
    title: string;
    mentor: MentorDetailsProps,
    isallowSelection: string;
}

const MentorDetailsPopUp: React.FC<PopupProps> = ({
    open,
    handleClose,
    title,
    mentor,
    isallowSelection
}) => {
    const descriptionElementRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
            // PaperProps={{ sx: { width: "100%", height: "90%" } }}
            maxWidth="lg"
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                Your Mentor Assigned
                <IconButton onClick={handleClose} size="small" sx={{ ml: 2 }}>
                    <IconX color="#FF8488" size={24} />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                {/* <Scrollbar sx={{ height: "100%" }}> */}

                <MentorDetails {...mentor} handleClose={handleClose} isallowSelection={isallowSelection} />

                {/* </Scrollbar> */}
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={handleClose}>
                    Close
                </Button>
                {/* <Button onClick={handleClose}>OK</Button> */}
            </DialogActions>
        </Dialog>
    );
};

export default MentorDetailsPopUp;