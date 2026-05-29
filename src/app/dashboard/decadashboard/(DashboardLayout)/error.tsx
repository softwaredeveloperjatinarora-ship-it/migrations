'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import  { Box, Button, Container, Typography } from '@mui/material';



import Image from "next/image";
interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

export default function DashboardError({ error, reset }: ErrorPageProps) {
  const router = useRouter();

  useEffect(() => {
    console.error('Dashboard error:', error);
  }, [error]);

  return (
  
    <>
    <Box
        display="flex"
        flexDirection="column"
        height="100vh"
        textAlign="center"
        justifyContent="center"
      >
        <Container maxWidth="md">
          <Image
            src={"/images/backgrounds/error500.png"}
            alt="Not Found"
            width={400}
            height={400}
            style={{ width: "100%", maxWidth: "500px", maxHeight: "500px" }}
          />
          <Typography align="center" variant="h6" >
            {error.message}
          </Typography>
          <Typography align="center" variant="h1" >
            {"Oops!!!"}
          </Typography>
          
      
          <Typography align="center" variant="h4" >
            {"Something went wrong while loading the page."}
          </Typography>
          <Typography align="center" variant="h6" mb={4}>
            {"This might be due to a temporary issue or a technical error."}
          </Typography>
          <Button variant="contained" onClick={() => reset()}>
          Try Again
        </Button>
        </Container>
      </Box>
    </>
  );
}
