import BlankCard from '@/app/components/shared/BlankCard';
import ParentCard from '@/app/components/shared/ParentCard'
import { Avatar, Box, Button, Card, CardContent, Checkbox, Chip, FormControlLabel, Grid, InputAdornment, Stack, TextField, Typography, useTheme } from '@mui/material'
import { IconCircleCheckFilled, IconRestore, IconSchool, IconSearch, IconStar, IconStarFilled } from '@tabler/icons-react';
import React, { useState,useMemo  } from 'react'

const InstructionCard = ({
    icon,
    title,
    children,
  }: {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
  }) => (
    <Card
      variant="outlined"
      sx={{
        mb: 1,
        backgroundColor: '#fdfdfd',
        alignSelf: 'flex-start',
        width: '100%',
        p: 1, 
      }}
    >
      <CardContent sx={{ p:1,  width: '100%' }}>
        <Stack direction="row" spacing={1.5} alignItems="flex-start"> 
          <Box mt={0.5}>{icon}</Box>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" mb={0.5}>
              {title}
            </Typography>
            <Typography
                variant="body2"
                component="div"
                sx={{ color: 'text.secondary', lineHeight: 1.8 }}
            >
              {children}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

const FacultyRanking = ({ onConfirmed }: { onConfirmed: (data: string,setp:string) => void  }) => {
    const theme = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
      const [isChecked, setIsChecked] = useState(false);
    const facultyList = [
        { title: 'Andrew Grant', location: 'El Salvador', avatar: '/images/profile/user-1.jpg' },
        { title: 'Leo Pratt', location: 'Bulgaria', avatar: '/images/profile/user-2.jpg' },
        { title: 'Charles Nunez', location: 'Nepal', avatar: '/images/profile/user-3.jpg' },
        { title: 'Lora Powers', location: 'Nepal', avatar: '/images/profile/user-4.jpg' },
        { title: 'Daniel Kim', location: 'India', avatar: '/images/profile/user-1.jpg' },
        { title: 'Isha Singh', location: 'India', avatar: '/images/profile/user-2.jpg' },
        { title: 'Mei Tanaka', location: 'Japan', avatar: '/images/profile/user-3.jpg' },
        { title: 'Ahmed Zayed', location: 'Egypt', avatar: '/images/profile/user-4.jpg' },
      ];

      const [rankedFaculty, setRankedFaculty] = useState<string[]>([]);

  
  const filteredFaculty = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const sorted = facultyList
      .filter((f) => f.title.toLowerCase().includes(lowerSearch))
      .sort((a, b) => {
        const aIndex = rankedFaculty.indexOf(a.title);
        const bIndex = rankedFaculty.indexOf(b.title);
        if (aIndex === -1 && bIndex === -1) return 0;
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      });
    return sorted;
  }, [searchTerm, facultyList, rankedFaculty]);

 const handleReset = () => {
    setRankedFaculty([]);
    setSearchTerm('');
  };

  const getMedal = (index: number) => {
    switch (index) {
      case 0:
        return <Chip label="🥇 1st" color="warning" />;
      case 1:
        return <Chip label="🥈 2nd" color="secondary" />;
      case 2:
        return <Chip label="🥉 3rd" color="success" />;
      case 3:
        return <Chip label="4" variant="outlined" />;
      case 4:
        return <Chip label="5" variant="outlined" />;
      default:
        return null;
    }
  };
  const handleConfirm = () => {
    if (isChecked) {
      onConfirmed('CredentialVerification','FacultyRanking');
    } else {
      alert("Please confirm you have read the information.");
    }
  };
  return (
    <>
      <ParentCard title="Faculty Feedback">
        <Grid container spacing={2}>
          <Grid size={12}>
            <InstructionCard
              icon={<IconCircleCheckFilled color="orange" size={28} />}
              title="Steps to be followed for Faculty Ranking"
            >
              <ol style={{ paddingLeft: "1rem", margin: 0 }}>
                <li>
                  Rate the selected faculty members (as shown below) from "Rank
                  1" to "Rank 5" with "Rank 1" being awarded to the faculty
                  member having the highest contribution in preparation for
                  achievement of your career goals.
                </li>
                <li>
                  To rate the faculty, click on the faculty member's name in
                  order of your preference for ranking.
                  <br />
                  i.e. The faculty wished to be chosen at "Rank 1" should be
                  clicked first, followed by faculty chosen for "Rank 2" and so
                  on.
                </li>
                <li>
                  To re-arrange a chosen Ranking set, click on "Reset" and
                  follow the above-mentioned process again.
                </li>
              </ol>
            </InstructionCard>
          </Grid>
          <Grid size={12}>
            <Card
              variant="outlined"
              sx={{
                mb: 0.5,
                backgroundColor: "#fdfdfd",
                alignSelf: "flex-start",
                p: 1,
              }}
            >
              <CardContent sx={{ p: 1, width: "100%" }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }} display={rankedFaculty.length === 0 ?'none':'block'}>
                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="flex-start"
                    >
                      <Box mt={0.5}>
                        {<IconStarFilled color="orange" size={28} />}
                      </Box>
                      <Box>
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          mb={0.5}
                        >
                          {"Ranked Faculty"}
                        </Typography>
                      </Box>
                    </Stack>
                    <Grid container spacing={3} mt={1}>
                      {rankedFaculty.map((name, index) => {
                        const card = facultyList.find((f) => f.title === name);
                        if (!card) return null;
                        return (
                          <Grid key={index} size={{ xs: 12, sm: 6, lg: 2 }}>
                            <BlankCard sx={{ height: "100%" }}>
                              <CardContent
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "space-between",
                                  height: "100%",
                                }}
                              >
                                <Box>
                                  <Box
                                    display="flex"
                                    justifyContent="center"
                                    mb={2}
                                  >
                                    <Avatar
                                      src={card.avatar}
                                      sx={{ height: 80, width: 80 }}
                                    />
                                  </Box>
                                  <Typography
                                    variant="h6"
                                    mb={1}
                                    sx={{
                                      fontSize: "0.8rem",
                                      fontWeight: 600,
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      textAlign: "center",
                                    }}
                                  >
                                    {card.title}
                                  </Typography>
                                  <Box
                                    display="flex"
                                    justifyContent="center"
                                    mt={1}
                                  >
                                    {getMedal(index)}
                                  </Box>
                                </Box>

                                <Stack spacing={1.5} mt={2}>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() =>
                                      setRankedFaculty((prev) =>
                                        prev.filter((n) => n !== card.title)
                                      )
                                    }
                                    fullWidth
                                  >
                                    Remove
                                  </Button>
                                </Stack>
                              </CardContent>
                            </BlankCard>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="flex-start"
                    >
                      <Box mt={0.5}>
                        {<IconSchool color="orange" size={28} />}
                      </Box>
                      <Box>
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          mb={0.5}
                        >
                          {"List of Faculty"}
                        </Typography>
                      </Box>
                    </Stack>
                    <Grid size={{ xs: 12 }}>
                      <Box mt={1}>
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={2}
                          justifyContent="space-between"
                          alignItems={{ xs: "stretch", sm: "center" }}
                        >
                          <TextField
                            id="search"
                            type="text"
                            size="small"
                            variant="outlined"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            fullWidth
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconSearch size={16} />
                                </InputAdornment>
                              ),
                            }}
                          />

                          <Box>
                            <Button
                              variant="contained"
                              color="primary"
                              startIcon={<IconRestore size={18} />}
                              onClick={handleReset}
                            >
                              Restore
                            </Button>
                          </Box>
                        </Stack>
                      </Box>
                    </Grid>
                    <Grid container spacing={3} mt={2}>
                      {filteredFaculty
                        .filter((f) => !rankedFaculty.includes(f.title))
                        .map((card, index) => (
                          <Grid key={index} size={{ xs: 12, sm: 6, lg: 2 }}>
                            <BlankCard sx={{ height: "100%" }}>
                              <CardContent
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "space-between",
                                  height: "100%",
                                }}
                              >
                                <Box>
                                  <Box
                                    display="flex"
                                    justifyContent="center"
                                    mb={2}
                                  >
                                    <Avatar
                                      src={card.avatar}
                                      sx={{ height: 80, width: 80 }}
                                    />
                                  </Box>
                                  <Typography
                                    variant="h6"
                                    mb={1}
                                    sx={{
                                      fontSize: "0.8rem",
                                      fontWeight: 600,
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      textAlign: "center",
                                    }}
                                  >
                                    {card.title}
                                  </Typography>
                                </Box>

                                <Stack spacing={1.5} mt={2}>
                                  <Button
                                    size="small"
                                    variant="contained"
                                    color="primary"
                                    onClick={() =>
                                      rankedFaculty.length < 5 &&
                                      setRankedFaculty((prev) => [
                                        ...prev,
                                        card.title,
                                      ])
                                    }
                                    fullWidth
                                  >
                                    Add
                                  </Button>
                                </Stack>
                              </CardContent>
                            </BlankCard>
                          </Grid>
                        ))}
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="left"
              flexDirection="column"
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                    name="confirmRead"
                  />
                }
                label="I confirm that I have ranked the faculty based on my academic experience"
              />
              <Button
                variant="contained"
                onClick={handleConfirm}
                disabled={!isChecked}
                sx={{width:'100px'}}
              >
                Confirm
              </Button>
            </Box>
          </Grid>
        </Grid>
      </ParentCard>
    </>
  );
}

export default FacultyRanking
