'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// MUI imports to match DrawingDataTable UI
import {
  Card,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  PictureAsPdf as PictureAsPdfIcon,
} from '@mui/icons-material';

// ── Server Actions ──────────────────────────────────────────────────────────
import { getEmployeeDetails } from '@/app/actions/StaffActions/SemesterExchange/getEmployeeDetails';
import { getAllApplications } from '@/app/actions/StaffActions/SemesterExchange/getAllApplications';
import { getAllAuthorityRemarks } from '@/app/actions/StaffActions/SemesterExchange/getAllAuthorityRemarks';
import { getEvaluationRemarks } from '@/app/actions/StaffActions/SemesterExchange/getEvaluationRemarks';
import { sendApproveRequest } from '@/app/actions/StaffActions/SemesterExchange/sendApproveRequest';
import { sendForwardRequest } from '@/app/actions/StaffActions/SemesterExchange/sendForwardRequest';
import { studentEvaluationAddNew } from '@/app/actions/StaffActions/SemesterExchange/studentEvaluationAddNew';
import { updateCounsellingRemarks } from '@/app/actions/StaffActions/SemesterExchange/updateCounsellingRemarks';

// ── Types ────────────────────────────────────────────────────────────────────

interface Application {
  applicationId: string;
  registrationNo: string;
  phoneNumber: string;
  whatsAppNo: string;
  parentContact: string;
  counsellingStatus: string;   // 'True' | 'False' | null
  isApproved: string;   // 'True' | 'False' | null
  dealingUId: string;
  dealingUserInterviewRemarks: string;
  dealingHODId: string;
  dealingHODRemarks: string;
  dealingHow: string;
  dealingFaculty: string;
  dealingAuthority: string;
  counsellingRemarks: string;
  // Per-row role flags added by enrichApplications()
  isdealingFaculty: boolean;
  isDealingAuthority: boolean;
  isHOD: boolean;
  isHoW: boolean;
}

interface AuthorityRemarks {
  applicationId: string;
  registrationNo: string;
  dealingUidRemarks: string;
  dealingHODRemarks: string;
  dealingHowRemarks: string;
  dealingHODInterviewRemarks: string;
  dealingUserInterviewRemarks: string;
  facultyRemarks: string;
  hodRemarks: string;
  howRemarks: string;
  ApprovalRemarks: string;
  counsellingRemarks: string;
  counsellingStatus: string;
}

interface EvalForm {
  academicsMarks: string;
  communicationSkillsMarks: string;
  attitudeMarks: string;
  extraCurricularMarks: string;
  knowledgeMarks: string;
  comments: string;
}

const EMPTY_EVAL: EvalForm = {
  academicsMarks: '', communicationSkillsMarks: '', attitudeMarks: '',
  extraCurricularMarks: '', knowledgeMarks: '', comments: '',
};

const PAGE_SIZE = 10;

// ── Tiny Toast helper ────────────────────────────────────────────────────────

type ToastType = 'success' | 'error' | 'info' | 'warning';
interface Toast { id: number; type: ToastType; title: string; text?: string }

// ── Component ────────────────────────────────────────────────────────────────

export default function DynamicDashboard() {
  // ── Bootstrap state ──
  const [loading, setLoading] = useState(true);
  const [isLoginFailed, setIsLoginFailed] = useState(false);

  // ── Employee info ──
  const [employeeName, setEmployeeName] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [pageTitle, setPageTitle] = useState('Dashboard');

  // ── Data ──
  const [allApplications, setAllApplications] = useState<Application[]>([]);
  const [visibleApplications, setVisibleApplications] = useState<Application[]>([]);
  const [authorityRemarks, setAuthorityRemarks] = useState<AuthorityRemarks[]>([]);

  // ── Role flags (global) ──
  const [isdealingFaculty, setIsdealingFaculty] = useState(false);
  const [isDealingAuthority, setIsDealingAuthority] = useState(false);
  const [isHOD, setIsHOD] = useState(false);
  const [isHoW, setIsHoW] = useState(false);

  // ── Pagination ──
  const [currentPage, setCurrentPage] = useState(1);

  // ── Evaluation modal ──
  const [showEvalModal, setShowEvalModal] = useState(false);
  const [evalForm, setEvalForm] = useState<EvalForm>(EMPTY_EVAL);
  const [evalSubmitted, setEvalSubmitted] = useState(false);
  const [evalLoading, setEvalLoading] = useState(false);
  const [activeApp, setActiveApp] = useState<Application | null>(null);
  const [remarksBy, setRemarksBy] = useState('');

  // ── Counselling modal ──
  const [showCounselModal, setShowCounselModal] = useState(false);
  const [counselRemarks, setCounselRemarks] = useState('');
  const [counselSubmitted, setCounselSubmitted] = useState(false);
  const [counselLoading, setCounselLoading] = useState(false);

  // ── Evaluation view modal ──
  const [showViewEvalModal, setShowViewEvalModal] = useState(false);
  const [viewEvalData, setViewEvalData] = useState<any>(null);
  const [viewEvalLoading, setViewEvalLoading] = useState(false);

  // ── Remarks view modal ──
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [remarksModalTitle, setRemarksModalTitle] = useState('');
  const [remarksModalText, setRemarksModalText] = useState('');

  // ── Toasts ──
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);

  // Global filter used by the header search input
  const [globalFilter, setGlobalFilter] = useState<string>();

  // ── Evaluation cache ──
  const evalCacheRef = useRef<Map<string, any>>(new Map());

  // ────────────────────────────────────────────────────────────────────────────
  // Helpers
  // ────────────────────────────────────────────────────────────────────────────

  const addToast = useCallback((type: ToastType, title: string, text?: string) => {
    const id = ++toastIdRef.current;
    setToasts(prev => [...prev, { id, type, title, text }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const showRemarks = useCallback((title: string, text: string) => {
    setRemarksModalTitle(title);
    setRemarksModalText(text || 'No remarks available.');
    setShowRemarksModal(true);
  }, []);

  // ────────────────────────────────────────────────────────────────────────────
  // Boot: load employee → applications → authority remarks
  // ────────────────────────────────────────────────────────────────────────────

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      // Employee - normalize result shape
      const empResult = await getEmployeeDetails();
      // console.log('[loadDashboard] getEmployeeDetails ->', empResult);

      let emp: any = null;
      if (Array.isArray(empResult)) {
        emp = empResult[0] ?? null;
      } else if (Array.isArray(empResult?.item1)) {
        emp = empResult.item1[0] ?? null;
      } else if (Array.isArray(empResult?.item1?.item1)) {
        emp = empResult.item1.item1[0] ?? null;
      } else {
        emp = empResult ?? null;
      }

      if (!emp) {
        setIsLoginFailed(true);
        return;
      }

      const code = String(emp.employeeCode ?? '').trim();
      setEmployeeName(emp.employeeName ?? '');
      setEmployeeCode(code);
      setDepartmentName(emp.departmentName ?? '');

      // Applications - normalize result shape
      const appResult = await getAllApplications();
      // console.log('[loadDashboard] getAllApplications ->', appResult);

      let appsArr: any[] = [];
      if (Array.isArray(appResult)) {
        appsArr = appResult;
      } else if (Array.isArray(appResult?.item1)) {
        appsArr = appResult.item1;
      } else if (Array.isArray(appResult?.ApiData?.item1)) {
        appsArr = appResult.ApiData.item1;
      } else if (Array.isArray(appResult?.ApiData)) {
        appsArr = appResult.ApiData;
      } else {
        appsArr = [];
      }

      // Ensure array
      appsArr = Array.isArray(appsArr) ? appsArr : [];

      // Enrich with role flags and set state
      const { enriched, visible, da, hod, how, fac } = enrichApplications(appsArr as Application[], code);
      setAllApplications(enriched);
      setVisibleApplications(visible);
      setIsdealingFaculty(fac);
      setIsDealingAuthority(da);
      setIsHOD(hod);
      setIsHoW(how);

      // Update page title based on role and reset pagination
      setPageTitle(buildPageTitle(da, hod, how, fac));
      setCurrentPage(1);

      // Load authority remarks (normalize)
      try {
        const ar = await getAllAuthorityRemarks();
        let remarksArr: any[] = [];
        if (Array.isArray(ar?.ApiData?.item1)) remarksArr = ar.ApiData.item1;
        else if (Array.isArray(ar?.item1)) remarksArr = ar.item1;
        else if (Array.isArray(ar)) remarksArr = ar;
        setAuthorityRemarks(remarksArr);
      } catch (innerErr) {
        console.warn('[loadDashboard] failed to load authority remarks', innerErr);
      }

    } catch (err) {
      console.error('[loadDashboard] error', err);
      setIsLoginFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadDashboard(); }, [loadDashboard]);

  // ────────────────────────────────────────────────────────────────────────────
  // Pure helpers (no state)
  // ────────────────────────────────────────────────────────────────────────────

  function enrichApplications(apps: Application[], empCode: string) {
    let da = false, hod = false, how = false, fac = false;

    const enriched = apps.map(app => {
      const authority = String(app.dealingAuthority ?? '').trim();
      const hodId = String(app.dealingHODId ?? '').trim();
      const howId = String(app.dealingHow ?? '').trim();
      const faculty = String(app.dealingFaculty ?? '').trim();

      // Reset row flags
      app.isDealingAuthority = false;
      app.isHOD = false;
      app.isHoW = false;
      app.isdealingFaculty = false;

      if (empCode) {
        if (authority === empCode) { app.isDealingAuthority = true; da = true; }
        else if (hodId === empCode) { app.isHOD = true; hod = true; }
        else if (howId === empCode) { app.isHoW = true; how = true; }
        else if (faculty === empCode) { app.isdealingFaculty = true; fac = true; }
      }
      return app;
    });

    const anyRole = da || hod || how || fac;
    const visible = anyRole
      ? enriched.filter(a => a.isDealingAuthority || a.isHOD || a.isHoW || a.isdealingFaculty)
      : [...enriched];

    return { enriched, visible, da, hod, how, fac };
  }

  function buildPageTitle(da: boolean, hod: boolean, how: boolean, fac: boolean): string {
    if (da) return '** Dealing Authority Dashboard **';
    if (hod) return '** Head of Department Dashboard **';
    if (how) return '** Head of Wing Dashboard **';
    if (fac) return '** Dealing Faculty Dashboard **';
    return 'Dashboard';
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Pagination
  // ────────────────────────────────────────────────────────────────────────────

  const totalPages = Math.max(1, Math.ceil(visibleApplications.length / PAGE_SIZE));
  const pagedRows = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return visibleApplications.slice(start, start + PAGE_SIZE);
  }, [visibleApplications, currentPage]);

  // ────────────────────────────────────────────────────────────────────────────
  // Actions
  // ────────────────────────────────────────────────────────────────────────────

  // Accept application
  const handleAccept = useCallback(async (app: Application) => {
    if (!confirm('Accept this application?')) return;
    setLoading(true);
    const res = await sendApproveRequest(app.registrationNo, 'Accept');
    setLoading(false);
    if (res.status === 'success' && res.ApiData?.item1?.[0]?.msg === 'Approved') {
      addToast('success', 'Application accepted successfully!');
      void loadDashboard();
    } else {
      addToast('error', 'Failed to accept application.', res.message);
    }
  }, [addToast, loadDashboard]);

  // Disapprove application
  const handleDisapprove = useCallback(async (app: Application) => {
    const reason = prompt('Reason for Disapproval (required):');
    if (!reason?.trim()) return;
    setLoading(true);
    const res = await sendApproveRequest(app.registrationNo, 'Disapprove', reason);
    setLoading(false);
    if (res.status === 'success') {
      addToast('success', 'Application disapproved.');
      void loadDashboard();
    } else {
      addToast('error', 'Failed to disapprove.', res.message);
    }
  }, [addToast, loadDashboard]);

  // Forward to HOD / HoW / Faculty
  const handleForward = useCallback(async (app: Application, target: 'Hod' | 'How' | 'Faculty') => {
    const label = target === 'Hod' ? 'HOD UID' : target === 'How' ? 'HoW UID' : 'Faculty UID';
    const uid = prompt(`Enter ${label}:`);
    if (!uid?.trim()) return;
    setLoading(true);
    const res = await sendForwardRequest(app.registrationNo, uid.trim(), target);
    setLoading(false);
    if (res.status === 'success' && res.ApiData?.item1?.[0]?.msg === 'Success') {
      addToast('success', 'Forwarded successfully!');
      void loadDashboard();
    } else {
      addToast('error', 'Forward action failed.', res.message);
    }
  }, [addToast, loadDashboard]);

  // Open evaluation modal
  const handleOpenEval = useCallback((app: Application, by: string) => {
    setActiveApp(app);
    setRemarksBy(by);
    setEvalForm(EMPTY_EVAL);
    setEvalSubmitted(false);
    setShowEvalModal(true);
  }, []);

  // Submit evaluation form
  const handleEvalSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setEvalSubmitted(true);
    if (!activeApp) return;

    const fields = ['academicsMarks', 'communicationSkillsMarks', 'attitudeMarks', 'extraCurricularMarks', 'knowledgeMarks'] as const;
    const invalid = fields.some(f => {
      const v = Number(evalForm[f]);
      return evalForm[f] === '' || isNaN(v) || v < 0 || v > 100;
    });
    if (invalid) return;

    setEvalLoading(true);
    const res = await studentEvaluationAddNew({
      registrationNo: activeApp.registrationNo,
      academicsMarks: Number(evalForm.academicsMarks),
      communicationSkillsMarks: Number(evalForm.communicationSkillsMarks),
      attitudeMarks: Number(evalForm.attitudeMarks),
      extraCurricularMarks: Number(evalForm.extraCurricularMarks),
      knowledgeMarks: Number(evalForm.knowledgeMarks),
      comments: evalForm.comments,
      remarksBy,
    });
    setEvalLoading(false);
    setShowEvalModal(false);

    const code = res.ApiData?.item1?.[0]?.returnData;
    if (res.status === 'success' && Number(code) > 0) {
      addToast('success', 'Evaluation marks submitted successfully!');
      void loadDashboard();
    } else if (String(code) === '-1') {
      addToast('info', 'Evaluation marks already uploaded.');
    } else {
      addToast('error', 'Failed to submit evaluation.', res.message);
    }
  }, [activeApp, evalForm, remarksBy, addToast, loadDashboard]);

  // Open counselling modal
  const handleOpenCounselling = useCallback((app: Application) => {
    setActiveApp(app);
    setCounselRemarks(app.counsellingStatus === 'True' ? (app.counsellingRemarks ?? '') : '');
    setCounselSubmitted(false);
    setShowCounselModal(true);
  }, []);

  // Submit counselling remarks
  const handleCounselSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setCounselSubmitted(true);
    if (!counselRemarks.trim() || !activeApp) return;

    setCounselLoading(true);
    const res = await updateCounsellingRemarks(
      activeApp.registrationNo,
      activeApp.applicationId,
      counselRemarks,
    );
    setCounselLoading(false);
    setShowCounselModal(false);

    const returnId = res.ApiData?.item1?.[0]?.returnId;
    if (res.status === 'success' && Number(returnId) > 0) {
      addToast('success', 'Counselling remarks saved successfully!');
      void loadDashboard();
    } else if (Number(returnId) === -1) {
      addToast('info', 'Counselling remarks already uploaded.');
    } else {
      addToast('error', 'Failed to save counselling remarks.', res.message);
    }
  }, [counselRemarks, activeApp, addToast, loadDashboard]);

  // View counselling remarks (read-only open)
  const handleViewCounselling = useCallback((app: Application) => {
    console.log(app);
    showRemarks('Counselling Remarks', app.counsellingRemarks);
  }, [showRemarks]);

  // View evaluation remarks (fetch + show)
  const handleViewEvaluation = useCallback(async (app: Application) => {
    const cached = evalCacheRef.current.get(app.registrationNo);
    if (cached) { setViewEvalData(cached); setShowViewEvalModal(true); return; }

    setViewEvalLoading(true);
    setShowViewEvalModal(true);
    const res = await getEvaluationRemarks(app.registrationNo);
    setViewEvalLoading(false);

    if (res.status === 'success' && res.ApiData?.item1?.length > 0) {
      const d = res.ApiData.item1[0];
      evalCacheRef.current.set(app.registrationNo, d);
      setViewEvalData(d);
    } else {
      setViewEvalData(null);
    }
  }, []);

  // View remarks helpers
  const getRemarksFor = (regNo: string) =>
    authorityRemarks.find(r => r.registrationNo === regNo);

  const handleViewFaculty = (app: Application) => {
    const r = getRemarksFor(app.registrationNo);
    showRemarks('Faculty Remarks', r?.dealingUserInterviewRemarks || r?.facultyRemarks || app.dealingUserInterviewRemarks);
  };
  const handleViewHOD = (app: Application) => {
    const r = getRemarksFor(app.registrationNo);
    showRemarks('HOD Remarks', r?.hodRemarks || r?.dealingHODRemarks || app.dealingHODRemarks);
  };
  const handleViewHoW = (app: Application) => {
    const r = getRemarksFor(app.registrationNo);
    showRemarks('Head of Wing Remarks', r?.howRemarks || r?.dealingHowRemarks || '');
  };
  const handleViewAuthority = (app: Application) => {
    const r = getRemarksFor(app.registrationNo);
    showRemarks('Authority Remarks', r?.ApprovalRemarks || r?.dealingUidRemarks || '');
  };

  // Has-data guards
  const hasFacultyRemarks = (app: Application) => {
    const r = getRemarksFor(app.registrationNo);
    return !!(r?.facultyRemarks || r?.dealingUserInterviewRemarks || app.dealingUserInterviewRemarks);
  };
  const hasHODRemarks = (app: Application) => {
    const r = getRemarksFor(app.registrationNo);
    return !!(r?.hodRemarks || r?.dealingHODRemarks || app.dealingHODRemarks);
  };
  const hasHoWRemarks = (app: Application) => {
    const r = getRemarksFor(app.registrationNo);
    return !!(r?.howRemarks || r?.dealingHowRemarks);
  };
  const hasAuthorityRemarks = (app: Application) => {
    const r = getRemarksFor(app.registrationNo);
    return !!(r?.ApprovalRemarks || r?.dealingUidRemarks);
  };
  const hasEvalRemarks = (app: Application) => {
    // Enable the "View Evaluation" button for all rows.
    // Actual data is fetched on click by handleViewEvaluation().
    return true;
  };

  // Export visibleApplications to CSV (Excel-friendly)
  const exportVisibleToCsv = useCallback(() => {
    if (!visibleApplications || visibleApplications.length === 0) {
      addToast('info', 'No records to export');
      return;
    }
    const headers = ['Application ID','Registration No','Phone','WhatsApp','Parent','Counselling Status','Approval Status'];
    const rows = visibleApplications.map(r => ([
      r.applicationId ?? '',
      r.registrationNo ?? '',
      r.phoneNumber ?? '',
      r.whatsAppNo ?? '',
      r.parentContact ?? '',
      r.counsellingStatus ?? '',
      r.isApproved ?? '',
    ]));

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\r\n');

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }); // BOM helps Excel detect UTF-8
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `applications_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    addToast('success', 'Export started');
  }, [visibleApplications, addToast]);

  // ────────────────────────────────────────────────────────────────────────────
  // Form validation helper
  // ────────────────────────────────────────────────────────────────────────────

  const marksError = (field: keyof EvalForm): boolean => {
    if (!evalSubmitted) return false;
    const v = Number(evalForm[field]);
    return evalForm[field] === '' || isNaN(v) || v < 0 || v > 100;
  };

  // ────────────────────────────────────────────────────────────────────────────
  // Badge helpers
  // ────────────────────────────────────────────────────────────────────────────

  const counselBadge = (status: string) => {
    if (status === 'True') return { cls: 'badge-success', label: 'Done' };
    if (status === 'False') return { cls: 'badge-warning', label: 'Pending' };
    return { cls: 'badge-warning', label: 'Pending' };
  };
  const approvalBadge = (val: string) => {
    if (val === 'True') return { cls: 'badge-success', label: 'Approved' };
    if (val === 'False') return { cls: 'badge-danger', label: 'Rejected' };
    return { cls: 'badge-warning', label: 'Pending' };
  };

  // ────────────────────────────────────────────────────────────────────────────
  // Error state
  // ────────────────────────────────────────────────────────────────────────────

  if (isLoginFailed) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 24px' }}>
        <h3 style={{ color: '#c62828', fontSize: '1.6rem' }}>Error in User Login</h3>
        <p style={{ color: '#b71c1c', fontSize: '1.1rem' }}>Unauthorized Access.</p>
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Render
  // ────────────────────────────────────────────────────────────────────────────

  const theme = useTheme();

  // Return bg color and text color for a toast type (matches original mapping)
  function toastBg(type: ToastType) {
    switch (type) {
      case 'success':
        return { background: theme.palette.success?.main ?? '#059669', color: '#fff' };
      case 'error':
        return { background: theme.palette.error?.main ?? '#dc2626', color: '#fff' };
      case 'warning':
        return { background: theme.palette.warning?.main ?? '#f59e0b', color: '#000' };
      default:
        return { background: theme.palette.info?.main ?? '#0ea5e9', color: '#fff' };
    }
  }

  return (
    <>
      {/* Toasts (kept simple) */}
      <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 1200 }}>
        {toasts.map(t => {
          const s = toastBg(t.type);
          return (
            <div key={t.id} style={{ marginBottom: 8 }}>
              <Paper elevation={3} style={{ padding: '8px 12px', background: s.background, color: s.color }}>
                <strong>{t.title}</strong>
                {t.text && <div style={{ fontSize: 12 }}>{t.text}</div>}
              </Paper>
            </div>
          );
        })}
      </div>

      {/* Loading overlay */}
      {loading && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Paper style={{ padding: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
            <div className="animate-spin" style={{ width: 32, height: 32, border: '4px solid #e5e7eb', borderTopColor: theme.palette.primary.main, borderRadius: '50%' }} />
            <Typography variant="body2">Loading…</Typography>
          </Paper>
        </div>
      )}



      {/* <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}> */}
      {/* <Card sx={{ borderRadius: 2, overflow: 'hidden' }}> */}
      {/* <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)` }}> */}
      <Box
        sx={{
          maxWidth: "Auto",
          mx: "auto",
          p: { xs: 1, sm: 2 },
          width: "100%"
        }}
      >
        <Card
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            width: "100%"
          }}
        >
          <Box
            sx={{
              p: 2,
              display: "flex",
              flexDirection: {
                xs: "column",
                md: "row"
              },
              justifyContent: "space-between",
              alignItems: {
                xs: "stretch",
                md: "center"
              },
              gap: 2,
              background: `linear-gradient(
      135deg,
      ${theme.palette.primary.main} 0%,
      ${theme.palette.primary.dark} 100%
    )`
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {/* <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)' }}>{employeeName} — {departmentName}</Typography> */}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 700 }}>{pageTitle}</Typography>
              {/* <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)' }}>{employeeName} — {departmentName}</Typography> */}
            </Box>

            {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}> */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                width: {
                  xs: "100%",
                  md: "auto"
                }
              }}
            >
              <TextField
                size="small"
                placeholder="Search..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                sx={{
                  width: {
                    xs: "100%",
                    sm: 250
                  },
                  minWidth: 0,

                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(255,255,255,0.08)",
                    color: "white",

                    "& fieldset": {
                      borderColor: "rgba(255,255,255,0.2)"
                    }
                  }
                }}
                // sx={{
                //   width: 240,
                //   '& .MuiOutlinedInput-root': {
                //     backgroundColor: 'rgba(255,255,255,0.08)',
                //     color: 'white',
                //     '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                //   },
                // }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'white', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />

              {/* <FormControl size="small" sx={{ minWidth: 140 }}> */}
              <FormControl
                size="small"
                sx={{
                  minWidth: {
                    xs: "100%",
                    sm: 140
                  }
                }}
              >
                <Select
                  value={''}
                  onChange={() => { }}
                  displayEmpty
                  sx={{
                    color: 'white',
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    '.MuiSelect-icon': { color: 'white' },
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                sx={{
                  width: {
                    xs: "100%",
                    sm: "auto"
                  },
                  background: "rgba(255,255,255,0.12)",
                  color: "#fff"
                }}
                onClick={exportVisibleToCsv}
              >
                Export
              </Button>
              {/* <Button variant="contained" onClick={() => addToast('info', 'Export requested')} sx={{ background: 'rgba(255,255,255,0.12)', color: '#fff' }}>
                Export
              </Button> */}
            </Box>
          </Box>


          <TableContainer component={Paper} sx={{
            maxHeight: 560,
            overflowX: "auto",
            width: "100%"
          }}>
            <Table
              stickyHeader
              sx={{
                minWidth: 1200
              }}
            >
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                  <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: 12 }}>App. ID</TableCell>
                  <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: 12 }}>Reg. No.</TableCell>
                  <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: 12 }}>Contact</TableCell>
                  <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: 12 }}>WhatsApp</TableCell>
                  <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: 12 }}>Parent</TableCell>
                  <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: 12 }}>Counselling</TableCell>
                  <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: 12 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: 12 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pagedRows.length > 0 ? pagedRows.map((app, idx) => {
                  const counsel = counselBadge(app.counsellingStatus);
                  const approval = approvalBadge(app.isApproved);
                  const isPending = app.isApproved === 'null';
                  return (
                    <TableRow key={app.applicationId} hover>
                      <TableCell>{app.applicationId}</TableCell>
                      <TableCell>{app.registrationNo}</TableCell>
                      <TableCell>{app.phoneNumber}</TableCell>
                      <TableCell>{app.whatsAppNo}</TableCell>
                      <TableCell>{app.parentContact}</TableCell>
                      <TableCell><Chip label={counsel.label} sx={{ bgcolor: counsel.cls ? undefined : undefined, px: 1 }} /></TableCell>
                      <TableCell><Chip label={approval.label} color={approval.label === 'Approved' ? 'success' : approval.label === 'Rejected' ? 'error' : 'warning'} size="small" /></TableCell>
                      <TableCell>
                        {/* <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}> */}
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                            minWidth: 400
                          }}
                        >

                          {app.isHOD && (
                            <>
                              {isPending && (
                                <>
                                  <Button size="small" variant="contained" color="success" onClick={() => handleAccept(app)}>Accept</Button> 
                                  <Button size="small" variant="contained" color="error" onClick={() => handleDisapprove(app)}>Reject</Button>
                                 
                                </>
                              )}
                              <Button size="small" variant="contained" color="warning" onClick={() => handleForward(app, 'How')}>Forward to HoW</Button>
                              <Button size="small" variant="outlined" onClick={() => app.counsellingStatus === 'True' ? handleViewCounselling(app) : handleOpenCounselling(app)}>
                                {app.counsellingStatus === 'True' ? 'View Counselling' : 'Submit Counselling'}
                              </Button>
                              <Button size="small" variant="contained" color="primary" onClick={() => handleOpenEval(app, 'HOD')}>Submit Evaluation</Button>
                              <Button size="small" variant="outlined" onClick={() => handleViewEvaluation(app)} disabled={!hasEvalRemarks(app)}>Evaluation Remarks</Button>
                              <Button size="small" variant="outlined" onClick={() => handleViewFaculty(app)} disabled={!hasFacultyRemarks(app)}>Faculty Remarks</Button>
                              <Button size="small" variant="outlined" onClick={() => handleViewAuthority(app)} disabled={!hasAuthorityRemarks(app)}>Authority Remarks</Button>
                              <Button size="small" variant="outlined" onClick={() => handleViewHoW(app)} disabled={!hasHoWRemarks(app)}>Own Remarks</Button>
                            </>
                          )}


                          {app.isHoW && (
                            <>
                              {isPending && (
                                <>
                                  <Button size="small" variant="contained" color="success" onClick={() => handleAccept(app)}>Accept</Button>
                                  <Button size="small" variant="contained" color="error" onClick={() => handleDisapprove(app)}>Reject</Button>
                                </>
                              )}
                              <Button size="small" variant="outlined" onClick={() => app.counsellingStatus === 'True' ? handleViewCounselling(app) : handleOpenCounselling(app)}>
                                {app.counsellingStatus === 'True' ? 'View Counselling' : 'Submit Counselling'}
                              </Button>
                              <Button size="small" variant="contained" color="primary" onClick={() => handleOpenEval(app, 'HOW')}>Submit Evaluation</Button>
                              <Button size="small" variant="outlined" onClick={() => handleViewEvaluation(app)} disabled={!hasEvalRemarks(app)}>Evaluation Remarks</Button>
                              <Button size="small" variant="outlined" onClick={() => handleViewFaculty(app)} disabled={!hasFacultyRemarks(app)}>Faculty Remarks</Button>
                              <Button size="small" variant="outlined" onClick={() => handleViewAuthority(app)} disabled={!hasAuthorityRemarks(app)}>Authority Remarks</Button>
                              <Button size="small" variant="outlined" onClick={() => handleViewHOD(app)} disabled={!hasHODRemarks(app)}>HOD Remarks</Button>
                              <Button size="small" variant="outlined" onClick={() => handleViewHoW(app)}>Own Remarks</Button>
                            </>
                          )}


                          {app.isDealingAuthority && (
                            <>
                              <Button size="small" variant="contained" color="warning" onClick={() => handleForward(app, 'Hod')}>Forward to HoD</Button>
                              <Button size="small" variant="contained" color="primary" onClick={() => handleOpenEval(app, 'HOD')}>Submit Evaluation</Button>
                              <Button size="small" variant="outlined" color="info" onClick={() => handleViewEvaluation(app)}>View Evaluation</Button>
                               {isPending && (
                                <>
                              <Button size="small" variant="contained" color="success" onClick={() => handleAccept(app)} >Accept</Button>
                              <Button size="small" variant="contained" color="error" onClick={() => handleDisapprove(app)}>Reject</Button> 
                             </>
                               )}
                              <Button size="small" variant="outlined" color="info" onClick={() => handleViewFaculty(app)} disabled={!hasFacultyRemarks(app)}>View Faculty Remarks</Button>
                              <Button size="small" variant="outlined" color="info" onClick={() => handleViewHOD(app)} disabled={!hasHODRemarks(app)}>View HOD Remarks</Button>
                              <Button size="small" variant="outlined" color="info" onClick={() => handleViewHoW(app)} disabled={!hasHoWRemarks(app)}>View HoW Remarks</Button>
                              <Button size="small" variant="outlined" color="info" onClick={() => handleViewAuthority(app)} disabled={!hasAuthorityRemarks(app)}>View Authority Remarks</Button>
                            </>
                          )}


                          {app.isdealingFaculty && (
                            <>
                              <Button size="small" variant="contained" color="warning" onClick={() => handleForward(app, 'Hod')}>Forward to HoD</Button>
                              <Button size="small" variant="outlined" onClick={() => app.counsellingStatus === 'True' ? handleViewCounselling(app) : handleOpenCounselling(app)}>
                                {app.counsellingStatus === 'True' ? 'View Counselling' : 'Submit Counselling'}
                              </Button>
                              <Button size="small" variant="contained" color="primary" onClick={() => handleOpenEval(app, 'Faculty')}>Submit Evaluation</Button>
                            </>
                          )}

                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                }) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-3xl">📋</div>
                        <Typography>No applications found</Typography>
                        <Typography variant="caption" color="text.secondary">Adjust filters or refresh to load records.</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Submit Evaluation Dialog */}
          <Dialog
            open={showEvalModal}
            onClose={() => setShowEvalModal(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              Submit Evaluation{activeApp ? ` — ${activeApp.registrationNo}` : ''}
            </DialogTitle>
            <form onSubmit={handleEvalSubmit}>
              <DialogContent dividers>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <TextField
                    label="Academics (0-100)"
                    type="number"
                    inputProps={{ min: 0, max: 100 }}
                    value={evalForm.academicsMarks}
                    onChange={(e) => setEvalForm(f => ({ ...f, academicsMarks: e.target.value }))}
                    error={marksError('academicsMarks')}
                    helperText={marksError('academicsMarks') ? 'Enter 0-100' : ''}
                    size="small"
                    fullWidth
                  />
                  <TextField
                    label="Communication (0-100)"
                    type="number"
                    inputProps={{ min: 0, max: 100 }}
                    value={evalForm.communicationSkillsMarks}
                    onChange={(e) => setEvalForm(f => ({ ...f, communicationSkillsMarks: e.target.value }))}
                    error={marksError('communicationSkillsMarks')}
                    helperText={marksError('communicationSkillsMarks') ? 'Enter 0-100' : ''}
                    size="small"
                    fullWidth
                  />
                  <TextField
                    label="Attitude (0-100)"
                    type="number"
                    inputProps={{ min: 0, max: 100 }}
                    value={evalForm.attitudeMarks}
                    onChange={(e) => setEvalForm(f => ({ ...f, attitudeMarks: e.target.value }))}
                    error={marksError('attitudeMarks')}
                    helperText={marksError('attitudeMarks') ? 'Enter 0-100' : ''}
                    size="small"
                    fullWidth
                  />
                  <TextField
                    label="Extra Curricular (0-100)"
                    type="number"
                    inputProps={{ min: 0, max: 100 }}
                    value={evalForm.extraCurricularMarks}
                    onChange={(e) => setEvalForm(f => ({ ...f, extraCurricularMarks: e.target.value }))}
                    error={marksError('extraCurricularMarks')}
                    helperText={marksError('extraCurricularMarks') ? 'Enter 0-100' : ''}
                    size="small"
                    fullWidth
                  />
                  <TextField
                    label="Knowledge (0-100)"
                    type="number"
                    inputProps={{ min: 0, max: 100 }}
                    value={evalForm.knowledgeMarks}
                    onChange={(e) => setEvalForm(f => ({ ...f, knowledgeMarks: e.target.value }))}
                    error={marksError('knowledgeMarks')}
                    helperText={marksError('knowledgeMarks') ? 'Enter 0-100' : ''}
                    size="small"
                    fullWidth
                  />
                  <TextField
                    label="Comments"
                    value={evalForm.comments}
                    onChange={(e) => setEvalForm(f => ({ ...f, comments: e.target.value }))}
                    multiline
                    rows={3}
                    size="small"
                    fullWidth
                    sx={{ gridColumn: '1 / -1' }}
                  />
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setShowEvalModal(false)} size="small" disabled={evalLoading}>Cancel</Button>
                <Button type="submit" variant="contained" size="small" disabled={evalLoading}>
                  {evalLoading ? 'Submitting…' : 'Submit Evaluation'}
                </Button>
              </DialogActions>
            </form>
          </Dialog>


          {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderTop: '1px solid #e0e0e0' }}> */}
          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                md: "row"
              },
              gap: 2,
              justifyContent: "space-between",
              alignItems: {
                xs: "stretch",
                md: "center"
              },
              p: 2,
              borderTop: "1px solid #e0e0e0"
            }}
          >
            <Typography variant="body2" color="text.secondary">Showing {Math.min(pagedRows.length, PAGE_SIZE)} of {visibleApplications.length} records</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button size="small" variant="outlined" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>First</Button>
              <Button size="small" variant="outlined" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Prev</Button>
              <Typography sx={{ display: 'flex', alignItems: 'center', px: 1 }}>Page {currentPage} of {totalPages}</Typography>
              <Button size="small" variant="outlined" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</Button>
              <Button size="small" variant="outlined" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>Last</Button>
            </Box>
          </Box>
        </Card>
      </Box>

      {/* View Evaluation Dialog */}
      <Dialog
        open={showViewEvalModal}
        onClose={() => setShowViewEvalModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Evaluation Remarks{viewEvalData?.registrationNo ? ` — ${viewEvalData.registrationNo}` : ''}
        </DialogTitle>
        <DialogContent dividers>
          {viewEvalLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress />
            </Box>
          ) : viewEvalData ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography><strong>Academics:</strong> {viewEvalData.academicsMarks ?? viewEvalData.AcademicsMarks ?? 'N/A'}</Typography>
              <Typography><strong>Communication Skills:</strong> {viewEvalData.communicationSkillsMarks ?? viewEvalData.CommunicationSkillsMarks ?? 'N/A'}</Typography>
              <Typography><strong>Attitude:</strong> {viewEvalData.attitudeMarks ?? viewEvalData.AttitudeMarks ?? 'N/A'}</Typography>
              <Typography><strong>Extra Curricular:</strong> {viewEvalData.extraCurricularMarks ?? viewEvalData.ExtraCurricularMarks ?? 'N/A'}</Typography>
              <Typography><strong>Knowledge:</strong> {viewEvalData.knowledgeMarks ?? viewEvalData.KnowledgeMarks ?? 'N/A'}</Typography>
              <Typography sx={{ whiteSpace: 'pre-wrap' }}><strong>Comments:</strong> {viewEvalData.comments ?? viewEvalData.Comments ?? 'No comments'}</Typography>
              {viewEvalData.remarksBy && <Typography><strong>Remarks By:</strong> {viewEvalData.remarksBy}</Typography>}
            </Box>
          ) : (
            <Typography>No evaluation remarks available.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowViewEvalModal(false)} size="small">Close</Button>
        </DialogActions>
      </Dialog>

      {/* Remarks Dialog */}
      <Dialog
        open={showRemarksModal}
        onClose={() => setShowRemarksModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{remarksModalTitle}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
            {remarksModalText}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRemarksModal(false)} size="small">Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
