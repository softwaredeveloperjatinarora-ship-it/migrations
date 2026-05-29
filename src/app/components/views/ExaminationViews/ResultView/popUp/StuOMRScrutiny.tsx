import React, { useEffect, useState} from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  
  Typography,
  Card,
  Avatar,
  Button,
  Stack,
  CardContent,
  Chip,
  Box,
  CircularProgress,
} from "@mui/material";
import  Grid from "@mui/material/Grid";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import BlankCard from "@/app/components/shared/BlankCard";
import { IconCalendarTime, IconMapPin, IconReport } from "@tabler/icons-react";
import EditNoteIcon from "@mui/icons-material/EditNote";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SchoolIcon from "@mui/icons-material/School";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import Scrollbar from "@/app/components/custom-scroll/Scrollbar";
import { useSession } from "next-auth/react";
import { decryptDataforResponse, encryptData } from "@/app/api/services/auth/Encrptdecrpt";
import { getStudentObjectiveMarkDetailAction } from "@/app/actions/examination/student result/getstuObjectivemarkdetailsAction";
import { StudentObjectiveMarks } from "@/app/api/interfaces/Examination/stuobjectivemarkinterface";
import Error from "../../Common/Error";
import DataNotFound from "../../Common/DataNotFound";

const omrData = Array.from({ length: 80 }, (_, index) => ({
  qNo: index + 1,
  answerKey: ["A", "B", "C", "D"][Math.floor(Math.random() * 4)],
  studentAns: ["A", "B", "C", "D"][Math.floor(Math.random() * 4)],
  marks: Math.random() > 0.5 ? 1 : -0.25,
  discrepancy: "None",
}));

interface PopupProps {
  open: boolean;
  handleClose: () => void;
  courseCode: string;
  roomNo?: string;
  examAttendance?: string;
  examType: string;
  termId?:string
}

const StuOMRScrutiny: React.FC<PopupProps> = ({
  open,
  handleClose,
  courseCode,
  roomNo,
  examAttendance,
  examType,
  termId
}) => {
  const { data: session } = useSession();
const[objectiveMarks,setobjectiveMarks]=useState<StudentObjectiveMarks[]>([]);
const [state, setState] = useState<{ 
      loading: boolean| null; 
      empty: boolean| null; 
      error: boolean | null; 
    }>( { loading: null, empty: null, error: null });
  useEffect(() => {
    const fetchData = async () => {
      try {
         const formfields = {
      Vid: 0,
      TermId:  termId,
      CourseCode:  courseCode.split(':')[0],
      ExamType: examType
    };
    // console.log(formfields)
    if (!session || !session.user || !session.user.token  ) {
        throw new window.Error("Token is undefined");
      }
      let splitValue = session.user.token.split("NEXT2121ANG");
      const credentialsJson = JSON.stringify(formfields);
    //EncrytData
    const { Data } = encryptData(credentialsJson,splitValue[1]);
 
        setState({loading: true, empty: null, error:null});
        const res = await getStudentObjectiveMarkDetailAction(
          Data
        );
        // console.log(res)
       
        const decryptData = decryptDataforResponse(res.ApiData, splitValue[1]);
        const parseData = JSON.parse(decryptData);
        if (parseData && Array.isArray(parseData) && parseData.length > 0)
        setobjectiveMarks(parseData)
        else
        setState({loading: false, empty: true, error:null});
      } catch (error) {
       
        setState({loading: false, empty: null, error:true});
      }
      finally{
        setState(prev => ({ ...prev, loading: false }));
      }
    };
  if(examAttendance != null && examAttendance.trim().toLocaleLowerCase() != 'absent') 
    fetchData()
  else
  setState({loading: false, empty: true, error:null})
  }, []);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="span" align="center">
          OMR Sheet Scrutiny
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} alignItems="flex-start">
          <Grid size={{ xs: 12, md: 4 }}>
            <BlankCard>
              <CardContent sx={{ p: 2, display: "flex", alignItems: "center" }}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ width: "100%", flexWrap: "wrap" }}
                >
                  <Avatar
                    sx={{
                      bgcolor: "secondary.light",
                      color: "secondary.main",
                      width: 40,
                      height: 40,
                    }}
                  >
                    <SchoolIcon sx={{ fontSize: 18 }} />
                  </Avatar>

                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    alignItems="center"
                    spacing={2}
                    sx={{
                      flex: 1,
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      width: "100%",
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      noWrap
                      sx={{
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                      }}
                    >
                      {courseCode}
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </BlankCard>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <BlankCard>
              <CardContent sx={{ p: 2, display: "flex", alignItems: "center" }}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ width: "100%", flexWrap: "wrap" }}
                >
                  <Avatar
                    sx={{
                      bgcolor: "secondary.light",
                      color: "secondary.main",
                      width: 40,
                      height: 40,
                    }}
                  >
                    <EditNoteIcon sx={{ fontSize: 18 }} />
                  </Avatar>

                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    alignItems="center"
                    spacing={2}
                    sx={{
                      flex: 1,
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      width: "100%",
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={600} noWrap>
                      Objective End Term
                    </Typography>

                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <IconCalendarTime style={{ fontSize: 18 }} />
                      <Typography variant="body2">02-Dec-2024</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <IconReport style={{ fontSize: 18 }} />
                      <Typography variant="body2">15.00-18.00</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <IconMapPin style={{ fontSize: 18 }} />
                      <Typography variant="body2">{roomNo}</Typography>
                    </Stack>
                  </Stack>

                  <Chip
                    label={examAttendance}
                    size="small"
                    icon={
                      <CheckCircleIcon
                        style={{ fontSize: 16, color: "#2e7d32" }}
                      />
                    }
                    sx={{
                      bgcolor: "#e8f5e9",
                      color: "#388e3c",
                      fontWeight: 600,
                      borderRadius: "12px",
                      fontSize: { xs: "12px", sm: "13px" },
                      px: { xs: 1.5, sm: 2 },
                      py: 0.5,
                      height: { xs: 28, sm: 30 },
                      mt: { xs: 1, sm: 0 },
                    }}
                  />
                </Stack>
              </CardContent>
            </BlankCard>
          </Grid>
          </Grid>
          {state?.loading ?
           ( <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", }} > <CircularProgress /> </Box> )
           :
            state?.error ? (<Error/>): state?.empty ? (<DataNotFound/>) : (
          <Grid container spacing={2} alignItems="flex-start">
          <Grid size={{ xs: 12, md: 5 }} textAlign="center">
            <Zoom>
              <Image
                src="/images/OMR/RSheet_0177_2524251018081.jpg"
                alt="OMR Sheet"
                width={500}
                height={700}
                style={{
                  borderRadius: "8px",
                  maxWidth: "100%",
                  maxHeight: "600px",
                }}
              />
            </Zoom>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Scrollbar
              sx={{
                maxHeight: "600px",
                overflowY: "auto",
                paddingRight: "8px",
              }}
            >
              <Grid container spacing={2}>
                {objectiveMarks.map((row) => (
                  <Grid size={{ xs: 12 }} key={row.QNo}>
                    <Card
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: 1.5,
                        borderRadius: "12px",
                        boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor:
                            row.Answer === row.StudentAns
                              ? "success.main"
                              : "error.main",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ fontSize: "14px", fontWeight: "bold" }}
                        >
                          Q.
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ fontSize: "16px", fontWeight: "bold" }}
                        >
                          {row.QNo}
                        </Typography>
                      </Avatar>

                      <Stack sx={{ flex: 1, mx: 2 }}>
                        <Typography variant="body1" fontWeight={600}>
                          Answer: {row.StudentAns}{" "}
                          {row.Answer === row.StudentAns ? "✔️" : "❌"}
                        </Typography>
                        <Typography variant="body2" color="gray">
                          Correct: {row.Answer}
                        </Typography>
                      </Stack>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor:
                            row.marks > 0 ? "success.main" : "error.main",
                          color: "white",
                          borderRadius: "20px",
                          px: 2,
                        }}
                      >
                        {row.marks > 0 ? `+${row.marks}` : row.marks}
                      </Button>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Scrollbar>
          </Grid>
        </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StuOMRScrutiny;
