"use client"
import {
  Box,
  Typography,
  Dialog,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  DialogActions,
  Button,
  DialogTitle,
  Divider,
  DialogContent,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useState } from "react";
import Scrollbar from "@/app/components/custom-scroll/Scrollbar";
import { IconX } from "@tabler/icons-react";
import Image from "next/image";
interface OJTGuidelineProps {
  isOpen: boolean;
  closeModal: (data?: boolean) => void;
  title: string;
}

const OJTGuidelines: React.FC<OJTGuidelineProps> = ({ isOpen, closeModal }) => {
  if (!isOpen) return null;
  
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const handleAccordionChange = 
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
  };

  const dynamicTitle = "OJT Guidline";
  const handleClose = () => {
    closeModal(false);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      PaperProps={{ sx: { width: "100%", height: "90%" } }}
      maxWidth="lg"
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {dynamicTitle}
        <IconButton onClick={handleClose} size="small">
          <IconX size={24} />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ padding: 2 }}>
        <Scrollbar sx={{ height: { xs: "300px", md: "700px" } }}>
          <Accordion 
            expanded={expanded === 'panel1'} 
            onChange={handleAccordionChange('panel1')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography component="span">OJT / Internship Description</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography component="div">
                • Internship and On Job Training (OJT) are the two modes through which the students either get the practical nature of the occupation at the work place or improve their skills for a specific kind of job.<br /> 
                • These are the modes by which the students learn to apply their theoretical knowledge in real life working situation.<br /> 
                • It helps the students to learn the work place ethics which further enhance their employability.<br />
                • <span style={{ color: "red" }}>Internship</span> can be defined as the period of training a student spent in an organization to gain experience or to fulfill the curriculum requirement.<br /> 
                • Internship is a fixed term engagement of student with an organization and is temporary position. <br /> 
                • Pursuing internship is not considered job placement until the student is converted into the full-time employment (FTE) depending upon the performance of the student during the internship period and company's manpower requirement at that time. <br /> 
                • Student gets an internship offer letter in such case.<br />
                • On Job Training (OJT) can be defined as the training program used by an organization to improve the skills and performance of the prospective employees for doing a specific type of job as per the company's requirement.<br /> 
                This type of training is also well paid and it is converted into full time job after the completion of the degree of the student.<br /> 
                Thus, pursuing OJT is considered as job placement. Student gets an employment/job offer letter in this case. Academic Treatment for the student in both cases – whether Internship or OJT – remains the same.<br />
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expanded === 'panel2'} 
            onChange={handleAccordionChange('panel2')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography component="span">Queries related to OJT/Internship request</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography component="div">
                • Students can submit their OJT/Internship request through the
                following interface in 15 days prior to the OJT/Internship start
                date:
                <br />• UMS Navigation--Placement Services---OJT/Internship
                Application
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expanded === 'panel3'} 
            onChange={handleAccordionChange('panel3')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3-content"
              id="panel3-header"
            >
              <Typography component="span">
                Checking status of OJT/Internship request
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography component="div">
                • Students can check the OJT/Internship request status (Approved / Disapproved / Cancelled / Pending) through the OJT/Internship Application request interface itself.<br />
                • It generally takes 10 days to process an OJT/Internship request. <br />
                • Any action required from student with regard to his/her pending OJT/Internship application is also reflected to the student on the same interface.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expanded === 'panel4'} 
            onChange={handleAccordionChange('panel4')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel4-content"
              id="panel4-header"
            >
              <Typography component="span">
                Queries related to OJT/Internship request
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography component="div">
                Student can follow either of the channels mentioned below with respect to their queries related to OJT/Internship, before or after joining:
                <br /><br />
                • Refer to these FAQs available on OJT/Internship Application interface, or<br />
                • Students can directly raise an RMS query, as the option is available on the right side of the portal<br />
                • Queries related to OJT/Internship after approval: In case of any specific clarification / discussion is sought w.r.t to OJT/Internship after OJT/Internship approval, students may contact, the OJT/Internship Faculty Mentor (Internal supervisor) assigned to the student. Contact Details of assigned OJT/Internship Mentor are visible to students in the OJT/Internship request interface itself against their approved OJT/Internship request.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expanded === 'panel5'} 
            onChange={handleAccordionChange('panel5')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel5-content"
              id="panel5-header"
            >
              <Typography component="span">
                Duty leaves or CA/MTE proration for the OJT/Internship period
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography component="div">
                • Duty leaves of the period of approved OJT/Internship request will be processed in the last week of the term (semester or module).<br />
                • CA/MTE proration for CA/MTE missed during approved OJT/Internship duration, if applicable, will be done after the marks of the ETE are updated in the result.<br />
                • The abovementioned benefits shall not be applicable for the period for which the attendance of the concerned was blocked due to any reason.<br />
                • For any other queries related to concern, students can also submit an RMS query in Category Placements
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expanded === 'panel6'} 
            onChange={handleAccordionChange('panel6')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel6-content"
              id="panel6-header"
            >
              <Typography component="span">
                Schedule of exams for OJT/Internship students
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box component="div">
                • The End Term Exam (ETE) of OJT/Internship Viva or Field Project Viva will be scheduled after the student completes the minimum prescribed duration (2.5 months for MBA and 4 months for non-MBA).<br />
                • The ETE of other theory/practical courses applicable as per the OJT/Non-OJT stub will be conducted as per the University's Academic Calendar of the respective programme.<br />
                • The mode of exams shall be offline.<br />
                • The seating plan of the exams can be checked through UMS Examination Seating Plan interface.<br />
                • In case a student is not allowed by the employer to report in university for ETEs during the scheduled End Term Examination window as per Academic Calendar, the student can take the option to appear for the End Term Exams during one of following alternative examination schedule/windows:
                <Box sx={{ width: "100%", overflowX: "auto", mt: 2 }}>
                  <TableContainer
                    component={Paper}
                    sx={{ width: "100%", minWidth: 600, margin: "auto" }}
                  >
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell><b></b></TableCell>
                          <TableCell><b>Window-1</b></TableCell>
                          <TableCell><b>Window-2</b></TableCell>
                          <TableCell><b>Window-3</b></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>Autum Term</TableCell>
                          <TableCell>November (Near Term break for students)</TableCell>
                          <TableCell>December 15-31</TableCell>
                          <TableCell>January 1-10</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Spring Term</TableCell>
                          <TableCell>May 15-30</TableCell>
                          <TableCell>June 1-10</TableCell>
                          <TableCell>July 15-31</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>

                <Typography component="div" sx={{ mt: 2 }}>
                  Note: Regular End Term Exams falling in approved OJT/Internship duration and not attempted by student due to such constraints, shall not be counted as reappears.<br /><br />
                  • For any other queries related to concern, students can also submit an RMS query in Category Placements (Career services) -- Proration/Rescheduling of Exams.
                </Typography>
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expanded === 'panel7'} 
            onChange={handleAccordionChange('panel7')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel7-content"
              id="panel7-header"
            >
              <Typography component="span">
                Documents required for OJT/Internship End Term Exam Evaluation
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography component="div">
                • The End Term Exam (ETE) of OJT/Internship Viva or Field Project Viva will be subject to submission of the following documents by the students:<br />
                • Final OJT/Internship Report<br />
                • External CA (Continuous Assessment) by the organization<br />
                • Attendance Record in the Organization<br />
                • OJT/Internship Training Certificate issued by the employer<br />
                • After completion of the duration of the OJT/Internship, the students need to prepare the final comprehensive report and presentation on the work done during the OJT/Internship in prescribed format as discussed in the detailed Guidelines for Optional Internship/OJT as available on UMS (UMS Homepage -- Important Links -- Policies, Rules, Instructions, Guidelines & Formats -- Examination Instructions and Guidelines -- AERC -- OJT Internship Policy). The student can take the guidance of the OJT/Internship Mentor (internal supervisor) or external supervisor (from company) to prepare the final report. The students need to produce the final hard copy (spiral binding) of the final report duly signed by internal as well external supervisor along with the attendance record verified by the respective organization at the time of final End Term Evaluation. The candidate needs to bring the project report at the time of final ETP evaluation.<br />
                • All the students on OJT/Internship are required to upload the soft copy of the training certificates on the following UMS link after completion of their Internship/ OJT duration as per the announcement made from time to time. Students on 2 semesters Internship/ OJT are required to upload the soft copy of the training certificate once after each term, through UMS Navigation -- Learning Management System (LMS) -- Upload Research Project/Internship Certificate details -- Upload Research Project/Internship Certificate.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expanded === 'panel8'} 
            onChange={handleAccordionChange('panel8')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel8-content"
              id="panel8-header"
            >
              <Typography component="span">
                Request to discontinue or cancel OJT/Internship request
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box component="div">
                • Student can submit the request to cancel existing OJT/Internship request through the CANCEL option displayed against respective company's OJT/Internship request visible in the OJT/Internship Application interface itself.
                <Box display="flex" mt={2} mr={-1} justifyContent={"center"}>
                  <Image src="/images/ojtdashboard/cancel.jpg" width={300} height={200} alt="Cancel" />
                </Box>
                • you can cancel OJT by clicking on cancel ojt button<br/>
                • If the OJT/Internship request is pending for approval it will be instantly cancelled upon clicking the CANCEL option.<br/>
                • If the OJT/Internship request is already approved, then student will be required to present before a committee for further processing of his/her OJT/Internship cancellation request after clicking the CANCEL option. The reporting schedule to present before the committee will be conveyed to the student by respective school TPCs.
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expanded === 'panel9'} 
            onChange={handleAccordionChange('panel9')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel9-content"
              id="panel9-header"
            >
              <Typography component="span">
                Request to change OJT/Internship company
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography component="div">
                • In order to change the OJT/Internship company, student will be required to first submit request for cancelling existing ongoing OJT/Internship request as mentioned in Section #7 above and then submit request for OJT/Internship with new company through the OJT/Internship application interface itself.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expanded === 'panel10'} 
            onChange={handleAccordionChange('panel10')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel10-content"
              id="panel10-header"
            >
              <Typography component="span">
                Further placement/internship opportunities while on OJT/Internship
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography component="div">
                • Students pursuing Internship with an organization may be allowed for further Placement drives until PPO with existing internship is confirmed by respective organization.<br /><br />
                • Student pursuing OJT (already placed) with respective organization will not be allowed for further placement or internship opportunities.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Scrollbar>
      </DialogContent>

      <Divider />

      <DialogActions>
        <Button color="primary" onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OJTGuidelines;