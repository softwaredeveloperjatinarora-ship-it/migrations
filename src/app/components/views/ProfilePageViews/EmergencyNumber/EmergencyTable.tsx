'use client'
import React, { useState } from 'react';
import {
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  TableHead,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { Stack } from '@mui/system';
import { TableType, basicsTableData, EnTableType, EnhancedTableData, WomenHelpCenter, FireAndSafety } from './tableData';
import BlankCard from '@/app/components/shared/BlankCard';
import { Icon } from "@iconify/react";
import { IconX } from '@tabler/icons-react';



const basics: TableType[] = basicsTableData;

const basics2: EnTableType[] = EnhancedTableData;

const basics3: EnTableType[] = WomenHelpCenter;

const basics4: EnTableType[] = FireAndSafety;



const EmergencyTable = () => {

  const [isOpen, setIsOpen] = useState(false);


  return (
    <>

      <Button
        variant="contained"
        sx={{
          borderRadius: "38%", bgcolor: "success.light", color: "success.main", minWidth: "50px", height: "50px", display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
        onClick={() => setIsOpen(true)}
      >
        <Icon icon="material-symbols:e911-emergency-outline" width="20" height="20" />
      </Button>
      <Typography
        variant="subtitle2"
        fontWeight={600}
        color="textPrimary"
        className="text-hover"
        noWrap
        sx={{
          width: "240px",
          marginLeft: 2,
        }}
        onClick={() => setIsOpen(true)}
      >
        Emergency Number
      </Typography>


      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        PaperProps={{ sx: { width: "100%", height: "90%" ,padding:"2px"} }}
        maxWidth="lg"
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Emergency Number
          <IconButton onClick={() => setIsOpen(false)} size="small" sx={{ ml: 2 }}>
            <IconX color="#FF8488" size={24} />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ padding: 0, fontSize: { sm: "1px" } }}>
          {/* Table 1 */}
          <Typography variant="h4" sx={{ display: "flex", justifyContent: "center", margin: "10px", color: "primary.main" }}>
            Important Phone Numbers : Residential Facilities
          </Typography>
          <BlankCard>
            <TableContainer sx={{ margin: "5px" }}>
              <Table
                aria-label="simple table"
                sx={{
                  width: '100%',

                  whiteSpace: { xs: 'normal', sm: 'nowrap' },
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell sx={{
                      textAlign: 'center',
                      padding: { xs: '1px', sm: '2px' },
                      wordBreak: 'break-word',
                    }}
                    >
                      <Typography variant="h6">Hostel</Typography>
                    </TableCell>
                    <TableCell sx={{
                      textAlign: 'center',
                      padding: { xs: '1px', sm: '2px' },
                      wordBreak: 'break-word',
                    }}
                    >
                      <Typography variant="h6">Block</Typography>
                    </TableCell>
                    <TableCell sx={{
                      textAlign: 'center',
                      padding: { xs: '1px', sm: '2px' },
                      wordBreak: 'break-word',
                    }}
                    >
                      <Typography variant="h6">Landline Number
                        <Typography sx={{ fontWeight: "Bold" }}>{"{"}8:00 am to 10:00 pm{'}'}</Typography>
                      </Typography>
                    </TableCell>
                    <TableCell sx={{
                      textAlign: 'center',
                      padding: { xs: '1px', sm: '2px' },
                      wordBreak: 'break-word',
                    }}
                    >
                      <Typography variant="h6">Mobile No.
                        <Typography sx={{ fontWeight: "Bold" }}>(In case of emergency)</Typography>
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {basics.map((basic) => (
                    <TableRow key={basic.id}>
                      {/* Hostel Column */}
                      <TableCell sx={{
                        textAlign: 'center',
                        padding: { xs: '1px', sm: '2px' },
                        wordBreak: 'break-word',
                      }}
                      >
                        <Typography variant="h6" fontWeight={400}>{basic.name}</Typography>
                      </TableCell>

                      {/* Block Column */}
                      <TableCell sx={{
                        textAlign: 'center',
                        padding: { xs: '1px', sm: '2px' },
                        wordBreak: 'break-word',
                      }}
                      >
                        <Stack direction="column" spacing={1} alignItems="center">
                          {basic.teams?.map((team) => (
                            <Typography
                              key={team.id}
                              variant="h6"
                              fontWeight={400}
                              sx={{
                                bgcolor: team.color,
                                padding: "5px 10px",
                                borderRadius: "5px",
                                minWidth: "50px",
                              }}
                            >
                              {team.text}
                            </Typography>
                          ))}
                        </Stack>
                      </TableCell>

                      {/* Landline Number Column */}
                      <TableCell sx={{
                        textAlign: 'center',
                        padding: { xs: '1px', sm: '2px' },
                        wordBreak: 'break-word',
                      }}
                      >
                        <Stack direction="column" spacing={1} alignItems="center">
                          {Array.isArray(basic.pname) ? (
                            basic.pname.map((team) => (
                              <Typography
                                key={team.id}
                                variant="h6"
                                fontWeight={400}
                                sx={{
                                  minWidth: "50px",
                                  padding: "5px",
                                }}
                              >
                                {team.text}
                              </Typography>
                            ))
                          ) : (
                            <Typography variant="h6" fontWeight={400}>{basic.pname}</Typography>
                          )}
                        </Stack>
                      </TableCell>

                      {/* Mobile Number Column */}
                      <TableCell sx={{
                        textAlign: 'center',
                        padding: { xs: '1px', sm: '2px' },
                        wordBreak: 'break-word',
                      }}
                      >
                        <Typography variant="h6" fontWeight={400}>{basic.budget}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </BlankCard>





          {/* Table 2 */}
          <Typography variant="h4" sx={{ display: "flex", justifyContent: "center", margin: "10px", color: "primary.main" }}>
            Emergency Numbers: Hospital
          </Typography>
          <BlankCard>
            <TableContainer sx={{ margin: "5px" }}>
              <Table
                aria-label="simple table"
                sx={{
                  width: '100%',

                  whiteSpace: { xs: 'normal', sm: 'nowrap' },
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "25%", textAlign: "center", fontWeight: "bold" }}>
                      <Typography variant="h6">Department / Official</Typography>
                    </TableCell>
                    <TableCell sx={{ width: "25%", textAlign: "center", fontWeight: "bold" }}>
                      <Typography variant="h6">Mobile No.</Typography>
                    </TableCell>
                    <TableCell sx={{ width: "25%", textAlign: "center", fontWeight: "bold" }}>
                      <Typography variant="h6">Land Line No.
                        <Typography sx={{ fontWeight: "Bold" }}>{"{"} 24×7 {"}"}</Typography>
                      </Typography>
                    </TableCell>

                  </TableRow>
                </TableHead>
                <TableBody>
                  {basics2.map((basic) => (
                    <TableRow key={basic.id}>
                      {/* Hostel Column */}
                      <TableCell sx={{ textAlign: "center", padding: "10px" }}>
                        <Typography variant="h6" fontWeight={400}>{basic.name}</Typography>
                      </TableCell>

                      {/* Block Column */}
                      <TableCell sx={{ textAlign: "center", padding: "10px" }}>
                        <Typography variant="h6" fontWeight={400}>{basic.budget}</Typography>
                      </TableCell>

                      {/* Landline Number Column */}
                      <TableCell sx={{ textAlign: "center", padding: "10px" }}>
                        <Stack direction="column" spacing={1} alignItems="center">
                          {Array.isArray(basic.pname) ? (
                            basic.pname.map((team) => (
                              <Typography
                                key={team.id}
                                variant="h6"
                                fontWeight={400}
                                sx={{
                                  minWidth: "50px",
                                  padding: "5px",
                                }}
                              >
                                {team.text}
                              </Typography>
                            ))
                          ) : (
                            <Typography variant="h6" fontWeight={400}>{basic.pname}</Typography>
                          )}
                        </Stack>
                      </TableCell>


                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </BlankCard>





          {/* Table 3 */}
          <Typography variant="h4" sx={{ display: "flex", justifyContent: "center", margin: "10px", color: "primary.main" }}>
            Emergency Numbers : Women Help Center and Safety Cell
          </Typography>
          <BlankCard>
            <TableContainer sx={{ margin: "5px" }}>
              <Table
                aria-label="simple table"
                sx={{
                  width: '100%',

                  whiteSpace: { xs: 'normal', sm: 'nowrap' },
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "25%", textAlign: "center", fontWeight: "bold" }}>
                      <Typography variant="h6">Official</Typography>
                    </TableCell>
                    <TableCell sx={{ width: "25%", textAlign: "center", fontWeight: "bold" }}>
                      <Typography variant="h6">Mobile No.</Typography>
                    </TableCell>
                    <TableCell sx={{ width: "25%", textAlign: "center", fontWeight: "bold" }}>
                      <Typography variant="h6">Land Line No.
                        <Typography sx={{ fontWeight: "Bold" }}>( 9:00 am -5:00 pm)</Typography>
                      </Typography>
                    </TableCell>

                  </TableRow>
                </TableHead>
                <TableBody>
                  {basics3.map((basic) => (
                    <TableRow key={basic.id}>
                      {/* Hostel Column */}
                      <TableCell sx={{ textAlign: "center", padding: "10px" }}>
                        <Typography variant="h6" fontWeight={400}>{basic.name}</Typography>
                      </TableCell>

                      {/* Block Column */}
                      <TableCell sx={{ textAlign: "center", padding: "10px" }}>
                        <Typography variant="h6" fontWeight={400}>{basic.budget}</Typography>
                      </TableCell>

                      {/* Landline Number Column */}
                      <TableCell sx={{ textAlign: "center", padding: "10px" }}>
                        <Stack direction="column" spacing={1} alignItems="center">
                          {Array.isArray(basic.pname) ? (
                            basic.pname.map((team) => (
                              <Typography
                                key={team.id}
                                variant="h6"
                                fontWeight={400}
                                sx={{
                                  minWidth: "50px",
                                  padding: "5px",
                                }}
                              >
                                {team.text}
                              </Typography>
                            ))
                          ) : (
                            <Typography variant="h6" fontWeight={400}>{basic.pname}</Typography>
                          )}
                        </Stack>
                      </TableCell>


                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </BlankCard>





          {/* Table 4 */}
          <Typography variant="h4" sx={{ display: "flex", justifyContent: "center", margin: "10px", color: "primary.main" }}>
            Emergency Numbers : Fire and Safety Cell
          </Typography>
          <BlankCard>
            <TableContainer sx={{ margin: "5px" }}>
              <Table
                aria-label="simple table"
                sx={{
                  width: '100%',

                  whiteSpace: { xs: 'normal', sm: 'nowrap' },
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "25%", textAlign: "center", fontWeight: "bold" }}>
                      <Typography variant="h6">Official</Typography>
                    </TableCell>
                    <TableCell sx={{ width: "25%", textAlign: "center", fontWeight: "bold" }}>
                      <Typography variant="h6">Mobile No.</Typography>
                    </TableCell>
                    <TableCell sx={{ width: "25%", textAlign: "center", fontWeight: "bold" }}>
                      <Typography variant="h6">Land Line No.
                        <Typography sx={{ fontWeight: "Bold" }}>{"{"} 24×7 {"}"}</Typography>
                      </Typography>
                    </TableCell>

                  </TableRow>
                </TableHead>
                <TableBody>
                  {basics4.map((basic) => (
                    <TableRow key={basic.id}>
                      {/* Hostel Column */}
                      <TableCell sx={{ textAlign: "center", padding: "10px" }}>
                        <Typography variant="h6" fontWeight={400}>{basic.name}</Typography>
                      </TableCell>

                      {/* Block Column */}
                      <TableCell sx={{ textAlign: "center", padding: "10px" }}>
                        <Typography variant="h6" fontWeight={400}>{basic.budget}</Typography>
                      </TableCell>

                      {/* Landline Number Column */}
                      <TableCell sx={{ textAlign: "center", padding: "10px" }}>
                        <Stack direction="column" spacing={1} alignItems="center">
                          {Array.isArray(basic.pname) ? (
                            basic.pname.map((team) => (
                              <Typography
                                key={team.id}
                                variant="h6"
                                fontWeight={400}
                                sx={{
                                  minWidth: "50px",
                                  padding: "5px",
                                }}
                              >
                                {team.text}
                              </Typography>
                            ))
                          ) : (
                            <Typography variant="h6" fontWeight={400}>{basic.pname}</Typography>
                          )}
                        </Stack>
                      </TableCell>


                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </BlankCard>




          <Typography variant="h4" sx={{ display: "flex", justifyContent: "center", marginTop: "20px", color: "primary.main" }}>
            Fee related queries:
          </Typography >
          <Typography sx={{ display: "flex", justifyContent: "center", margin: "5px", }}>Help Desk Landline Number: 01824-444337 (9:00 am to 5:00 pm) E-mail: helpdesk.accounts@lpu.co.in</Typography>
          <Typography sx={{ display: "flex", justifyContent: "center", margin: "5px", }}>Mr. Krishan Lal (Coordinator of Department) 8054848002 E-mail: krishan.lal@lpu.co.in</Typography>
          <Typography sx={{ display: "flex", justifyContent: "center", margin: "5px", }}>Mr Manohar Sharma (Head of Division) 9876740040 E-mail: cgm.lovely@gmail.com</Typography>




          <Typography variant="h4" sx={{ display: "flex", justifyContent: "center", marginTop: "20px", color: "primary.main" }}>
            Division of Student Relationship:
          </Typography >
          <Typography sx={{ display: "flex", justifyContent: "center", margin: "5px", }}>E-mail: parents@lpu.co.in</Typography>
          <Typography sx={{ display: "flex", justifyContent: "center", margin: "5px", }}>Ph: 01824-510311 (9:00 am to 5:00 pm), 7347000929 (M), 8968667777 (M)</Typography>
        </DialogContent>
        <DialogActions>
          <Button size="large"
            variant="text"
            color="primary"

            sx={{
              whiteSpace: "nowrap",
              mt: { xs: 0, sm: 0 },
            }} onClick={() => setIsOpen(false)}  >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>

  );
};

export default EmergencyTable;
