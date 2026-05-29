"use client";

import * as React from "react";
import {
  Box,
  Typography,
  Divider,
  Grid,
  Stack,
  useMediaQuery,
  useTheme,
  CardContent,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  Event as EventIcon,
  Schedule as ScheduleIcon,
  LibraryBooks as LibraryBooksIcon,
  Science as ScienceIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from "@mui/icons-material"; // Importing Material icons
import { IconMoodHappy } from "@tabler/icons-react"; // Importing a common icon
import ChildCard from "@/app/components/shared/ChildCard";
import { format } from "date-fns";
import BlankCard from "../../shared/BlankCard";
import CustomSwitch from "../../forms/theme-elements/CustomSwitch";

const SheetsDetail = Array.from({ length: 6 }, (_, i) => [
  { id: i + 1, PktNo: `Th00${i + 1}`, From: "1121", To: "1122", Count: "10", Description: "Theory" },
  { id: i + 7, PktNo: `Pr00${i + 1}`, From: "1121", To: "1122", Count: "10", Description: "Practical" },
  { id: i + 13, PktNo: `Lib00${i + 1}`, From: "1121", To: "1122", Count: "10", Description: "Library" },
]).flat();

const followerCard = [
  { title: "Exam Date", location: format(new Date(), "EEEE, MMMM dd, yyyy"), icon: <EventIcon /> },
  { title: "Exam Time", location: "12:30 PM - 1:30 PM", icon: <ScheduleIcon /> },
  { 
    title: "Strength", 
    strengthData: [
      { label: "Theory-20", color: "primary", icon: <LibraryBooksIcon /> },
      { label: "Library-12", color: "secondary", icon: <LibraryBooksIcon /> },
      { label: "Practical-12", color: "warning", icon: <ScienceIcon /> }
    ]
  },
];

const TabVertical = () => {
  const [theorySwitchStates, setTheorySwitchStates] = React.useState<boolean[]>(Array(6).fill(false)); // 6 Theory sheets
  const [librarySwitchStates, setLibrarySwitchStates] = React.useState<boolean[]>(Array(6).fill(false)); // 6 Library sheets
  const [practicalSwitchStates, setPracticalSwitchStates] = React.useState<boolean[]>(Array(6).fill(false)); // 6 Practical sheets
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const toggleSwitch = (id: number, type: string) => {
    if (type === "Theory") {
      setTheorySwitchStates((prev) => {
        const newStates = [...prev];
        newStates[id] = !newStates[id];
        return newStates;
      });
    } else if (type === "Library") {
      setLibrarySwitchStates((prev) => {
        const newStates = [...prev];
        newStates[id] = !newStates[id];
        return newStates;
      });
    } else if (type === "Practical") {
      setPracticalSwitchStates((prev) => {
        const newStates = [...prev];
        newStates[id] = !newStates[id];
        return newStates;
      });
    }
  };

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const theorySheets = SheetsDetail.filter((sheet) => sheet.Description === "Theory");
  const librarySheets = SheetsDetail.filter((sheet) => sheet.Description === "Library");
  const practicalSheets = SheetsDetail.filter((sheet) => sheet.Description === "Practical");

  // Calculate selected counts and names
  const selectedTheoryCount = theorySwitchStates.filter(Boolean).length;
  const selectedLibraryCount = librarySwitchStates.filter(Boolean).length;
  const selectedPracticalCount = practicalSwitchStates.filter(Boolean).length;

  const selectedTheoryNames = theorySheets
    .filter((_, index) => theorySwitchStates[index])
    .map((sheet) => sheet.PktNo);

  const selectedLibraryNames = librarySheets
    .filter((_, index) => librarySwitchStates[index])
    .map((sheet) => sheet.PktNo);

  const selectedPracticalNames = practicalSheets
    .filter((_, index) => practicalSwitchStates[index])
    .map((sheet) => sheet.PktNo);

  // Calculate the sum of Count for selected sheets
  const sumOfSelectedCounts = (sheets: typeof SheetsDetail, switchStates: boolean[]) => {
    return sheets
      .filter((_, index) => switchStates[index])
      .reduce((sum, sheet) => sum + parseInt(sheet.Count), 0);
  };

  // Extract required strengths from followerCard
  const requiredStrengths = {
    Theory: 20,
    Library: 12,
    Practical: 12,
  };

  return (
    <Box bgcolor="grey.100" flexGrow={1} border={1} borderColor="#e5eaef" borderRadius={1} p={2}>
      <Grid container spacing={2} justifyContent="center">
        {followerCard.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 4 }}>
            <BlankCard sx={{ height: '100%' }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} justifyContent="center">
                  {card.icon && React.cloneElement(card.icon, { color: "primary" })}
                  <Typography variant="h6" align="center" color="primary">
                    {card.title}
                  </Typography>
                </Stack>
                
                {card.strengthData ? (
                  <Stack direction="row" spacing={1} sx={{ mt: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {card.strengthData.map((item, idx) => (
                      <Chip
                        key={idx}
                        label={item.label}
                        color={item.color as "primary" | "secondary" | "warning" | "default" | "error" | "success" | "info"}
                        variant="outlined"
                        icon={item.icon}
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="subtitle1" align="center" color="textSecondary">
                    {card.location}
                  </Typography>
                )}
              </CardContent>
            </BlankCard>
          </Grid>
        ))}
      </Grid>

      <Typography variant="subtitle1" color="error" textAlign="center" mt={2} fontWeight="bold">
        Kindly choose answer sheet packets carefully
      </Typography>

      <BlankCard sx={{ mt: 2, p: 1 }}>
        <Typography variant="h6">
          Selected Packets: {selectedTheoryCount + selectedLibraryCount + selectedPracticalCount}
        </Typography>

        {/* Selected counts */}
        <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
          <Chip
            label={`Theory: ${selectedTheoryCount}`}
            color="primary"
            variant="outlined"
            icon={<LibraryBooksIcon />}
          />
          <Chip
            label={`Library: ${selectedLibraryCount}`}
            color="secondary"
            variant="outlined"
            icon={<LibraryBooksIcon />}
          />
          <Chip
            label={`Practical: ${selectedPracticalCount}`}
            color="warning"
            variant="outlined"
            icon={<ScienceIcon />}
          />
        </Stack>

        {/* Selected sheet names */}
        <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
          {selectedTheoryNames.map((name, index) => (
            <Chip
              key={index}
              label={name}
              color="primary"
              variant="outlined"
              icon={<LibraryBooksIcon />}
              sx={{ mb: 1 }}
            />
          ))}
          {selectedLibraryNames.map((name, index) => (
            <Chip
              key={index}
              label={name}
              color="secondary"
              variant="outlined"
              icon={<LibraryBooksIcon />}
              sx={{ mb: 1 }}
            />
          ))}
          {selectedPracticalNames.map((name, index) => (
            <Chip
              key={index}
              label={name}
              color="warning"
              variant="outlined"
              icon={<ScienceIcon />}
              sx={{ mb: 1 }}
            />
          ))}
        </Stack>
      </BlankCard>

      {/* Collapsible Rows for Theory, Library, and Practical */}
      {[
        { type: "Theory", sheets: theorySheets, switchStates: theorySwitchStates, color: "primary", icon: <LibraryBooksIcon /> },
        { type: "Library", sheets: librarySheets, switchStates: librarySwitchStates, color: "secondary", icon: <LibraryBooksIcon /> },
        { type: "Practical", sheets: practicalSheets, switchStates: practicalSwitchStates, color: "warning", icon: <ScienceIcon /> },
      ].map((section) => {
        const sectionType = section.type as keyof typeof requiredStrengths;
        const totalCount = sumOfSelectedCounts(section.sheets, section.switchStates);
        const requiredStrength = requiredStrengths[sectionType];
        const isCountSufficient = totalCount >= requiredStrength;

        return (
          <Accordion
            key={section.type}
            expanded={expanded === section.type}
            onChange={handleChange(section.type)}
            sx={{ width: "100%", mt: 2 }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`${section.type}-content`}
              id={`${section.type}-header`}
              sx={{
                flexDirection: "row-reverse",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                {section.icon}
                <Typography variant="h6" sx={{ flexGrow: 1, ml: 1 }}>
                  {section.type} Sheets
                </Typography>
              </Stack>
              <Chip
                label={`Total Count: ${totalCount}`}
                color={isCountSufficient ? "success" : "error"}
                icon={isCountSufficient ? <CheckCircleIcon /> : <ErrorIcon />}
                sx={{ ml: "auto" }}
              />
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {section.sheets.map((sheet, index) => (
                  <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
                    <Box sx={{ cursor: "pointer" }} onClick={() => toggleSwitch(index, section.type)}>
                      <BlankCard
                        sx={{
                          border: 2,
                          borderColor: section.switchStates[index] ? "success.main" : "grey.400",
                          transition: "0.3s",
                          "&:hover": { boxShadow: 4, borderColor: "primary.main" },
                        }}
                      >
                        <CardContent sx={{ p: 1 }}>
                          <Stack direction="column" spacing={1}>
                            <Typography variant="subtitle1" fontWeight="bold" color="textPrimary">
                              PktName: {sheet.PktNo}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              From: {sheet.From} - To: {sheet.To}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Count: {sheet.Count}
                            </Typography>
                            <CustomSwitch checked={section.switchStates[index]} />
                          </Stack>
                        </CardContent>
                      </BlankCard>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};

export default TabVertical;