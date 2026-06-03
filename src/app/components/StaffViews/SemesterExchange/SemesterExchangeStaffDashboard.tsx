"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import Breadcrumb from "@/app/dashboard/staff/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import ChildCard from "@/app/components/shared/ChildCard";
import { getEmployeeDetails } from "@/app/actions/StaffActions/SemesterExchange/getEmployeeDetails";
import { getAllApplications } from "@/app/actions/StaffActions/SemesterExchange/getAllApplications";
import { getAllAuthorityRemarks } from "@/app/actions/StaffActions/SemesterExchange/getAllAuthorityRemarks";
import { getEvaluationRemarks } from "@/app/actions/StaffActions/SemesterExchange/getEvaluationRemarks";
import { sendApproveRequest } from "@/app/actions/StaffActions/SemesterExchange/sendApproveRequest";
import { sendForwardRequest } from "@/app/actions/StaffActions/SemesterExchange/sendForwardRequest";
import { updateCounsellingRemarks } from "@/app/actions/StaffActions/SemesterExchange/updateCounsellingRemarks";
import { studentEvaluationAddNew } from "@/app/actions/StaffActions/SemesterExchange/studentEvaluationAddNew";

const BCrumb = [
  { to: "/dashboard/staff", title: "Home", icon: "ic:baseline-home" },
  { title: "Semester Exchange" },
  { title: "Staff Dashboard" },
];

// ── Interfaces ────────────────────────────────────────────────────────────────

interface Application {
  applicationId: string;
  registrationNo: string;
  phoneNumber: string;
  whatsAppNo: string;
  parentContact: string;
  counsellingStatus: string;
  isApproved: string | null;
  dealingUId: string;
  dealingUserInterviewRemarks: string;
  dealingHODId: string;
  dealingHODRemarks: string;
  dealingHow: string;
  dealingFaculty: string;
  dealingAuthority: string;
  counsellingRemarks: string;
  isdealingFaculty: boolean;
  isDealingAuthority: boolean;
  isHOD: boolean;
  isHoW: boolean;
  [key: string]: unknown;
}

interface AuthorityRemark {
  registrationNo?: string;
  dealingUidRemarks?: string;
  dealingHODRemarks?: string;
  dealingHowRemarks?: string;
  dealingUserInterviewRemarks?: string;
  facultyRemarks?: string;
  hodRemarks?: string;
  howRemarks?: string;
  ApprovalRemarks?: string;
  [key: string]: unknown;
}

interface EmployeeInfo {
  employeeName: string;
  employeeCode: string | number;
  contactNo: string;
  department: string;
  departmentName: string;
  userRole: string;
}

interface EvalForm {
  AcademicsMarks: string;
  CommunicationSkillsMarks: string;
  AttitudeMarks: string;
  ExtraCurricularMarks: string;
  KnowledgeMarks: string;
  Comments: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const defaultEvalForm: EvalForm = {
  AcademicsMarks: "",
  CommunicationSkillsMarks: "",
  AttitudeMarks: "",
  ExtraCurricularMarks: "",
  KnowledgeMarks: "",
  Comments: "",
};

const evalFields: { label: string; name: keyof Omit<EvalForm, "Comments"> }[] = [
  { label: "Academics Marks", name: "AcademicsMarks" },
  { label: "Communication Skills Marks", name: "CommunicationSkillsMarks" },
  { label: "Attitude Marks", name: "AttitudeMarks" },
  { label: "Extra-Curricular Marks", name: "ExtraCurricularMarks" },
  { label: "Knowledge Marks", name: "KnowledgeMarks" },
];

function isErrorResponse(data: unknown): data is { status: "error"; message: string } {
  return typeof data === "object" && data !== null && (data as Record<string, unknown>).status === "error";
}

// isApproved comes back as "True", "False", or null/undefined/"null" from API
function isPending(isApproved: string | null | undefined): boolean {
  return isApproved !== "True" && isApproved !== "False";
}

function enrichApplications(
  applications: Application[],
  empCode: string,
): {
  enriched: Application[];
  globalRoles: { isdealingFaculty: boolean; isDealingAuthority: boolean; isHOD: boolean; isHoW: boolean };
} {
  const globalRoles = { isdealingFaculty: false, isDealingAuthority: false, isHOD: false, isHoW: false };

  const enriched = applications.map((app) => {
    const dealingFaculty = app.dealingFaculty ? String(app.dealingFaculty).trim() : null;
    const dealingAuthority = app.dealingAuthority ? String(app.dealingAuthority).trim() : null;
    const dealingHODId = app.dealingHODId ? String(app.dealingHODId).trim() : null;
    const dealingHow = app.dealingHow ? String(app.dealingHow).trim() : null;

    const result: Application = { ...app, isDealingAuthority: false, isHOD: false, isHoW: false, isdealingFaculty: false };

    if (empCode) {
      if (dealingAuthority === empCode) {
        result.isDealingAuthority = true;
        globalRoles.isDealingAuthority = true;
      } else if (dealingHODId === empCode) {
        result.isHOD = true;
        globalRoles.isHOD = true;
      } else if (dealingHow === empCode) {
        result.isHoW = true;
        globalRoles.isHoW = true;
      } else if (dealingFaculty === empCode) {
        result.isdealingFaculty = true;
        globalRoles.isdealingFaculty = true;
      }
    }

    return result;
  });

  return { enriched, globalRoles };
}

function buildPageTitle(roles: { isdealingFaculty: boolean; isDealingAuthority: boolean; isHOD: boolean; isHoW: boolean }): string {
  if (roles.isDealingAuthority) return "** Dealing Authority Dashboard **";
  if (roles.isHOD) return "** Head of Department Dashboard **";
  if (roles.isHoW) return "** Head of Wing Dashboard **";
  if (roles.isdealingFaculty) return "** Dealing Faculty Dashboard **";
  return "Dashboard";
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ApprovalBadge({ value }: { value: string | null }) {
  const v = String(value ?? "");
  const color = v === "True" ? "success" : v === "False" ? "error" : "warning";
  const label = v === "True" ? "Approved" : v === "False" ? "Rejected" : "Pending";
  return <Chip label={label} color={color} size="small" />;
}

function CounsellingBadge({ status }: { status: string }) {
  return <Chip label={status === "True" ? "Done" : "Pending"} color={status === "True" ? "success" : "warning"} size="small" />;
}

function ActionBtn({
  children,
  color,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  color: "primary" | "secondary" | "success" | "error" | "warning" | "info";
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <Button variant="contained" color={color} size="small" onClick={onClick} disabled={disabled} sx={{ fontSize: 11, px: 1, py: 0.3 }}>
      {children}
    </Button>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

const SemesterExchangeStaffDashboard = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [employee, setEmployee] = useState<EmployeeInfo | null>(null);
  const [allApplications, setAllApplications] = useState<Application[]>([]);
  const [allRemarks, setAllRemarks] = useState<AuthorityRemark[]>([]);
  const [pageTitle, setPageTitle] = useState("Dashboard");
  const [query, setQuery] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Evaluation dialog
  const [evalOpen, setEvalOpen] = useState(false);
  const [evalForm, setEvalForm] = useState<EvalForm>(defaultEvalForm);
  const [evalSubmitted, setEvalSubmitted] = useState(false);
  const [evalRemarksBy, setEvalRemarksBy] = useState("");
  const [selectedRegNo, setSelectedRegNo] = useState("");
  const [selectedAppId, setSelectedAppId] = useState("");

  // Counselling form dialog (submit new remarks)
  const [counselOpen, setCounselOpen] = useState(false);
  const [counselComment, setCounselComment] = useState("");
  const [counselSubmitted, setCounselSubmitted] = useState(false);

  // Forward dialog
  const [forwardOpen, setForwardOpen] = useState(false);
  const [forwardUid, setForwardUid] = useState("");
  const [forwardAction, setForwardAction] = useState<"Hod" | "How" | "Faculty">("Hod");
  const [forwardTitle, setForwardTitle] = useState("");
  const forwardAppRef = useRef<Application | null>(null);

  // Accept confirm dialog
  const [acceptOpen, setAcceptOpen] = useState(false);
  const acceptAppRef = useRef<Application | null>(null);

  // Reject dialog
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const rejectAppRef = useRef<Application | null>(null);

  // View remarks dialog (read-only — counselling view, authority remarks, eval details, etc.)
  const [remarksOpen, setRemarksOpen] = useState(false);
  const [remarksTitle, setRemarksTitle] = useState("");
  const [remarksContent, setRemarksContent] = useState("");

  // ── Data loading ─────────────────────────────────────────────────────────

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [empRaw, appsRaw, remarksRaw] = await Promise.all([
        getEmployeeDetails(),
        getAllApplications(),
        getAllAuthorityRemarks(),
      ]);

      if (isErrorResponse(empRaw)) { setError(empRaw.message); return; }

      const empArray = Array.isArray(empRaw) ? (empRaw as EmployeeInfo[]) : [];
      const emp = empArray[0];
      if (!emp) { setError("No employee details found."); return; }

      const empInfo: EmployeeInfo = { ...emp, employeeCode: String(emp.employeeCode).trim() };
      setEmployee(empInfo);

      const apps: Application[] = Array.isArray(appsRaw) ? (appsRaw as Application[]) : [];
      const remarks: AuthorityRemark[] = Array.isArray(remarksRaw) ? (remarksRaw as AuthorityRemark[]) : [];
      setAllRemarks(remarks);

      const { enriched, globalRoles } = enrichApplications(apps, String(empInfo.employeeCode));
      setAllApplications(enriched);

      const title = buildPageTitle(globalRoles);
      setPageTitle(title);
      document.title = `Semester Exchange ${title}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Derived state ─────────────────────────────────────────────────────────

  const hasAnyRole = useMemo(
    () => allApplications.some((a) => a.isdealingFaculty || a.isDealingAuthority || a.isHOD || a.isHoW),
    [allApplications],
  );

  const visibleApplications = useMemo(() => {
    const base = hasAnyRole
      ? allApplications.filter((a) => a.isdealingFaculty || a.isDealingAuthority || a.isHOD || a.isHoW)
      : allApplications;

    const q = query.trim().toLowerCase();
    if (!q) return base;
    return base.filter((app) =>
      [app.registrationNo, app.applicationId, app.phoneNumber, app.whatsAppNo].some((v) =>
        String(v ?? "").toLowerCase().includes(q),
      ),
    );
  }, [allApplications, hasAnyRole, query]);

  // ── Remark helpers ────────────────────────────────────────────────────────

  const getRemarks = (regNo: string) => allRemarks.find((r) => r.registrationNo === regNo);

  const hasFacultyRemarks = (row: Application) => {
    const r = getRemarks(row.registrationNo);
    return !!(r?.facultyRemarks || row.dealingUserInterviewRemarks);
  };
  const hasHODRemarks = (row: Application) => {
    const r = getRemarks(row.registrationNo);
    return !!(r?.hodRemarks || row.dealingHODRemarks);
  };
  const hasHOWRemarks = (row: Application) => {
    const r = getRemarks(row.registrationNo);
    return !!(r?.howRemarks || r?.dealingHowRemarks);
  };
  const hasAuthorityRemarks = (row: Application) => {
    const r = getRemarks(row.registrationNo);
    return !!(r?.ApprovalRemarks || r?.dealingUidRemarks);
  };

  // ── View Application ──────────────────────────────────────────────────────

  const viewApplication = (row: Application) => {
    router.push(`/dashboard/staff/SemesterExchange/ApplicationDetails/${row.registrationNo}`);
  };

  // ── View remarks (read-only) ──────────────────────────────────────────────

  const openRemarksDialog = (title: string, content: string) => {
    setRemarksTitle(title);
    setRemarksContent(content || "No remarks available.");
    setRemarksOpen(true);
  };

  // counsellingStatus === 'True' → read-only view of existing remarks (mirrors Angular viewCounsellingRemarks)
  const viewCounsellingRemarks = (row: Application) => {
    openRemarksDialog("Counselling Remarks", row.counsellingRemarks || "No remarks available.");
  };

  const viewFacultyRemarks = (row: Application) => {
    const r = getRemarks(row.registrationNo);
    openRemarksDialog("Faculty Remarks", (r?.dealingUserInterviewRemarks || r?.facultyRemarks || row.dealingUserInterviewRemarks) ?? "");
  };
  const viewHODRemarks = (row: Application) => {
    const r = getRemarks(row.registrationNo);
    openRemarksDialog("HOD Remarks", (r?.hodRemarks || row.dealingHODRemarks) ?? "");
  };
  const viewHOWRemarks = (row: Application) => {
    const r = getRemarks(row.registrationNo);
    openRemarksDialog("Head of Wing Remarks", (r?.howRemarks || r?.dealingHowRemarks) ?? "");
  };
  const viewAuthorityRemarks = (row: Application) => {
    const r = getRemarks(row.registrationNo);
    openRemarksDialog("Authority Remarks", (r?.ApprovalRemarks || r?.dealingUidRemarks) ?? "");
  };

  const viewEvaluationRemarks = async (row: Application) => {
    setActionLoading(true);
    try {
      debugger;
      const res = await getEvaluationRemarks(row.registrationNo);
      console.log(JSON.stringify(res)+ ' remarks eval')
      if (res.status === "error") {
        openRemarksDialog("Evaluation Details", "Could not load evaluation details.");
        return;
      }
      const data = res.ApiData as { item1?: Record<string, unknown>[] } | undefined;
      const eval0 = res.ApiData[0];
      if (!eval0) {
        openRemarksDialog("Evaluation Details", "No evaluation data available.");
        return;
      }
      const content = [
        `Academics Marks:        ${eval0.academicsMarks ?? "N/A"}`,
        `Communication Skills:   ${eval0.communicationSkillsMarks ?? "N/A"}`,
        `Attitude:               ${eval0.attitudeMarks ?? "N/A"}`,
        `Extra-Curricular:       ${eval0.extraCurricularMarks ?? "N/A"}`,
        `Knowledge:              ${eval0.knowledgeMarks ?? "N/A"}`,
        `Total Marks:            ${eval0.totalMarks ?? "N/A"}`,
        `Comments:               ${eval0.comments ?? "No comments"}`,
        `Remarks By:             ${eval0.remarksBy ?? "Unknown"}`,
      ].join("\n");
      openRemarksDialog("Evaluation Details", content);
    } finally {
      setActionLoading(false);
    }
  };

  // ── Accept / Reject ───────────────────────────────────────────────────────

  const openAcceptDialog = (row: Application) => {
    acceptAppRef.current = row;
    setAcceptOpen(true);
  };

  const openRejectDialog = (row: Application) => {
    rejectAppRef.current = row;
    setRejectReason("");
    setRejectOpen(true);
  };

  const submitApproveReject = async (action: "Accept" | "Disapprove", reason?: string) => {
    debugger;
    const row = action === "Accept" ? acceptAppRef.current : rejectAppRef.current;
    if (!row) return;
    
    setActionLoading(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      const res = await sendApproveRequest(row.registrationNo, action, reason);
      console.log(res)

      if (res.status === "error") { setActionError(res.message); return; }

      // API returns item1[0].msg = 'Approved' on accept-success, 'Disapproved' on reject-success
      const msg = (res.ApiData as { item1?: { msg?: string }[] } | undefined)?.item1?.[0]?.msg;

      if (msg === "Approved") {
        setActionSuccess("Application accepted successfully.");
        await loadData();
      } else if (msg === "Disapproved") {
        setActionSuccess("Application rejected successfully.");
        await loadData();
      } else {
        setActionError(`Failed to ${action === "Accept" ? "accept" : "reject"} the application. Please try again.`);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const confirmAccept = async () => { setAcceptOpen(false); await submitApproveReject("Accept"); };

  const confirmReject = async () => {
    if (!rejectReason.trim()) return;
    setRejectOpen(false);
    await submitApproveReject("Disapprove", rejectReason.trim());
  };

  // ── Forward ───────────────────────────────────────────────────────────────

  const openForwardDialog = (row: Application, fAction: "Hod" | "How" | "Faculty") => {
    forwardAppRef.current = row;
    setForwardAction(fAction);
    setForwardUid("");
    setForwardTitle(
      fAction === "Hod" ? "Forward to HOD — Enter HOD UID"
        : fAction === "How" ? "Forward to HoW — Enter HoW UID"
        : "Forward to Faculty — Enter Faculty UID",
    );
    setForwardOpen(true);
  };

  const submitForward = async () => {
    if (!forwardUid.trim() || !forwardAppRef.current) return;
    setActionLoading(true);
    setActionError(null);
    setActionSuccess(null);
    setForwardOpen(false);
    try {
      const res = await sendForwardRequest(forwardAppRef.current.registrationNo, forwardUid.trim(), forwardAction);

      if (res.status === "error") { setActionError(res.message); return; }

      // API returns item1[0].msg = 'Success' on forward success
      const msg = (res.ApiData as { item1?: { msg?: string }[] } | undefined)?.item1?.[0]?.msg;

      if (msg === "Success") {
        setActionSuccess("Application forwarded successfully.");
        await loadData();
      } else {
        setActionError("Forward action failed. Please try again.");
        await loadData(); // refresh state regardless
      }
    } finally {
      setActionLoading(false);
    }
  };

  // ── Evaluation ────────────────────────────────────────────────────────────

  const openEvalDialog = (row: Application, remarksBy: string) => {
    setSelectedRegNo(row.registrationNo);
    setSelectedAppId(row.applicationId);
    setEvalRemarksBy(remarksBy);
    setEvalForm(defaultEvalForm);
    setEvalSubmitted(false);
    setEvalOpen(true);
  };

  const isEvalFieldInvalid = (name: keyof EvalForm) => {
    const v = Number(evalForm[name]);
    return evalForm[name] === "" || isNaN(v) || v < 0 || v > 100;
  };

  const submitEvaluation = async () => {
    setEvalSubmitted(true);
    const numericFields: (keyof EvalForm)[] = [
      "AcademicsMarks", "CommunicationSkillsMarks", "AttitudeMarks", "ExtraCurricularMarks", "KnowledgeMarks",
    ];
    if (numericFields.some(isEvalFieldInvalid)) return;

    setActionLoading(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      const res = await studentEvaluationAddNew({
        registrationNo: selectedRegNo,
        academicsMarks: Number(evalForm.AcademicsMarks),
        communicationSkillsMarks: Number(evalForm.CommunicationSkillsMarks),
        attitudeMarks: Number(evalForm.AttitudeMarks),
        extraCurricularMarks: Number(evalForm.ExtraCurricularMarks),
        knowledgeMarks: Number(evalForm.KnowledgeMarks),
        comments: evalForm.Comments,
        remarksBy: evalRemarksBy,
      });

      if (res.status === "error") { setActionError(res.message); return; }

      // API returns item1[0].returnData > 0 on success, -1 if already submitted
      const returnData = (res.ApiData as { item1?: { returnData?: number | string }[] } | undefined)?.item1?.[0]?.returnData;

      if (Number(returnData) > 0) {
        setEvalOpen(false);
        setActionSuccess("Evaluation marks submitted successfully.");
      } else if (String(returnData) === "-1") {
        setEvalOpen(false);
        setActionSuccess("Evaluation marks already uploaded for this applicant.");
      } else {
        setActionError("Evaluation submission failed. Please try again.");
      }
    } finally {
      setActionLoading(false);
    }
  };

  // ── Counselling ───────────────────────────────────────────────────────────

  // Opens the edit/submit form (counsellingStatus === 'False')
  const openCounselDialog = (row: Application) => {
    setSelectedRegNo(row.registrationNo);
    setSelectedAppId(row.applicationId);
    setCounselComment("");
    setCounselSubmitted(false);
    setCounselOpen(true);
  };

  const submitCounselling = async () => {
    setCounselSubmitted(true);
    if (!counselComment.trim()) return;

    setActionLoading(true);
    setCounselOpen(false);
    setActionError(null);
    setActionSuccess(null);
    try {
      const res = await updateCounsellingRemarks(selectedRegNo, selectedAppId, counselComment);

      if (res.status === "error") { setActionError(res.message); return; }

      // API returns item1[0].returnId > 0 on success, -1 if already submitted
      const returnId = (res.ApiData as { item1?: { returnId?: number | string }[] } | undefined)?.item1?.[0]?.returnId;

      if (Number(returnId) > 0) {
        setActionSuccess("Counselling remarks updated successfully.");
        await loadData();
      } else if (String(returnId) === "-1") {
        setActionSuccess("Counselling remarks already uploaded.");
        await loadData();
      } else {
        setActionError("Failed to save counselling remarks. Please try again.");
      }
    } finally {
      setActionLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <Stack minHeight={400} alignItems="center" justifyContent="center" spacing={1}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">Loading dashboard...</Typography>
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

  return (
    <>
      {/* <Breadcrumb title="Semester Exchange Staff Dashboard" items={BCrumb} titleIcon="mdi:view-dashboard-outline" /> */}

      {/* Employee info header — mirrors Angular's 3-card row */}
      <Stack direction={{ xs: "column", md: "column" }} spacing={2} mb={3} mt={3}>
        {/* <Card variant="outlined" sx={{ flex: 1, p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="error" fontWeight={700}>Employee Name / UID:</Typography>
            <Typography variant="body2" fontWeight={700}>{employee?.employeeName} / {employee?.employeeCode}</Typography>
          </Stack>
        </Card> */}

        <Card variant="outlined" sx={{ flex: 1, p: 2 }}>
          <Stack alignItems="center" justifyContent="center" height="100%">
            <Typography variant="h2" color="error" fontWeight={800} textAlign="center">{pageTitle}</Typography>
          </Stack>
        </Card>

        {/* <Card variant="outlined" sx={{ flex: 1, p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="error" fontWeight={700}>Department:</Typography>
            <Typography variant="body2" fontWeight={700}>{employee?.departmentName}</Typography>
          </Stack>
        </Card> */}
      </Stack>

      <ChildCard>
        <Stack spacing={2}>
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="center" alignItems={{ md: "center" }} spacing={2}>
            <Box>
              <Typography variant="h3">Semester Exchange Applications</Typography>
           
            </Box>
        
            </Stack>
          
           
          <TextField
            size="small"
            label="Search by Registration No / Application Id / Phone"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ maxWidth: { md: 480 } }}
            fullWidth
          /> 
           
          {actionError && <Alert severity="error" onClose={() => setActionError(null)}>{actionError}</Alert>}
          {actionSuccess && <Alert severity="success" onClose={() => setActionSuccess(null)}>{actionSuccess}</Alert>}
          {actionLoading && (
            <Stack direction="row" spacing={1} alignItems="center">
              <CircularProgress size={16} />
              <Typography variant="body2" color="text.secondary">Processing...</Typography>
            </Stack>
          )}

          <Card variant="outlined" sx={{ borderRadius: 1 }}>
            {visibleApplications.length === 0 ? (
              <Stack minHeight={220} alignItems="center" justifyContent="center">
                <Typography variant="body2" color="text.secondary">No records found.</Typography>
              </Stack>
            ) : (
              <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      {["App Id", "Reg No", "Phone", "WhatsApp", "Parent Phone", "Counselling", "Status", "Actions"].map((col) => (
                        <TableCell key={col} sx={{ fontWeight: 700, whiteSpace: "nowrap", bgcolor: "#fff", color: "#343a40" }}>{col}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {visibleApplications.map((row) => (
                      <TableRow key={row.registrationNo} hover>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>{row.applicationId}</TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>{row.registrationNo}</TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>{row.phoneNumber}</TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>{row.whatsAppNo}</TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>{row.parentContact}</TableCell>
                        <TableCell><CounsellingBadge status={row.counsellingStatus} /></TableCell>
                        <TableCell><ApprovalBadge value={row.isApproved} /></TableCell>
                        <TableCell sx={{ minWidth: 460 }}>
                          <Stack direction="row" flexWrap="wrap" gap={0.5}>

                            {/* View Application — shown for ALL roles (mirrors Angular's first button) */}
                            <ActionBtn color="info" onClick={() => viewApplication(row)}>
                              View Application
                            </ActionBtn>

                            {/* ── HOD ── */}
                            {row.isHOD && (
                              <>
                                {/* {isPending(row.isApproved) && (
                                  <> */}
                                    <ActionBtn color="success" onClick={() => openAcceptDialog(row)}>Accept</ActionBtn>
                                    <ActionBtn color="error" onClick={() => openRejectDialog(row)}>Reject</ActionBtn>
                                  {/* </>
                                )} */}
                                <ActionBtn color="warning" onClick={() => openForwardDialog(row, "How")}>Forward to HOW</ActionBtn>
                                <ActionBtn color="primary" onClick={() =>
                                  row.counsellingStatus === "True" ? viewCounsellingRemarks(row) : openCounselDialog(row)
                                }>
                                  {row.counsellingStatus === "True" ? "View Counselling" : "Submit Counselling"}
                                </ActionBtn>
                                <ActionBtn color="primary" onClick={() => openEvalDialog(row, "HOD")}>Submit Evaluation</ActionBtn>
                                <ActionBtn color="secondary" onClick={() => viewEvaluationRemarks(row)}>Evaluation Remarks</ActionBtn>
                                <ActionBtn color="secondary" disabled={!hasFacultyRemarks(row)} onClick={() => viewFacultyRemarks(row)}>Faculty Remarks</ActionBtn>
                                <ActionBtn color="secondary" disabled={!hasAuthorityRemarks(row)} onClick={() => viewAuthorityRemarks(row)}>Authority Remarks</ActionBtn>
                                {/* "Own Remarks" for HOD = HoW remarks (mirrors Angular) */}
                                <ActionBtn color="secondary" disabled={!hasHOWRemarks(row)} onClick={() => viewHOWRemarks(row)}>Own Remarks</ActionBtn>
                              </>
                            )}

                            {/* ── HoW ── */}
                            {row.isHoW && (
                              <>
                                {/* {isPending(row.isApproved) && (
                                  <> */}
                                    <ActionBtn color="success" onClick={() => openAcceptDialog(row)}>Accept</ActionBtn>
                                    <ActionBtn color="error" onClick={() => openRejectDialog(row)}>Reject</ActionBtn>
                                  {/* </>
                                )} */}
                                <ActionBtn color="primary" onClick={() =>
                                  row.counsellingStatus === "True" ? viewCounsellingRemarks(row) : openCounselDialog(row)
                                }>
                                  {row.counsellingStatus === "True" ? "View Counselling" : "Submit Counselling"}
                                </ActionBtn>
                                <ActionBtn color="primary" onClick={() => openEvalDialog(row, "HOW")}>Submit Evaluation</ActionBtn>
                                <ActionBtn color="secondary" onClick={() => viewEvaluationRemarks(row)}>Evaluation Remarks</ActionBtn>
                                <ActionBtn color="secondary" disabled={!hasFacultyRemarks(row)} onClick={() => viewFacultyRemarks(row)}>Faculty Remarks</ActionBtn>
                                <ActionBtn color="secondary" disabled={!hasAuthorityRemarks(row)} onClick={() => viewAuthorityRemarks(row)}>Authority Remarks</ActionBtn>
                                <ActionBtn color="secondary" disabled={!hasHODRemarks(row)} onClick={() => viewHODRemarks(row)}>HOD Remarks</ActionBtn>
                                {/* Own Remarks for HoW always enabled */}
                                <ActionBtn color="secondary" onClick={() => viewHOWRemarks(row)}>Own Remarks</ActionBtn>
                              </>
                            )}

                            {/* ── Dealing Authority ── */}
                            {row.isDealingAuthority && (
                              <>
                                {/* {isPending(row.isApproved) && (
                                  <> */}
                                    <ActionBtn color="success" onClick={() => openAcceptDialog(row)}>Accept</ActionBtn>
                                    <ActionBtn color="error" onClick={() => openRejectDialog(row)}>Reject</ActionBtn>
                                  {/* </>
                                )} */}
                                <ActionBtn color="warning" onClick={() => openForwardDialog(row, "Faculty")}>Forward to Faculty</ActionBtn>
                                <ActionBtn color="warning" onClick={() => openForwardDialog(row, "Hod")}>Forward to HOD</ActionBtn>
                                <ActionBtn color="primary" onClick={() =>
                                  row.counsellingStatus === "True" ? viewCounsellingRemarks(row) : openCounselDialog(row)
                                }>
                                  {row.counsellingStatus === "True" ? "View Counselling" : "Submit Counselling"}
                                </ActionBtn>
                                <ActionBtn color="primary" onClick={() => openEvalDialog(row, "Authority")}>Submit Evaluation</ActionBtn>
                                <ActionBtn color="secondary" onClick={() => viewEvaluationRemarks(row)}>Evaluation Remarks</ActionBtn>
                                <ActionBtn color="secondary" disabled={!hasHODRemarks(row)} onClick={() => viewHODRemarks(row)}>HOD Remarks</ActionBtn>
                                <ActionBtn color="secondary" disabled={!hasHOWRemarks(row)} onClick={() => viewHOWRemarks(row)}>HOW Remarks</ActionBtn>
                                <ActionBtn color="secondary" disabled={!hasFacultyRemarks(row)} onClick={() => viewFacultyRemarks(row)}>Faculty Remarks</ActionBtn>
                              </>
                            )}

                            {/* ── Dealing Faculty ── */}
                            {row.isdealingFaculty && (
                              <>
                                <ActionBtn color="primary" onClick={() =>
                                  row.counsellingStatus === "True" ? viewCounsellingRemarks(row) : openCounselDialog(row)
                                }>
                                  {/* Angular uses "Counselling Remarks" label for dealing faculty when done */}
                                  {row.counsellingStatus === "True" ? "Counselling Remarks" : "Submit Counselling"}
                                </ActionBtn>
                                <ActionBtn color="secondary" onClick={() => viewFacultyRemarks(row)}>Own Remarks</ActionBtn>
                              </>
                            )}

                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Card>
        </Stack>
      </ChildCard>

      {/* ── Evaluation Dialog ── */}
      <Dialog open={evalOpen} onClose={() => setEvalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Evaluation Form
          <IconButton sx={{ position: "absolute", right: 8, top: 8 }} onClick={() => setEvalOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} mt={1}>
            <Stack direction="row" spacing={2}>
              <TextField size="small" label="Application ID" value={selectedAppId} disabled fullWidth />
              <TextField size="small" label="Registration No" value={selectedRegNo} disabled fullWidth />
            </Stack>
            {evalFields.map((field) => (
              <TextField
                key={field.name}
                size="small"
                label={`${field.label} (0–100)`}
                type="number"
                value={evalForm[field.name]}
                onChange={(e) => setEvalForm((prev) => ({ ...prev, [field.name]: e.target.value }))}
                error={evalSubmitted && isEvalFieldInvalid(field.name)}
                helperText={evalSubmitted && isEvalFieldInvalid(field.name) ? `Enter a valid ${field.label} (0–100)` : undefined}
                inputProps={{ min: 0, max: 100 }}
                fullWidth
              />
            ))}
            <TextField
              size="small"
              label="Comments"
              multiline
              rows={3}
              value={evalForm.Comments}
              onChange={(e) => setEvalForm((prev) => ({ ...prev, Comments: e.target.value }))}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEvalOpen(false)}>Cancel</Button>
          <Button variant="contained" color="success" onClick={submitEvaluation}>Submit Evaluation</Button>
        </DialogActions>
      </Dialog>

      {/* ── Counselling Submit Dialog ── */}
      <Dialog open={counselOpen} onClose={() => setCounselOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Counselling Remarks Form
          <IconButton sx={{ position: "absolute", right: 8, top: 8 }} onClick={() => setCounselOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            size="small"
            label="Your Remarks *"
            multiline
            rows={5}
            value={counselComment}
            onChange={(e) => setCounselComment(e.target.value)}
            error={counselSubmitted && !counselComment.trim()}
            helperText={counselSubmitted && !counselComment.trim() ? "Counselling remarks are required." : undefined}
            fullWidth
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCounselOpen(false)}>Cancel</Button>
          <Button variant="contained" color="success" onClick={submitCounselling}>Submit Remarks</Button>
        </DialogActions>
      </Dialog>

      {/* ── Forward Dialog ── */}
      <Dialog open={forwardOpen} onClose={() => setForwardOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>
          {forwardTitle}
          <IconButton sx={{ position: "absolute", right: 8, top: 8 }} onClick={() => setForwardOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            autoFocus
            size="small"
            label="Enter User ID"
            value={forwardUid}
            onChange={(e) => setForwardUid(e.target.value)}
            fullWidth
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setForwardOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={submitForward} disabled={!forwardUid.trim()}>Forward</Button>
        </DialogActions>
      </Dialog>

      {/* ── Accept Confirm Dialog ── */}
      <Dialog open={acceptOpen} onClose={() => setAcceptOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Accept</DialogTitle>
        <DialogContent dividers>
          <Typography>
            Are you sure you want to <strong>accept</strong> the application for{" "}
            <strong>{acceptAppRef.current?.registrationNo}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAcceptOpen(false)}>Cancel</Button>
          <Button variant="contained" color="success" onClick={confirmAccept}>Yes, Accept</Button>
        </DialogActions>
      </Dialog>

      {/* ── Reject Dialog ── */}
      <Dialog open={rejectOpen} onClose={() => setRejectOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>
          Reason for Disapproval
          <IconButton sx={{ position: "absolute", right: 8, top: 8 }} onClick={() => setRejectOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            autoFocus
            size="small"
            label="Enter reason *"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            fullWidth
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmReject} disabled={!rejectReason.trim()}>Submit</Button>
        </DialogActions>
      </Dialog>

      {/* ── View Remarks / Counselling View Dialog (read-only) ── */}
      <Dialog open={remarksOpen} onClose={() => setRemarksOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {remarksTitle}
          <IconButton sx={{ position: "absolute", right: 8, top: 8 }} onClick={() => setRemarksOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box component="pre" sx={{ fontFamily: "monospace", fontSize: 13, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {remarksContent}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemarksOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SemesterExchangeStaffDashboard;
