import React from 'react'
import {
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    Grid } from "@mui/material";
  import Image from "next/image";
import ParentCard from '@/app/components/shared/ParentCard';


interface Porps{
    img?:string
    heading?:string
    subMsg?:string
}

const AccessRestricted = ({img,heading,subMsg}:Porps) => {
    return (
        <ParentCard title="Important Note">
          <CardContent sx={{ p: "30px" }}>
            <Box textAlign="center">
              <Image
                src={img!}
                width={200}
                height={200}
                alt="star"
                style={{ width: "200px" }}
              />
    
              <Typography variant="h3" mt={3}>
               {heading}
              </Typography>
              <Typography variant="h6" color="textSecondary" mt={1} mb={2}>
                {subMsg}
              </Typography>
            </Box>
          </CardContent>
        </ParentCard>
      );
}

export default AccessRestricted
