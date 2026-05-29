 "use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  ColumnFiltersState,
  SortingState,
} from "@tanstack/react-table";
import { getColumns, getDepartmentStyle } from "@/app/components/StaffViews/ObpStatusApproval/ObpStatusColumnComponent";
// Using MUI components consistent with other files in the project
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  IconButton,
  Autocomplete,
  TextField,
  Switch,
  FormControlLabel,
  Menu,
} from "@mui/material";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import Breadcrumb from "@/app/dashboard/staff/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import { GridCloseIcon } from "@mui/x-data-grid";
import { OBPProjectData } from "@/app/api/interfaces/ObpStatusInterface/obpStatus";
import { Close, Download, PictureAsPdf, Print, ExpandMore, ExpandLess, Visibility } from "@mui/icons-material";
import Link from "next/link";
import { getProjectWiseStagesStatus } from "@/app/actions/StaffActions/ObpStatusAction/getProjectWiseStagesStatusAction";
import { DownloadSupportingDocument } from "@/app/actions/StaffActions/ObpStatusAction/DownloadSupportingDocumentAction";
import { getOBPConstructionFollowUpChatMessages } from "@/app/actions/StaffActions/ObpStatusAction/getOBPConstructionFollowUpChatMessagesAction";
import { getEstateBlockSectors } from "@/app/actions/StaffActions/ObpStatusAction/getEstateBlockSectorsAction";
import { parseArchitectureDrawingRemarks, ArchitectureDrawingRights, getDrawingRights } from "@/app/api/interfaces/ObpStatusInterface/rightsParser";
import ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import StageChatModal from "./StageChatModal";
import ArchitectDrawingChatModal from "./ArchitectDrawingChatModal";

const BCrumb = [
  {
    to: "/dashboard/staff",
    title: "Dashboard",
  },
  {
    to: "/dashboard/staff/ObpStatusApproval",
    title: "OBP Status Approval",
  },
  {
    to: "/dashboard/staff/ObpStatusApproval/ApprovalTable",
    title: "Approval Table",
  },
];

interface Project {
  projectId: number;
  projectName: string;
  name?: string;
}

interface OBPStatusTableProps {
  hideBreadcrumb?: boolean;
  onClose?: () => void;
}

interface BaseStep {
  sNo: string;
  label: string;
  isSubStep: boolean;
  hasSubSteps?: boolean;
  metricId?: string;
  isDivisionHeader?: boolean;
  divisionId?: number;
  stageMetricCount?: number;
}

interface SubStep extends BaseStep {
  metricId?: string;
  isDivisionHeader?: boolean;
  divisionId?: number;
  stageMetricCount?: number;
}

interface StageItem {
  metricId: number;
  stageDescription: string;
  divisionId: number;
  startDate: string;
  endDate: string;
  actionStatus: string;
  notingSheetStatus: string;
  drawingNo: string;
  metricDescription: string;
}

interface MetricData {
  metricDescription: string;
  stages: { description: string; stageMetricCount: number }[];
  endDate: string;
  drawingNumber: string;
  hasArchitect: boolean;
  divisionId: number;
  architectureIssueDate?: string;
  metricId: any;
  stageAllocationId: any;
}

type GroupedMetrics = Record<string, {
  metricDescription: string;
  stages: { description: string; stageMetricCount: number }[];
  endDate: string;
  drawingNumber: string;
  hasArchitect: boolean;
  divisionId: number;
  architectureIssueDate?: string;
  metricId: any;
  stageAllocationId: any;
}>;

// Function to extract reference number from metric description
// Example: "Drawing No.425055 Main Gate ( Project ID- 0123 ) :: LIT/11/CLW/2024/005(Vol-6)/NS/250603/0001)" -> "LIT/11/CLW/2024/005(Vol-6)/NS/250603/0001)"
function extractReferenceNo(metricDescription: string): string {
  if (!metricDescription) return '';
  const parts = metricDescription.split('::');
  return parts.length > 1 ? parts[1].trim() : '';
}

export default function OBPStatusTable({
  hideBreadcrumb = false,
  onClose,
}: OBPStatusTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [projectData, setProjectData] = useState<any>(null);
  const [stagesData, setStagesData] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [loadingStages, setLoadingStages] = useState(false);
  const [stagesError, setStagesError] = useState<string | null>(null);
  const [expandedMetrics, setExpandedMetrics] = useState<Set<string>>(new Set());
  const [expandedDepartments, setExpandedDepartments] = useState<Set<number>>(new Set());
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [selectedMetricData, setSelectedMetricData] = useState<any>(null);
  const [selectedStageData, setSelectedStageData] = useState<any>(null);
  const [selectedUid, setSelectedUid] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [architectChatModalOpen, setArchitectChatModalOpen] = useState(false);
  const [selectedArchitectDrawing, setSelectedArchitectDrawing] = useState<{
    metricId: string;
    metricDescription: string;
    drawingNumber: string;
    endDate: string;
    stageAllocationId: string;
  } | null>(null);
  const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [isEDashboardActive, setIsEDashboardActive] = useState(false);
  const [blockSectorMap, setBlockSectorMap] = useState<Record<string, string>>({});
  const { data: session } = useSession();
  // Get LoginName from authentication session
  const [loginName, setLoginName] = useState<string>("");

  // Update loginName when session is available
  useEffect(() => {
    if (session?.user?._id) {
      setLoginName(session.user._id.toString());
    }
  }, [session]);
  // Fetch block sectors to map code -> name
  useEffect(() => {
    const fetchBlockSectors = async () => {
      try {
        const result = await getEstateBlockSectors();
        if (result.status === 'success') {
          let data = result.ApiData;
          if (data && typeof data === 'object' && !Array.isArray(data)) {
            data = data.item1 || data.data || [];
          }
          const map: Record<string, string> = {};
          if (Array.isArray(data)) {
            data.forEach((b: any) => {
              const blockName = b.blockName?.toString() || '';
              const parts = blockName.split('::');
              const code = parts[0]?.trim();
              const name = parts.slice(1).join('::').trim() || code;
              if (code) map[code] = name;
            });
          }
          setBlockSectorMap(map);
        }
        } catch (e) {
          // silently ignore
        }
      };
      fetchBlockSectors();
    }, []);

  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  useEffect(() => {
    // Fetch projects for dropdown
    const fetchProjects = async () => {
      try {
        const { getEstateProjects } =
          await import("@/app/actions/StaffActions/ObpStatusAction/getEstateProjectsAction");
        const result = await getEstateProjects("");
        if (result.status === "success" && result.ApiData?.item1) {
          const projectsData = Array.isArray(result.ApiData.item1)
            ? result.ApiData.item1
            : [];
          setProjects(projectsData);
        } else {
          setProjectsError(result.message || "Failed to fetch projects");
        }
      } catch {
        setProjectsError("An error occurred while fetching projects");
      } finally {
        setLoadingProjects(false);
        setSelectedProjectId(""); // Ensure no project is selected by default
      }
    };

    fetchProjects();
  }, []);
  const handleCloseStatusTable = () => {
    if (onClose) {
      onClose();
    }
  };
  useEffect(() => {
    if (selectedProjectId) {
      // Reset project data and stages data when project changes
      setProjectData(null);
      setStagesData(null);
      setStagesError(null);

      // Fetch project status data and project name
      const fetchProjectData = async () => {
        try {
          const { getEstateProjectStatus } =
            await import("@/app/actions/StaffActions/ObpStatusAction/getEstateProjectStatusAction");

          const statusResult = await getEstateProjectStatus(
            selectedProjectId,
            "",
          );
          if (
            statusResult.status === "success" &&
            statusResult.ApiData?.item1?.[0]
          ) {
            const projectStatus = statusResult.ApiData.item1[0];

            const project = projects.find(
              (p: any) => p.projectId === parseInt(selectedProjectId),
            );
            if (project) {
              projectStatus.projectName =
                project.projectName ||
                project.name ||
                `Project ${selectedProjectId}`;
            }
            setProjectData(projectStatus);
          }
        } catch {
        }
      };

      // Fetch stages data
      const fetchStagesData = async () => {
        setLoadingStages(true);
        try {
          const stagesResult =
            await getProjectWiseStagesStatus(selectedProjectId);
          if (stagesResult.status === "success") {
            if (stagesResult.ApiData && !stagesResult.ApiData.item1) {
              // Fallback: direct array in ApiData
              setStagesData({ item1: stagesResult.ApiData });
            } else if (stagesResult.ApiData?.item1) {
              if (Array.isArray(stagesResult.ApiData.item1)) {
                // Direct array format: item1 is already an array
                setStagesData({ item1: stagesResult.ApiData.item1 });
              } else if (typeof stagesResult.ApiData.item1 === 'object') {
                // Object format: item1 is an object with range keys, each containing arrays
                const allItems = Object.values(stagesResult.ApiData.item1).flat();
                setStagesData({ item1: allItems });
              }
            }
          } else {
            setStagesError(
              stagesResult.message || "Failed to fetch stages data",
            );
          }
        } catch {
          setStagesError("An error occurred while fetching stages data");
        } finally {
          setLoadingStages(false);
        }
      };

      fetchProjectData();
      fetchStagesData();
    }
  }, [selectedProjectId, projects]);

  const fixedSteps: BaseStep[] = useMemo(() => {
    // Parse rights from userRights.rights or architectureDrawingRemarks
    // Format: "1,1,1A,0B,1" - Position 0: Project Info, 1: Drawing, 2: Structure Drawing, 3: Verification, 4: Approval
    const architectureRemarks = projectData?.architectureDrawingRemarks || "";
    const drawingRights: ArchitectureDrawingRights = getDrawingRights(null, architectureRemarks);

    // console.log("Table - architectureRemarks:", architectureRemarks);
    // console.log("Table - drawingRights:", drawingRights);

    const base: BaseStep[] = [
      { sNo: "1", label: "Go Ahead Date / Completion Date", isSubStep: false },
      { sNo: "2", label: "Location", isSubStep: false },
      { sNo: "3", label: "Architect Drawing", isSubStep: false },
      { sNo: "4", label: "Structure Drawing", isSubStep: false },
      {
        sNo: "5",
        label: "Verification of Structure and Architect Drawing",
        isSubStep: false,
      },
      {
        sNo: "6",
        label: "Metrics and its stages for (Project Name)",
        isSubStep: false,
        hasSubSteps: true,
      },
      // {
      //   sNo: "7",
      //   label: "New Contractor Work / Under Civil Supervision",
      //   isSubStep: false,
      //   hasSubSteps: true,
      // },
    ];

    // Filter base steps based on rights
    // Step 1 & 2: Project Info - show if hasProjectInfo
    // Step 3: Architect Drawing - show if hasDrawingSection
    // Step 4: Structure Drawing - show if hasStructureDrawing
    // Step 5: Verification - show if hasVerification
    // Step 6: Metrics - show if hasDrawingSection (since it relates to drawings)

    // If no rights are defined (empty string), show all sections
    const hasAnyRights = drawingRights.hasProjectInfo || drawingRights.hasDrawingSection || drawingRights.hasStructureDrawing || drawingRights.hasVerification;

    const filteredBase = hasAnyRights ? base.filter(step => {
      const sNo = step.sNo;
      if (sNo === "1" || sNo === "2") {
        // Project Info sections
        return drawingRights.hasProjectInfo;
      }
      if (sNo === "3") {
        // Architect Drawing
        return drawingRights.hasDrawingSection;
      }
      if (sNo === "4") {
        // Structure Drawing
        return drawingRights.hasStructureDrawing;
      }
      if (sNo === "5") {
        // Verification
        return drawingRights.hasVerification;
      }
      if (sNo === "6") {
        // Metrics - show if hasDrawingSection
        return drawingRights.hasDrawingSection;
      }
      return true;
    }) : base;

    // If no steps pass the rights filter, return empty array
    if (filteredBase.length === 0) {
      return [];
    }
    // Use dynamic substeps from stagesData API, grouped by division
    let subSteps: SubStep[] = [];

    if (stagesData?.item1 && Array.isArray(stagesData.item1)) {
       // Group stages by metricId
      const groupedMetrics: Record<string, MetricData> = stagesData.item1.reduce(
        (
          acc: Record<string, MetricData>,
          item: any,
        ) => {
          const metricId = String(item.metricId);

          // For items with metricId: 0, create unique keys based on drawing number to prevent grouping
          const key = metricId === '0' ? `${metricId}_${item.drawingNo || 'na'}` : metricId;

          if (!acc[key]) {
            acc[key] = {
              metricDescription: item.metricDescription,
              stages: [],
              endDate: item.endDate,
              drawingNumber: item.drawingNo || "",
              hasArchitect: false,
              divisionId: item.divisionId,
              architectureIssueDate: item.architectureIssueDate || "",
              metricId: item.metricId || "NA",
              stageAllocationId: item.stageAllocationid || "NA",
            };
          }
          // Check if this metric has architect stages
          if (item.divisionId === 59) {
            acc[key].hasArchitect = true;
          }
          // Set drawing number from any stage that has it
          if (item.drawingNo) {
            acc[key].drawingNumber = item.drawingNo;
          }
          // Include stage with its metric count
          acc[key].stages.push({
            description: item.stageDescription,
            stageMetricCount: item.stageMetricCount || 0,
          });
          // Update endDate to the latest
          if (new Date(item.endDate) > new Date(acc[key].endDate)) {
            acc[key].endDate = item.endDate;
          }
          return acc;
        },
        {},
      );

      // console.log('Metrics and Stages (grouped):', groupedMetrics);
      // console.log('Raw stagesData items:', stagesData.item1);

      // Define division order and names
      const allDivisions = Array.from(new Set(stagesData.item1.map((item: any) => item.divisionId))).sort((a, b) => (a as number) - (b as number));
      const divisionOrder = allDivisions.filter(id => id !== 59); // Exclude Architecture (59)

      // Console log count of metrics with metricId: 0
      const metricIdZeroCount = stagesData.item1.filter((item: any) => item.metricId === 0).length;
      // const divisionOrder = allDivisions; // Include all divisions
      const divisionNames = {
        38: "Civil",
        58: "Electrical",
        59: "Architecture",
        60: "IT",
        61: "IT Infra",
      };

    // Find matching drawing numbers between Civil and Architecture
    const civilMetrics = (Object.entries(groupedMetrics) as [string, MetricData][]).filter(
      ([metricId, data]) => data.divisionId === 38,
    );
    const architectureMetrics = (Object.entries(groupedMetrics) as [string, MetricData][]).filter(
      ([metricId, data]) => data.divisionId === 59,
    );
    const matchingDrawingNumbers = new Set<string>();
    civilMetrics.forEach(([civilMetricId, civilData]: [string, any]) => {
      architectureMetrics.forEach(([archMetricId, archData]: [string, any]) => {
        if (
          civilData.drawingNumber &&
          archData.drawingNumber &&
          civilData.drawingNumber === archData.drawingNumber
        ) {
          matchingDrawingNumbers.add(civilData.drawingNumber);
        }
      });
    });

        let subStepIndex = 1;
      for (const divId of divisionOrder) {
        const metricsForDiv = Object.entries(groupedMetrics).filter(
          ([metricId, data]: [string, any]) => (data as any).divisionId === divId,
        );
        if (metricsForDiv.length > 0) {
          // Add division header
          subSteps.push({
            sNo: `6.${subStepIndex}`,
            label: divisionNames[divId as keyof typeof divisionNames],
            isSubStep: true,
            isDivisionHeader: true,
            divisionId: divId as number
          });
          subStepIndex++;
          // Add metrics for this division - only if department is expanded
          for (const [metricId, data] of metricsForDiv) {
            // Skip adding metrics if department is not expanded
            if (!expandedDepartments.has(divId as number)) {
              continue;
            }

            // For metricId = 0, show drawing number clearly in the l   abel
            let metricLabel = '';
            if (metricId.startsWith('0_')) {
              // This is a metricId = 0 entry with drawing number
              const drawingNo = metricId.replace('0_', '');
              metricLabel = `Metric ID: 0 (Drawing No: ${drawingNo}) - Description: ${data.metricDescription || 'NA'}`;
            } else {
              metricLabel = `Metric ID: ${metricId} - Description: ${data.metricDescription}`;
            }

            subSteps.push({
              sNo: `6.${subStepIndex}`,
              label: metricLabel,
              isSubStep: true,
              metricId,
              divisionId: divId as number,
            });
            subStepIndex++;
            // Only add stages if:
            // 1. The department is expanded (showing metrics), AND
            // 2. Either the individual metric is expanded OR all metrics in department are expanded
            const allMetricsExpanded = metricsForDiv.every(([mid]: [string, any]) => expandedMetrics.has(mid));
            if (expandedMetrics.has(metricId) || (expandedDepartments.has(divId as number) && allMetricsExpanded)) {
              data.stages.forEach((stage: { description: string; stageMetricCount: number }, index: number) => {
                subSteps.push({
                  sNo: `7.${subStepIndex}`,
                  label: `Stage ${index + 1}: ${stage.description}`,
                  isSubStep: true,
                  metricId,
                  divisionId: divId as number,
                  stageMetricCount: stage.stageMetricCount,
                });
                subStepIndex++;
              });
            }
          }
        }
      }
    } else if (projectData?.subSteps && Array.isArray(projectData.subSteps)) {
      subSteps = projectData.subSteps.map((label: any) => ({ label }));
    }

    const subStepObjects = subSteps.map((item, index: number) => ({
      sNo: `6.${index + 1}`,
      label: item.label,
      isSubStep: true,
      metricId: (item as SubStep).metricId,
      isDivisionHeader: (item as SubStep).isDivisionHeader,
      divisionId: (item as SubStep).divisionId,
      stageMetricCount: (item as SubStep).stageMetricCount,
    }));
    const result = [...filteredBase, ...subStepObjects];
    return result;
  }, [projectData, stagesData, expandedMetrics, expandedDepartments]);

  // Create dynamic data based on projectData and fixedSteps
  const dynamicData = useMemo(() => {
    if (!selectedProjectId) return [];
    let groupedMetrics: GroupedMetrics = {};
    if (stagesData?.item1 && Array.isArray(stagesData.item1)) {
      groupedMetrics = stagesData.item1.reduce(
        (
          acc: GroupedMetrics,
          item: any,
        ) => {
          const metricId = String(item.metricId);
          // For items with metricId: 0, create unique keys based on drawing number to prevent grouping
          const key = metricId === '0' ? `${metricId}_${item.drawingNo || 'na'}` : metricId;
          // console.log('Processing item - metricId:', metricId, 'drawingNo:', item.drawingNo, 'key:', key);
          if (!acc[key]) {
            // console.log('Creating new group for key:', key, 'with drawingNumber:', item.drawingNo);
            acc[key] = {
              metricDescription: item.metricDescription,
              stages: [],
              endDate: item.endDate,
              drawingNumber: item.drawingNo || "",
              hasArchitect: false,
              divisionId: item.divisionId,
              architectureIssueDate: item.architectureIssueDate || "",
              metricId: item.metricId || "NA",
              stageAllocationId: item.stageAllocationId || "NA",
            };
          }
          // Always update drawingNumber if current item has one
          if (item.drawingNo) {
            // console.log('Updating drawingNumber for key:', key, 'to:', item.drawingNo);
            acc[key].drawingNumber = item.drawingNo;
          }
          // Check if this metric has architect stages
          if (item.divisionId === 59) {
            acc[key].hasArchitect = true;
          }
          // Include all stages
          acc[key].stages.push({
            description: item.stageDescription,
            stageMetricCount: item.stageMetricCount || 0,
          });
          // Update endDate to the latest
          if (new Date(item.endDate) > new Date(acc[key].endDate)) {
            acc[key].endDate = item.endDate;
          }
          return acc;
        },
        {},
      );
    }

    // Find matching drawing numbers between Civil and Architecture
    const civilMetrics = (Object.entries(groupedMetrics) as [string, MetricData][]).filter(
      ([metricId, data]) => data.divisionId === 38,
    );
    const architectureMetrics = (Object.entries(groupedMetrics) as [string, MetricData][]).filter(
      ([metricId, data]) => data.divisionId === 59,
    );
    const matchingDrawingNumbers = new Set<string>();
    civilMetrics.forEach(([civilMetricId, civilData]: [string, any]) => {
      architectureMetrics.forEach(([archMetricId, archData]: [string, any]) => {
        if (
          civilData.drawingNumber &&
          archData.drawingNumber &&
          civilData.drawingNumber === archData.drawingNumber
        ) {
          matchingDrawingNumbers.add(civilData.drawingNumber);
        }
      });
    });

    return fixedSteps.map((step, index) => {
      const isSubStep = step.isSubStep;
      if (isSubStep) {
        const subStepIndex = index - 7; // Substeps start from index 7
        const isMetricRow = step.label.startsWith("Metric ID:");
        const isStageRow = step.label.startsWith("Stage");

        let architect = { statusOfDrawing: "", startDate: "", endDate: "" };
        let electrical: any = { startDate: "", endDate: "", stageCompleteDate: "", status: "" };
        let civilHandover: any = { startDate: "", endDate: "", stageCompleteDate: "", status: "" };
        let it: any = { startDate: "", endDate: "", stageCompleteDate: "", status: "" };
        let itInfra: any = { startDate: "", endDate: "", stageCompleteDate: "", status: "" };
        let nottingSheet = "";
        let drawingNumber = "";
        let architectureIssueDate = "";
        let endDate = "";
        let departmentWiseSteps = step.label;
        let stageItem: any = null;
        let notingSheetId = "";
        let metricIdNum = 0;

        let totalFollowupCount = 0;
        let fileUpload = "";
        let fileUploadFolder = "";
        let engineerName = "";

          if (isMetricRow) {
           // Extract metricId from label - handle both numeric IDs and 0_drawing prefix
           // Format: "Metric ID: 0 (Drawing No: 02523) - Description: ..." or "Metric ID: 123 - Description: ..."
           const metricIdMatch = step.label.match(/Metric ID:\s*([\d_]+)(?:\s*\(Drawing No:\s*([^\)]+)\))?/);
          if (metricIdMatch) {
            let metricId = metricIdMatch[1];
            const drawingNoFromLabel = metricIdMatch[2];
            // If metricId is 0 and we have a drawing number from label, combine them
            if (metricId === '0' && drawingNoFromLabel) {
              metricId = `0_${drawingNoFromLabel}`;
            }
            // console.log('Looking up groupedMetrics for metricId:', metricId);
            // console.log('groupedMetrics keys:', Object.keys(groupedMetrics));
            const metricData = groupedMetrics[metricId];
            // console.log('Found metricData:', metricData);
            if (metricData) {
              // Calculate total followup count for all stages under this metric
              totalFollowupCount = metricData.stages.reduce(
                (sum: number, stage: { stageMetricCount: number }) => sum + (stage.stageMetricCount || 0),
                0
              );

              // Debug log for total followup count calculation

              // Set drawing number for all metrics
              drawingNumber = metricData.drawingNumber;
              architectureIssueDate = metricData.architectureIssueDate
                ? new Date(metricData.architectureIssueDate).toLocaleDateString()
                : "";
              // If drawingNumber is empty, try to extract from metricDescription
              if (!drawingNumber) {
                const drawingMatch = metricData.metricDescription.match(
                  /Drawing No\.?\s*([^,\s]+)/,
                );
                drawingNumber = drawingMatch ? drawingMatch[1] : "";
              }
              // For metricId=0, also try to extract drawing number from the metricId key (e.g., "0_02523")
              if (!drawingNumber && metricId.startsWith('0_')) {
                drawingNumber = metricId.replace('0_', '');
              }
              // console.log('Final drawingNumber for metricId', metricId, ':', drawingNumber);
              // Keep drawing number in statusOfDrawing and show end date in dates cell
              architect.statusOfDrawing = drawingNumber;

              // Get all stages for this metric to find first startDate and last endDate
              // Handle metricId=0 with drawing number prefix (e.g., "0_02523")
              metricIdNum = metricId.startsWith('0_') ? 0 : parseInt(metricId);
              const metricStages = stagesData?.item1?.filter(
                (item: any) => item.metricId === metricIdNum,
              );

              if (metricStages && metricStages.length > 0) {
                // Find the earliest startDate (first stage)
                const startDates = metricStages
                  .map((s: any) => s.startDate ? new Date(s.startDate) : null)
                  .filter((d: Date | null) => d !== null) as Date[];
                const earliestStartDate = startDates.length > 0
                  ? new Date(Math.min(...startDates.map(d => d.getTime())))
                  : null;

                // Find the latest endDate (last stage)
                const endDates = metricStages
                  .map((s: any) => s.endDate ? new Date(s.endDate) : null)
                  .filter((d: Date | null) => d !== null) as Date[];
                const latestEndDate = endDates.length > 0
                  ? new Date(Math.max(...endDates.map(d => d.getTime())))
                  : null;

                const formattedStartDate = earliestStartDate
                  ? earliestStartDate.toLocaleDateString()
                  : "";
                const formattedEndDate = latestEndDate
                  ? latestEndDate.toLocaleDateString()
                  : "";

                // Compute overall metric status and complete date from all stages
                const allStagesDone =
                  metricStages.length > 0 &&
                  metricStages.every(
                    (item: any) => item.actionStatus?.toLowerCase() === "done"
                  );
                const metricStatus = allStagesDone ? "done" : "";
                const latestCompleteDate = metricStages
                  .map((s: any) => s.stageCompleteDate || s.StageCompleteDate || "")
                  .filter(Boolean)
                  .pop() || "";

                // Set start and end dates based on divisionId
                const metricDivisionId = metricData.divisionId;
                if (metricDivisionId === 38) {
                  // Civil
                  civilHandover = {
                    startDate: formattedStartDate,
                    endDate: formattedEndDate,
                    stageCompleteDate: latestCompleteDate,
                    status: metricStatus,
                  };
                } else if (metricDivisionId === 58) {
                  // Electrical
                  electrical = {
                    startDate: formattedStartDate,
                    endDate: formattedEndDate,
                    stageCompleteDate: latestCompleteDate,
                    status: metricStatus,
                  };
                } else if (metricDivisionId === 59) {
                  // Architecture
                  architect.startDate = formattedStartDate;
                  architect.endDate = formattedEndDate;
                } else if (metricDivisionId === 60) {
                  it = {
                    startDate: formattedStartDate,
                    endDate: formattedEndDate,
                    stageCompleteDate: latestCompleteDate,
                    status: metricStatus,
                  };
                } else if (metricDivisionId === 61) {
                  itInfra = {
                    startDate: formattedStartDate,
                    endDate: formattedEndDate,
                    stageCompleteDate: latestCompleteDate,
                    status: metricStatus,
                  };
                }
              }

              // For civil metrics with matching drawing numbers, set end date from architecture
              if (
                metricData.divisionId === 38 &&
                matchingDrawingNumbers.has(drawingNumber)
              ) {
                // Find the architecture metric with the same drawing number
                const archMetric = Object.values(groupedMetrics).find(
                  (m) =>
                    m.divisionId === 59 && m.drawingNumber === drawingNumber,
                );
                if (archMetric) {
                  architect.endDate = archMetric.endDate
                    ? new Date(archMetric.endDate).toLocaleDateString()
                    : "";
                }
              } else if (metricData.hasArchitect && metricData.divisionId !== 59) {
                // Only set end date for architect metrics (divisionId 59) if not already set
                architect.endDate = metricData.endDate
                  ? new Date(metricData.endDate).toLocaleDateString()
                  : "";
              }
              // Set noting sheet from any stage in the metric
              const firstStageMetricId = metricId.startsWith('0_') ? 0 : parseInt(metricId);
              const firstStage = stagesData?.item1?.find(
                (item: any) => item.metricId === firstStageMetricId,
              );
              if (firstStage) {
                nottingSheet = firstStage.notingSheetStatus || "";
                fileUpload = firstStage.fileUpload || "";
                fileUploadFolder = firstStage.folderName || projectData?.folderName || "";
              }

              // Extract notingSheetId and metricId from firstStage
              notingSheetId = firstStage?.notingSheetId?.toString() || "";
              metricIdNum = metricId.startsWith('0_') ? 0 : parseInt(metricId);
            }
          }
          departmentWiseSteps = `<strong>${step.label}</strong>`;
        }

        if (isStageRow) {
          // Find the corresponding stageItem from stagesData
          // Since substeps are flattened, we need to find the matching stage
          const match = step.label.match(/Stage (\d+): (.+)/);
          const stageDescription = match ? match[2] : step.label;



          const stageItem = stagesData?.item1?.find(
            (item: any) =>
              (item.stageDescription === stageDescription ||
                item.stageDescription === step.label) &&
              // Handle metricId=0 with drawing number prefix (e.g., "0_02523")
              item.metricId === (step.metricId?.startsWith('0_') ? 0 : parseInt(step.metricId!)),
          );


          if (stageItem) {
            const divisionId = stageItem.divisionId;
            const startDate = stageItem.startDate
              ? new Date(stageItem.startDate).toLocaleDateString()
              : "";
            const endDate = stageItem.endDate
              ? new Date(stageItem.endDate).toLocaleDateString()
              : "";
            const actionStatus = stageItem.actionStatus || "";
            const stageCompleteDate = stageItem.stageCompleteDate || stageItem.StageCompleteDate || "";

            // Set metricIdNum from the found stageItem
            metricIdNum = stageItem.metricId;

            // Set fileUpload and engineerName from stageItem
            fileUpload = stageItem.fileUpload || "";
            fileUploadFolder = stageItem.folderName || projectData?.folderName || "";
            engineerName = stageItem.engineerName || "";

            if (divisionId === 38) {
              civilHandover = { startDate, endDate, stageCompleteDate, status: actionStatus.toLowerCase() };
              departmentWiseSteps = step.label;
            } else if (divisionId === 58) {
              electrical = { startDate, endDate, stageCompleteDate, status: actionStatus.toLowerCase() };
              departmentWiseSteps = step.label;
            } else if (divisionId === 59) {
              architect = { statusOfDrawing: actionStatus, startDate, endDate };
              departmentWiseSteps = step.label;
            } else if (divisionId === 60) {
              it = { startDate, endDate, stageCompleteDate, status: actionStatus.toLowerCase() };
              departmentWiseSteps = step.label;
            } else if (divisionId === 61) {
              itInfra = { startDate, endDate, stageCompleteDate, status: actionStatus.toLowerCase() };
              departmentWiseSteps = step.label;
            } else {
              departmentWiseSteps = step.label;
            }
            nottingSheet = ""; // Do not show noting sheet for stages
          }
        }

        return {
          sNo: step.sNo,
          steps: "",
          architect,
          departmentWiseSteps,
          nottingSheet,
          civilHandover,
          electrical,
          it,
          itInfra,
          drawingNumber,
          architectureIssueDate,
          endDate,
          notingSheetId,
          metricId: metricIdNum,
          stageMetricCount: step.stageMetricCount || 0,
          totalFollowupCount: totalFollowupCount,
          fileUpload: fileUpload,
          fileUploadFolder: fileUploadFolder,
          engineerName: engineerName,
        };
      } else {
        const stepIndex = parseInt(step.sNo) - 1;
        // Map API status fields to steps - status should come from API, not default
        // API fields: goAheaddate, completionDate, location, architectureDrawing, structureDrawing, verifyArchStructure
        const mainStepsData = [
          {
            sNo: "1",
            steps: "Go Ahead Date & Completion Date",
            architect: {
              // Step 1 is about dates - status should come from the date fields in the Dates column
              statusOfDrawing: "",
              startDate: projectData?.goAheaddate || "",
              endDate: projectData?.completionDate || "",
            },
            departmentWiseSteps: "",
          },
          {
            sNo: "2",
            steps: "Location",
            architect: {
              statusOfDrawing: projectData?.locationRemarks || "",
              startDate: "",
              endDate: "",
            },
            // Don't show location remarks in department wise steps - it's already shown in status
            departmentWiseSteps: "",
            blockSector: blockSectorMap[projectData?.blockSector?.trim()] || projectData?.blockSector || "",
            surrounding: projectData?.surrounding || "",
            locationEmployeeName: projectData?.employeeName || "",
            locationDateTime: projectData?.locationDateTime || "",
          },
          {
            sNo: "3",
            steps: "Architect Drawing",
            architect: {
              statusOfDrawing: projectData?.architectureDrawing || "",
              startDate: "",
              endDate: "",
            },
            departmentWiseSteps: "",
          },
          {
            sNo: "4",
            steps: "Structure Drawing",
            architect: {
              statusOfDrawing: projectData?.structureDrawing || "",
              startDate: "",
              endDate: "",
            },
            departmentWiseSteps: "",
          },
          {
            sNo: "5",
            steps: "verification of structure and architect drawing",
            architect: {
              statusOfDrawing: projectData?.verifyArchStructure || "",
              startDate: "",
              endDate: "",
            },
            departmentWiseSteps: "",
          },
          {
            sNo: "6",
            steps: "final drawing issue to civil deptt",
            architect: {
              statusOfDrawing: projectData?.finalDrawing || "",
              startDate: "",
              endDate: "",
            },
            departmentWiseSteps: "",
            drawingNo: stagesData?.item1?.[0]?.metricDescription
              ? stagesData.item1[0].metricDescription.match(
                  /Drawing No\.?\s*([^,\s]+)/,
                )?.[1] || ""
              : "",
          },
          {
            sNo: "7",
            steps: "new contractor work/under civil supervision",
            architect: {
              statusOfDrawing: "",
              startDate: "",
              endDate: "",
            },
            departmentWiseSteps: "",
          },
        ];

        const mainStepData = mainStepsData[stepIndex] || {
          sNo: step.sNo,
          steps: step.label,
          architect: {
            statusOfDrawing: "",
            startDate: "",
            endDate: "",
          },
          departmentWiseSteps: "",
        };

        return {
          ...mainStepData,
          civilHandover: {
            startDate: "",
            endDate: "",
            status: "" as 'done' | 'pending' | '',
          },
          electrical: {
            startDate: "",
            endDate: "",
            status: "" as 'done' | 'pending' | '',
          },
          it: { startDate: "", endDate: "", status: "" as 'done' | 'pending' | '' },
          itInfra: { startDate: "", endDate: "", status: "" as 'done' | 'pending' | '' },
          stageMetricCount: (step as any).stageMetricCount ?? 0,
          folderName: projectData?.folderName || "",
          fileName: projectData?.fileName || "",
          fileUpload: stagesData?.item1?.[0]?.fileUpload || "",
          employeeName: projectData?.approvalName || projectData?.employeeName || "",
          structureDrawingDateTime: projectData?.structureDrawingDateTime || "",
          nottingSheet: "",
          drawingNumber: "",
          endDate: "",
          notingSheetId: "",
          metricId: 0,
          engineerName: "",
        };
      }
    });
  }, [projectData, fixedSteps, stagesData, blockSectorMap]);

  // Fetch chat messages for a stage
  const fetchChatMessages = async (
    StageAllocationid: string | number,
    MetricId: string | number
  ) => {
    setLoadingChat(true);
    try {
      const result = await getOBPConstructionFollowUpChatMessages(
        loginName,
        StageAllocationid,
        MetricId
      );
      if (result.status === "success" && result.ApiData) {
        // API response structure: { item1: [...] }
        const messages = result.ApiData.item1 || [];
        setChatMessages(Array.isArray(messages) ? messages : []);
      } else {
        setChatMessages([]);
      }
    } catch {
      setChatMessages([]);
    } finally {
      setLoadingChat(false);
    }
  };

  // Handle chat button click in stage rows
  const handleChatClick = useCallback(async (metricId: number, stageDescription: string) => {
    // Find the stage item from stagesData
    const stageItem = stagesData?.item1?.find(
      (item: any) => item.metricId === metricId && item.stageDescription === stageDescription
    );

    if (stageItem) {
      setSelectedMetricData({
        metricId: String(stageItem.metricId),
        metricDescription: stageItem.metricDescription,
        drawingNumber: stageItem.drawingNo,
        endDate: stageItem.endDate,
      });
      setSelectedStageData({
        stageAllocationid: String(stageItem.stageAllocationid || ''),
        stageId: String(stageItem.stageId || stageItem.metricId),
        stageDescription: stageItem.stageDescription,
        startDate: stageItem.startDate,
        endDate: stageItem.endDate,
        actionStatus: stageItem.actionStatus,
      });
      setSelectedUid(String(stageItem.metricId));

      // Fetch chat messages from API
      const stageAllocationid = stageItem.stageAllocationid || stageItem.stageId || 0;

      // Clear previous chat messages before fetching new ones to prevent stale data
      setChatMessages([]);

      fetchChatMessages(stageAllocationid, metricId).then(() => {
        setChatModalOpen(true);
      });
    }
  }, [stagesData]);

  const handleArchitectChatClick = useCallback((metricId: number, drawingNo: string) => {
    const stageItem = metricId === 0
      ? stagesData?.item1?.find((item: any) => item.divisionId === 59)
      : stagesData?.item1?.find((item: any) => item.metricId === metricId);

    setSelectedArchitectDrawing({
      metricId: String(metricId),
      metricDescription: stageItem?.metricDescription || (metricId === 0 ? `Architect Drawing — ${projectData?.projectName || ''}` : drawingNo),
      drawingNumber: drawingNo || stageItem?.drawingNo || '',
      endDate: stageItem?.endDate || '',
      stageAllocationId: String(stageItem?.stageAllocationid || stageItem?.stageId || ''),
    });

    setArchitectChatModalOpen(true);
  }, [stagesData, projectData]);

  const projectName = projectData?.projectName || projects.find(p => p.projectId.toString() === selectedProjectId)?.projectName || '';
  // const employeeName = projectData?.employeeName || ''; // Commented out as per requirement

  const columns = getColumns(fixedSteps, projectName, '', handleChatClick, handleArchitectChatClick);

  const table = useReactTable({
    data: dynamicData as unknown as OBPProjectData[],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 1000,
      },
    },
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  // Simple print function — plain table, no colors, no icons
  const printTable = () => {
    if (!selectedProjectId || !dynamicData.length) return;

    const projectName = projects.find(p => p.projectId.toString() === selectedProjectId)?.projectName || `Project ${selectedProjectId}`;

    const stripHtml = (html: string) => (html || '').replace(/<[^>]*>/g, '').trim();
    const fmtDate = (d: string) => {
      if (!d || d.toLowerCase() === 'na') return '';
      const dt = new Date(d);
      return isNaN(dt.getTime()) ? d : dt.toLocaleDateString();
    };

    const rows = dynamicData.map((row, i) => {
      const step = fixedSteps[i];
      const sNo = step?.sNo || '';
      const isSubStep = step?.isSubStep || false;
      const isDivisionHeader = step?.isDivisionHeader || false;
      const isMetricRow = isSubStep && !isDivisionHeader && (step?.label || '').startsWith('Metric ID:');
      const isStageRow = isSubStep && !isDivisionHeader && (step?.label || '').startsWith('Stage');

      // Steps column: empty for metric/stage sub-steps (they use rowSpan in UI);
      // division headers show their label; all other rows show their label
      const stepLabel = (isSubStep && !isDivisionHeader)
        ? ''
        : stripHtml(step?.label || '');

      const td = (val: string, extra = '') => `<td${extra}>${val}</td>`;

      // Architect Status column
      const architectStatus = (() => {
        if (i === 1) {
          // Location row: show blockSector + surrounding instead of raw status
          const blockSector = (row as any).blockSector || '';
          const surrounding = (row as any).surrounding || '';
          return [blockSector, surrounding].filter(Boolean).join(' | ');
        }
        const raw = stripHtml(row.architect?.statusOfDrawing || '');
        if (isMetricRow && raw) return `Drawing No. ${raw}`;
        return raw;
      })();

      // Architect Start/End: match what UI shows in the Dates column
      const archStart = (() => {
        // Location row: show employee name + datetime (UI shows these in Dates column)
        if (i === 1) {
          const emp = (row as any).locationEmployeeName || '';
          const dt = (row as any).locationDateTime || '';
          const fmtDt = dt ? new Date(dt).toLocaleString() : '';
          return [emp, fmtDt].filter(Boolean).join(' | ');
        }
        // Structure Drawing row: show employee name + datetime
        if (i === 3) {
          const rawEmp = (row as any).employeeName || '';
          const empDisplay = rawEmp.includes('::')
            ? rawEmp.split('::').map((s: string) => s.trim()).join(' | ')
            : rawEmp;
          const dt = (row as any).structureDrawingDateTime || '';
          const fmtDt = dt ? new Date(dt).toLocaleString() : '';
          return [empDisplay, fmtDt].filter(Boolean).join(' | ');
        }
        // Metric rows: prefer architectureIssueDate (shown as "Issue Date" in UI)
        if (isMetricRow) {
          const issueDate = (row as any).architectureIssueDate || '';
          if (issueDate && issueDate.toLowerCase() !== 'na') return `Issue Date: ${issueDate}`;
        }
        return fmtDate(row.architect?.startDate || '');
      })();

      // Dept. Wise Steps: match what UI shows
      const deptSteps = (() => {
        if (isDivisionHeader) return '';
        const base = stripHtml(row.departmentWiseSteps || '');
        if (isMetricRow) {
          const followup = (row as any).totalFollowupCount || 0;
          return followup > 0 ? `${base} [Follow Up: ${followup}]` : base;
        }
        if (isStageRow) {
          const engineerName = (row as any).engineerName || '';
          return engineerName ? `${base} (${engineerName})` : base;
        }
        return base;
      })();

      return `<tr>
        ${td(sNo)}
        ${td(stepLabel)}
        ${td(architectStatus)}
        ${td(archStart)}
        ${td(fmtDate(row.architect?.endDate || ''))}
        ${td(deptSteps)}
        ${td(stripHtml((row as any).nottingSheet || ''))}
        ${td(fmtDate(row.civilHandover?.startDate || ''))}
        ${td(fmtDate(row.civilHandover?.endDate || ''))}
        ${td(fmtDate((row.civilHandover as any)?.stageCompleteDate || ''))}
        ${td(stripHtml(row.civilHandover?.status || ''))}
        ${td(fmtDate(row.electrical?.startDate || ''))}
        ${td(fmtDate(row.electrical?.endDate || ''))}
        ${td(fmtDate((row.electrical as any)?.stageCompleteDate || ''))}
        ${td(stripHtml(row.electrical?.status || ''))}
        ${td(fmtDate(row.it?.startDate || ''))}
        ${td(fmtDate(row.it?.endDate || ''))}
        ${td(fmtDate((row.it as any)?.stageCompleteDate || ''))}
        ${td(stripHtml(row.it?.status || ''))}
        ${td(fmtDate(row.itInfra?.startDate || ''))}
        ${td(fmtDate(row.itInfra?.endDate || ''))}
        ${td(fmtDate((row.itInfra as any)?.stageCompleteDate || ''))}
        ${td(stripHtml(row.itInfra?.status || ''))}
      </tr>`;
    }).join('');

    const th = (label: string, extra = '') => `<th ${extra}>${label}</th>`;

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Project Status - ${projectName}</title>
  <style>
    @page { size: landscape; margin: 0.4in; }
    body { font-family: Arial, sans-serif; font-size: 8px; margin: 0; padding: 8px; }
    h2 { text-align: center; font-size: 12px; margin: 0 0 8px 0; }
    table { width: 100%; border-collapse: collapse; table-layout: fixed; }
    th, td {
      border: 1px solid #000;
      padding: 2px 4px;
      text-align: left;
      vertical-align: top;
      word-wrap: break-word;
      font-size: 8px;
    }
    thead tr:first-child th { font-size: 9px; font-weight: bold; text-align: center; }
    thead tr:last-child th { font-size: 7.5px; font-weight: bold; text-align: center; }
    /* Bold outer borders for each department group — group header row */
    thead tr:first-child th.dept-header { border-left: 2.5px solid #000; border-right: 2.5px solid #000; }
    /* Architect sub-cols: positions 1–3 in last header row */
    thead tr:last-child th:nth-child(1)  { border-left: 2.5px solid #000; }
    thead tr:last-child th:nth-child(3)  { border-right: 2.5px solid #000; }
    /* Civil sub-cols: 4–7 */
    thead tr:last-child th:nth-child(4)  { border-left: 2.5px solid #000; }
    thead tr:last-child th:nth-child(7)  { border-right: 2.5px solid #000; }
    /* Electrical sub-cols: 8–11 */
    thead tr:last-child th:nth-child(8)  { border-left: 2.5px solid #000; }
    thead tr:last-child th:nth-child(11) { border-right: 2.5px solid #000; }
    /* IT sub-cols: 12–15 */
    thead tr:last-child th:nth-child(12) { border-left: 2.5px solid #000; }
    thead tr:last-child th:nth-child(15) { border-right: 2.5px solid #000; }
    /* IT Infra sub-cols: 16–19 */
    thead tr:last-child th:nth-child(16) { border-left: 2.5px solid #000; }
    thead tr:last-child th:nth-child(19) { border-right: 2.5px solid #000; }
    /* Body td bold borders — Architect: 3–5, Civil: 8–11, Electrical: 12–15, IT: 16–19, IT Infra: 20–23 */
    tbody tr td:nth-child(3)  { border-left: 2.5px solid #000; }
    tbody tr td:nth-child(5)  { border-right: 2.5px solid #000; }
    tbody tr td:nth-child(8)  { border-left: 2.5px solid #000; }
    tbody tr td:nth-child(11) { border-right: 2.5px solid #000; }
    tbody tr td:nth-child(12) { border-left: 2.5px solid #000; }
    tbody tr td:nth-child(15) { border-right: 2.5px solid #000; }
    tbody tr td:nth-child(16) { border-left: 2.5px solid #000; }
    tbody tr td:nth-child(19) { border-right: 2.5px solid #000; }
    tbody tr td:nth-child(20) { border-left: 2.5px solid #000; }
    tbody tr td:nth-child(23) { border-right: 2.5px solid #000; }
    colgroup col:nth-child(1)  { width: 26px; }
    colgroup col:nth-child(2)  { width: 90px; }
    colgroup col:nth-child(3)  { width: 56px; }
    colgroup col:nth-child(4)  { width: 50px; }
    colgroup col:nth-child(5)  { width: 50px; }
    colgroup col:nth-child(6)  { width: 120px; }
    colgroup col:nth-child(7)  { width: 55px; }
    colgroup col:nth-child(8)  { width: 44px; }
    colgroup col:nth-child(9)  { width: 44px; }
    colgroup col:nth-child(10) { width: 44px; }
    colgroup col:nth-child(11) { width: 44px; }
    colgroup col:nth-child(12) { width: 44px; }
    colgroup col:nth-child(13) { width: 44px; }
    colgroup col:nth-child(14) { width: 44px; }
    colgroup col:nth-child(15) { width: 44px; }
    colgroup col:nth-child(16) { width: 44px; }
    colgroup col:nth-child(17) { width: 44px; }
    colgroup col:nth-child(18) { width: 44px; }
    colgroup col:nth-child(19) { width: 44px; }
    colgroup col:nth-child(20) { width: 44px; }
    colgroup col:nth-child(21) { width: 44px; }
    colgroup col:nth-child(22) { width: 44px; }
    colgroup col:nth-child(23) { width: 44px; }
    .no-print { text-align: center; margin-top: 14px; }
    @media print { .no-print { display: none; } }
  </style>
</head>
<body>
  <h2>Project Status — ${projectName}</h2>
  <table>
    <colgroup>
      <col/><col/><col/><col/><col/>
      <col/><col/><col/><col/><col/>
      <col/><col/><col/><col/><col/>
      <col/><col/><col/><col/><col/>
      <col/><col/><col/>
    </colgroup>
    <thead>
      <tr>
        ${th('S.No', 'rowspan="2"')}
        ${th('Steps', 'rowspan="2"')}
        ${th('Architect', 'colspan="3" class="dept-header"')}
        ${th('Dept. Wise Steps', 'rowspan="2"')}
        ${th('Noting Sheet', 'rowspan="2"')}
        ${th('Civil Handover', 'colspan="4" class="dept-header"')}
        ${th('Electrical', 'colspan="4" class="dept-header"')}
        ${th('IT', 'colspan="4" class="dept-header"')}
        ${th('IT Infra', 'colspan="4" class="dept-header"')}
      </tr>
      <tr>
        ${th('Status')}${th('Start')}${th('End')}
        ${th('Start')}${th('End')}${th('Complete')}${th('Status')}
        ${th('Start')}${th('End')}${th('Complete')}${th('Status')}
        ${th('Start')}${th('End')}${th('Complete')}${th('Status')}
        ${th('Start')}${th('End')}${th('Complete')}${th('Status')}
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="no-print">
    <button onclick="window.print()" style="padding:5px 16px;margin-right:6px;cursor:pointer;">Print</button>
    <button onclick="window.close()" style="padding:5px 16px;cursor:pointer;">Close</button>
  </div>
</body>
</html>`;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Shared helpers for export functions
  const exportStripHtml = (html: string) => (html || '').replace(/<[^>]*>/g, '').trim();
  const exportFmtDate = (d: string) => {
    if (!d || d.toLowerCase() === 'na') return '';
    const dt = new Date(d);
    return isNaN(dt.getTime()) ? d : dt.toLocaleDateString();
  };
  const buildExportRow = (row: OBPProjectData, i: number): string[] => {
    const step = fixedSteps[i];
    const isSubStep = step?.isSubStep || false;
    const isDivisionHeader = step?.isDivisionHeader || false;
    const isMetricRow = isSubStep && !isDivisionHeader && (step?.label || '').startsWith('Metric ID:');
    const isStageRow = isSubStep && !isDivisionHeader && (step?.label || '').startsWith('Stage');

    const stepLabel = (isSubStep && !isDivisionHeader)
      ? ''
      : exportStripHtml(step?.label || '');

    const architectStatus = (() => {
      if (i === 1) {
        return [exportStripHtml((row as any).blockSector || ''), exportStripHtml((row as any).surrounding || '')].filter(Boolean).join(' | ');
      }
      const raw = exportStripHtml(row.architect?.statusOfDrawing || '');
      if (isMetricRow && raw) return `Drawing No. ${raw}`;
      return raw;
    })();

    const archStart = (() => {
      if (i === 1) {
        const emp = (row as any).locationEmployeeName || '';
        const dt = (row as any).locationDateTime || '';
        const fmtDt = dt ? new Date(dt).toLocaleString() : '';
        return [emp, fmtDt].filter(Boolean).join(' | ');
      }
      if (i === 3) {
        const rawEmp = (row as any).employeeName || '';
        const empDisplay = rawEmp.includes('::')
          ? rawEmp.split('::').map((s: string) => s.trim()).join(' | ')
          : rawEmp;
        const dt = (row as any).structureDrawingDateTime || '';
        const fmtDt = dt ? new Date(dt).toLocaleString() : '';
        return [empDisplay, fmtDt].filter(Boolean).join(' | ');
      }
      if (isMetricRow) {
        const issueDate = (row as any).architectureIssueDate || '';
        if (issueDate && issueDate.toLowerCase() !== 'na') return issueDate;
      }
      return exportFmtDate(row.architect?.startDate || '');
    })();

    const deptSteps = (() => {
      if (isDivisionHeader) return '';
      const base = exportStripHtml(row.departmentWiseSteps || '');
      if (isMetricRow) {
        const followup = (row as any).totalFollowupCount || 0;
        return followup > 0 ? `${base} [Follow Up: ${followup}]` : base;
      }
      if (isStageRow) {
        const engineerName = (row as any).engineerName || '';
        return engineerName ? `${base} (${engineerName})` : base;
      }
      return base;
    })();

    return [
      step?.sNo || '',
      stepLabel,
      architectStatus,
      archStart,
      exportFmtDate(row.architect?.endDate || ''),
      deptSteps,
      exportStripHtml((row as any).nottingSheet || ''),
      exportFmtDate(row.civilHandover?.startDate || ''),
      exportFmtDate(row.civilHandover?.endDate || ''),
      exportFmtDate((row.civilHandover as any)?.stageCompleteDate || ''),
      exportStripHtml(row.civilHandover?.status || ''),
      exportFmtDate(row.electrical?.startDate || ''),
      exportFmtDate(row.electrical?.endDate || ''),
      exportFmtDate((row.electrical as any)?.stageCompleteDate || ''),
      exportStripHtml(row.electrical?.status || ''),
      exportFmtDate(row.it?.startDate || ''),
      exportFmtDate(row.it?.endDate || ''),
      exportFmtDate((row.it as any)?.stageCompleteDate || ''),
      exportStripHtml(row.it?.status || ''),
      exportFmtDate(row.itInfra?.startDate || ''),
      exportFmtDate(row.itInfra?.endDate || ''),
      exportFmtDate((row.itInfra as any)?.stageCompleteDate || ''),
      exportStripHtml(row.itInfra?.status || ''),
    ];
  };

  // Download functions
  const downloadExcel = async () => {
    if (!selectedProjectId || !dynamicData.length) return;

    const projectName = projects.find(p => p.projectId.toString() === selectedProjectId)?.projectName || `Project ${selectedProjectId}`;
    const TOTAL_COLS = 23;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('OBP Status');

    // Column widths (matches print proportions)
    const colWidths = [6, 22, 14, 12, 12, 28, 14, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12];
    colWidths.forEach((w, i) => { worksheet.getColumn(i + 1).width = w; });

    // ── Row 1: Title ──
    worksheet.addRow([`Project Status - ${projectName}`]);
    worksheet.mergeCells(1, 1, 1, TOTAL_COLS);
    const titleCell = worksheet.getCell(1, 1);
    titleCell.value = `Project Status - ${projectName}`;
    titleCell.font = { bold: true, size: 12 };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getRow(1).height = 22;

    // ── Row 2: Group headers (with merges) ──
    worksheet.addRow([]);
    worksheet.getRow(2).height = 18;
    // S.No — rowspan rows 2-3, col 1
    worksheet.mergeCells(2, 1, 3, 1);
    worksheet.getCell(2, 1).value = 'S.No';
    // Steps — rowspan rows 2-3, col 2
    worksheet.mergeCells(2, 2, 3, 2);
    worksheet.getCell(2, 2).value = 'Steps';
    // Architect — colspan cols 3-5
    worksheet.mergeCells(2, 3, 2, 5);
    worksheet.getCell(2, 3).value = 'Architect';
    // Dept. Wise Steps — rowspan rows 2-3, col 6
    worksheet.mergeCells(2, 6, 3, 6);
    worksheet.getCell(2, 6).value = 'Dept. Wise Steps';
    // Noting Sheet — rowspan rows 2-3, col 7
    worksheet.mergeCells(2, 7, 3, 7);
    worksheet.getCell(2, 7).value = 'Noting Sheet';
    // Civil Handover — colspan cols 8-11
    worksheet.mergeCells(2, 8, 2, 11);
    worksheet.getCell(2, 8).value = 'Civil Handover';
    // Electrical — colspan cols 12-15
    worksheet.mergeCells(2, 12, 2, 15);
    worksheet.getCell(2, 12).value = 'Electrical';
    // IT — colspan cols 16-19
    worksheet.mergeCells(2, 16, 2, 19);
    worksheet.getCell(2, 16).value = 'IT';
    // IT Infra — colspan cols 20-23
    worksheet.mergeCells(2, 20, 2, 23);
    worksheet.getCell(2, 20).value = 'IT Infra';

    // ── Row 3: Sub-headers ──
    worksheet.addRow([]);
    worksheet.getRow(3).height = 16;
    const subHeaderMap: Record<number, string> = {
      3: 'Status', 4: 'Start', 5: 'End',
      8: 'Start', 9: 'End', 10: 'Complete', 11: 'Status',
      12: 'Start', 13: 'End', 14: 'Complete', 15: 'Status',
      16: 'Start', 17: 'End', 18: 'Complete', 19: 'Status',
      20: 'Start', 21: 'End', 22: 'Complete', 23: 'Status',
    };
    Object.entries(subHeaderMap).forEach(([col, label]) => {
      worksheet.getCell(3, parseInt(col)).value = label;
    });

    // ── Rows 4+: Data ──
    dynamicData.forEach((row, i) => {
      worksheet.addRow(buildExportRow(row, i));
    });

    // ── Apply borders and styles to all cells rows 2 onward ──
    // Dept boundary columns (1-indexed):
    const deptLeft  = new Set([3, 8, 12, 16, 20]);
    const deptRight = new Set([5, 11, 15, 19, 23]);

    const getCellBorder = (colNum: number): Partial<ExcelJS.Borders> => ({
      top:    { style: 'thin' },
      bottom: { style: 'thin' },
      left:   { style: deptLeft.has(colNum)  ? 'medium' : 'thin' },
      right:  { style: deptRight.has(colNum) ? 'medium' : 'thin' },
    });

    const totalRows = 3 + dynamicData.length;
    for (let r = 2; r <= totalRows; r++) {
      const excelRow = worksheet.getRow(r);
      for (let c = 1; c <= TOTAL_COLS; c++) {
        const cell = excelRow.getCell(c);
        cell.border = getCellBorder(c);
        if (r <= 3) {
          cell.font = { bold: true, size: 9 };
          cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        } else {
          cell.font = { size: 9 };
          cell.alignment = { vertical: 'top', wrapText: true };
        }
      }
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `OBP_Status_${projectName}_${new Date().toISOString().split('T')[0]}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    if (!selectedProjectId || !dynamicData.length) return;

    const projectName = projects.find(p => p.projectId.toString() === selectedProjectId)?.projectName || `Project ${selectedProjectId}`;
    const doc = new jsPDF('l', 'mm', 'a4');

    doc.setFontSize(11);
    doc.text(`Project Status - ${projectName}`, 148.5, 10, { align: 'center' });

    const tableData = dynamicData.map((row, i) => buildExportRow(row, i));

    // Dept boundary columns (0-indexed): left edges and right edges
    const pdfDeptLeft  = new Set([2, 7, 11, 15, 19]);
    const pdfDeptRight = new Set([4, 10, 14, 18, 22]);

    autoTable(doc, {
      head: [
        // Row 1 — group headers
        [
          { content: 'S.No',             rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
          { content: 'Steps',            rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
          { content: 'Architect',        colSpan: 3, styles: { halign: 'center' } },
          { content: 'Dept. Wise Steps', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
          { content: 'Noting Sheet',     rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
          { content: 'Civil Handover',   colSpan: 4, styles: { halign: 'center' } },
          { content: 'Electrical',       colSpan: 4, styles: { halign: 'center' } },
          { content: 'IT',               colSpan: 4, styles: { halign: 'center' } },
          { content: 'IT Infra',         colSpan: 4, styles: { halign: 'center' } },
        ],
        // Row 2 — sub-headers
        [
          { content: 'Status' }, { content: 'Start' }, { content: 'End' },
          { content: 'Start' }, { content: 'End' }, { content: 'Complete' }, { content: 'Status' },
          { content: 'Start' }, { content: 'End' }, { content: 'Complete' }, { content: 'Status' },
          { content: 'Start' }, { content: 'End' }, { content: 'Complete' }, { content: 'Status' },
          { content: 'Start' }, { content: 'End' }, { content: 'Complete' }, { content: 'Status' },
        ],
      ],
      body: tableData,
      startY: 15,
      styles: {
        fontSize: 5,
        cellPadding: 1.5,
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
        textColor: [0, 0, 0],
        fillColor: false,
      },
      headStyles: {
        fillColor: false,
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
      },
      columnStyles: {
        0:  { cellWidth: 7  },   // S.No
        1:  { cellWidth: 20 },   // Steps
        2:  { cellWidth: 13 },   // Arch Status
        3:  { cellWidth: 11 },   // Arch Start
        4:  { cellWidth: 11 },   // Arch End
        5:  { cellWidth: 26 },   // Dept Wise Steps
        6:  { cellWidth: 13 },   // Noting Sheet
        7:  { cellWidth: 10 },   // Civil Start
        8:  { cellWidth: 10 },   // Civil End
        9:  { cellWidth: 10 },   // Civil Complete
        10: { cellWidth: 12 },   // Civil Status
        11: { cellWidth: 10 },   // Elec Start
        12: { cellWidth: 10 },   // Elec End
        13: { cellWidth: 10 },   // Elec Complete
        14: { cellWidth: 12 },   // Elec Status
        15: { cellWidth: 10 },   // IT Start
        16: { cellWidth: 10 },   // IT End
        17: { cellWidth: 10 },   // IT Complete
        18: { cellWidth: 12 },   // IT Status
        19: { cellWidth: 10 },   // IT Infra Start
        20: { cellWidth: 10 },   // IT Infra End
        21: { cellWidth: 10 },   // IT Infra Complete
        22: { cellWidth: 12 },   // IT Infra Status
      },
      didDrawCell: (data) => {
        const col = data.column.index;
        const { x, y, width, height } = data.cell;
        const colSpan: number = (data.cell as any).colSpan ?? 1;
        const lastCol = col + colSpan - 1;

        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.5);

        if (pdfDeptLeft.has(col)) {
          doc.line(x, y, x, y + height);
        }
        if (pdfDeptRight.has(lastCol)) {
          doc.line(x + width, y, x + width, y + height);
        }
      },
    });

    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `OBP_Status_${projectName}_${new Date().toISOString().split('T')[0]}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ flexGrow: 1, px: 2, py: 3, width: "100vw", ml: "calc(50% - 50vw)" }}>
      {!hideBreadcrumb && <Breadcrumb title="Approval Table" items={BCrumb} />}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Status Table
        </Typography>
        <IconButton onClick={handleCloseStatusTable} sx={{ color: "grey.600" }}>
          <Close />
        </IconButton>
      </Box>
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: "grey.300",
          borderRadius: 0,
          position: "sticky",
          top: 0,
          zIndex: 10,
          backgroundColor: "white",
          mt: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "grey.800" }}
          >
             Project Status
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {loadingProjects ? (
              <CircularProgress size={24} />
            ) : projectsError ? (
              <Alert severity="error" sx={{ py: 0, px: 1 }}>
                {projectsError}
              </Alert>
            ) : selectedProjectId ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 2,
                    py: 0.75,
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: "20px",
                    boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#4ade80",
                      boxShadow: "0 0 8px rgba(74, 222, 128, 0.6)",
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "600",
                      color: "#fff",
                      fontSize: "0.875rem",
                    }}
                  >
                    {projects.find(
                      (p) => p.projectId.toString() === selectedProjectId,
                    )?.projectName || `Project ${selectedProjectId}`}
                    {/* Commented out as per requirement
                    {projectData?.employeeName && (
                      <Typography component="span" sx={{ display: 'block', fontSize: '0.75rem', fontWeight: 400, color: 'rgba(255,255,255,0.8)' }}>
                        👤 {projectData.employeeName}
                      </Typography>
                    )}
                    */}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => {
                    setSelectedProjectId("");
                    setProjectData(null);
                  }}
                  sx={{
                    color: "#fff",
                    background: "rgba(0,0,0,0.1)",
                    "&:hover": { background: "rgba(0,0,0,0.2)" },
                  }}
                >
                  <GridCloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              <Autocomplete
                size="small"
                sx={{ width: 300 }}
                options={projects}
                getOptionLabel={(option) => `${option.projectId} - ${option.projectName || `Project ${option.projectId}`}`}
                value={projects.find((p) => p.projectId.toString() === selectedProjectId) || null}
                onChange={(event, newValue) => {
                  setSelectedProjectId(newValue ? newValue.projectId.toString() : "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Project"
                    placeholder="Type to search projects..."
                  />
                )}
                filterOptions={(options, { inputValue }) => {
                  return options.filter((option) =>
                    option.projectName?.toLowerCase().includes(inputValue.toLowerCase()) ||
                    option.projectId.toString().includes(inputValue)
                  );
                }}
              />
            )}
            <CustomTextField
              placeholder="Search all columns..."
              value={globalFilter ?? ""}
              onChange={(event: any) =>
                setGlobalFilter(String(event.target.value))
              }
              sx={{ maxWidth: "200px" }}
            />
            {selectedProjectId && dynamicData.length > 0 && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button
  variant="contained"
  onClick={(e) => {
    const btn = e.currentTarget;
    btn.classList.add('e-dashboard-clicked');
    setTimeout(() => btn.classList.remove('e-dashboard-clicked'), 200);

    // Step 1: Open Default.aspx for session setup
    const firstTab = window.open(
      "https://ums.lpu.in/lpuums/Default.aspx",
      "_blank"
    );

    // Step 2: After 500ms, close first tab and open openApp.aspx
    setTimeout(() => {
      if (firstTab) {
        firstTab.close();
      }
      window.open(
        "https://ums.lpu.in/lpuums/openApp.aspx?from=ums&toApp=obpEstate-work-status",
        "_blank"
      );
    }, 500);
  }}
  sx={{
    backgroundColor: "#2563eb",
    color: "white",
    fontWeight: 600,
    textTransform: "none",
    px: 2,
    py: 0.5,
    borderRadius: 1,
    position: "relative",
    overflow: "hidden",
    transition: "all 0.3s ease",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: "-100%",
      width: "100%",
      height: "100%",
      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
      transition: "left 0.5s ease",
    },
    "&:hover::before": {
      left: "100%",
    },
    "&:hover": {
      backgroundColor: "#1d4ed8",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(37, 99, 235, 0.4)",
    },
    "&.e-dashboard-clicked": {
      transform: "scale(0.95)",
      boxShadow: "0 2px 8px rgba(37, 99, 235, 0.5)",
    },
  }}
>
  Dashboard
</Button>

                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={(e) => setExportAnchorEl(e.currentTarget)}
                  size="small"
                >
                  Export
                </Button>
                <Menu
                  anchorEl={exportAnchorEl}
                  open={Boolean(exportAnchorEl)}
                  onClose={() => setExportAnchorEl(null)}
                  PaperProps={{
                    sx: { minWidth: 150 }
                  }}
                >
                  <MenuItem onClick={() => {
                    setExportAnchorEl(null);
                    printTable();
                  }}>
                    <Print sx={{ mr: 1 }} /> Print
                  </MenuItem>
                  <MenuItem onClick={() => {
                    setExportAnchorEl(null);
                    downloadExcel();
                  }}>
                    <Download sx={{ mr: 1 }} /> Export Excel
                  </MenuItem>
                  <MenuItem onClick={() => {
                    setExportAnchorEl(null);
                    downloadPDF();
                  }}>
                    <PictureAsPdf sx={{ mr: 1 }} /> Export PDF
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      <Box
        ref={tableContainerRef}
        sx={{
          width: "100%",
          maxWidth: "100vw",
          maxHeight: "80vh",
          overflowX: "scroll",
          overflowY: "auto",
          backgroundColor: "white",
          borderRadius: 0,
          boxShadow: 3,
          "&::-webkit-scrollbar": {
            height: 8,
            width: 8,
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#888",
            borderRadius: 4,
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#555",
          },
        }}
      >
        <Box
          sx={{
            overflowX: "visible",
          }}
        >
          <Table
            sx={{
              minWidth: selectedProjectId ? { xs: "100%", lg: 2000 } : "auto",
              fontSize: "0.7rem",
              border: "1px solid #e5e7eb",
              borderRadius: 0,
              borderCollapse: "separate",
              "& .MuiTableCell-root": {
                fontSize: "0.7rem",
                paddingLeft: "4px",
                paddingRight: "4px",
              },
            }}
          >
            {selectedProjectId && (
              <TableHead
                sx={{
                  position: "sticky",
                  top: 0,
                  zIndex: 10,
                  backgroundColor: "#f9f9f9",
                }}
              >
                <TableRow sx={{ backgroundColor: "#f9f9f9" }}>
                  {table.getHeaderGroups()[0]?.headers.map((header) => {
                    const isParentColumn =
                      header.subHeaders && header.subHeaders.length > 0;
                    const isSpecialParentColumn = [
                      "sNo",
                      "steps",
                      "departmentWiseSteps",
                    ].includes(header.id);
                    const isDepartmentParent = [
                      "architect",
                      "civilHandover",
                      "electrical",
                      "it",
                      "itInfra",
                    ].includes(header.id);
                    const columnDivisionMap: Record<string, number> = {
                      architect: 59,
                      civilHandover: 38,
                      electrical: 58,
                      it: 60,
                      itInfra: 61,
                    };
                    const headerDeptStyle = isDepartmentParent
                      ? getDepartmentStyle(columnDivisionMap[header.id])
                      : null;
                    const borderClass =
                      (isParentColumn || isSpecialParentColumn) &&
                      !isDepartmentParent
                        ? "border-r border-gray-300"
                        : "";

                    if (isParentColumn && header.subHeaders.length > 1) {
                      // Parent column with multiple sub-columns (like Architect, Civil Handover, etc.)
                      const outerBg = headerDeptStyle ? headerDeptStyle.bgColor : "#dbeafe";
                      const innerBg = headerDeptStyle ? headerDeptStyle.borderColor + "33" : "#bfdbfe";
                      const subBg = headerDeptStyle ? headerDeptStyle.bgColor + "cc" : "#eff6ff";
                      const borderCol = headerDeptStyle ? headerDeptStyle.borderColor : "#d1d5db";
                      return (
                        <TableCell
                          key={header.id}
                          colSpan={header.colSpan}
                          sx={{
                            padding: 0,
                            height: "70px",
                            fontWeight: "bold",
                            backgroundColor: outerBg,
                            border: `2px solid ${borderCol}`,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              height: "100%",
                            }}
                          >
                            <Box
                              sx={{
                                padding: "8px",
                                fontWeight: "600",
                                textAlign: "center",
                                backgroundColor: innerBg,
                                borderBottom: `1px solid ${borderCol}`,
                                color: headerDeptStyle ? headerDeptStyle.textColor : "inherit",
                              }}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                            </Box>
                            <Box sx={{ display: "flex" }}>
                              {header.subHeaders.map((subHeader, subIndex) => (
                                <Box
                                  key={subHeader.id}
                                  sx={{
                                    flex: 1,
                                    backgroundColor: subBg,
                                    textAlign: "center",
                                    padding: "8px",
                                    fontSize: "0.75rem",
                                    color: headerDeptStyle ? headerDeptStyle.textColor : "inherit",
                                    borderRight:
                                      subIndex < header.subHeaders.length - 1 &&
                                      ![
                                        "civilHandover",
                                        "electrical",
                                        "it",
                                        "itInfra",
                                      ].includes(header.id) &&
                                      !(
                                        header.id === "electrical" &&
                                        subIndex === 0
                                      )
                                        ? "1px solid #d1d5db"
                                        : "none",
                                  }}
                                >
                                  {flexRender(
                                    subHeader.column.columnDef.header,
                                    subHeader.getContext(),
                                  )}
                                </Box>
                              ))}
                            </Box>
                          </Box>
                        </TableCell>
                      );
                    } else if (isSpecialParentColumn) {
                      // Special parent columns (S.No, Steps, Department Wise Steps)
                      return (
                        <TableCell
                          key={header.id}
                          colSpan={header.colSpan}
                          sx={{
                            padding: 0,
                            height: "100px",
                            border: "1px solid #d1d5db",
                            position:
                              header.id === "steps" ? "sticky" : "static",
                            left: header.id === "steps" ? 0 : "auto",
                            backgroundColor:
                              header.id === "steps" ? "#f9fafb" : "transparent",
                            zIndex: header.id === "steps" ? 10 : "auto",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              height: "100%",
                            }}
                          >
                            <Box
                              sx={{
                                padding: "8px",
                                fontWeight: "bold",
                                textAlign: "center",
                              }}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                      );
                    } else {
                      // Regular column without sub-columns
                      return (
                        <TableCell
                          key={header.id}
                          colSpan={header.colSpan}
                          sx={{
                            textAlign: "center",
                            backgroundColor: "#dbeafe",
                            height: "50px",
                            padding: "8px",
                            fontWeight: "bold",
                            border: "1px solid #d1d5db",
                            borderRadius: 0,
                          }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableCell>
                      );
                    }
                  })}
                </TableRow>
              </TableHead>
            )}
            <TableBody>
              {table.getRowModel().rows?.length ? (
                <>
                  {/* Render rows 1-6 */}
                  {table
                    .getRowModel()
                    .rows.slice(0, 6)
                    .map((row) => {
                      const rowIndex = row.index;
                      const step = fixedSteps[rowIndex];

                      return (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                          className={`hover:bg-gray-50 transition-colors ${
                            rowIndex <= 3
                              ? "border-b border-gray-200"
                              : rowIndex === 4
                                ? "border-b-0"
                                : rowIndex >= 5
                                  ? "border-t border-b border-gray-200"
                                  : ""
                          }`}
                        >
                          {row
                            .getVisibleCells()
                            .map((cell, cellIndex) => {
                              const columnId = cell.column.id;
                              const isStageRow = step?.label?.startsWith("Stage");

                              // Dept border + bg for each department column group
                              const _deptColMap: Record<string, number> = { architect: 59, civilHandover: 38, electrical: 58, it: 60, itInfra: 61 };
                              const _parentId = cell.column.parent?.id;
                              const _cellDeptStyle = _parentId && _deptColMap[_parentId] ? getDepartmentStyle(_deptColMap[_parentId]) : null;
                              const _leafCols = cell.column.parent?.getLeafColumns() || [];
                              const _deptBorderSx = _cellDeptStyle ? {
                                ...(_leafCols[0]?.id === cell.column.id && { borderLeft: `3px solid ${_cellDeptStyle.borderColor}` }),
                                ...(_leafCols[_leafCols.length - 1]?.id === cell.column.id && { borderRight: `3px solid ${_cellDeptStyle.borderColor}` }),
                                backgroundColor: _cellDeptStyle.bgColor,
                              } : {};

                              // For rows 1-5 (index 0-4), apply blue background to all cells
                              const isStepsRow = rowIndex <= 4;
                              const stepsBgColor = "#e0f2fe"; // Light blue for steps 1-5
                              if (cellIndex === 0) {
                                return (
                                  <TableCell
                                    key={cell.id}
                                    component="th"
                                    scope="row"
                                    sx={{
                                      border: "1px solid #e5e7eb",
                                      padding: "8px",
                                      position: "sticky",
                                      left: 0,
                                       backgroundColor: isStepsRow ? stepsBgColor : "#eff6ff",
                                      zIndex: 10,
                                    }}
                                  >
                                    {flexRender(
                                      cell.column.columnDef.cell,
                                      cell.getContext(),
                                    )}
                                  </TableCell>
                                );
                            }

                            if (cellIndex === 1) {
                                // For rows 1-6 (index 0-5), render with different aesthetic backgrounds
                                if (rowIndex <= 5) {
                                  let bgColor = "#eff6ff"; // Default blue for step 6
                                  if (rowIndex >= 0 && rowIndex <= 4) bgColor = stepsBgColor; // Light blue for steps 1-5

                                  return (
                                    <TableCell
                                      key={cell.id}
                                      sx={{
                                        border: "1px solid #e5e7eb",
                                        textAlign: isStageRow ? "left" : "center",
                                         paddingLeft: isStageRow ? "40px" : "default",
                                        backgroundColor: bgColor,
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext(),
                                      )}
                                    </TableCell>
                                  );
                                }
                              }

                              // For steps 1-5 rows, apply blue background to all remaining cells
                              if (isStepsRow) {
                                return (
                                  <TableCell
                                    key={cell.id}
                                    sx={{
                                      border: "1px solid #e5e7eb",
                                      backgroundColor: stepsBgColor,
                                      textAlign: "center",
                                      ..._deptBorderSx,
                                    }}
                                  >
                                    {flexRender(
                                      cell.column.columnDef.cell,
                                      cell.getContext(),
                                    )}
                                  </TableCell>
                                );
                              }

                              return (
                                <TableCell
                                  key={cell.id}
                                  sx={{
                                    border: "1px solid #e5e7eb",
                                    textAlign: isStageRow ? "left" : "center",
                                    paddingLeft: isStageRow ? "40px" : "default",
                                    backgroundColor: "#eff6ff",
                                    ..._deptBorderSx,
                                  }}
                                >
                                  {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext(),
                                  )}
                                </TableCell>
                              );
                            })
                            .filter(Boolean)}
                        </TableRow>
                      );
                    })}

                  {/* Render substeps */}
                  {table
                    .getRowModel()
                    .rows.slice(6)
                    .map((row) => {
                      const rowIndex = row.index;
                      const step = fixedSteps[rowIndex];
                      const isSubStep = step?.isSubStep;
                      const isMetricRow = step?.label.startsWith("Metric ID:");
                      const isStageRow = step?.label.startsWith("Stage");

                      // Check if metric has stages
                      let hasStages = false;
                      if (isMetricRow && step.metricId) {
                        const metricId = step.metricId;
                        // Handle metricId=0 with drawing number prefix (e.g., "0_02523")
                        const metricIdNum = metricId.startsWith('0_') ? 0 : parseInt(metricId);
                        if (stagesData?.item1 && Array.isArray(stagesData.item1)) {
                          const metricStages = stagesData.item1.filter((item: any) => item.metricId === metricIdNum);
                          hasStages = metricStages.length > 0;
                        }
                      }

                      return (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                          className={`hover:bg-gray-50 transition-colors ${
                            rowIndex >= 5
                              ? "border-t border-b border-gray-200"
                              : ""
                          }`}
                          sx={{
                            backgroundColor: isStageRow ? "#fefce8" : (isMetricRow && hasStages ? "#fef3c7" : "inherit"),
                            cursor: isStageRow ? "pointer" : "default",
                          }}
                          onClick={() => {
                            if (isStageRow && step.metricId) {
                              const metricId = step.metricId;
                              // Handle metricId=0 with drawing number prefix (e.g., "0_02523")
                              const metricIdNum = metricId.startsWith('0_') ? 0 : parseInt(metricId);
                              const stageDescription = step.label.replace("Stage ", "").split(": ")[1];
                              const stageItem = stagesData?.item1?.find(
                                (item: any) =>
                                  item.metricId === metricIdNum &&
                                  item.stageDescription === stageDescription
                              );
                                     let engineerName = "";
           if (stageItem) {
                                setSelectedMetricData({
                                  metricId: String(stageItem.metricId),
                                  metricDescription: stageItem.metricDescription,
                                  drawingNumber: stageItem.drawingNo,
                                  endDate: stageItem.endDate,
                                });
                                setSelectedStageData({
                                  stageAllocationid: String(stageItem.stageAllocationid || ''),
                                  stageId: String(stageItem.stageId || stageItem.metricId),
                                  stageDescription: stageItem.stageDescription,
                                  startDate: stageItem.startDate,
                                  endDate: stageItem.endDate,
                                  actionStatus: stageItem.actionStatus,
                                });
                                setSelectedUid(String(stageItem.metricId));

                                // Fetch chat messages from API
                                const stageAllocationid = stageItem.stageAllocationid || stageItem.stageId || 0;
                                const metricIdValue = stageItem.metricId;

                                // Clear previous chat messages before fetching new ones to prevent stale data
                                setChatMessages([]);

                                fetchChatMessages(stageAllocationid, metricIdValue).then(() => {
                                  setChatModalOpen(true);
                                });
                              }
                            }
                          }}
                        >
                          {row.getVisibleCells().map((cell, cellIndex) => {
                            const columnId = cell.column.id;
                            const isStageRow = step?.label?.startsWith("Stage");

                            // Dept border for left/right edges of each department column group
                            const _deptColMap: Record<string, number> = { architect: 59, civilHandover: 38, electrical: 58, it: 60, itInfra: 61 };
                            const _parentId = cell.column.parent?.id;
                            const _cellDeptStyle = _parentId && _deptColMap[_parentId] ? getDepartmentStyle(_deptColMap[_parentId]) : null;
                            const _leafCols = cell.column.parent?.getLeafColumns() || [];
                            const _deptBorderSx = _cellDeptStyle ? {
                              ...(_leafCols[0]?.id === cell.column.id && { borderLeft: `3px solid ${_cellDeptStyle.borderColor}` }),
                              ...(_leafCols[_leafCols.length - 1]?.id === cell.column.id && { borderRight: `3px solid ${_cellDeptStyle.borderColor}` }),
                            } : {};

                            // For the first column (S.No), render as <th> for row header
                            if (cellIndex === 0) {
                              return (
                                <TableCell
                                  key={cell.id}
                                  component="th"
                                  scope="row"
                                  sx={{
                                    border: "1px solid #e5e7eb",
                                    padding: "8px",
                                    position: "sticky",
                                    left: 0,
                                    backgroundColor: "#eff6ff",
                                    zIndex: 10,
                                    fontWeight: step.isDivisionHeader ? "bold" : isMetricRow ? "bold" : "normal",
                                  }}
                                >
                                  {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext(),
                                  )}
                                </TableCell>
                              );
                            }

                            // For the Steps column (index 1)
                            if (cellIndex === 1) {
                              const isCivil = (step as BaseStep)?.divisionId === 38;
                              const isElectrical = (step as BaseStep)?.divisionId === 58;
                              const isArchitecture = (step as BaseStep)?.divisionId === 59;
                              let bgColor = "#eff6ff";
                              let textColor = "inherit";

                              // For department header rows, apply department colors
                              if (step.isDivisionHeader) {
                                // Find all metric IDs for this department
                                const departmentMetricIds = fixedSteps
                                  .filter(s => s.divisionId === step.divisionId && s.metricId)
                                  .map(s => s.metricId!);

                                // Check if department is expanded (shows metrics)
                                const isDepartmentExpanded = expandedDepartments.has(step.divisionId!);

                                // Check if all metrics in this department are expanded (shows stages)
                                const allMetricsExpanded = departmentMetricIds.length > 0 &&
                                  departmentMetricIds.every(id => expandedMetrics.has(id));

                                return (
                                  <TableCell
                                    key={cell.id}
                                    component="th"
                                    scope="row"
                                    sx={{
                                      border: "1px solid #e5e7eb",
                                      padding: "12px 16px",
                                      backgroundColor: bgColor,
                                      color: textColor,
                                      fontWeight: "bold",
                                      cursor: "pointer",
                                      verticalAlign: 'middle',
                                      transition: 'all 0.2s ease',
                                      '&:hover': {
                                        backgroundColor: isDepartmentExpanded ? '#fcd34d' : '#fef3c7',
                                        boxShadow: 'inset 0 0 0 2px #f59e0b',
                                      },
                                    }}
                                    onClick={() => {
                                      const newDeptSet = new Set(expandedDepartments);
                                      const newMetricsSet = new Set(expandedMetrics);

                                      if (!isDepartmentExpanded) {
                                        // First click: Show metrics (add to expandedDepartments)
                                        newDeptSet.add(step.divisionId!);
                                      } else {
                                        // Second click: Hide metrics (remove from expandedDepartments)
                                        // Also clear expanded metrics for this department
                                        departmentMetricIds.forEach(id => newMetricsSet.delete(id));
                                        newDeptSet.delete(step.divisionId!);
                                      }

                                      setExpandedDepartments(newDeptSet);
                                      setExpandedMetrics(newMetricsSet);
                                    }}
                                  >
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 2 }}>
                                      {/* Left side: Department Info - full width */}
                                      <Box sx={{ flex: 1, minWidth: 0 }}>
                                        {flexRender(
                                          cell.column.columnDef.cell,
                                          cell.getContext(),
                                        )}
                                      </Box>
                                      {/* Right side: Stacked Icons (Arrow on top, Eye below) */}
                                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                                        {/* Expand/Collapse Arrow Icon */}
                                        <Box
                                          sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: 36,
                                            height: 36,
                                            borderRadius: '10px',
                                            backgroundColor: isDepartmentExpanded
                                              ? '#fee2e2'
                                              : '#dcfce7',
                                            border: `2px solid ${isDepartmentExpanded ? '#dc2626' : '#16a34a'}`,
                                            flexShrink: 0,
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                              transform: 'scale(1.1)',
                                            }
                                          }}
                                        >
                                          {isDepartmentExpanded ? (
                                            <ExpandLess sx={{ fontSize: 24, fontWeight: 'bold', color: '#dc2626' }} />
                                          ) : (
                                            <ExpandMore sx={{ fontSize: 24, fontWeight: 'bold', color: '#16a34a' }} />
                                          )}
                                        </Box>
                                        {/* Eye Icon - shown when metrics are visible - toggles stages visibility */}
                                        {isDepartmentExpanded && (
                                          <Box
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              const newMetricsSet = new Set(expandedMetrics);

                                              // Toggle: if all metrics are expanded, collapse them; otherwise expand all
                                              const allMetricsExpanded = departmentMetricIds.length > 0 &&
                                                departmentMetricIds.every(id => expandedMetrics.has(id));

                                              if (allMetricsExpanded) {
                                                // Collapse all stages
                                                departmentMetricIds.forEach(id => newMetricsSet.delete(id));
                                              } else {
                                                // Expand all metrics to show stages
                                                departmentMetricIds.forEach(id => newMetricsSet.add(id));
                                              }

                                              setExpandedMetrics(newMetricsSet);
                                            }}
                                            sx={{
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              width: 36,
                                              height: 36,
                                              borderRadius: '10px',
                                              backgroundColor: allMetricsExpanded ? '#fee2e2' : '#fef3c7',
                                              border: `2px solid ${allMetricsExpanded ? '#dc2626' : '#f59e0b'}`,
                                              transition: 'all 0.2s ease',
                                              cursor: 'pointer',
                                              '&:hover': {
                                                transform: 'scale(1.1)',
                                                backgroundColor: '#fde68a',
                                              }
                                            }}
                                            title={allMetricsExpanded ? "Hide Stages" : "View Stages"}
                                          >
                                            <Visibility sx={{ fontSize: 22, fontWeight: 'bold', color: allMetricsExpanded ? '#dc2626' : '#92400e' }} />
                                          </Box>
                                        )}
                                      </Box>
                                    </Box>
                                  </TableCell>
                                );
                              } else if (isSubStep && isCivil) {
                                bgColor = "#f07571"; // Light yellow for Civil
                              } else if (isSubStep && isElectrical) {
                                bgColor = "#683636"; // Dark gray for Electrical
                                textColor = "white"; // White text for Electrical
                              } else if (isSubStep && isArchitecture) {
                                bgColor = "#e6ffe6"; // Light green for Architecture
                              }

                              // For metric rows, make them clickable to expand/collapse
                              if (isMetricRow) {
                                const metricId = step.metricId!;
                                const isExpanded = expandedMetrics.has(metricId);
                                // Check if parent department is expanded
                                const metricDeptId = (step as any)?.divisionId;
                                const isDeptExpanded = metricDeptId ? expandedDepartments.has(metricDeptId) : false;

                                return (
                                  <TableCell
                                    key={cell.id}
                                    sx={{
                                      border: "1px solid #e5e7eb",
                                      textAlign: "center",
                                      color: textColor,
                                      fontWeight: "bold",
                                      cursor: "pointer",
                                      padding: "10px 12px",
                                      pointerEvents: 'all',
                                      '&:hover': {
                                        backgroundColor: isExpanded ? "#f59e0b" : "#fef3c7",
                                      },
                                      ..._deptBorderSx,
                                      backgroundColor: isExpanded ? "#fbbf24" : (_cellDeptStyle ? _cellDeptStyle.bgColor : bgColor),
                                    }}
                                    onClick={(e) => {
                                      // Check if this is the architect statusOfDrawing cell and has fileUpload
                                      if (cell.id.includes('architect_statusOfDrawing')) {
                                        const rowData = cell.row.original as any;
                                        if (rowData.fileUpload) {
                                          // Skip expansion - let the cell handle the download
                                          return;
                                        }
                                      }

                                      // Extract reference number from metricDescription when expand is clicked
                                      const metricIdValue = step.metricId;
                                      // Handle metricId=0 with drawing number prefix (e.g., "0_02523")
                                      const metricIdNum = metricIdValue!.startsWith('0_') ? 0 : parseInt(metricIdValue!);
                                      const stageWithDescription = stagesData?.item1?.find(
                                        (item: any) => item.metricId === metricIdNum
                                      );
                                      if (stageWithDescription?.metricDescription) {
                                        const metricDescription = stageWithDescription.metricDescription;
                                        const referenceNo = extractReferenceNo(metricDescription);
                                      }

                                      const newSet = new Set(expandedMetrics);
                                      if (newSet.has(metricId)) {
                                        newSet.delete(metricId);
                                      } else {
                                        newSet.add(metricId);
                                      }
                                      setExpandedMetrics(newSet);
                                    }}
                                  >
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', gap: 1 }}>
                                      {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext(),
                                      )}
                                      {/* Eye icon only in Steps column when department is expanded */}
                                      {isDeptExpanded && cell.id.includes('stepsCell') && (
                                        <Box
                                          sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: 28,
                                            height: 28,
                                            borderRadius: '6px',
                                            backgroundColor: '#fef3c7',
                                            border: '2px solid #f59e0b',
                                            flexShrink: 0,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                              transform: 'scale(1.1)',
                                              backgroundColor: '#fde68a',
                                            }
                                          }}
                                          title="View Stages"
                                        >
                                          <Visibility sx={{ fontSize: 16, fontWeight: 'bold', color: '#92400e' }} />
                                        </Box>
                                      )}
                                    </Box>
                                  </TableCell>
                                );
                              }

                              return (
                                <TableCell
                                  key={cell.id}
                                  sx={{
                                    border: "1px solid #e5e7eb",
                                    textAlign: isStageRow ? "left" : "center",
                                    backgroundColor: bgColor,
                                    color: textColor,
                                    fontWeight: "bold",
                                    paddingLeft: isStageRow ? "40px" : "default",
                                    ..._deptBorderSx,
                                  }}
                                >
                                  {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext(),
                                  )}
                                </TableCell>
                              );
                            }

                            return (
                              <TableCell
                                key={cell.id}
                                sx={{
                                  border: "1px solid #e5e7eb",
                                  fontWeight: isMetricRow ? "bold" : "normal",
                                  cursor: isMetricRow ? "pointer" : "default",
                                  padding: "10px 12px",
                                  pointerEvents: 'all',
                                  '&:hover': isMetricRow ? {
                                    backgroundColor: expandedMetrics.has(step.metricId!) ? "#f59e0b" : "#fef3c7",
                                  } : {},
                                  ..._deptBorderSx,
                                  backgroundColor: isMetricRow && expandedMetrics.has(step.metricId!) ? "#fbbf24" : (_cellDeptStyle ? _cellDeptStyle.bgColor : (isMetricRow && columnId === "departmentWiseSteps" ? "#fef3c7" : "#eff6ff")),
                                }}
                                onClick={(e) => {
                                  if (!isMetricRow) return;

                                  // Check if this is the architect statusOfDrawing cell and has fileUpload
                                  if (cell.id.includes('architect_statusOfDrawing')) {
                                    const rowData = cell.row.original as any;
                                    if (rowData.fileUpload) {
                                      const folder = rowData.fileUploadFolder || "";
                                      const filename = rowData.fileUpload;
                                      DownloadSupportingDocument(folder, filename).then((res) => {
                                        if (res?.status === "ok" && res.base64) {
                                          const binary = atob(res.base64);
                                          const bytes = new Uint8Array(binary.length);
                                          for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
                                          const blob = new Blob([bytes], { type: res.mime || 'application/octet-stream' });
                                          const blobUrl = URL.createObjectURL(blob);
                                          const link = document.createElement('a');
                                          link.href = blobUrl;
                                          link.download = filename;
                                          document.body.appendChild(link);
                                          link.click();
                                          document.body.removeChild(link);
                                          URL.revokeObjectURL(blobUrl);
                                        } else {
                                          alert('File not available for download');
                                        }
                                      });
                                      return;
                                    }
                                  }

                                  const metricId = step.metricId!;
                                  const isExpanded = expandedMetrics.has(metricId);

                                  const newSet = new Set(expandedMetrics);
                                  if (newSet.has(metricId)) {
                                    newSet.delete(metricId);
                                  } else {
                                    newSet.add(metricId);
                                  }
                                  setExpandedMetrics(newSet);
                                }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, width: '100%', pointerEvents: 'none' }}>
                                  {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext(),
                                  )}
                                  {/* Eye icon only in Steps column when department is expanded */}
                                  {isMetricRow && (() => {
                                    const metricDeptId = (step as any)?.divisionId;
                                    const isDeptExpanded = metricDeptId ? expandedDepartments.has(metricDeptId) : false;
                                    return isDeptExpanded && cell.id.includes('stepsCell') && (
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          width: 28,
                                          height: 28,
                                          borderRadius: '6px',
                                          backgroundColor: '#fef3c7',
                                          border: '2px solid #f59e0b',
                                          flexShrink: 0,
                                          cursor: 'pointer',
                                          transition: 'all 0.2s ease',
                                          pointerEvents: 'auto',
                                          '&:hover': {
                                            transform: 'scale(1.1)',
                                            backgroundColor: '#fde68a',
                                          }
                                        }}
                                        title="View Stages"
                                      >
                                        <Visibility sx={{ fontSize: 16, fontWeight: 'bold', color: '#92400e' }} />
                                      </Box>
                                    );
                                  })()}
                                </Box>
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                </>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    sx={{
                      height: "40vh", // Increased height for better centering
                      textAlign: "center",
                      verticalAlign: "middle",
                      border: "none", // Remove border for cleaner look
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 2,
                        height: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          width: 100,
                          height: 100,
                          borderRadius: "50%",
                          backgroundColor: "grey.100",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 3,
                        }}
                      >
                        <Typography variant="h2" sx={{ color: "grey.400" }}>
                          📊
                        </Typography>
                      </Box>
                      <Typography
                        variant="h5"
                        sx={{ color: "text.secondary", fontWeight: 500, mb: 2 }}
                      >
                        No Data Available
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "text.secondary",
                          textAlign: "center",
                          maxWidth: 400,
                          mb: 2,
                        }}
                      >
                        {!selectedProjectId
                          ? "Please select a project to view the approval table."
                          : "There is currently no approval data available for the selected project. Please check back later or contact your administrator."}
                      </Typography>
                      <Box
                        sx={{
                          p: 2,
                          backgroundColor: "grey.50",
                          borderRadius: 1,
                          border: "1px solid",
                          borderColor: "grey.200",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary", fontStyle: "italic" }}
                        >
                          💡 Tip: Try selecting a different project or refresh
                          the page
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </Box>

      {/* Stage Chat Modal */}
      <StageChatModal
        open={chatModalOpen}
        onClose={() => {
          setChatModalOpen(false);
          setChatMessages([]);
        }}
        metricData={{
          metricId: String(selectedMetricData?.metricId || ''),
          metricDescription: String(selectedMetricData?.metricDescription || ''),
          drawingNumber: String(selectedMetricData?.drawingNumber || ''),
          endDate: String(selectedMetricData?.endDate || ''),
        }}
        stageData={{
          stageAllocationid: String(selectedStageData?.stageAllocationid || ''),
          stageId: String(selectedStageData?.stageId || ''),
          stageDescription: String(selectedStageData?.stageDescription || ''),
          startDate: String(selectedStageData?.startDate || ''),
          endDate: String(selectedStageData?.endDate || ''),
          actionStatus: String(selectedStageData?.actionStatus || ''),
        }}
        uid={selectedUid}
        loginName={loginName}
        chatMessages={chatMessages}
        loadingChat={loadingChat}
        onSendMessage={() => {
          // Refresh chat messages after sending
          if (selectedStageData?.stageAllocationid && selectedMetricData?.metricId) {
            fetchChatMessages(selectedStageData.stageAllocationid, selectedMetricData.metricId);
          }
        }}
      />

      {/* Architect Drawing Follow Up Chat Modal */}
      <ArchitectDrawingChatModal
        open={architectChatModalOpen}
        onClose={() => setArchitectChatModalOpen(false)}
        projectId={selectedProjectId || ''}
        metricData={{
          metricId: String(selectedArchitectDrawing?.metricId || ''),
          metricDescription: String(selectedArchitectDrawing?.metricDescription || ''),
          drawingNumber: String(selectedArchitectDrawing?.drawingNumber || ''),
          endDate: String(selectedArchitectDrawing?.endDate || ''),
        }}
        loginName={loginName}
      />
    </Box>
  );
}
