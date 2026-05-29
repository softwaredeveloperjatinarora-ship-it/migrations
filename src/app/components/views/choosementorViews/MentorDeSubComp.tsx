
import { Box, Stack, useMediaQuery, CircularProgress } from '@mui/material'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
    Typography,
    TableHead,
    Avatar,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TableContainer,
    Button,
} from "@mui/material";
import theme from '@/utils/theme';
import { MentorDetailsProps } from '../../../api/interfaces/studentdashboard/MentorInterFace';


interface MentorDeSubCompProps {
    rows: MentorDetailsProps[],
    setSelectedMentor: React.Dispatch<React.SetStateAction<MentorDetailsProps>>;
    fetchMoreData?: () => Promise<MentorDetailsProps[]>; // Function to fetch more data
    hasMore?: boolean; // Boolean to check if more data is available
}

const MentorDeSubComp = React.memo(({ 
    rows: initialRows, 
    setSelectedMentor,
    fetchMoreData,
    hasMore = false
}: MentorDeSubCompProps) => {
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [rows, setRows] = useState<MentorDetailsProps[]>(initialRows);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const loaderRef = useRef(null);
    
    // Custom scrollbar styles
    const scrollbarStyles = {
        '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
        },
        '&::-webkit-scrollbar-track': {
            backgroundColor: '#f1f1f1',
            borderRadius: '10px'
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#c1c1c1',
            borderRadius: '10px',
            '&:hover': {
                backgroundColor: '#a8a8a8'
            }
        }
    };

    // Load more data when scrolled to bottom
    const handleObserver = useCallback((entries: any[]) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loading) {
            loadMoreItems();
        }
    }, [hasMore, loading]);

    // Set up intersection observer
    useEffect(() => {
        const observer = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: '20px',
            threshold: 1.0
        });
        
        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }
        
        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, [handleObserver]);

    // Load more items when scrolled to bottom
    const loadMoreItems = async () => {
        if (!fetchMoreData || loading) return;
        
        setLoading(true);
        try {
            const newData = await fetchMoreData();
            if (newData && newData.length > 0) {
                setRows(prevRows => [...prevRows, ...newData]);
                setPage(prevPage => prevPage + 1);
            }
        } catch (error) {
            console.error("Error loading more mentors:", error);
        } finally {
            setLoading(false);
        }
    };

    // Update rows when initialRows change
    useEffect(() => {
        setRows(initialRows);
    }, [initialRows]);

    return (
        <Box>
            {isMobile ? (
                // Mobile View - Card-like list with scrollable container
                <Box 
                    sx={{
                        maxHeight: '70vh',
                        overflowY: 'auto',
                        px: 1,
                        ...scrollbarStyles
                    }}
                >
                    {rows.map((row) => (
                        <Box
                            key={row.Mentoruid}
                            sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                                mb: 2,
                                p: 2,
                                boxShadow: 1
                            }}
                        >
                            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                                <Avatar
                                    src={`data:image/jpeg;base64,${row.Picture}`}
                                    alt={row.MentorName}
                                    sx={{
                                        width: 50,
                                        height: 50,
                                        border: "1px solid #f0f0f0"
                                    }}
                                />
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="600">
                                        {row.MentorName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        ID: {row.Mentoruid}
                                    </Typography>
                                </Box>
                            </Stack>

                            <Box mb={2}>
                                <Typography variant="body2" fontWeight="600" mb={1} component="div">
                                    Available Count:
                                    <Chip
                                        label={row.SeatLeft}
                                        size="small"
                                        color="primary"
                                        sx={{ ml: 1 }}
                                    />
                                </Typography>

                                <Typography variant="body2" fontWeight="600" mb={1} component="div">
                                    Specializations:
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {row.PreferenceOne && (
                                        <Chip
                                            label={row.PreferenceOne}
                                            color="primary"
                                            variant="outlined"
                                            size="small"
                                            sx={{ borderRadius: '16px' }}
                                        />
                                    )}
                                    {row.PreferenceTwo && (
                                        <Chip
                                            label={row.PreferenceTwo}
                                            color="secondary"
                                            variant="outlined"
                                            size="small"
                                            sx={{ borderRadius: '16px' }}
                                        />
                                    )}
                                    {row.PreferenceThree && (
                                        <Chip
                                            label={row.PreferenceThree}
                                            color="success"
                                            variant="outlined"
                                            size="small"
                                            sx={{ borderRadius: '16px' }}
                                        />
                                    )}
                                </Box>
                            </Box>

                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{
                                    borderRadius: '16px',
                                    fontWeight: 600
                                }}
                                onClick={() => {
                                    setSelectedMentor({
                                        Mentoruid: row.Mentoruid,
                                        dept_name: row.dept_name || '',
                                        MentorName: row.MentorName,
                                        School: row.School || '',
                                        Picture: row.Picture || '',
                                        PreferenceOne: row.PreferenceOne || '',
                                        PreferenceTwo: row.PreferenceTwo || '',
                                        PreferenceThree: row.PreferenceThree || '',
                                        headline: row.headline || '',
                                        CheakAcess: row.CheakAcess || '',
                                        SeatLeft: row.SeatLeft || ''
                                    })
                                }}
                            >
                                View Profile
                            </Button>
                        </Box>
                    ))}
                    {/* Loading indicator and observer element */}
                    <Box ref={loaderRef} sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                        {loading && <CircularProgress size={30} />}
                    </Box>
                </Box>
            ) : (
                // Desktop View - Table with scrollable container
                <TableContainer 
                    sx={{ 
                        maxHeight: '70vh', 
                        overflowY: 'auto',
                        ...scrollbarStyles
                    }}
                >
                    <Table
                        aria-label="mentors table"
                        sx={{
                            whiteSpace: "nowrap",
                            minWidth: "100%",
                        }}
                        stickyHeader
                    >
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "rgba(0, 0, 0, 0.03)" }}>
                                <TableCell width="15%">
                                    <Typography variant="h6">Id</Typography>
                                </TableCell>
                                <TableCell width="25%">
                                    <Typography variant="h6">Name</Typography>
                                </TableCell>
                                <TableCell width="15%">
                                    <Typography variant="h6">Available Count</Typography>
                                </TableCell>
                                <TableCell width="45%">
                                    <Typography variant="h6">Specialization</Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow
                                    key={row.Mentoruid}
                                    hover
                                    sx={{
                                        "&:hover": {
                                            backgroundColor: "rgba(0, 0, 0, 0.04)"
                                        },
                                        height: "80px" // Fixed height for rows
                                    }}
                                >
                                    <TableCell>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 500 }} component="div">{row.Mentoruid}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar
                                                src={`data:image/jpeg;base64,${row.Picture}`}
                                                alt={row.MentorName}
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    border: "1px solid #f0f0f0"
                                                }}
                                            />
                                            <Typography variant="subtitle2" fontWeight="600" component="div">
                                                {row.MentorName}
                                            </Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Box
                                            sx={{
                                                backgroundColor: "primary.light",
                                                color: "primary.main",
                                                borderRadius: "16px",
                                                px: 2,
                                                py: 0.5,
                                                display: "inline-block",
                                                textAlign: "center",
                                                minWidth: "36px",
                                              
                                            }}
                                        >
                                            <Typography variant="h6" fontWeight="600"  component="div">
                                                {row.SeatLeft}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Stack
                                            direction="row"
                                            sx={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: 1,
                                                width: '100%',
                                                alignItems: "center",
                                                justifyContent: "flex-start"
                                            }}
                                        >
                                            {row.PreferenceOne && (
                                                <Chip
                                                    label={row.PreferenceOne}
                                                    color="primary"
                                                    variant="outlined"
                                                    size={isMobile ? "small" : "medium"}
                                                    sx={{
                                                        borderRadius: '16px',
                                                        fontWeight: 600,
                                                        m: 0.5,
                                                        px: 1
                                                    }}
                                                />
                                            )}
                                            {row.PreferenceTwo && (
                                                <Chip
                                                    label={row.PreferenceTwo}
                                                    color="primary"
                                                    variant="outlined"
                                                    size={isMobile ? "small" : "medium"}
                                                    sx={{
                                                        borderRadius: '16px',
                                                        fontWeight: 600,
                                                        m: 0.5,
                                                        px: 1
                                                    }}
                                                />
                                            )}
                                            {row.PreferenceThree && (
                                                <Chip
                                                    label={row.PreferenceThree}
                                                    color="primary"
                                                    variant="outlined"
                                                    size={isMobile ? "small" : "medium"}
                                                    sx={{
                                                        borderRadius: '16px',
                                                        fontWeight: 600,
                                                        m: 0.5,
                                                        px: 1
                                                    }}
                                                />
                                            )}
                                            <Box sx={{ flexGrow: 1 }}></Box>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                sx={{
                                                    borderRadius: '16px',
                                                    fontWeight: 600,
                                                    m: 0.5,
                                                    px: 1,
                                                    ml: 'auto'
                                                }}
                                                onClick={() => {
                                                    setSelectedMentor({
                                                        Mentoruid: row.Mentoruid,
                                                        dept_name: row.dept_name || '',
                                                        MentorName: row.MentorName,
                                                        School: row.School || '',
                                                        Picture: row.Picture || '',
                                                        PreferenceOne: row.PreferenceOne || '',
                                                        PreferenceTwo: row.PreferenceTwo || '',
                                                        PreferenceThree: row.PreferenceThree || '',
                                                        headline: row.headline || '',
                                                        CheakAcess: row.CheakAcess || '',
                                                        SeatLeft: row.SeatLeft || ''
                                                    })
                                                }}
                                            >
                                                View Profile
                                            </Button>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {/* Loading indicator and observer element */}
                    <Box ref={loaderRef} sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                        {loading && <CircularProgress size={30} />}
                    </Box>
                </TableContainer>
            )}
        </Box>
    )
});

export default MentorDeSubComp
