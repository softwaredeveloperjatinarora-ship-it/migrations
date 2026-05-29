"use client";
import PageContainer from "@/app/components/container/PageContainer";
import BlankCard from "@/app/components/shared/BlankCard";
import ChildCard from "@/app/components/shared/ChildCard";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Badge,
  Box,
  Chip,
  CircularProgress,
  Dialog,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import {
  IconAlertTriangle,
  IconAward,
  IconBook,
  IconBookmark,
  IconCertificate,
  IconCertificate2,
  IconCheck,
  IconChevronDown,
  IconFlag,
  IconHelpCircle,
  IconMedal,
  IconMinus,
  IconMoodCry,
  IconRepeat,
  IconStar,
  IconTrophy,
  IconX,
} from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import ResultTabs from "./ResultTabs";
import StuGradeInfoPopUp from "./popUp/StuGradeInfoPopUp";
import Link from "next/link";
import { getStudentGradeCountAction } from "@/app/actions/examination/student result/getstudentgardecountAction";
import { decryptDataforResponse } from "@/app/api/services/auth/Encrptdecrpt";
import {
  StudentDefaulterStatus,
  StudentGradeCount,
  StudentGrades,
} from "@/app/api/interfaces/Examination/stutgpasummary";
import { useSession } from "next-auth/react";
import { IconRefresh } from "@tabler/icons-react";
import { getStudentGradeDetailsAction } from "@/app/actions/examination/student result/getstudentgradedetailsAction";
import { useSelector } from "react-redux";
import { ProfileState } from "@/store/store";
import { getStudentDefaulterStatusAction } from "@/app/actions/examination/student result/getstudentdefaulterstatusAction";
import StudentDefaulter from "./StudentDefaulter";

type GradeRecord = {
  GradeNum: number;
  Grade: string;
  RecordCount: number;
};
const StudentGradeView = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;

  //PopUp
  const [open, setOpen] = useState(false);
  const [CourseCode, setCourseCode] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [grade, setGrade] = useState<StudentGradeCount[]>([]);
  const [coursewiseGrade, setCoursewiseGrade] = useState<StudentGrades[]>([]);
  const [filterGrade, setFilterGrade] = useState<StudentGrades[]>([]);
  const { data: session } = useSession();
  const [studentDefaulter, setStudentDefaulter] = useState<
    StudentDefaulterStatus[] | null
  >(null);
  const [loading, setLoading] = useState(true);
  // controlled accodion
  const [expanded, setExpanded] = useState<string[]>(
    coursewiseGrade.map((_, i) => `panel${i}`)
  );

  const profilee = useSelector((state: ProfileState) => state.profile) as {
    profileData: {
      cgpa: string;
      gender: string;
    }[];
  };
  useEffect(() => {
    const fetchStudentDefaulterStatus = async () => {
      try {
        setLoading(true);
        const res = await getStudentDefaulterStatusAction(
        );
        let splitValue = String(session?.user?.token).split("NEXT2121ANG");
        const decData = decryptDataforResponse(res.ApiData, splitValue[1]);
        const parsedData = JSON.parse(decData);
        if (parsedData && Array.isArray(parsedData) && parsedData.length > 0) {
          setStudentDefaulter(parsedData);
        } else {
          fetchGradeCount();
          fetchGradeDetails();
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchStudentDefaulterStatus();
  }, []);

  const fetchGradeCount = async () => {
    try {
      const res = await getStudentGradeCountAction();
      let splitValue = String(session?.user?.token).split("NEXT2121ANG");
      const decData = decryptDataforResponse(res.ApiData, splitValue[1]);
      const parsedData = JSON.parse(decData);
      setGrade(parsedData);
    } catch (error) {
      console.error("Error", error);
    }
  };
  const fetchGradeDetails = async () => {
    try {
      const res = await getStudentGradeDetailsAction();
      let splitValue = String(session?.user?.token).split("NEXT2121ANG");
      const decData = decryptDataforResponse(res.ApiData, splitValue[1]);
      const parsedData = JSON.parse(decData);
      setCoursewiseGrade(parsedData);
      setFilterGrade(parsedData);
      setExpanded(parsedData.map((_: any, i: number) => `panel${i}`));
      // console.log(parsedData);
    } catch (error) {}
  };
  const gradeIcons = [
    { label: "O", icon: <IconStar size={18} /> },
    { label: "A+", icon: <IconAward size={18} /> },
    { label: "A", icon: <IconTrophy size={18} /> },
    { label: "B+", icon: <IconMedal size={18} /> },
    { label: "B", icon: <IconCertificate size={18} /> },
    { label: "B-", icon: <IconCertificate size={18} /> },
    { label: "C", icon: <IconBook size={18} /> },
    { label: "C-", icon: <IconBook size={18} /> },
    { label: "D", icon: <IconBookmark size={18} /> },
    { label: "E", icon: <IconAlertTriangle size={18} /> },
    { label: "F", icon: <IconMoodCry size={18} /> },
    { label: "FAIL", icon: <IconX size={18} /> },
    { label: "G", icon: <IconMinus size={18} /> },
    { label: "I", icon: <IconHelpCircle size={18} /> },
    { label: "M", icon: <IconFlag size={18} /> },
    { label: "PASS", icon: <IconCheck size={18} /> },
    { label: "R", icon: <IconRepeat size={18} /> },
    { label: "ReApp", icon: <IconRefresh size={18} /> },
    { label: "S", icon: <IconCertificate size={18} /> },
    { label: "U", icon: <IconCertificate size={18} /> },
  ];

  const gradeIconMap = new Map(
    gradeIcons.map(({ label, icon }) => [label, icon])
  );
  const filteredGrades = grade
    .filter((grade) => gradeIconMap.has(grade.Grade))
    .map((grade) => ({
      label: grade.Grade,
      count: grade.RecordCount,
      icon: gradeIconMap.get(grade.Grade),
    }));
  const totalCount = grade.reduce((sum, grade) => sum + grade.RecordCount, 0);

  const handleChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded((prev) =>
        isExpanded ? [...prev, panel] : prev.filter((p) => p !== panel)
      );
    };
  const handleFilter = (grade: string) => {
    if (grade === "All") {
      setCoursewiseGrade(filterGrade);
    } else {
      const filteredData = filterGrade
        .map((item) => {
          const filteredCourses = item.Courses.filter(
            (course) => course.Grade?.toLowerCase() === grade.toLowerCase()
          );

          return {
            ...item,
            Courses: filteredCourses,
          };
        })
        .filter((item) => item.Courses.length > 0);

      // console.log(filteredData);
      setCoursewiseGrade(filteredData);
    }
  };

  const primarylight = theme.palette.primary.light;
  const error = theme.palette.error.main;
  const errorlight = theme.palette.error.light;
  const warning = theme.palette.warning.main;
  const warninglight = theme.palette.warning.light;
  const secondary = theme.palette.secondary.main;
  const secondarylight = theme.palette.secondary.light;
  const sucess = theme.palette.success.main;
  const sucesslight = theme.palette.success.light;

  const note =
    "Disclaimer: This result is issued on the basis of information available in the office of records on the date of its issue and the University reserves the right to update/change any information contained here in without further notice. The University expressly disclaims all obligations to confirm the accuracy of any of the particulars in this result based upon information submitted by the candidate. For any Result/Mapping query Consult Examination Division RoomNo Examination [32-102]";

  return (
    <>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <PageContainer title="Result Summary" description="Result Summary">
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              {/* <ResultTabs isVisible={studentDefaulter ? false : true} /> */}
            </Grid>
          </Grid>
          {studentDefaulter ? (
            <StudentDefaulter
              Description={studentDefaulter[0].Description}
              OfficeAddress={studentDefaulter[0].OfficeAddress}
              gender={profilee.profileData[0]?.gender}
            />
          ) : (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Stack
                  direction="row"
                  spacing={{ xs: 1, sm: 1, md: 0.5 }}
                  alignItems="left"
                  justifyContent="left"
                  sx={{
                    p: { xs: 1, sm: 1, md: 2 },
                    bgcolor: "background.paper",
                    borderRadius: "12px",
                    boxShadow: 2,
                    flexWrap: "wrap",
                    width: "100%",
                    gap: { xs: 1, sm: 2 },
                  }}
                >
                  <Badge
                    badgeContent={totalCount}
                    sx={{
                      "& .MuiBadge-badge": {
                        fontSize: { xs: "0.75rem", sm: "1rem" },
                        fontWeight: "bold",
                        bgcolor: (theme) => theme.palette.primary.light,
                        color: (theme) => theme.palette.primary.main,
                        width: { xs: 22, sm: 26 },
                        height: { xs: 22, sm: 26 },
                        borderRadius: "50%",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      },
                    }}
                    onClick={() => {
                      handleFilter("All");
                    }}
                  >
                    <Chip
                      label="All"
                      variant="filled"
                      sx={{
                        fontSize: { xs: "0.8rem", sm: "1rem" },
                        fontWeight: "bold",
                        minWidth: { xs: 50, sm: 80 },
                        px: { xs: 1, sm: 2 },
                        bgcolor: (theme) => theme.palette.primary.light,
                        color: (theme) => theme.palette.primary.main,
                        cursor: "pointer",
                      }}
                    />
                  </Badge>
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                      height: { xs: 20, sm: 30 },
                      mx: { xs: 0.5, sm: 1 },
                      display: { xs: "none", sm: "block" },
                    }}
                  />

                  {/* Grade Chips */}
                  {filteredGrades.map((grade) => (
                    <Badge
                      key={grade.label}
                      badgeContent={grade.count}
                      sx={{
                        "& .MuiBadge-badge": {
                          fontSize: { xs: "0.75rem", sm: "1rem" },
                          fontWeight: "bold",
                          bgcolor: (theme) => theme.palette.secondary.light,
                          color: (theme) => theme.palette.secondary.main,
                          width: { xs: 22, sm: 26 },
                          height: { xs: 22, sm: 26 },
                          borderRadius: "50%",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        },
                      }}
                      onClick={() => {
                        handleFilter(grade.label);
                      }}
                    >
                      <Chip
                        label={grade.label}
                        variant="filled"
                        icon={grade.icon}
                        sx={{
                          fontSize: { xs: "0.8rem", sm: "1rem" },
                          fontWeight: "bold",
                          minWidth: { xs: 45, sm: 70 },
                          px: { xs: 1, sm: 2 },
                          bgcolor: (theme) => theme.palette.secondary.light,
                          color: (theme) => theme.palette.secondary.main,
                          cursor: "pointer",
                        }}
                      />
                    </Badge>
                  ))}
                </Stack>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <BlankCard>
                  <ChildCard title="Grade Distribution">
                    {coursewiseGrade.map((grade, index) => (
                      <Accordion
                        expanded={expanded.includes(`panel${index}`)}
                        onChange={handleChange(`panel${index}`)}
                        key={index}
                      >
                        <AccordionSummary
                          expandIcon={<IconChevronDown />}
                          aria-controls="panel1bh-content"
                          id="panel1bh-header"
                          key={index}
                          sx={{
                            flexDirection: "row-reverse",
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Avatar
                              sx={{
                                bgcolor: "white",
                                color: "white",
                                width: 36,
                                height: 36,
                                fontSize: "1rem",
                              }}
                            >
                              📚
                            </Avatar>
                            <Typography variant="h6" fontWeight="bold">
                              Term ID: {grade.TermId}
                            </Typography>
                          </Box>
                          <Chip
                            label={`TGPA: ${grade.Tgpa}`}
                            sx={{
                              bgcolor: primarylight,
                              color: primary,
                              fontSize: "1rem",
                              fontWeight: "bold",
                              padding: "8px 12px",
                              borderRadius: "16px",
                              ml: "auto",
                            }}
                          />
                        </AccordionSummary>
                        <AccordionDetails>
                          <Stack spacing={2} mt={0.5}>
                            {grade.Courses.map((course, i) => (
                              <Stack
                                direction="row"
                                spacing={3}
                                justifyContent="space-between"
                                alignItems="center"
                                key={i}
                              >
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={2}
                                >
                                  <Avatar
                                    variant="rounded"
                                    sx={{
                                      bgcolor: secondarylight,
                                      color: secondary,
                                      width: 40,
                                      height: 40,
                                    }}
                                  >
                                    <IconCertificate2 width={20} />
                                  </Avatar>
                                  <Box>
                                    <Typography variant="h6" mb="4px">
                                      {course.Course}
                                    </Typography>
                                    <Typography
                                      variant="subtitle2"
                                      color="textSecondary"
                                    >
                                      Creadit-{course.Credit}.00
                                      <Typography
                                        variant="caption"
                                        ml={1}
                                        mr={1}
                                      >
                                        |
                                      </Typography>
                                      <Link
                                        style={{
                                          color: primary,
                                          textDecoration: "underline",
                                        }}
                                        onClick={() => {
                                          setCourseCode(course.Course);
                                          handleOpen();
                                        }}
                                        href={""}
                                      >
                                        View Detail
                                      </Link>
                                    </Typography>
                                  </Box>
                                </Stack>
                                <Avatar
                                  variant="rounded"
                                  sx={{
                                    bgcolor: [
                                      "E",
                                      "F",
                                      "G",
                                      "FAIL",
                                      "I",
                                      "R",
                                      "ReApp",
                                    ].includes(course.Grade)
                                      ? errorlight
                                      : secondarylight,
                                    color: [
                                      "E",
                                      "F",
                                      "G",
                                      "FAIL",
                                      "I",
                                      "R",
                                      "ReApp",
                                    ].includes(course.Grade)
                                      ? error
                                      : secondary,
                                    width: 40,
                                    height: 40,
                                  }}
                                >
                                  {course.Grade.length === 2 ? (
                                    <>
                                      {course.Grade[0]}
                                      <sup style={{ fontSize: "0.9em" }}>
                                        {course.Grade[1]}
                                      </sup>
                                    </>
                                  ) : (
                                    course.Grade
                                  )}
                                </Avatar>
                              </Stack>
                            ))}
                          </Stack>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                    <footer
                      style={{
                        marginTop: "8px",
                        fontWeight: "bold",
                        textAlign: "justify",
                        textJustify: "inter-word",
                      }}
                    >
                      {note}
                    </footer>
                  </ChildCard>
                </BlankCard>
              </Grid>
            </Grid>
          )}

          <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <StuGradeInfoPopUp
              open={open}
              handleClose={handleClose}
              title={CourseCode}
            />
          </Dialog>
        </PageContainer>
      )}
    </>
  );
};

export default StudentGradeView;
