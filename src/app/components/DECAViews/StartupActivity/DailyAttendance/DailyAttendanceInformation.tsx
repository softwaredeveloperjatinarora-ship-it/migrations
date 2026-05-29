"use client";

import {
  Typography,
  Box,
  Avatar,
  LinearProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import ParentCard from "@/app/components/shared/ParentCard";
import BlankCard from "@/app/components/shared/BlankCard";
import { IconTrash } from "@tabler/icons-react";
import { Stack } from "@mui/system";

const columns = [
  { id: "SrNo", label: "Sr.No", minWidth:5 },
  { id: "examdate", label: "Exam Date", minWidth: 5 },
  { id: "empid", label: "Empolyee Id", minWidth: 5, },
  {id: "emptype", label: "Empolyee Type",  minWidth: 5},
];


const rows = [
  {
    id: 1,
    examdate:'2025-01-01',
    empid: 28284,
    emptype: "Observer",
},
  {
    id: 2,
    examdate:'2025-01-01',
    empid: 28284,
    emptype: "Neutral",
  },
  {
    id: 3,
    examdate:'2025-01-01',
    empid: 28284,
    emptype: "Flying",
    
  },
 

  {
    id: 4,
    examdate:'2025-01-01',
    empid: 28284,
    emptype: "Observer",
},
  {
    id: 5,
    examdate:'2025-01-01',
    empid: 28284,
    emptype: "Observer",
  },
  {
    id: 6,
    examdate:'2025-01-01',
    empid: 28284,
    emptype: "Observer",
    
  },
  {
    id: 7,
    examdate:'2025-01-01',
    empid: 28284,
    emptype: "Observer",
},
  {
    id: 8,
    examdate:'2025-01-01',
    empid: 28284,
    emptype: "Observer",
  },
  {
    id: 10,
    examdate:'2025-01-01',
    empid: 28284,
    emptype: "Observer",
    
  },
 
 

];

const DailyAttendanceInfomation = () => {
  //const Capitalize = (str: any) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <ParentCard title="Daily Staff Attendance Information">
      <BlankCard>
        <TableContainer
          sx={{
            maxHeight: 440,
          }}
        >
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id}
                    style={{ minWidth: column.minWidth }}  >
                    <Typography variant="h5" textAlign={"center"} fontWeight="500">
                      {column.label}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                return (
                  <TableRow hover key={row.id}>
                    <TableCell>
                      <Stack>
                        <Box>
                          <Typography color="textSecondary" textAlign={"center"}  variant="h6"  mt={1} fontWeight="300">
                            {row.id}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack spacing={1}>
                        <Typography color="textSecondary" textAlign={"center"}  variant="subtitle2" fontWeight="400" whiteSpace="nowrap" >
                          {row.examdate}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack spacing={1}>
                        <Typography variant="subtitle2" textAlign={"center"}  >{row.empid}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack spacing={1}>
                        <Typography variant="subtitle2" textAlign={"center"}  >{row.emptype}</Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </BlankCard>
    </ParentCard>
  );
};

export default DailyAttendanceInfomation;
