
import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { getAnnouncementsAction } from "@/app/actions/homeAction/Announcements/getAnnouncementsAction";
import { decryptDataforResponse } from "@/app/api/services/auth/Encrptdecrpt";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Modal,
  useMediaQuery,
} from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import Scrollbar from "../../custom-scroll/Scrollbar";
import DashboardCard from "../../shared/DashboardCard";
import { IconChevronDown, IconX } from "@tabler/icons-react";
import Typography from "@mui/material/Typography";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useTheme } from "@mui/material/styles";

const TabScrollable = ({ onDataFetched }: any) => {
  const [value, setValue] = React.useState("1");
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const isDataFetched = useRef(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { data: session } = useSession();
  const [announcementdata, setAnnouncementdata] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [openModalId, setOpenModalId] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchPlacementData = async () => {
      if (isDataFetched.current) return;

      try {
        setLoading(true);
        const response = await getAnnouncementsAction();
        let splitValue = String(session?.user?.token).split("NEXT2121ANG");
        if (response.status === "success") {
          let apiData = response.ApiData;
          const decryptedData = decryptDataforResponse(apiData, splitValue[1]);
          const parsedData = JSON.parse(decryptedData);
          setAnnouncementdata(parsedData);
          onDataFetched(apiData);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
        isDataFetched.current = true;
      }
    };

    fetchPlacementData();
  }, [onDataFetched, session]);

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleOpenModal = (id: string) => {
    setOpenModalId(id);
  };

  const handleCloseModal = () => {
    setOpenModalId(null);
  };

  return (
    <DashboardCard>
      <TabContext value={value}>
        <Box textAlign="center" mb={2} sx={{ cursor: "default" }}>
          <Typography
            variant="h4"
            gap={1}
            fontWeight="bold"
            display={"flex"}
            justifyContent={"center"}
            align="center"
          >
            <Icon
              icon="mingcute:announcement-line"
              style={{ fontSize: "25px" }}
            />
            Announcements
          </Typography>
        </Box>
        <Box sx={{ width: "100%" }}>
          <Tabs
            value={value}
            onChange={handleTabChange}
            aria-label="scrollable tabs example"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{ marginTop: -2 }}
          >
            {announcementdata.map((tab, index) => (
              <Tab
                key={tab.code}
                icon={<Icon width={20} height={20} icon={tab.icon} />}
                label={`${tab.name} (${tab.total})`}
                iconPosition="start"
                value={String(index + 1)}
                sx={{ fontWeight: "bold" }}
              />
            ))}
          </Tabs>
        </Box>

        <Box border="1px solid #B6CBBD" marginTop={1}>
          {announcementdata.map((tab, index) => (
            <TabPanel key={tab.code} value={String(index + 1)}>
              <Scrollbar sx={{ height: "500px" }}>
                <Box
                  sx={{
                    height: {
                      lg:"auto",
                      xs: "300px",
                      sm: "200px",
                      md: "350px",
                    },
                  }}
                  // sx={{ height: "auto" }}
                >
                  {tab.announcements.map(
                    (data: any, index: React.Key | null | undefined) => {
                      const panelId = `panel-${index}`;
                      const modalId = `modal-${tab.code}-${index}`;

                      return (
                        <React.Fragment key={index}>
                          <Accordion
                            expanded={expanded === panelId}
                            onChange={handleAccordionChange(panelId)}
                            sx={{
                              // Hide expand icon in mobile view
                              "& .MuiAccordionSummary-expandIconWrapper": {
                                display: isMobile ? "none" : "flex",
                              },
                            }}
                          >
                            <AccordionSummary
                              expandIcon={<IconChevronDown />}
                              aria-controls={`${panelId}-content`}
                              id={`${panelId}-header`}
                            >
                              <Box
                                sx={{
                                  width: isMobile ? "100%" : "95%",
                                  flexShrink: 0,
                                  fontSize: 12,
                                  display: "flex",
                                  flexDirection: isMobile ? "column" : "row",
                                  alignItems: isMobile ? "flex-start" : "center",
                                  padding: "0px",
                                  whiteSpace: "normal",
                                }}
                              >
                                <Box
                                  sx={{
                                    width: isMobile ? "100%" : "90%",
                                    flexShrink: 0,
                                    fontSize: 12,
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "0px",
                                    whiteSpace: "normal",
                                  }}
                                  onClick={() => isMobile && handleOpenModal(modalId)}
                                >
                                  <Icon
                                    icon="tabler:point-filled"
                                    style={{
                                      fontSize: "14px",
                                      minWidth: "14px",
                                      minHeight: "10px",
                                    }}
                                  />

                                  <Typography
                                    variant="h6"
                                    sx={{
                                      flexGrow: 1,
                                      color: "text.primary",
                                      fontSize: 13,
                                      fontWeight: "bold",
                                      paddingLeft: "3px",
                                      whiteSpace: "normal",
                                      wordBreak: "break-word",
                                    }}
                                  >
                                    {data.subject}
                                  </Typography>
                                </Box>
                                <Typography
                                  variant="subtitle2"
                                  color="primary.main"
                                  sx={{
                                    cursor: "default",
                                    display: "",
                                    alignItems: "center",
                                    paddingRight: "8px",
                                    paddingLeft: isMobile ? "19px" : 0,
                                  }}
                                >
                                  {formatDate(data.entryDate)}
                                </Typography>
                              </Box>
                            </AccordionSummary>

                            {isMobile ? (

                              <Dialog
                                open={openModalId === modalId}
                                onClose={handleCloseModal}
                                // aria-labelledby="scroll-dialog-title"
                                // aria-describedby="scroll-dialog-description"
                                PaperProps={{ sx: { width: "100%", height: "90%" } }}
                                maxWidth="lg"
                              >
                                <DialogTitle
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >

                                  Detail of Announcements

                                  <IconButton
                                    onClick={handleCloseModal}
                                    size="small"
                                    sx={{ position: "absolute", top: 10, right: 10 }}
                                  >
                                    <IconX color="#FF8488" size={24} />
                                  </IconButton>

                                </DialogTitle>
                                <DialogContent dividers>
                                  <Scrollbar sx={{ height: "540px" }}>
                                    {" "}




                                    <Box
                                      sx={{
                                        marginLeft: 0.5
                                      }}
                                    >



                                      <Box sx={{ width: '100%' }}>
                                        <Typography
                                          variant="body1"
                                          color="text.primary"
                                          dangerouslySetInnerHTML={{
                                            __html: data.announcement
                                              .replace(
                                                /<table([^>]*)>/g,
                                                `<table$1 style="border-collapse: collapse; width: 100%; font-size: 16px;" aria-label="simple table">`
                                              )
                                              .replace(
                                                /<th([^>]*)>/g,
                                                `<th$1 style="border: 1px solid #ccc; padding: 10px; text-align: left; background-color: #f2f2f2;">`
                                              )
                                              .replace(
                                                /<td([^>]*)>/g,
                                                `<td$1 style="border: 1px solid #ccc; padding: 10px; text-align: left;">`
                                              )
                                              .replace(
                                                /<tr([^>]*)>/g,
                                                `<tr$1 style="border-bottom: 1px solid #ddd;">`
                                              ),
                                          }}
                                        />
                                      </Box>


                                      {data?.files?.length > 0 &&
                                        data.files[0]?.fileName && (
                                          <Typography variant="body1" component="div">
                                            <b>Attachments:</b>
                                            {data.files.map((file: any, idx: number) => (
                                              file?.fileName && (
                                                <Typography key={idx} component="div" style={{ marginTop: "4px", marginBottom: "9px" }}>
                                                  {idx + 1}.{" "}
                                                  <Link
                                                    href={file.filePath}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                      color: "gray",
                                                      fontWeight: "bold",
                                                    }}
                                                  >
                                                    {file.fileName}
                                                  </Link>
                                                </Typography>
                                              )
                                            ))}
                                          </Typography>
                                        )}

                                      <Typography variant="body1">Uploaded By :</Typography>
                                      <Typography variant="body1">
                                        {data.empName}
                                      </Typography>
                                      <Typography variant="body1">
                                        {data.uploadedBy}
                                      </Typography>

                                    </Box>





                                  </Scrollbar>
                                </DialogContent>
                                <DialogActions>
                                  <Button color="primary" onClick={handleCloseModal}>
                                    Close
                                  </Button>
                                  {/* <Button onClick={handleClose}>OK</Button> */}
                                </DialogActions>
                              </Dialog>
                            ) : (
                              <AccordionDetails sx={{ cursor: "default" }}>


                                <Box sx={{ width: '100%' }}>
                                  <Typography
                                    variant="body1"
                                    color="text.primary"
                                    dangerouslySetInnerHTML={{
                                      __html: data.announcement
                                        .replace(
                                          /<table([^>]*)>/g,
                                          `<table$1 style="border-collapse: collapse; width: 100%; font-size: 16px;" aria-label="simple table">`
                                        )
                                        .replace(
                                          /<th([^>]*)>/g,
                                          `<th$1 style="border: 1px solid #ccc; padding: 10px; text-align: left; background-color: #f2f2f2;">`
                                        )
                                        .replace(
                                          /<td([^>]*)>/g,
                                          `<td$1 style="border: 1px solid #ccc; padding: 10px; text-align: left;">`
                                        )
                                        .replace(
                                          /<tr([^>]*)>/g,
                                          `<tr$1 style="border-bottom: 1px solid #ddd;">`
                                        )
                                        .replace(
                                          /<a([^>]*)>/g,
                                          `<a$1 style="color: inherit; text-decoration: none;">`
                                        ),
                                    }}
                                  />
                                </Box>

                                {data?.files?.length > 0 &&
                                  data.files[0]?.fileName && (
                                    <Typography variant="body1" component="div">
                                      <b>Attachments:</b>
                                      {data.files.map((file: any, idx: number) => (
                                        file?.fileName && (
                                          <Typography key={idx} component="div" style={{ marginTop: "4px", marginBottom: "9px" }}>
                                            {idx + 1}.{" "}
                                            <Link
                                              href={file.filePath}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              style={{
                                                color: "gray",
                                                fontWeight: "bold",
                                              }}
                                            >
                                              {file.fileName}
                                            </Link>
                                          </Typography>
                                        )
                                      ))}
                                    </Typography>
                                  )}

                                <Typography variant="body1">Uploaded By :</Typography>
                                <Typography variant="body1">
                                  {data.empName}
                                </Typography>
                                <Typography variant="body1">
                                  {data.uploadedBy}
                                </Typography>
                              </AccordionDetails>
                            )}
                          </Accordion>
                        </React.Fragment>
                      );
                    }
                  )}
                </Box>
              </Scrollbar>
            </TabPanel>
          ))}
        </Box>
      </TabContext>
    </DashboardCard>
  );
};

export default TabScrollable;

