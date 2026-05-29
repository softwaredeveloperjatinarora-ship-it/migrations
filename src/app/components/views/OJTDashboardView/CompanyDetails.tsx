"use client";
import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  Grid,
  Link,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { IconCircle } from "@tabler/icons-react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DateRangeIcon from "@mui/icons-material/DateRange";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import OJTAttendance from "./OJTPopup/OJTAttendance";
import OJTCancelllation from "./OJTPopup/OJTCancellation";
import ViewCompanyDetails from "./OJTPopup/ViewCompanyDetails";
import UploadDocuments from "./OJTPopup/UploadOJTDocuments";
import EventBusyIcon from "@mui/icons-material/EventBusy";

interface CompanyDetailsProps {
  isLoading: boolean;
}

const companiesData = [
  {
    id: 1,
    companyName: "Microsoft",
    offerType: "Offer Through University (Placement)",
    status: "Cancelled",
    joinDate: "07 Mar 25",
    endDate: "07 Mar 25",
    offer: "internship",
    designation: "frontend",
    driveId: "12248",
    cancelledDate: "07 Mar 25",
  },
  {
    id: 2,
    companyName: "Google",
    offerType: "Independent Offer",
    status: "Approved",
    joinDate: "09 Mar 25",
    endDate: "09 Mar 25",
    offer: "full-time job",
    designation: "cloud engineer",
    driveId: "N/A",
  },
];

const CompanyDetails = ({ isLoading }: CompanyDetailsProps) => {
  const theme = useTheme();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return { bgcolor: "success.light", color: "success.main" };
      case "cancelled":
        return { bgcolor: "error.light", color: "error.main" };
      default:
        return { bgcolor: "grey.100", color: "text.primary" };
    }
  };

  const [currentIndex, setCurrentIndex] = useState(0);

  // Modal States
  const [isModalOpenAtt, setIsModalOpenAtt] = useState(false);
  const [isModalOpenCan, setIsModalOpenCan] = useState(false);
  const [isModalOpenCompanyView, setIsModalOpenCompanyView] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < companiesData.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handleViewCompanyClick = (company: any) => {
    setSelectedCompany(company);
    setIsModalOpenCompanyView(true);
  };

  const company = companiesData[currentIndex];

  return (
    <>
      {isLoading ? (
        <Skeleton />
      ) : (
        <Grid container spacing={3}>
          <Card sx={{ height: "295px", width: "100%" }}>
            {/* Navigation Icons */}
            {companiesData.length > 1 && (
              <Box display="flex" alignItems="center" justifyContent="flex-end" sx={{ mt: "-20px", pr: 2 }}>
                {companiesData.map((_, idx) => (
                  <IconCircle
                    key={idx}
                    size={10}
                    onClick={() => setCurrentIndex(idx)}
                    style={{
                      marginRight: 4,
                      cursor: "pointer",
                      color: "#9e9e9e",
                      fill: currentIndex === idx ? "#9e9e9e" : "none",
                    }}
                  />
                ))}
              </Box>
            )}

            <CardHeader
              title={company.companyName}
              subheader={company.offerType}
              action={
                <Box textAlign="right">
                  <Box
                    bgcolor={getStatusColor(company.status).bgcolor}
                    color={getStatusColor(company.status).color}
                    fontSize="12px"
                    p="0px 4px"
                    border="1px solid"
                    borderRadius={2}
                  >
                    {company.status}
                  </Box>
                </Box>
              }
            />

            <Box>
              <Stack direction="row" spacing={2} mt={0}>
                <Avatar sx={{ bgcolor: "warning.light", color: "warning.main", width: 36, height: 36 }}>
                  <CalendarMonthIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2">{company.joinDate}</Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    DOJ
                  </Typography>
                </Box>

                <Avatar sx={{ bgcolor: "warning.light", color: "warning.main", width: 36, height: 36 }}>
                  <DateRangeIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2">{company.endDate}</Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    End Date
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={2} mt={1.5}>
                <Avatar sx={{ bgcolor: "warning.light", color: "warning.main", width: 36, height: 36 }}>
                  <RemoveRedEyeIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    <span
                      onClick={() => handleViewCompanyClick(company)}
                      style={{
                        cursor: "pointer",
                        display: "inline-block",
                        whiteSpace: "pre-line",
                        textAlign: "center",
                      }}
                    >
                      View{"\n"}Details
                    </span>
                    <ViewCompanyDetails
                      isOpen={isModalOpenCompanyView}
                      closeModal={() => {
                        setIsModalOpenCompanyView(false);
                        setSelectedCompany(null);
                      }}
                      company={selectedCompany}
                    />
                  </Typography>
                </Box>

                <Box >

                {company.status.toLowerCase() !== "cancelled" ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, gap: 1.5 }}>
                    <Avatar
                      sx={{
                        bgcolor: "warning.light",
                        color: "warning.main",
                        width: 36,
                        height: 36,
                      }}
                    >
                      <FileUploadIcon />
                    </Avatar>

                   
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        <span
                          onClick={() => setIsUploadModalOpen(true)}
                          style={{
                            cursor: "pointer",
                            display: "inline-block",
                            whiteSpace: "pre-line",
                            textAlign: "center",
                          }}
                        >
                          Upload{"\n"}Documents
                        </span>
                        <UploadDocuments
                          isOpen={isUploadModalOpen}
                          closeModal={() => setIsUploadModalOpen(false)}
                        />
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, gap: 1.5 }}>
                    <Avatar
                      sx={{
                        bgcolor: "warning.light",
                        color: "warning.main",
                        width: 36,
                        height: 36,
                      }}
                    >
                      <EventBusyIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">{company.cancelledDate}</Typography>
                      <Typography variant="subtitle2" color="textSecondary">
                        Cancelled On
                      </Typography>
                    </Box>
                  </Box>
                )}
                </Box>

              </Stack>

              {company.status.toLowerCase() !== "cancelled" && (
                <Stack direction="row" spacing={1} mt={3}>
                  <Button onClick={() => setIsModalOpenAtt(true)}>Mark Attendance</Button>
                  <OJTAttendance isOpen={isModalOpenAtt} closeModal={() => setIsModalOpenAtt(false)} />

                  <Typography variant="subtitle1" color="textPrimary" ml="auto">
                    <Button onClick={() => setIsModalOpenCan(true)}>Cancel OJT</Button>
                    <OJTCancelllation
                      isOpen={isModalOpenCan}
                      closeModalCan={() => setIsModalOpenCan(false)}
                      id={1235}
                    />
                  </Typography>
                </Stack>
              )}
              
            </Box>
            
          </Card>
        </Grid>
      )}
    </>
  );
};

export default CompanyDetails;

