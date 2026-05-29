import { Box, Button, Typography } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const CartItems = () => {
  return (
    <Box px={3}>
        <Box textAlign="center" mb={3}>
          <Image src='/images/backgrounds/board-2799814.jpg' alt="cart" width={200} height={200} />
          <Typography variant="h5" mb={2}>
          No Courses Registered
          </Typography>
          <Button
            component={Link}
            href="#"
            variant="contained"
          >
            Go back to Add Course
          </Button>
        </Box>
    </Box>
  )
}

export default CartItems
