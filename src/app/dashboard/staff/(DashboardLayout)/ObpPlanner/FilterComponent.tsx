"use client";

import React from 'react';
import { Box, Button, Typography, Popover } from '@mui/material';

interface FilterComponentProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onFilterSelect: (filter: string) => void;
}

export default function FilterComponent({ open, anchorEl, onClose, onFilterSelect }: FilterComponentProps) {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <Box sx={{ p: 2, minWidth: 200 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Filters
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => onFilterSelect('outcome')}
            sx={{ justifyContent: 'space-between' }}
          >
            Outcome
            <Typography variant="body2" sx={{ ml: 1, color: 'green' }}>
              80%
            </Typography>
          </Button>
          <Button
            variant="outlined"
            onClick={() => onFilterSelect('process')}
            sx={{ justifyContent: 'space-between' }}
          >
            Process
            <Typography variant="body2" sx={{ ml: 1, color: 'orange' }}>
              20%
            </Typography>
          </Button>
          <Button
            variant="outlined"
            onClick={() => onFilterSelect('academic-calendar')}
            sx={{ justifyContent: 'flex-start' }}
          >
            Academic Calendar
          </Button>
        </Box>
        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Additional filters can be added here.
          </Typography>
        </Box>
      </Box>
    </Popover>
  );
}
