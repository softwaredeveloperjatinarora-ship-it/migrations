"use client";
import PageContainer from "@/app/components/container/PageContainer";
import {
  IconCalendar,
  IconChevronDown,
  IconInfoCircle,
  IconMapPin,
  IconMedal,
  IconReportAnalytics,
} from "@tabler/icons-react";
import React, { useEffect, useState } from "react";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Dialog,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import ResultTabs from "./ResultTabs";
import Scrollbar from "@/app/components/custom-scroll/Scrollbar";
import BlankCard from "@/app/components/shared/BlankCard";
import ChildCard from "@/app/components/shared/ChildCard";
import { useTheme } from "@mui/material/styles";
import StuOMRScrutiny from "./popUp/StuOMRScrutiny";
import Link from "next/link";
import StuSubjectiveScrutiny from "./popUp/StuSubjectiveScrutiny";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { getStudentMarksDetailAction } from "@/app/actions/examination/student result/getstumarksdetailAction";
import { useSession } from "next-auth/react";
import { decryptDataforResponse, encryptData } from "@/app/api/services/auth/Encrptdecrpt";
import {
  StudentMarksDetails,
  StudentTermId,
} from "@/app/api/interfaces/Examination/stumarksdetails";
import { getStudentTermIdAction } from "@/app/actions/examination/student result/getstudenttermidAction";
import { StudentDefaulterStatus } from "@/app/api/interfaces/Examination/stutgpasummary";
import { getStudentDefaulterStatusAction } from "@/app/actions/examination/student result/getstudentdefaulterstatusAction";
import StudentDefaulter from "./StudentDefaulter";
import { useSelector } from "react-redux";
import { ProfileState } from "@/store/store";
const StuMarksView = () => {
  const { data: session } = useSession();
  const [courseCode, setCourseCode] = useState<string>();
  const [examAttendance, setExamAttendance] = useState<string>();
  const [roomNo, setRoomNo] = useState<string>();
  const [examType, setExamType] = useState<string>();

  const [open, setOpen] = useState(false);
  const [courses, setcourses] = useState<StudentMarksDetails[]>([]);
  const [termId, setTermId] = useState<StudentTermId[]>([]);
  const [selectTermId, setSelectTermId] = useState<string>();
  const [state, setState] = useState<{
    loading: boolean;
    success: boolean;
    error: boolean | null;
  }>({
    loading: false,
    success: false,
    error: null,
  });
  const [studentDefaulter, setStudentDefaulter] = useState<
    StudentDefaulterStatus[] | null
  >(null);

  // controlled accodion
  const [expanded, setExpanded] = useState<string[]>(
    courses.map((_, i) => `panel${i}`)
  );
  //PopUp
  const handleOpen = (Component: React.ElementType) => {
    setDialogComponent(() => Component);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const [DialogComponent, setDialogComponent] =
    useState<React.ElementType | null>(null);

  const profilee = useSelector((state: ProfileState) => state.profile) as {
    profileData: {
      cgpa: string;
      gender: string;
    }[];
  };
  
  useEffect(() => {
    const fetchStudentDefaulterStatus = async () => {
      try {
        setState({ loading: true, success: false, error: null });
        const res = await getStudentDefaulterStatusAction();
        let splitValue = String(session?.user?.token).split("NEXT2121ANG");
        const decData = decryptDataforResponse(res.ApiData, splitValue[1]);
        const parsedData = JSON.parse(decData);
        if (parsedData && Array.isArray(parsedData) && parsedData.length > 0) {
          setStudentDefaulter(parsedData);
        } else {
          fetchStudentTermId();
        }
      } catch (error) {
        setState({ loading: false, success: false, error: true });
      } finally {
        setState({ loading: false, success: false, error: null });
      }
    };

    fetchStudentDefaulterStatus();
  }, []);
  const fetchStudentTermId = async () => {
    try {
      setState({ loading: true, success: false, error: null });
      const res = await getStudentTermIdAction();
      let splitValue = String(session?.user?.token).split("NEXT2121ANG");
      const decryptData = decryptDataforResponse(res.ApiData, splitValue[1]);
      const parsedData = JSON.parse(decryptData);
      setTermId(parsedData);
      if (parsedData.length > 0) {
        setSelectTermId(parsedData[parsedData.length - 1].TermId);
        fetchData(parsedData[parsedData.length - 1].TermId);
      }
    } catch (error) {
      setState({ loading: false, success: false, error: true });
    } finally {
      setState({ loading: false, success: false, error: null });
    }
  };
  const fetchData = async (TermId: string) => {
    try {
      const formfields = {
        Vid: 0,
        TermId: TermId || null,
        courseCode: courseCode || null,
      };
      if (!session?.user?.token) {
        throw new Error("Token is undefined");
      }
      let splitValue = session.user.token.split("NEXT2121ANG");
      const credentialsJson = JSON.stringify(formfields);
      //EncrytData
      const { Data } = encryptData(credentialsJson, splitValue[1]);
      const res = await getStudentMarksDetailAction(Data);
      // console.log("Response: ", res);
      //   console.log("Data: ", Data);
      const parseData = JSON.parse(
        decryptDataforResponse(res.ApiData, splitValue[1])
      );
      // console.log("Data in fetchData: ", parseData);
      setcourses(parseData);
      setExpanded(parseData.map((_: any, i: number) => `panel${i}`));
      // console.log(parseData);
    } catch (error) {
      setState({ loading: false, success: false, error: true });
    }
  };

  const handleChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded((prev) =>
        isExpanded ? [...prev, panel] : prev.filter((p) => p !== panel)
      );
    };

  const theme = useTheme();
  const primary = theme.palette.primary.main;

  return (
    <>
      {state.loading ? (
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
                  alignItems="center"
                  sx={{
                    p: { xs: 1, sm: 1, md: 2 },
                    bgcolor: "background.paper",
                    borderRadius: "12px",
                    boxShadow: 2,
                    width: "100%",
                    overflow: "hidden",
                  }}
                >
                  <Chip
                    label={selectTermId}
                    variant="filled"
                    icon={<IconMedal size={18} />}
                    sx={{
                      fontSize: { xs: "0.8rem", sm: "1rem" },
                      fontWeight: "bold",
                      minWidth: { xs: 45, sm: 70 },
                      px: { xs: 1, sm: 2 },
                      bgcolor: (theme) => theme.palette.primary.light,
                      color: (theme) => theme.palette.primary.main,
                      flexShrink: 0,
                    }}
                  />
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                      height: { xs: 20, sm: 30 },
                      mx: { xs: 0.5, sm: 1 },
                      display: { xs: "none", sm: "block" },
                    }}
                  />
                  <Scrollbar
                    sx={{
                      overflowX: "auto",
                      whiteSpace: "nowrap",
                      width: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        whiteSpace: "nowrap",
                        gap: { xs: 1, sm: 2 },
                        ml: 1,
                      }}
                    >
                      {termId.map((termid, index) => (
                        <Chip
                          key={index}
                          label={termid.TermId}
                          variant="filled"
                          icon={<IconMedal size={18} />}
                          onClick={() => {
                            fetchData(termid.TermId);
                            setSelectTermId(termid.TermId);
                          }}
                          sx={{
                            fontSize: { xs: "0.8rem", sm: "1rem" },
                            fontWeight: "bold",
                            minWidth: { xs: 45, sm: 70 },
                            px: { xs: 1, sm: 2 },
                            bgcolor: (theme) => theme.palette.secondary.light,
                            color: (theme) => theme.palette.secondary.main,
                            flexShrink: 0,
                          }}
                        />
                      ))}
                    </Box>
                  </Scrollbar>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <BlankCard>
                  <ChildCard
                    title={`Marks Distribution for Term ${selectTermId}`}
                  >
                    {courses.map((exam, index) => (
                      <Accordion
                        expanded={expanded.includes(`panel${index}`)}
                        onChange={handleChange(`panel${index}`)}
                        key={index}
                      >
                        <AccordionSummary
                          expandIcon={<IconChevronDown />}
                          aria-controls="panel1bh-content"
                          id="panel1bh-header"
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
                              {exam.CourseCode + ":" + exam.CourseName}
                            </Typography>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2}>
                            {exam.Assessment.map((item, i) => (
                              <Grid
                                key={i}
                                size={{ sm: 6, md: 3, xs: 12, lg: 3 }}
                              >
                                <Stack
                                  direction="row"
                                  alignItems="flex-start"
                                  spacing={1}
                                >
                                  <Avatar
                                    variant="rounded"
                                    sx={{
                                      bgcolor: "#E3F2FD",
                                      color: "#1976D2",
                                      width: 40,
                                      height: 40,
                                      marginTop: "4px",
                                    }}
                                  >
                                    <IconReportAnalytics width={25} />
                                  </Avatar>
                                  <Box>
                                    <Typography
                                      variant="subtitle1"
                                      fontWeight="bold"
                                    >
                                      {item.ExamTypeDesc}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="textSecondary"
                                    >
                                      Marks: <strong>{item.MarksObt}</strong> /{" "}
                                      {item.MaxMarks}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="textSecondary"
                                    >
                                      Weighted:{" "}
                                      <strong>{item.WMarksObt}</strong> /{" "}
                                      {item.wMaxMarks}
                                    </Typography>
                                    {item.ExamTypeDesc ===
                                      "Objective Type End Term" && (
                                      <Stack
                                        direction="row"
                                        alignItems="center"
                                        spacing={0.5}
                                        mt={0.2}
                                      >
                                        <Chip
                                          label={item.ExamAttendance}
                                          size="small"
                                          icon={
                                            <CheckCircleIcon
                                              style={{
                                                fontSize: 16,
                                                color: "#2e7d32",
                                              }}
                                            />
                                          }
                                          sx={{
                                            backgroundColor: "#e8f5e9",
                                            color: "#388e3c",
                                            fontWeight: 600,
                                            height: "24px",
                                            padding: "2px 6px",
                                            fontSize: "12px",
                                            borderRadius: "10px",
                                            "& .MuiChip-icon": {
                                              marginLeft: "-2px",
                                            },
                                          }}
                                        />
                                        <Typography variant="caption">
                                          |
                                        </Typography>
                                        <Box
                                          sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 0.5,
                                          }}
                                        >
                                          <Typography
                                            variant="body2"
                                            color="textSecondary"
                                          >
                                            <Link
                                              href={"#"}
                                              style={{
                                                color: primary,
                                                textDecoration: "underline",
                                              }}
                                              onClick={() => {
                                                setCourseCode(
                                                  exam.CourseCode +
                                                    ":" +
                                                    exam.CourseName
                                                );
                                                setExamAttendance(
                                                  item.ExamAttendance
                                                );
                                                setRoomNo(item.RoomNo);
                                                setExamType(item.ExamType);
                                                handleOpen(StuOMRScrutiny);
                                              }}
                                            >
                                              View more...
                                            </Link>
                                          </Typography>
                                        </Box>
                                      </Stack>
                                    )}
                                    {item.ExamTypeDesc ===
                                      "Theory End Term" && (
                                      <Stack
                                        direction="row"
                                        alignItems="center"
                                        spacing={0.5}
                                        mt={0.2}
                                      >
                                        <Chip
                                          label="Present"
                                          size="small"
                                          icon={
                                            <CheckCircleIcon
                                              style={{
                                                fontSize: 16,
                                                color: "#2e7d32",
                                              }}
                                            />
                                          }
                                          sx={{
                                            backgroundColor: "#e8f5e9",
                                            color: "#388e3c",
                                            fontWeight: 600,
                                            height: "24px",
                                            padding: "2px 6px",
                                            fontSize: "12px",
                                            borderRadius: "10px",
                                            "& .MuiChip-icon": {
                                              marginLeft: "-2px",
                                            },
                                          }}
                                        />
                                        <Typography variant="caption">
                                          |
                                        </Typography>
                                        <Box
                                          sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 0.5,
                                          }}
                                        >
                                          <Typography
                                            variant="body2"
                                            color="textSecondary"
                                          >
                                            <Link
                                              href={"#"}
                                              style={{
                                                color: primary,
                                                textDecoration: "underline",
                                              }}
                                              onClick={() => {
                                                setCourseCode(
                                                  exam.CourseCode +
                                                    ":" +
                                                    exam.CourseName
                                                );
                                                setExamAttendance(
                                                  item.ExamAttendance
                                                );
                                                setRoomNo(item.RoomNo);
                                                setExamType(item.ExamType);
                                                handleOpen(
                                                  StuSubjectiveScrutiny
                                                );
                                              }}
                                            >
                                              View more...
                                            </Link>
                                          </Typography>
                                        </Box>
                                      </Stack>
                                    )}
                                  </Box>
                                </Stack>
                              </Grid>
                            ))}
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </ChildCard>
                </BlankCard>
              </Grid>
            </Grid>
          )}
          <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            {DialogComponent && (
              <DialogComponent
                open={open}
                handleClose={handleClose}
                courseCode={courseCode}
                roomNo={roomNo}
                examAttendance={examAttendance}
                examType={examType}
                termId={selectTermId}
              />
            )}
          </Dialog>
        </PageContainer>
      )}
    </>
  );
};

export default StuMarksView;
