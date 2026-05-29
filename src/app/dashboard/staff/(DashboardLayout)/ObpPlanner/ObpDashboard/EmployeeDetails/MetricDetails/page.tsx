"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Container,
  Paper,
  useTheme,
  Button,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  FilterList,
  Visibility,
  Search,
  ExpandMore,
  ExpandLess,
  Remove,
  Add,
  Check,
  Schedule,
  Warning,
  EmojiEvents,
  Close,
  HourglassEmpty,
  List,
  TableChart,
  Settings,
  Lightbulb,
  Notifications,
  PriorityHigh,
  Download,
  Refresh,
} from "@mui/icons-material";

import ExcelJS from 'exceljs';
import Breadcrumb from "@/app/dashboard/staff/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";

interface MetricData {
  no: number;
  plannerSession: string;
  keyIndicator: string;
  metricId: string | number;
  metricDescription: string;
  outcomeProcess: string;
  umsPath: string;
  plannerWeightage: string;
  absoluteWeightage: string;
  outcomeProcessWeightage: string;
  metricSource: string;
  assignToNameUID: string;
  departmentName: string;
  assignToType: string;
  assignedBy: string;
  targetDate: string;
  totalTargetValue: string;
  quarter1Target: string;
  quarter2Target: string;
  quarter3Target: string;
  quarter4Target: string;
  achieved: string;
  pending: string;
  completed: string;
  actionByHOD: string;
  actionByHOS: string;
  actionBySourceDivision: string;
  finalVerificationAction: string;
  metricPriority: 'High' | 'Medium' | 'Low';
  quarterlyReview: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  status: 'Not achieved yet' | 'Partially achieved' | 'Achieved but not marked as achieved' | 'Marked as complete';
  achievedValue: number;
  assignedAs: string;
}

const sampleMetrics: Record<string, MetricData[]> = {
  "Joohi Rani": [
    {
      no: 1,
      plannerSession: "Academic Year (Jul 22 - Jun 23)",
      keyIndicator: "Code Quality",
      metricId: "CQ001",
      metricDescription: "Maintain code quality score above 90% in all code reviews",
      outcomeProcess: "Process",
      umsPath: "UMS Code Review Module",
      plannerWeightage: "30.00",
      absoluteWeightage: "0.000000",
      outcomeProcessWeightage: "0.000000",
      metricSource: "LPU Code Review Portal",
      assignToNameUID: "Joohi Rani",
      departmentName: "Department of Software Development-III",
      assignToType: "Software Developer (O-I)",
      assignedBy: "Pooja Verma (O-III)",
      targetDate: "30 Jun 2023",
      totalTargetValue: "90",
      quarter1Target: "90",
      quarter2Target: "90",
      quarter3Target: "90",
      quarter4Target: "90",
      achieved: "92",
      pending: "0",
      completed: "Yes",
      actionByHOD: "Approved",
      actionByHOS: "Approved",
      actionBySourceDivision: "Verified",
      finalVerificationAction: "Approved",
      metricPriority: "High",
      quarterlyReview: "Q4",
      status: "Marked as complete",
      achievedValue: 92,
      assignedAs: "Faculty"
    },
    {
      no: 2,
      plannerSession: "Academic Year (Jul 22 - Jun 23)",
      keyIndicator: "Bug Resolution",
      metricId: "BR001",
      metricDescription: "Resolve critical bugs within 24 hours of reporting",
      outcomeProcess: "Process",
      umsPath: "UMS Bug Tracking Module",
      plannerWeightage: "25.00",
      absoluteWeightage: "0.000000",
      outcomeProcessWeightage: "0.000000",
      metricSource: "LPU JIRA System",
      assignToNameUID: "Joohi Rani",
      departmentName: "Department of Software Development-III",
      assignToType: "Software Developer (O-I)",
      assignedBy: "Pooja Verma (O-III)",
      targetDate: "30 Jun 2023",
      totalTargetValue: "95",
      quarter1Target: "95",
      quarter2Target: "95",
      quarter3Target: "95",
      quarter4Target: "95",
      achieved: "88",
      pending: "7",
      completed: "No",
      actionByHOD: "Under Review",
      actionByHOS: "Pending Review",
      actionBySourceDivision: "Verified",
      finalVerificationAction: "Pending",
      metricPriority: "High",
      quarterlyReview: "Q3",
      status: "Partially achieved",
      achievedValue: 88,
      assignedAs: "Faculty"
    }
  ],
  "Parminder Singh": [
    {
      no: 1,
      plannerSession: "Academic Year (Jul 22 - Jun 23)",
      keyIndicator: "Feature Development",
      metricId: "FD001",
      metricDescription: "Develop and deliver 5 new features per quarter",
      outcomeProcess: "Outcome",
      umsPath: "UMS Project Management Module",
      plannerWeightage: "35.00",
      absoluteWeightage: "0.000000",
      outcomeProcessWeightage: "0.000000",
      metricSource: "LPU Agile Dashboard",
      assignToNameUID: "Parminder Singh",
      departmentName: "Department of Software Development-III",
      assignToType: "Assistant Software Developer (S-I)",
      assignedBy: "Pooja Verma (O-III)",
      targetDate: "30 Jun 2023",
      totalTargetValue: "5",
      quarter1Target: "1",
      quarter2Target: "1",
      quarter3Target: "2",
      quarter4Target: "1",
      achieved: "5",
      pending: "0",
      completed: "Yes",
      actionByHOD: "Approved",
      actionByHOS: "Approved",
      actionBySourceDivision: "Verified",
      finalVerificationAction: "Approved",
      metricPriority: "High",
      quarterlyReview: "Q4",
      status: "Marked as complete",
      achievedValue: 5,
      assignedAs: "Faculty"
    }
  ],
  "Rakhi Sharma": [
    {
      no: 1,
      plannerSession: "Academic Year (Jul 22 - Jun 23)",
      keyIndicator: "Documentation",
      metricId: "DOC001",
      metricDescription: "Complete technical documentation for all assigned modules",
      outcomeProcess: "Process",
      umsPath: "UMS Documentation Module",
      plannerWeightage: "20.00",
      absoluteWeightage: "0.000000",
      outcomeProcessWeightage: "0.000000",
      metricSource: "LPU Knowledge Base",
      assignToNameUID: "Rakhi Sharma",
      departmentName: "Department of Software Development-III",
      assignToType: "Assistant Software Developer (S-I)",
      assignedBy: "Pooja Verma (O-III)",
      targetDate: "30 Jun 2023",
      totalTargetValue: "100",
      quarter1Target: "25",
      quarter2Target: "25",
      quarter3Target: "25",
      quarter4Target: "25",
      achieved: "85",
      pending: "15",
      completed: "No",
      actionByHOD: "Under Review",
      actionByHOS: "Pending Review",
      actionBySourceDivision: "Verified",
      finalVerificationAction: "Pending",
      metricPriority: "Medium",
      quarterlyReview: "Q3",
      status: "Partially achieved",
      achievedValue: 85,
      assignedAs: "Faculty"
    }
  ],
  "Pooja Verma": [
    {
      no: 1,
      plannerSession: "Academic Year (Jul 22 - Jun 23)",
      keyIndicator: "Team Leadership",
      metricId: "TL001",
      metricDescription: "Lead team of 10 developers and ensure project delivery",
      outcomeProcess: "Outcome",
      umsPath: "UMS Team Management Module",
      plannerWeightage: "40.00",
      absoluteWeightage: "0.000000",
      outcomeProcessWeightage: "0.000000",
      metricSource: "LPU Project Management System",
      assignToNameUID: "Pooja Verma",
      departmentName: "Department of Software Development-III",
      assignToType: "Team Lead (O-III)",
      assignedBy: "Pooja Verma (O-III)",
      targetDate: "30 Jun 2023",
      totalTargetValue: "10",
      quarter1Target: "2",
      quarter2Target: "3",
      quarter3Target: "3",
      quarter4Target: "2",
      achieved: "10",
      pending: "0",
      completed: "Yes",
      actionByHOD: "Self Approved",
      actionByHOS: "Approved",
      actionBySourceDivision: "Verified",
      finalVerificationAction: "Approved",
      metricPriority: "High",
      quarterlyReview: "Q4",
      status: "Marked as complete",
      achievedValue: 10,
      assignedAs: "HOD"
    },
    {
      no: 2,
      plannerSession: "Academic Year (Jul 22 - Jun 23)",
      keyIndicator: "Code Review",
      metricId: "CR001",
      metricDescription: "Conduct weekly code reviews for all team members",
      outcomeProcess: "Process",
      umsPath: "UMS Code Review Module",
      plannerWeightage: "25.00",
      absoluteWeightage: "0.000000",
      outcomeProcessWeightage: "0.000000",
      metricSource: "LPU Code Review Portal",
      assignToNameUID: "Pooja Verma",
      departmentName: "Department of Software Development-III",
      assignToType: "Team Lead (O-III)",
      assignedBy: "Pooja Verma (O-III)",
      targetDate: "30 Jun 2023",
      totalTargetValue: "52",
      quarter1Target: "13",
      quarter2Target: "13",
      quarter3Target: "13",
      quarter4Target: "13",
      achieved: "52",
      pending: "0",
      completed: "Yes",
      actionByHOD: "Approved",
      actionByHOS: "Approved",
      actionBySourceDivision: "Verified",
      finalVerificationAction: "Approved",
      metricPriority: "Medium",
      quarterlyReview: "Q4",
      status: "Marked as complete",
      achievedValue: 52,
      assignedAs: "HOD"
    }
  ],
  "Vishal Sharma": [
    {
      no: 1,
      plannerSession: "Academic Year (Jul 22 - Jun 23)",
      keyIndicator: "Performance Optimization",
      metricId: "PO001",
      metricDescription: "Optimize application performance by 20%",
      outcomeProcess: "Outcome",
      umsPath: "UMS Performance Monitoring Module",
      plannerWeightage: "30.00",
      absoluteWeightage: "0.000000",
      outcomeProcessWeightage: "0.000000",
      metricSource: "LPU Performance Dashboard",
      assignToNameUID: "Vishal Sharma",
      departmentName: "Department of Software Development-III",
      assignToType: "Senior Software Developer (O-II)",
      assignedBy: "Pooja Verma (O-III)",
      targetDate: "31 Mar 2023",
      totalTargetValue: "20",
      quarter1Target: "5",
      quarter2Target: "5",
      quarter3Target: "5",
      quarter4Target: "5",
      achieved: "18",
      pending: "2",
      completed: "No",
      actionByHOD: "Under Review",
      actionByHOS: "Pending Review",
      actionBySourceDivision: "Verified",
      finalVerificationAction: "Pending",
      metricPriority: "High",
      quarterlyReview: "Q3",
      status: "Partially achieved",
      achievedValue: 18,
      assignedAs: "Faculty"
    }
  ],
  "Sandeep Panesar": [
    {
      no: 1,
      plannerSession: "Academic Year (Jul 22 - Jun 23)",
      keyIndicator: "Database Management",
      metricId: "DB001",
      metricDescription: "Maintain database uptime of 99.9%",
      outcomeProcess: "Process",
      umsPath: "UMS Database Management Module",
      plannerWeightage: "35.00",
      absoluteWeightage: "0.000000",
      outcomeProcessWeightage: "0.000000",
      metricSource: "LPU Database Monitoring System",
      assignToNameUID: "Sandeep Panesar",
      departmentName: "Department of Software Development-III",
      assignToType: "Deputy Software Developer (S-II)",
      assignedBy: "Pooja Verma (O-III)",
      targetDate: "30 Jun 2023",
      totalTargetValue: "99.9",
      quarter1Target: "99.9",
      quarter2Target: "99.9",
      quarter3Target: "99.9",
      quarter4Target: "99.9",
      achieved: "99.95",
      pending: "0",
      completed: "Yes",
      actionByHOD: "Approved",
      actionByHOS: "Approved",
      actionBySourceDivision: "Verified",
      finalVerificationAction: "Approved",
      metricPriority: "High",
      quarterlyReview: "Q4",
      status: "Marked as complete",
      achievedValue: 99.95,
      assignedAs: "Staff"
    }
  ],
  "Akhil Sharma": [
    {
      no: 1,
      plannerSession: "Academic Year (Jul 22 - Jun 23)",
      keyIndicator: "API Development",
      metricId: "API001",
      metricDescription: "Develop and document 10 REST APIs",
      outcomeProcess: "Outcome",
      umsPath: "UMS API Management Module",
      plannerWeightage: "30.00",
      absoluteWeightage: "0.000000",
      outcomeProcessWeightage: "0.000000",
      metricSource: "LPU API Gateway",
      assignToNameUID: "Akhil Sharma",
      departmentName: "Department of Software Development-III",
      assignToType: "Deputy Software Developer (S-II)",
      assignedBy: "Pooja Verma (O-III)",
      targetDate: "30 Jun 2023",
      totalTargetValue: "10",
      quarter1Target: "2",
      quarter2Target: "3",
      quarter3Target: "3",
      quarter4Target: "2",
      achieved: "10",
      pending: "0",
      completed: "Yes",
      actionByHOD: "Approved",
      actionByHOS: "Approved",
      actionBySourceDivision: "Verified",
      finalVerificationAction: "Approved",
      metricPriority: "Medium",
      quarterlyReview: "Q4",
      status: "Marked as complete",
      achievedValue: 10,
      assignedAs: "Faculty"
    }
  ],
  "Raunak Singh": [
    {
      no: 1,
      plannerSession: "Academic Year (Jul 22 - Jun 23)",
      keyIndicator: "Unit Testing",
      metricId: "UT001",
      metricDescription: "Achieve 80% code coverage for all new features",
      outcomeProcess: "Process",
      umsPath: "UMS Testing Module",
      plannerWeightage: "25.00",
      absoluteWeightage: "0.000000",
      outcomeProcessWeightage: "0.000000",
      metricSource: "LPU CI/CD Pipeline",
      assignToNameUID: "Raunak Singh",
      departmentName: "Department of Software Development-III",
      assignToType: "Software Developer (O-I)",
      assignedBy: "Pooja Verma (O-III)",
      targetDate: "30 Jun 2023",
      totalTargetValue: "80",
      quarter1Target: "80",
      quarter2Target: "80",
      quarter3Target: "80",
      quarter4Target: "80",
      achieved: "75",
      pending: "5",
      completed: "No",
      actionByHOD: "Under Review",
      actionByHOS: "Pending Review",
      actionBySourceDivision: "Verified",
      finalVerificationAction: "Pending",
      metricPriority: "Medium",
      quarterlyReview: "Q3",
      status: "Partially achieved",
      achievedValue: 75,
      assignedAs: "Faculty"
    }
  ],
  "Gourav Dhankhar": [
    {
      no: 1,
      plannerSession: "Academic Year (Jul 22 - Jun 23)",
      keyIndicator: "Client Communication",
      metricId: "CC001",
      metricDescription: "Respond to client queries within 4 business hours",
      outcomeProcess: "Process",
      umsPath: "UMS Client Communication Module",
      plannerWeightage: "20.00",
      absoluteWeightage: "0.000000",
      outcomeProcessWeightage: "0.000000",
      metricSource: "LPU CRM System",
      assignToNameUID: "Gourav Dhankhar",
      departmentName: "Department of Software Development-III",
      assignToType: "Assistant Software Developer (S-I)",
      assignedBy: "Pooja Verma (O-III)",
      targetDate: "30 Jun 2023",
      totalTargetValue: "95",
      quarter1Target: "95",
      quarter2Target: "95",
      quarter3Target: "95",
      quarter4Target: "95",
      achieved: "90",
      pending: "5",
      completed: "No",
      actionByHOD: "Under Review",
      actionByHOS: "Pending Review",
      actionBySourceDivision: "Verified",
      finalVerificationAction: "Pending",
      metricPriority: "Low",
      quarterlyReview: "Q3",
      status: "Partially achieved",
      achievedValue: 90,
      assignedAs: "Faculty"
    }
  ],
  "Munish Kumar": [
    {
      no: 1,
      plannerSession: "Academic Year (Jul 22 - Jun 23)",
      keyIndicator: "Deployment Success",
      metricId: "DS001",
      metricDescription: "Achieve 100% successful deployment rate",
      outcomeProcess: "Outcome",
      umsPath: "UMS Deployment Module",
      plannerWeightage: "30.00",
      absoluteWeightage: "0.000000",
      outcomeProcessWeightage: "0.000000",
      metricSource: "LPU DevOps Dashboard",
      assignToNameUID: "Munish Kumar",
      departmentName: "Department of Software Development-III",
      assignToType: "Deputy Software Developer (S-II)",
      assignedBy: "Pooja Verma (O-III)",
      targetDate: "30 Jun 2023",
      totalTargetValue: "100",
      quarter1Target: "100",
      quarter2Target: "100",
      quarter3Target: "100",
      quarter4Target: "100",
      achieved: "98",
      pending: "2",
      completed: "No",
      actionByHOD: "Under Review",
      actionByHOS: "Pending Review",
      actionBySourceDivision: "Verified",
      finalVerificationAction: "Pending",
      metricPriority: "High",
      quarterlyReview: "Q3",
      status: "Partially achieved",
      achievedValue: 98,
      assignedAs: "Staff"
    }
  ]
};

export default function MetricPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "";
  const department = searchParams.get("department") || "";
  const theme = useTheme();

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [activeCardFilter, setActiveCardFilter] = useState<string | null>(null);
  const [showUrgencyIndicators, setShowUrgencyIndicators] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [filters, setFilters] = useState({
    metricPriority: "",
    quarterlyReview: "",
    status: "",
    achievedValueMin: 0,
    achievedValueMax: 100,
    assignedAs: ""
  });

  const resetFilters = () => {
    setFilters({
      metricPriority: "",
      quarterlyReview: "",
      status: "",
      achievedValueMin: 0,
      achievedValueMax: 100,
      assignedAs: ""
    });
    setSearchTerm("");
    setActiveCardFilter(null);
  };

  const handleCardClick = (cardType: string) => {
    if (activeCardFilter === cardType) {
      setActiveCardFilter(null);
    } else {
      setActiveCardFilter(cardType);
    }
    setFilters({
      metricPriority: "",
      quarterlyReview: "",
      status: "",
      achievedValueMin: 0,
      achievedValueMax: 100,
      assignedAs: ""
    });
    setSearchTerm("");
  };

  const handleExportData = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Metrics Data');

    // Define columns with headers
    worksheet.columns = [
      { header: 'No', key: 'no', width: 10 },
      { header: 'Planner Session', key: 'plannerSession', width: 25 },
      { header: 'Key Indicator', key: 'keyIndicator', width: 25 },
      { header: 'Metric Description', key: 'metricDescription', width: 50 },
      { header: 'Outcome Process', key: 'outcomeProcess', width: 15 },
      { header: 'UMS Path', key: 'umsPath', width: 40 },
      { header: 'Planner Weightage', key: 'plannerWeightage', width: 18 },
      { header: 'Absolute Weightage', key: 'absoluteWeightage', width: 18 },
      { header: 'Outcome Process Weightage', key: 'outcomeProcessWeightage', width: 22 },
      { header: 'Metric Source', key: 'metricSource', width: 25 },
      { header: 'Assign To Name UID', key: 'assignToNameUID', width: 30 },
      { header: 'Department Name', key: 'departmentName', width: 30 },
      { header: 'Assign To Type', key: 'assignToType', width: 15 },
      { header: 'Assigned By', key: 'assignedBy', width: 25 },
      { header: 'Target Date', key: 'targetDate', width: 15 },
      { header: 'Total Target Value', key: 'totalTargetValue', width: 18 },
      { header: 'Quarter 1 Target', key: 'quarter1Target', width: 15 },
      { header: 'Quarter 2 Target', key: 'quarter2Target', width: 15 },
      { header: 'Quarter 3 Target', key: 'quarter3Target', width: 15 },
      { header: 'Quarter 4 Target', key: 'quarter4Target', width: 15 },
      { header: 'Achieved', key: 'achieved', width: 12 },
      { header: 'Pending', key: 'pending', width: 12 },
      { header: 'Completed', key: 'completed', width: 25 },
      { header: 'Action By HOD', key: 'actionByHOD', width: 25 },
      { header: 'Action By HOS', key: 'actionByHOS', width: 25 },
      { header: 'Action By Source Division', key: 'actionBySourceDivision', width: 28 },
      { header: 'Final Verification Action', key: 'finalVerificationAction', width: 28 },
      { header: 'Metric Priority', key: 'metricPriority', width: 15 },
      { header: 'Quarterly Review', key: 'quarterlyReview', width: 15 },
      { header: 'Status', key: 'status', width: 35 },
      { header: 'Achieved Value', key: 'achievedValue', width: 15 },
      { header: 'Assigned As', key: 'assignedAs', width: 15 },
    ];

    // Style header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE6F3FF' }
    };

    // Add data rows
    filteredMetrics.forEach(metric => {
      worksheet.addRow({
        no: metric.no,
        plannerSession: metric.plannerSession,
        keyIndicator: metric.keyIndicator,
        metricDescription: metric.metricDescription,
        outcomeProcess: metric.outcomeProcess,
        umsPath: metric.umsPath,
        plannerWeightage: metric.plannerWeightage,
        absoluteWeightage: metric.absoluteWeightage,
        outcomeProcessWeightage: metric.outcomeProcessWeightage,
        metricSource: metric.metricSource,
        assignToNameUID: metric.assignToNameUID,
        departmentName: metric.departmentName,
        assignToType: metric.assignToType,
        assignedBy: metric.assignedBy,
        targetDate: metric.targetDate,
        totalTargetValue: metric.totalTargetValue,
        quarter1Target: metric.quarter1Target,
        quarter2Target: metric.quarter2Target,
        quarter3Target: metric.quarter3Target,
        quarter4Target: metric.quarter4Target,
        achieved: metric.achieved,
        pending: metric.pending,
        completed: metric.completed,
        actionByHOD: metric.actionByHOD,
        actionByHOS: metric.actionByHOS,
        actionBySourceDivision: metric.actionBySourceDivision,
        finalVerificationAction: metric.finalVerificationAction,
        metricPriority: metric.metricPriority,
        quarterlyReview: metric.quarterlyReview,
        status: metric.status,
        achievedValue: metric.achievedValue,
        assignedAs: metric.assignedAs
      });
    });

    // Generate and download file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const currentDate = new Date().toISOString().split('T')[0];
    link.download = `metrics_data_${role}_${currentDate}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const allMetrics = sampleMetrics[role] || [];

  const filteredMetrics = useMemo(() => {
    return allMetrics.filter(metric => {
      if (activeCardFilter) {
        switch (activeCardFilter) {
          case 'completed':
            if (!(metric.completed === 'Yes' || metric.completed.startsWith('Yes') || (metric.achievedValue >= parseFloat(metric.totalTargetValue || '0')))) return false;
            break;
          case 'highPriority':
            if (metric.metricPriority !== 'High') return false;
            break;
          case 'inProgress':
            if (metric.completed === 'Yes' || metric.status === 'Not achieved yet') return false;
            break;
        }
      }

      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = Object.values(metric).some(value =>
          String(value).toLowerCase().includes(searchLower)
        );
        if (!matchesSearch) return false;
      }

      if (filters.metricPriority && metric.metricPriority !== filters.metricPriority) return false;
      if (filters.quarterlyReview && metric.quarterlyReview !== filters.quarterlyReview) return false;
      if (filters.status && metric.status !== filters.status) return false;
      if (metric.achievedValue < filters.achievedValueMin || metric.achievedValue > filters.achievedValueMax) return false;
      if (filters.assignedAs && metric.assignedAs !== filters.assignedAs) return false;

      return true;
    });
  }, [allMetrics, searchTerm, filters, activeCardFilter]);

  const summaryMetrics = useMemo(() => {
    const total = filteredMetrics.length;
    const completed = filteredMetrics.filter(m =>
      m.completed === 'Yes' ||
      m.completed.startsWith('Yes') ||
      (m.achievedValue >= parseFloat(m.totalTargetValue || '0'))
    ).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const highPriority = filteredMetrics.filter(m => m.metricPriority === 'High').length;
    const inProgress = filteredMetrics.filter(m =>
      m.completed !== 'Yes' &&
      !m.completed.startsWith('Yes') &&
      m.achievedValue > 0 &&
      m.achievedValue < parseFloat(m.totalTargetValue || '0')
    ).length;

    return { total, completed, completionRate, highPriority, inProgress };
  }, [filteredMetrics]);

  const getStatusBadge = (status: string, completed: string, achievedValue?: number, totalTarget?: string) => {
    if (completed === 'Yes' || completed.startsWith('Yes')) {
      return (
        <Chip
          icon={<Check />}
          label="Completed"
          color="success"
          size="small"
          variant="outlined"
        />
      );
    }

    const targetNum = parseFloat(totalTarget || '0');
    if (achievedValue !== undefined && targetNum > 0 && achievedValue >= targetNum) {
      return (
        <Chip
          icon={<Check />}
          label="Completed"
          color="success"
          size="small"
          variant="outlined"
        />
      );
    }

    switch (status) {
      case 'Partially achieved':
        return (
          <Chip
            icon={<HourglassEmpty />}
            label="In Progress"
            color="warning"
            size="small"
            variant="outlined"
          />
        );
      case 'Not achieved yet':
        return (
          <Chip
            icon={<Close />}
            label="Not Started"
            color="error"
            size="small"
            variant="outlined"
          />
        );
      case 'Achieved but not marked as achieved':
        return (
          <Chip
            icon={<Schedule />}
            label="Pending Review"
            color="info"
            size="small"
            variant="outlined"
          />
        );
      default:
        return (
          <Chip
            icon={<Schedule />}
            label={status}
            color="default"
            size="small"
            variant="outlined"
          />
        );
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High':
        return (
          <Chip
            icon={<PriorityHigh />}
            label="High"
            color="error"
            size="small"
            variant="outlined"
          />
        );
      case 'Medium':
        return (
          <Chip
            icon={<Schedule />}
            label="Medium"
            color="warning"
            size="small"
            variant="outlined"
          />
        );
      case 'Low':
        return (
          <Chip
            icon={<Check />}
            label="Low"
            color="success"
            size="small"
            variant="outlined"
          />
        );
      default:
        return null;
    }
  };

  const ProgressBar = ({ achieved, target }: { achieved: number; target: string }) => {
    const targetNum = parseFloat(target) || 0;
    const percentage = targetNum > 0 ? Math.min((achieved / targetNum) * 100, 100) : 0;

    return (
      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{
          height: 8,
          borderRadius: 4,
          '& .MuiLinearProgress-bar': {
            backgroundColor: percentage >= 100 ? '#10b981' :
                           percentage >= 75 ? '#3b82f6' :
                           percentage >= 50 ? '#f59e0b' : '#ef4444'
          }
        }}
      />
    );
  };

  const toggleRowExpansion = (index: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  const getUrgencyInfo = (targetDate: string, completed: string) => {
    if (completed === 'Yes' || completed.startsWith('Yes')) {
      return { isUrgent: false, daysLeft: null, urgencyLevel: 'completed' };
    }

    try {
      const target = new Date(targetDate);
      const today = new Date();
      const diffTime = target.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        return { isUrgent: true, daysLeft: diffDays, urgencyLevel: 'overdue' };
      } else if (diffDays <= 7) {
        return { isUrgent: true, daysLeft: diffDays, urgencyLevel: 'critical' };
      } else if (diffDays <= 30) {
        return { isUrgent: true, daysLeft: diffDays, urgencyLevel: 'warning' };
      }
      return { isUrgent: false, daysLeft: diffDays, urgencyLevel: 'normal' };
    } catch {
      return { isUrgent: false, daysLeft: null, urgencyLevel: 'unknown' };
    }
  };

  const UrgencyIndicator = ({ targetDate, completed }: { targetDate: string; completed: string }) => {
    if (!showUrgencyIndicators) return null;

    const urgency = getUrgencyInfo(targetDate, completed);

    if (!urgency.isUrgent) return null;

    const getUrgencyText = () => {
      if (urgency.daysLeft === null) return '';
      if (urgency.daysLeft < 0) return `${Math.abs(urgency.daysLeft)} days overdue`;
      if (urgency.daysLeft === 0) return 'Due today';
      if (urgency.daysLeft === 1) return '1 day left';
      return `${urgency.daysLeft} days left`;
    };

    return (
      <Chip
        icon={<Warning />}
        label={getUrgencyText()}
        color={urgency.urgencyLevel === 'overdue' || urgency.urgencyLevel === 'critical' ? 'error' : 'warning'}
        size="small"
        sx={{ ml: 1 }}
      />
    );
  };

  const BCrumb = [
    { to: "/dashboard/staff", title: "Dashboard" },
    {
      to: "/dashboard/staff/ObpPlanner/ObpDashboard",
      title: "OBP Dashboard",
    },
    { title: `${role} - Metrics` },
  ];

  return (
    <>
      <Breadcrumb title="Metric Details" items={BCrumb} />

      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Paper
          elevation={6}
          sx={{
            borderRadius: 2,
            backgroundColor: "rgba(255, 255, 255, 0.98)",
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              textAlign: "center",
              background: theme.palette.primary.main,
              borderRadius: 2,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              py: 3,
              mb: 4,
              color: "white",
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              {role}
            </Typography>
            <Typography variant="subtitle1">
              Performance Metrics Dashboard
            </Typography>
          </Box>

          {/* Summary Cards */}
          <Box sx={{ px: 3, mb: 4 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': { boxShadow: 2 },
                    ...(activeCardFilter === 'total' && { ring: 2, ringColor: 'blue.500', boxShadow: 2 })
                  }}
                  onClick={() => handleCardClick('total')}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48,
                      mr: 2,
                      bgcolor: 'blue.100',
                      borderRadius: 2
                    }}>
                      <EmojiEvents sx={{ fontSize: 24, color: 'blue.600' }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'grey.600', fontWeight: 'medium' }}>
                        Total Metrics
                      </Typography>
                      <Typography variant="h4" sx={{ color: 'grey.900', fontWeight: 'bold' }}>
                        {summaryMetrics.total}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': { boxShadow: 2 },
                    ...(activeCardFilter === 'completed' && { ring: 2, ringColor: 'green.500', boxShadow: 2 })
                  }}
                  onClick={() => handleCardClick('completed')}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48,
                      mr: 2,
                      bgcolor: 'green.100',
                      borderRadius: 2
                    }}>
                      <Check sx={{ fontSize: 24, color: 'green.600' }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'grey.600', fontWeight: 'medium' }}>
                        Completed
                      </Typography>
                      <Typography variant="h4" sx={{ color: 'grey.900', fontWeight: 'bold' }}>
                        {summaryMetrics.completed}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': { boxShadow: 2 },
                    ...(activeCardFilter === 'inProgress' && { ring: 2, ringColor: 'purple.500', boxShadow: 2 })
                  }}
                  onClick={() => handleCardClick('inProgress')}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48,
                      mr: 2,
                      bgcolor: 'purple.100',
                      borderRadius: 2
                    }}>
                      <Schedule sx={{ fontSize: 24, color: 'purple.600' }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'grey.600', fontWeight: 'medium' }}>
                        In Progress
                      </Typography>
                      <Typography variant="h4" sx={{ color: 'grey.900', fontWeight: 'bold' }}>
                        {summaryMetrics.inProgress}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': { boxShadow: 2 },
                    ...(activeCardFilter === 'highPriority' && { ring: 2, ringColor: 'orange.500', boxShadow: 2 })
                  }}
                  onClick={() => handleCardClick('highPriority')}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48,
                      mr: 2,
                      bgcolor: 'orange.100',
                      borderRadius: 2
                    }}>
                      <PriorityHigh sx={{ fontSize: 24, color: 'orange.600' }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'grey.600', fontWeight: 'medium' }}>
                        High Priority
                      </Typography>
                      <Typography variant="h4" sx={{ color: 'grey.900', fontWeight: 'bold' }}>
                        {summaryMetrics.highPriority}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Controls Section */}
          <Box sx={{ px: 3, mb: 3 }}>
            <Paper sx={{ p: 2, bgcolor: 'orange.100', border: 1, borderColor: 'orange.300', boxShadow: 1 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    placeholder="Search metrics by description, indicator, or source..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'white'
                      }
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      startIcon={<Download />}
                      onClick={handleExportData}
                      sx={{ bgcolor: 'blue.600', '&:hover': { bgcolor: 'blue.700' } }}
                    >
                      Export Data
                    </Button>

                    <Box sx={{ display: 'flex', p: 0.5, bgcolor: 'white', border: 1, borderColor: 'grey.300', borderRadius: 1 }}>
                      <Button
                        variant={viewMode === 'list' ? 'contained' : 'text'}
                        onClick={() => setViewMode('list')}
                        sx={{
                          p: 1,
                          minWidth: 'auto',
                          ...(viewMode === 'list' && { bgcolor: 'blue.600', color: 'white' })
                        }}
                        title="List View"
                      >
                        <List />
                      </Button>
                      <Button
                        variant={viewMode === 'grid' ? 'contained' : 'text'}
                        onClick={() => setViewMode('grid')}
                        sx={{
                          p: 1,
                          minWidth: 'auto',
                          ...(viewMode === 'grid' && { bgcolor: 'blue.600', color: 'white' })
                        }}
                        title="Grid View"
                      >
                        <TableChart />
                      </Button>
                      <Box sx={{ width: '1px', height: 24, mx: 0.5, bgcolor: 'grey.300' }} />
                      <IconButton
                        onClick={() => setIsLegendOpen(!isLegendOpen)}
                        sx={{
                          p: 1,
                          ...(isLegendOpen && { bgcolor: 'grey.100' })
                        }}
                        title="View Legend"
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                        sx={{
                          p: 1,
                          ...(isFiltersOpen && { bgcolor: 'grey.100' })
                        }}
                        title="Filters"
                      >
                        <FilterList />
                      </IconButton>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Box>

          {/* Filter Section */}
          <Accordion expanded={isFiltersOpen} onChange={() => setIsFiltersOpen(!isFiltersOpen)}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Filter Options</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Card>
                <CardHeader
                  action={
                    <Button
                      variant="outlined"
                      startIcon={<Refresh />}
                      onClick={resetFilters}
                      size="small"
                    >
                      Reset Filters
                    </Button>
                  }
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <FormControl fullWidth>
                        <InputLabel>Metric Priority</InputLabel>
                        <Select
                          value={filters.metricPriority}
                          onChange={(e) => setFilters(prev => ({ ...prev, metricPriority: e.target.value }))}
                          label="Metric Priority"
                        >
                          <MenuItem value="High">High</MenuItem>
                          <MenuItem value="Medium">Medium</MenuItem>
                          <MenuItem value="Low">Low</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <FormControl fullWidth>
                        <InputLabel>Quarterly Review</InputLabel>
                        <Select
                          value={filters.quarterlyReview}
                          onChange={(e) => setFilters(prev => ({ ...prev, quarterlyReview: e.target.value }))}
                          label="Quarterly Review"
                        >
                          <MenuItem value="Q1">Q1</MenuItem>
                          <MenuItem value="Q2">Q2</MenuItem>
                          <MenuItem value="Q3">Q3</MenuItem>
                          <MenuItem value="Q4">Q4</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={filters.status}
                          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                          label="Status"
                        >
                          <MenuItem value="Not achieved yet">Not achieved yet</MenuItem>
                          <MenuItem value="Partially achieved">Partially achieved</MenuItem>
                          <MenuItem value="Achieved but not marked as achieved">Achieved but not marked as achieved</MenuItem>
                          <MenuItem value="Marked as complete">Marked as complete</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Achieved Value Between: {filters.achievedValueMin} - {filters.achievedValueMax}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton
                          onClick={() => setFilters(prev => ({ ...prev, achievedValueMin: Math.max(0, prev.achievedValueMin - 1) }))}
                        >
                          <Remove />
                        </IconButton>
                        <Typography variant="body2">
                          {filters.achievedValueMin} - {filters.achievedValueMax}
                        </Typography>
                        <IconButton
                          onClick={() => setFilters(prev => ({ ...prev, achievedValueMin: Math.min(prev.achievedValueMax - 1, prev.achievedValueMin + 1) }))}
                        >
                          <Add />
                        </IconButton>
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <FormControl fullWidth>
                        <InputLabel>Assigned As</InputLabel>
                        <Select
                          value={filters.assignedAs}
                          onChange={(e) => setFilters(prev => ({ ...prev, assignedAs: e.target.value }))}
                          label="Assigned As"
                        >
                          <MenuItem value="Faculty">Faculty</MenuItem>
                          <MenuItem value="Staff">Staff</MenuItem>
                          <MenuItem value="HOD">HOD</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </AccordionDetails>
          </Accordion>

          {/* Legend Section */}
          <Accordion expanded={isLegendOpen} onChange={() => setIsLegendOpen(!isLegendOpen)}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">View Legend</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 3 }}>
                      <Typography variant="h6" sx={{ mb: 2, pb: 1, borderBottom: 1, borderColor: 'grey.200' }}>
                        Status Indicators
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
                          <Box sx={{ width: 16, height: 16, bgcolor: 'red.500', borderRadius: '50%' }} />
                          <Typography variant="body2">Not achieved yet</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
                          <Box sx={{ width: 16, height: 16, bgcolor: 'sky.400', borderRadius: '50%' }} />
                          <Typography variant="body2">Partially achieved</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
                          <Box sx={{ width: 16, height: 16, bgcolor: 'blue.500', borderRadius: '50%' }} />
                          <Typography variant="body2">Achieved but not marked as Complete</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
                          <Box sx={{ width: 16, height: 16, bgcolor: 'yellow.600', borderRadius: '50%' }} />
                          <Typography variant="body2">Achieved & marked as Complete</Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>
                      <Typography variant="h6" sx={{ mb: 2, pb: 1, borderBottom: 1, borderColor: 'grey.200' }}>
                        Approval Indicators
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
                          <Box sx={{ width: 16, height: 16, bgcolor: 'green.400', borderRadius: '50%' }} />
                          <Typography variant="body2">Recommended by HOD/COD</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
                          <Box sx={{ width: 16, height: 16, bgcolor: 'green.600', borderRadius: '50%' }} />
                          <Typography variant="body2">Sanctioned by HOS/HD</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
                          <Box sx={{ width: 16, height: 16, bgcolor: 'green.500', borderRadius: '50%' }} />
                          <Typography variant="body2">Verified by Source Division</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
                          <Box sx={{ width: 16, height: 16, bgcolor: 'green.700', borderRadius: '50%' }} />
                          <Typography variant="body2">Approved by Final Authority</Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>
                      <Typography variant="h6" sx={{ mb: 2, pb: 1, borderBottom: 1, borderColor: 'grey.200' }}>
                        Special Indicators
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
                          <Settings sx={{ fontSize: 16, color: 'grey.600' }} />
                          <Typography variant="body2">Achievement is auto calculated</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
                          <Lightbulb sx={{ fontSize: 16, color: 'grey.800' }} />
                          <Typography variant="body2">Metric is auto allocated</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
                          <Notifications sx={{ fontSize: 16, color: 'blue.600' }} />
                          <Typography variant="body2">Mandatory Metric</Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>
                      <Typography variant="h6" sx={{ mb: 2, pb: 1, borderBottom: 1, borderColor: 'grey.200' }}>
                        Metric Priority
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
                          <Lightbulb sx={{ fontSize: 16, color: 'orange.500' }} />
                          <Typography variant="body2">High Priority</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
                          <Lightbulb sx={{ fontSize: 16, color: 'blue.500' }} />
                          <Typography variant="body2">Medium Priority</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
                          <Lightbulb sx={{ fontSize: 16, color: 'green.500' }} />
                          <Typography variant="body2">Low Priority</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </AccordionDetails>
          </Accordion>

          {/* List/Grid View */}
          {viewMode === 'list' ? (
            <Card sx={{ mt: 3 }}>
              <CardContent sx={{ p: 0 }}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>No</TableCell>
                        <TableCell>Key Indicator</TableCell>
                        <TableCell>Metric Description</TableCell>
                        <TableCell>Priority</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Progress</TableCell>
                        <TableCell>Target</TableCell>
                        <TableCell>Achieved</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredMetrics.map((metric, index) => (
                        <React.Fragment key={`metric-${index}`}>
                          <TableRow
                            sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'grey.50' } }}
                            onClick={() => toggleRowExpansion(index)}
                          >
                            <TableCell sx={{ fontWeight: 'medium' }}>{metric.no}</TableCell>
                            <TableCell sx={{ fontWeight: 'medium' }}>{metric.keyIndicator}</TableCell>
                            <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }} title={metric.metricDescription}>
                              {metric.metricDescription}
                            </TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              {getPriorityBadge(metric.metricPriority)}
                            </TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              {getStatusBadge(metric.status, metric.completed, metric.achievedValue, metric.totalTargetValue)}
                            </TableCell>
                            <TableCell sx={{ width: 200 }} onClick={(e) => e.stopPropagation()}>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <ProgressBar achieved={metric.achievedValue} target={metric.totalTargetValue} />
                                <Typography variant="caption" sx={{ textAlign: 'center', color: 'grey.500' }}>
                                  {Math.round((metric.achievedValue / (parseFloat(metric.totalTargetValue) || 1)) * 100)}%
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'medium' }}>{metric.totalTargetValue}</TableCell>
                            <TableCell sx={{ fontWeight: 'medium', color: 'green.600' }}>{metric.achieved}</TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleRowExpansion(index);
                                  }}
                                >
                                  {expandedRows.has(index) ? <ExpandLess /> : <ExpandMore />}
                                </IconButton>
                                <IconButton size="small">
                                  <Visibility />
                                </IconButton>
                              </Box>
                            </TableCell>
                          </TableRow>
                          {expandedRows.has(index) && (
                            <TableRow>
                              <TableCell colSpan={9} sx={{ p: 0, bgcolor: 'grey.50' }}>
                                <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Typography variant="h6" sx={{ color: 'grey.800' }}>
                                      Complete Metric Details
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                      <Typography variant="body2" sx={{ color: 'grey.500' }}>
                                        ID: {metric.metricId}
                                      </Typography>
                                      <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => setShowUrgencyIndicators(!showUrgencyIndicators)}
                                        sx={{
                                          ...(showUrgencyIndicators && { bgcolor: 'red.50', borderColor: 'red.300', color: 'red.700' })
                                        }}
                                      >
                                        {showUrgencyIndicators ? 'Hide' : 'Show'} Highlight
                                      </Button>
                                    </Box>
                                  </Box>

                                  <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                      <Card sx={{ p: 2, ...(showUrgencyIndicators && { borderLeft: 4, borderColor: 'blue.500' }) }}>
                                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium', color: 'grey.700' }}>
                                          Basic Information
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                          <Typography variant="body2">
                                            <strong>S.No:</strong> {metric.no}
                                          </Typography>
                                          <Typography variant="body2">
                                            <strong>Planner Session:</strong> {metric.plannerSession}
                                          </Typography>
                                          <Typography variant="body2">
                                            <strong>Key Indicator:</strong> {metric.keyIndicator}
                                          </Typography>
                                          <Typography variant="body2">
                                            <strong>Type:</strong> {metric.outcomeProcess}
                                          </Typography>
                                        </Box>
                                      </Card>
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 4 }}>
                                      <Card sx={{ p: 2, ...(showUrgencyIndicators && { borderLeft: 4, borderColor: 'green.500' }) }}>
                                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium', color: 'grey.700' }}>
                                          Targets & Progress
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                          <Typography variant="body2">
                                            <strong>Total Target:</strong> {metric.totalTargetValue}
                                          </Typography>
                                          <Typography variant="body2">
                                            <strong>Achieved:</strong> {metric.achieved}
                                          </Typography>
                                          <Typography variant="body2">
                                            <strong>Pending:</strong> {metric.pending}
                                          </Typography>
                                          <Typography variant="body2">
                                            <strong>Status:</strong> {metric.completed}
                                          </Typography>
                                        </Box>
                                      </Card>
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 4 }}>
                                      <Card sx={{ p: 2, ...(showUrgencyIndicators && { borderLeft: 4, borderColor: 'purple.500' }) }}>
                                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium', color: 'grey.700' }}>
                                          Weightage & Source
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                          <Typography variant="body2">
                                            <strong>Planner Weightage:</strong> {metric.plannerWeightage}%
                                          </Typography>
                                          <Typography variant="body2">
                                            <strong>Absolute Weightage:</strong> {metric.absoluteWeightage}
                                          </Typography>
                                          <Typography variant="body2">
                                            <strong>Process Weightage:</strong> {metric.outcomeProcessWeightage}
                                          </Typography>
                                          <Typography variant="body2">
                                            <strong>Source:</strong> {metric.metricSource}
                                          </Typography>
                                        </Box>
                                      </Card>
                                    </Grid>
                                  </Grid>
                                </Box>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {filteredMetrics.map((metric, index) => (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={index}>
                  <Card sx={{ p: 3, borderLeft: 4, borderColor: 'blue.500', boxShadow: 2, '&:hover': { boxShadow: 4 } }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: 'grey.800' }}>
                            {metric.keyIndicator}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'grey.600', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                            {metric.metricDescription}
                          </Typography>
                        </Box>
                        <Box sx={{ ml: 1 }}>
                          {getPriorityBadge(metric.metricPriority)}
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ color: 'grey.500' }}>
                          <strong>Assigned:</strong> {metric.assignToNameUID.split(' ')[0]}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'grey.500' }}>
                          <strong>Target:</strong> {metric.targetDate}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>Progress:</Typography>
                          <Typography variant="body2" sx={{ color: 'grey.600' }}>
                            {metric.achieved} / {metric.totalTargetValue}
                          </Typography>
                        </Box>
                        <ProgressBar achieved={metric.achievedValue} target={metric.totalTargetValue} />
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: 1, borderColor: 'grey.200' }}>
                        <Typography variant="body2">
                          <strong>Status:</strong>
                        </Typography>
                        {getStatusBadge(metric.status, metric.completed)}
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {filteredMetrics.length === 0 && (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: 'grey.500' }}>
                No metrics found for this role.
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </>
  );
}
