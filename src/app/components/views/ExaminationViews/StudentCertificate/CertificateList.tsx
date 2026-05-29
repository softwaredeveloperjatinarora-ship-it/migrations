import BlankCard from '@/app/components/shared/BlankCard'
import ChildCard from '@/app/components/shared/ChildCard'
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Grid, Stack, Typography, useTheme } from '@mui/material'
import { IconCertificate2, IconChevronDown } from '@tabler/icons-react'
import React, { useState } from 'react'
import { Add, Check } from "@mui/icons-material";
import { it } from 'node:test'
import CertificateCart from './cart/CertificateCart'
import CertificateSideBar from './cart/CertificateSideBar'

export interface certificate {
    name: string;
    price: string;
  }

const certificates = [
  {
    type: "1",
    certificat: [
      {
        CertificateType: "4",
        CertificateDescription: "Indicative Marks",
        Fees: 500,
        SpecialCertificate: 1,
      },
    ],
  },
  {
    type: "0",
    certificat: [
      {
        CertificateType: "C",
        CertificateDescription: "Character",
        Fees: 100,
        SpecialCertificate: 0,
      },
      {
        CertificateType: "CRT010",
        CertificateDescription: "Pass Out Bonafide Certificate",
        Fees: 100,
        SpecialCertificate: 0,
      },
      {
        CertificateType: "CRT022",
        CertificateDescription: "Instructions of Medium Certificate",
        Fees: 100,
        SpecialCertificate: 0,
      },
      {
        CertificateType: "G",
        CertificateDescription: "Provisional Degree",
        Fees: 100,
        SpecialCertificate: 0,
      },
      {
        CertificateType: "M",
        CertificateDescription: "Migration",
        Fees: 500,
        SpecialCertificate: 0,
      },
      {
        CertificateType: "T",
        CertificateDescription: "Original Academic Transcript",
        Fees: 0,
        SpecialCertificate: 0,
      },
    ],
  },
];

const CertificateList = () => {
      const theme = useTheme();
      const primary = theme.palette.primary.main;
      const primarylight = theme.palette.primary.light;
       const [selectedCertificate, setSelectedCertificate] = useState<certificate[]>([]);
         const [isSidebarOpen, setIsSidebarOpen] = useState(false);
      const [expanded, setExpanded] = useState<string[]>(['panel0','panel1']); 

      const handleChange = (panelId: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded((prev) =>
          isExpanded ? [...prev, panelId] : prev.filter((id) => id !== panelId)
        );
      };
      
       const handleToggleCourse = (certificate: certificate, checked: boolean) => {
        setSelectedCertificate(
           (prevCourses) =>
             checked
               ? [...prevCourses, certificate]
               : prevCourses.filter((c) => c.name !== certificate.name) 
         );
       };


     

  return (
    <>
      <BlankCard>
        <ChildCard title="Certificate List">
          <Grid container spacing={0.3}>
            <Grid size={{ xs: 12 }}>
              {certificates.map((certificates, index) => (
                <Accordion
                  expanded={expanded.includes(`panel${index}`)}
                  onChange={handleChange(`panel${index}`)}
                  key={index}
                >
                  <AccordionSummary
                    expandIcon={<IconChevronDown />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                    key={index}
                    sx={{
                      flexDirection: "row-reverse",
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: "white",
                          color: "white",
                          width: 36,
                          height: 36,
                          fontSize: "1rem",
                        }}
                      >
                        🎓
                      </Avatar>
                      <Typography variant="h6" fontWeight="bold">
                        {certificates.type == "0"
                          ? "Regular Certificate"
                          : "Special Certificate"}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={2} mt={0.5}>
                      {certificates.certificat.map((item, i) => (
                        <Stack
                          direction="row"
                          spacing={3}
                          justifyContent="space-between"
                          alignItems="center"
                          key={i}
                        >
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                          >
                            <Avatar
                              variant="rounded"
                              sx={{
                                bgcolor: primarylight,
                                color: primary,
                                width: 40,
                                height: 40,
                              }}
                            >
                              <IconCertificate2 width={20} />
                            </Avatar>
                            <Box>
                              <Typography variant="h6" mb="4px">
                                {item.CertificateDescription}
                              </Typography>
                              <Typography
                                variant="subtitle2"
                                color="textSecondary"
                              >
                                ₹{item.Fees}
                              </Typography>
                            </Box>
                          </Stack>
                          <Avatar
                            variant="rounded"
                            sx={{
                                backgroundColor: selectedCertificate.some(
                                    (certificate) => certificate.name === item.CertificateDescription
                                  )
                                    ? "success.main"
                                    : "primary.main",
                              width: 40,
                              height: 40,
                              cursor: "pointer",
                              borderRadius: "50%"
                            }}
                            onClick={() =>
                                handleToggleCourse(
                                  { name: item.CertificateDescription, price:item.Fees.toString() },
                                  !selectedCertificate.some(
                                    (certificate) => certificate.name === item.CertificateDescription
                                  )
                                )
                              }
                          >
                            {selectedCertificate.some(
                              (certificate) =>
                                certificate.name === item.CertificateDescription
                            ) ? (
                              <Check  sx={{width:20}} />
                            ) : (
                              <Add  sx={{width:20}} />
                            )}
                          </Avatar>
                        </Stack>
                      ))}
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Grid>
            <Grid size={{ sm: 12 }}>
          <CertificateCart
            items={selectedCertificate}
            onOpenSidebar={() => {
              setIsSidebarOpen(true);
            }}
          />
        </Grid>
          </Grid>
        </ChildCard>
        <CertificateSideBar
        open={isSidebarOpen}
        items={selectedCertificate}
        onClose={() => setIsSidebarOpen(false)}
      />
      </BlankCard>
    </>
  );
}

export default CertificateList
