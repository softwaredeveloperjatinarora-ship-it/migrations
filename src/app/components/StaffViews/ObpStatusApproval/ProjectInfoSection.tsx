'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  TextField,
  Autocomplete,
  Button,
  useTheme,
  MenuItem,
} from '@mui/material';
import { LocationOn, Refresh as RefreshIcon, Save as SaveIcon } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useFormik } from 'formik';

interface ProjectOption {
  value: string;
  label: string;
}

interface LocationOption {
  value: string;
  label: string;
}

interface ProjectInfoSectionProps {
  projectIdOptions: ProjectOption[];
  locationOptions: LocationOption[];
  formik: any; // Using any for Formik type to avoid circular dependencies
  onReset: () => void;
  loading: boolean;
  hasProjectInfo: boolean;
  showSubmitButtons?: boolean;
  onSubmit?: () => void;
}

export default function ProjectInfoSection({
  projectIdOptions,
  locationOptions,
  formik,
  onReset,
  loading,
  hasProjectInfo,
  showSubmitButtons = true,
  onSubmit,
}: ProjectInfoSectionProps) {
  const theme = useTheme();

  const locationStatusOptions = [
    { value: '', label: 'Select Location Status' },
    { value: 'finalized', label: 'Finalized' },
    { value: 'tentative', label: 'Tentative' },
    { value: 'under_review', label: 'Under Review' },
  ];

  // const ADD_NEW_VALUE = '__add_new__';
  // const [surroundingOptions, setSurroundingOptions] = useState([...]);
  // const [newSurroundingText, setNewSurroundingText] = useState('');
  // const [showAddInput, setShowAddInput] = useState(false);
  // const addInputRef = useRef<HTMLInputElement>(null);

  // const allSurroundingOptions = [
  //   ...surroundingOptions,
  //   { value: ADD_NEW_VALUE, label: '+ Add Surrounding' },
  // ];

  // const handleAddSurrounding = () => {
  //   const trimmed = newSurroundingText.trim();
  //   if (!trimmed) return;
  //   const newOption = { value: trimmed, label: trimmed };
  //   setSurroundingOptions(prev => [...prev, newOption]);
  //   formik.setFieldValue('surrounding', trimmed);
  //   setNewSurroundingText('');
  //   setShowAddInput(false);
  // };

  if (!hasProjectInfo) {
    return null;
  }

  return (
    <Box sx={{ flex: { xs: '1', lg: '0 0 33.333%' } }}>
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
          <LocationOn />
          <Typography variant="h6" fontWeight="bold">
            Project Information
          </Typography>
        </Box>

        <CardContent sx={{ p: 3 }}>
          <Stack spacing={3}>
            {/* Project ID Autocomplete */}
            <Autocomplete
              fullWidth
              id="projectId"
              options={projectIdOptions}
              getOptionLabel={option => option.label}
              value={
                projectIdOptions.find(option => option.value === formik.values.projectId) || null
              }
              onChange={(event, newValue) => {
                formik.setFieldValue('projectId', newValue?.value || '');
              }}
              onBlur={formik.handleBlur}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Project ID"
                  error={formik.touched.projectId && Boolean(formik.errors.projectId)}
                  helperText={formik.touched.projectId && formik.errors.projectId}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'white',
                    },
                  }}
                />
              )}
            />

            {/* Date Pickers - Side by Side */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                flexDirection: { xs: 'column', sm: 'row' },
              }}
            >
              <TextField
                fullWidth
                id="goAheadDate"
                name="goAheadDate"
                label="Go Ahead Date"
                type="date"
                required
                value={formik.values.goAheadDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.goAheadDate && Boolean(formik.errors.goAheadDate)}
                helperText={formik.touched.goAheadDate && formik.errors.goAheadDate}
                InputLabelProps={{
                  shrink: true,
                  sx: { fontWeight: 'bold' },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'white',
                    cursor: 'pointer',
                  },
                }}
              />

              <TextField
                fullWidth
                id="completionDate"
                name="completionDate"
                label="Completion Date"
                type="date"
                required
                value={formik.values.completionDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.completionDate && Boolean(formik.errors.completionDate)}
                helperText={formik.touched.completionDate && formik.errors.completionDate}
                InputLabelProps={{
                  shrink: true,
                  sx: { fontWeight: 'bold' },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'white',
                    cursor: 'pointer',
                  },
                }}
              />
            </Box>

            {/* Location and Status fields */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Autocomplete
                fullWidth
                id="location"
                options={locationOptions}
                getOptionLabel={option => option.label}
                value={
                  locationOptions.find(option => option.value === formik.values.location) || null
                }
                onChange={(event, newValue) => {
                  formik.setFieldValue('location', newValue?.value || '');
                  // Reset location status when location changes
                  formik.setFieldValue('locationStatus', '');
                }}
                onBlur={formik.handleBlur}
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Location (Block)"
                    error={formik.touched.location && Boolean(formik.errors.location)}
                    helperText={formik.touched.location && formik.errors.location}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'white',
                      },
                    }}
                  />
                )}
              />

              <TextField
                select
                sx={{
                  minWidth: 150,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'white',
                  },
                }}
                id="locationStatus"
                name="locationStatus"
                label="Status"
                value={formik.values.locationStatus}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                error={formik.touched.locationStatus && Boolean(formik.errors.locationStatus)}
                helperText={formik.touched.locationStatus && formik.errors.locationStatus}
              >
                {locationStatusOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {/* Surrounding Text Field */}
            <TextField
              fullWidth
              id="surrounding"
              name="surrounding"
              label="Surrounding"
              placeholder="Enter surrounding details"
              required
              value={formik.values.surrounding}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.surrounding && Boolean(formik.errors.surrounding)}
              helperText={formik.touched.surrounding && formik.errors.surrounding}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'white',
                },
              }}
            />

            {/* Add Surrounding feature commented out */}
            {/* {showAddInput && (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
                <TextField inputRef={addInputRef} size="small" fullWidth
                  placeholder="Type surrounding name..."
                  value={newSurroundingText}
                  onChange={e => setNewSurroundingText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') { e.preventDefault(); handleAddSurrounding(); }
                    if (e.key === 'Escape') { setShowAddInput(false); setNewSurroundingText(''); }
                  }}
                />
                <Button variant="contained" size="small" onClick={handleAddSurrounding}
                  disabled={!newSurroundingText.trim()}>Add</Button>
                <IconButton size="small" onClick={() => { setShowAddInput(false); setNewSurroundingText(''); }}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            )} */}
          </Stack>
        </CardContent>

        {/* Submit & Reset Buttons */}
        {showSubmitButtons && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              p: 2,
              borderTop: '1px solid #e0e0e0',
              backgroundColor: '#f8fafc',
            }}
          >
            <Button
              type="button"
              variant="outlined"
              onClick={onReset}
              startIcon={<RefreshIcon />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
              }}
            >
              Reset
            </Button>
            <LoadingButton
              type="button"
              variant="contained"
              loading={loading}
              startIcon={<SaveIcon />}
              onClick={onSubmit}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
              }}
            >
              Submit
            </LoadingButton>
          </Box>
        )}
      </Card>
    </Box>
  );
}
