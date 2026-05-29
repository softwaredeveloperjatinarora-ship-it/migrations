"use client";
import React from "react";
import {
    Box,
    Typography,
    Grid,
  
} from "@mui/material";

import ContactMailOutlinedIcon from "@mui/icons-material/ContactMailOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import AttachEmailOutlinedIcon from "@mui/icons-material/AttachEmailOutlined";

const iconStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};
interface JobdetailsProps {
 
  company: any;
}

const JobDescriptionDetails: React.FC<JobdetailsProps> = ({company }) => {
    return (
        <Box display="flex" flexDirection="column" gap={1} justifyContent="center">
         
              <Box mt={3}>
                       <Typography sx={{ fontSize: "16px", mb: 1, ml: 4 }} fontWeight="bold">
                         HR Details
                       </Typography>
                       </Box>
             <Grid container spacing={1}  sx={{display:"flex",justifyContent:"space-between"}}>
                <Grid size={{ xs: 6, sm: 6, md: 3 }}>
                    <Box display="flex" flexDirection="column" gap={0.5}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Box sx={iconStyle}>
                                <ContactMailOutlinedIcon
                                    sx={{ color: "#0074BA", width: "26px", mt: 2,ml: 4 }}
                                />
                            </Box>
                            <Typography variant="body1" fontWeight="bold" >
                                Contact Person:
                            </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ pl: 3.4,ml: 4 }}>
                            Vikas rana
                        </Typography>
                    </Box>
                </Grid>
                
                 
                
                <Grid size={{ xs: 6, sm: 6, md: 3 }}>
                    <Box display="flex" flexDirection="column" gap={0.5}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Box sx={iconStyle}>
                                <LocalPhoneOutlinedIcon
                                    sx={{ color: "#0074BA", width: "26px", mt: 2 }}
                                />
                            </Box>
                            <Typography variant="body1" fontWeight="bold">
                                Contact No.
                            </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ pl: 3.4 }}>
                            123456778
                        </Typography>
                    </Box>
                </Grid>
                <Grid size={{ xs: 6, sm: 6, md: 3 }}>
                    <Box display="flex" flexDirection="column" gap={0.5}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Box sx={iconStyle}>
                                <AttachEmailOutlinedIcon
                                    sx={{ color: "#0074BA", width: "26px", mt: 2 }}
                                />
                            </Box>
                            <Typography variant="body1" fontWeight="bold">
                                HR Email-Id:
                            </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ pl: 3.4 }}>
                            vikas@gmail.com
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
            
           
           
                    
        </Box>
    );
};

export default JobDescriptionDetails;
