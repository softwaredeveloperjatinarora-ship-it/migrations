'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Paper,
  useTheme,
  TextField,
  MenuItem,
  Button,
  Alert,
  Stack,
  Snackbar,
} from '@mui/material';
import {
  LocationOn,
  Close as CloseIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Cancel as CancelIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  Apartment,
} from '@mui/icons-material';
import Autocomplete from '@mui/material/Autocomplete';
import { LoadingButton } from '@mui/lab';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/app/dashboard/staff/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import { getEstateBlockSectors } from '@/app/actions/StaffActions/ObpStatusAction/getEstateBlockSectorsAction';
import { getEstateProjects } from '@/app/actions/StaffActions/ObpStatusAction/getEstateProjectsAction';
import { getEstateProjectStatus } from '@/app/actions/StaffActions/ObpStatusAction/getEstateProjectStatusAction';
import { getProjectStatusStructureDrawingStatus } from '@/app/actions/StaffActions/ObpStatusAction/getProjectStatusStructureDrawingStatusAction';
import {
  insertEstateProjectStatus,
  OBPInsertEstateProjectStatusRequest,
} from '@/app/actions/StaffActions/ObpStatusAction/insertEstateProjectStatusAction';
import { DownloadSupportingDocument } from '@/app/actions/StaffActions/ObpStatusAction/DownloadSupportingDocumentAction';
import { ListProjectFiles } from '@/app/actions/StaffActions/ObpStatusAction/ListProjectFilesAction';
import { hasRight, getDrawingRights } from '@/app/api/interfaces/ObpStatusInterface/rightsParser';

// Import child components
import FormHeader from './FormHeader';
import ProjectInfoSection from './ProjectInfoSection';
import StructureDrawingSection from './StructureDrawingSection';
import VerificationSection from './VerificationSection';
import RemarksModal from './RemarksModal';
import SuccessModal from './SuccessModal';
import ErrorModal from './ErrorModal';
import { DrawingTableRow } from './DrawingDataTable';

interface ProjectFormData {
  projectId: string;
  goAheadDate: string;
  completionDate: string;
  location: string;
  locationStatus: string;
  surrounding: string;
  structureDrawingStatus: string;
  structureDrawingRemarks: string;
  verificationStatus: string;
  verificationRemarks: string;
  finalDrawingStatus: string;
  finalDrawingRemarks: string;
}

interface ObpProjectFormProps {
  hideBreadcrumb?: boolean;
  userRights?: any;
}

export default function ObpProjectForm({
  hideBreadcrumb = false,
  userRights,
}: ObpProjectFormProps) {
  const theme = useTheme();
  const { data: session, status } = useSession();
  const router = useRouter();

  // State
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<any>([]);
  const [blockSectors, setBlockSectors] = useState<any>([]);
  const [projectStatuses, setProjectStatuses] = useState<any[]>([]);
  const [projectStatus, setProjectStatus] = useState<any>(null);
  const [drawingProjectId, setDrawingProjectId] = useState<string>('');
  const [drawingProjectStatus, setDrawingProjectStatus] = useState<any>(null);

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [fileError, setFileError] = useState<string>('');

  // Verification file upload state
  const [selectedVerificationFile, setSelectedVerificationFile] = useState<File | null>(null);
  const [selectedVerificationFileName, setSelectedVerificationFileName] = useState<string>('');
  const [verificationFileError, setVerificationFileError] = useState<string>('');

  // Master Log data from API
  const [masterLogData, setMasterLogData] = useState<any[]>([]);

  // Tab state
  const [structureTab, setStructureTab] = useState<number>(0);
  const [verificationTab, setVerificationTab] = useState<number>(0);

  // Search and sort state
  const [masterLogSearch, setMasterLogSearch] = useState('');
  const [structureSortOrder, setStructureSortOrder] = useState<string>('');
  const [verificationSortOrder, setVerificationSortOrder] = useState<string>('');
  const [masterLogPage, setMasterLogPage] = useState(0);
  const masterLogPageSize = 20;

  // Verification dropzone state
  const [showVerificationDropzone, setShowVerificationDropzone] = useState(false);

  // Modal state
  const [remarksModal, setRemarksModal] = useState<{
    isOpen: boolean;
    field: string;
    title: string;
  }>({ isOpen: false, field: '', title: '' });

  const [successModal, setSuccessModal] = useState<{
    isOpen: boolean;
    message: string;
  }>({ isOpen: false, message: '' });

  const [errorModal, setErrorModal] = useState<{
    isOpen: boolean;
    message: string;
  }>({ isOpen: false, message: '' });

  const [error, setError] = useState<string | null>(null);
  const [structureDrawingError, setStructureDrawingError] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Project options - handle different API response structures
  const projectIdOptions = useMemo(() => {
    if (!Array.isArray(projects)) {
      // If API returns an object with nested data
      if (projects && typeof projects === 'object') {
        const dataArray = projects.item1 || projects.data || projects.ApiData || [];
        if (Array.isArray(dataArray)) {
          return dataArray.map((p: any) => ({
            value: p.projectId?.toString() || '',
            label: p.projectId ? `${p.projectId} - ${p.projectName || ''}` : '',
          }));
        }
      }
      return [];
    }
    return projects.map((p: any) => ({
      value: p.projectId?.toString() || '',
      label: p.projectId ? `${p.projectId} - ${p.projectName || ''}` : '',
    }));
  }, [projects]);

  const locationOptions = useMemo(() => {
    let blockData = blockSectors;
    if (!Array.isArray(blockSectors) && blockSectors && typeof blockSectors === 'object') {
      blockData = blockSectors.item1 || blockSectors.data || blockSectors.ApiData || [];
    }
    if (!Array.isArray(blockData)) return [];

    // Parse blockName (format: "CODE::Name") and create unique options
    const uniqueMap = new Map();
    blockData.forEach((b: any) => {
      const blockName = b.blockName?.toString() || '';
      const parts = blockName.split('::');
      const code = parts[0]?.trim() || '';
      const name = parts.slice(1).join('::').trim() || parts[0] || '';

      if (code && !uniqueMap.has(code)) {
        uniqueMap.set(code, {
          value: code,
          label: `${code} - ${name}`,
        });
      }
    });

    const result = Array.from(uniqueMap.values());
    return result;
  }, [blockSectors]);

  // All project options available for Drawing/Verification dropdowns
  const drawingProjectIdOptions = projectIdOptions;

  // Rights parsing
  const architectureRemarks =
    projectStatus?.architectureDrawingRemarks ||
    drawingProjectStatus?.architectureDrawingRemarks ||
    '';
  const drawingRights = getDrawingRights(userRights, architectureRemarks);

  const hasProjectInfo = drawingRights.hasProjectInfo;
  const hasDrawingSection = drawingRights.hasDrawingSection;
  const hasStructureDrawingAccess = drawingRights.hasStructureDrawing;
  const hasVerificationAccess = drawingRights.hasVerification;

  const hasBothModules = hasStructureDrawingAccess && hasVerificationAccess;
  const hasOnlyStructure = hasStructureDrawingAccess && !hasVerificationAccess;
  const hasOnlyVerification = !hasStructureDrawingAccess && hasVerificationAccess;

  // Refs
  const goAheadDateRef = useRef<HTMLInputElement>(null);
  const completionDateRef = useRef<HTMLInputElement>(null);

  // Breadcrumb
  const BCrumb = [
    { to: '/dashboard/staff', title: 'Dashboard' },
    { to: '/dashboard/staff/ObpStatusApproval', title: 'Project Status ' },
    { title: 'Project Form' },
  ];

  // Helper function to convert file to base64
  const convertFileToBase64 = (file: File): Promise<{ base64: string; fileName: string }> => {
    return new Promise((resolve, reject) => {
      if (file.size > 10148576) {
        reject(new Error('File size exceeds 10 MB. Please upload a smaller file.'));
        return;
      }
      const fileNameRegex = /^[a-zA-Z0-9._-]+$/;
      let validFileName = file.name;
      if (!fileNameRegex.test(file.name)) {
        validFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64Array = result.split(',');
        resolve({ base64: base64Array[1], fileName: validFileName });
      };
      reader.onerror = error => reject(error);
    });
  };

  // Formik — manages field state only; submission is handled by section-specific handlers below
  const formik = useFormik<ProjectFormData>({
    initialValues: {
      projectId: '',
      goAheadDate: '',
      completionDate: '',
      location: '',
      locationStatus: '',
      surrounding: '',
      structureDrawingStatus: '',
      structureDrawingRemarks: '',
      verificationStatus: '',
      verificationRemarks: '',
      finalDrawingStatus: '',
      finalDrawingRemarks: '',
    },
    validationSchema: Yup.object({
      projectId: Yup.string().required('Project ID is required'),
      location: Yup.string().required('Location (Block) is required'),
      locationStatus: Yup.string().required('Location Status is required'),
      surrounding: Yup.string().required('Surrounding details are required'),
    }),
    onSubmit: () => {},
  });

  // Handlers
  const handleReset = () => {
    formik.resetForm();
  };

  const handleProjectInfoSubmit = async () => {
    if (status === 'loading') {
      setError('Session is still loading. Please wait...');
      return;
    }
    if (!session?.user?.token) {
      setError('User session is invalid. Please log in again.');
      return;
    }
    // Touch all project info fields to show inline errors
    await formik.setTouched({
      projectId: true,
      location: true,
      locationStatus: true,
      surrounding: true,
    });
    const errors = await formik.validateForm();
    const projectInfoFields = ['projectId', 'location', 'locationStatus', 'surrounding'];
    const hasErrors = projectInfoFields.some(f => errors[f as keyof typeof errors]);
    if (hasErrors) return;
    setError(null);
    setLoading(true);
    try {
      const result = await insertEstateProjectStatus(
        {
          ProjectId: parseInt(formik.values.projectId) || 0,
          GoAheaddate: formik.values.goAheadDate
            ? new Date(formik.values.goAheadDate).toISOString()
            : null,
          CompletionDate: formik.values.completionDate
            ? new Date(formik.values.completionDate).toISOString()
            : null,
          Location: formik.values.locationStatus || null,
          BlockSector: formik.values.location || null,
          Surrounding: formik.values.surrounding || null,
          LocationRemarks: formik.values.locationStatus || null,
          CreatedBy: '34452',
        },
        session.user.token
      );
      if (result.status === 'success') {
        setSuccessModal({
          isOpen: true,
          message: projectStatus
            ? 'Project info updated successfully!'
            : 'Project info added successfully!',
        });
      } else {
        setErrorModal({
          isOpen: true,
          message: result.message || 'Submission failed. Please try again.',
        });
      }
    } catch (err: unknown) {
      setErrorModal({
        isOpen: true,
        message: err instanceof Error ? err.message : 'An error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStructureDrawingSubmit = async () => {
    debugger;
    if (!session?.user?.token) {
      setStructureDrawingError('User session is invalid. Please log in again.');
      return;
    }
    const projectId = drawingProjectId || formik.values.projectId;
    if (!projectId) {
      setStructureDrawingError('Please select a Project ID.');
      return;
    }
    if (!selectedFile && !selectedFileName) {
      setStructureDrawingError('Please upload a structure drawing file.');
      return;
    }
    setStructureDrawingError(null);
    setLoading(true);
    try {
      let structureFileUpload: string | null = null;
      let structureFileExt: string | null = null;
      if (selectedFile) {
        const { base64, fileName } = await convertFileToBase64(selectedFile);
        structureFileUpload = base64;
        structureFileExt = fileName.split('.').pop() || '';
      }
      const result = await insertEstateProjectStatus(
        {
          ProjectId: parseInt(projectId) || 0,
          StructureFileUpload: structureFileUpload,
          StructureFileExt: structureFileExt,
          CreatedBy: '34452',
        },
        session.user.token
      );
      if (result.status === 'success') {
        const isUpdate = !!drawingProjectStatus?.structureDrawing;
        setSuccessModal({
          isOpen: true,
          message: isUpdate
            ? 'Structure drawing updated successfully!'
            : 'Structure drawing added successfully!',
        });
        refreshStructureDrawingData();
      } else {
        setErrorModal({
          isOpen: true,
          message: result.message || 'Submission failed. Please try again.',
        });
      }
    } catch (err: unknown) {
      setErrorModal({
        isOpen: true,
        message: err instanceof Error ? err.message : 'An error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async () => {
    if (!session?.user?.token) {
      setVerificationError('User session is invalid. Please log in again.');
      return;
    }
    const projectId = drawingProjectId || formik.values.projectId;
    if (!projectId) {
      setVerificationError('Please select a Project ID.');
      return;
    }
    if (!formik.values.verificationStatus) {
      setVerificationError('Please select a Verification Status.');
      return;
    }
    if (!formik.values.verificationRemarks) {
      setVerificationError('Please add Verification Remarks.');
      return;
    }
    if (!selectedVerificationFile && !selectedVerificationFileName) {
      setVerificationError('Please upload a verification file.');
      return;
    }
    setVerificationError(null);
    setLoading(true);
    try {
      let verificationFileUpload: string | null = null;
      let verificationFileExt: string | null = null;
      if (selectedVerificationFile) {
        const { base64, fileName } = await convertFileToBase64(selectedVerificationFile);
        verificationFileUpload = base64;
        verificationFileExt = fileName.split('.').pop() || '';
      }
      const result = await insertEstateProjectStatus(
        {
          ProjectId: parseInt(projectId) || 0,
          BlockSector: drawingProjectStatus?.blockSector || null,
          VerifyArchStructure: formik.values.verificationStatus || null,
          VerifyArchStructureRemarks: formik.values.verificationRemarks || null,
          VerifyFileUpload: verificationFileUpload,
          VerifyFileExt: verificationFileExt,
          CreatedBy: '34452',
        },
        session.user.token
      );
      if (result.status === 'success') {
        const isUpdate = !!drawingProjectStatus?.verifyArchStructure;
        setSuccessModal({
          isOpen: true,
          message: isUpdate
            ? 'Verification updated successfully!'
            : 'Verification added successfully!',
        });
      } else {
        setErrorModal({
          isOpen: true,
          message: result.message || 'Submission failed. Please try again.',
        });
      }
    } catch (err: unknown) {
      setErrorModal({
        isOpen: true,
        message: err instanceof Error ? err.message : 'An error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const normalizeFolderPath = (path: string): string => {
    if (!path) return path;
    let normalized = path.startsWith('/') ? path : `/${path}`;
    normalized = normalized.endsWith('/') ? normalized : `${normalized}/`;
    return normalized;
  };

  const handleViewFile = async (filename: string, folderName?: string) => {
    // Use passed folderName first, then fall back to selected project's folder path
    const rawFolderPath =
      folderName || drawingProjectStatus?.folderName || projectStatus?.folderName || '';
    const folderPath = normalizeFolderPath(rawFolderPath);
    const fileName =
      filename || drawingProjectStatus?.fileName || projectStatus?.fileName || 'document.pdf';

    if (!folderPath || !fileName) {
      alert('No file available for viewing');
      return;
    }

    try {
      const response = await DownloadSupportingDocument(folderPath, fileName);

      if (response?.status !== 'ok') {
        alert('View failed: ' + (response?.message || 'Unknown error'));
        return;
      }

      const { base64, mime } = response;

      if (!base64) {
        return;
      }

      // Create blob and open in new window
      const binary = atob(base64);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: mime || 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);

      // Open in new tab
      window.open(blobUrl, '_blank');
    } catch {
      alert('Error viewing file');
    }
  };

  const handleDownload = async (filename: string, folderName?: string) => {
    // Use passed folderName first, then fall back to selected project's folder path
    const rawFolderPath =
      folderName || drawingProjectStatus?.folderName || projectStatus?.folderName || '';
    const folderPath = normalizeFolderPath(rawFolderPath);
    const fileName =
      filename || drawingProjectStatus?.fileName || projectStatus?.fileName || 'document.pdf';

    if (!folderPath || !fileName) {
      alert('No file available for download');
      return;
    }

    try {
      const response = await DownloadSupportingDocument(folderPath, fileName);

      if (response?.status !== 'ok') {
        alert('Download failed: ' + (response?.message || 'Unknown error'));
        return;
      }

      const { base64, mime, filename: serverFilename } = response;

      if (!base64) {
        alert('Error: No file data received from server');
        return;
      }

      // Decode base64 -> Uint8Array
      const binary = atob(base64);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);

      // Build blob
      const blob = new Blob([bytes], {
        type: mime ?? 'application/octet-stream',
      });
      const url = URL.createObjectURL(blob);

      // Choose safe filename
      let safeFilename = serverFilename ?? filename ?? 'download';
      safeFilename = safeFilename.split(/[\\/]/).pop() || 'download';

      // Create anchor and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = safeFilename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);
    } catch {
      alert('Error downloading file');
    }
  };

  const handleUploadClick = (projectId?: string) => {
    if (projectId) {
      setDrawingProjectId(projectId);
    }
    setVerificationTab(1);
    setShowVerificationDropzone(true);
  };

  const openRemarksModal = (field: string, title: string) => {
    setRemarksModal({ isOpen: true, field, title });
  };

  const handleRemarksChange = (value: string) => {
    formik.setFieldValue(remarksModal.field, value);
  };

  const refreshStructureDrawingData = async () => {
    if (drawingProjectId && session?.user?.token) {
      try {
        const statusResult = await getEstateProjectStatus(drawingProjectId, session.user.token);
        if (statusResult.status === 'success') {
          const projectData = statusResult.ApiData?.item1?.[0];
          setDrawingProjectStatus(projectData);
          if (projectData?.fileName) {
            setSelectedFileName(projectData.fileName);
          }
        }
      } catch {}
    }
  };

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      if (session?.user?.token) {
        try {
          const result = await getEstateProjects(session.user.token);
          if (result.status === 'success') {
            // Handle different API response structures
            let data = result.ApiData;
            if (data && typeof data === 'object' && !Array.isArray(data)) {
              data = data.item1 || data.data || [];
            }
            setProjects(Array.isArray(data) ? data : []);
          }
        } catch {
          setProjects([]);
        }
      }
    };
    fetchProjects();
  }, [session?.user?.token]);

  // Fetch block sectors
  useEffect(() => {
    const fetchBlockSectors = async () => {
      if (session?.user?.token) {
        try {
          const result = await getEstateBlockSectors(session.user.token);
          if (result.status === 'success') {
            // Handle different API response structures
            let data = result.ApiData;
            if (data && typeof data === 'object' && !Array.isArray(data)) {
              data = data.item1 || data.data || [];
            }
            const parsedBlockSectors = Array.isArray(data) ? data : [];
            setBlockSectors(parsedBlockSectors);
          }
        } catch {
          setBlockSectors([]);
        }
      }
    };
    fetchBlockSectors();
  }, [session?.user?.token]);

  // Fetch master log data
  useEffect(() => {
    const fetchMasterLogData = async () => {
      if (session?.user?.token) {
        try {
          const result = await getProjectStatusStructureDrawingStatus(session.user.token);
          if (result.status === 'success') {
            // Handle different API response structures
            let data = result.ApiData;
            if (data && typeof data === 'object' && !Array.isArray(data)) {
              data = data.item1 || data.data || [];
            }
            const parsedData = Array.isArray(data) ? data : [];
            setMasterLogData(parsedData);
          }
        } catch {
          setMasterLogData([]);
        }
      }
    };
    fetchMasterLogData();
  }, [session?.user?.token]);

  // Fetch project status when projectId changes - This populates Project Information section fields
  useEffect(() => {
    const fetchProjectStatus = async () => {
      if (formik.values.projectId && session?.user?.token) {
        try {
          const statusResult = await getEstateProjectStatus(
            formik.values.projectId,
            session.user.token
          );
          if (statusResult.status === 'success') {
            const projectData = statusResult.ApiData?.item1?.[0];
            setProjectStatus(projectData);

            // Helper function to parse date from MM/DD/YYYY format to YYYY-MM-DD
            const parseDate = (dateStr: string) => {
              if (!dateStr) return '';
              const [datePart] = dateStr.split(' ');
              const [month, day, year] = datePart.split('/');
              return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            };

            // Populate form fields with fetched data
            if (projectData) {
              formik.setValues({
                ...formik.values,
                goAheadDate: parseDate(projectData.goAheaddate) || '',
                completionDate: parseDate(projectData.completionDate) || '',
                location: projectData.blockSector || '',
                locationStatus: projectData.locationRemarks || '',
                surrounding: projectData.surrounding || '',
                structureDrawingStatus: projectData.structureDrawing || '',
                structureDrawingRemarks: projectData.structureDrawingRemarks || '',
                verificationStatus: projectData.verifyArchStructure || '',
                verificationRemarks: projectData.verifyArchStructureRemarks || '',
                finalDrawingStatus:
                  projectData.finalDrawing || projectData.verifyArchStructure || '',
                finalDrawingRemarks:
                  projectData.finalDrawingRemarks || projectData.verifyArchStructureRemarks || '',
              });
            } else {
              // Clear form fields if no data for this project
              formik.setValues({
                ...formik.values,
                goAheadDate: '',
                completionDate: '',
                location: '',
                locationStatus: '',
                surrounding: '',
                structureDrawingStatus: '',
                structureDrawingRemarks: '',
                verificationStatus: '',
                verificationRemarks: '',
                finalDrawingStatus: '',
                finalDrawingRemarks: '',
              });
            }
          } else {
            setProjectStatus(null);
          }
        } catch {
          setProjectStatus(null);
        }
      } else {
        setProjectStatus(null);
      }
    };

    fetchProjectStatus();
  }, [formik.values.projectId, session?.user?.token]);

  // Fetch drawing project status when drawingProjectId changes - This populates form fields in Verification section
  useEffect(() => {
    const fetchDrawingProjectStatus = async () => {
      if (drawingProjectId && session?.user?.token) {
        try {
          const statusResult = await getEstateProjectStatus(drawingProjectId, session.user.token);

          if (statusResult.status === 'success') {
            const projectData = statusResult.ApiData?.item1?.[0];
            setDrawingProjectStatus(projectData);

            // Set selectedFileName if there's an existing file uploaded
            if (projectData?.fileName) {
              setSelectedFileName(projectData.fileName);
            } else {
              setSelectedFileName('');
            }

            // Populate drawing-related form fields with fetched data
            if (projectData) {
              formik.setValues({
                ...formik.values,
                structureDrawingStatus: projectData.structureDrawing || '',
                structureDrawingRemarks: projectData.structureDrawingRemarks || '',
                verificationStatus: projectData.verifyArchStructure || '',
                verificationRemarks: projectData.verifyArchStructureRemarks || '',
              });
            } else {
              // Clear drawing-related form fields if no data for this project
              formik.setValues({
                ...formik.values,
                structureDrawingStatus: '',
                structureDrawingRemarks: '',
                verificationStatus: '',
                verificationRemarks: '',
              });
            }
          } else {
            setDrawingProjectStatus(null);
            setSelectedFileName('');
          }
        } catch {
          setDrawingProjectStatus(null);
          setSelectedFileName('');
        }
      } else {
        setDrawingProjectStatus(null);
        setSelectedFileName('');
      }
    };

    fetchDrawingProjectStatus();
  }, [drawingProjectId, session?.user?.token]);

  // Transform master data - with safety check
  const structureMasterData = useMemo((): DrawingTableRow[] => {
    if (!Array.isArray(masterLogData)) return [];
    return masterLogData.map((item: any, index: number) => ({
      id: item.Id || item.id || index + 1,
      projectId: item.ProjectId || item.projectId,
      fileName: item.FileName || item.fileName || 'N/A',
      uploadDate: item.StructureDrawingDateTime || item.structureDrawingDateTime || 'N/A',
      remarks: item.VerifyArchStructureRemarks || item.verifyArchStructureRemarks || 'N/A',
      status: ((item.StructureDrawing || item.structureDrawing) === 'approved'
        ? 'Approved'
        : (item.StructureDrawing || item.structureDrawing) === 'revision'
          ? 'Revision'
          : (item.StructureDrawing || item.structureDrawing) === 'new'
            ? 'New'
            : 'Awaited') as DrawingTableRow['status'],
      employeeName: item.EmployeeName || item.employeeName,
      folderName: item.FolderName || item.folderName,
    }));
  }, [masterLogData]);

  const verificationMasterData = useMemo((): DrawingTableRow[] => {
    if (!Array.isArray(masterLogData)) return [];
    return masterLogData.map((item: any, index: number) => ({
      id: item.Id || item.id || index + 1,
      projectId: item.ProjectId || item.projectId,
      fileName: item.VerifyFileName || item.FileName || 'N/A',
      uploadDate: item.VerifyArchStructureDateTime || item.verifyArchStructureDateTime || 'N/A',
      remarks: item.VerifyArchStructureRemarks || item.verifyArchStructureRemarks || 'N/A',
      status: ((item.VerifyArchStructure || item.verifyArchStructure) === 'approved'
        ? 'Approved'
        : (item.VerifyArchStructure || item.verifyArchStructure) === 'revision'
          ? 'Revision'
          : (item.VerifyArchStructure || item.verifyArchStructure) === 'new'
            ? 'New'
            : 'Awaited') as DrawingTableRow['status'],
      employeeName: item.EmployeeName || item.employeeName,
      folderName: item.FolderName || item.folderName,
    }));
  }, [masterLogData]);

  // Selected project data for Tab 2 (when a project is selected)
  const selectedProjectData = useMemo((): DrawingTableRow | null => {
    if (!drawingProjectStatus) return null;
    return {
      id: 1,
      projectId: drawingProjectId,
      fileName: drawingProjectStatus.fileName || drawingProjectStatus.VerifyFileName || 'N/A',
      uploadDate:
        drawingProjectStatus.VerifyArchStructureDateTime ||
        drawingProjectStatus.structureDrawingDateTime ||
        'N/A',
      remarks:
        drawingProjectStatus.VerifyArchStructureRemarks ||
        drawingProjectStatus.structureDrawingRemarks ||
        'N/A',
      status: (drawingProjectStatus.VerifyArchStructure === 'approved'
        ? 'Approved'
        : drawingProjectStatus.VerifyArchStructure === 'revision'
          ? 'Revision'
          : drawingProjectStatus.VerifyArchStructure === 'new'
            ? 'New'
            : 'Awaited') as DrawingTableRow['status'],
      employeeName: drawingProjectStatus.EmployeeName,
      folderName: drawingProjectStatus.folderName,
    };
  }, [drawingProjectStatus, drawingProjectId]);

  // Filtered verification data for Tab 2 when a project is selected
  const selectedProjectVerificationData = useMemo((): DrawingTableRow[] => {
    if (!drawingProjectId) return [];
    // Filter master data to show only the selected project's entries
    return verificationMasterData.filter(
      item => item.projectId?.toString() === drawingProjectId?.toString()
    );
  }, [verificationMasterData, drawingProjectId]);

  // Filtered structure drawing data for Tab 2 when a project is selected
  const selectedProjectStructureData = useMemo((): DrawingTableRow[] => {
    if (!drawingProjectId) return [];
    // Filter master data to show only the selected project's entries
    return structureMasterData.filter(
      item => item.projectId?.toString() === drawingProjectId?.toString()
    );
  }, [structureMasterData, drawingProjectId]);

  const structureTotalEntries = structureMasterData.length;
  const structureTotalPages = Math.ceil(structureTotalEntries / masterLogPageSize);
  const verificationTotalEntries = verificationMasterData.length;
  const verificationTotalPages = Math.ceil(verificationTotalEntries / masterLogPageSize);

  return (
    <>
      {!hideBreadcrumb && <Breadcrumb title=" Project Details" items={BCrumb} />}
      <Box>
        <Paper elevation={6} sx={{ borderRadius: 2, backgroundColor: 'rgba(255, 255, 255, 0.98)' }}>
          {/* Form Header */}
          <FormHeader />

          <form onSubmit={e => e.preventDefault()}>
            {/* Error Display */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Main Content */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 3 }}>
              {/* Project Information Section */}
              <ProjectInfoSection
                projectIdOptions={projectIdOptions}
                locationOptions={locationOptions}
                formik={formik}
                onReset={handleReset}
                loading={loading}
                hasProjectInfo={hasProjectInfo}
                onSubmit={handleProjectInfoSubmit}
              />

              {/* Drawing Status Section */}
              {(hasStructureDrawingAccess || hasVerificationAccess) && (
                <Box sx={{ flex: { xs: '1', lg: hasBothModules ? '0 0 66.667%' : '1' } }}>
                  <Card
                    sx={{
                      height: '100%',
                      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                      borderRadius: 1,
                      padding: '0',
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: 'white',
                        p: 2,
                        borderRadius: '12px 12px 0 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Apartment />
                      <Typography variant="h6" fontWeight="bold">
                        Drawing Status
                      </Typography>
                    </Box>

                    <CardContent sx={{ p: 3 }}>
                      {/* Common Project ID for both modules */}
                      {hasBothModules && (
                        <Box sx={{ mb: 3 }}>
                          <Autocomplete
                            fullWidth
                            id="drawingProjectId"
                            options={drawingProjectIdOptions}
                            getOptionLabel={option => option.label}
                            value={
                              drawingProjectIdOptions.find(
                                option => option.value === drawingProjectId
                              ) || null
                            }
                            onChange={(event, newValue) =>
                              setDrawingProjectId(newValue?.value || '')
                            }
                            renderInput={params => (
                              <TextField
                                {...params}
                                label="Select Project ID for Drawing Status"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    backgroundColor: 'white',
                                  },
                                }}
                              />
                            )}
                          />
                        </Box>
                      )}

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {/* Structure Drawing Section */}
                        {hasStructureDrawingAccess && (
                          <StructureDrawingSection
                            hasAccess={hasStructureDrawingAccess}
                            hasBothModules={hasBothModules}
                            hasProjectInfo={hasProjectInfo}
                            hasOnlyStructure={hasOnlyStructure}
                            drawingProjectId={drawingProjectId}
                            setDrawingProjectId={setDrawingProjectId}
                            projectIdOptions={drawingProjectIdOptions}
                            selectedFile={selectedFile}
                            setSelectedFile={setSelectedFile}
                            selectedFileName={selectedFileName}
                            setSelectedFileName={setSelectedFileName}
                            fileError={fileError}
                            setFileError={setFileError}
                            structureTab={structureTab}
                            setStructureTab={setStructureTab}
                            masterLogSearch={masterLogSearch}
                            setMasterLogSearch={setMasterLogSearch}
                            structureSortOrder={structureSortOrder}
                            setStructureSortOrder={setStructureSortOrder}
                            masterLogPage={masterLogPage}
                            setMasterLogPage={setMasterLogPage}
                            masterLogPageSize={masterLogPageSize}
                            structureMasterData={structureMasterData}
                            structureTotalEntries={structureTotalEntries}
                            structureTotalPages={structureTotalPages}
                            selectedProjectData={selectedProjectData}
                            selectedProjectStructureData={selectedProjectStructureData}
                            onDownload={handleDownload}
                            onViewFile={handleViewFile}
                            loading={loading}
                            onSubmit={handleStructureDrawingSubmit}
                            submitDisabled={!selectedFile && !selectedFileName}
                            structureDrawingError={structureDrawingError}
                          />
                        )}

                        {/* Verification Section */}
                        {hasVerificationAccess && (
                          <VerificationSection
                            hasAccess={hasVerificationAccess}
                            hasBothModules={hasBothModules}
                            hasProjectInfo={hasProjectInfo}
                            hasOnlyVerification={hasOnlyVerification}
                            drawingProjectId={drawingProjectId}
                            setDrawingProjectId={setDrawingProjectId}
                            projectIdOptions={drawingProjectIdOptions}
                            verificationTab={verificationTab}
                            setVerificationTab={setVerificationTab}
                            masterLogSearch={masterLogSearch}
                            setMasterLogSearch={setMasterLogSearch}
                            verificationSortOrder={verificationSortOrder}
                            setVerificationSortOrder={setVerificationSortOrder}
                            masterLogPage={masterLogPage}
                            setMasterLogPage={setMasterLogPage}
                            masterLogPageSize={masterLogPageSize}
                            verificationMasterData={verificationMasterData}
                            verificationTotalEntries={verificationTotalEntries}
                            verificationTotalPages={verificationTotalPages}
                            selectedProjectData={selectedProjectData}
                            selectedProjectVerificationData={selectedProjectVerificationData}
                            showVerificationDropzone={showVerificationDropzone}
                            setShowVerificationDropzone={setShowVerificationDropzone}
                            selectedVerificationFile={selectedVerificationFile}
                            setSelectedVerificationFile={setSelectedVerificationFile}
                            selectedVerificationFileName={selectedVerificationFileName}
                            setSelectedVerificationFileName={setSelectedVerificationFileName}
                            verificationFileError={verificationFileError}
                            setVerificationFileError={setVerificationFileError}
                            formik={formik}
                            onOpenRemarksModal={openRemarksModal}
                            onDownload={handleDownload}
                            onViewFile={handleViewFile}
                            onUploadNew={handleUploadClick}
                            loading={loading}
                            onSubmit={handleVerificationSubmit}
                            verificationError={verificationError}
                          />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              )}
            </Box>
          </form>
        </Paper>
      </Box>

      {/* Remarks Modal */}
      <RemarksModal
        isOpen={remarksModal.isOpen}
        onClose={() => setRemarksModal({ ...remarksModal, isOpen: false })}
        title={remarksModal.title}
        value={formik.values[remarksModal.field as keyof ProjectFormData] as string}
        onChange={handleRemarksChange}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={() => setSuccessModal({ isOpen: false, message: '' })}
        message={successModal.message}
      />

      {/* Error Modal */}
      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ isOpen: false, message: '' })}
        message={errorModal.message}
      />

      {/* Snackbar for inline errors */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="warning"
          variant="filled"
          sx={{ width: '100%', fontSize: '0.8rem' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
