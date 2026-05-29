import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  Box,
  Avatar,
  Typography,
  AccordionDetails,
  Stack,
  Chip,
} from "@mui/material";
import Scrollbar from "@/app/components/custom-scroll/Scrollbar";
import {
  IconChevronDown,
  IconReportAnalytics,
  IconStar,
} from "@tabler/icons-react";
import { useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import { StudentMarksDetails } from "@/app/api/interfaces/Examination/stumarksdetails";
import { getStudentMarksDetailAction } from "@/app/actions/examination/student result/getstumarksdetailAction";
import { useSession } from "next-auth/react";
import { decryptDataforResponse, encryptData } from "@/app/api/services/auth/Encrptdecrpt";
import { IconStarOff } from "@tabler/icons-react";
interface PopupProps {
  open: boolean;
  handleClose: () => void;
  title: string;
}

const StuGradeInfoPopUp: React.FC<PopupProps> = ({
  open,
  handleClose,
  title,
}) => {
  const descriptionElementRef = React.useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const theme = useTheme();
  const primary = theme.palette.secondary.main;
  const primarylight = theme.palette.secondary.light;
  const [courses, setcourses] = useState<StudentMarksDetails[]>([]);

  //controlled accodion
  // controlled accodion
     const [expanded, setExpanded] = useState<string[]>(courses.map((_, i) => `panel${i}`));
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded((prevExpanded) =>
        isExpanded
          ? [...prevExpanded, panel]
          : prevExpanded.filter((p) => p !== panel)
      );
    };

  useEffect(() => {
    const fetchData = async () => {
      try {
          const formfields = {
              Vid: 0,
              title:  title.split(':')[0],
            };
            // console.log(formfields)
            if (!session || !session.user || !session.user.token  ) {
                throw new window.Error("Token is undefined");
              }
              let splitValue = session.user.token.split("NEXT2121ANG");
              const credentialsJson = JSON.stringify(formfields);
            //EncrytData
            const { Data } = encryptData(credentialsJson,splitValue[1]);
        const res = await getStudentMarksDetailAction(
          Data
         
        );
      
        const parseData = JSON.parse(
          decryptDataforResponse(res.ApiData, splitValue[1])
        );
        setcourses(parseData);
        setExpanded(parseData.map((_: any, i: number) => `panel${i}`));
        // console.log(parseData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      PaperProps={{ sx: { width: "100%" } }}
      maxWidth="lg"
    >
      <DialogTitle sx={{ textAlign: "center" }}>{title}</DialogTitle>
      <DialogContent dividers>
        <Scrollbar sx={{ height: "340px" }}>
          {courses.map((course, index) => (
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
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                    Term ID: {course.TermId}
                  </Typography>
                </Box>
                {course.IsImproved != "" ? (
                  <Chip
                    label={course.IsImproved}
                    icon={<IconStarOff width={20} />}
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
                ) : (
                  ""
                )}
              </AccordionSummary>

              {/* Details Section */}
              <AccordionDetails>
                <Grid container spacing={2}>
                  {course.Assessment.map((stat, i) => (
                    <Grid key={i} size={{ sm: 6, md: 3, xs: 12, lg: 3 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar
                          variant="rounded"
                          sx={{
                            bgcolor: "#E3F2FD",
                            color: "#1976D2",
                            width: 40,
                            height: 40,
                          }}
                        >
                          <IconReportAnalytics width={20} />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {stat.ExamTypeDesc}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Marks: <strong>{stat.MarksObt}</strong> /{" "}
                            {stat.MaxMarks}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Weighted: <strong>{stat.WMarksObt}</strong> /{" "}
                            {stat.wMaxMarks}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
        </Scrollbar>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default StuGradeInfoPopUp;
