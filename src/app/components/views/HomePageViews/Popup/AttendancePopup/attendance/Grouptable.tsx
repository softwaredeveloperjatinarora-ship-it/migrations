"use client"
import { Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useMediaQuery } from "@mui/material";
import StatusLabel from "./statusLabel";
import { grey } from "@mui/material/colors";
import { filteredStruct } from "./attendencemain";

export function Grouptable({ filteredAllData }: { filteredAllData: filteredStruct[] }) {

    // console.log("data2", filteredAllData)
    const isXs = useMediaQuery("(max-width:600px)")

    const attenTableHeader = ['Type', 'Date', 'Time', 'Faculty', 'Status', 'DL', 'Block-reason']


    return (
        <TableContainer component={Paper} sx={{ height: '100%', overflow: 'auto', boxShadow: "none" }} >

            <Table sx={{ minWidth: 'auto' }} aria-label="simple table">
                <TableHead sx={{ display: { xs: "none", sm: "table-header-group" } }}>
                    <TableRow>
                        {attenTableHeader.map((data, key) =>
                            <TableCell key={key} sx={{ p: 1 }} align="center">{data}</TableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody >
                    {filteredAllData.map((row: any, key: any) => {
                        const date = new Date(row.AttendanceDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                        return (
                            !isXs ?
                                <TableRow key={key} >

                                    {/* <TableCell sx={{ p: 1, borderBottom: '1 solid' }} align="center">{row.attendanceType == 'L' ? <MenuBookOutlined titleAccess={row.attendanceType} /> : <LaptopOutlined titleAccess={row.attendanceType} />}</TableCell> */}
                                    <TableCell sx={{ p: 1, borderBottom: '1 solid' }} align="center">{row.AttendanceType == 'L' ? "Lecture" : "Practical"}</TableCell>
                                    <TableCell sx={{ p: 1, borderBottom: '1 solid' }} align="center">{date}</TableCell>
                                    <TableCell sx={{ p: 1, borderBottom: '1 solid' }} align="center">{row.AttendanceTime}</TableCell>
                                    <TableCell sx={{ p: 1, borderBottom: '1 solid' }} align="center">{row.Name}</TableCell>
                                    <TableCell sx={{ p: 1, borderBottom: '1 solid' }} align="center">{<StatusLabel status={row.AttendanceCode == 'P' ? 'Present' : 'Absent'}></StatusLabel>}</TableCell>
                                    <TableCell sx={{ p: 1, borderBottom: '1 solid' }} align="center">{row.dutyLeave === "" ? "-" : row.DutyLeave}</TableCell>
                                    <TableCell sx={{ p: 1, borderBottom: '1 solid' }} align="center">{row.BlockReason}</TableCell>
                                </TableRow> :

                                <TableRow key={key} sx={{ display: "flex", flexDirection: 'column', border: 1, rowGap: .5, mb: 1, columnGap: 0, borderColor: grey[200], borderRadius: 1, p: 1 }}>
                                    <TableCell sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: 'max-content', m: 0, p: .5, borderBottom: 0 }}>
                                        <Chip
                                            label={date}
                                            variant="filled"
                                            size="small"
                                            sx={{
                                                borderRadius: '8px',
                                                backgroundColor: 'rgba(75, 71, 77, 0.1)',
                                                color: "#6D4C41"

                                            }}
                                        ></Chip>
                                        <StatusLabel status={row.AttendanceCode == 'P' ? 'Present' : 'Absent'}></StatusLabel>
                                    </TableCell>
                                    <TableCell sx={{ m: 0, p: .5, pl: 2, borderBottom: 0, display: 'flex', flexDirection: 'column', gap: .5 }}>
                                        <Typography component='span' variant="body2"><span style={{ fontWeight: "bold" }}>{"Time - "}</span>{row.AttendanceTime}</Typography>
                                        <Typography component='span' variant="body2"><span style={{ fontWeight: "bold" }}>{"Faculty - "}</span>{row.Name}</Typography>
                                        <Typography component='span' variant="body2"><span style={{ fontWeight: "bold" }}>{"Block Reason - "}</span>{row.BlockReason}</Typography>
                                        <Typography component='span' variant="body2"><span style={{ fontWeight: "bold" }}>{"Class Mode - "}</span>{row.AttendanceType == 'L' ? "Lecture" : "Practical"}</Typography>
                                    </TableCell>
                                </TableRow>

                        )
                    })}

                </TableBody>
            </Table>
        </TableContainer>
    );
}