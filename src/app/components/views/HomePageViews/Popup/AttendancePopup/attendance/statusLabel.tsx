import {  Chip } from "@mui/material";



const StatusLabel=({ status,val,sizetype='small' }: { status: "Present" | "Absent" | "DutyLeave"| "classData" ,val?:number | string, sizetype?:'small'|'medium'})=>{

    const statusColor={
        Present: {
            bgColor: "rgba(46, 125, 50, 0.15)", // Light Green
      textColor: "#2E7D32", // Dark Green
            label: "Present" },
        Absent: {
           // bgColor: "#FFEBEE", // Light Red
            bgColor: "rgba(211, 47, 47, 0.15)",
      textColor: "#C62828", // Dark Red
             label: "Absent" },
             DutyLeave: {
                bgColor: "rgba(25, 118, 210, 0.15)", // Light Blue with transparency
                textColor: "#1565C0", // Dark Blue
                label: "Duty Leave"
              },
              classData: {
                bgColor: "rgba(33, 150, 243, 0.15)", // Light Blue
                textColor: "#1976D2", // Dark Blue
                label: "classAttend"
              }
    }
    return(
 
     <Chip
        label={statusColor[status].label +(val!=undefined?(" -"+val):'')}
        size={sizetype}          
        variant="filled"
        sx={{borderRadius:'8px',
            backgroundColor:statusColor[status].bgColor,
            color:statusColor[status].textColor
        }}
        ></Chip>
    );
}

export default StatusLabel;