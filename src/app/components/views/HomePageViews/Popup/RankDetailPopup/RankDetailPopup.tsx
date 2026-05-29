
"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TableCell,
  TableBody,
  Table,
  Chip,
  Skeleton,
  Box,
  TextField,
  useMediaQuery,
  Card,
  Divider,
} from "@mui/material";
import Scrollbar from "@/app/components/custom-scroll/Scrollbar"; // Import Scrollbar
import { IconX } from "@tabler/icons-react";
import { Icon } from "@iconify/react";
import { useTheme } from "@mui/material/styles";
import { useSession } from "next-auth/react";
import { decryptDataforResponse, encryptData } from "@/app/api/services/auth/Encrptdecrpt";
import { getLeaderDashboardDetailsAction } from "@/app/actions/homeAction/leaderRank/getLeaderDashboardDetailsAction";

interface PopupProps {
  open: boolean;
  data: any;
  handleClose: () => void;
  title: string;

}


const RankDetailPopup: React.FC<PopupProps> = ({ open, data, handleClose, title }) => {
  const descriptionElementRef = React.useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const theme = useTheme();
  const isCompact = useMediaQuery(theme.breakpoints.down("lg"));
  const [rankDetail, setRankDetail] = useState<any[]>([]);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [searchText, setSearchText] = useState<string>("");
  const [Searchtdata, setSearchtdata] = useState<any[]>([]);
  const fetchData = async () => {
    try {

      const formfields = {
        Coursecode: data.toString()
      };

      if (!session || !session.user || !session.user.token) {
        throw new Error("Session or token is missing");
      }

      let splitValue = session.user.token.split("NEXT2121ANG");
      const credentialsJson = JSON.stringify(formfields);

      // Encrypt the data
      const { Data } = encryptData(credentialsJson, splitValue[1]);

      const response = await getLeaderDashboardDetailsAction(Data);
      let apiData = response.ApiData;
      const decryptedData = decryptDataforResponse(apiData, splitValue[1]);
      const parsed = JSON.parse(decryptedData);
      // console.log("leadert details ", parsed);
      setRankDetail(parsed);


      if (response.status === "success") {
        setSubmitSuccess("successfully!");
      } else {
        setSubmitError(response.message || "Failed ");
      }
    } catch (error) {
      setSubmitError("Failed . Please try again.");
    } finally {
      setLoading(false);

    }
  };



  useEffect(() => {
    if (open) {
      fetchData();
      descriptionElementRef.current?.focus();
    }
  }, [open]);



  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (open) {
      setLoading(true);
      // Simulate loading complete (remove this in production)
      const timer = setTimeout(() => setLoading(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [open, rankDetail]);





  // Initialize search data whenever data changes or popup opens
  useEffect(() => {
    if (open) {
      setSearchtdata(rankDetail || []);
    }
  }, [open, rankDetail]);

  const handleSearch = () => {
    const filtered = rankDetail.filter((item: any) =>
      [item.Name, item.Regno].some((field) =>
        String(field || "").toLowerCase().includes(searchText.toLowerCase())
      )
    );
    setSearchtdata(filtered);
  };


  const handleReset = () => {
    setSearchText("");
    setSearchtdata(rankDetail || []);
  };



  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="scroll-dialog-title"
      PaperProps={{ sx: { width: { xs: "100%", lg: "65%" }, height: "90%" } }}
      maxWidth="lg"
    >
      {loading ? (
        <LoadingSkeleton handleClose={handleClose} />
      ) : (
        <>
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {title} ({rankDetail[0]?.CourseCode})
            <IconButton onClick={handleClose} size="small" sx={{ ml: 2 }}>
              <IconX color="#FF8488" size={24} />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers>


            {isCompact ? (
              <Box sx={{ overflowY: 'auto', flex: 1 }}>
                {Searchtdata.map((item: any, index: number) => (
                  <React.Fragment key={index}>
                    <Box sx={{ display: "flex", alignItems: "center", width: "98%", padding: "7px" }}>
                      <Card sx={{
                        cursor: "default",
                        // borderLeft: `2px solid ${theme.palette.primary.main}`,
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: "none",
                        borderRadius: 0,
                        padding: 1,
                        wordBreak: "break-word",
                      }}>

                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>



                          <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Typography component="span" sx={{ marginRight: 0 }}><b>Name:</b>{item.Name}</Typography>
                            <Typography component="span" > <b>Marks get:</b> {item.MarksObtained}</Typography>


                            <Typography component="span" ><b>VID:</b> {item.Regno}</Typography>
                            <Typography component="span" >  <b> Term:</b> {item.TermId}</Typography>
                          </Box>


                          <Typography variant="h6" fontWeight={300} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            {item.StudentRank === 1 ? (
                              <Icon icon="fluent-emoji-flat:1st-place-medal" width="37" height="37" />
                            ) : item.StudentRank === 2 ? (
                              <Icon icon="fluent-emoji-flat:2nd-place-medal" width="37" height="37" />
                            ) : item.StudentRank === 3 ? (
                              <Icon icon="fluent-emoji-flat:3rd-place-medal" width="37" height="37" />
                            ) : (
                              <Chip
                                label={`${item.StudentRank}`}
                                sx={{
                                  color: theme.palette.error.main,
                                  bgcolor: theme.palette.error.light,
                                  border: "1px solid",
                                }}
                                size="medium"
                              />
                            )}
                          </Typography>


                        </Box>
                      </Card>
                    </Box>
                    {index !== Searchtdata.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </Box>


            ) : (


              <Scrollbar sx={{ height: "100%" }}>
                <TableContainer>
                  <Table
                    sx={{
                      whiteSpace: "nowrap",
                      ".MuiTableCell-root": { borderBottom: 0 },
                    }}
                  >
                    <TableHead>
                      <TableRow sx={{ borderBottom: 1, borderColor: "divider" }}>
                        {["Rank", "Name", "VID", "Marks Obtained", "Term"].map((header, i) => (
                          <TableCell
                            key={header}
                            sx={{
                              textAlign: "center",
                              fontWeight: "bold",
                              ...(i !== 0 && { borderLeft: 1, borderColor: "divider" }),
                              ...(i === 0 && { borderRight: 1, borderColor: "divider" }),
                            }}
                          >
                            <Typography variant="h6">{header}</Typography>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {Searchtdata.map((basic: any, index: number) => (
                        <TableRow key={index} sx={{ borderTop: 1, borderColor: "divider" }}>
                          <TableCell
                            sx={{
                              textAlign: "center",
                              padding: "10px",
                              borderRight: 1,
                              borderColor: "divider",
                            }}
                          >
                            <Typography variant="h6" fontWeight={300}>
                              {basic.StudentRank === 1 ? (
                                <Icon icon="fluent-emoji-flat:1st-place-medal" width="37" height="37" />
                              ) : basic.StudentRank === 2 ? (
                                <Icon icon="fluent-emoji-flat:2nd-place-medal" width="37" height="37" />
                              ) : basic.StudentRank === 3 ? (
                                <Icon icon="fluent-emoji-flat:3rd-place-medal" width="37" height="37" />
                              ) : (
                                <Chip
                                  label={`${basic.StudentRank}`}
                                  sx={{
                                    color: theme.palette.error.main,
                                    bgcolor: theme.palette.error.light,
                                    border: "1px solid",
                                  }}
                                  size="medium"
                                />
                              )}
                            </Typography>
                          </TableCell>

                          {[basic.Name, basic.Regno, basic.MarksObtained, basic.TermId].map((value, i) => (
                            <TableCell
                              key={i}
                              sx={{
                                textAlign: "center",
                                padding: "15px",
                                borderLeft: 1,
                                borderColor: "divider",
                                whiteSpace: "normal",
                                wordBreak: "break-word",
                              }}
                            >
                              <Typography variant="h6" fontWeight={300} fontSize={".9rem"}>
                                {value}
                              </Typography>
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Scrollbar>


            )}





          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};







const LoadingSkeleton = ({ handleClose }: { handleClose: () => void }) => {

  const theme = useTheme();
  const isCompact = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Leader Dashboard Details
        <IconButton onClick={handleClose} size="small" sx={{ ml: 2 }}>
          <IconX color="#FF8488" size={24} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>




        {isCompact ?
          (
            <Box>
              {[...Array(5)].map((_, index) => (
                <React.Fragment key={index}>
                  <Box sx={{ display: "flex", alignItems: "center", width: "98%", padding: "7px" }}>
                    <Card
                      sx={{
                        cursor: "default",
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: "none",
                        borderRadius: 0,
                        padding: 1,
                        wordBreak: "break-word",
                      }}
                    >
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <Typography component="span" sx={{ marginRight: 0 }}>
                            <Skeleton variant="text" width={200} height={20} />
                          </Typography>
                          <Typography component="span">
                            <Skeleton variant="text" width={150} height={20} />
                          </Typography>
                          <Typography component="span">
                            <Skeleton variant="text" width={100} height={20} />
                          </Typography>
                          <Typography component="span">
                            <Skeleton variant="text" width={50} height={20} />
                          </Typography>
                        </Box>

                        <Typography
                          variant="h6"
                          fontWeight={300}
                          sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                        >
                          <Skeleton variant="circular" width={30} height={30} />
                        </Typography>
                      </Box>
                    </Card>
                  </Box>

                  {/* Divider after each item except the last one */}
                  {index !== 4 && <Divider sx={{ width: "98%", margin: "0 auto" }} />}
                </React.Fragment>
              ))}
            </Box>



          ) :
          (
            <TableContainer>
              <Table
                sx={{
                  whiteSpace: "nowrap",
                  ".MuiTableCell-root": {
                    borderBottom: 0,
                  },
                }}
              >
                {/* Table Header */}
                <TableHead>
                  <TableRow sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <TableCell
                      sx={{
                        width: "15%",
                        textAlign: "center",
                        fontWeight: "bold",
                        borderRight: 1,
                        borderColor: "divider",
                      }}
                    >
                      <Typography variant="h6"> <Skeleton variant="text" width={60} height={30} /></Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        width: "30%",
                        textAlign: "center",
                        fontWeight: "bold",
                        borderLeft: 1,
                        borderColor: "divider",
                      }}
                    >
                      <Typography variant="h6"> <Skeleton variant="text" width={60} height={30} /></Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "center",
                        fontWeight: "bold",
                        borderLeft: 1,
                        borderColor: "divider",
                      }}
                    >
                      <Typography variant="h6"> <Skeleton variant="text" width={60} height={30} /></Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        width: "20%",
                        textAlign: "center",
                        fontWeight: "bold",
                        borderLeft: 1,
                        borderColor: "divider",
                      }}
                    >
                      <Typography variant="h6">  <Skeleton variant="text" width={60} height={30} /></Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "center",
                        fontWeight: "bold",
                        borderLeft: 1,
                        borderColor: "divider",
                      }}
                    >
                      <Typography variant="h6"> <Skeleton variant="text" width={60} height={30} /></Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>

                {/* Table Body Skeleton Rows */}
                <TableBody>
                  {[...Array(8)].map((_, index) => (
                    <TableRow
                      key={index}
                      sx={{ borderTop: 1, borderColor: "divider" }}
                    >
                      {/* Rank */}
                      <TableCell
                        sx={{
                          textAlign: "center",
                          padding: "10px",
                          borderRight: 1,
                          borderColor: "divider",
                        }}
                      >
                        <Skeleton variant="circular" width={37} height={37} />
                      </TableCell>

                      {/* Name */}
                      <TableCell
                        sx={{
                          textAlign: "center",
                          padding: "15px",
                          borderLeft: 1,
                          borderColor: "divider",
                        }}
                      >
                        <Skeleton variant="text" width="80%" height={24} />
                        <Skeleton variant="text" width="60%" height={20} />
                      </TableCell>

                      {/* Roll No */}
                      <TableCell
                        sx={{
                          textAlign: "center",
                          padding: "15px",
                          borderLeft: 1,
                          borderColor: "divider",
                        }}
                      >
                        <Skeleton variant="text" width="70%" height={24} />
                      </TableCell>

                      {/* Marks Obtained */}
                      <TableCell
                        sx={{
                          textAlign: "center",
                          padding: "15px",
                          borderLeft: 1,
                          borderColor: "divider",
                        }}
                      >
                        <Skeleton variant="text" width="50%" height={24} />
                      </TableCell>

                      {/* Term ID */}
                      <TableCell
                        sx={{
                          textAlign: "center",
                          padding: "15px",
                          borderLeft: 1,
                          borderColor: "divider",
                        }}
                      >
                        <Skeleton variant="text" width="50%" height={24} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}




      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </>
  );
};

export default RankDetailPopup;

