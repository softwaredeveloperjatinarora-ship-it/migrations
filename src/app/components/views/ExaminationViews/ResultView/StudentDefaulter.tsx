import React from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Image from "next/image";

interface Props{
    Description:string
    OfficeAddress:string
    gender:string
}

const StudentDefaulter = ({Description,OfficeAddress,gender}:Props) => {
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
             src={
                "/images/backgrounds/" +
                (gender.toLowerCase() === "m" ? "StudentDefaultM" : "StudentDefaultF") +
                ".svg"
              }
             alt="Not Found"
             width={500}
             height={500}
             style={{ width: "100%", maxWidth: "500px", maxHeight: "500px" }}
           />
           <Typography align="center" variant="h3" mb={4}>
             {'🚫 Access Restricted Due to '+Description}
           </Typography>
           <Typography align="center" variant="h6" mb={4}>
            {'We are unable to display your results right now.'}
           </Typography>
           <Typography align="center" variant="h6" mb={4}>
             {'For more information or assistance, kindly contact the '+OfficeAddress}
           </Typography>
         </Container>
       </Box>
  )
}

export default StudentDefaulter
