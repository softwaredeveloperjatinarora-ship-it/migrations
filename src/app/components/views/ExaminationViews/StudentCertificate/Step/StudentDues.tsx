import { Avatar, Box, Divider, Stack, Typography, useTheme } from '@mui/material';
import React from 'react'
import { IconBadge, IconCalendarDue, IconChecks, IconClockCheck, IconClockHour9, IconContract, IconCross, IconDatabase, IconHome, IconMapPin, IconPhone, IconPhotoStar, IconScreenShare, IconUser, IconUxCircle } from '@tabler/icons-react';
import BlankCard from '@/app/components/shared/BlankCard';
import ChildCard from '@/app/components/shared/ChildCard';
import { Warning } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';

const StudentDues = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = theme.palette.primary.light;



    const clearanceData = [
        {
          dueType: "From Concerned Faculty/School(if applicable): Dues Outstanding / Dues Cleared:",
          responsiblePerson: "Central Library::Dr. Yogish",
          mobileNo: "9876543072",
          status: 1
        },
        {
          dueType: "From Central Library : Dues Outstanding / Dues Cleared:",
          responsiblePerson: "Central Library::Dr. Yogish",
          mobileNo: "9876543072",
          status: 1
        },
        {
          dueType: "Amount of Security paid by the Students, Debit amount on account of fines etc, Additional payable amount pending, Total to be refunded/Additional amount to be paid for Clearance (if any)",
          responsiblePerson: "Department of Accounts (Administrative)::Krishan Lal",
          mobileNo: "9876543002",
          status: 1
        },
        {
          dueType: "Clearance from Record Cell",
          responsiblePerson: "Department of Records::Vinod Kumar",
          mobileNo: "9876543409",
          status: 1
        },
        {
          dueType: "Division of Admissions - Turnstile Cell",
          responsiblePerson: "Online Payment Support Cell::Gurpreet Singh",
          mobileNo: "9876543463",
          status: 0
        }
      ];
      
  return (
    <>
      <BlankCard>
        <ChildCard title="No Dues">
          <Stack spacing={2}>
            {clearanceData.map((stat, i) => (
              <Stack
                direction="row"
                spacing={3}
                justifyContent="space-between"
                alignItems="center"
                key={i}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar
                    variant="rounded"
                    sx={{
                      bgcolor: primarylight,
                      color: primary,
                      width: 40,
                      height: 40,
                    }}
                  >
                    <IconContract width={20} />
                  </Avatar>
                  <Box>
                    <Typography
                      variant="subtitle1"
                      mb="1px"
                      sx={{ fontWeight: "bold" }}
                    >
                      {stat.dueType}
                    </Typography>
                    <Box
                      display="flex"
                      alignItems="center"
                      flexWrap="wrap"
                      gap={2}
                    >
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <IconHome width={15} />
                        <Typography variant="subtitle2" color="textSecondary">
                          {stat.responsiblePerson.split("::")[0]}
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" gap={0.5}>
                        <IconUser width={15} />
                        <Typography variant="subtitle2" color="textSecondary">
                          {stat.responsiblePerson.split("::")[1]}
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" gap={0.5}>
                        <IconPhone width={15} />
                        <Typography variant="subtitle2" color="textSecondary">
                          {stat.mobileNo}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Stack>

                <Avatar
                  variant="rounded"
                  sx={{
                    bgcolor: stat.status?theme.palette.success.light:theme.palette.warning.light,
                    color:  stat.status?theme.palette.success.main:theme.palette.warning.main,
                    width: 40,
                    height: 40,
                  }}
                >
                  {stat.status?<IconChecks width={20} />:<CloseIcon  width={20}/>}
                  
                </Avatar>
              </Stack>
            ))}
          </Stack>
          <Divider sx={{mt:2}}/>
          <footer
                style={{
                  marginTop: "8px",
                  fontWeight: "bold",
                  textAlign: "justify",
                  textJustify: "inter-word",
                  fontSize:'15px',
                  color:'red'
                }}
              >
                {"Disclaimer:Kindly clear all pending dues before applying for certificates. Applications will not be processed until dues are settled."}
              </footer>
        </ChildCard>
      </BlankCard>
    </>
  );
}

export default StudentDues
