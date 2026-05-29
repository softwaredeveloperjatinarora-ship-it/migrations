export interface RightsModel {
  uid: string;
  rights: string;
  rights1: number; // Project Information
  rights2: number; // Drawing Status (Full)
  rights3: number; // Status Table
  rights4: number; // Structure Drawing Module
  rights5: number; // Verification of Structure & Architect Module
}

export function parseRightsData(data: string): RightsModel[] {
  return data
    .split('#')                     // split by #
    .filter(x => x)                 // safety
    .map(item => {
      const [uid, rights] = item.split(':');   // split UID and rights
      const parts = rights.split(',').map(Number);
      const [r1, r2, r3, r4, r5] = parts;

      return {
        uid,
        rights,
        rights1: r1,
        rights2: r2,
        rights3: r3,
        rights4: r4 || 0,
        rights5: r5 || 0
      };
    });
}

export function getUserRights(rightsData: RightsModel[], userId: string): RightsModel | null {
  return rightsData.find(right => right.uid === userId) || null;
}

export function hasRight(rights: RightsModel | null, rightNumber: 1 | 2 | 3 | 4 | 5): boolean {
  if (!rights) return false;
  switch (rightNumber) {
    case 1: return rights.rights1 === 1;
    case 2: return rights.rights2 === 1;
    case 3: return rights.rights3 === 1;
    case 4: return rights.rights4 === 1;
    case 5: return rights.rights5 === 1;
    default: return false;
  }
}

/**
 * New rights parsing logic based on architectureDrawingRemarks field
 * Format: "1,1,1A,0B,1" 
 * - Position 0: Project Info rights (1 = has rights, 0 = no rights)
 * - Position 1: Drawing Section base rights (1 = has rights, 0 = no rights)
 * - Position 2: Structure Drawing sub-rights (1A = has rights, 0A = no rights)
 * - Position 3: Verification sub-rights (1B = has rights, 0B = no rights)
 * - Position 4: Approval Table rights (1 = has rights, 0 = no rights)
 */
export interface ArchitectureDrawingRights {
  hasProjectInfo: boolean;        // Position 0: Project Info section rights
  hasDrawingSection: boolean;     // Position 1: Drawing section base rights
  hasStructureDrawing: boolean;  // Position 2: Structure Drawing sub-rights (1A)
  hasVerification: boolean;      // Position 3: Verification sub-rights (1B)
  hasApprovalTable: boolean;     // Position 4: Approval Table rights
}

export function parseArchitectureDrawingRemarks(remarks: string | null | undefined): ArchitectureDrawingRights {
  // Default: no rights if remarks is empty/null/undefined
  const defaultRights: ArchitectureDrawingRights = {
    hasProjectInfo: false,
    hasDrawingSection: false,
    hasStructureDrawing: false,
    hasVerification: false,
    hasApprovalTable: false,
  };

  if (!remarks || typeof remarks !== 'string') {
    return defaultRights;
  }

  // Check if the string contains the new format (contains commas and letters like 1A, 0B)
  const hasNewFormat = /,[01][AB],/.test(remarks) || (remarks.split(',').length >= 5 && /^[01],[01],/.test(remarks));
  
  // If it doesn't have the new format, it might be the old format (just numbers like "1,1,0,0,1")
  // In that case, return default - we need the new format
  if (!hasNewFormat) {
    // Check if it's just old numeric format - return based on those values
    const parts = remarks.split(',').map(p => p.trim());
    if (parts.length >= 1 && parts.length <= 3) {
      // Old format - return default since we're using new format now
      return defaultRights;
    }
  }

  // Split by comma to get individual parts
  const parts = remarks.split(',').map(p => p.trim());
  
  if (parts.length < 5) {
    // If not enough parts, return default rights
    return defaultRights;
  }

  // Position 0: Project Info (1 or 0)
  const hasProjectInfo = parts[0] === '1';

  // Position 1: Drawing Section base (1 or 0)
  const hasDrawingSection = parts[1] === '1';

  // Position 2: Structure Drawing sub-rights (1A or 0A)
  // 1A = has rights, 0A = no rights
  const structureDrawingValue = parts[2]?.toUpperCase() || '';
  const hasStructureDrawing = structureDrawingValue === '1A';

  // Position 3: Verification sub-rights (1B or 0B)
  // 1B = has rights, 0B = no rights
  const verificationValue = parts[3]?.toUpperCase() || '';
  const hasVerification = verificationValue === '1B';

  // Position 4: Approval Table (1 or 0)
  const hasApprovalTable = parts[4] === '1';

  return {
    hasProjectInfo,
    hasDrawingSection,
    hasStructureDrawing,
    hasVerification,
    hasApprovalTable,
  };
}

/**
 * Get rights from either userRights.rights or architectureDrawingRemarks
 * This function tries multiple sources to get the rights
 */
export function getDrawingRights(userRights: any, architectureRemarks: string | null | undefined): ArchitectureDrawingRights {
  // First try: Check if userRights has the new format in 'rights' field
  if (userRights?.rights) {
    const parsed = parseArchitectureDrawingRemarks(userRights.rights);
    // If we got actual rights (not all false), return them
    if (parsed.hasProjectInfo || parsed.hasDrawingSection || parsed.hasStructureDrawing || parsed.hasVerification || parsed.hasApprovalTable) {
      return parsed;
    }
  }
  
  // Second try: Use architectureDrawingRemarks from project data
  if (architectureRemarks) {
    const parsed = parseArchitectureDrawingRemarks(architectureRemarks);
    return parsed;
  }
  
  // Default: no rights
  return {
    hasProjectInfo: false,
    hasDrawingSection: false,
    hasStructureDrawing: false,
    hasVerification: false,
    hasApprovalTable: false,
  };
}
