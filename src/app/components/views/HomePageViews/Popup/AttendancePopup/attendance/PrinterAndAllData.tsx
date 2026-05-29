"use client";
import { Box,  useTheme } from '@mui/material'
import PrintIcon from '@mui/icons-material/Print';
import React from 'react'


function PrinterAndAllData({ designedTable }: { designedTable: string }) {
  const theme = useTheme();


  const printer = () => {
    const printContent = `
      <html>
        <head>
          <title>allCourseAttendenceData</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; }
            th, td { font-size: 12px; border: 1px solid black; padding: 8px; text-align: center; }
            th { background-color: #ddd; font-weight: bold; }
          </style>
        </head>
        <body>
          ${designedTable}
        </body>
      </html>
    `;

    // Create an invisible iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(printContent);
      iframeDoc.close();

      // Wait for content to load before printing
      iframe.onload = () => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();

        // Clean up
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      };
    }
  };


  return (
    <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center' }}>

      <PrintIcon titleAccess="print all attendence" sx={{ cursor: 'pointer', margin: 0 }} onClick={printer} />


    </Box>
  )
}

export default PrinterAndAllData

