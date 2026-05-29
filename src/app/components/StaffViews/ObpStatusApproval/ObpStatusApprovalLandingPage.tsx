'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Button, IconButton } from '@mui/material';
import { Assignment, TableChart, Close } from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import Breadcrumb from '@/app/dashboard/staff/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import ObpProjectForm from './ObpProjectForm';
import OBPStatusTable from './ObpStatusApporvalTable';
import { getEstateProjectStatus } from '@/app/actions/StaffActions/ObpStatusAction/getEstateProjectStatusAction';
import {
  parseRightsData,
  getUserRights,
  hasRight,
  RightsModel,
  parseArchitectureDrawingRemarks,
  getDrawingRights,
} from '@/app/api/interfaces/ObpStatusInterface/rightsParser';

const BCrumb = [
  {
    to: '/dashboard/staff',
    title: 'UMS Home',
  },
  {
    to: '/dashboard/staff/ObpStatusApproval',
    title: 'Project Status ',
  },
];

export default function ObpStatusApprovalLandingPage() {
  const { data: session } = useSession();
  const [showProjectForm, setShowProjectForm] = useState(true);
  const [showStatusTable, setShowStatusTable] = useState(false);
  const [userRights, setUserRights] = useState<RightsModel | null>(null);
  const [noAccess, setNoAccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // console.log("Current session:", session);
        // console.log("Current session user:", session?.user);
        // console.log("Current session user _id:", session?.user?._id);
        // console.log("Current session user id:", session?.user?.id);

        const response = await getEstateProjectStatus('0');

        // Parse rights from API response using new format
        if (
          response.status === 'success' &&
          response.ApiData?.item1?.[0]?.architectureDrawingRemarks
        ) {
          const rightsString = response.ApiData.item1[0].architectureDrawingRemarks;

          // Use the new parsing function for format "1,1,1A,0B,1"
          const drawingRights = parseArchitectureDrawingRemarks(rightsString);

          // Create userRights object with new format fields
          const rights: RightsModel = {
            uid: session?.user?._id?.toString() || '',
            rights: rightsString,
            rights1: drawingRights.hasProjectInfo ? 1 : 0,
            rights2: drawingRights.hasDrawingSection ? 1 : 0,
            rights3: drawingRights.hasStructureDrawing || drawingRights.hasVerification ? 1 : 0,
            rights4: drawingRights.hasStructureDrawing ? 1 : 0,
            rights5: drawingRights.hasApprovalTable ? 1 : 0,
          };

          setUserRights(rights);

          // Check if user has any access
          const hasProjectInfo = drawingRights.hasProjectInfo;
          const hasDrawingSection = drawingRights.hasDrawingSection;
          const hasStructureDrawing = drawingRights.hasStructureDrawing;
          const hasVerification = drawingRights.hasVerification;

          // Show appropriate view based on rights
          if (!hasProjectInfo && !hasDrawingSection && !hasStructureDrawing && !hasVerification) {
            // No rights at all
            setNoAccess(true);
            setShowProjectForm(false);
            setShowStatusTable(false);
          } else if (hasProjectInfo || hasDrawingSection || hasStructureDrawing) {
            // Has project form rights - show Add Project button
            setShowProjectForm(true);
            setShowStatusTable(false);
            setNoAccess(false);
          } else if (hasVerification) {
            // Only has verification/view rights - show table
            setShowStatusTable(true);
            setShowProjectForm(false);
            setNoAccess(false);
          } else {
            setNoAccess(false);
            setShowProjectForm(false);
            setShowStatusTable(false);
          }
        }
      } catch {
      }
    };

    fetchData();
  }, [session?.user?._id]);

  const handleProjectFormClick = () => {
    setShowProjectForm(true);
    setShowStatusTable(false);
  };

  const handleApprovalTableClick = () => {
    setShowStatusTable(true);
    setShowProjectForm(false);
  };

  const handleCloseProjectForm = () => {
    setShowProjectForm(false);
  };

  const handleCloseStatusTable = () => {
    setShowStatusTable(false);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Breadcrumb title="Project Status " items={BCrumb} />

      <Box sx={{ display: 'flex', mt: 2, width: '100%' }}>
        {userRights &&
          (userRights.rights1 === 1 || userRights.rights2 === 1) &&
          !(userRights.rights1 === 1 && userRights.rights2 === 1 && userRights.rights3 === 0) && (
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                },
                flex: 1,
                minHeight: 10,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 1,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                },
                '&:hover::before': {
                  opacity: 1,
                },
              }}
              onClick={handleProjectFormClick}
            >
              <Box sx={{ zIndex: 1, textAlign: 'center' }}>
                <Assignment sx={{ fontSize: 24, mb: 1, opacity: 0.9 }} />
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ mb: 1, fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
                >
                  Add Project Info
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.85rem' }}></Typography>
              </Box>
            </Card>
          )}
        {userRights &&
          userRights.rights5 === 1 &&
          !(userRights.rights1 === 0 && userRights.rights2 === 0 && userRights.rights3 === 1) && (
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                },
                flex: 1,
                minHeight: 100,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 1,
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                },
                '&:hover::before': {
                  opacity: 1,
                },
              }}
              onClick={handleApprovalTableClick}
            >
              <Box sx={{ zIndex: 1, textAlign: 'center' }}>
                <TableChart sx={{ fontSize: 24, mb: 1, opacity: 0.9 }} />
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ mb: 1, fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
                >
                  Status Table
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.85rem' }}>
                  View Project Progress
                </Typography>
              </Box>
            </Card>
          )}
      </Box>

      {/* Project Form Section */}
      {showProjectForm && (
        <Box sx={{ mt: 4 }}>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Project Form
            </Typography>
            <IconButton onClick={handleCloseProjectForm} sx={{ color: 'grey.600' }}>
              <Close />
            </IconButton>
          </Box>
          <ObpProjectForm hideBreadcrumb={true} userRights={userRights} />
        </Box>
      )}

      {/* Status Table Section */}
      {showStatusTable && (
        <Box sx={{ mt: 4 }}>
          <OBPStatusTable hideBreadcrumb={true} onClose={handleCloseStatusTable} />
        </Box>
      )}

      {/* No Access Message */}
    </Box>
  );
}
