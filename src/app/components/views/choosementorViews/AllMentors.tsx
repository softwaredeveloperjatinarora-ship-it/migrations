"use client";
import React, { useEffect, useState } from "react";
import {
    Typography,
    Box,
    IconButton,
    Button,
    TextField,
    InputAdornment,
    Alert,
    Snackbar,
    Card
} from "@mui/material";
import { useMediaQuery } from "@mui/system";
import theme from "@/utils/theme";
import { GridSearchIcon } from "@mui/x-data-grid";

import Loading from "@/app/loading";
import { getGetPreferenceData} from "@/app/actions/MentorChooseAction/getMentorDetailAction";
import MentorSpecialization from "./MentorSpecialization";
import MentorDeSubComp from "./MentorDeSubComp";
import MentorDetailsPopUp from "./MentorDetailsPopUp";
import { MentorDetailsProps } from "../../../api/interfaces/studentdashboard/MentorInterFace";
import { decryptDataforResponse } from "@/app/api/services/auth/Encrptdecrpt";
import { useSession } from "next-auth/react";



interface AllMentorsProps {
    isallowSelection: string;
   
}
const AllMentors = ({ isallowSelection }: AllMentorsProps) => {
    let isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [selectedSpecialization, setSelectedSpecialization] = useState<string | null>(null);
    const [selectedName, setSelectedName] = useState<string | null>('');
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
  const { data: session } = useSession();
    //myDataStore is for filterData backup
    const [rows, setRows] = useState<MentorDetailsProps[]>([]);
    let myDataStoreRef = React.useRef<MentorDetailsProps[]>([]); // useRef to store the original data


    useEffect(() => {
        const fetchpreferenceData = async () => {
          try {
            setLoading(true);
            const response = await getGetPreferenceData();
      
            if (response.status === "success") {
              let splitValue = String(session?.user?.token).split("NEXT2121ANG");
              const decryptedData = decryptDataforResponse(
                response.ApiData,
                splitValue[1]
              );
      
              const parsed:MentorDetailsProps[] = JSON.parse(decryptedData);

              if (!parsed || parsed.length === 0) {
                throw new Error("No mentor data available");
            }
            const sortedResponse = sortData(parsed );
            setRows(sortedResponse);
            myDataStoreRef.current = sortedResponse; // Store the original data in the ref
            setError(null);
      
            //   console.log("Fetched Data of preference:", parsed);
      
            //   onDataFetched?.(parsed); // ✅ Use directly if it's a function
            } else {
              setError(response.message);
            }
          }  catch (err) {
            console.log("Error fetching mentor data:", err);
            setError(err instanceof Error ? err.message : "Failed to load mentor data");
            setOpenSnackbar(true);
            setRows([]);
            myDataStoreRef.current = [];
        } finally {
            setLoading(false);
        }
        };
      
        fetchpreferenceData();
      }, []);
      
 

    const sortData = (data: MentorDetailsProps[]) => {
        if (!data || !Array.isArray(data)) return [];

        return [...data].sort((a, b) => {
            // Using MentorName which is in your interface instead of MentorName
            return (a.MentorName || '').localeCompare(b.MentorName || '');
        });
    };

    const [specializations, setSpecializations] = useState<string[]>([]);

    // Update specializations whenever rows changes
    useEffect(() => {
        try {
            // Extract all specialization values
            const allSpecializations: string[] = [];
            rows.forEach(row => {
                if (row.PreferenceOne) allSpecializations.push(row.PreferenceOne.toLowerCase());
                if (row.PreferenceTwo) allSpecializations.push(row.PreferenceTwo.toLowerCase());
                if (row.PreferenceThree) allSpecializations.push(row.PreferenceThree.toLowerCase());
            });

            // Filter unique values and capitalize first letter
            const updatedSpecializations = Array.from(new Set(allSpecializations))
                .map(spec => spec.charAt(0).toUpperCase() + spec.slice(1).toLowerCase())
                .sort();

            setSpecializations(updatedSpecializations);
        } catch (err) {
            console.error("Error processing specializations:", err);
            setError("Failed to process specialization data");
            setOpenSnackbar(true);
            setSpecializations([]);
        }
    }, [myDataStoreRef.current]);

    const [selectedMentor, setSelectedMentor] = useState<MentorDetailsProps>({
        Mentoruid: '',
        dept_name: '',
        MentorName: '',
        School: '',
        Picture: '',
        PreferenceOne: '',
        PreferenceTwo: '',
        PreferenceThree: '',
        headline: '',
        CheakAcess: '',
        SeatLeft: ''
    });

    const [debouncedName, setDebouncedName] = useState<string | null>('');

    // Debounce the name search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedName(selectedName);
        }, 300); // 300ms delay

        return () => {
            clearTimeout(timer);
        };
    }, [selectedName]);

    // Filter effect using the debounced name
    useEffect(() => {
        try {
            let filteredData = myDataStoreRef.current;

            if (selectedSpecialization) {
                const specializations = selectedSpecialization.split(',');
                filteredData = filteredData.filter((row) => {
                    return specializations.includes(row.PreferenceOne?.toLowerCase()) ||
                        specializations.includes(row.PreferenceTwo?.toLowerCase()) ||
                        specializations.includes(row.PreferenceThree?.toLowerCase());
                });
            }

            if (debouncedName) {
                filteredData = filteredData.filter((row) => {
                    return row.MentorName.toLowerCase().includes(debouncedName.toLowerCase());
                });
            }

            setRows(filteredData);
        } catch (err) {
            console.error("Error filtering data:", err);
            setError("Failed to filter data");
            setOpenSnackbar(true);
        }
    }, [selectedSpecialization, debouncedName]);

    const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const resetEmptyMentor = () => {
        setSelectedMentor({
            Mentoruid: '',
            dept_name: '',
            MentorName: '',
            School: '',
            Picture: '',
            PreferenceOne: '',
            PreferenceTwo: '',
            PreferenceThree: '',
            headline: '',
            CheakAcess: '',
            SeatLeft: ''
        });
    };

    return (
        <>
            
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>

            {loading ? <Loading /> : (
                <Box width="100%" p={isMobile ? 1 : 2}>
                    {error ? (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                            <Button color="inherit" size="small" onClick={() => window.location.reload()}>
                                Retry
                            </Button>
                        </Alert>
                    ) : (
                        <>
                            <Box mb={2}>
                                <TextField
                                    label="Search by Mentor name"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    value={selectedName || ''}
                                    sx={{
                                        borderRadius: '16px',
                                        fontWeight: 600,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '16px'
                                        }
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton size="small">
                                                    <GridSearchIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                    onChange={(e) => {
                                        setSelectedName(e.target.value);
                                    }}
                                />
                            </Box>

                            <MentorSpecialization
                                specializations={specializations}
                                selectedSpecialization={selectedSpecialization}
                                setSelectedSpecialization={setSelectedSpecialization}
                            />

                            {rows.length > 0 ? (
                                <MentorDeSubComp rows={rows} setSelectedMentor={setSelectedMentor} />
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 3 }}>
                                    <Typography variant="h6" color="textSecondary">
                                        No mentors found matching your criteria
                                    </Typography>
                                </Box>
                            )}

                            {/* Show MentorDetailsPopUp when a mentor is selected */}
                            {selectedMentor.Mentoruid && (
                                <MentorDetailsPopUp
                                    title="Mentor Details"
                                    mentor={selectedMentor}
                                    open={Boolean(selectedMentor.Mentoruid)}
                                    handleClose={resetEmptyMentor}
                                    isallowSelection={isallowSelection}
                                />
                            )}
                        </>
                    )}
                </Box>
            )}

        </>
    );
};

export default AllMentors;