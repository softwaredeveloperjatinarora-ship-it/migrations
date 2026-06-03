"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PrintIcon from "@mui/icons-material/Print";
import Breadcrumb from "@/app/dashboard/staff/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import ChildCard from "@/app/components/shared/ChildCard";
import { getApplicationDetailsById } from "@/app/actions/StaffActions/SemesterExchange/getApplicationDetailsById";
import { getStuDetailsWithImage } from "@/app/actions/StaffActions/SemesterExchange/getStuDetailsWithImage";
import { getStudentDetailsWithMarks } from "@/app/actions/StaffActions/SemesterExchange/getStudentDetailsWithMarks";

const BCrumb = [
  { to: "/dashboard/staff", title: "Home", icon: "ic:baseline-home" },
  { to: "/dashboard/staff/SemesterExchange/StaffDashboard", title: "SE Dashboard" },
  { title: "Application Details" },
];

const SERVER_URL = "https://files.lpu.in/umsweb/DIA/SemesterExchangedocuments/";

// ── Interfaces ────────────────────────────────────────────────────────────────

interface StudentApplication {
  applicationId?: string;
  registrationNo?: string;
  emailId?: string;
  countryName?: string;
  whatsAppNo?: string;
  phoneNumber?: string;
  parentContact?: string;
  applyingOption?: string;
  universityOption1?: string;
  universityOption2?: string;
  universityOption3?: string;
  passportStatus?: string;
  passportNumber?: string;
  passportIssueDate?: string;
  passportValidUpto?: string;
  isVisaRejected?: string;
  visaRejectedReason?: string;
  visaRejectedCountry?: string;
  englishTestType?: string;
  speakingScore?: string;
  listeningScore?: string;
  readingScore?: string;
  writingScore?: string;
  overallScore?: string;
  englishTestYear?: string;
  isSelfFunded?: string;
  sponsorName?: string;
  sponsorRelation?: string;
  sponsorContact?: string;
  sponsorEmail?: string;
  availableFunds?: string;
  acceptPolicy?: string;
  relativeName?: string;
  relativeRelation?: string;
  relativeCountry?: string;
  resumeFileName?: string;
  feesProofFileName?: string;
  consentLetterFileName?: string;
  passportFileName?: string;
  englishTestDocumentPath?: string;
  [key: string]: unknown;
}

interface StudentWithImage {
  studentName?: string;
  batchYear?: string;
  courseName?: string;
  programCode?: string;
  schoolName?: string;
  imageData?: string;
}

interface MarkRecord {
  officialCode?: string;
  section?: string;
  schoolId?: string;
  grade?: string;
  gradeNum?: string;
}

// ── Static config (mirrors Angular formSections / documentUploads) ─────────────

const FORM_SECTIONS: { label: string; keys: (keyof StudentApplication)[] }[] = [
  { label: "Personal Details", keys: ["applicationId", "registrationNo", "emailId", "countryName", "whatsAppNo", "phoneNumber", "parentContact"] },
  { label: "University Preferences", keys: ["applyingOption", "universityOption1", "universityOption2", "universityOption3"] },
  { label: "Relative at Abroad", keys: ["relativeName", "relativeRelation", "relativeCountry"] },
  { label: "Passport Details", keys: ["passportStatus", "passportNumber", "passportIssueDate", "passportValidUpto"] },
  { label: "Visa Details", keys: ["isVisaRejected", "visaRejectedReason", "visaRejectedCountry"] },
  { label: "English Test Details", keys: ["englishTestType", "speakingScore", "listeningScore", "readingScore", "writingScore", "overallScore", "englishTestYear"] },
  { label: "Sponsor Details", keys: ["isSelfFunded", "sponsorName", "sponsorRelation", "sponsorContact", "sponsorEmail"] },
  { label: "Financial & Declaration", keys: ["availableFunds"] },
];

const DOCUMENT_UPLOADS: { key: keyof StudentApplication; label: string }[] = [
  { key: "resumeFileName", label: "Resume Document" },
  { key: "feesProofFileName", label: "Fees Proof Document" },
  { key: "consentLetterFileName", label: "Consent Letter" },
  { key: "passportFileName", label: "Passport Document" },
  { key: "englishTestDocumentPath", label: "English Test Proof" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function isErrorResponse(data: unknown): data is { status: "error"; message: string } {
  return typeof data === "object" && data !== null && (data as Record<string, unknown>).status === "error";
}

function beautifyLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace("Id", "ID")
    .replace(" No", " No.")
    .replace("Upto", "Up To")
    .replace("Whatsapp", "WhatsApp")
    .trim();
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getDisplayValue(key: keyof StudentApplication, app: StudentApplication): string {
  const raw = app[key];
  if (raw === null || raw === undefined || raw === "") return "N/A";
  if (key === "passportIssueDate" || key === "passportValidUpto") return formatDate(String(raw));
  if (key === "acceptPolicy") return String(raw).toLowerCase() === "yes" || raw === true ? "Yes" : "No";
  return String(raw);
}

// Mirrors Angular getFilteredFormSections()
function getFilteredSections(app: StudentApplication) {
  return FORM_SECTIONS.map((section) => {
    if (section.label === "Relative at Abroad") {
      if (!app.relativeName) return { ...section, keys: ["relativeName"] as (keyof StudentApplication)[] };
    }
    if (section.label === "Passport Details") {
      if (!app.passportStatus || app.passportStatus === "No")
        return { ...section, keys: ["passportStatus"] as (keyof StudentApplication)[] };
    }
    if (section.label === "Visa Details") {
      if (app.isVisaRejected === "No")
        return { ...section, keys: ["isVisaRejected"] as (keyof StudentApplication)[] };
    }
    if (section.label === "English Test Details") {
      if (["NotRequried", "NotGiven", "Applied"].includes(app.englishTestType ?? ""))
        return { ...section, keys: ["englishTestType"] as (keyof StudentApplication)[] };
    }
    if (section.label === "Sponsor Details") {
      if (["Self", "Parent"].includes(app.isSelfFunded ?? "") ||
          !app.isSelfFunded || app.isSelfFunded === "NA")
        return { ...section, keys: ["isSelfFunded"] as (keyof StudentApplication)[] };
    }
    return section;
  });
}

function countGradeF(marks: MarkRecord[]): number {
  return marks.filter((m) => {
    const grade = m.grade?.toUpperCase();
    const gradeNum = parseInt(m.gradeNum ?? "", 10);
    return grade === "F" || (!isNaN(gradeNum) && gradeNum <= 6);
  }).length;
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  registrationNo: string;
}

const SemesterExchangeApplicationDetails = ({ registrationNo }: Props) => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [application, setApplication] = useState<StudentApplication | null>(null);
  const [studentWithImage, setStudentWithImage] = useState<StudentWithImage | null>(null);
  const [studentImage, setStudentImage] = useState<string>("");
  const [programCode, setProgramCode] = useState("");
  const [sectionCode, setSectionCode] = useState("");
  const [gradeFCount, setGradeFCount] = useState(0);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const appRaw = await getApplicationDetailsById(registrationNo);

      if (isErrorResponse(appRaw)) { setError(appRaw.message); return; }

      const appArr = Array.isArray(appRaw) ? (appRaw as StudentApplication[]) : [];
      if (appArr.length === 0) { setError("No application data found for this registration number."); return; }

      setApplication(appArr[0]);
      document.title = `Application Details — ${registrationNo}`;

      // Image and marks load separately (non-blocking)
      setImageLoading(true);
      Promise.all([
        getStuDetailsWithImage(registrationNo),
        getStudentDetailsWithMarks(registrationNo),
      ]).then(([imgRaw, marksRaw]) => {
        if (!isErrorResponse(imgRaw)) {
          const imgArr = Array.isArray(imgRaw) ? (imgRaw as StudentWithImage[]) : [];
          if (imgArr.length > 0) {
            setStudentWithImage(imgArr[0]);
            if (imgArr[0].imageData) {
              setStudentImage(`data:image/jpeg;base64,${imgArr[0].imageData}`);
            }
          }
        }
        if (!isErrorResponse(marksRaw)) {
          const marksArr = Array.isArray(marksRaw) ? (marksRaw as MarkRecord[]) : [];
          if (marksArr.length > 0) {
            setProgramCode(String(marksArr[0].officialCode ?? ""));
            setSectionCode(String(marksArr[0].section ?? ""));
            setGradeFCount(countGradeF(marksArr));
          }
        }
        setImageLoading(false);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load application details");
    } finally {
      setLoading(false);
    }
  }, [registrationNo]);

  useEffect(() => { loadData(); }, [loadData]);

  const filteredSections = useMemo(() => (application ? getFilteredSections(application) : []), [application]);

  const isReadyForPrint = !loading && !imageLoading;

  // ── Render ──────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <Stack minHeight={400} alignItems="center" justifyContent="center" spacing={1}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">Loading application details...</Typography>
      </Stack>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Alert severity="error" action={<Button onClick={loadData}>Retry</Button>}>{error}</Alert>
      </Box>
    );
  }

  if (!application) return null;

  return (
    <>
      <Breadcrumb title="Application Details" items={BCrumb} titleIcon="mdi:file-account-outline" />

      <ChildCard>
        {/* Action buttons */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push("/dashboard/staff/SemesterExchange/StaffDashboard")}
          >
            Back to Dashboard
          </Button>
          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={() => window.print()}
            disabled={!isReadyForPrint}
          >
            Print Details
          </Button>
        </Stack>

        {/* Student header card */}
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "flex-start" }} spacing={2}>
              {/* Student info */}
              <Grid container spacing={1} sx={{ flex: 1 }}>
                <Grid item xs={6} sm={3}><Typography variant="body2" color="error" fontWeight={700}>Student Name:</Typography></Grid>
                <Grid item xs={6} sm={3}><Typography variant="body2" fontWeight={700}>{studentWithImage?.studentName ?? "—"}</Typography></Grid>
                <Grid item xs={6} sm={3}><Typography variant="body2" color="error" fontWeight={700}>Batch Year:</Typography></Grid>
                <Grid item xs={6} sm={3}><Typography variant="body2" fontWeight={700}>{studentWithImage?.batchYear ?? "—"}</Typography></Grid>

                <Grid item xs={6} sm={3}><Typography variant="body2" color="error" fontWeight={700}>Course:</Typography></Grid>
                <Grid item xs={6} sm={3}><Typography variant="body2" fontWeight={700}>{studentWithImage?.courseName ?? "—"}</Typography></Grid>
                <Grid item xs={6} sm={3}><Typography variant="body2" color="error" fontWeight={700}>Program Code : Section:</Typography></Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" fontWeight={700}>
                    {programCode || studentWithImage?.programCode || "—"} : {sectionCode || "—"}
                  </Typography>
                </Grid>

                <Grid item xs={6} sm={3}><Typography variant="body2" color="error" fontWeight={700}>University Option 1:</Typography></Grid>
                <Grid item xs={6} sm={3}><Typography variant="body2" fontWeight={700}>{application.universityOption1 || "—"}</Typography></Grid>
                <Grid item xs={6} sm={3}><Typography variant="body2" color="error" fontWeight={700}>University Option 2:</Typography></Grid>
                <Grid item xs={6} sm={3}><Typography variant="body2" fontWeight={700}>{application.universityOption2 || "—"}</Typography></Grid>

                {gradeFCount > 0 && (
                  <>
                    <Grid item xs={6} sm={3}><Typography variant="body2" color="error" fontWeight={700}>Grade F / Low Grade Count:</Typography></Grid>
                    <Grid item xs={6} sm={3}><Typography variant="body2" color="error" fontWeight={700}>{gradeFCount}</Typography></Grid>
                  </>
                )}
              </Grid>

              {/* Student image */}
              {studentImage && (
                <Box flexShrink={0}>
                  {imageLoading ? (
                    <CircularProgress size={24} />
                  ) : (
                    <Box
                      component="img"
                      src={studentImage}
                      alt="Student"
                      sx={{ width: 130, height: 130, borderRadius: "50%", objectFit: "cover", border: "3px solid", borderColor: "primary.main" }}
                    />
                  )}
                </Box>
              )}
            </Stack>
          </CardContent>
        </Card>

        {/* Dynamic form sections */}
        {filteredSections.map((section) => (
          <Box key={section.label} mb={3}>
            <Typography variant="h6" color="info.main" mb={1}>{section.label}</Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              {section.keys.map((key) => (
                <Grid item xs={12} sm={6} md={4} key={key}>
                  <Typography variant="body2" fontWeight={600} mb={0.5}>
                    {key === "acceptPolicy" ? "Declaration Statement" : beautifyLabel(key)}
                  </Typography>
                  <Box
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1,
                      p: 1,
                      bgcolor: "grey.50",
                      minHeight: 36,
                    }}
                  >
                    <Typography variant="body2">{getDisplayValue(key, application)}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}

        {/* Uploaded documents */}
        <Box mb={2}>
          <Typography variant="h6" color="info.main" mb={1}>Uploaded Documents</Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {DOCUMENT_UPLOADS.map((doc) => {
              const fileName = application[doc.key] as string | undefined;
              return (
                <Grid item xs={12} sm={6} md={4} key={doc.key}>
                  <Typography variant="body2" fontWeight={600} mb={0.5}>{doc.label}</Typography>
                  {fileName && fileName.length > 0 ? (
                    <Button
                      variant="outlined"
                      size="small"
                      href={`${SERVER_URL}${fileName}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Uploaded
                    </Button>
                  ) : (
                    <Typography variant="body2" color="text.secondary">No document uploaded.</Typography>
                  )}
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </ChildCard>
    </>
  );
};

export default SemesterExchangeApplicationDetails;
