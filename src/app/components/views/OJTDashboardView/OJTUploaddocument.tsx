
"use client";
import React from "react";
import { Box, Typography, Avatar,  Grid } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneIcon from '@mui/icons-material/Phone';


// Icon Wrapper Styles
const iconStyle = {
  p: 1,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 20,
  height: 20,
};
interface HrdetailProps {
  company: any; 
}

const Uploaddata: React.FC<HrdetailProps> = ({ company }) => {
  const attachments = [
    {
      name: "offerLetter.pdf",
      size: "2MB",
      icon: <PictureAsPdfIcon color="error" />,
    },
   
  ];

  return (
    <>
      <Box mt={3}>
        <Typography sx={{ fontSize: "16px", mb: 1, ml: 4 }} fontWeight="bold">Mentor</Typography>
      </Box>
      <Box mt={1}>

        {/* Mentor Details */}
       <Grid container spacing={2} alignItems="center">
     <Grid size={{ xs: 12,  md: 4 }}>
      <Box display="flex" flexDirection="column" gap={0.5}   mt={1}
      sx={{
        ml:{xs:1,md:6},
        
      }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Box sx={iconStyle}>
             <Avatar sx={{ bgcolor: "orange",mt:3}} />
          </Box>
         <Typography variant="subtitle1" fontWeight="bold" sx={{
          ml:{xs:1,md:2}
         }}
         
         >
          Sukhbeer Kaur 
        </Typography> 
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ pl: 6 }}>
          UID-33309
        </Typography>
      </Box>
    </Grid>

    {/* Email */}
    <Grid size={{ xs: 12,  md: 4 }}>
      <Box display="flex" flexDirection="column" gap={0.5}>
        <Box display="flex" alignItems="center" gap={1}>
          <Box sx={iconStyle}>
            <MailOutlineIcon sx={{ color: "#0074BA", width: 22, height: 22,mt:3 }} />
          </Box>
          <Typography variant="body1" fontWeight="bold">
             Mentor Email-Id:
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ pl: 4 }}>
          admin@gmail.com
        </Typography>
      </Box>
    </Grid>

    {/* Phone */}
    <Grid size={{ xs: 12,  md: 4 }}>
      <Box display="flex" flexDirection="column" gap={0.5}>
        <Box display="flex" alignItems="center" gap={1}>
          <Box sx={iconStyle}>
            <PhoneIcon sx={{ color: "#0074BA", width: 22, height: 22,mt:3 }} />
          </Box>
          <Typography variant="body1" fontWeight="bold">
           Contact No.
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ pl: 4 }}>
          123456789
        </Typography>
      </Box>
    </Grid>
  </Grid>

        {/* Uploaded Documents */}
        <Box mt={3} ml={4}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
           Offer Letter 
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={2}>
            {attachments.map((file, index) => (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                gap={1}
                sx={{ p: 1, borderRadius: 1, border: "1px solid #ddd" }}
              >
                {file.icon}
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    {file.name}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

      </Box>
    </>


  );
};

export default Uploaddata;

