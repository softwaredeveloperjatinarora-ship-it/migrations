
import React from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Image from "next/image";
const Error = () => {
    return (
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
            width={500}
            height={500}
            style={{ width: "100%", maxWidth: "500px", maxHeight: "500px" }}
          />
          <Typography align="center" variant="h1" mb={4}>
            {"Oops!!!"}
          </Typography>
          <Typography align="center" variant="h4" mb={4}>
            {"Something went wrong while loading the page."}
          </Typography>
          <Typography align="center" variant="h6" mb={4}>
            {"This might be due to a temporary issue or a technical error."}
          </Typography>
        </Container>
      </Box>
    );
}

export default Error
