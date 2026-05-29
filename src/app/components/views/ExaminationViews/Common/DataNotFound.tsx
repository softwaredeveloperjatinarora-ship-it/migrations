import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Image from "next/image";
const DataNotFound = () => {
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
          src={"/images/backgrounds/notfound.svg"}
          alt="Not Found"
          width={500}
          height={500}
          style={{ width: "100%", maxWidth: "500px", maxHeight: "500px" }}
        />
        <Typography align="center" variant="h3" mb={4}>
          {"📄 No Result Data Available"}
        </Typography>
        <Typography align="center" variant="h6" mb={4}>
          {
            "We couldn't find any result information for your account at this time."
          }
        </Typography>
      </Container>
    </Box>
  );
};

export default DataNotFound;
