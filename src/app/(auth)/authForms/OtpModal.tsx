import { useState, useRef } from "react";
import {
    Box,
    Button,
    CircularProgress,
    Modal,
    Typography,
    TextField,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface OtpModalProps {
    openModal: boolean;
    handleClose: () => void;
    otp: string;
    setOtp: (otp: string) => void;
    onSubmitOtp: () => void;
    loading: boolean;
}

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 360,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "12px",
};

const OtpModal = ({
    openModal,
    handleClose,
    otp,
    setOtp,
    onSubmitOtp,
    loading,
}: OtpModalProps) => {
    const [error, setError] = useState("");
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const otpArray = Array.from({ length: 4 }, (_, i) => otp[i] || "");

    const handleChange = (value: string, index: number) => {
        if (/^[0-9]?$/.test(value)) {
            const newOtpArray = [...otpArray];
            newOtpArray[index] = value;
            const newOtp = newOtpArray.join("");
            setOtp(newOtp);

            if (error) setError("");

            if (value && index < 3) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        index: number
    ) => {
        if (e.key === "Backspace") {

            if (error) setError("");

            if (!otpArray[index] && index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    const handleSubmit = () => {
        if (otp.length !== 4) {
            setError("Please enter a valid 4-digit OTP.");
            return;
        }
        setError("");
        onSubmitOtp();
    };

    return (
        <Modal
            open={openModal}
            onClose={(event, reason) => {
                if (reason === "backdropClick" || reason === "escapeKeyDown") return;
                handleClose();
            }}
        >
            <Box sx={style}>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: "absolute",
                        right: 12,
                        top: 12,
                        color: "white",
                        "&:hover": {
                            backgroundColor: "transparent",
                            color: "grey.400",
                        },
                    }}
                >
                    <CloseIcon fontSize="medium" />
                </IconButton>


                <Typography variant="h4" component="h2" textAlign="center" mt={1}>
                    Enter OTP
                </Typography>
                <Typography
                    sx={{ mt: 1, mb: 3 }}
                    textAlign="center"
                    color="text.secondary"
                >
                    Please enter the OTP sent to your phone
                </Typography>

                <Box display="flex" justifyContent="center" gap={2}>
                    {otpArray.map((digit, index) => (
                        <TextField
                            key={index}
                            inputRef={(el) => (inputRefs.current[index] = el)}
                            value={digit}
                            onChange={(e) => handleChange(e.target.value, index)}
                            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, index)}
                            variant="outlined"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 0,
                                    width: "40px",
                                    height: "40px",
                                    "& input": {
                                        textAlign: "center",
                                        fontSize: "18px",
                                        padding: 0,
                                    },
                                },
                            }}
                        />
                    ))}
                </Box>

                
                {error && (
                    <Typography
                        color="error"
                        variant="body2"
                        sx={{ mt: 2, textAlign: "center" }}
                    >
                        {error}
                    </Typography>
                )}

                <Box display="flex" justifyContent="center" mt={3}>
                    <Button
                        variant="contained"
                        sx={{
                            height: "35px",
                            textTransform: "none",
                            fontSize: "16px",
                            borderRadius: "22px",
                            width: "60%",
                        }}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            "Validate OTP"
                        )}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default OtpModal;
