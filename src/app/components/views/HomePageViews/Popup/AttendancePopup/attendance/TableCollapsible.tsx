"use client";

import * as React from "react";
import { filteredStruct, attendenceDetail } from "./attendencemain";
import { Grouptable } from "./Grouptable";
import {
  Typography,
  Box,
  Paper,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  useMediaQuery,

} from "@mui/material";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import StatusLabel from "./statusLabel";
import GroupRadio from "./GroupRadio";
import PrinterAndAllData from "./PrinterAndAllData";
import { useTheme } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { designPageLayout } from "./attendenceUtils";


function Row(props: { index: number, row: string, allData: filteredStruct[], attendence?: attendenceDetail }) {
  const { row, allData, attendence, index } = props;
  const isXs = useMediaQuery("(max-width:600px)")
  const [open, setOpen] = React.useState(true);
  // console.log(row)
  const theme = useTheme();

  return (
    <>
      <TableRow id={`row-${row}`} onClick={() => { setOpen(!open) }} sx={{ "& > *": { borderBottom: "unset" }, cursor: 'pointer', display: { xs: 'flex', sm: 'table-row' }, gap: 2, flexDirection: { xs: 'row' }, borderRadius: 1, bgcolor: theme.palette.mode === "dark" ? theme.palette.background.paper : theme.palette.primary.light, border: 'none', borderBottom: 'none', p: 0, m: 0, }}>
        {isXs ?
          <>
            <TableCell sx={{ borderBottom: 'none', display: 'flex', alignItem: 'center', p: 0 }}>
              <IconButton
                aria-label="expand row"
                size="small"

              >
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>

            </TableCell>
            <TableCell sx={{ p: 1, borderBottom: 'none', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1, gap: 1 }} >
              <Box sx={{ p: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: { xs: 0 }, width: '85%' }}>
                <Typography variant={"body1"} fontWeight={"500"}>
                  {row}
                </Typography>
                <StatusLabel status={"DutyLeave"} val={attendence?.DutyLeave} />
                <Typography variant="h6" fontWeight="600">
                  {attendence?.Total_Perc + "%"}
                </Typography>
              </Box>
              <Typography variant={isXs ? "body1" : "h6"} fontWeight={isXs ? "500" : "600"} >
                {allData.find((element) => element.CourseCode == row)?.CourseName}
              </Typography>
            </TableCell>
          </> :
          <>
            <TableCell sx={{ p: { xs: 1 }, borderBottom: { xs: 0 } }}>
              <IconButton
                aria-label="expand row"
                size="small"
              >
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </TableCell>
            <TableCell sx={{ p: { xs: 1 }, borderBottom: { xs: 0 } }}>
              <Typography variant={"h6"} fontWeight={"600"}>
                {row}
              </Typography>

            </TableCell>
            <TableCell sx={{ p: { xs: .5 }, borderBottom: { xs: 0 }, }} >
              <Typography variant={isXs ? "body1" : "h6"} fontWeight={isXs ? "500" : "600"} >
                {allData.find((element) => element.CourseCode == row)?.CourseName}
              </Typography>

            </TableCell>
            <TableCell sx={{ p: { xs: 1 }, borderBottom: { xs: 0 } }}>

              <StatusLabel status={"DutyLeave"} val={attendence?.DutyLeave} />

            </TableCell>
            <TableCell sx={{ p: { xs: 1 }, borderBottom: { xs: 0 } }}>
              <Typography variant="h6" fontWeight="600">
                {attendence?.Total_Perc + "%"}
              </Typography>

            </TableCell>

          </>
        }
      </TableRow>
      <TableRow>
        <TableCell sx={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Grouptable filteredAllData={allData.filter((course) => course.Coursecode === row)} ></Grouptable>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
const TableCollapsible = ({ courseCode, superData }: { courseCode: string[], superData: { allCourse: filteredStruct[], attendenceDetail: attendenceDetail[] } }) => {




  const theme = useTheme();
  const ref = React.useRef<HTMLDivElement>(null);
  const isXs = useMediaQuery('600px')
  const initialValue = React.useMemo(() => courseCode[0], [])
  const [designedTable, setDesignedTable] = React.useState('');
  const [selectedCourse, setSelectedCourse] = React.useState('Top');
  const [isOverflow, setIsOverflow] = React.useState(false);

  React.useEffect(() => {
    if (ref.current) {
      const { scrollWidth, clientWidth } = ref.current;
      setIsOverflow(scrollWidth > clientWidth);
    }
  }
    , [ref.current, courseCode]);

  React.useEffect(() => {

    setDesignedTable(designPageLayout(superData))
  }, [superData])



  const scroll = (direction: 'left' | 'right') => {
    if (ref.current) {
      const amount = direction === 'left' ? -100 : 100;
      ref.current.scrollBy({
        left: amount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Box sx={{ p: 1, bgcolor: theme.palette.mode === "dark" ? theme.palette.background.paper : 'AppWorkspace', width: '100%', borderRadius: 2, borderTopRightRadius: 0, borderTopLeftRadius: 0, }}>
      <Box sx={{ my: 2, width: 'auto', maxWidth: '100%', display: 'flex', position: 'sticky', top: '0%', bgcolor: "transparent", zIndex: 1110000, borderRadius: 1, justifyContent: 'space-around', alignItems: 'center' }}>
        {isOverflow && <IconButton onClick={() => scroll('left')}>
          <ArrowBackIos />
        </IconButton>}
        {!isXs ?
          <Box
            ref={ref}
            sx={{
              width: '95%',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              position: "sticky",
            }}
          >
            <GroupRadio courseCode={['Top', ...courseCode]} selectedCourse={selectedCourse} setSelectedCourse={setSelectedCourse} />

          </Box> : ''}
        {isOverflow && <IconButton onClick={() => scroll('right')}>
          <ArrowForwardIos />
        </IconButton>}

        <PrinterAndAllData designedTable={designedTable} />
      </Box>

      <TableContainer component={Paper} sx={{ width: { xs: '100%' }, boxShadow: 'none', border: 'none' }}>
        <Table
          aria-label="collapsible table"
          sx={{
            whiteSpace: {
              xs: "wrap",
              sm: "unset",
            },
          }}
        >

          <TableBody>
            {courseCode.map((row, index) => (
              <Row key={row} index={index} row={row} allData={superData.allCourse} attendence={superData.attendenceDetail.find((ele) => ele.CourseCode === row)} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default TableCollapsible;
