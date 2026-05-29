import React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CardContent,
  useTheme,
} from "@mui/material";
import {
  IconAddressBook,
  IconClock,
  IconDownload,
  IconFileDownload,
  IconX,
} from "@tabler/icons-react";
import { StudentApplicationList } from "@/app/api/interfaces/Examination/studentdegreeextensioninterface";
import Scrollbar from "@/app/components/custom-scroll/Scrollbar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { IconCalendar } from "@tabler/icons-react";
import { Avatar, Chip } from "@mui/material";
import Link from "next/link";
import BlankCard from "@/app/components/shared/BlankCard";
interface PopupProps {
  open: boolean;
  handleClose: () => void;
  applicationList: StudentApplicationList[]|null
}
const StuDegreeExtensionApplication: React.FC<PopupProps> = ({
  open,
  handleClose,
  applicationList
}) => {
  const descriptionElementRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

    const theme = useTheme();
  const secondary = theme.palette.primary.main;
  const secondarylight = theme.palette.primary.light;


  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
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
        {"Submitted Applications"}
        <IconButton onClick={handleClose} size="small" sx={{ ml: 2 }}>
          <IconX color="#FF8488" size={24} />
        </IconButton>
      </DialogTitle>
      {/* <Divider/> */}
      <DialogContent dividers sx={{ padding: 0 }}>
        <BlankCard>
          <CardContent sx={{ position: "sticky" }}>
            {applicationList &&
            typeof applicationList === "object" &&
            Object.keys(applicationList).length > 0 ? (
              <Scrollbar sx={{ height: "100vh" }}>
                <Grid container spacing={2}>
                  {applicationList.map((item, index) => (
                    <Grid size={12} key={index}>
                      <Paper elevation={12} variant="outlined">
                        <Box
                          p={1}
                          sx={{
                            borderWidth: "0 0 0 7px",
                            borderStyle: "solid",
                            borderColor: "primary.main",
                          }}
                        >
                          <Stack
                            direction={{
                              xs: "column",
                              sm: "column",
                              md: "row",
                            }}
                            justifyContent="space-between"
                            alignItems="center"
                            mb={0.5}
                          >
                            <Typography variant="h6">{item.Email}</Typography>
                            <Stack
                              direction={{
                                xs: "column",
                                sm: "column",
                                md: "row",
                              }}
                              spacing={1}
                              justifyContent="flex-end"
                            >
                              <Chip
                                sx={{
                                  backgroundColor:
                                    item.Status == "0"
                                      ? "warning.light"
                                      : item.Status == "3"
                                      ? "success.light"
                                      : item.Status == "4"
                                      ? "#FFF3F5"
                                      : "primary.light",
                                }}
                                avatar={
                                  <Avatar
                                    sx={{
                                      backgroundColor: (theme) =>
                                        item.Status =="0"
                                          ? theme.palette.warning.main
                                          : item.Status == "3"
                                          ? theme.palette.success.main
                                          : item.Status =="4"
                                          ? "#E57575"
                                          : theme.palette.primary.main,
                                      color: "white",
                                    }}
                                  >
                                    {item.Status == "4"
                                      ? "Not Approved".slice(0, 1)
                                      : item.Status =="3"
                                      ? "Approved".slice(0, 1)
                                      : "Review in Progress".slice(0, 1)}{" "}
                                  </Avatar>
                                }
                                label={
                                  item.Status == "4"
                                    ? "Not Approved"
                                    : item.Status =="3"
                                    ? "Approved"
                                    : "Review in Progress"
                                }
                              />
                              <Avatar
                                variant="rounded"
                                sx={{
                                  bgcolor: secondarylight,
                                  color: secondary,
                                  width: 40,
                                  height: 40,
                                  borderRadius: "50%", 
                                }}
                              >
                                <IconDownload width={20} />
                              </Avatar>
                            </Stack>
                          </Stack>
                          <Stack
                            direction={{
                              xs: "column",
                              sm: "column",
                              md: "row",
                            }}
                            spacing={1.5}
                            color="textSecondary"
                            mb={0.5}
                          >
                            <IconCalendar width={18} />
                            <Typography
                              style={{ width: "150px" }}
                              variant="subtitle1"
                              fontWeight="bold"
                            >
                              {item.EntryDate}
                            </Typography>

                            <IconClock width={18} />
                            <Typography variant="subtitle1" fontWeight="bold">
                            {item.EntryTime}
                            </Typography>
                          </Stack>
                          <Stack
                            direction={{
                              xs: "column",
                              sm: "column",
                              md: "row",
                            }}
                            spacing={1.5}
                            color="textSecondary"
                            mb={0.5}
                          >
                            {/* <IconFileDownload width={18} />
                            <Typography
                              variant="subtitle1"
                              style={{ width: "150px" }}
                            >
                              <Link
                                href="https://myclass.lpu.in/"
                                target="_blank"
                              >
                                Application Form
                              </Link>
                            </Typography> */}
                            <IconAddressBook width={18} />
                            <Typography variant="subtitle1">
                              {"Student: " +
                                item.ContactNo +
                                ",Parent: " +
                                item.ParentContactNo}
                            </Typography>
                          </Stack>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Scrollbar>
            ) : null}
          </CardContent>
        </BlankCard>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StuDegreeExtensionApplication;
