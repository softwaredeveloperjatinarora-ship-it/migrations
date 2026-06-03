"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import SchoolIcon from "@mui/icons-material/School";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import RateReviewIcon from "@mui/icons-material/RateReview";
import Breadcrumb from "@/app/dashboard/staff/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import ChildCard from "@/app/components/shared/ChildCard";
import type { ApiActionResult } from "@/app/api/interfaces/semesterExchange/interfaces";
import {
  getAllApplicationsAction,
  getAllRemarksAction,
  getUniversitiesAction,
} from "@/app/actions/StaffActions/SemesterExchange/semesterExchangeActions";

const BCrumb = [
  { to: "/dashboard/staff", title: "Home", icon: "ic:baseline-home" },
  { title: "Semester Exchange" },
];

type TabKey = "applications" | "universities" | "remarks";
type RowRecord = Record<string, unknown>;

interface TabConfig {
  key: TabKey;
  label: string;
  icon: React.ReactElement;
  load: () => Promise<ApiActionResult<unknown>>;
  columns: string[];
}

const preferredColumns: Record<TabKey, string[]> = {
  applications: ["ApplicationId", "RegistrationNo", "RegNo", "StudentName", "Name", "ProgramCode", "UniversityName", "Status"],
  universities: ["UniversityId", "UniversityName", "Country", "ProgramCode", "IsActive"],
  remarks: ["RegistrationNo", "RegNo", "StudentName", "Name", "Remarks", "CreatedBy", "CreatedOn"],
};

function normalizeRows(data: unknown): RowRecord[] {
  if (Array.isArray(data)) return data.filter((item): item is RowRecord => Boolean(item) && typeof item === "object");
  if (data && typeof data === "object") {
    const objectData = data as Record<string, unknown>;
    const arrayValue = Object.values(objectData).find(Array.isArray);
    if (Array.isArray(arrayValue)) return normalizeRows(arrayValue);
    return [objectData];
  }
  return [];
}

function formatCell(value: unknown) {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function getColumns(rows: RowRecord[], configuredColumns: string[]) {
  const available = new Set(rows.flatMap((row) => Object.keys(row)));
  const preferred = configuredColumns.filter((column) => available.has(column));
  const fallback = Array.from(available).filter((column) => !preferred.includes(column)).slice(0, 8 - preferred.length);
  return [...preferred, ...fallback].slice(0, 8);
}

const SemesterExchangeDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("applications");
  const [rows, setRows] = useState<RowRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const tabs = useMemo<TabConfig[]>(
    () => [
      {
        key: "applications",
        label: "Applications",
        icon: <SchoolIcon fontSize="small" />,
        load: getAllApplicationsAction,
        columns: preferredColumns.applications,
      },
      {
        key: "universities",
        label: "Universities",
        icon: <AccountBalanceIcon fontSize="small" />,
        load: getUniversitiesAction,
        columns: preferredColumns.universities,
      },
      {
        key: "remarks",
        label: "Remarks",
        icon: <RateReviewIcon fontSize="small" />,
        load: getAllRemarksAction,
        columns: preferredColumns.remarks,
      },
    ],
    [],
  );

  const currentTab = tabs.find((tab) => tab.key === activeTab) ?? tabs[0];

  const loadRows = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await currentTab.load();
      if (response.status === "error") {
        setRows([]);
        setError(response.message);
        return;
      }
      setRows(normalizeRows(response.ApiData));
    } catch (err) {
      setRows([]);
      setError(err instanceof Error ? err.message : "Unable to load data");
    } finally {
      setLoading(false);
    }
  }, [currentTab]);

  useEffect(() => {
    loadRows();
  }, [loadRows]);

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return rows;
    return rows.filter((row) => Object.values(row).some((value) => formatCell(value).toLowerCase().includes(normalizedQuery)));
  }, [query, rows]);

  const columns = useMemo(() => getColumns(filteredRows, currentTab.columns), [currentTab.columns, filteredRows]);

  return (
    <>
      <Breadcrumb title="Semester Exchange" items={BCrumb} titleIcon="mdi:school-outline" />

      <ChildCard>
        <Stack spacing={2}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between" alignItems={{ xs: "stretch", md: "center" }}>
            <Box>
              <Typography variant="h6">Semester Exchange Management</Typography>
              <Typography variant="body2" color="text.secondary">
                Staff module for Semester Exchange application, university, and remarks workflows.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip label={`${filteredRows.length} records`} color="primary" variant="outlined" />
              <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadRows} disabled={loading}>
                Refresh
              </Button>
            </Stack>
          </Stack>

          <Tabs
            value={activeTab}
            onChange={(_, value: TabKey) => {
              setQuery("");
              setActiveTab(value);
            }}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            {tabs.map((tab) => (
              <Tab key={tab.key} value={tab.key} icon={tab.icon} iconPosition="start" label={tab.label} />
            ))}
          </Tabs>

          <TextField
            size="small"
            label="Search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            sx={{ maxWidth: { md: 360 } }}
            fullWidth
          />

          {error && <Alert severity="error">{error}</Alert>}

          <Card variant="outlined" sx={{ borderRadius: 1 }}>
            {loading ? (
              <Stack minHeight={260} alignItems="center" justifyContent="center" spacing={1}>
                <CircularProgress size={28} />
                <Typography variant="body2" color="text.secondary">
                  Loading {currentTab.label.toLowerCase()}
                </Typography>
              </Stack>
            ) : filteredRows.length === 0 ? (
              <Stack minHeight={220} alignItems="center" justifyContent="center">
                <Typography variant="body2" color="text.secondary">
                  No records found.
                </Typography>
              </Stack>
            ) : (
              <TableContainer sx={{ maxHeight: 560 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell key={column} sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                          {column}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredRows.map((row, index) => (
                      <TableRow key={`${activeTab}-${index}`} hover>
                        {columns.map((column) => (
                          <TableCell key={column} sx={{ maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {formatCell(row[column])}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Card>
        </Stack>
      </ChildCard>
    </>
  );
};

export default SemesterExchangeDashboard;
