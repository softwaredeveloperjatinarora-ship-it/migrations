"use client";
import * as React from "react";
import {
  Box,
  Typography,
  Grid,
  Stack,
  Card,
  CardContent,
  Chip,
  TextField,
  InputAdornment,
  IconButton
} from "@mui/material";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  LibraryBooks as LibraryBooksIcon,
  Science as ScienceIcon,
  Search as SearchIcon,
  Ballot as BallotIcon,
  Error as ErrorIcon,
  MenuBook as MenuBookIcon
} from "@mui/icons-material";

interface Sheet {
  pktId: number;
  pktNo: string;
  from: string;
  to: string;
  count: string;
  description: "Theory" | "LibraryTheory" | "Practical" | "LibraryPractical";
  consumed: number;
  consumeDate?: string;
  consumeSession?: string;
}

type PacketCategory = 'theory' | 'libraryTheory' | 'practical' | 'libraryPractical';

interface SelectedPackets {
  theory: Sheet[];
  libraryTheory: Sheet[];
  practical: Sheet[];
  libraryPractical: Sheet[];
}

interface TabVerticalProps {
  onSelectionChange?: (selection: {
    theory: number;
    libraryTheory: number;
    practical: number;
    libraryPractical: number
  }) => void;
  onRequiredCountsChange?: (counts: {
    theory: number;
    libraryTheory: number;
    practical: number;
    libraryPractical: number
  }) => void;
  onConsumeSheets: () => void;
  onPacketSelectionIds?: (ids: number[]) => void;
  selectedDate: string | null;
  selectedTime: string;
  examType: number;
  material: any[];
  strengthData: {
    th?: number;
    libTheory?: number;
    pr?: number;
    libPractical?: number;
  };
  saveSteps?: any;
}

const TabVertical: React.FC<TabVerticalProps> = ({
  onSelectionChange,
  onRequiredCountsChange,
  selectedDate,
  selectedTime,
  examType,
  strengthData,
  onPacketSelectionIds,
  material,
  saveSteps

}) => {
  const [selectedPackets, setSelectedPackets] = React.useState<SelectedPackets>({
    theory: [],
    libraryTheory: [],
    practical: [],
    libraryPractical: [],
  });

  const [availablePackets, setAvailablePackets] = React.useState({
    theory: [] as Sheet[],
    libraryTheory: [] as Sheet[],
    practical: [] as Sheet[],
    libraryPractical: [] as Sheet[],
  });

  const [searchTerms, setSearchTerms] = React.useState<{
    theory: string;
    libraryTheory: string;
    practical: string;
    libraryPractical: string;
  }>({
    theory: '',
    libraryTheory: '',
    practical: '',
    libraryPractical: ''
  });

  const [hasValidData, setHasValidData] = React.useState(true);
  const [isInitialized, setIsInitialized] = React.useState(false);

  // Helper function to format date for comparison
  const formatDateForComparison = (dateString: string): string => {
    try {
      if (dateString.includes('T')) {
        return dateString.split('T')[0];
      }
      return dateString;
    } catch {
      return dateString;
    }
  };

  // Helper function to check if packet matches current session
  const isPacketForCurrentSession = (consumeDate: string | null, consumeSession: string | null): boolean => {
    if (!consumeDate || !consumeSession || !selectedDate || !selectedTime) {
      return false;
    }

    const formattedConsumeDate = formatDateForComparison(consumeDate);
    const formattedSelectedDate = formatDateForComparison(selectedDate);

    return formattedConsumeDate === formattedSelectedDate && consumeSession === selectedTime;
  };

  // Update packet selection IDs - using useCallback
  const updatePacketSelectionIds = React.useCallback(() => {
    if (!isInitialized || !onPacketSelectionIds) return;

    const ids = [
      ...selectedPackets.theory.map(p => p.pktId),
      ...selectedPackets.libraryTheory.map(p => p.pktId),
      ...selectedPackets.practical.map(p => p.pktId),
      ...selectedPackets.libraryPractical.map(p => p.pktId),
    ];

    onPacketSelectionIds(ids);
  }, [selectedPackets, onPacketSelectionIds, isInitialized]);

  // Extract required counts from strengthData - memoized to prevent unnecessary recalculations
  const requiredCounts = React.useMemo(() => ({
    theory: strengthData.th ?? 0,
    libraryTheory: strengthData.libTheory ?? 0,
    practical: strengthData.pr ?? 0,
    libraryPractical: strengthData.libPractical ?? 0,
  }), [strengthData.th, strengthData.libTheory, strengthData.pr, strengthData.libPractical]);

  // Update selection counts when packets change - using useCallback to prevent unnecessary re-renders
  const updateSelectionCounts = React.useCallback(() => {
    if (!isInitialized || !onSelectionChange) return;

    const counts = {
      theory: selectedPackets.theory.reduce((sum, p) => sum + (parseInt(p.count, 10) || 0), 0),
      libraryTheory: selectedPackets.libraryTheory.reduce((sum, p) => sum + (parseInt(p.count, 10) || 0), 0),
      practical: selectedPackets.practical.reduce((sum, p) => sum + (parseInt(p.count, 10) || 0), 0),
      libraryPractical: selectedPackets.libraryPractical.reduce((sum, p) => sum + (parseInt(p.count, 10) || 0), 0),
    };

    onSelectionChange(counts);
  }, [selectedPackets, onSelectionChange, isInitialized]);


  // Handle search term changes
  const handleSearchChange = (type: PacketCategory, value: string) => {
    setSearchTerms(prev => ({
      ...prev,
      [type]: value
    }));
  };

  // Handle adding or removing a packet
  const togglePacket = React.useCallback((
    packet: Sheet,
    type: PacketCategory,
    action: "add" | "remove"
  ) => {

    setSelectedPackets(prev => {
      let newSelection = [...prev[type]];

      if (action === "add" && !newSelection.some(p => p.pktId === packet.pktId)) {
        newSelection.push(packet);
      } else if (action === "remove") {
        newSelection = newSelection.filter(p => p.pktId !== packet.pktId);
      }

      return {
        ...prev,
        [type]: newSelection
      };
    });
  }, []); // Empty dependencies as this function doesn't depend on any state

  // Filter sheets based on search terms - memoized
  const filteredSheets = React.useMemo(() => ({
    theory: availablePackets.theory.filter(sheet =>
      sheet?.pktNo.toLowerCase().includes(searchTerms.theory.toLowerCase())
    ),
    libraryTheory: availablePackets.libraryTheory.filter(sheet =>
      sheet?.pktNo.toLowerCase().includes(searchTerms.libraryTheory.toLowerCase())
    ),
    practical: availablePackets.practical.filter(sheet =>
      sheet?.pktNo.toLowerCase().includes(searchTerms.practical.toLowerCase())
    ),
    libraryPractical: availablePackets.libraryPractical.filter(sheet =>
      sheet?.pktNo.toLowerCase().includes(searchTerms.libraryPractical.toLowerCase())
    )
  }), [availablePackets, searchTerms]);

  // Map material data to packets - only run when material, selectedDate, or selectedTime changes
  React.useEffect(() => {

    // Check if material data is valid
    if (!material || !Array.isArray(material) || material.length === 0) {
      setHasValidData(false);
      setAvailablePackets({
        theory: [],
        libraryTheory: [],
        practical: [],
        libraryPractical: []
      });
      setIsInitialized(true);
      return;
    }

    // Check if material has required fields
    const hasRequiredFields = material.some(item =>
      item &&
      (item.Id || item.id) &&
      (item.Pktno || item.pktno) &&
      (item.Description || item.description)
    );

    if (!hasRequiredFields) {
      setHasValidData(false);
      setAvailablePackets({
        theory: [],
        libraryTheory: [],
        practical: [],
        libraryPractical: []
      });
      setIsInitialized(true);
      return;
    }

    setHasValidData(true);

    const mapToSheet = (item: any, description: "Theory" | "LibraryTheory" | "Practical" | "LibraryPractical"): Sheet => ({
      pktId: Number(item.Id || item.id),
      pktNo: item.Pktno || item.pktno || 'N/A',
      from: String(item.Serialfrom || item.serialfrom || 0),
      to: String(item.Serialto || item.serialto || 0),
      count: String(item.Cnt || item.cnt || 0),
      description,
      consumed: (item.ConsumeDatetime || item.ConsumeSession) ? 1 : 0,
      consumeDate: item.ConsumeDatetime,
      consumeSession: item.ConsumeSession
    });

    // Filter packets - only show those that match current session OR are not consumed yet
    const filteredMaterial = material.filter(item => {
      const consumeDate = item.ConsumeDatetime;
      const consumeSession = item.ConsumeSession;

      if (!consumeDate || !consumeSession) {
        return true;
      }

      return isPacketForCurrentSession(consumeDate, consumeSession);
    });


    const theory = filteredMaterial
      .filter(item => (item.Description || item.description)?.toLowerCase() === "theory sheets")
      .map(item => mapToSheet(item, "Theory"));

    const libraryTheory = filteredMaterial
      .filter(item => (item.Description || item.description)?.toLowerCase() === "library sheets" && (item.Pktno || item.pktno)?.startsWith("LB"))
      .map(item => mapToSheet(item, "LibraryTheory"));

    const practical = filteredMaterial
      .filter(item => (item.Description || item.description)?.toLowerCase() === "practical sheets")
      .map(item => mapToSheet(item, "Practical"));

    const libraryPractical = filteredMaterial
      .filter(item => (item.Description || item.description)?.toLowerCase() === "library sheets" && (item.Pktno || item.pktno)?.startsWith("LP"))
      .map(item => mapToSheet(item, "LibraryPractical"));

    setAvailablePackets({
      theory,
      libraryTheory,
      practical,
      libraryPractical
    });

    // Find packets that match current session exactly
    const matchingPackets = {
      theory: theory.filter(sheet =>
        sheet.consumeDate && sheet.consumeSession &&
        isPacketForCurrentSession(sheet.consumeDate, sheet.consumeSession)
      ),
      libraryTheory: libraryTheory.filter(sheet =>
        sheet.consumeDate && sheet.consumeSession &&
        isPacketForCurrentSession(sheet.consumeDate, sheet.consumeSession)
      ),
      practical: practical.filter(sheet =>
        sheet.consumeDate && sheet.consumeSession &&
        isPacketForCurrentSession(sheet.consumeDate, sheet.consumeSession)
      ),
      libraryPractical: libraryPractical.filter(sheet =>
        sheet.consumeDate && sheet.consumeSession &&
        isPacketForCurrentSession(sheet.consumeDate, sheet.consumeSession)
      ),
    };

    // Reset selected packets first
    setSelectedPackets({
      theory: [],
      libraryTheory: [],
      practical: [],
      libraryPractical: [],
    });

    // Auto-click add button for matching packets by calling togglePacket
    setTimeout(() => {
      matchingPackets.theory.forEach(sheet => {
        togglePacket(sheet, 'theory', 'add');
      });

      matchingPackets.libraryTheory.forEach(sheet => {
        togglePacket(sheet, 'libraryTheory', 'add');
      });

      matchingPackets.practical.forEach(sheet => {
        togglePacket(sheet, 'practical', 'add');
      });

      matchingPackets.libraryPractical.forEach(sheet => {
        togglePacket(sheet, 'libraryPractical', 'add');
      });

      setIsInitialized(true);
    }, 100); // Small delay to ensure state is reset first
  }, [material, selectedDate, selectedTime]); // Only these dependencies

    // Update required counts - using useCallback
  const updateRequiredCounts = React.useCallback(() => {
    if (!isInitialized || !onRequiredCountsChange) return;

    onRequiredCountsChange(requiredCounts);
  }, [onRequiredCountsChange, requiredCounts, isInitialized]);

  // Reset selections when session changes
  React.useEffect(() => {
    setSelectedPackets({
      theory: [],
      libraryTheory: [],
      practical: [],
      libraryPractical: []
    });

    setSearchTerms({
      theory: '',
      libraryTheory: '',
      practical: '',
      libraryPractical: ''
    });

    setIsInitialized(false);
  }, [selectedTime, selectedDate]);

  React.useEffect(() => {
    updateSelectionCounts();
  }, [updateSelectionCounts]);

  React.useEffect(() => {
    updateRequiredCounts();
  }, [updateRequiredCounts]);

  React.useEffect(() => {
    updatePacketSelectionIds();
  }, [updatePacketSelectionIds]);

  // Show no data message if API doesn't return proper data
  if (!hasValidData) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
        <ErrorIcon color="error" sx={{ fontSize: 48, mb: 2 }} />
        <Typography variant="h6" color="error" gutterBottom>
          No Records Present
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          The system could not retrieve proper packet data from the server.
          Please check your connection or contact support if the issue persists.
        </Typography>
      </Box>
    );
  }

  const renderSheetSection = (
    type: "Theory" | "LibraryTheory" | "Practical" | "LibraryPractical",
    sheets: Sheet[],
    requiredCount: number
  ) => {
    const key = type.toLowerCase() as PacketCategory;
    const selectedPacketsForType = selectedPackets[key] || [];
    const selectedCount = selectedPacketsForType.reduce(
      (sum: number, p: Sheet) => sum + (parseInt(p?.count || '0', 10) || 0), 0
    );
    const selectedIds = selectedPacketsForType.map((p: Sheet) => p?.pktId).filter(id => id !== undefined);
    const isCountSufficient = selectedCount >= requiredCount;

    const sectionConfig = {
      Theory: {
        color: "primary",
        icon: <LibraryBooksIcon />,
        chipColor: isCountSufficient ? "success" : "error",
        displayName: "Theory"
      },
      LibraryTheory: {
        color: "secondary",
        icon: <MenuBookIcon />,
        chipColor: isCountSufficient ? "success" : "error",
        displayName: "Library Theory"
      },
      Practical: {
        color: "warning",
        icon: <ScienceIcon />,
        chipColor: isCountSufficient ? "success" : "error",
        displayName: "Practical"
      },
      LibraryPractical: {
        color: "info",
        icon: <MenuBookIcon />,
        chipColor: isCountSufficient ? "success" : "error",
        displayName: "Library Practical"
      }
    }[type];

    // Hide sections based on examType and strengthData
    if (examType === 5 && (type === "Practical" || type === "LibraryPractical")) return null;
    if (examType === 6 && (type === "Theory" || type === "LibraryTheory")) return null;
    if (requiredCount === 0) return null;

    return (
      <Grid key={type} size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
        <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 1 }}>
          <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 1.5 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                {React.cloneElement(sectionConfig.icon, { color: sectionConfig.color as any })}
                <Typography variant="subtitle1" color={sectionConfig.color} fontWeight="bold">
                  {sectionConfig.displayName} Sheets
                </Typography>
              </Stack>
              <Chip
                label={`${selectedCount}/${requiredCount}`}
                color={sectionConfig.chipColor as any}
                size="small"
                sx={{ fontSize: '0.75rem', fontWeight: 'bold', height: 24 }}
              />
            </Stack>

            <TextField
              fullWidth
              variant="outlined"
              placeholder={`Search ${sectionConfig.displayName} Sheets`}
              size="small"
              value={searchTerms[key]}
              onChange={(e) => handleSearchChange(key, e.target.value)}
              sx={{ mb: 1, '& .MuiInputBase-root': { height: 36 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            <Box
              sx={{
                overflowY: 'auto',
                maxHeight: 300,
                pr: 0.5,
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
                '&:hover': {
                  '&::-webkit-scrollbar': { display: 'block', width: '6px' },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    borderRadius: '4px'
                  }
                }
              }}
            >
              {sheets.length === 0 ? (
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  sx={{ py: 3 }}
                  spacing={1}
                >
                  <ErrorIcon color="error" fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    No {sectionConfig.displayName} sheets found for current session
                  </Typography>
                </Stack>
              ) : (
                <Grid container spacing={1}>
                  {sheets.map(sheet => {
                    const isSelected = selectedIds.includes(sheet.pktId);
                    const isMatchingSession = sheet.consumeDate && sheet.consumeSession &&
                      isPacketForCurrentSession(sheet.consumeDate, sheet.consumeSession);
                    const isNotMatchingSession = !isMatchingSession;

                    // Disable non-matching packets if any matching packet exists
                    const hasMatchingPackets = sheets.some(s =>
                      s.consumeDate && s.consumeSession &&
                      isPacketForCurrentSession(s.consumeDate, s.consumeSession)
                    );

                    const isDisabled = isNotMatchingSession && hasMatchingPackets;
                    const disableAddButton = (!isSelected && selectedCount >= requiredCount) || isDisabled;

                    const handleToggle = () => {
                      if (isDisabled) return;

                      if (isSelected) {
                        togglePacket(sheet, key, 'remove');
                      } else if (!disableAddButton) {
                        togglePacket(sheet, key, 'add');
                      }
                    };

                    return (
                      <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }} key={sheet.pktId}>
                        <Card
                          variant="outlined"
                          onClick={handleToggle}
                          sx={{
                            opacity: isDisabled ? 0.5 : 1,
                            borderColor: isSelected ? 'success.main' : 'grey.300',
                            backgroundColor: isSelected ? 'success.50' : 'background.paper',
                            p: 0,
                            cursor: isDisabled ? 'not-allowed' : (disableAddButton ? 'not-allowed' : 'pointer'),
                          }}
                        >
                          <CardContent
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              p: 1,
                              '&:last-child': { pb: 1 },
                            }}
                          >
                            <Stack spacing={0.5}>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <BallotIcon
                                  fontSize="small"
                                  sx={{ color: `${sectionConfig.color}.main` }}
                                />
                                <Typography variant="caption" fontWeight="bold">
                                  {sheet.pktNo}
                                </Typography>
                                {isSelected ? (
                                  <IconButton
                                    size="small"
                                    color="error"
                                    disabled={isDisabled}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (!isDisabled) {
                                        togglePacket(sheet, key, 'remove');
                                      }
                                    }}
                                    sx={{ p: 0.25 }}
                                  >
                                    <RemoveIcon fontSize="small" />
                                  </IconButton>
                                ) : (
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    disabled={disableAddButton}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (!disableAddButton) {
                                        togglePacket(sheet, key, 'add');
                                      }
                                    }}
                                    sx={{ p: 0.25 }}
                                  >
                                    <AddIcon fontSize="small" />
                                  </IconButton>
                                )}
                              </Stack>
                              <Stack direction="row" spacing={0.5}>
                                <Chip
                                  label={`From: ${sheet.from}`}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                  sx={{ height: 20, fontSize: '0.625rem' }}
                                />
                                <Chip
                                  label={`To: ${sheet.to}`}
                                  size="small"
                                  color="secondary"
                                  variant="outlined"
                                  sx={{ height: 20, fontSize: '0.625rem' }}
                                />
                                <Chip
                                  label={`Count: ${sheet.count}`}
                                  size="small"
                                  color="success"
                                  variant="outlined"
                                  sx={{ height: 20, fontSize: '0.625rem' }}
                                />
                              </Stack>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  return (
    <Box>
      <Typography variant="subtitle2" color="error" textAlign="center" fontWeight="bold" sx={{ mb: 1 }}>
        Kindly choose answer sheet packets carefully
      </Typography>
      <Grid container spacing={1}>
        {examType === 5 && renderSheetSection("Theory", filteredSheets.theory, requiredCounts.theory)}
        {examType === 5 && requiredCounts.libraryTheory > 0 && renderSheetSection("LibraryTheory", filteredSheets.libraryTheory, requiredCounts.libraryTheory)}
        {examType === 6 && renderSheetSection("Practical", filteredSheets.practical, requiredCounts.practical)}
        {examType === 6 && requiredCounts.libraryPractical > 0 && renderSheetSection("LibraryPractical", filteredSheets.libraryPractical, requiredCounts.libraryPractical)}
      </Grid>
    </Box>
  );
};

export default TabVertical;