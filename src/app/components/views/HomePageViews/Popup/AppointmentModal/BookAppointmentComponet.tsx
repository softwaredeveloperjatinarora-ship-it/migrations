"use client";
import { useState } from "react";
import Grid from "@mui/material/Grid";
import CloseIcon from "@mui/icons-material/Close";
import {
    Stack,
    TextField,
    Autocomplete,
    Button,
    IconButton,
    Snackbar,
    Alert,
    AlertTitle,
} from "@mui/material";
import Collapse from "@mui/material/Collapse";
import * as React from "react";
// import { saveMeetingAppointment } from "@/app/actions/student/BookAppointmentModal/SaveAppointment";
import { useRouter } from "next/navigation";
import { saveMeetingAppointment } from "@/app/actions/homeAction/BookAppointment/SaveAppointment";
import { useSession } from "next-auth/react";
import { decryptDataforResponse, encryptData } from "@/app/api/services/auth/Encrptdecrpt";
const AppointmentComponent = ({
    roleId,
    authorityType,
}: {
    roleId: 3 | 20;
    authorityType: string;
}) => {
    const [showSnackBar, setShowSnackBar] = useState({
        message: "",
        show: false,
    });
    const [open, setOpen] = useState(false);
    const [parentType, setParentType] = useState<{
        label: string;
        value: string;
    } | null>(null);
    const router = useRouter();
    const [reason, setReason] = useState<string>();
    const [contact, setContact] = useState<string>();
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();
    const options = [
        { label: "Father", value: "Father" },
        { label: "Mother", value: "Mother" },
    ];
    

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        if (reason === "" || reason === undefined || reason === null) {
            setShowSnackBar({
                message: "Reason of appointment must not be empty",
                show: true,
            });
        } else if (
            contact === "" ||
            contact === undefined ||
            contact === null
        ) {
            setShowSnackBar({
                message: "contact number must not be empty",
                show: true,
            });
        } else if (
            roleId === 20 &&
            (parentType?.value === "" ||
                parentType?.value === undefined ||
                parentType?.value === null)
        ) {
            setShowSnackBar({
                message: "Parent type must not be empty",
                show: true,
            });
        } else {
            let regex = /^\d+$/;
            if (!regex.test(contact)) {
                setShowSnackBar({
                    message: "Contact number must contain number only",
                    show: true,
                });
            } else {
                (async () => {
                      const formfields = {
                        RollId: roleId.toString(),
                        ReasonOfAppointment: reason!,
                        ParentType: parentType?.value!,
                        Mobile: contact!.toString(),
                        DeviceType: null,
                        AuthorityType: authorityType,
                    };
                           if (!session || !session.user || !session.user.token) {
                        throw new Error("Session or token is missing");
                    }

                    let splitValue = session.user.token.split("NEXT2121ANG");
                    const credentialsJson = JSON.stringify(formfields);

                    // Encrypt the data
                    const { Data } = encryptData(credentialsJson, splitValue[1]);
                    const response = await saveMeetingAppointment(Data);
                    // console.log(response);
                       let apiData = response.ApiData;
                    const decryptedData = decryptDataforResponse(apiData, splitValue[1]);
                    const parsedData = JSON.parse(decryptedData);
                    if (parsedData.statusCode === 200) {
                        setOpen(true);
                        // console.log(response.data![0].msg);
                        if (parsedData.data![0].msg === "Success") {
                            setMsg("Appointment has been booked successfully");
                        } else {
                            setMsg(parsedData.data![0].msg);
                        }
                        
                        setInterval(() => {
                            setOpen(false);
                        }, 3000);
                    } else if (response.statusCode === 401) {
                        router.push("/");
                    } else {
                        setShowSnackBar({
                            message: "Oops!! some unexpected error occured",
                            show: true,
                        });
                    }
                })();
            }
        }
    };

    return (
        <Stack gap={2}>
            <Collapse in={open}>
                <Alert
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setOpen(false);
                            }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    severity="success"
                >
                    {msg}
                </Alert>
            </Collapse>
            <TextField
                id="outlined-textarea"
                label="Reason of Appointment"
                placeholder="Reason"
                rows={5}
                sx={{ width: "100%", borderRadius: "4px" }}
                multiline
                onChange={(e) => setReason(e.target.value.trim())}
            />
            <Grid container spacing={2}>
                <Grid size={6}>
                    <TextField
                        id="outlined-number"
                        label="Contact Number"
                        type="number"
                        placeholder="9875485869"
                        sx={{
                            "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
                                {
                                    WebkitAppearance: "none",
                                    margin: 0,
                                },
                            "& input[type=number]": {
                                MozAppearance: "textfield",
                            },
                            width: "100%",
                        }}
                        onChange={(e) => {
                            let regex = /^\d+$/;
                            let con = e.target.value.trim();
                            if (regex.test(con)) setContact(con);
                            else setContact(contact);
                        }}
                    />
                </Grid>
                {roleId === 20 && (
                    <Grid size={6}>
                        <Autocomplete
                            options={options}
                            getOptionLabel={(option) => option.label}
                            value={parentType}
                            onChange={(event, newValue) =>
                                setParentType(newValue)
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Parent Type"
                                    variant="outlined"
                                    placeholder="Father"
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            backgroundColor: "transparent",
                                            padding: "5px 10px",
                                            borderRadius: "16px",
                                        },
                                    }}
                                />
                            )}
                            sx={{ width: "100%" }}
                        />
                    </Grid>
                )}
                <Grid
                    size={12}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        placeContent: "center",
                    }}
                >
                    <Button
                        variant="outlined"
                        size="large"
                        sx={{
                            borderRadius: "8px",
                            fontWeight: "bold",
                            letterSpacing: 1,
                            // marginTop: 2,
                        }}
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </Grid>
            </Grid>
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

export default AppointmentComponent;
