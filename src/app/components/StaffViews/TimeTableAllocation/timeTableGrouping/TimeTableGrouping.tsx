// "use client";
// import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField'
// import BlankCard from '@/app/components/shared/BlankCard';
// import { Autocomplete, Box, Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
// import React, { useState } from 'react'
// import { basicsTableData, TableType } from '../../ProfilePageViews/EmergencyNumber/tableData';
// import ChildCard from '@/app/components/shared/ChildCard';
// import { Icon } from '@iconify/react';







// const tableData = [
//     {
//         "prgInfo": "3492:BA",
//         "courseCode": "EACC105",
//         "courseName": "FINANCIAL ACCOUNTING",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EACC105-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 13,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3504:MBA ",
//         "courseCode": "EACC506",
//         "courseName": "FINANCIAL REPORTING STATEMENTS AND ANALYSIS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EACC506-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3504:MBA ",
//         "courseCode": "EACC506",
//         "courseName": "FINANCIAL REPORTING STATEMENTS AND ANALYSIS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EACC506-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3504:MBA ",
//         "courseCode": "EACC506",
//         "courseName": "FINANCIAL REPORTING STATEMENTS AND ANALYSIS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EACC506-3",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3504:MBA ",
//         "courseCode": "EACC506",
//         "courseName": "FINANCIAL REPORTING STATEMENTS AND ANALYSIS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EACC506-4",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 155,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3500:M.Com ",
//         "courseCode": "EACC506",
//         "courseName": "FINANCIAL REPORTING STATEMENTS AND ANALYSIS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EACC506-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3500:M.Com ",
//         "courseCode": "EACC506",
//         "courseName": "FINANCIAL REPORTING STATEMENTS AND ANALYSIS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EACC506-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3500:M.Com ",
//         "courseCode": "EACC506",
//         "courseName": "FINANCIAL REPORTING STATEMENTS AND ANALYSIS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EACC506-3",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3500:M.Com ",
//         "courseCode": "EACC506",
//         "courseName": "FINANCIAL REPORTING STATEMENTS AND ANALYSIS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EACC506-4",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 155,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3502:MCA",
//         "courseCode": "ECAP010",
//         "courseName": "PROGRAMMING IN C",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP010-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 286,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3502:MCA",
//         "courseCode": "ECAP011",
//         "courseName": "DATABASE MANAGEMENT SYSTEM",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP011-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 286,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3494:MA(English)",
//         "courseCode": "ECAP145",
//         "courseName": "FUNDAMENTALS OF INFORMATION TECHNOLOGY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP145-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3494:MA(English)",
//         "courseCode": "ECAP145",
//         "courseName": "FUNDAMENTALS OF INFORMATION TECHNOLOGY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP145-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 313,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3495:MA(History)",
//         "courseCode": "ECAP145",
//         "courseName": "FUNDAMENTALS OF INFORMATION TECHNOLOGY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP145-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3495:MA(History)",
//         "courseCode": "ECAP145",
//         "courseName": "FUNDAMENTALS OF INFORMATION TECHNOLOGY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP145-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 313,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3497:MA(Political Science)",
//         "courseCode": "ECAP145",
//         "courseName": "FUNDAMENTALS OF INFORMATION TECHNOLOGY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP145-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3497:MA(Political Science)",
//         "courseCode": "ECAP145",
//         "courseName": "FUNDAMENTALS OF INFORMATION TECHNOLOGY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP145-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 313,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3498:MA(Sociology)",
//         "courseCode": "ECAP145",
//         "courseName": "FUNDAMENTALS OF INFORMATION TECHNOLOGY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP145-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3498:MA(Sociology)",
//         "courseCode": "ECAP145",
//         "courseName": "FUNDAMENTALS OF INFORMATION TECHNOLOGY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP145-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 313,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3500:M.Com ",
//         "courseCode": "ECAP145",
//         "courseName": "FUNDAMENTALS OF INFORMATION TECHNOLOGY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP145-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3500:M.Com ",
//         "courseCode": "ECAP145",
//         "courseName": "FUNDAMENTALS OF INFORMATION TECHNOLOGY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP145-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 313,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3739:M.Sc.(Economics)  ",
//         "courseCode": "ECAP145",
//         "courseName": "FUNDAMENTALS OF INFORMATION TECHNOLOGY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP145-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3739:M.Sc.(Economics)  ",
//         "courseCode": "ECAP145",
//         "courseName": "FUNDAMENTALS OF INFORMATION TECHNOLOGY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP145-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 313,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3496:M.Sc.(Mathematics)",
//         "courseCode": "ECAP145",
//         "courseName": "FUNDAMENTALS OF INFORMATION TECHNOLOGY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP145-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3496:M.Sc.(Mathematics)",
//         "courseCode": "ECAP145",
//         "courseName": "FUNDAMENTALS OF INFORMATION TECHNOLOGY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP145-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 313,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3501:BCA",
//         "courseCode": "ECAP170",
//         "courseName": "FUNDAMENTALS OF INFORMATION TECHNOLOGY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP170-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 344,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3783:DCA",
//         "courseCode": "ECAP170",
//         "courseName": "FUNDAMENTALS OF INFORMATION TECHNOLOGY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP170-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 344,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3492:BA",
//         "courseCode": "ECAP172",
//         "courseName": "PROGRAMMING METHODOLOGY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP172-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 396,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3501:BCA",
//         "courseCode": "ECAP172",
//         "courseName": "PROGRAMMING METHODOLOGY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP172-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 396,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3783:DCA",
//         "courseCode": "ECAP172",
//         "courseName": "PROGRAMMING METHODOLOGY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP172-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 396,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3505:BBA",
//         "courseCode": "ECAP279",
//         "courseName": "OFFICE AUTOMATION TOOLS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP279-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 144,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3782:DBA",
//         "courseCode": "ECAP279",
//         "courseName": "OFFICE AUTOMATION TOOLS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP279-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 144,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3502:MCA",
//         "courseCode": "ECAP437",
//         "courseName": "SOFTWARE ENGINEERING PRACTICES",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP437-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3502:MCA",
//         "courseCode": "ECAP437",
//         "courseName": "SOFTWARE ENGINEERING PRACTICES",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP437-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 227,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3502:MCA",
//         "courseCode": "ECAP444",
//         "courseName": "OBJECT ORIENTED PROGRAMMING USING C++",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP444-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3502:MCA",
//         "courseCode": "ECAP444",
//         "courseName": "OBJECT ORIENTED PROGRAMMING USING C++",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP444-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 227,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3502:MCA",
//         "courseCode": "ECAP446",
//         "courseName": "DATA WAREHOUSING AND DATA MINING",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP446-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3502:MCA",
//         "courseCode": "ECAP446",
//         "courseName": "DATA WAREHOUSING AND DATA MINING",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP446-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 227,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3502:MCA",
//         "courseCode": "ECAP448",
//         "courseName": "LINUX AND SHELL SCRIPTING",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP448-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3502:MCA",
//         "courseCode": "ECAP448",
//         "courseName": "LINUX AND SHELL SCRIPTING",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP448-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 227,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3502:MCA",
//         "courseCode": "ECAP453",
//         "courseName": "DATA COMMUNICATION AND NETWORKING",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP453-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3502:MCA",
//         "courseCode": "ECAP453",
//         "courseName": "DATA COMMUNICATION AND NETWORKING",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP453-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 227,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3492:BA",
//         "courseCode": "ECHE110",
//         "courseName": "ENVIRONMENTAL SCIENCES",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECHE110-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3492:BA",
//         "courseCode": "ECHE110",
//         "courseName": "ENVIRONMENTAL SCIENCES",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECHE110-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 401,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3501:BCA",
//         "courseCode": "ECHE110",
//         "courseName": "ENVIRONMENTAL SCIENCES",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECHE110-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3501:BCA",
//         "courseCode": "ECHE110",
//         "courseName": "ENVIRONMENTAL SCIENCES",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECHE110-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 401,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3783:DCA",
//         "courseCode": "ECHE110",
//         "courseName": "ENVIRONMENTAL SCIENCES",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECHE110-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3783:DCA",
//         "courseCode": "ECHE110",
//         "courseName": "ENVIRONMENTAL SCIENCES",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECHE110-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 401,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3492:BA",
//         "courseCode": "EECO104",
//         "courseName": "PRINCIPLES OF MICROECONOMICS-I",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EECO104-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 64,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3505:BBA",
//         "courseCode": "EECO113",
//         "courseName": "BUSINESS ECONOMICS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EECO113-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 144,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3782:DBA",
//         "courseCode": "EECO113",
//         "courseName": "BUSINESS ECONOMICS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EECO113-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 144,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3504:MBA ",
//         "courseCode": "EECO515",
//         "courseName": "MANAGERIAL ECONOMICS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EECO515-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3504:MBA ",
//         "courseCode": "EECO515",
//         "courseName": "MANAGERIAL ECONOMICS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EECO515-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3504:MBA ",
//         "courseCode": "EECO515",
//         "courseName": "MANAGERIAL ECONOMICS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EECO515-3",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3504:MBA ",
//         "courseCode": "EECO515",
//         "courseName": "MANAGERIAL ECONOMICS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EECO515-4",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 155,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3500:M.Com ",
//         "courseCode": "EECO515",
//         "courseName": "MANAGERIAL ECONOMICS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EECO515-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3500:M.Com ",
//         "courseCode": "EECO515",
//         "courseName": "MANAGERIAL ECONOMICS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EECO515-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3500:M.Com ",
//         "courseCode": "EECO515",
//         "courseName": "MANAGERIAL ECONOMICS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EECO515-3",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3500:M.Com ",
//         "courseCode": "EECO515",
//         "courseName": "MANAGERIAL ECONOMICS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EECO515-4",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 155,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3739:M.Sc.(Economics)  ",
//         "courseCode": "EECO525",
//         "courseName": "MICROECONOMICS THEORY AND ANALYSIS - I",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EECO525-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 54,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3739:M.Sc.(Economics)  ",
//         "courseCode": "EECO526",
//         "courseName": "MACROECONOMICS THEORY AND ANALYSIS - I",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EECO526-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 54,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3739:M.Sc.(Economics)  ",
//         "courseCode": "EECO604",
//         "courseName": "INDIAN ECONOMIC DEVELOPMENT",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EECO604-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 54,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3492:BA",
//         "courseCode": "EENG112",
//         "courseName": "INDIAN WRITING IN ENGLISH",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EENG112-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 186,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3492:BA",
//         "courseCode": "EENG139",
//         "courseName": "ENGLISH COMMUNICATION SKILLS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EENG139-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3492:BA",
//         "courseCode": "EENG139",
//         "courseName": "ENGLISH COMMUNICATION SKILLS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EENG139-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3492:BA",
//         "courseCode": "EENG139",
//         "courseName": "ENGLISH COMMUNICATION SKILLS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EENG139-3",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 195,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3505:BBA",
//         "courseCode": "EENG139",
//         "courseName": "ENGLISH COMMUNICATION SKILLS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EENG139-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3505:BBA",
//         "courseCode": "EENG139",
//         "courseName": "ENGLISH COMMUNICATION SKILLS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EENG139-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3505:BBA",
//         "courseCode": "EENG139",
//         "courseName": "ENGLISH COMMUNICATION SKILLS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EENG139-3",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 195,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3501:BCA",
//         "courseCode": "EENG139",
//         "courseName": "ENGLISH COMMUNICATION SKILLS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EENG139-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3501:BCA",
//         "courseCode": "EENG139",
//         "courseName": "ENGLISH COMMUNICATION SKILLS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EENG139-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3501:BCA",
//         "courseCode": "EENG139",
//         "courseName": "ENGLISH COMMUNICATION SKILLS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EENG139-3",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 195,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3782:DBA",
//         "courseCode": "EENG139",
//         "courseName": "ENGLISH COMMUNICATION SKILLS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EENG139-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3782:DBA",
//         "courseCode": "EENG139",
//         "courseName": "ENGLISH COMMUNICATION SKILLS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EENG139-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3782:DBA",
//         "courseCode": "EENG139",
//         "courseName": "ENGLISH COMMUNICATION SKILLS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EENG139-3",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 195,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3783:DCA",
//         "courseCode": "EENG139",
//         "courseName": "ENGLISH COMMUNICATION SKILLS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EENG139-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3783:DCA",
//         "courseCode": "EENG139",
//         "courseName": "ENGLISH COMMUNICATION SKILLS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EENG139-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3783:DCA",
//         "courseCode": "EENG139",
//         "courseName": "ENGLISH COMMUNICATION SKILLS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EENG139-3",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 195,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3494:MA(English)",
//         "courseCode": "EENG512",
//         "courseName": "BRITISH DRAMA",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EENG512-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 125,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3494:MA(English)",
//         "courseCode": "EENG513",
//         "courseName": "BRITISH POETRY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EENG513-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 125,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3494:MA(English)",
//         "courseCode": "EENG539",
//         "courseName": "ACADEMIC ENGLISH",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EENG539-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 125,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3494:MA(English)",
//         "courseCode": "EGEN530",
//         "courseName": "FUNDAMENTALS OF RESEARCH",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EGEN530-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3494:MA(English)",
//         "courseCode": "EGEN530",
//         "courseName": "FUNDAMENTALS OF RESEARCH",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EGEN530-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 313,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3495:MA(History)",
//         "courseCode": "EGEN530",
//         "courseName": "FUNDAMENTALS OF RESEARCH",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EGEN530-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3495:MA(History)",
//         "courseCode": "EGEN530",
//         "courseName": "FUNDAMENTALS OF RESEARCH",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EGEN530-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 313,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3497:MA(Political Science)",
//         "courseCode": "EGEN530",
//         "courseName": "FUNDAMENTALS OF RESEARCH",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EGEN530-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3497:MA(Political Science)",
//         "courseCode": "EGEN530",
//         "courseName": "FUNDAMENTALS OF RESEARCH",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EGEN530-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 313,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3498:MA(Sociology)",
//         "courseCode": "EGEN530",
//         "courseName": "FUNDAMENTALS OF RESEARCH",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EGEN530-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3498:MA(Sociology)",
//         "courseCode": "EGEN530",
//         "courseName": "FUNDAMENTALS OF RESEARCH",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EGEN530-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 313,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3500:M.Com ",
//         "courseCode": "EGEN530",
//         "courseName": "FUNDAMENTALS OF RESEARCH",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EGEN530-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3500:M.Com ",
//         "courseCode": "EGEN530",
//         "courseName": "FUNDAMENTALS OF RESEARCH",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EGEN530-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 313,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3739:M.Sc.(Economics)  ",
//         "courseCode": "EGEN530",
//         "courseName": "FUNDAMENTALS OF RESEARCH",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EGEN530-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3739:M.Sc.(Economics)  ",
//         "courseCode": "EGEN530",
//         "courseName": "FUNDAMENTALS OF RESEARCH",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EGEN530-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 313,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3496:M.Sc.(Mathematics)",
//         "courseCode": "EGEN530",
//         "courseName": "FUNDAMENTALS OF RESEARCH",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EGEN530-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3496:M.Sc.(Mathematics)",
//         "courseCode": "EGEN530",
//         "courseName": "FUNDAMENTALS OF RESEARCH",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EGEN530-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 313,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3492:BA",
//         "courseCode": "EHIN111",
//         "courseName": "HINDI SAHITYA KA ITHAAS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EHIN111-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 35,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3492:BA",
//         "courseCode": "EHIS110",
//         "courseName": "HISTORY OF INDIA FROM THE EARLIEST TIME UPTO 300 CE",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EHIS110-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 117,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3495:MA(History)",
//         "courseCode": "EHIS507",
//         "courseName": "HISTORY OF INDIA FROM 1757AD TO 1857",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EHIS507-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 42,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3495:MA(History)",
//         "courseCode": "EHIS533",
//         "courseName": "POLITY AND ECONOMY OF INDIA FROM 1200AD TO 1750 AD",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EHIS533-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 42,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3495:MA(History)",
//         "courseCode": "EHIS551",
//         "courseName": "HISTORY OF INDIA UPTO AD 650",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EHIS551-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 42,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3505:BBA",
//         "courseCode": "EMGN101",
//         "courseName": "BUSINESS ORGANISATION AND MANAGEMENT",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMGN101-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 144,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3782:DBA",
//         "courseCode": "EMGN101",
//         "courseName": "BUSINESS ORGANISATION AND MANAGEMENT",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMGN101-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 144,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3505:BBA",
//         "courseCode": "EMGN303",
//         "courseName": "BUSINESS ENVIRONMENT",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMGN303-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 144,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3782:DBA",
//         "courseCode": "EMGN303",
//         "courseName": "BUSINESS ENVIRONMENT",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMGN303-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 144,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3504:MBA ",
//         "courseCode": "EMGN578",
//         "courseName": "INTERNATIONAL BUSINESS ENVIRONMENT",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMGN578-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3504:MBA ",
//         "courseCode": "EMGN578",
//         "courseName": "INTERNATIONAL BUSINESS ENVIRONMENT",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMGN578-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3504:MBA ",
//         "courseCode": "EMGN578",
//         "courseName": "INTERNATIONAL BUSINESS ENVIRONMENT",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMGN578-3",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3504:MBA ",
//         "courseCode": "EMGN578",
//         "courseName": "INTERNATIONAL BUSINESS ENVIRONMENT",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMGN578-4",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 117,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3504:MBA ",
//         "courseCode": "EMGN581",
//         "courseName": "ORGANISATIONAL BEHAVIOUR AND HUMAN RESOURCE DYNAMICS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMGN581-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3504:MBA ",
//         "courseCode": "EMGN581",
//         "courseName": "ORGANISATIONAL BEHAVIOUR AND HUMAN RESOURCE DYNAMICS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMGN581-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3504:MBA ",
//         "courseCode": "EMGN581",
//         "courseName": "ORGANISATIONAL BEHAVIOUR AND HUMAN RESOURCE DYNAMICS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMGN581-3",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3504:MBA ",
//         "courseCode": "EMGN581",
//         "courseName": "ORGANISATIONAL BEHAVIOUR AND HUMAN RESOURCE DYNAMICS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMGN581-4",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 155,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3500:M.Com ",
//         "courseCode": "EMGN581",
//         "courseName": "ORGANISATIONAL BEHAVIOUR AND HUMAN RESOURCE DYNAMICS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMGN581-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3500:M.Com ",
//         "courseCode": "EMGN581",
//         "courseName": "ORGANISATIONAL BEHAVIOUR AND HUMAN RESOURCE DYNAMICS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMGN581-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3500:M.Com ",
//         "courseCode": "EMGN581",
//         "courseName": "ORGANISATIONAL BEHAVIOUR AND HUMAN RESOURCE DYNAMICS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMGN581-3",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3500:M.Com ",
//         "courseCode": "EMGN581",
//         "courseName": "ORGANISATIONAL BEHAVIOUR AND HUMAN RESOURCE DYNAMICS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMGN581-4",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 155,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3504:MBA ",
//         "courseCode": "EMKT503",
//         "courseName": "MARKETING MANAGEMENT",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMKT503-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3504:MBA ",
//         "courseCode": "EMKT503",
//         "courseName": "MARKETING MANAGEMENT",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMKT503-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3504:MBA ",
//         "courseCode": "EMKT503",
//         "courseName": "MARKETING MANAGEMENT",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMKT503-3",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3504:MBA ",
//         "courseCode": "EMKT503",
//         "courseName": "MARKETING MANAGEMENT",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMKT503-4",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 117,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3501:BCA",
//         "courseCode": "EMTH136",
//         "courseName": "DISCRETE STRUCTURES",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMTH136-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 344,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3783:DCA",
//         "courseCode": "EMTH136",
//         "courseName": "DISCRETE STRUCTURES",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMTH136-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 344,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3492:BA",
//         "courseCode": "EMTH137",
//         "courseName": "CALCULUS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMTH137-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 15,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3496:M.Sc.(Mathematics)",
//         "courseCode": "EMTH515",
//         "courseName": "REAL ANALYSIS-I",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMTH515-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 310,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3496:M.Sc.(Mathematics)",
//         "courseCode": "EMTH516",
//         "courseName": "ADVANCED ABSTRACT ALGEBRA-I",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMTH516-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 310,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3496:M.Sc.(Mathematics)",
//         "courseCode": "EMTH517",
//         "courseName": "THEORY OF DIFFERENTIAL EQUATIONS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMTH517-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 310,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3502:MCA",
//         "courseCode": "EPEA515",
//         "courseName": "ANALYTICAL SKILLS-I",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EPEA515-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3502:MCA",
//         "courseCode": "EPEA515",
//         "courseName": "ANALYTICAL SKILLS-I",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EPEA515-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 227,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3492:BA",
//         "courseCode": "EPOL110",
//         "courseName": "INTRODUCTION TO POLITICAL THEORY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EPOL110-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 153,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3497:MA(Political Science)",
//         "courseCode": "EPOL524",
//         "courseName": "POLITICAL THEORY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EPOL524-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 49,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3497:MA(Political Science)",
//         "courseCode": "EPOL525",
//         "courseName": "POLITICAL INSTITUTIONS IN INDIA",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EPOL525-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 49,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3497:MA(Political Science)",
//         "courseCode": "EPOL552",
//         "courseName": "INTERNATIONAL RELATIONS-THEORY AND PRACTICE",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EPOL552-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 49,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3492:BA",
//         "courseCode": "ESOC111",
//         "courseName": "INTRODUCTION TO SOCIOLOGY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ESOC111-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 137,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3498:MA(Sociology)",
//         "courseCode": "ESOC505",
//         "courseName": "CLASSICAL SOCIOLOGICAL TRADITION",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ESOC505-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 45,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3498:MA(Sociology)",
//         "courseCode": "ESOC515",
//         "courseName": "FUNDAMENTALS OF SOCIOLOGY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ESOC515-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 45,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3498:MA(Sociology)",
//         "courseCode": "ESOC516",
//         "courseName": "SCIENCE, TECHNOLOGY AND SOCIETY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ESOC516-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 45,
//         "errorMessage": null
//     }
// ]










// const top100Films = [
//     { title: 'The Shawshank Redemption', year: 1994 },
//     { title: 'The Godfather', year: 1972 },
//     { title: 'The Godfather: Part II', year: 1974 },
//     { title: 'The Dark Knight', year: 2008 },
//     { title: '12 Angry Men', year: 1957 },
//     { title: "Schindler's List", year: 1993 },
//     { title: 'Pulp Fiction', year: 1994 },
//     {
//         title: 'The Lord of the Rings: The Return of the King',
//         year: 2003,
//     },
//     { title: 'The Good, the Bad and the Ugly', year: 1966 },
//     { title: 'Fight Club', year: 1999 },
//     {
//         title: 'The Lord of the Rings: The Fellowship of the Ring',
//         year: 2001,
//     },
//     {
//         title: 'Star Wars: Episode V - The Empire Strikes Back',
//         year: 1980,
//     },
//     { title: 'Forrest Gump', year: 1994 },
//     { title: 'Inception', year: 2010 },
//     {
//         title: 'The Lord of the Rings: The Two Towers',
//         year: 2002,
//     },
//     { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
//     { title: 'Goodfellas', year: 1990 },
//     { title: 'The Matrix', year: 1999 },
//     { title: 'Seven Samurai', year: 1954 },
//     {
//         title: 'Star Wars: Episode IV - A New Hope',
//         year: 1977,
//     },
//     { title: 'City of God', year: 2002 },
//     { title: 'Se7en', year: 1995 },
//     { title: 'The Silence of the Lambs', year: 1991 },
//     { title: "It's a Wonderful Life", year: 1946 },
//     { title: 'Life Is Beautiful', year: 1997 },
//     { title: 'The Usual Suspects', year: 1995 },
//     { title: 'Léon: The Professional', year: 1994 },
//     { title: 'Spirited Away', year: 2001 },
//     { title: 'Saving Private Ryan', year: 1998 },
//     { title: 'Once Upon a Time in the West', year: 1968 },
//     { title: 'American History X', year: 1998 },
//     { title: 'Interstellar', year: 2014 },
// ];



// const TimeTableGrouping = () => {


//     const basics: TableType[] = basicsTableData;

// const [threshold, setThreshold] = useState("");
// const [overLimit, setOverLimit] = useState("");

// // const handleNumericInput = (value: any, setter: any) => {
// //     const regex = /^[0-9]{0,4}$/; // Only digits, up to 4 characters
// //     if (regex.test(value)) {
// //         setter(value);
// //     }
// // };


// const handleNumericInput = (value: string, setter: (val: string) => void) => {
//     const regex = /^[0-9]{0,4}$/; // Only digits, max 4 characters
//     if (regex.test(value)) {
//         setter(value); // Save the valid value
//         console.log("Valid Threshold:", value);
//     }
// };


//     const [startDate, setStartDate] = useState("");
//     const [endDate, setEndDate] = useState("");
//     const [selectedTitles, setSelectedTitles] = useState("");
//     // const [threshold, setThreshold] = useState("");
//     // const [overLimit, setOverLimit] = useState("");

//     const startDateChange = (event: any) => {
//         setStartDate(event.target.value);
//         console.log("start Date:", event.target.value); // Optional: For debugging
//     };


//     const endDateChange = (event: any) => {
//         setEndDate(event.target.value);
//         console.log("end Date:", event.target.value); // Optional: For debugging
//     };


//     const termIDChange = (event: any, value: any) => {
//         const titles = value.map((item: any) => item.title).join(", ");
//         setSelectedTitles(titles);
//         console.log("term id:", titles); // Optional: for debugging
//     };


//     const thresholdChange = (event: any) => {
//         setThreshold(event.target.value);
//         console.log("thresholdChange:", event.target.value); // Optional: For debugging
//     };


//     const overLimitChange = (event: any) => {
//         setOverLimit(event.target.value);
//         console.log("overLimitChange:", event.target.value); // Optional: For debugging
//     };




//     return (
//         <>

//             <Box sx={{ marginBottom: "20px" }}>

//                 <ChildCard >

//                     <Box
//                         sx={{
//                             position: 'relative',
//                             display: { lg: "flex", xs: "block" },
//                             justifyContent: { lg: "space-between" }
//                         }}
//                     >
//                         {/* Start Date */}
//                         <Box
//                             sx={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: { lg: "center" },
//                                 gap: 1,
//                                 marginBottom: { xs: "10px" }
//                             }}
//                         >
//                             <Typography
//                                 variant="h6"
//                                 sx={{
//                                     fontSize: "14px",
//                                     whiteSpace: "nowrap"
//                                 }}
//                             >
//                                 Start Date:
//                             </Typography>
//                             {/* <TextField
//                                 variant="outlined"
//                                 size="small"
//                                 type="date"
//                                 sx={{
//                                     width: "150px",
//                                     "& .MuiInputBase-root": {
//                                         fontSize: "13px",
//                                         height: "35px"
//                                     }
//                                 }}
//                                 InputLabelProps={{ shrink: true }}
//                             /> */}


//                             <TextField
//                                 variant="outlined"
//                                 size="small"
//                                 type="date"
//                                 // value={startDate}
//                                 onChange={startDateChange}
//                                 sx={{
//                                     width: "150px",
//                                     "& .MuiInputBase-root": {
//                                         fontSize: "13px",
//                                         height: "35px"
//                                     }
//                                 }}
//                                 InputLabelProps={{ shrink: true }}
//                             />


//                         </Box>

//                         {/* End Date */}
//                         <Box
//                             sx={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: { lg: "center" },
//                                 gap: 1,
//                                 marginBottom: { xs: "10px" }
//                             }}
//                         >
//                             <Typography
//                                 variant="h6"
//                                 sx={{
//                                     fontSize: "14px",
//                                     whiteSpace: "nowrap"
//                                 }}
//                             >
//                                 End Date:
//                             </Typography>
//                             <TextField
//                                 variant="outlined"
//                                 size="small"
//                                 type="date"
//                                 // value={endDate}
//                                 onChange={endDateChange}
//                                 sx={{
//                                     width: "150px",
//                                     "& .MuiInputBase-root": {
//                                         fontSize: "13px",
//                                         height: "35px"
//                                     }
//                                 }}
//                                 InputLabelProps={{ shrink: true }}
//                             />
//                         </Box>

//                         {/* Download Button */}
//                         <Box
//                             sx={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                                 gap: 1,
//                                 margin: "0px",
//                                 position: { xs: "absolute", lg: "static" },
//                                 top: { xs: "-30px" },
//                                 right: { xs: "-30px" },
//                                 padding: { xs: "8px" }
//                             }}
//                         >
//                             <Button variant="outlined">
//                                 <Icon icon="line-md:download-loop" width="25" height="25" />
//                             </Button>
//                         </Box>
//                     </Box>







//                     <Box sx={{ display: { xs: "flex" }, justifyContent: { lg: "space-between" }, alignItems: { xs: "center" }, marginTop: "0px" }}>

//                         <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginLeft: "0px" }}>


//                             <Typography
//                                 variant="h6"
//                                 sx={{
//                                     fontSize: "14px",
//                                     whiteSpace: "nowrap",
//                                     display: { xs: "flex" },
//                                     // justifyContent: { xs: "center" },
//                                 }}
//                             >
//                                 Term ID:
//                             </Typography>

//                             {/* <Autocomplete
//                                 multiple
//                                 // fullWidth
//                                 sx={{ width: { lg: 930, xs: 245 } }}
//                                 size="small"
//                                 id="tags-outlined"
//                                 options={top100Films}
//                                 getOptionLabel={(option) => option.title}
//                                 defaultValue={[top100Films[13]]}
//                                 filterSelectedOptions
//                                 renderInput={(params) => (
//                                     <CustomTextField {...params} placeholder="Favorites" aria-label="Favorites" />
//                                 )}
//                             /> */}


//                             <Autocomplete
//                                 multiple
//                                 sx={{ width: { lg: 930, xs: 245 } }}
//                                 size="small"
//                                 id="tags-outlined"
//                                 options={top100Films}
//                                 getOptionLabel={(option) => option.title}
//                                 // defaultValue={[top100Films[0]]}
//                                 filterSelectedOptions
//                                 onChange={termIDChange}
//                                 renderInput={(params) => (
//                                     <TextField
//                                         {...params}
//                                         placeholder="Select"
//                                         aria-label="Favorites"
//                                     />
//                                 )}
//                             />


//                         </Box>


//                     </Box>




//                     <Box sx={{ marginTop: "10px", display: { lg: "flex" }, justifyContent: { lg: "space-between" }, flexWrap: "wrap", gap: 2 }}>
//                         <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginBottom: { xs: "10px" } }}>
//                             <Typography
//                                 variant="h6"
//                                 sx={{
//                                     fontSize: "14px",
//                                     whiteSpace: "nowrap",
//                                     display: { xs: "flex" },
//                                     justifyContent: { xs: "center" },
//                                 }}
//                             >
//                                 Threshold:
//                             </Typography>
//                             {/* <CustomTextField
//                                 value={threshold}
//                                 onChange={(e: { target: { value: number; }; }) => handleNumericInput(e.target.value, setThreshold)}
//                                 sx={{ width: 150 }}
//                                 size="small"
//                                 required
//                                 inputProps={{ maxLength: 4, inputMode: "numeric", pattern: "[0-9]*" }}
//                                 placeholder="Threshold"
//                             /> */}

//                             <TextField
//                                 value={threshold}
//                                 onChange={(e) => handleNumericInput(e.target.value, setThreshold)}
//                                 sx={{ width: 150 }}
//                                 size="small"
//                                 required
//                                 inputProps={{
//                                     maxLength: 4,
//                                     inputMode: "numeric",
//                                     pattern: "[0-9]*",
//                                 }}
//                                 placeholder="Threshold"
//                             />


//                         </Box>

//                         <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                             <Typography
//                                 variant="h6"
//                                 sx={{
//                                     fontSize: "14px",
//                                     whiteSpace: "nowrap",
//                                     display: { xs: "flex" },
//                                     justifyContent: { xs: "center" },
//                                 }}
//                             >
//                                 OverLimit:
//                             </Typography>
//                             {/* <CustomTextField
//                                 value={overLimit}
//                                 // onChange={(e: { target: { value: number; }; }) => handleNumericInput(e.target.value, setOverLimit)}
//                                 sx={{ width: 150 }}
//                                 size="small"
//                                 required
//                                 inputProps={{ maxLength: 4, inputMode: "numeric", pattern: "[0-9]*" }}
//                                 placeholder="OverLimit"
//                             /> */}


//                             <TextField
//                                 value={overLimit}
//                                 onChange={(e) => handleNumericInput(e.target.value, setOverLimit)}
//                                 sx={{ width: 150 }}
//                                 size="small"
//                                 required
//                                 inputProps={{
//                                     maxLength: 4,
//                                     inputMode: "numeric",
//                                     pattern: "[0-9]*",
//                                 }}
//                                 placeholder="OverLimit"
//                             />


//                         </Box>

//                         <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, marginTop: "10px" }}>
//                             <Button variant="contained">Fetch</Button>
//                         </Box>
//                     </Box>


//                 </ChildCard>
//             </Box>










//             <BlankCard>
//                 <TableContainer>
//                     <Table
//                         aria-label="simple table"
//                         sx={{
//                             whiteSpace: "nowrap",
//                             width: "100%",
//                         }}
//                     >
//                         <TableHead>
//                             <TableRow>
//                                 <TableCell sx={{ fontWeight: "bold" }}>
//                                     <Typography variant="h6">Course Code</Typography>
//                                 </TableCell>
//                                 <TableCell sx={{ fontWeight: "bold" }}>
//                                     <Typography variant="h6">Course Name</Typography>
//                                 </TableCell>
//                                 <TableCell sx={{ fontWeight: "bold" }}>
//                                     <Typography variant="h6">Start date</Typography>
//                                 </TableCell>
//                                 <TableCell sx={{ fontWeight: "bold" }}>
//                                     <Typography variant="h6">End Date</Typography>
//                                 </TableCell>
//                                 <TableCell sx={{ fontWeight: "bold" }}>
//                                     <Typography variant="h6">Grp</Typography>
//                                 </TableCell>
//                                 <TableCell sx={{ fontWeight: "bold" }}>
//                                     <Typography variant="h6">Lectures</Typography>
//                                 </TableCell>
//                                 <TableCell sx={{ fontWeight: "bold" }}>
//                                     <Typography variant="h6">Tutorial</Typography>
//                                 </TableCell>
//                                 <TableCell sx={{ fontWeight: "bold" }}>
//                                     <Typography variant="h6">Practical</Typography>
//                                 </TableCell>
//                                 <TableCell sx={{ fontWeight: "bold" }}>
//                                     <Typography variant="h6">RefactoredCnt</Typography>
//                                 </TableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
// {tableData.map((basic, index) => (
//     <TableRow key={index}>
//         {/* Hostel Column */}
//         <TableCell sx={{ padding: "10px" }}>
//             <Typography variant="h6" fontSize={"14px"} fontWeight={400}>{basic.courseCode}</Typography>
//         </TableCell>

//         <TableCell sx={{ padding: "10px", maxWidth: 500 }}>
//             <Typography variant="h6" fontSize={"14px"} fontWeight={400} sx={{ whiteSpace: "normal" }}>
//                 {basic.courseName}
//             </Typography>
//         </TableCell>


//         <TableCell sx={{ padding: "10px" }}>
//             <Typography variant="h6" fontSize={"14px"} fontWeight={400}>
//                 {basic.startDate.split(' ')[0]}
//             </Typography>
//         </TableCell>


//         {/* Mobile Number Column */}
//         <TableCell sx={{ padding: "10px" }}>
//             <Typography variant="h6" fontSize={"14px"} fontWeight={400}>{basic.endDate.split(' ')[0]}</Typography>
//         </TableCell>



//         <TableCell sx={{ padding: "10px" }}>
//             <Typography variant="h6" fontSize={"14px"} fontWeight={400}>{basic.grp}</Typography>
//         </TableCell>

//         <TableCell sx={{ padding: "10px" }}>
//             <Typography variant="h6" fontSize={"14px"} fontWeight={400}>{basic.lectures}</Typography>
//         </TableCell>

//         <TableCell sx={{ padding: "10px" }}>
//             <Typography variant="h6" fontSize={"14px"} fontWeight={400}>{basic.tutorial}</Typography>
//         </TableCell>

//         <TableCell sx={{ padding: "10px" }}>
//             <Typography variant="h6" fontSize={"14px"} fontWeight={400}>{basic.practical}</Typography>
//         </TableCell>

//         <TableCell sx={{ padding: "10px" }}>
//             <Typography variant="h6" fontSize={"14px"} fontWeight={400}>{basic.refactoredCnt}</Typography>
//         </TableCell>


//     </TableRow>
// ))}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//             </BlankCard>








//         </>
//     )
// }

// export default TimeTableGrouping

























// "use client";
// import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField'
// import BlankCard from '@/app/components/shared/BlankCard';
// import { Autocomplete, Box, Button, CircularProgress, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
// import React, { useState } from 'react'
// import { basicsTableData, TableType } from '../../ProfilePageViews/EmergencyNumber/tableData';
// import ChildCard from '@/app/components/shared/ChildCard';
// import { Icon } from '@iconify/react';







// const tableData = [
//     {
//         "prgInfo": "3492:BA",
//         "courseCode": "EACC105",
//         "courseName": "FINANCIAL ACCOUNTING",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EACC105-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 13,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3504:MBA ",
//         "courseCode": "EACC506",
//         "courseName": "FINANCIAL REPORTING STATEMENTS AND ANALYSIS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EACC506-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3504:MBA ",
//         "courseCode": "EACC506",
//         "courseName": "FINANCIAL REPORTING STATEMENTS AND ANALYSIS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EACC506-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3504:MBA ",
//         "courseCode": "EACC506",
//         "courseName": "FINANCIAL REPORTING STATEMENTS AND ANALYSIS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EACC506-3",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3504:MBA ",
//         "courseCode": "EACC506",
//         "courseName": "FINANCIAL REPORTING STATEMENTS AND ANALYSIS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EACC506-4",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 155,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3500:M.Com ",
//         "courseCode": "EACC506",
//         "courseName": "FINANCIAL REPORTING STATEMENTS AND ANALYSIS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EACC506-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3500:M.Com ",
//         "courseCode": "EACC506",
//         "courseName": "FINANCIAL REPORTING STATEMENTS AND ANALYSIS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EACC506-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3500:M.Com ",
//         "courseCode": "EACC506",
//         "courseName": "FINANCIAL REPORTING STATEMENTS AND ANALYSIS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EACC506-3",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3500:M.Com ",
//         "courseCode": "EACC506",
//         "courseName": "FINANCIAL REPORTING STATEMENTS AND ANALYSIS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EACC506-4",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 155,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3502:MCA",
//         "courseCode": "ECAP010",
//         "courseName": "PROGRAMMING IN C",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP010-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 286,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3502:MCA",
//         "courseCode": "ECAP011",
//         "courseName": "DATABASE MANAGEMENT SYSTEM",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP011-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 286,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3494:MA(English)",
//         "courseCode": "ECAP145",
//         "courseName": "FUNDAMENTALS OF INFORMATION TECHNOLOGY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP145-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3494:MA(English)",
//         "courseCode": "ECAP145",
//         "courseName": "FUNDAMENTALS OF INFORMATION TECHNOLOGY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP145-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 313,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3495:MA(History)",
//         "courseCode": "ECAP145",
//         "courseName": "FUNDAMENTALS OF INFORMATION TECHNOLOGY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP145-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3495:MA(History)",
//         "courseCode": "ECAP145",
//         "courseName": "FUNDAMENTALS OF INFORMATION TECHNOLOGY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP145-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 313,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3497:MA(Political Science)",
//         "courseCode": "ECAP145",
//         "courseName": "FUNDAMENTALS OF INFORMATION TECHNOLOGY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP145-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3497:MA(Political Science)",
//         "courseCode": "ECAP145",
//         "courseName": "FUNDAMENTALS OF INFORMATION TECHNOLOGY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP145-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 313,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3498:MA(Sociology)",
//         "courseCode": "ECAP145",
//         "courseName": "FUNDAMENTALS OF INFORMATION TECHNOLOGY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP145-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3498:MA(Sociology)",
//         "courseCode": "ECAP145",
//         "courseName": "FUNDAMENTALS OF INFORMATION TECHNOLOGY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP145-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 313,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3500:M.Com ",
//         "courseCode": "ECAP145",
//         "courseName": "FUNDAMENTALS OF INFORMATION TECHNOLOGY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP145-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3500:M.Com ",
//         "courseCode": "ECAP145",
//         "courseName": "FUNDAMENTALS OF INFORMATION TECHNOLOGY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP145-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 313,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3739:M.Sc.(Economics)  ",
//         "courseCode": "ECAP145",
//         "courseName": "FUNDAMENTALS OF INFORMATION TECHNOLOGY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP145-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3739:M.Sc.(Economics)  ",
//         "courseCode": "ECAP145",
//         "courseName": "FUNDAMENTALS OF INFORMATION TECHNOLOGY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP145-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 313,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3496:M.Sc.(Mathematics)",
//         "courseCode": "ECAP145",
//         "courseName": "FUNDAMENTALS OF INFORMATION TECHNOLOGY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP145-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3496:M.Sc.(Mathematics)",
//         "courseCode": "ECAP145",
//         "courseName": "FUNDAMENTALS OF INFORMATION TECHNOLOGY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP145-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 313,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3501:BCA",
//         "courseCode": "ECAP170",
//         "courseName": "FUNDAMENTALS OF INFORMATION TECHNOLOGY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP170-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 344,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3783:DCA",
//         "courseCode": "ECAP170",
//         "courseName": "FUNDAMENTALS OF INFORMATION TECHNOLOGY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP170-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 344,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3492:BA",
//         "courseCode": "ECAP172",
//         "courseName": "PROGRAMMING METHODOLOGY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP172-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 396,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3501:BCA",
//         "courseCode": "ECAP172",
//         "courseName": "PROGRAMMING METHODOLOGY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP172-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 396,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3783:DCA",
//         "courseCode": "ECAP172",
//         "courseName": "PROGRAMMING METHODOLOGY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP172-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 396,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3505:BBA",
//         "courseCode": "ECAP279",
//         "courseName": "OFFICE AUTOMATION TOOLS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP279-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 144,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3782:DBA",
//         "courseCode": "ECAP279",
//         "courseName": "OFFICE AUTOMATION TOOLS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP279-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 144,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3502:MCA",
//         "courseCode": "ECAP437",
//         "courseName": "SOFTWARE ENGINEERING PRACTICES",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP437-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3502:MCA",
//         "courseCode": "ECAP437",
//         "courseName": "SOFTWARE ENGINEERING PRACTICES",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP437-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 227,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3502:MCA",
//         "courseCode": "ECAP444",
//         "courseName": "OBJECT ORIENTED PROGRAMMING USING C++",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP444-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3502:MCA",
//         "courseCode": "ECAP444",
//         "courseName": "OBJECT ORIENTED PROGRAMMING USING C++",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP444-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 227,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3502:MCA",
//         "courseCode": "ECAP446",
//         "courseName": "DATA WAREHOUSING AND DATA MINING",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP446-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3502:MCA",
//         "courseCode": "ECAP446",
//         "courseName": "DATA WAREHOUSING AND DATA MINING",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP446-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 227,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3502:MCA",
//         "courseCode": "ECAP448",
//         "courseName": "LINUX AND SHELL SCRIPTING",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP448-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3502:MCA",
//         "courseCode": "ECAP448",
//         "courseName": "LINUX AND SHELL SCRIPTING",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP448-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 1,
//         "refactoredCnt": 227,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3502:MCA",
//         "courseCode": "ECAP453",
//         "courseName": "DATA COMMUNICATION AND NETWORKING",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP453-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3502:MCA",
//         "courseCode": "ECAP453",
//         "courseName": "DATA COMMUNICATION AND NETWORKING",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECAP453-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 227,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3492:BA",
//         "courseCode": "ECHE110",
//         "courseName": "ENVIRONMENTAL SCIENCES",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECHE110-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3492:BA",
//         "courseCode": "ECHE110",
//         "courseName": "ENVIRONMENTAL SCIENCES",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECHE110-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 401,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3501:BCA",
//         "courseCode": "ECHE110",
//         "courseName": "ENVIRONMENTAL SCIENCES",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECHE110-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3501:BCA",
//         "courseCode": "ECHE110",
//         "courseName": "ENVIRONMENTAL SCIENCES",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECHE110-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 401,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3783:DCA",
//         "courseCode": "ECHE110",
//         "courseName": "ENVIRONMENTAL SCIENCES",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECHE110-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3783:DCA",
//         "courseCode": "ECHE110",
//         "courseName": "ENVIRONMENTAL SCIENCES",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ECHE110-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 401,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3492:BA",
//         "courseCode": "EECO104",
//         "courseName": "PRINCIPLES OF MICROECONOMICS-I",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EECO104-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 64,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3505:BBA",
//         "courseCode": "EECO113",
//         "courseName": "BUSINESS ECONOMICS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EECO113-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 144,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3782:DBA",
//         "courseCode": "EECO113",
//         "courseName": "BUSINESS ECONOMICS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EECO113-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 144,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3504:MBA ",
//         "courseCode": "EECO515",
//         "courseName": "MANAGERIAL ECONOMICS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EECO515-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3504:MBA ",
//         "courseCode": "EECO515",
//         "courseName": "MANAGERIAL ECONOMICS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EECO515-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3504:MBA ",
//         "courseCode": "EECO515",
//         "courseName": "MANAGERIAL ECONOMICS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EECO515-3",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3504:MBA ",
//         "courseCode": "EECO515",
//         "courseName": "MANAGERIAL ECONOMICS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EECO515-4",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 155,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3500:M.Com ",
//         "courseCode": "EECO515",
//         "courseName": "MANAGERIAL ECONOMICS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EECO515-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3500:M.Com ",
//         "courseCode": "EECO515",
//         "courseName": "MANAGERIAL ECONOMICS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EECO515-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3500:M.Com ",
//         "courseCode": "EECO515",
//         "courseName": "MANAGERIAL ECONOMICS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EECO515-3",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3500:M.Com ",
//         "courseCode": "EECO515",
//         "courseName": "MANAGERIAL ECONOMICS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EECO515-4",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 155,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3739:M.Sc.(Economics)  ",
//         "courseCode": "EECO525",
//         "courseName": "MICROECONOMICS THEORY AND ANALYSIS - I",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EECO525-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 54,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3739:M.Sc.(Economics)  ",
//         "courseCode": "EECO526",
//         "courseName": "MACROECONOMICS THEORY AND ANALYSIS - I",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EECO526-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 54,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3739:M.Sc.(Economics)  ",
//         "courseCode": "EECO604",
//         "courseName": "INDIAN ECONOMIC DEVELOPMENT",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EECO604-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 54,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3492:BA",
//         "courseCode": "EENG112",
//         "courseName": "INDIAN WRITING IN ENGLISH",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EENG112-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 186,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3492:BA",
//         "courseCode": "EENG139",
//         "courseName": "ENGLISH COMMUNICATION SKILLS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EENG139-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3492:BA",
//         "courseCode": "EENG139",
//         "courseName": "ENGLISH COMMUNICATION SKILLS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EENG139-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3492:BA",
//         "courseCode": "EENG139",
//         "courseName": "ENGLISH COMMUNICATION SKILLS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EENG139-3",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 195,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3505:BBA",
//         "courseCode": "EENG139",
//         "courseName": "ENGLISH COMMUNICATION SKILLS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EENG139-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3505:BBA",
//         "courseCode": "EENG139",
//         "courseName": "ENGLISH COMMUNICATION SKILLS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EENG139-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3505:BBA",
//         "courseCode": "EENG139",
//         "courseName": "ENGLISH COMMUNICATION SKILLS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EENG139-3",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 195,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3501:BCA",
//         "courseCode": "EENG139",
//         "courseName": "ENGLISH COMMUNICATION SKILLS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EENG139-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3501:BCA",
//         "courseCode": "EENG139",
//         "courseName": "ENGLISH COMMUNICATION SKILLS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EENG139-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3501:BCA",
//         "courseCode": "EENG139",
//         "courseName": "ENGLISH COMMUNICATION SKILLS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EENG139-3",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 195,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3782:DBA",
//         "courseCode": "EENG139",
//         "courseName": "ENGLISH COMMUNICATION SKILLS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EENG139-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3782:DBA",
//         "courseCode": "EENG139",
//         "courseName": "ENGLISH COMMUNICATION SKILLS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EENG139-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3782:DBA",
//         "courseCode": "EENG139",
//         "courseName": "ENGLISH COMMUNICATION SKILLS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EENG139-3",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 195,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3783:DCA",
//         "courseCode": "EENG139",
//         "courseName": "ENGLISH COMMUNICATION SKILLS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EENG139-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3783:DCA",
//         "courseCode": "EENG139",
//         "courseName": "ENGLISH COMMUNICATION SKILLS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EENG139-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3783:DCA",
//         "courseCode": "EENG139",
//         "courseName": "ENGLISH COMMUNICATION SKILLS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EENG139-3",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 195,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3494:MA(English)",
//         "courseCode": "EENG512",
//         "courseName": "BRITISH DRAMA",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EENG512-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 125,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3494:MA(English)",
//         "courseCode": "EENG513",
//         "courseName": "BRITISH POETRY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EENG513-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 125,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3494:MA(English)",
//         "courseCode": "EENG539",
//         "courseName": "ACADEMIC ENGLISH",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EENG539-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 125,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3494:MA(English)",
//         "courseCode": "EGEN530",
//         "courseName": "FUNDAMENTALS OF RESEARCH",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EGEN530-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3494:MA(English)",
//         "courseCode": "EGEN530",
//         "courseName": "FUNDAMENTALS OF RESEARCH",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EGEN530-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 313,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3495:MA(History)",
//         "courseCode": "EGEN530",
//         "courseName": "FUNDAMENTALS OF RESEARCH",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EGEN530-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3495:MA(History)",
//         "courseCode": "EGEN530",
//         "courseName": "FUNDAMENTALS OF RESEARCH",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EGEN530-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 313,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3497:MA(Political Science)",
//         "courseCode": "EGEN530",
//         "courseName": "FUNDAMENTALS OF RESEARCH",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EGEN530-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3497:MA(Political Science)",
//         "courseCode": "EGEN530",
//         "courseName": "FUNDAMENTALS OF RESEARCH",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EGEN530-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 313,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3498:MA(Sociology)",
//         "courseCode": "EGEN530",
//         "courseName": "FUNDAMENTALS OF RESEARCH",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EGEN530-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3498:MA(Sociology)",
//         "courseCode": "EGEN530",
//         "courseName": "FUNDAMENTALS OF RESEARCH",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EGEN530-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 313,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3500:M.Com ",
//         "courseCode": "EGEN530",
//         "courseName": "FUNDAMENTALS OF RESEARCH",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EGEN530-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3500:M.Com ",
//         "courseCode": "EGEN530",
//         "courseName": "FUNDAMENTALS OF RESEARCH",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EGEN530-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 313,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3739:M.Sc.(Economics)  ",
//         "courseCode": "EGEN530",
//         "courseName": "FUNDAMENTALS OF RESEARCH",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EGEN530-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3739:M.Sc.(Economics)  ",
//         "courseCode": "EGEN530",
//         "courseName": "FUNDAMENTALS OF RESEARCH",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EGEN530-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 313,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3496:M.Sc.(Mathematics)",
//         "courseCode": "EGEN530",
//         "courseName": "FUNDAMENTALS OF RESEARCH",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EGEN530-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3496:M.Sc.(Mathematics)",
//         "courseCode": "EGEN530",
//         "courseName": "FUNDAMENTALS OF RESEARCH",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EGEN530-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 313,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3492:BA",
//         "courseCode": "EHIN111",
//         "courseName": "HINDI SAHITYA KA ITHAAS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EHIN111-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 35,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3492:BA",
//         "courseCode": "EHIS110",
//         "courseName": "HISTORY OF INDIA FROM THE EARLIEST TIME UPTO 300 CE",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EHIS110-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 117,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3495:MA(History)",
//         "courseCode": "EHIS507",
//         "courseName": "HISTORY OF INDIA FROM 1757AD TO 1857",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EHIS507-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 42,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3495:MA(History)",
//         "courseCode": "EHIS533",
//         "courseName": "POLITY AND ECONOMY OF INDIA FROM 1200AD TO 1750 AD",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EHIS533-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 42,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3495:MA(History)",
//         "courseCode": "EHIS551",
//         "courseName": "HISTORY OF INDIA UPTO AD 650",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EHIS551-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 42,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3505:BBA",
//         "courseCode": "EMGN101",
//         "courseName": "BUSINESS ORGANISATION AND MANAGEMENT",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMGN101-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 144,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3782:DBA",
//         "courseCode": "EMGN101",
//         "courseName": "BUSINESS ORGANISATION AND MANAGEMENT",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMGN101-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 144,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3505:BBA",
//         "courseCode": "EMGN303",
//         "courseName": "BUSINESS ENVIRONMENT",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMGN303-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 144,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3782:DBA",
//         "courseCode": "EMGN303",
//         "courseName": "BUSINESS ENVIRONMENT",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMGN303-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 144,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3504:MBA ",
//         "courseCode": "EMGN578",
//         "courseName": "INTERNATIONAL BUSINESS ENVIRONMENT",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMGN578-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3504:MBA ",
//         "courseCode": "EMGN578",
//         "courseName": "INTERNATIONAL BUSINESS ENVIRONMENT",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMGN578-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3504:MBA ",
//         "courseCode": "EMGN578",
//         "courseName": "INTERNATIONAL BUSINESS ENVIRONMENT",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMGN578-3",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3504:MBA ",
//         "courseCode": "EMGN578",
//         "courseName": "INTERNATIONAL BUSINESS ENVIRONMENT",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMGN578-4",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 117,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3504:MBA ",
//         "courseCode": "EMGN581",
//         "courseName": "ORGANISATIONAL BEHAVIOUR AND HUMAN RESOURCE DYNAMICS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMGN581-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3504:MBA ",
//         "courseCode": "EMGN581",
//         "courseName": "ORGANISATIONAL BEHAVIOUR AND HUMAN RESOURCE DYNAMICS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMGN581-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3504:MBA ",
//         "courseCode": "EMGN581",
//         "courseName": "ORGANISATIONAL BEHAVIOUR AND HUMAN RESOURCE DYNAMICS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMGN581-3",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3504:MBA ",
//         "courseCode": "EMGN581",
//         "courseName": "ORGANISATIONAL BEHAVIOUR AND HUMAN RESOURCE DYNAMICS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMGN581-4",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 155,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3500:M.Com ",
//         "courseCode": "EMGN581",
//         "courseName": "ORGANISATIONAL BEHAVIOUR AND HUMAN RESOURCE DYNAMICS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMGN581-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3500:M.Com ",
//         "courseCode": "EMGN581",
//         "courseName": "ORGANISATIONAL BEHAVIOUR AND HUMAN RESOURCE DYNAMICS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMGN581-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3500:M.Com ",
//         "courseCode": "EMGN581",
//         "courseName": "ORGANISATIONAL BEHAVIOUR AND HUMAN RESOURCE DYNAMICS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMGN581-3",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3500:M.Com ",
//         "courseCode": "EMGN581",
//         "courseName": "ORGANISATIONAL BEHAVIOUR AND HUMAN RESOURCE DYNAMICS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMGN581-4",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 155,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3504:MBA ",
//         "courseCode": "EMKT503",
//         "courseName": "MARKETING MANAGEMENT",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMKT503-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3504:MBA ",
//         "courseCode": "EMKT503",
//         "courseName": "MARKETING MANAGEMENT",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMKT503-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3504:MBA ",
//         "courseCode": "EMKT503",
//         "courseName": "MARKETING MANAGEMENT",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMKT503-3",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3504:MBA ",
//         "courseCode": "EMKT503",
//         "courseName": "MARKETING MANAGEMENT",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMKT503-4",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 117,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3501:BCA",
//         "courseCode": "EMTH136",
//         "courseName": "DISCRETE STRUCTURES",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMTH136-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 344,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3783:DCA",
//         "courseCode": "EMTH136",
//         "courseName": "DISCRETE STRUCTURES",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMTH136-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 344,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3492:BA",
//         "courseCode": "EMTH137",
//         "courseName": "CALCULUS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMTH137-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 15,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3496:M.Sc.(Mathematics)",
//         "courseCode": "EMTH515",
//         "courseName": "REAL ANALYSIS-I",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMTH515-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 310,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3496:M.Sc.(Mathematics)",
//         "courseCode": "EMTH516",
//         "courseName": "ADVANCED ABSTRACT ALGEBRA-I",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMTH516-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 310,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3496:M.Sc.(Mathematics)",
//         "courseCode": "EMTH517",
//         "courseName": "THEORY OF DIFFERENTIAL EQUATIONS",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EMTH517-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 310,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3502:MCA",
//         "courseCode": "EPEA515",
//         "courseName": "ANALYTICAL SKILLS-I",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EPEA515-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 350,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3502:MCA",
//         "courseCode": "EPEA515",
//         "courseName": "ANALYTICAL SKILLS-I",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EPEA515-2",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 227,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3492:BA",
//         "courseCode": "EPOL110",
//         "courseName": "INTRODUCTION TO POLITICAL THEORY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EPOL110-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 153,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3497:MA(Political Science)",
//         "courseCode": "EPOL524",
//         "courseName": "POLITICAL THEORY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EPOL524-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 49,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3497:MA(Political Science)",
//         "courseCode": "EPOL525",
//         "courseName": "POLITICAL INSTITUTIONS IN INDIA",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EPOL525-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 49,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3497:MA(Political Science)",
//         "courseCode": "EPOL552",
//         "courseName": "INTERNATIONAL RELATIONS-THEORY AND PRACTICE",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "EPOL552-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 49,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3492:BA",
//         "courseCode": "ESOC111",
//         "courseName": "INTRODUCTION TO SOCIOLOGY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ESOC111-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 137,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3498:MA(Sociology)",
//         "courseCode": "ESOC505",
//         "courseName": "CLASSICAL SOCIOLOGICAL TRADITION",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ESOC505-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 45,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3498:MA(Sociology)",
//         "courseCode": "ESOC515",
//         "courseName": "FUNDAMENTALS OF SOCIOLOGY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ESOC515-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 45,
//         "errorMessage": null
//     },
//     {
//         "prgInfo": "3498:MA(Sociology)",
//         "courseCode": "ESOC516",
//         "courseName": "SCIENCE, TECHNOLOGY AND SOCIETY",
//         "startDate": "01/01/2025 00:00:00",
//         "endDate": "01/01/2026 00:00:00",
//         "grp": "ESOC516-1",
//         "lectures": 1,
//         "tutorial": 0,
//         "practical": 0,
//         "refactoredCnt": 45,
//         "errorMessage": null
//     }
// ]










// const top100Films = [
//     { title: 'The Shawshank Redemption', year: 1994 },
//     { title: 'The Godfather', year: 1972 },
//     { title: 'The Godfather: Part II', year: 1974 },
//     { title: 'The Dark Knight', year: 2008 },
//     { title: '12 Angry Men', year: 1957 },
//     { title: "Schindler's List", year: 1993 },
//     { title: 'Pulp Fiction', year: 1994 },
//     {
//         title: 'The Lord of the Rings: The Return of the King',
//         year: 2003,
//     },
//     { title: 'The Good, the Bad and the Ugly', year: 1966 },
//     { title: 'Fight Club', year: 1999 },
//     {
//         title: 'The Lord of the Rings: The Fellowship of the Ring',
//         year: 2001,
//     },
//     {
//         title: 'Star Wars: Episode V - The Empire Strikes Back',
//         year: 1980,
//     },
//     { title: 'Forrest Gump', year: 1994 },
//     { title: 'Inception', year: 2010 },
//     {
//         title: 'The Lord of the Rings: The Two Towers',
//         year: 2002,
//     },
//     { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
//     { title: 'Goodfellas', year: 1990 },
//     { title: 'The Matrix', year: 1999 },
//     { title: 'Seven Samurai', year: 1954 },
//     {
//         title: 'Star Wars: Episode IV - A New Hope',
//         year: 1977,
//     },
//     { title: 'City of God', year: 2002 },
//     { title: 'Se7en', year: 1995 },
//     { title: 'The Silence of the Lambs', year: 1991 },
//     { title: "It's a Wonderful Life", year: 1946 },
//     { title: 'Life Is Beautiful', year: 1997 },
//     { title: 'The Usual Suspects', year: 1995 },
//     { title: 'Léon: The Professional', year: 1994 },
//     { title: 'Spirited Away', year: 2001 },
//     { title: 'Saving Private Ryan', year: 1998 },
//     { title: 'Once Upon a Time in the West', year: 1968 },
//     { title: 'American History X', year: 1998 },
//     { title: 'Interstellar', year: 2014 },
// ];



// const TimeTableGrouping = () => {
//     const basics: TableType[] = basicsTableData;

//     const [startDate, setStartDate] = useState("");
//     const [endDate, setEndDate] = useState("");
//     const [termID, settermID] = useState("");
//     const [threshold, setThreshold] = useState("");
//     const [overLimit, setOverLimit] = useState("");
//     const [showTable, setShowTable] = useState(false);
//     const [loading, setLoading] = useState<boolean>(false);

//     const handleNumericInput = (value: string, setter: (val: string) => void) => {
//         const regex = /^[0-9]{0,4}$/; 
//         if (regex.test(value)) {
//             setter(value);
//         }
//     };

//     console.log("start date:", startDate);
//     console.log("end date:", endDate);
//     console.log("term id:",termID);
//     console.log("threhold:", threshold);
//     console.log("overheld:", overLimit);



//     //  const handleNumericInput = (value: string, setter: (val: string) => void) => {
//     //     const regex = /^[0-9]{0,4}$/; // Only digits, max 4 characters
//     //     if (regex.test(value)) {
//     //         setter(value); // Save the valid value
//     //         console.log("Valid Threshold:", value);
//     //     }
//     // };


//     const startDateChange = (event: any) => setStartDate(event.target.value);
//     const endDateChange = (event: any) => setEndDate(event.target.value);

//     const termIDChange = (_event: any, value: any[]) => {
//         const titles = value.map((item: any) => item.title).join(", ");
//         settermID(titles);
//     };



//     // const termIDChange = (event: any, value: any) => {
//     //         const titles = value.map((item: any) => item.title).join(", ");
//     //         setSelectedTitles(titles);
//     //         console.log("term id:", titles); // Optional: for debugging
//     //     };


//     const isFormComplete = (): boolean => {
//         return (
//             startDate.trim() !== "" &&
//             endDate.trim() !== "" &&
//             termID.trim() !== "" &&
//             threshold.trim() !== "" &&
//             overLimit.trim() !== ""
//         );
//     };

//     // const handleFetch = () => {
//     //     setShowTable(true);
//     // };

//     const handleFetch = () => {
//         setLoading(true);
//         setShowTable(false);


//         setTimeout(() => {
//             setLoading(false);
//             setShowTable(true);
//         }, 1000);
//     };


//     return (
//         <>
//             <Box sx={{ marginBottom: "20px" }}>
//                 <ChildCard>
//                     <Box
//                         sx={{
//                             position: 'relative',
//                             display: { lg: "flex", xs: "block" },
//                             justifyContent: { lg: "space-between" }
//                         }}
//                     >

//                         <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginBottom: { xs: "10px" } }}>
//                             <Typography variant="h6" sx={{ fontSize: "14px", whiteSpace: "nowrap" }}>
//                                 Start Date:
//                             </Typography>
//                             <TextField
//                                 variant="outlined"
//                                 size="small"
//                                 type="date"
//                                 value={startDate}
//                                 onChange={startDateChange}
//                                 sx={{
//                                     width: "150px",
//                                     "& .MuiInputBase-root": {
//                                         fontSize: "13px",
//                                         height: "35px"
//                                     }
//                                 }}
//                                 InputLabelProps={{ shrink: true }}
//                             />
//                         </Box>


//                         <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginBottom: { xs: "10px" } }}>
//                             <Typography variant="h6" sx={{ fontSize: "14px", whiteSpace: "nowrap" }}>
//                                 End Date:
//                             </Typography>
//                             <TextField
//                                 variant="outlined"
//                                 size="small"
//                                 type="date"
//                                 value={endDate}
//                                 onChange={endDateChange}
//                                 sx={{
//                                     width: "150px",
//                                     "& .MuiInputBase-root": {
//                                         fontSize: "13px",
//                                         height: "35px"
//                                     }
//                                 }}
//                                 InputLabelProps={{ shrink: true }}
//                             />
//                         </Box>


//                         <Box
//                             sx={{
//                                 display: "flex",
//                                 // alignItems: "center",
//                                 // justifyContent: "center",
//                                 gap: 1,
//                                 margin: "0px",
//                                 position: { xs: "absolute", lg: "static" },
//                                 top: { xs: "-30px" },
//                                 right: { xs: "-30px" },
//                                 padding: { xs: "8px" }
//                             }}
//                         >
//                             <Button variant="outlined">
//                                 <Icon icon="line-md:download-loop" width="25" height="25" />
//                             </Button>
//                         </Box>
//                     </Box>

//                     {/* Term ID */}
//                     <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginTop: "0px" }}>
//                         <Typography variant="h6" sx={{ fontSize: "14px", whiteSpace: "nowrap" }}>
//                             Term ID:
//                         </Typography>
//                         {/* <Autocomplete
//                             multiple
//                             sx={{ width: { lg: 930, xs: 245 } }}
//                             size="small"
//                             id="tags-outlined"
//                             options={top100Films}
//                             getOptionLabel={(option) => option.title}
//                             onChange={termIDChange}
//                             renderInput={(params) => (
//                                 <TextField {...params} placeholder="Select" />
//                             )}
//                         /> */}



//                         <Autocomplete
//                             multiple
//                             // sx={{ width: { lg: 930, xs: 245 } }}
//                             fullWidth
//                             size="small"
//                             id="tags-outlined"
//                             options={top100Films}
//                             getOptionLabel={(option) => option.title}
//                             // defaultValue={[top100Films[0]]}
//                             filterSelectedOptions
//                             onChange={termIDChange}
//                             renderInput={(params) => (
//                                 <TextField
//                                     {...params}
//                                     placeholder="Select"
//                                     aria-label="Select"
//                                 />
//                             )}
//                         />




//                     </Box>


//                     <Box sx={{ marginTop: "10px", display: { lg: "flex" }, justifyContent: { lg: "space-between" }, flexWrap: "wrap", gap: 2 }}>
//                         <Box sx={{ display: "flex", alignItems: "center", gap: 1,marginBottom: { xs: "10px" }  }}>
//                             <Typography variant="h6" sx={{ fontSize: "14px", whiteSpace: "nowrap" }}>
//                                 Threshold:
//                             </Typography>
//                             <TextField
//                                 value={threshold}
//                                 onChange={(e) => handleNumericInput(e.target.value, setThreshold)}
//                                 sx={{ width: 150 }}
//                                 size="small"
//                                 required
//                                 inputProps={{ maxLength: 4, inputMode: "numeric", pattern: "[0-9]*" }}
//                                 placeholder="Threshold"
//                             />
//                         </Box>

//                         <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                             <Typography variant="h6" sx={{ fontSize: "14px", whiteSpace: "nowrap" }}>
//                                 OverLimit:
//                             </Typography>
//                             <TextField
//                                 value={overLimit}
//                                 onChange={(e) => handleNumericInput(e.target.value, setOverLimit)}
//                                 sx={{ width: 150 }}
//                                 size="small"
//                                 required
//                                 inputProps={{ maxLength: 4, inputMode: "numeric", pattern: "[0-9]*" }}
//                                 placeholder="OverLimit"
//                             />
//                         </Box>

//                         <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                             <Button
//                                 variant="contained"
//                                 onClick={handleFetch}
//                                 disabled={!isFormComplete()}
//                             >
//                                 Fetch
//                             </Button>
//                         </Box>
//                     </Box>
//                 </ChildCard>
//             </Box>



//             {/* {loading ? (
//                 <CircularProgress />
//             ): (
//                 )} */}
//             {loading ? (
//                 <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
//                     <CircularProgress />
//                 </Box>
//             ) :

//                 (showTable && (
//                     <BlankCard>
//                         <TableContainer>
//                             <Table sx={{ whiteSpace: "nowrap", width: "100%" }}>
//                                 <TableHead>
//                                     <TableRow>
//                                         {["Course Code", "Course Name", "Start date", "End Date", "Grp", "Lectures", "Tutorial", "Practical", "RefactoredCnt"].map((header) => (
//                                             <TableCell key={header} sx={{ fontWeight: "bold" }}>
//                                                 <Typography variant="h6">{header}</Typography>
//                                             </TableCell>
//                                         ))}
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {tableData.map((basic, index) => (
//                                         <TableRow key={index}>

//                                             <TableCell sx={{ padding: "10px" }}>
//                                                 <Typography variant="h6" fontSize={"14px"} fontWeight={400}>{basic.courseCode}</Typography>
//                                             </TableCell>

//                                             <TableCell sx={{ padding: "10px", maxWidth: 500 }}>
//                                                 <Typography variant="h6" fontSize={"14px"} fontWeight={400} sx={{ whiteSpace: "normal" }}>
//                                                     {basic.courseName}
//                                                 </Typography>
//                                             </TableCell>


//                                             <TableCell sx={{ padding: "10px" }}>
//                                                 <Typography variant="h6" fontSize={"14px"} fontWeight={400}>
//                                                     {basic.startDate.split(' ')[0]}
//                                                 </Typography>
//                                             </TableCell>



//                                             <TableCell sx={{ padding: "10px" }}>
//                                                 <Typography variant="h6" fontSize={"14px"} fontWeight={400}>{basic.endDate.split(' ')[0]}</Typography>
//                                             </TableCell>



//                                             <TableCell sx={{ padding: "10px" }}>
//                                                 <Typography variant="h6" fontSize={"14px"} fontWeight={400}>{basic.grp}</Typography>
//                                             </TableCell>

//                                             <TableCell sx={{ padding: "10px" }}>
//                                                 <Typography variant="h6" fontSize={"14px"} fontWeight={400}>{basic.lectures}</Typography>
//                                             </TableCell>

//                                             <TableCell sx={{ padding: "10px" }}>
//                                                 <Typography variant="h6" fontSize={"14px"} fontWeight={400}>{basic.tutorial}</Typography>
//                                             </TableCell>

//                                             <TableCell sx={{ padding: "10px" }}>
//                                                 <Typography variant="h6" fontSize={"14px"} fontWeight={400}>{basic.practical}</Typography>
//                                             </TableCell>

//                                             <TableCell sx={{ padding: "10px" }}>
//                                                 <Typography variant="h6" fontSize={"14px"} fontWeight={400}>{basic.refactoredCnt}</Typography>
//                                             </TableCell>


//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>
//                         </TableContainer>
//                     </BlankCard>
//                 ))}
//         </>
//     );
// };

// export default TimeTableGrouping
































// "use client";
// import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField'
// import BlankCard from '@/app/components/shared/BlankCard';
// import { Autocomplete, Box, Button, CircularProgress, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
// import React, { useState } from 'react'
// import { basicsTableData, TableType } from '../../ProfilePageViews/EmergencyNumber/tableData';
// import ChildCard from '@/app/components/shared/ChildCard';
// import { Icon } from '@iconify/react';
// import { useSession } from 'next-auth/react';
// import { decryptDataforResponse, encryptData } from '@/app/api/services/auth/Encrptdecrpt';
// import { getTimeTableGroupingAction } from '@/app/actions/TimeTableGroupingAction/getTimeTableGroupingAction';
// import Scrollbar from '@/app/components/custom-scroll/Scrollbar';
// import ExcelJS from "exceljs";


// const top100Films = [
//     { number: "124251" },
//     { number: "124252" },
//     { number: "124253" },
//     { number: "125261" },
//     { number: "125262" },
//     { number: "125263" },

// ];


// const TimeTableGrouping = () => {
//     const basics: TableType[] = basicsTableData;

//     const [startDate, setStartDate] = useState("");
//     const [endDate, setEndDate] = useState("");
//     const [termID, settermID] = useState("");
//     const [threshold, setThreshold] = useState("");
//     const [overLimit, setOverLimit] = useState("");
//     const [showTable, setShowTable] = useState(false);
//     const [loading, setLoading] = useState<boolean>(false);

//     const handleNumericInput = (value: string, setter: (val: string) => void) => {
//         const regex = /^[0-9]{0,4}$/;
//         if (regex.test(value)) {
//             setter(value);
//         }
//     };

//     // console.log("start date:", startDate);
//     // console.log("end date:", endDate);
//     // console.log("term id:", termID);
//     // console.log("threhold:", threshold);
//     // console.log("overheld:", overLimit);



//     //  const handleNumericInput = (value: string, setter: (val: string) => void) => {
//     //     const regex = /^[0-9]{0,4}$/; // Only digits, max 4 characters
//     //     if (regex.test(value)) {
//     //         setter(value); // Save the valid value
//     //         console.log("Valid Threshold:", value);
//     //     }
//     // };


//     const startDateChange = (event: any) => setStartDate(event.target.value);
//     const endDateChange = (event: any) => setEndDate(event.target.value);

//     const termIDChange = (_event: any, value: any[]) => {
//         const titles = value.map((item: any) => item.number).join(",");
//         settermID(titles);
//     };



//     // const termIDChange = (event: any, value: any) => {
//     //         const titles = value.map((item: any) => item.title).join(", ");
//     //         setSelectedTitles(titles);
//     //         console.log("term id:", titles); // Optional: for debugging
//     //     };


//     const isFormComplete = (): boolean => {
//         return (
//             startDate.trim() !== "" &&
//             endDate.trim() !== "" &&
//             termID.trim() !== "" &&
//             threshold.trim() !== "" &&
//             overLimit.trim() !== ""
//         );
//     };

//     // const handleFetch = () => {
//     //     setShowTable(true);
//     // };

//     const handleFetch = () => {
//         setLoading(true);
//         setShowTable(false);


//         setTimeout(() => {
//             setLoading(false);
//             setShowTable(true);
//         }, 1000);
//     };

//     const { data: session } = useSession();
//     const [submitSuccess, setSubmitSuccess] = useState("");
//     const [submitError, setSubmitError] = useState("");



//     // const handleSubmit = async () => {
//     //     try {
//     //         //   setSubmitError("");
//     //         //   setSubmitSuccess("");
//     //         //   setLoading(true);

//     // const formfields = {
//     //     TermID: termID,
//     //     StartDate: startDate.toString(),
//     //     EndDate: endDate.toString(),
//     //     Threshold: parseInt(threshold, 10),
//     //     OverLimit: parseInt(overLimit, 10)
//     // };

//     //         console.log("Values which send ", formfields)

//     //         if (!session || !session.user || !session.user.token) {
//     //             throw new Error("Session or token is missing");
//     //         }

//     //         let splitValue = session.user.token.split("NEXT2121ANG");
//     //         const credentialsJson = JSON.stringify(formfields);
//     //         // console.log("token create  ", splitValue[1])

//     //         // Encrypt the data 
//     //         // const { Data } = encryptData(credentialsJson, splitValue[1]);
//     //         // console.log("data is   ", Data)

//     //         const response = await getTimeTableGroupingAction(credentialsJson,splitValue[1]);
//     //         console.log("response  is   ", response)
//     //         let apiData = response.ApiData;
//     //         // console.log("time table grouping ", apiData);
//     //         const decryptedData = decryptDataforResponse(apiData, splitValue[1]);
//     //         const parsedData = JSON.parse(decryptedData);

//     //         if (response.status === "success") {
//     //             setSubmitSuccess("Password changed successfully!");
//     //         } else {
//     //             setSubmitError(response.message || "Failed to change password");
//     //         }
//     //     } catch (error) {
//     //         setSubmitError("Failed to change password. Please try again.");
//     //     } finally {
//     //         setLoading(false);

//     //     }
//     // };






//     const [tableDataGroup, setTableDataGroup] = useState<any>([]);



//     const handleSubmit = async () => {
//         try {
//             setSubmitError("");
//             setSubmitSuccess("");
//             setLoading(true);

//             const formfields = {
//                 termId: termID,
//                 startDate: startDate.toString(),
//                 endDate: endDate.toString(),
//                 threshold: parseInt(threshold, 10),
//                 overlimit: parseInt(overLimit, 10)
//             };

//             // console.log("fields", formfields)

//             if (!session || !session.user || !session.user.token) {
//                 throw new Error("Session or token is missing");
//             }

//             let splitValue = session.user.token.split("NEXT2121ANG");
//             const credentialsJson = JSON.stringify(formfields);

//             // Encrypt the data
//             const { Data } = encryptData(credentialsJson, splitValue[1]);

//             const response = await getTimeTableGroupingAction(credentialsJson);

//             // console.log("response", response)

//             let apiData = response.ApiData;

//             // console.log("data", apiData)

//             setTableDataGroup(apiData.data);


//             if (response.status === "success") {
//                 setSubmitSuccess("Password changed successfully!");
//                 setLoading(false);
//                 setShowTable(true);
//             } else {
//                 setSubmitError(response.message || "Failed to change password");
//             }
//         } catch (error) {
//             setSubmitError("Failed to change password. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };


//     const handleExport = async () => {
//         if (!tableDataGroup || tableDataGroup.length === 0) return;

//         const workbook = new ExcelJS.Workbook();
//         const worksheet = workbook.addWorksheet("Time Table Grouping");

//         // Add header row exactly like the table
//         const headers = [
//             "TermId",
//             "Course Code",
//             "Course Name",
//             "Start Date",
//             "End Date",
//             "Grp",
//             "Lectures",
//             "Tutorial",
//             "Practical",
//             "Student Count",
//             "PrgInfo",
//         ];
//         worksheet.addRow(headers);

//         // Add table data rows
//         tableDataGroup.forEach((basic: any) => {
//             worksheet.addRow([
//                 basic.termId || "N/A",
//                 basic.courseCode || "N/A",
//                 basic.courseName || "N/A",
//                 basic.startDate?.split(" ")[0] || "N/A",
//                 basic.endDate?.split(" ")[0] || "N/A",
//                 basic.grp || "N/A",
//                 basic.lectures || "0",
//                 basic.tutorial || "0",
//                 basic.practical || "0",
//                 basic.refactoredCnt || "0",
//                 basic.prgInfo || "N/A",
//             ]);
//         });

//         // Style header
//         const headerRow = worksheet.getRow(1);
//         headerRow.font = { bold: true };
//         headerRow.alignment = { horizontal: "center" };
//         headerRow.eachCell((cell) => {
//             cell.fill = {
//                 type: "pattern",
//                 pattern: "solid",
//                 fgColor: { argb: "FFEFEFEF" } // light gray background
//             };
//             cell.border = {
//                 top: { style: "thin" },
//                 left: { style: "thin" },
//                 bottom: { style: "thin" },
//                 right: { style: "thin" }
//             };
//         });

//         // Auto width for columns
//         worksheet.columns.forEach((column: any) => {
//             let maxLength = 0;
//             column.eachCell({ includeEmpty: true }, (cell: any) => {
//                 const columnLength = cell.value ? cell.value.toString().length : 10;
//                 if (columnLength > maxLength) maxLength = columnLength;
//             });
//             column.width = maxLength < 15 ? 15 : maxLength;
//         });

//         // Generate Excel file and trigger download
//         const buffer = await workbook.xlsx.writeBuffer();
//         const blob = new Blob([buffer], {
//             type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//         });
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = "time_table_grouping.xlsx";
//         a.click();
//         window.URL.revokeObjectURL(url);
//     };







//     return (
//         <>
//             <Box sx={{ marginBottom: "20px" }}>
//                 <ChildCard>
//                     <Box
//                         sx={{
//                             position: 'relative',
//                             display: { lg: "flex", xs: "block" },
//                             justifyContent: { lg: "space-between" }
//                         }}
//                     >

//                         <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginBottom: { xs: "10px" } }}>
//                             <Typography variant="h6" sx={{ fontSize: "14px", whiteSpace: "nowrap" }}>
//                                 Start Date:
//                             </Typography>
//                             <TextField
//                                 variant="outlined"
//                                 size="small"
//                                 type="date"
//                                 value={startDate}
//                                 onChange={startDateChange}
//                                 sx={{
//                                     width: "150px",
//                                     "& .MuiInputBase-root": {
//                                         fontSize: "13px",
//                                         height: "35px"
//                                     }
//                                 }}
//                                 InputLabelProps={{ shrink: true }}
//                             />
//                         </Box>


//                         <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginBottom: { xs: "10px" } }}>
//                             <Typography variant="h6" sx={{ fontSize: "14px", whiteSpace: "nowrap" }}>
//                                 End Date:
//                             </Typography>
//                             <TextField
//                                 variant="outlined"
//                                 size="small"
//                                 type="date"
//                                 value={endDate}
//                                 onChange={endDateChange}
//                                 sx={{
//                                     width: "150px",
//                                     "& .MuiInputBase-root": {
//                                         fontSize: "13px",
//                                         height: "35px"
//                                     }
//                                 }}
//                                 InputLabelProps={{ shrink: true }}
//                             />
//                         </Box>


//                         <Box
//                             sx={{
//                                 display: "flex",
//                                 // alignItems: "center",
//                                 // justifyContent: "center",
//                                 gap: 1,
//                                 margin: "0px",
//                                 position: { xs: "absolute", lg: "static" },
//                                 top: { xs: "-30px" },
//                                 right: { xs: "-30px" },
//                                 padding: { xs: "8px" }
//                             }}
//                         >
//                             <Button variant="outlined" onClick={() => { handleExport() }}>
//                                 <Icon icon="line-md:download-loop" width="25" height="25" />
//                             </Button>
//                         </Box>
//                     </Box>

//                     {/* Term ID */}
//                     <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginTop: "0px" }}>
//                         <Typography variant="h6" sx={{ fontSize: "14px", whiteSpace: "nowrap" }}>
//                             Term ID:
//                         </Typography>
//                         {/* <Autocomplete
//                             multiple
//                             sx={{ width: { lg: 930, xs: 245 } }}
//                             size="small"
//                             id="tags-outlined"
//                             options={top100Films}
//                             getOptionLabel={(option) => option.title}
//                             onChange={termIDChange}
//                             renderInput={(params) => (
//                                 <TextField {...params} placeholder="Select" />
//                             )}
//                         /> */}



//                         <Autocomplete
//                             multiple
//                             // sx={{ width: {  xs: 245 } }}
//                             fullWidth
//                             size="small"
//                             id="tags-outlined"
//                             options={top100Films}
//                             getOptionLabel={(option) => option.number}
//                             // defaultValue={[top100Films[0]]}
//                             filterSelectedOptions
//                             onChange={termIDChange}
//                             renderInput={(params) => (
//                                 <TextField
//                                     {...params}
//                                     placeholder="Select"
//                                     aria-label="Select"
//                                 />
//                             )}
//                         />




//                     </Box>


//                     <Box sx={{ marginTop: "10px", display: { lg: "flex" }, justifyContent: { lg: "space-between" }, flexWrap: "wrap", gap: 2 }}>
//                         <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginBottom: { xs: "10px" } }}>
//                             <Typography variant="h6" sx={{ fontSize: "14px", whiteSpace: "nowrap" }}>
//                                 Threshold:
//                             </Typography>
//                             <TextField
//                                 value={threshold}
//                                 onChange={(e) => handleNumericInput(e.target.value, setThreshold)}
//                                 sx={{ width: 150 }}
//                                 size="small"
//                                 required
//                                 inputProps={{ maxLength: 3, inputMode: "numeric", pattern: "[0-9]*" }}
//                                 placeholder="Threshold"
//                             />
//                         </Box>

//                         <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                             <Typography variant="h6" sx={{ fontSize: "14px", whiteSpace: "nowrap" }}>
//                                 OverLimit:
//                             </Typography>
//                             <TextField
//                                 value={overLimit}
//                                 onChange={(e) => handleNumericInput(e.target.value, setOverLimit)}
//                                 sx={{ width: 150 }}
//                                 size="small"
//                                 required
//                                 inputProps={{ maxLength: 3, inputMode: "numeric", pattern: "[0-9]*" }}
//                                 placeholder="OverLimit"
//                             />
//                         </Box>

//                         <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                             <Button
//                                 variant="contained"
//                                 onClick={() => { handleSubmit() }}

//                                 // onClick={() => { handleFetch() }}


//                                 disabled={!isFormComplete()}
//                             >
//                                 Fetch
//                             </Button>
//                         </Box>
//                     </Box>
//                 </ChildCard>
//             </Box>



//             {/* {loading ? (
//                 <CircularProgress />
//             ): (
//                 )} */}
//             {loading ? (
//                 <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
//                     <CircularProgress />
//                 </Box>
//             ) :

//                 (showTable && (
//                     <BlankCard>
//                         <TableContainer sx={{ maxHeight: 400 /* adjust height as needed */ }}>
//                             <Table stickyHeader sx={{ whiteSpace: "nowrap", width: "100%" }}>
//                                 {/* <Scrollbar sx={{ height: "400px", }}> */}
//                                 <TableHead>
//                                     <TableRow>
//                                         {[
//                                             "TermId",
//                                             "Course Code",
//                                             "Course Name",
//                                             "Start date",
//                                             "End Date",
//                                             "Grp",
//                                             "Lectures",
//                                             "Tutorial",
//                                             "Practical",
//                                             "Student Count",
//                                             "PrgInfo",
//                                         ].map((header) => (
//                                             <TableCell
//                                                 key={header}
//                                                 sx={{
//                                                     fontWeight: "bold",
//                                                     // backgroundColor: "#fff", 
//                                                     zIndex: 1,
//                                                     whiteSpace: "normal"
//                                                 }}
//                                             >
//                                                 <Typography variant="h6" fontSize={"12px"}>{header}</Typography>
//                                             </TableCell>
//                                         ))}
//                                     </TableRow>
//                                 </TableHead>


//                                 <TableBody>
//                                     {tableDataGroup.map((basic: any, index: any) => (
//                                         <TableRow key={index}>

//                                             <TableCell sx={{ padding: "7px" }}>
//                                                 <Typography variant="h6" fontSize={"11px"} fontWeight={400} >
//                                                     {basic.termId}
//                                                 </Typography>
//                                             </TableCell>

//                                             <TableCell sx={{ padding: "7px" }}>
//                                                 <Typography variant="h6" fontSize={"11px"} fontWeight={400}>
//                                                     {basic.courseCode}
//                                                 </Typography>
//                                             </TableCell>

//                                             <TableCell sx={{ padding: "7px", maxWidth: 500 }}>
//                                                 <Typography
//                                                     variant="h6"
//                                                     fontSize={"11px"}
//                                                     fontWeight={400}
//                                                     sx={{ whiteSpace: "normal", width: "170px" }}
//                                                 >
//                                                     {basic.courseName}
//                                                 </Typography>
//                                             </TableCell>

//                                             <TableCell sx={{ padding: "7px" }}>
//                                                 <Typography variant="h6" fontSize={"11px"} fontWeight={400}>
//                                                     {basic.startDate.split(" ")[0]}
//                                                 </Typography>
//                                             </TableCell>

//                                             <TableCell sx={{ padding: "7px" }}>
//                                                 <Typography variant="h6" fontSize={"11px"} fontWeight={400}>
//                                                     {basic.endDate.split(" ")[0]}
//                                                 </Typography>
//                                             </TableCell>

//                                             <TableCell sx={{ padding: "7px" }}>
//                                                 <Typography variant="h6" fontSize={"11px"} fontWeight={400}>
//                                                     {basic.grp}
//                                                 </Typography>
//                                             </TableCell>

//                                             <TableCell sx={{ padding: "7px" }}>
//                                                 <Typography variant="h6" fontSize={"11px"} fontWeight={400}>
//                                                     {basic.lectures}
//                                                 </Typography>
//                                             </TableCell>

//                                             <TableCell sx={{ padding: "7px" }}>
//                                                 <Typography variant="h6" fontSize={"11px"} fontWeight={400}>
//                                                     {basic.tutorial}
//                                                 </Typography>
//                                             </TableCell>

//                                             <TableCell sx={{ padding: "7px" }}>
//                                                 <Typography variant="h6" fontSize={"11px"} fontWeight={400}>
//                                                     {basic.practical}
//                                                 </Typography>
//                                             </TableCell>

//                                             <TableCell sx={{ padding: "7px" }}>
//                                                 <Typography variant="h6" fontSize={"11px"} fontWeight={400}>
//                                                     {basic.refactoredCnt}
//                                                 </Typography>
//                                             </TableCell>


//                                             <TableCell sx={{ padding: "7px" }}>
//                                                 <Typography variant="h6" fontSize={"11px"} fontWeight={400} sx={{whiteSpace: "normal"}}>
//                                                     {basic.prgInfo}
//                                                 </Typography>
//                                             </TableCell>
//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                                 {/* </Scrollbar> */}
//                             </Table>
//                         </TableContainer>
//                     </BlankCard>

//                 ))}
//         </>
//     );
// };

// export default TimeTableGrouping;

// function setUploadSuccess(arg0: boolean) {
//     throw new Error('Function not implemented.');
// }



































"use client";
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField'
import BlankCard from '@/app/components/shared/BlankCard';
import { Autocomplete, Box, Button, CircularProgress, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'

import ChildCard from '@/app/components/shared/ChildCard';
import { Icon } from '@iconify/react';
import { useSession } from 'next-auth/react';
import { decryptDataforResponse, encryptData } from '@/app/api/services/auth/Encrptdecrpt';

import Scrollbar from '@/app/components/custom-scroll/Scrollbar';
import ExcelJS from "exceljs";
import { getTimeTableGroupingAction } from '@/app/actions/StaffActions/TimeTableGroupingAction/getTimeTableGroupingAction';


const top100Films = [
    { number: "124251" },
    { number: "124252" },
    { number: "124253" },
    { number: "125261" },
    { number: "125262" },
    { number: "125263" },

];


const TimeTableGrouping = () => {


    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [termID, settermID] = useState("");
    const [threshold, setThreshold] = useState("");
    const [InitialIndex, setInitialIndex] = useState("");
    const [overLimit, setOverLimit] = useState("");
    const [showTable, setShowTable] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [isExportEnabled, setIsExportEnabled] = useState(false);

    const handleNumericInput = (value: string, setter: (val: string) => void) => {
        const regex = /^[0-9]{0,4}$/;
        if (regex.test(value)) {
            setter(value);
        }
    };


    const handleTermIDNumericInput = (value: string, setter: (val: string) => void) => {
        const regex = /^[0-9,]{0,30}$/;
        if (regex.test(value)) {
            setter(value);
        }
    };



    // console.log("start date:", startDate);
    // console.log("end date:", endDate);
    // console.log("term id:", termID);
    // console.log("threhold:", threshold);
    // console.log("overheld:", overLimit);



    //  const handleNumericInput = (value: string, setter: (val: string) => void) => {
    //     const regex = /^[0-9]{0,4}$/; // Only digits, max 4 characters
    //     if (regex.test(value)) {
    //         setter(value); // Save the valid value
    //         console.log("Valid Threshold:", value);
    //     }
    // };


    const startDateChange = (event: any) => setStartDate(event.target.value);
    const endDateChange = (event: any) => setEndDate(event.target.value);

    const termIDChange = (_event: any, value: any[]) => {
        const titles = value.map((item: any) => item.number).join(",");
        settermID(titles);
    };



    // const termIDChange = (event: any, value: any) => {
    //         const titles = value.map((item: any) => item.title).join(", ");
    //         setSelectedTitles(titles);
    //         console.log("term id:", titles); // Optional: for debugging
    //     };


    const isFormComplete = (): boolean => {
        return (
            startDate.trim() !== "" &&
            endDate.trim() !== "" &&
            termID.trim() !== "" &&
            threshold.trim() !== "" &&
            overLimit.trim() !== "" &&
            InitialIndex.trim() !== ""
        );
    };

    // const handleFetch = () => {
    //     setShowTable(true);
    // };

    const handleFetch = () => {
        setLoading(true);
        setShowTable(false);


        setTimeout(() => {
            setLoading(false);
            setShowTable(true);
        }, 1000);
    };

    const { data: session } = useSession();
    const [submitSuccess, setSubmitSuccess] = useState("");
    const [submitError, setSubmitError] = useState("");



    // const handleSubmit = async () => {
    //     try {
    //         //   setSubmitError("");
    //         //   setSubmitSuccess("");
    //         //   setLoading(true);

    // const formfields = {
    //     TermID: termID,
    //     StartDate: startDate.toString(),
    //     EndDate: endDate.toString(),
    //     Threshold: parseInt(threshold, 10),
    //     OverLimit: parseInt(overLimit, 10)
    // };

    //         console.log("Values which send ", formfields)

    //         if (!session || !session.user || !session.user.token) {
    //             throw new Error("Session or token is missing");
    //         }

    //         let splitValue = session.user.token.split("NEXT2121ANG");
    //         const credentialsJson = JSON.stringify(formfields);
    //         // console.log("token create  ", splitValue[1])

    //         // Encrypt the data 
    //         // const { Data } = encryptData(credentialsJson, splitValue[1]);
    //         // console.log("data is   ", Data)

    //         const response = await getTimeTableGroupingAction(credentialsJson,splitValue[1]);
    //         console.log("response  is   ", response)
    //         let apiData = response.ApiData;
    //         // console.log("time table grouping ", apiData);
    //         const decryptedData = decryptDataforResponse(apiData, splitValue[1]);
    //         const parsedData = JSON.parse(decryptedData);

    //         if (response.status === "success") {
    //             setSubmitSuccess("Password changed successfully!");
    //         } else {
    //             setSubmitError(response.message || "Failed to change password");
    //         }
    //     } catch (error) {
    //         setSubmitError("Failed to change password. Please try again.");
    //     } finally {
    //         setLoading(false);

    //     }
    // };






    const [tableDataGroup, setTableDataGroup] = useState<any>([]);



    const handleSubmit = async () => {
        try {
            setSubmitError("");
            setSubmitSuccess("");
            setLoading(true);

            const formfields = {
                termId: termID,
                startDate: startDate.toString(),
                endDate: endDate.toString(),
                threshold: parseInt(threshold, 10),
                overlimit: parseInt(overLimit, 10),
                InitialIndex: parseInt(InitialIndex, 10)
            };

            console.log("fields", formfields)

            if (!session || !session.user || !session.user.token) {
                throw new Error("Session or token is missing");
            }

            let splitValue = session.user.token.split("NEXT2121ANG");
            const credentialsJson = JSON.stringify(formfields);

            // Encrypt the data
            // const { Data } = encryptData(credentialsJson, splitValue[1]);

            const response = await getTimeTableGroupingAction(credentialsJson);

            // console.log("response", response)

            let apiData = response.ApiData;

            console.log("data", apiData)

            setTableDataGroup(apiData.data);


            if (response.status === "success") {
                setSubmitSuccess("Password changed successfully!");
                setIsExportEnabled(true);
                setLoading(false);
                setShowTable(true);
            } else {
                setSubmitError(response.message || "Failed to change password");
            }
        } catch (error) {
            setSubmitError("Failed to change password. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    const handleExport = async () => {
        if (!tableDataGroup || tableDataGroup.length === 0) return;

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Time Table Grouping");

        // Add header row exactly like the table
        const headers = [
            "TermId",
            "Course Code",
            "Course Name",
            "Start Date",
            "End Date",
            "Group",
            "LectureCode",
            "Lectures",
            "Tutorial",
            "Practical",
            "Student Count",
            "Program",
        ];
        worksheet.addRow(headers);

        // Add table data rows
        tableDataGroup.forEach((basic: any) => {
            worksheet.addRow([
                basic.termId || "N/A",
                basic.courseCode || "N/A",
                basic.courseName || "N/A",
                basic.startDate?.split(" ")[0] || "N/A",
                basic.endDate?.split(" ")[0] || "N/A",
                basic.grp || "N/A",
                basic.lectureCode || "N/A",
                basic.lectures || "0",
                basic.tutorial || "0",
                basic.practical || "0",
                basic.refactoredCnt || "0",
                basic.prgInfo || "N/A",
            ]);
        });

        // Style header
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true };
        headerRow.alignment = { horizontal: "center" };
        headerRow.eachCell((cell) => {
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFEFEFEF" } // light gray background
            };
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" }
            };
        });

        // Auto width for columns
        worksheet.columns.forEach((column: any) => {
            let maxLength = 0;
            column.eachCell({ includeEmpty: true }, (cell: any) => {
                const columnLength = cell.value ? cell.value.toString().length : 10;
                if (columnLength > maxLength) maxLength = columnLength;
            });
            column.width = maxLength < 15 ? 15 : maxLength;
        });

        // Generate Excel file and trigger download
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "time_table_grouping.xlsx";
        a.click();
        window.URL.revokeObjectURL(url);
    };







    return (
        <>
            <Box sx={{ mb: 3 }}>
                <ChildCard>
                    <Box sx={{ p: 2 }}>
                        {/* Top Row: Start/End Date + Download Button */}
                        <Grid container spacing={2} alignItems="center" sx={{ marginBottom: 2 }}>

                            <Grid size={{ xs: 12, sm: 6, md: 3, lg: 4 }}>
                                <TextField
                                    label="Term ID"
                                    value={termID}
                                    onChange={(e) => handleTermIDNumericInput(e.target.value, settermID)}
                                    size="small"
                                    required
                                    fullWidth
                                    inputProps={{
                                        maxLength: 30,
                                        inputMode: "numeric",
                                        pattern: "[0-9,]*",
                                    }}
                                    placeholder="e.g., 124251, 125263"
                                />
                            </Grid>


                            <Grid size={{ xs: 12, sm: 6, md: 3, lg: 4 }} >
                                <TextField
                                    label="Start Date"
                                    variant="outlined"
                                    size="small"
                                    type="date"
                                    value={startDate}
                                    onChange={startDateChange}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    sx={{
                                        "& .MuiInputBase-root": {
                                            fontSize: "11px",
                                            height: "35px",
                                        },
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 3, lg: 4 }}>
                                <TextField
                                    label="End Date"
                                    variant="outlined"
                                    size="small"
                                    type="date"
                                    value={endDate}
                                    onChange={endDateChange}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    sx={{
                                        "& .MuiInputBase-root": {
                                            fontSize: "11px",
                                            height: "35px",
                                        },
                                    }}
                                />
                            </Grid>



                            {/* <Grid size={{xs:12,sm:6,md:3}} textAlign="right">
          <Button
            variant="outlined"
            onClick={handleExport}
            startIcon={<Icon icon="line-md:download-loop" width="20" height="20" />}
          >
            Export
          </Button>
        </Grid> */}
                        </Grid>

                        {/* Second Row: Threshold + OverLimit + Fetch Button */}
                        <Grid container spacing={2} alignItems="center" sx={{ mt: 1 }}>
                            <Grid size={{ xs: 12, sm: 4, md: 3, lg: 4 }}>
                                <TextField
                                    label="Threshold"
                                    value={threshold}
                                    onChange={(e) => handleNumericInput(e.target.value, setThreshold)}
                                    size="small"
                                    required
                                    fullWidth
                                    inputProps={{ maxLength: 3, inputMode: "numeric", pattern: "[0-9]*" }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 4, md: 3, lg: 4 }}>
                                <TextField
                                    label="OverLimit"
                                    value={overLimit}
                                    onChange={(e) => handleNumericInput(e.target.value, setOverLimit)}
                                    size="small"
                                    required
                                    fullWidth
                                    inputProps={{ maxLength: 3, inputMode: "numeric", pattern: "[0-9]*" }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 4, md: 3, lg: 4 }}>
                                <TextField
                                    label="InitialIndex"
                                    value={InitialIndex}
                                    onChange={(e) => handleNumericInput(e.target.value, setInitialIndex)}
                                    size="small"
                                    required
                                    fullWidth
                                    inputProps={{ maxLength: 5, inputMode: "numeric", pattern: "[0-9]*" }}
                                />
                            </Grid>


                            {/* </Grid> */}


                        </Grid>



                        <Grid container spacing={2} alignItems="center" sx={{ mt: 1 }}>
                            <Grid size={{ xs: 12, sm: 4, md: 3, lg: 3 }}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={handleSubmit}
                                    disabled={!isFormComplete()}
                                >
                                    Fetch
                                </Button>
                            </Grid>

                            {/* <Grid size={{xs:12,sm:6,md:3,lg:3}} textAlign="right">
          <Button
            variant="outlined"
            onClick={handleExport}
            startIcon={<Icon icon="line-md:download-loop" width="20" height="20" />}
          >
            Export
          </Button>
        </Grid> */}


                            {/* <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }} > */}
                            <Box
                                sx={{
                                    display: "flex",
                                    // alignItems: "center",
                                    // justifyContent: "center",
                                    // gap: 1,
                                    // position: { xs: "absolute", lg: "static" },
                                    // top: { xs: "-30px" },
                                    // right: { xs: "-30px" },
                                    // padding: { xs: "8px" }
                                }}
                            >
                                <Button variant="outlined" onClick={() => { handleExport() }} disabled={!isExportEnabled}>
                                    <Icon icon="line-md:download-loop" width="25" height="25" />
                                </Button>
                            </Box>
                        </Grid>

                    </Box>
                </ChildCard>
            </Box>




            {/* {loading ? (
                <CircularProgress />
            ): (
                )} */}
            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) :

                (showTable && (
                  <BlankCard>
  <TableContainer sx={{ maxHeight: 400 }}>
    <Table stickyHeader sx={{ whiteSpace: "nowrap", width: "100%" }}>
      <TableHead>
        <TableRow>
          {[
            "TermId",
            "Course Code",
            "Course Name",
            "Start date",
            "End Date",
            "Group",
            "LectureCode",
            "Lectures",
            "Tutorial",
            "Practical",
            "Student Count",
            "Program",
          ].map((header) => (
            <TableCell
              key={header}
              align="center" // centers header text horizontally
              sx={{
                fontWeight: "bold",
                zIndex: 1,
                whiteSpace: "normal",
                textAlign: "center",
                verticalAlign: "middle", // vertical center
              }}
            >
              <Typography
                variant="h6"
                fontSize={"12px"}
                sx={{ textAlign: "center" }}
              >
                {header}
              </Typography>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>

      <TableBody>
        {tableDataGroup.map((basic: any, index: any) => (
          <TableRow key={index}>
            <TableCell align="center" sx={{ padding: "7px" }}>
              <Typography
                variant="h6"
                fontSize={"11px"}
                fontWeight={400}
                sx={{ textAlign: "center" }}
              >
                {basic.termId}
              </Typography>
            </TableCell>

            <TableCell align="center" sx={{ padding: "7px" }}>
              <Typography
                variant="h6"
                fontSize={"11px"}
                fontWeight={400}
                sx={{ textAlign: "center" }}
              >
                {basic.courseCode}
              </Typography>
            </TableCell>

            <TableCell
              align="center"
              sx={{ padding: "7px", maxWidth: 500, textAlign: "center" }}
            >
              <Typography
                variant="h6"
                fontSize={"11px"}
                fontWeight={400}
                sx={{
                  whiteSpace: "normal",
                  width: "170px",
                  textAlign: "center",
                }}
              >
                {basic.courseName}
              </Typography>
            </TableCell>

            <TableCell align="center" sx={{ padding: "7px" }}>
              <Typography variant="h6" fontSize={"11px"} fontWeight={400}>
                {basic.startDate.split(" ")[0]}
              </Typography>
            </TableCell>

            <TableCell align="center" sx={{ padding: "7px" }}>
              <Typography variant="h6" fontSize={"11px"} fontWeight={400}>
                {basic.endDate.split(" ")[0]}
              </Typography>
            </TableCell>

            <TableCell align="center" sx={{ padding: "7px" }}>
              <Typography variant="h6" fontSize={"11px"} fontWeight={400}>
                {basic.grp}
              </Typography>
            </TableCell>

            <TableCell align="center" sx={{ padding: "7px" }}>
              <Typography variant="h6" fontSize={"11px"} fontWeight={400}>
                {basic.lectureCode}
              </Typography>
            </TableCell>

            <TableCell align="center" sx={{ padding: "7px" }}>
              <Typography variant="h6" fontSize={"11px"} fontWeight={400}>
                {basic.lectures}
              </Typography>
            </TableCell>

            <TableCell align="center" sx={{ padding: "7px" }}>
              <Typography variant="h6" fontSize={"11px"} fontWeight={400}>
                {basic.tutorial}
              </Typography>
            </TableCell>

            <TableCell align="center" sx={{ padding: "7px" }}>
              <Typography variant="h6" fontSize={"11px"} fontWeight={400}>
                {basic.practical}
              </Typography>
            </TableCell>

            <TableCell align="center" sx={{ padding: "7px" }}>
              <Typography variant="h6" fontSize={"11px"} fontWeight={400}>
                {basic.refactoredCnt}
              </Typography>
            </TableCell>

            <TableCell align="center" sx={{ padding: "7px" }}>
              <Typography
                variant="h6"
                fontSize={"11px"}
                fontWeight={400}
                sx={{ whiteSpace: "normal", textAlign: "center" }}
              >
                {basic.prgInfo}
              </Typography>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
</BlankCard>


                ))}
        </>
    );
};

export default TimeTableGrouping;

function setUploadSuccess(arg0: boolean) {
    throw new Error('Function not implemented.');
}

