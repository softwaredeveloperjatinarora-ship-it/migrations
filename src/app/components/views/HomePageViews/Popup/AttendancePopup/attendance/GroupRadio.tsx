
import { Chip, FormControlLabel, Radio, RadioGroup, SelectChangeEvent, useTheme } from '@mui/material'
import { grey } from '@mui/material/colors'
import { useEffect } from 'react';




function GroupRadio({ courseCode, selectedCourse, setSelectedCourse }: { courseCode: string[], selectedCourse: String, setSelectedCourse: React.Dispatch<React.SetStateAction<string>> }) {
    const theme = useTheme();
    const handleChange = (event: SelectChangeEvent) => {
        setSelectedCourse(event.target.value);
    };

    const scrollCoursePage = (selectedCourse: any) => {
        const el = document.getElementById(`row-${selectedCourse}`);
        selectedCourse == 'Top' ? (el?.scrollIntoView({ behavior: 'instant', block: 'start' })) : (el?.scrollIntoView({ behavior: 'smooth', block: 'center' }));

    }
    useEffect(() => scrollCoursePage(selectedCourse), [selectedCourse])

    return (
        <RadioGroup row
            value={selectedCourse}
            onChange={(e) => handleChange(e)}
            sx={{
                width: 'max-content',
                padding: 1,
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
                gap: 1.5,



            }}
        >
            {courseCode.map((course, i) => (
                <FormControlLabel
                    key={i}
                    value={course}
                    control={
                        <Radio
                            sx={{
                                display: 'none',
                            }}
                        />
                    }
                    label={
                        <Chip
                            onClick={() => scrollCoursePage(course)}
                            label={course}
                            color={selectedCourse == course ? 'primary' : 'default'}
                            size="medium"
                            sx={{
                                bgcolor: selectedCourse == course ? theme.palette.primary.main : theme.palette.grey[300],
                                fontWeight: 600,
                                letterSpacing: '.05em',
                                px: 1,

                                borderRadius: .7,
                                '&:hover': {
                                    backgroundColor: selectedCourse != course ? grey[400] : undefined
                                }
                            }}
                        />
                    }
                    sx={{
                        m: 0,
                        p: 0,
                    }}
                />
            ))}
        </RadioGroup>
    )
}

export default GroupRadio