"use client";

import { ColumnDef } from "@tanstack/react-table";
import { OBPProjectData } from "../../../api/interfaces/ObpStatusInterface/obpStatus";
import { AttachFile, Chat, Download, VerifiedUser } from "@mui/icons-material";
import { Box, IconButton, Typography, Chip, Button } from "@mui/material";
import { DownloadSupportingDocument } from "@/app/actions/StaffActions/ObpStatusAction/DownloadSupportingDocumentAction";

/*
// Helper function to extract reference number from metric description
// Example: "Drawing No.425055 Main Gate ( Project ID- 0123 ) :: LIT/11/CLW/2024/005(Vol-6)/NS/250603/0001)" -> "LIT/11/CLW/2024/005(Vol-6)/NS/250603/0001)"
const extractReferenceNo = (metricDescription: string): string => {
  if (!metricDescription) return '';
  const parts = metricDescription.split('::');
  return parts.length > 1 ? parts[1].trim() : '';
};
*/
const formatStatusText = (status: string): string => {
  return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

// Helper function to display "NA" for missing data
const displayValue = (value: any): string => {
  if (value === null || value === undefined || value === "" || value === "NA" || value === "na" || value === "null" || value === "undefined") {
    return "NA";
  }
  return value;
};

// Helper function to check if value is missing or NA
const isMissingOrNA = (value: any): boolean => {
  return value === null || value === undefined || value === "" || value === "NA" || value === "na" || value === "null" || value === "undefined";
};

// Open noting sheet redirect function
const openNotingSheetRedirect = (notingSheetId: string, metricDescription: string, metricId: number) => {
  // Strip HTML tags from notingSheetId to remove unwanted content like </strong>
  const cleanNotingSheetId = notingSheetId.replace(/<[^>]*>/g, '');
  if (!cleanNotingSheetId) return;
  
  let baseurl = 'https://ums.lpu.in/lpuums/';
  // Commenting out reference number for now as per requirement
  // const referenceNo = extractReferenceNo(metricDescription);
  const url: string = baseurl + 'frmOnlineNotingSheetPrint.aspx?NotingSheetID=' + cleanNotingSheetId + '&Type=Details';

  const width = 900;
  const height = 600;

  const left = (window.screen.width - width) / 2;
  const top = (window.screen.height - height) / 2;

  window.open(
    url,
    '_blank',
    `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,noopener,noreferrer`
  );
};

// Status badge component for consistent styling - supports both filled and outlined variants
const StatusBadge = ({ status, variant = "outlined" }: { status: string; variant?: "filled" | "outlined" }) => {
  const getChipProps = (status: string) => {
    const displayStatus = status === "in_progress" ? "inprogress" : status;
    // Color coding: finalized=green, pending=orange, awaited=blue
    switch (displayStatus.toLowerCase()) {
      case "finalized":
        return { color: "success" as const }; // Green
      case "pending":
        return { color: "warning" as const }; // Orange
      case "awaited":
        return { color: "info" as const }; // Blue
      case "done":
        return { color: "success" as const }; // Green
      case "inprogress":
        return { color: "info" as const }; // Blue
      case "completed":
        return { color: "success" as const }; // Green
      default:
        return { color: "default" as const };
    }
  };

  return (
    <Chip
      label={formatStatusText(status === "in_progress" ? "inprogress" : status)}
      size="small"
      variant={variant}
      {...getChipProps(status)}
      sx={{ fontSize: '0.75rem', fontWeight: 500 }}
    />
  );
};

// Priority badge component
const PriorityBadge = ({ priority }: { priority: string }) => {
  const getChipProps = (priority: string) => {
    switch (priority) {
      case "High":
        return { color: "error" as const, variant: "outlined" as const };
      case "Medium":
        return { color: "warning" as const, variant: "outlined" as const };
      case "Low":
        return { color: "info" as const, variant: "outlined" as const };
      default:
        return { color: "default" as const, variant: "outlined" as const };
    }
  };

  return (
    <Chip
      label={priority}
      size="small"
      {...getChipProps(priority)}
      sx={{ fontSize: '0.75rem', fontWeight: 500 }}
    />
  );
};

// Department color/styling configuration
const departmentStyles: Record<number, { bgColor: string; borderColor: string; textColor: string; icon: string }> = {
  38: { bgColor: '#ccfbf1', borderColor: '#14b8a6', textColor: '#134e4a', icon: '🏗️' }, // Civil - Teal
  58: { bgColor: '#dbeafe', borderColor: '#3b82f6', textColor: '#1e40af', icon: '⚡' }, // Electrical - Blue
  59: { bgColor: '#fce7f3', borderColor: '#ec4899', textColor: '#9d174d', icon: '🎨' }, // Architecture - Pink
  60: { bgColor: '#dcfce7', borderColor: '#22c55e', textColor: '#166534', icon: '💻' }, // IT - Green
  61: { bgColor: '#fae8ff', borderColor: '#a855f7', textColor: '#6b21a8', icon: '🖥️' }, // IT Infra - Purple
};

// Get department style based on divisionId
export const getDepartmentStyle = (divisionId: number) => {
  return departmentStyles[divisionId] || { bgColor: '#f3f4f6', borderColor: '#9ca3af', textColor: '#374151', icon: '📋' };
};

// Fixed step labels that act as row headers - independent of data
// For rows 6.1-6.11, the sNo shows the sub-step number and the label is shown in the Steps column
// Row 6 (index 5) will have rowSpan for the Steps column to span from 6 to 6.11
const baseSteps = [
  { sNo: "1", label: "Go Ahead Date / Completion Date", isSubStep: false },
  { sNo: "2", label: "Location", isSubStep: false },
  { sNo: "3", label: "Architect Drawing", isSubStep: false },
  { sNo: "4", label: "Structure Drawing", isSubStep: false },
  { sNo: "5", label: "Verification of Structure and Architect Drawing", isSubStep: false },
  { sNo: "6", label: "Metrics and its stages for (Project Name)", isSubStep: false, hasSubSteps: true },
];

// Download file helper function
const downloadFile = async (folderPath: string, fileName: string) => {
  if (!folderPath || !fileName) {
    alert('No file available for download');
    return;
  }
  
  const response = await DownloadSupportingDocument(folderPath, fileName);

  if (response?.status !== "ok") {
    console.error("Download failed:", response?.message);
    alert('Failed to download file');
    return;
  }

  const { base64, mime, filename: serverFilename } = response;

  if (!base64) {
    console.error("Error: No base64 received from server");
    alert('Failed to download file');
    return;
  }

  // Decode base64 -> Uint8Array
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);

  // Create blob and download
  const blob = new Blob([bytes], { type: mime || 'application/pdf' });
  const blobUrl = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = serverFilename || fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(blobUrl);
};

export const getColumns = (fixedSteps: any[], projectName: string = '', employeeName: string = '', onChatClick?: (metricId: number, stageDescription: string) => void, onArchitectChatClick?: (metricId: number, drawingNo: string) => void): ColumnDef<OBPProjectData>[] => [
// S.No column - uses fixed sNo from fixedSteps array based on row index
// For rows 6.1-6.11, shows the sub-step number (6.1, 6.2, etc.)
{
  id: "sNo",
  header: () => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, fontWeight: 600 }}>
      <Typography>#️⃣</Typography>
      <Typography>S.No</Typography>
    </Box>
  ),
  columns: [
    {
      accessorKey: "sNo",
      header: "",
      size: 80,
      cell: ({ row }) => {
        // Get the fixed sNo based on row index
        const step = fixedSteps[row.index];
        const sNo = step?.sNo || "";
        // For sub-steps (6.1-6.11), show the sub-step number
        return (
          <Box sx={{ textAlign: 'center', fontFamily: 'monospace', fontSize: '0.875rem' }}>{sNo}</Box>
        );
      },
    }
  ]
},

  // Steps column - uses fixed labels from fixedSteps array based on row index
  // For row 6, the cell will have rowSpan to cover rows 6 through 6.11 (12 rows total)
  // For rows 6.1-6.11, the Steps cell should be hidden (handled in OBPStatusModal)
  {
    id: "steps",
    header: () => (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, fontWeight: 600 }}>
        {projectName && <Typography sx={{ fontSize: '0.75rem', fontWeight: 400, color: '#6b7280' }}>{projectName}</Typography>}
        {/* Commented out as per requirement
        {employeeName && <Typography sx={{ fontSize: '0.7rem', fontWeight: 400, color: '#6b7280' }}>👤 {employeeName}</Typography>}
        */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <Typography>📋</Typography>
          <Typography>Steps</Typography>
        </Box>
      </Box>
    ),
    columns: [
      {
        id: "stepsCell",
        accessorKey: "steps",
        header: "",
        size: 500,
        cell: ({ row }) => {
          const step = fixedSteps[row.index];
          // For sub-steps that are not division headers, return null - the cell will be hidden via rowSpan
          if (step?.isSubStep && !step?.isDivisionHeader) {
            return null;
          }
          // Get the fixed step label based on row index
          const stepLabel = step?.label || "";
          if (row.index === 0) {
            // Stack "Go Ahead Date" and "Completion Date" for row 1
            return (
              <Box sx={{ fontWeight: 700, fontSize: '0.85rem', textAlign: 'center', borderRadius: '0.25rem', lineHeight: 1.6 }}>
                <Box>Go Ahead Date</Box>
                <Box>Completion Date</Box>
              </Box>
            );
          }
          // For steps 2-5 (indices 1-4), show with blue background
          if (row.index >= 1 && row.index <= 4) {
            return (
              <Box sx={{ fontWeight: 500, fontSize: '0.75rem', textAlign: 'center',borderRadius: '0.25rem' }}>
                {stepLabel}
              </Box>
            );
          }
          // For step 6 (index 5), show with project name dynamically
          if (row.index === 5) {
            return (
              <Box sx={{ fontWeight: 600, fontSize: '0.875rem', textAlign: 'center', borderRadius: '0.25rem' }}>
                Metrics and its stages for {projectName || '(Project Name)'}
              </Box>
            );
          }
          // For division headers, make them bold with department-specific styling
          // Display: Department name (top, left-aligned) and Project name (bottom, right-aligned)
          if (step?.isDivisionHeader) {
            const deptStyle = getDepartmentStyle(step.divisionId || 0);
            return (
              <Box sx={{
                backgroundColor: deptStyle.bgColor,
                border: `2px solid ${deptStyle.borderColor}`,
                borderRadius: '6px',
                padding: '6px 8px',
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minWidth: 0,
              }}>
                {/* Department name - top with icon */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '8px', lineHeight: 1, flexShrink: 0 }}>{deptStyle.icon}</Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.65rem', color: deptStyle.textColor, textAlign: 'left', lineHeight: 1.2 }}>
                    {stepLabel}
                  </Typography>
                </Box>
                {/* Project name - bottom */}
                {projectName && (
                  <Typography sx={{
                    fontWeight: 500,
                    fontSize: '0.6rem',
                    color: deptStyle.textColor,
                    textAlign: 'left',
                    opacity: 0.85,
                    mt: 0.25,
                  }}>
                    📁 {projectName}
                  </Typography>
                )}
              </Box>
            );
          }
          return (
            <Box sx={{ fontWeight: 500, fontSize: '0.75rem', textAlign: 'center' }}>{stepLabel}</Box>
          );
        },
        meta: {
          // Custom meta to indicate this column needs special rowSpan handling
          getRowSpan: (rowIndex: number) => {
            // Row 6 (index 5) should span 12 rows (6 + 6.1 through 6.11)
            if (rowIndex === 5) return 12;
            // Sub-steps should be hidden (rowSpan 0 means skip)
            if (fixedSteps[rowIndex]?.isSubStep) return 0;
            return 1;
          }
        }
      }
    ]
  },

  // Architect Group
  {
    id: "architect",
    header: () => (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, fontWeight: 600 }}>
        <Typography>📋</Typography>
        <Typography>Architect</Typography>
      </Box>
    ),
    columns: [
      {
        accessorKey: "architect.statusOfDrawing",
        header: "Status of Drawing",
        size: 150,
        cell: ({ row }) => {
          // For step 6 (index 5), return empty like a parent row
          if (row.index === 5) {
            return null;
          }
          // For sub-steps (row.index >= 6)
          if (row.index >= 6) {
            const status = row.original.architect.statusOfDrawing;
            if (isMissingOrNA(status)) {
              return null;
            }
            // If status is a drawing number (not a status), show with "Drawing No."
            if (!["done", "pending", "inprogress", "in_progress", "na"].includes(status.toLowerCase())) {
              const fileUpload = (row.original as any).fileUpload || "";
              const rowMetricId = (row.original as any).metricId || 0;
              return (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0.5, width: '100%' }}>
                  <Box sx={{ fontSize: '0.7rem', fontWeight: 700, textAlign: 'center', color: '#000000', py: 0.5, px: 1, borderRadius: '0.25rem', flex: 1 }}>
                    <Typography component="strong"> Drawing No.</Typography> {status}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, flexShrink: 0 }}>
                    {!isMissingOrNA(status) && fileUpload && (
                      <IconButton
                        size="small"
                        onClick={async (e) => {
                          e.stopPropagation();
                          const fileUploadFolder = (row.original as any).fileUploadFolder || "";
                          await downloadFile(fileUploadFolder, fileUpload);
                        }}
                        title="Download drawing"
                      >
                        <Download sx={{ color: '#1976d2', fontSize: 18 }} />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              );
            }
            return <StatusBadge status={status} />;
          }
          const status = row.original.architect.statusOfDrawing;
          if (isMissingOrNA(status)) {
            // For step 1 (Go Ahead/Completion Date), show nothing - dates are in Date column
            if (row.index === 0) {
              return null;
            }
            return null;
          }
          // Show status as badge for color
          const displayStatus = status === "in_progress" ? "inprogress" : status;

          // For row 6 (index 5), return empty like a parent row
          if (row.index === 5) {
            return null;
          }

          // For Location row (index 1), show location and surrounding; hide badge if finalized
          if (row.index === 1) {
            const blockSector = (row.original as any).blockSector || "";
            const surrounding = (row.original as any).surrounding || "";
            const isFinalized = displayStatus.toLowerCase() === "finalized";
            return (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                {!isFinalized && <StatusBadge status={displayStatus} variant="filled" />}
                {blockSector && (
                  <Typography sx={{ fontSize: '0.7rem', color: '#374151', fontWeight: 500 }}>
                    📍 {blockSector}
                  </Typography>
                )}
                {surrounding && (
                  <Typography sx={{ fontSize: '0.7rem', color: '#4b5563', fontWeight: 400 }}>
                    🔑 {surrounding}
                  </Typography>
                )}
              </Box>
            );
          }

          // For Architect Drawing row (index 2), show status badge + chat icon
          if (row.index === 2) {
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                <StatusBadge status={displayStatus} variant="filled" />
                {onArchitectChatClick && (
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onArchitectChatClick(0, '');
                    }}
                    title="Architect Drawing Follow Up Chat"
                    sx={{ color: '#ec4899', cursor: 'pointer', '&:hover': { color: '#9d174d', cursor: 'pointer' } }}
                  >
                    <Chat sx={{ fontSize: 18 }} />
                  </IconButton>
                )}
              </Box>
            );
          }

          // For Structure Drawing (row index 3), add download icon to the right of status
          if (row.index === 3) {
            const fileName = (row.original as any).fileName || "";
            const verifyFileName = (row.original as any).verifyFileName || "";
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                <StatusBadge status={displayStatus} variant="filled" />
                {fileName && (
                  <IconButton
                    size="small"
                    onClick={async (e) => {
                      e.stopPropagation();
                      const folderPath = (row.original as any).folderName || "";
                      await downloadFile(folderPath, fileName);
                    }}
                    title="Download Structure Drawing"
                  >
                    <Download sx={{ fontSize: 16 }} />
                  </IconButton>
                )}
                {verifyFileName && (
                  <IconButton
                    size="small"
                    onClick={async (e) => {
                      e.stopPropagation();
                      const folderPath = (row.original as any).folderName || "";
                      await downloadFile(folderPath, verifyFileName);
                    }}
                    title="Download Verification Drawing"
                  >
                    <VerifiedUser sx={{ fontSize: 16, color: '#9c27b0' }} />
                  </IconButton>
                )}
              </Box>
            );
          }

          return <Box sx={{ display: 'flex', justifyContent: 'center' }}><StatusBadge status={displayStatus} variant="filled" /></Box>;
        },
      },
      {
        id: "architect.dates",
        header: "Dates",
        size: 240,
        cell: ({ row }) => {
          // For row 6 (index 5), return empty
          if (row.index === 5) {
            return null;
          }
          // For sub-steps (row.index >= 6)
          if (row.index >= 6) {
            const startDate = row.original.architect.startDate;
            const endDate = row.original.architect.endDate;
            const architectureIssueDate = (row.original as any).architectureIssueDate || "";
            // For metric rows - show architecture issue date if available, otherwise show end date
            if (architectureIssueDate && !isMissingOrNA(architectureIssueDate)) {
              return (
                <Box sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#1f2937', textAlign: 'center',  py: 0.5, px: 1, borderRadius: '0.25rem' }}>
                  <Typography component="strong">Issue Date:</Typography> {architectureIssueDate}
                </Box>
              );
            }
            // Fallback: show end date if only endDate is set (original logic)
            if (endDate && startDate === "" && !isMissingOrNA(endDate)) {
              return (
                <Box sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#1f2937', textAlign: 'center',  py: 0.5, px: 1, borderRadius: '0.25rem' }}>
                  <Typography component="strong">End Date:</Typography> {endDate}
                </Box>
              );
            }
            // For stage rows, show start and end dates
            const dates: string[] = [];
            // Filter out NA/na strings and empty values, only add valid dates
            if (startDate && startDate !== "" && startDate.toLowerCase() !== "na" && !isNaN(new Date(startDate).getTime())) {
              dates.push(new Date(startDate).toLocaleDateString());
            }
            if (endDate && endDate !== "" && endDate.toLowerCase() !== "na" && !isNaN(new Date(endDate).getTime())) {
              dates.push(new Date(endDate).toLocaleDateString());
            }
            // If no valid dates, return empty cell
            if (dates.length === 0) {
              return null;
            }
            // If only one date is valid, show it alone; if both, show as range
            if (dates.length === 1) {
              return (
                <Box sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#1f2937', textAlign: 'center', py: 0.5, px: 1, borderRadius: '0.25rem' }}>
                  {dates[0]}
                </Box>
              );
            }
            return (
              <Box sx={{ p: 0 }} className="text-center text-xs text-gray-700">
                {dates.map((date, index) => (
                  <Box component="div" key={index}>{date}</Box>
                ))}
              </Box>
            );
          }
          // For Location row (index 1), show who updated it
          if (row.index === 1) {
            const locationEmployeeName = (row.original as any).locationEmployeeName || "";
            const locationDateTime = (row.original as any).locationDateTime || "";
            const formattedDt = locationDateTime ? new Date(locationDateTime).toLocaleString() : "";
            if (!locationEmployeeName && !formattedDt) return null;
            return (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                {locationEmployeeName && (
                  <Typography sx={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 500, whiteSpace: 'nowrap' }}>
                    👤 {locationEmployeeName}
                  </Typography>
                )}
                {formattedDt && (
                  <Typography sx={{ fontSize: '0.65rem', color: '#9ca3af', whiteSpace: 'nowrap' }}>
                    🕐 {formattedDt}
                  </Typography>
                )}
              </Box>
            );
          }

          // For Structure Drawing row (index 3), show employee name + datetime
          if (row.index === 3) {
            const rawEmployeeName = (row.original as any).employeeName || "";
            const employeeParts = rawEmployeeName.includes('::') ? rawEmployeeName.split('::') : null;
            const employeeDisplayName = employeeParts ? `${employeeParts[0].trim()} | ${employeeParts.slice(1).join('::').trim()}` : rawEmployeeName;
            const structureDt = (row.original as any).structureDrawingDateTime || "";
            const formattedDt = structureDt ? new Date(structureDt).toLocaleString() : "";
            if (!employeeDisplayName && !formattedDt) return null;
            return (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                {employeeDisplayName && (
                  <Typography sx={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 500, whiteSpace: 'nowrap' }}>
                    👤 {employeeDisplayName}
                  </Typography>
                )}
                {formattedDt && (
                  <Typography sx={{ fontSize: '0.65rem', color: '#9ca3af', whiteSpace: 'nowrap' }}>
                    🕐 {formattedDt}
                  </Typography>
                )}
              </Box>
            );
          }

          // For main rows (indices 0-4)
          const startDate = row.original.architect.startDate;
          const endDate = row.original.architect.endDate;
          const dates: string[] = [];
          // Filter out NA/na strings and empty values, only add valid dates
          if (startDate && startDate !== "" && startDate.toLowerCase() !== "na" && !isNaN(new Date(startDate).getTime())) {
            dates.push(new Date(startDate).toLocaleDateString());
          }
          if (endDate && endDate !== "" && endDate.toLowerCase() !== "na" && !isNaN(new Date(endDate).getTime())) {
            dates.push(new Date(endDate).toLocaleDateString());
          }
          // If no valid dates, return empty cell
          if (dates.length === 0) {
            return null;
          }
          // If only one date is valid, show it alone; if both, show as range
          if (dates.length === 1) {
            return (
              <Box sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#1f2937', textAlign: 'center', py: 0.5, px: 1, borderRadius: '0.25rem' }}>
                {dates[0]}
              </Box>
            );
          }
          // Row 0 (Go Ahead / Completion Date) — large bold centered
          if (row.index === 0) {
            return (
              <Box sx={{ textAlign: 'center', lineHeight: 1.8 }}>
                {dates.map((date, index) => (
                  <Box component="div" key={index} sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#1f2937' }}>{date}</Box>
                ))}
              </Box>
            );
          }
          return (
            <Box sx={{ p: 0 }} className="text-center text-xs text-gray-700">
              {dates.map((date, index) => (
                <Box component="div" key={index}>{date}</Box>
              ))}
            </Box>
          );
        },
      },
    ],
  },



  // Department Wise Steps - For sub-steps (6.1-6.11), show the step label as a centered header
  {
    id: "departmentWiseSteps",
    header: () => (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, fontWeight: 600 }}>
        {projectName && <Typography sx={{ fontSize: '0.75rem', fontWeight: 400, color: '#6b7280' }}>{projectName}</Typography>}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <Typography>🏢</Typography>
          <Typography>Department Wise Steps</Typography>
        </Box>
      </Box>
    ),
    columns: [
      {
        accessorKey: "departmentWiseSteps",
        header: "",
        cell: ({ row }) => {
          const step = fixedSteps[row.index];
          const isMetricRow = step?.label.startsWith("Metric ID:");
          
          // Get notingSheetId and metricId from row.original
          const notingSheetId = (row.original as any).notingSheetId || "";
          const metricId = (row.original as any).metricId || 0;
          
          // For division headers, show nothing in departmentWiseSteps
          if (step?.isDivisionHeader) {
            return null;
          }
          
          if (isMetricRow) {
            // Get the metric description text
            const metricDescription = row.original.departmentWiseSteps || "";
            const totalFollowupCount = (row.original as any).totalFollowupCount || 0;
            const divisionId = step?.divisionId || 0;
            const deptStyle = getDepartmentStyle(divisionId);
            
            return (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'flex-start', 
                gap: '8px', 
                padding: '4px 12px', 
                backgroundColor: deptStyle.bgColor, 
                borderRadius: '8px',
                marginLeft: divisionId !== 0 ? '20px' : '0',
                marginRight: '8px',
                width: '100%',
              }}>
                <Box className="flex items-center gap-2">
                  <Box component="span" sx={{ fontSize: '16px' }}>{deptStyle.icon}</Box>
                  <Box component="span" className="text-sm font-bold" sx={{ color: deptStyle.textColor }} dangerouslySetInnerHTML={{ __html: metricDescription.replace(/<\/?strong>/g, '') }} />
                </Box>
                {totalFollowupCount > 0 && (
                  <Box component="span" sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '22px',
                    height: '24px',
                    padding: '0 8px',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: '700',
                    borderRadius: '9999px',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                  }}>
                    {totalFollowupCount}
                  </Box>
                )}
              </Box>
            );
          }
          
          // For sub-steps (metrics and stages), show the departmentWiseSteps with multi-line support
          if (step?.isSubStep) {
            const value = row.getValue("departmentWiseSteps") as string;
            const isStageRow = step?.label.startsWith("Stage");
            const stageMetricCount = (row.original as any).stageMetricCount || 0;
            const metricId = (row.original as any).metricId || 0;
            
            if (isStageRow) {
              // For stage rows, show the stage info with chat button and engineer name inline
              const stageDescription = step?.label || '';
              const divisionId = step?.divisionId || 0;
              const deptStyle = getDepartmentStyle(divisionId);
              const engineerName = (row.original as any).engineerName || "";
              
              // Combine stage description with engineer name inline
              const displayText = engineerName 
                ? `${stageDescription} <span style="font-size: 11px; color: #666; margin-left: 8px;">(${engineerName})</span>`
                : stageDescription;
              
              return (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  gap: '8px', 
                  padding: '4px 12px', 
                  backgroundColor: deptStyle.bgColor, 
                  border: `1px solid ${deptStyle.borderColor}`,
                  borderRadius: '8px',
                  marginLeft: divisionId !== 0 ? '20px' : '0',
                  marginRight: '8px',
                  width: '100%',
                }}>
                  <Box className="flex items-center gap-2" sx={{ flex: 1, minWidth: 0 }}>
                    <Box component="span" sx={{ fontSize: '16px' }}>{deptStyle.icon}</Box>
                    <Box component="span" className="text-sm font-bold" sx={{ color: deptStyle.textColor, textAlign: 'left' }} dangerouslySetInnerHTML={{ __html: displayText }} />
                  </Box>
                   <Box className="flex items-center gap-3">
                    {onChatClick && (
                      <button
                        onClick={() => onChatClick(metricId, stageDescription)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 16px',
                          height: '36px',
                          backgroundColor: deptStyle.borderColor,
                          color: '#ffffff',
                          fontSize: '12px',
                          fontWeight: '700',
                          borderRadius: '9999px',
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: `0 4px 6px -1px ${deptStyle.borderColor}40`,
                          transition: 'all 0.2s ease-in-out',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = deptStyle.textColor;
                          e.currentTarget.style.boxShadow = `0 10px 15px -3px ${deptStyle.borderColor}60`;
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = deptStyle.borderColor;
                          e.currentTarget.style.boxShadow = `0 4px 6px -1px ${deptStyle.borderColor}40`;
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                        title={`${stageMetricCount} message${stageMetricCount !== 1 ? 's' : ''} exchanged`}
                      >
                <Box component="span" style={{ letterSpacing: '0.025em' }}>Follow Up</Box>
                <Box component="span" sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '22px',
                  height: '24px',
                  padding: '0 8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: '700',
                  borderRadius: '9999px',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                }}>
                  {stageMetricCount}
                </Box>
                </button>
                    )}
                  </Box>
                </Box>
              );
            }
            
            if (value && value.includes('\n')) {
              const lines = value.split('\n');
              return (
                <Box className="text-sm font-bold text-gray-800 text-center bg-amber-100 py-1 px-2 rounded border border-gray-300">
                  {lines.map((line, index) => (
                    <Box key={index} className={index < lines.length - 1 ? "border-b border-gray-300 pb-1 mb-1" : ""} component="div" dangerouslySetInnerHTML={{ __html: line }} />
                  ))}
                </Box>
              );
            } else {
              // Fallback to original logic if no \n
              const text = step?.label || '';
              const parts = text.split(' - ');
              const stageNumber = parts[0];
              const stageName = parts[1] || '';
              return (
                <Box className="flex items-center bg-amber-100 py-1 px-2 rounded border border-gray-300">
                  <Box className="flex-1 text-sm font-bold text-gray-800 text-center border-r border-gray-300 pr-2" component="div" dangerouslySetInnerHTML={{ __html: stageNumber }} />
                  <Box className="flex-1 text-sm font-bold text-gray-800 text-center pl-2" component="div" dangerouslySetInnerHTML={{ __html: stageName }} />
                </Box>
              );
            }
          }
          const value = row.getValue("departmentWiseSteps") as string;
          if (row.index === 6 && value) {
            const items = value.split(', ');
            return (
              <Box className="text-sm font-bold text-gray-600 max-w-[250px]">
                {items.map((item, index) => (
                  <Box key={index} className={index < items.length - 1 ? "border-b border-gray-200 pb-1 mb-1" : ""} component="div" dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </Box>
            );
          }
          return (
            <Box className="text-sm font-bold text-gray-600 max-w-[250px] truncate" title={value} component="div" dangerouslySetInnerHTML={{ __html: value }} />
          );
        },
      }
    ]
  },

  // Notting Sheet
  {
    id: "nottingSheet",
    header: () => (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, fontWeight: 600 }}>
        <Typography>📄</Typography>
        <Typography>Noting Sheet Status</Typography>
      </Box>
    ),
    columns: [
      {
        accessorKey: "nottingSheet",
        header: "",
        cell: ({ row }) => {
          const value = row.getValue("nottingSheet") as string;
          const step = fixedSteps[row.index];
          const isMetricRow = step?.label.startsWith("Metric ID:");
          if (isMetricRow && value) {
            return (
              <Box className="flex items-center justify-center">
                <Typography className="text-sm text-gray-900 truncate" title={value}>
                  {value}
                </Typography>
              </Box>
            );
          }
          return (
            <Typography className="text-sm text-gray-900 truncate" title={value}>
              {value || ""}
            </Typography>
          );
        },
      }
    ]
  },

  // Civil Handover Group
  {
    id: "civilHandover",
    header: () => (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, fontWeight: 600 }}>
        <Typography>🔑</Typography>
        <Typography>Civil Handover</Typography>
      </Box>
    ),
    columns: [
      {
        accessorKey: "civilHandover.startDate",
        header: "Start Date",
        size: 120,
        cell: ({ row }) => {
          if (row.index <= 5) return null;
          // For division headers, return null
          if (fixedSteps[row.index]?.isDivisionHeader) return null;
          const dateValue = row.original.civilHandover.startDate;
          if (!dateValue || dateValue === "" || isNaN(new Date(dateValue).getTime())) {
            // Check if status is na
            if (row.original.civilHandover.status?.toLowerCase() === "na") {
              return <Typography sx={{ p: 0 }} className="text-center text-xs text-gray-700">NA</Typography>;
            }
            return null;
          }
          return (
            <Typography sx={{ p: 0 }} className="text-center text-xs text-gray-700">
              {new Date(dateValue).toLocaleDateString()}
            </Typography>
          );
        },
      },
      {
        accessorKey: "civilHandover.endDate",
        header: "End Date",
        size: 120,
        cell: ({ row }) => {
          if (row.index <= 5) return null;
          if (fixedSteps[row.index]?.isDivisionHeader) return null;
          const dateValue = row.original.civilHandover.endDate;
          if (!dateValue || dateValue === "" || isNaN(new Date(dateValue).getTime())) {
            // Check if status is na
            if (row.original.civilHandover.status?.toLowerCase() === "na") {
              return <Typography sx={{ p: 0 }} className="text-center text-xs text-gray-700">NA</Typography>;
            }
            return null;
          }
          return (
            <Typography sx={{ p: 0 }} className="text-center text-xs text-gray-700">
              {new Date(dateValue).toLocaleDateString()}
            </Typography>
          );
        },
      },
      {
        accessorKey: "civilHandover.stageCompleteDate",
        header: "Complete Date",
        size: 120,
        cell: ({ row }) => {
          if (row.index <= 5) return null;
          if (fixedSteps[row.index]?.isDivisionHeader) return null;
          const dateValue = (row.original.civilHandover as any).stageCompleteDate;
          if (!dateValue || dateValue === "") return null;
          return (
            <Typography sx={{ p: 0, color: '#15803d', fontWeight: 600, fontSize: '0.7rem' }} className="text-center text-xs">
              {dateValue}
            </Typography>
          );
        },
      },
      {
        accessorKey: "civilHandover.status",
        header: "Status",
        size: 100,
        cell: ({ row }) => {
          if (row.index <= 5) {
            return null;
          }
          if (fixedSteps[row.index]?.isDivisionHeader) {
            return null;
          }
          const status = row.original.civilHandover.status;
          if (!status) {
            return null;
          }
          return <StatusBadge status={status} />;
        },
      },
    ],
  },



  // Electrical Group
  {
    id: "electrical",
    header: () => (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, fontWeight: 600 }}>
        <Typography>⚡</Typography>
        <Typography>Electrical</Typography>
      </Box>
    ),
    columns: [
      {
        accessorKey: "electrical.startDate",
        header: "Start Date",
        size: 120,
        cell: ({ row }) => {
          if (row.index <= 5) return null;
          if (fixedSteps[row.index]?.isDivisionHeader) return null;
          const dateValue = row.original.electrical.startDate;
          if (!dateValue || dateValue === "" || isNaN(new Date(dateValue).getTime())) {
            // Check if status is na
            if (row.original.electrical.status?.toLowerCase() === "na") {
              return <Typography sx={{ p: 0 }} className="text-center text-xs text-gray-700">NA</Typography>;
            }
            return null;
          }
          return (
            <Typography sx={{ p: 0 }} className="text-center text-xs text-gray-700">
              {new Date(dateValue).toLocaleDateString()}
            </Typography>
          );
        },
      },
      {
        accessorKey: "electrical.endDate",
        header: "End Date",
        size: 120,
        cell: ({ row }) => {
          if (row.index <= 5) return null;
          if (fixedSteps[row.index]?.isDivisionHeader) return null;
          const dateValue = row.original.electrical.endDate;
          if (!dateValue || dateValue === "" || isNaN(new Date(dateValue).getTime())) {
            // Check if status is na
            if (row.original.electrical.status?.toLowerCase() === "na") {
              return <Typography sx={{ p: 0 }} className="text-center text-xs text-gray-700">NA</Typography>;
            }
            return null;
          }
          return (
            <Typography sx={{ p: 0 }} className="text-center text-xs text-gray-700">
              {new Date(dateValue).toLocaleDateString()}
            </Typography>
          );
        },
      },
      {
        accessorKey: "electrical.stageCompleteDate",
        header: "Complete Date",
        size: 120,
        cell: ({ row }) => {
          if (row.index <= 5) return null;
          if (fixedSteps[row.index]?.isDivisionHeader) return null;
          const dateValue = (row.original.electrical as any).stageCompleteDate;
          if (!dateValue || dateValue === "") return null;
          return (
            <Typography sx={{ p: 0, color: '#15803d', fontWeight: 600, fontSize: '0.7rem' }} className="text-center text-xs">
              {dateValue}
            </Typography>
          );
        },
      },
      {
        accessorKey: "electrical.status",
        header: "Status",
        size: 100,
        cell: ({ row }) => {
          if (row.index <= 5) {
            return null;
          }
          if (fixedSteps[row.index]?.isDivisionHeader) {
            return null;
          }
          const status = row.original.electrical.status;
          if (!status) {
            return null;
          }
          return <StatusBadge status={status} />;
        },
      },
    ],
  },

  // IT Group
  {
    id: "it",
    header: () => (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, fontWeight: 600 }}>
        <Typography>💻</Typography>
        <Typography>IT</Typography>
      </Box>
    ),
    columns: [
      {
        accessorKey: "it.startDate",
        header: "Start Date",
        size: 120,
        cell: ({ row }) => {
          if (row.index <= 5) return null;
          if (fixedSteps[row.index]?.isDivisionHeader) return null;
          const dateValue = row.original.it.startDate;
          if (!dateValue || dateValue === "" || isNaN(new Date(dateValue).getTime())) {
            // Check if status is na
            if (row.original.it.status?.toLowerCase() === "na") {
              return <Typography sx={{ p: 0 }} className="text-center text-xs text-gray-700">NA</Typography>;
            }
            return null;
          }
          return (
            <Typography sx={{ p: 0 }} className="text-center text-xs text-gray-700">
              {new Date(dateValue).toLocaleDateString()}
            </Typography>
          );
        },
      },
      {
        accessorKey: "it.endDate",
        header: "End Date",
        size: 120,
        cell: ({ row }) => {
          if (row.index <= 5) return null;
          if (fixedSteps[row.index]?.isDivisionHeader) return null;
          const dateValue = row.original.it.endDate;
          if (!dateValue || dateValue === "" || isNaN(new Date(dateValue).getTime())) {
            return null;
          }
          return (
            <Typography sx={{ p: 0 }} className="text-center text-xs text-gray-700">
              {new Date(dateValue).toLocaleDateString()}
            </Typography>
          );
        },
      },
      {
        accessorKey: "it.stageCompleteDate",
        header: "Complete Date",
        size: 120,
        cell: ({ row }) => {
          if (row.index <= 5) return null;
          if (fixedSteps[row.index]?.isDivisionHeader) return null;
          const dateValue = (row.original.it as any).stageCompleteDate;
          if (!dateValue || dateValue === "") return null;
          return (
            <Typography sx={{ p: 0, color: '#15803d', fontWeight: 600, fontSize: '0.7rem' }} className="text-center text-xs">
              {dateValue}
            </Typography>
          );
        },
      },
      {
        accessorKey: "it.status",
        header: "Status",
        size: 100,
        cell: ({ row }) => {
          if (row.index <= 5) {
            return null;
          }
          if (fixedSteps[row.index]?.isDivisionHeader) {
            return null;
          }
          const status = row.original.it.status;
          if (!status) {
            return null;
          }
          return <StatusBadge status={status} />;
        },
      },
    ],
  },

  // IT Infra Group
  {
    id: "itInfra",
    header: () => (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, fontWeight: 600 }}>
        <Typography>🖥️</Typography>
        <Typography>IT Infra</Typography>
      </Box>
    ),
    columns: [
      {
        accessorKey: "itInfra.startDate",
        header: "Start Date",
        size: 120,
        cell: ({ row }) => {
          if (row.index <= 5) return null;
          if (fixedSteps[row.index]?.isDivisionHeader) return null;
          const dateValue = row.original.itInfra.startDate;
          if (!dateValue || dateValue === "" || isNaN(new Date(dateValue).getTime())) {
            return null;
          }
          return (
            <Typography sx={{ p: 0 }} className="text-center text-xs text-gray-700">
              {new Date(dateValue).toLocaleDateString()}
            </Typography>
          );
        },
      },
      {
        accessorKey: "itInfra.endDate",
        header: "End Date",
        size: 120,
        cell: ({ row }) => {
          if (row.index <= 5) return null;
          if (fixedSteps[row.index]?.isDivisionHeader) return null;
          const dateValue = row.original.itInfra.endDate;
          if (!dateValue || dateValue === "" || isNaN(new Date(dateValue).getTime())) {
            return null;
          }
          return (
            <Typography sx={{ p: 0 }} className="text-center text-xs text-gray-700">
              {new Date(dateValue).toLocaleDateString()}
            </Typography>
          );
        },
      },
      {
        accessorKey: "itInfra.stageCompleteDate",
        header: "Complete Date",
        size: 120,
        cell: ({ row }) => {
          if (row.index <= 5) return null;
          if (fixedSteps[row.index]?.isDivisionHeader) return null;
          const dateValue = (row.original.itInfra as any).stageCompleteDate;
          if (!dateValue || dateValue === "") return null;
          return (
            <Typography sx={{ p: 0, color: '#15803d', fontWeight: 600, fontSize: '0.7rem' }} className="text-center text-xs">
              {dateValue}
            </Typography>
          );
        },
      },
      {
        accessorKey: "itInfra.status",
        header: "Status",
        size: 100,
        cell: ({ row }) => {
          if (row.index <= 5) {
            return null;
          }
          if (fixedSteps[row.index]?.isDivisionHeader) {
            return null;
          }
          const status = row.original.itInfra.status;
          if (!status) {
            return null;
          }
          return <StatusBadge status={status} />;
        },
      },
    ],
  },
];
