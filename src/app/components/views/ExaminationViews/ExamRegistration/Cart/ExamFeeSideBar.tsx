'use client'
import { Box, Button, Drawer,  IconButton, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import CartItems from './CartItems';
import { IconX } from '@tabler/icons-react';
import Link from 'next/link';

interface Props {
  open: boolean;
  onClose: () => void;
}

const ExamFeeSideBar = ({ open, onClose }: Props) => {
    const Cartproduct:[]=[];
   
    const cartContent = (
        <Box>
          {/* ------------------------------------------- */}
          {/* Cart Content */}
          {/* ------------------------------------------- */}
          <Box>
            <CartItems />
          </Box>
        </Box>
      );
  return (
    <Box>
    {/* ------------------------------------------- */}
    {/* Cart Sidebar */}
    {/* ------------------------------------------- */}
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
        justifyContent="space-between"
      >
        <Typography variant="h5" fontWeight={600}>
         Registered Courses
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

      {/* component */}
      {cartContent}
      {/* ------------------------------------------- */}
      {/* Checkout  */}
      {/* ------------------------------------------- */}
      <Box px={3} mt={2}>
        {Cartproduct.length > 0 ? (
          <>
            <Stack direction="row" justifyContent="space-between" mb={3}>
              <Typography variant="subtitle2" fontWeight={400}>
                Total
              </Typography>
              <Typography variant="subtitle2" fontWeight={600}>
              ₹{"100"}
              </Typography>
            </Stack>
            <Button
              fullWidth
              component={Link}
              href="#"
              variant="contained"
              color="primary"
            >
              Checkout
            </Button>
          </>
        ) : (
          ""
        )}
      </Box>
    </Drawer>
  </Box>
  )
}

export default ExamFeeSideBar
