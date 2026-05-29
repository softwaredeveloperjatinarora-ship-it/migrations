'use client'
import { Box, Button, Divider, Drawer,  IconButton, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { IconX } from '@tabler/icons-react';
import Link from 'next/link';
import CertificateItems from './CertificateItems';
import { certificate } from '../CertificateList';
import { sum } from "lodash";

interface Props {
  open: boolean;
  items?: certificate[];
  onClose: () => void;
}


const CertificateSideBar = ({ open, onClose,items }: Props) => {
  
  const total = sum(
    items!.map((item:certificate) =>parseInt(item.price))
  );
  
    const cartContent = (
          <Box>
            <CertificateItems items={items} />
          </Box>
      );
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: "500px" } }}
    >
      <Box
        display="flex"
        alignItems="center"
        p={3}
        pb={0}
        mb={1}
        justifyContent="space-between"
      >
        <Typography variant="h5" fontWeight={800}>
          Selected Certificate
        </Typography>
        <Box>
          <IconButton
            color="inherit"
            sx={{
              color: (theme) => theme.palette.grey.A200,
            }}
            onClick={onClose}
          >
            <IconX size="1rem" />
          </IconButton>
        </Box>
      </Box>
      <Box sx={{ flexGrow: 1, overflowY: "auto", px: 1 }}>{cartContent}</Box>
       {items!.length > 0 && (
    <Box
      sx={{
        borderTop: "1px solid #eee",
        px: 3,
        py: 2,
        bgcolor: "background.paper",
      }}
    >
      <Stack direction="row" justifyContent="space-between" mb={1}>
        <Typography variant="subtitle2" fontWeight={400}>
          Total
        </Typography>
        <Typography variant="subtitle2" fontWeight={600}>
          ₹{total}
        </Typography>
      </Stack>
      <Button
        fullWidth
        component={Link}
        href="/dashboard/examination/studentcertificate/checkout"
        variant="contained"
        color="primary"
      >
        Checkout
      </Button>
    </Box>
  )}
    </Drawer>
  );
}

export default CertificateSideBar















