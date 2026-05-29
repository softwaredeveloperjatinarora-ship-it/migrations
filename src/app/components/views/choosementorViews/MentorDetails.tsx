
import React, { useState } from 'react';
import {
    Box, Typography, Button, Chip, Stack, useMediaQuery,
    useTheme, Alert, Snackbar, CircularProgress
} from '@mui/material';
import { getMentorDetailAction } from '@/app/actions/MentorChooseAction/getMentorDetailAction';
import { MentorDetailsProps } from '../../../api/interfaces/studentdashboard/MentorInterFace';

interface MentorDetailsPropWithSetShow extends MentorDetailsProps {
    setShowMentorDetails?: React.Dispatch<React.SetStateAction<boolean>>;
    handleClose?: () => void;
    isallowSelection?: string;
}

const MentorDetails: React.FC<MentorDetailsPropWithSetShow> = React.memo(({
    Mentoruid,
    MentorName,
    Picture,
    dept_name,
    School,
    PreferenceOne,
    PreferenceTwo,
    PreferenceThree,
    SeatLeft,
    isallowSelection,
    setShowMentorDetails,
    handleClose
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [error, setError] = useState<string | null>(null);
    const [showError, setShowError] = useState(false);
    const [successMsg, setsuccessMsg] = useState<string | null>(null);
    const [showMsg, setShowMsg] = useState(false);
    const [loading, setLoading] = useState(false);

    const checkEligibility = () => {
        setLoading(true);
        try {
            if (setShowMentorDetails && isallowSelection?.toLowerCase() === 'allow') {
                setShowMentorDetails(true);
            } else {
                setError("Mentor change is not allowed at this time");
                setShowError(true);
            }
        } catch (err) {
            setError("An unexpected error occurred");
            setShowError(true);
            console.error("Error in checkEligibility:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseError = () => setShowError(false);
    const handleCloseMsg = () => setShowMsg(false);

    const handleSaveMentor = async () => {
        setLoading(true);
        try {
            if (Mentoruid && isallowSelection === 'allow') {
                const res = await getMentorDetailAction(Mentoruid);

                if (res === "Selected") {
                    setsuccessMsg("Mentor saved successfully");
                    setShowMsg(true);
                } else if (res === "Already") {
                    setError("You have already enrolled with this mentor");
                    setShowError(true);
                } else {
                    setError("An unexpected error occurred while saving the mentor");
                    setShowError(true);
                }
            } else {
                setError("Mentor change is not allowed at this time");
                setShowError(true);
            }
        } catch (err) {
            setError("An unexpected error occurred");
            setShowError(true);
            console.error("Error in handleSaveMentor:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                width: '100%',
                bgcolor: theme.palette.background.paper,
                borderRadius: '12px',
                boxShadow: `0 4px 12px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.08)'}`,
                overflow: 'hidden',
                margin: '0 auto',
                p: { xs: 1, sm: 2 },
            }}
        >
            {/* Snackbars */}
            <Snackbar
                open={showError}
                autoHideDuration={6000}
                onClose={handleCloseError}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
            <Snackbar
                open={showMsg}
                autoHideDuration={6000}
                onClose={handleCloseMsg}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseMsg} severity="success" sx={{ width: '100%' }}>
                    {successMsg}
                </Alert>
            </Snackbar>

            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'start', borderBottom: `1px solid ${theme.palette.divider}`, p: { xs: 1, sm: 2 } }}>
                <Typography sx={{ fontWeight: 600, fontSize: { xs: '20px', sm: '25px' } }}>
                    Your Mentor Assigned
                </Typography>
            </Box>

            {/* Content */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'center', md: 'flex-start' },
                    justifyContent: 'space-between',
                    p: { xs: 2, sm: 3, md: 4 },
                    gap: { xs: 3 },
                }}
            >
                {/* Mentor Image */}
                <Box
                    sx={{
                        width: { xs: 180, sm: 200, md: 200 },
                        height: { xs: 180, sm: 200, md: 200 },
                        borderRadius: '50%',
                        overflow: 'hidden',
                        flexShrink: 0,
                        border: `2px solid ${theme.palette.divider}`,
                        backgroundColor: theme.palette.grey[100],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {Picture ? (
                        <img
                            src={`data:image/jpeg;base64,${Picture}`}
                            alt="Mentor"
                            loading="lazy"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (
                        <Typography sx={{ color: theme.palette.text.secondary }}>No Image</Typography>
                    )}
                </Box>

                {/* Mentor Info */}
                <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' }, ml: { md: 2 }, maxWidth: { md: '65%', xs: '100%' } }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, fontSize: { xs: '22px', sm: '24px', md: '26px' }, mb: 1 }}>
                        {MentorName || "Name Unavailable"}
                    </Typography>
                    <Typography variant="body1" sx={{ color: theme.palette.text.secondary, fontSize: { xs: '14px', sm: '16px' }, mb: 1 }}>
                        ID: {Mentoruid}
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: { xs: '16px', sm: '18px' }, color: theme.palette.text.secondary, mb: 0.5 }}>
                        Department: {dept_name}
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: { xs: '16px', sm: '18px' }, color: theme.palette.text.secondary, mb: 2 }}>
                        School: {School}
                    </Typography>

                    {/* Specializations */}
                    <Typography variant="subtitle1" sx={{ color: theme.palette.info.main, fontWeight: 600, fontSize: { xs: '16px', sm: '18px' }, mb: 1.5 }}>
                        Specializations:
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                        {PreferenceOne && <Chip label={PreferenceOne} color="primary" variant="outlined" size={isMobile ? "small" : "medium"} />}
                        {PreferenceTwo && <Chip label={PreferenceTwo} color="secondary" variant="outlined" size={isMobile ? "small" : "medium"} />}
                        {PreferenceThree && <Chip label={PreferenceThree} color="success" variant="outlined" size={isMobile ? "small" : "medium"} />}
                    </Stack>

                    {/* Action Buttons */}
                    {isallowSelection?.toLowerCase() === 'allow' && (
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, width: '100%' }}>
                            <Button
                                variant="contained"
                                fullWidth
                                color="info"
                                sx={{
                                    borderRadius: '25px',
                                    py: { xs: 0.75, sm: 1 },
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    fontSize: { xs: '14px', sm: '16px' },
                                }}
                                onClick={checkEligibility}
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
                            >
                                {loading ? "Processing..." : "Desire to Change Mentor"}
                            </Button>

                            {setShowMentorDetails && (
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    color="success"
                                    sx={{
                                        borderRadius: '25px',
                                        py: { xs: 0.75, sm: 1 },
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        fontSize: { xs: '14px', sm: '16px' },
                                    }}
                                    onClick={() => { setShowMentorDetails(false); handleSaveMentor(); }}
                                    disabled={loading}
                                >
                                    Keep Current Mentor
                                </Button>
                            )}

                            {Number(SeatLeft) > 0 && !setShowMentorDetails && (
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    color="warning"
                                    sx={{
                                        borderRadius: '25px',
                                        py: { xs: 0.75, sm: 1 },
                                        textTransform: 'none',
                                        fontWeight: 400,
                                        fontSize: { xs: '14px', sm: '16px' },
                                    }}
                                    onClick={handleSaveMentor}
                                    disabled={loading}
                                >
                                    Enroll
                                </Button>
                            )}
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
});

export default MentorDetails;
