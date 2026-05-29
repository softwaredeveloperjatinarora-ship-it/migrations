import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
 
  Typography,
  Card,
  Avatar,
  Stack,
  CardContent,
  Chip,
  CircularProgress,
  Box
} from "@mui/material";
import  Grid from "@mui/material/Grid";
import CloseIcon from "@mui/icons-material/Close";
import BlankCard from "@/app/components/shared/BlankCard";
import {
  IconCalendarTime,
  IconMapPin,
  IconReport,
} from "@tabler/icons-react";
import EditNoteIcon from "@mui/icons-material/EditNote";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SchoolIcon from "@mui/icons-material/School";
import { getStudentSubjectiveMarkDetailAction } from "@/app/actions/examination/student result/getstudentsubjectivemarksAction";
import { useSession } from "next-auth/react";
import { decryptDataforResponse, encryptData } from "@/app/api/services/auth/Encrptdecrpt";
import { StudentSubjectiveMarks } from "@/app/api/interfaces/Examination/stumarksdetails";
import DataNotFound from "../../Common/DataNotFound";
import Error from "../../Common/Error";


interface PopupProps {
  open: boolean;
  handleClose: () => void;
  courseCode?:string,
  roomNo?:string,
  examAttendance?:string,
  examType?:string
  termId:string
}

const StuSubjectiveScrutiny: React.FC<PopupProps> = ({ open, handleClose,courseCode,roomNo, examAttendance,examType,termId }) => {
   const { data: session } = useSession();
  const[studentMarks,setStudentMarks]=useState<StudentSubjectiveMarks[]>([]);
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
      TermId:   termId,
      CourseCode:  courseCode!.split(':')[0],
      ExamType:   examType,
    };
    // console.log(formfields)
    if (!session || !session.user || !session.user.token  ) {
        throw new window.Error("Token is undefined");
      }
    let splitValue  =String(session.user.token).split('NEXT2121ANG');     
    const credentialsJson = JSON.stringify(formfields);
    //EncrytData
    const { Data } = encryptData(credentialsJson,splitValue[1]);
          setState({loading: true, empty: null, error:null});
          const res = await getStudentSubjectiveMarkDetailAction(
            Data
          );
          const decryptData = decryptDataforResponse(res.ApiData, splitValue[1]);
          const parseData = JSON.parse(decryptData);
          // console.log(parseData)
          if (parseData && Array.isArray(parseData) && parseData.length > 0)
          setStudentMarks(parseData)
          else
          setState({loading: false, empty: true, error:null});
        } catch (error) {
          setState({loading: false, empty: null, error:true});
        }
        finally{
          setState(prev => ({ ...prev, loading: false }));
        }
      };
      fetchData();
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
          Subjective Sheet Scrutiny
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
                      Theroy End Term
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <IconCalendarTime style={{ fontSize: 18 }} />
                      <Typography variant="body2">02-Dec-2024</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <IconReport style={{ fontSize: 18 }} />
                      <Typography variant="body2">15.00-18.00</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
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
          {studentMarks.map((item, index) => (
            <Grid size={{ xs: 12, lg: 4, md: 4 }} key={index}>
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
                    bgcolor: "primary.main",
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
                    {item.Qno}
                  </Typography>
                </Avatar>

                <Stack sx={{ flex: 1, mx: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Max Marks: <strong>{item.MarksMax}</strong>
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Marks Obtained: <strong>{item.MarksObtained}</strong>
                  </Typography>
                </Stack>
                <Chip
                  label={
                    item.MarksObtained === "N.A"
                      ? "Not Attempted"
                      : "Attempted"
                  }
                  sx={{
                    bgcolor:
                      item.MarksObtained === "N.A" ? "#ffebee" : "#e8f5e9",
                    color:
                      item.MarksObtained === "N.A" ? "#d32f2f" : "#388e3c",
                    fontWeight: 600,
                    borderRadius: "12px",
                    fontSize: "12px",
                    px: 1.5,
                    height: 28,
                  }}
                />
              </Card>
            </Grid>
          ))}
        </Grid> )}
      </DialogContent>
    </Dialog>
  );
};

export default StuSubjectiveScrutiny;
