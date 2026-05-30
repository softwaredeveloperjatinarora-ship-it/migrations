'use client';

 

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// ── Server Actions ──────────────────────────────────────────────────────────
import { getEmployeeDetails }       from '@/app/actions/StaffActions/SemesterExchange/getEmployeeDetails';
import { getAllApplications }        from '@/app/actions/StaffActions/SemesterExchange/getAllApplications';
import { getAllAuthorityRemarks }    from '@/app/actions/StaffActions/SemesterExchange/getAllAuthorityRemarks';
import { getEvaluationRemarks }     from '@/app/actions/StaffActions/SemesterExchange/getEvaluationRemarks';
import { sendApproveRequest }       from '@/app/actions/StaffActions/SemesterExchange/sendApproveRequest';
import { sendForwardRequest }       from '@/app/actions/StaffActions/SemesterExchange/sendForwardRequest';
import { studentEvaluationAddNew }  from '@/app/actions/StaffActions/SemesterExchange/studentEvaluationAddNew';
import { updateCounsellingRemarks } from '@/app/actions/StaffActions/SemesterExchange/updateCounsellingRemarks';

// ── Types ────────────────────────────────────────────────────────────────────

interface Application {
  applicationId:              string;
  registrationNo:             string;
  phoneNumber:                string;
  whatsAppNo:                 string;
  parentContact:              string;
  counsellingStatus:          string;   // 'True' | 'False' | null
  isApproved:                 string;   // 'True' | 'False' | null
  dealingUId:                 string;
  dealingUserInterviewRemarks:string;
  dealingHODId:               string;
  dealingHODRemarks:          string;
  dealingHow:                 string;
  dealingFaculty:             string;
  dealingAuthority:           string;
  counsellingRemarks:         string;
  // Per-row role flags added by enrichApplications()
  isdealingFaculty:           boolean;
  isDealingAuthority:         boolean;
  isHOD:                      boolean;
  isHoW:                      boolean;
}

interface AuthorityRemarks {
  applicationId:               string;
  registrationNo:              string;
  dealingUidRemarks:           string;
  dealingHODRemarks:           string;
  dealingHowRemarks:           string;
  dealingHODInterviewRemarks:  string;
  dealingUserInterviewRemarks: string;
  facultyRemarks:              string;
  hodRemarks:                  string;
  howRemarks:                  string;
  ApprovalRemarks:             string;
  counsellingRemarks:          string;
  counsellingStatus:           string;
}

interface EvalForm {
  academicsMarks:           string;
  communicationSkillsMarks: string;
  attitudeMarks:            string;
  extraCurricularMarks:     string;
  knowledgeMarks:           string;
  comments:                 string;
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
  const [loading,       setLoading]       = useState(true);
  const [isLoginFailed, setIsLoginFailed] = useState(false);

  // ── Employee info ──
  const [employeeName,   setEmployeeName]   = useState('');
  const [employeeCode,   setEmployeeCode]   = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [pageTitle,      setPageTitle]      = useState('Dashboard');

  // ── Data ──
  const [allApplications,     setAllApplications]     = useState<Application[]>([]);
  const [visibleApplications, setVisibleApplications] = useState<Application[]>([]);
  const [authorityRemarks,    setAuthorityRemarks]    = useState<AuthorityRemarks[]>([]);

  // ── Role flags (global) ──
  const [isdealingFaculty,    setIsdealingFaculty]    = useState(false);
  const [isDealingAuthority,  setIsDealingAuthority]  = useState(false);
  const [isHOD,               setIsHOD]               = useState(false);
  const [isHoW,               setIsHoW]               = useState(false);

  // ── Pagination ──
  const [currentPage, setCurrentPage] = useState(1);

  // ── Evaluation modal ──
  const [showEvalModal,      setShowEvalModal]      = useState(false);
  const [evalForm,           setEvalForm]           = useState<EvalForm>(EMPTY_EVAL);
  const [evalSubmitted,      setEvalSubmitted]      = useState(false);
  const [evalLoading,        setEvalLoading]        = useState(false);
  const [activeApp,          setActiveApp]          = useState<Application | null>(null);
  const [remarksBy,          setRemarksBy]          = useState('');

  // ── Counselling modal ──
  const [showCounselModal,   setShowCounselModal]   = useState(false);
  const [counselRemarks,     setCounselRemarks]     = useState('');
  const [counselSubmitted,   setCounselSubmitted]   = useState(false);
  const [counselLoading,     setCounselLoading]     = useState(false);

  // ── Evaluation view modal ──
  const [showViewEvalModal,  setShowViewEvalModal]  = useState(false);
  const [viewEvalData,       setViewEvalData]       = useState<any>(null);
  const [viewEvalLoading,    setViewEvalLoading]    = useState(false);

  // ── Remarks view modal ──
  const [showRemarksModal,   setShowRemarksModal]   = useState(false);
  const [remarksModalTitle,  setRemarksModalTitle]  = useState('');
  const [remarksModalText,   setRemarksModalText]   = useState('');

  // ── Toasts ──
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);

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
      console.log('[loadDashboard] getEmployeeDetails ->', empResult);

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
      console.log('[loadDashboard] getAllApplications ->', appResult);

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
      const hodId     = String(app.dealingHODId     ?? '').trim();
      const howId     = String(app.dealingHow       ?? '').trim();
      const faculty   = String(app.dealingFaculty   ?? '').trim();

      // Reset row flags
      app.isDealingAuthority = false;
      app.isHOD              = false;
      app.isHoW              = false;
      app.isdealingFaculty   = false;

      if (empCode) {
        if      (authority === empCode) { app.isDealingAuthority = true; da  = true; }
        else if (hodId     === empCode) { app.isHOD              = true; hod = true; }
        else if (howId     === empCode) { app.isHoW              = true; how = true; }
        else if (faculty   === empCode) { app.isdealingFaculty   = true; fac = true; }
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
    if (da)  return '** Dealing Authority Dashboard **';
    if (hod) return '** Head of Department Dashboard **';
    if (how) return '** Head of Wing Dashboard **';
    if (fac) return '** Dealing Faculty Dashboard **';
    return 'Dashboard';
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Pagination
  // ────────────────────────────────────────────────────────────────────────────

  const totalPages = Math.max(1, Math.ceil(visibleApplications.length / PAGE_SIZE));
  const pagedRows  = useMemo(() => {
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

    const fields = ['academicsMarks','communicationSkillsMarks','attitudeMarks','extraCurricularMarks','knowledgeMarks'] as const;
    const invalid = fields.some(f => {
      const v = Number(evalForm[f]);
      return evalForm[f] === '' || isNaN(v) || v < 0 || v > 100;
    });
    if (invalid) return;

    setEvalLoading(true);
    const res = await studentEvaluationAddNew({
      registrationNo:           activeApp.registrationNo,
      academicsMarks:           Number(evalForm.academicsMarks),
      communicationSkillsMarks: Number(evalForm.communicationSkillsMarks),
      attitudeMarks:            Number(evalForm.attitudeMarks),
      extraCurricularMarks:     Number(evalForm.extraCurricularMarks),
      knowledgeMarks:           Number(evalForm.knowledgeMarks),
      comments:                 evalForm.comments,
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

  const handleViewFaculty   = (app: Application) => {
    const r = getRemarksFor(app.registrationNo);
    showRemarks('Faculty Remarks', r?.dealingUserInterviewRemarks || r?.facultyRemarks || app.dealingUserInterviewRemarks);
  };
  const handleViewHOD       = (app: Application) => {
    const r = getRemarksFor(app.registrationNo);
    showRemarks('HOD Remarks', r?.hodRemarks || r?.dealingHODRemarks || app.dealingHODRemarks);
  };
  const handleViewHoW       = (app: Application) => {
    const r = getRemarksFor(app.registrationNo);
    showRemarks('Head of Wing Remarks', r?.howRemarks || r?.dealingHowRemarks || '');
  };
  const handleViewAuthority = (app: Application) => {
    const r = getRemarksFor(app.registrationNo);
    showRemarks('Authority Remarks', r?.ApprovalRemarks || r?.dealingUidRemarks || '');
  };

  // Has-data guards
  const hasFacultyRemarks   = (app: Application) => {
    const r = getRemarksFor(app.registrationNo);
    return !!(r?.facultyRemarks || r?.dealingUserInterviewRemarks || app.dealingUserInterviewRemarks);
  };
  const hasHODRemarks       = (app: Application) => {
    const r = getRemarksFor(app.registrationNo);
    return !!(r?.hodRemarks || r?.dealingHODRemarks || app.dealingHODRemarks);
  };
  const hasHoWRemarks       = (app: Application) => {
    const r = getRemarksFor(app.registrationNo);
    return !!(r?.howRemarks || r?.dealingHowRemarks);
  };
  const hasAuthorityRemarks = (app: Application) => {
    const r = getRemarksFor(app.registrationNo);
    return !!(r?.ApprovalRemarks || r?.dealingUidRemarks);
  };
  const hasEvalRemarks      = (app: Application) =>
    evalCacheRef.current.has(app.registrationNo);

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
    if (status === 'True')  return { cls: 'badge-success',  label: 'Done'    };
    if (status === 'False') return { cls: 'badge-warning',  label: 'Pending' };
    return                         { cls: 'badge-warning',  label: 'Pending' };
  };
  const approvalBadge = (val: string) => {
    if (val === 'True')  return { cls: 'badge-success', label: 'Approved' };
    if (val === 'False') return { cls: 'badge-danger',  label: 'Rejected' };
    return                      { cls: 'badge-warning', label: 'Pending'  };
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

  return (
    <>
      {/* ── Toasts ── */}
      <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 9000, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {toasts.map(t => (
          <div key={t.id} className={`se-toast se-toast-${t.type}`}>
            <strong>{t.title}</strong>
            {t.text && <div style={{ fontSize: '0.82rem', marginTop: 2 }}>{t.text}</div>}
          </div>
        ))}
      </div>

      {/* ── Loading overlay ── */}
      {loading && (
        <div className="se-loader-backdrop">
          <div className="se-loader-box">
            <div className="se-spinner" />
            <span>Loading…</span>
          </div>
        </div>
      )}

      <div className="se-container">

        {/* ── Header cards ── */}
        <div className="se-header-cards">
          <div className="se-card">
            <span className="se-label">Employee Name / UID:</span>
            <span className="se-value">{employeeName} / {employeeCode}</span>
          </div>
          <div className="se-card se-card-center">
            <span className="se-label-center">{pageTitle}</span>
          </div>
          <div className="se-card">
            <span className="se-label">Department Name:</span>
            <span className="se-value">{departmentName}</span>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="se-table-wrapper">
          <table className="se-table">
            <thead>
              <tr>
                <th>App. ID</th>
                <th>Reg. No.</th>
                <th>Contact No</th>
                <th>WhatsApp No</th>
                <th>Parent Phone</th>
                <th>Counselling</th>
                <th>App. Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagedRows.length === 0 && !loading ? (
                <tr>
                  <td colSpan={8} className="se-empty">No applications found.</td>
                </tr>
              ) : (
                pagedRows.map(app => {
                  const counsel = counselBadge(app.counsellingStatus);
                  const approval = approvalBadge(app.isApproved);
                  const isPending = !app.isApproved || app.isApproved === 'null';

                  return (
                    <tr key={app.applicationId}>
                      <td>{app.applicationId}</td>
                      <td>{app.registrationNo}</td>
                      <td>{app.phoneNumber}</td>
                      <td>{app.whatsAppNo}</td>
                      <td>{app.parentContact}</td>
                      <td><span className={`se-badge ${counsel.cls}`}>{counsel.label}</span></td>
                      <td><span className={`se-badge ${approval.cls}`}>{approval.label}</span></td>
                      <td>
                        <div className="se-actions">

                          {/* ── isHOD buttons ── */}
                          {app.isHOD && (
                            <>
                              {isPending && (
                                <>
                                  <button className="se-btn se-btn-success" onClick={() => handleAccept(app)}>Accept</button>
                                  <button className="se-btn se-btn-danger"  onClick={() => handleDisapprove(app)}>Reject</button>
                                </>
                              )}
                              <button className="se-btn se-btn-warning"  onClick={() => handleForward(app, 'How')}>Forward to HoW</button>
                              <button className="se-btn se-btn-primary"
                                onClick={() => app.counsellingStatus === 'True' ? handleViewCounselling(app) : handleOpenCounselling(app)}>
                                {app.counsellingStatus === 'True' ? 'View Counselling' : 'Submit Counselling'}
                              </button>
                              <button className="se-btn se-btn-primary"   onClick={() => handleOpenEval(app, 'HOD')}>Submit Evaluation</button>
                              <button className="se-btn se-btn-secondary" onClick={() => handleViewEvaluation(app)}  disabled={!hasEvalRemarks(app)}>Evaluation Remarks</button>
                              <button className="se-btn se-btn-secondary" onClick={() => handleViewFaculty(app)}     disabled={!hasFacultyRemarks(app)}>Faculty Remarks</button>
                              <button className="se-btn se-btn-secondary" onClick={() => handleViewAuthority(app)}   disabled={!hasAuthorityRemarks(app)}>Authority Remarks</button>
                              <button className="se-btn se-btn-secondary" onClick={() => handleViewHoW(app)}         disabled={!hasHoWRemarks(app)}>Own Remarks</button>
                            </>
                          )}

                          {/* ── isHoW buttons ── */}
                          {app.isHoW && (
                            <>
                              {isPending && (
                                <>
                                  <button className="se-btn se-btn-success" onClick={() => handleAccept(app)}>Accept</button>
                                  <button className="se-btn se-btn-danger"  onClick={() => handleDisapprove(app)}>Reject</button>
                                </>
                              )}
                              <button className="se-btn se-btn-primary"
                                onClick={() => app.counsellingStatus === 'True' ? handleViewCounselling(app) : handleOpenCounselling(app)}>
                                {app.counsellingStatus === 'True' ? 'View Counselling' : 'Submit Counselling'}
                              </button>
                              <button className="se-btn se-btn-primary"   onClick={() => handleOpenEval(app, 'HOW')}>Submit Evaluation</button>
                              <button className="se-btn se-btn-secondary" onClick={() => handleViewEvaluation(app)}  disabled={!hasEvalRemarks(app)}>Evaluation Remarks</button>
                              <button className="se-btn se-btn-secondary" onClick={() => handleViewFaculty(app)}     disabled={!hasFacultyRemarks(app)}>Faculty Remarks</button>
                              <button className="se-btn se-btn-secondary" onClick={() => handleViewAuthority(app)}   disabled={!hasAuthorityRemarks(app)}>Authority Remarks</button>
                              <button className="se-btn se-btn-secondary" onClick={() => handleViewHOD(app)}         disabled={!hasHODRemarks(app)}>HOD Remarks</button>
                              <button className="se-btn se-btn-secondary" onClick={() => handleViewHoW(app)}>Own Remarks</button>
                            </>
                          )}

                          {/* ── isDealingAuthority buttons ── */}
                          {app.isDealingAuthority && (
                            <>
                              <button className="se-btn se-btn-warning" onClick={() => handleForward(app, 'Hod')}>Forward to HoD</button>
                              <button className="se-btn se-btn-primary" onClick={() => handleOpenEval(app, 'HOD')}>Submit Evaluation</button>
                              <button className="se-btn se-btn-info"    onClick={() => handleViewEvaluation(app)}>View Evaluation</button>
                              <button className="se-btn se-btn-success" onClick={() => handleAccept(app)}>Accept</button>
                              <button className="se-btn se-btn-danger"  onClick={() => handleDisapprove(app)}>Reject</button>
                              <button className="se-btn se-btn-info"    onClick={() => handleViewFaculty(app)}     disabled={!hasFacultyRemarks(app)}>View Faculty Remarks</button>
                              <button className="se-btn se-btn-info"    onClick={() => handleViewHOD(app)}         disabled={!hasHODRemarks(app)}>View HOD Remarks</button>
                              <button className="se-btn se-btn-info"    onClick={() => handleViewHoW(app)}         disabled={!hasHoWRemarks(app)}>View HoW Remarks</button>
                              <button className="se-btn se-btn-info"    onClick={() => handleViewAuthority(app)}   disabled={!hasAuthorityRemarks(app)}>View Authority Remarks</button>
                            </>
                          )}

                          {/* ── isdealingFaculty buttons ── */}
                          {app.isdealingFaculty && (
                            <>
                              <button className="se-btn se-btn-warning" onClick={() => handleForward(app, 'Hod')}>Forward to HoD</button>
                              <button className="se-btn se-btn-primary"
                                onClick={() => app.counsellingStatus === 'True' ? handleViewCounselling(app) : handleOpenCounselling(app)}>
                                {app.counsellingStatus === 'True' ? 'View Counselling' : 'Submit Counselling'}
                              </button>
                              <button className="se-btn se-btn-primary" onClick={() => handleOpenEval(app, 'Faculty')}>Submit Evaluation</button>
                            </>
                          )}

                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {visibleApplications.length > PAGE_SIZE && (
          <div className="se-pagination">
            <button className="se-page-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>‹ Prev</button>
            <span>Page {currentPage} of {totalPages} ({visibleApplications.length} total)</span>
            <button className="se-page-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next ›</button>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          Evaluation Modal
      ════════════════════════════════════════════════════════════════════════ */}
      {showEvalModal && activeApp && (
        <div className="se-modal-backdrop" role="dialog" aria-modal>
          <div className="se-modal">
            <div className="se-modal-header">
              <h5>Evaluation Form</h5>
              <button className="se-modal-close" onClick={() => setShowEvalModal(false)}>&times;</button>
            </div>
            <div className="se-modal-body">
              <form onSubmit={handleEvalSubmit} noValidate>

                {/* Identifiers */}
                <div className="se-form-row">
                  <div className="se-form-group">
                    <label>Application ID</label>
                    <input className="se-input" value={activeApp.applicationId} disabled />
                  </div>
                  <div className="se-form-group">
                    <label>Registration Number</label>
                    <input className="se-input" value={activeApp.registrationNo} disabled />
                  </div>
                </div>

                {/* Marks fields */}
                {(
                  [
                    { label: 'Academics Marks',                   field: 'academicsMarks'           },
                    { label: 'Communication Skills Marks',        field: 'communicationSkillsMarks' },
                    { label: 'Attitude Marks',                    field: 'attitudeMarks'             },
                    { label: 'Extra-Curricular Activities Marks', field: 'extraCurricularMarks'     },
                    { label: 'Knowledge Marks',                   field: 'knowledgeMarks'            },
                  ] as { label: string; field: keyof EvalForm }[]
                ).map(({ label, field }) => (
                  <div className="se-form-row" key={field}>
                    <div className="se-form-group">
                      <label>{label}</label>
                      <input
                        className={`se-input${marksError(field) ? ' se-input-invalid' : ''}`}
                        type="number" min={0} max={100}
                        value={evalForm[field]}
                        onChange={e => setEvalForm(prev => ({ ...prev, [field]: e.target.value }))}
                      />
                      {marksError(field) && (
                        <span className="se-error-text">Please enter a valid {label} (0–100).</span>
                      )}
                    </div>
                  </div>
                ))}

                {/* Comments */}
                <div className="se-form-row">
                  <div className="se-form-group" style={{ flex: '1 1 100%' }}>
                    <label>Comments</label>
                    <textarea
                      className="se-input"
                      rows={3}
                      value={evalForm.comments}
                      onChange={e => setEvalForm(prev => ({ ...prev, comments: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="se-modal-footer">
                  <button type="button" className="se-btn se-btn-secondary" onClick={() => setShowEvalModal(false)}>Cancel</button>
                  <button type="submit" className="se-btn se-btn-success" disabled={evalLoading}>
                    {evalLoading ? 'Submitting…' : 'Submit Evaluation'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          Counselling Remarks Modal
      ════════════════════════════════════════════════════════════════════════ */}
      {showCounselModal && activeApp && (
        <div className="se-modal-backdrop" role="dialog" aria-modal>
          <div className="se-modal" style={{ maxWidth: 520 }}>
            <div className="se-modal-header">
              <h5>Counselling Remarks</h5>
              <button className="se-modal-close" onClick={() => setShowCounselModal(false)}>&times;</button>
            </div>
            <div className="se-modal-body">
              <form onSubmit={handleCounselSubmit} noValidate>
                <div className="se-form-group">
                  <label>Your Remarks <span style={{ color: '#dc3545' }}>*</span></label>
                  <textarea
                    className={`se-input${counselSubmitted && !counselRemarks.trim() ? ' se-input-invalid' : ''}`}
                    rows={5}
                    value={counselRemarks}
                    onChange={e => setCounselRemarks(e.target.value)}
                  />
                  {counselSubmitted && !counselRemarks.trim() && (
                    <span className="se-error-text">Counselling remarks are required.</span>
                  )}
                </div>
                <div className="se-modal-footer">
                  <button type="button" className="se-btn se-btn-secondary" onClick={() => setShowCounselModal(false)}>Cancel</button>
                  <button type="submit" className="se-btn se-btn-success" disabled={counselLoading}>
                    {counselLoading ? 'Saving…' : 'Submit Remarks'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          View Evaluation Modal
      ════════════════════════════════════════════════════════════════════════ */}
      {showViewEvalModal && (
        <div className="se-modal-backdrop" role="dialog" aria-modal>
          <div className="se-modal" style={{ maxWidth: 560 }}>
            <div className="se-modal-header">
              <h5>Evaluation Details</h5>
              <button className="se-modal-close" onClick={() => setShowViewEvalModal(false)}>&times;</button>
            </div>
            <div className="se-modal-body">
              {viewEvalLoading ? (
                <p style={{ textAlign: 'center', padding: 24 }}>Loading…</p>
              ) : viewEvalData ? (
                <table className="se-table" style={{ fontSize: '0.875rem' }}>
                  <tbody>
                    {[
                      ['Academics Marks',           viewEvalData.academicsMarks],
                      ['Communication Skills Marks',viewEvalData.communicationSkillsMarks],
                      ['Attitude Marks',            viewEvalData.attitudeMarks],
                      ['Extra-Curricular Marks',    viewEvalData.extraCurricularMarks],
                      ['Knowledge Marks',           viewEvalData.knowledgeMarks],
                      ['Total Marks',               viewEvalData.totalMarks],
                      ['Comments',                  viewEvalData.comments || '—'],
                      ['Remarks By',                viewEvalData.remarksBy || '—'],
                    ].map(([k, v]) => (
                      <tr key={k}><td style={{ fontWeight: 600, paddingRight: 16 }}>{k}</td><td>{v ?? 'N/A'}</td></tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ color: '#6c757d', textAlign: 'center', padding: 24 }}>No evaluation data available.</p>
              )}
            </div>
            <div className="se-modal-footer">
              <button className="se-btn se-btn-secondary" onClick={() => setShowViewEvalModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          Generic Remarks View Modal
      ════════════════════════════════════════════════════════════════════════ */}
      {showRemarksModal && (
        <div className="se-modal-backdrop" role="dialog" aria-modal>
          <div className="se-modal" style={{ maxWidth: 480 }}>
            <div className="se-modal-header">
              <h5>{remarksModalTitle}</h5>
              <button className="se-modal-close" onClick={() => setShowRemarksModal(false)}>&times;</button>
            </div>
            <div className="se-modal-body">
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{remarksModalText}</p>
            </div>
            <div className="se-modal-footer">
              <button className="se-btn se-btn-secondary" onClick={() => setShowRemarksModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
