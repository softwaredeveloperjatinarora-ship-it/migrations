"use client";
import React, { useState, useEffect } from 'react';
import theme from '@/utils/theme';
import { Box, useMediaQuery, TextField, Alert, Snackbar } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';

interface MentorSpecializationProps {
    specializations: string[];
    selectedSpecialization: string | null;
    setSelectedSpecialization: React.Dispatch<React.SetStateAction<string | null>>;
}

const MentorSpecialization: React.FC<MentorSpecializationProps> = React.memo(({
    specializations,
    selectedSpecialization,
    setSelectedSpecialization
}) => {
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [error, setError] = useState<string | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    // Convert comma-separated string to array for Autocomplete
    const selectedValues = selectedSpecialization ? selectedSpecialization.split(',') : [];

    // Validate props on component mount
    useEffect(() => {
        if (!Array.isArray(specializations)) {
            setError("Invalid specializations data: expected an array");
            setOpenSnackbar(true);
        }
    }, [specializations]);

    // Handle selection changes
    const handleSelectionChange = (_event: React.SyntheticEvent, newValues: string[]) => {
        try {
            if (newValues.length === 0) {
                setSelectedSpecialization(null);
            } else {
                setSelectedSpecialization(newValues.map(value => value.toLowerCase()).join(','));
            }
        } catch (err) {
            setError("Error updating specializations");
            setOpenSnackbar(true);
            console.log("Error in handleSelectionChange:", err);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Box>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>

            <Box mb={2}>
                <Typography
                    variant={isMobile ? "h5" : "h4"}
                    fontWeight="600"
                    mb={2}
                    ml={1}
                >
                    Filter by Specialization
                </Typography>

                {Array.isArray(specializations) ? (
                    <Autocomplete
                        multiple
                        fullWidth
                        id="specializations-autocomplete"
                        options={specializations}
                        value={selectedValues.map(value => {
                            try {
                                // Find the original case version of the specialization
                                const originalCase = specializations.find(
                                    spec => spec.toLowerCase() === value
                                ) || value;
                                return originalCase;
                            } catch (err) {
                                console.error("Error mapping specialization values:", err);
                                return value;
                            }
                        })}
                        onChange={handleSelectionChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Select specializations"
                                aria-label="Specializations"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '16px',
                                    },
                                }}
                            />
                        )}
                        sx={{
                            '& .MuiChip-root': {
                                borderRadius: '16px',
                                fontWeight: 600,
                                backgroundColor: theme.palette.secondary.main,
                                color: theme.palette.secondary.contrastText,
                            }
                        }}
                    />
                ) : (
                    <Alert severity="error">Unable to load specializations</Alert>
                )}
            </Box>
        </Box>
    );
});

export default MentorSpecialization;