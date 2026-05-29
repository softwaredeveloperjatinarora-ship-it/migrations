// "use client";
// import React from "react";
// import {
//     Button,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     DialogProps,
//     IconButton,
//     Typography,
//     Table,
//     TableHead,
//     TableCell,
//     TableContainer,
//     TableRow,
//     TableBody,
//     Stack,
// } from "@mui/material";
// import Scrollbar from "@/app/components/custom-scroll/Scrollbar"; // Import Scrollbar
// import { IconX } from "@tabler/icons-react";
// import BlankCard from "@/app/components/shared/BlankCard";
// import { AllEventData ,TableType} from "./ViewDetailsData";



// interface PopupProps {
//     open: boolean;
//     handleClose: () => void;
//     title: string;
// }

// const ViewDetailsPopup: React.FC<PopupProps> = ({
//     open,
//     handleClose,
//     title,
// }) => {
//     const descriptionElementRef = React.useRef<HTMLDivElement>(null);

//     React.useEffect(() => {
//         if (open) {
//             const { current: descriptionElement } = descriptionElementRef;
//             if (descriptionElement !== null) {
//                 descriptionElement.focus();
//             }
//         }
//     }, [open]);

//     const basics: TableType[] = AllEventData;



//     return (
//         <Dialog
//             open={open}
//             onClose={handleClose}
//             aria-labelledby="scroll-dialog-title"
//             aria-describedby="scroll-dialog-description"
//             PaperProps={{ sx: { width: "80%", height: "90%" } }}
//             maxWidth="lg"
//         >
//             <DialogTitle sx={{
//                 textAlign: "center", display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 // fontSize:{xs:"15px"}
//                 fontSize:{xs:".9rem"}
//             }}>

//                 {title}

//                 <IconButton onClick={handleClose} size="small" sx={{ ml: 2 }}>
//                     <IconX size={24} />
//                 </IconButton>
//             </DialogTitle>
//             <DialogContent dividers>
//                 <Scrollbar sx={{ height: "100%" }}>

     




      // <BlankCard>
        // <TableContainer>
        //   <Table
        //     aria-label="simple table"
        //     sx={{
        //       whiteSpace: "nowrap",
        //       width: "100%",
        //     }}
        //   >
        //     <TableHead>
        //       <TableRow>
        //         <TableCell sx={{ width: "20%", textAlign: "center", fontWeight: "bold" }}>
        //           <Typography variant="h6">Sr no.</Typography>
        //         </TableCell>
        //         <TableCell sx={{ width: "20%", textAlign: "center", fontWeight: "bold" }}>
        //           <Typography variant="h6">Department/Cell Name</Typography>
        //         </TableCell>
        //         <TableCell sx={{ width: "60%", textAlign: "center", fontWeight: "bold" }}>
        //           <Typography variant="h6">Details</Typography>
        //         </TableCell>
        //       </TableRow>
        //     </TableHead>
        //     <TableBody>
        //       {basics.map((basic) => (
        //      <TableRow key={basic.id}>
        //      <TableCell
        //        sx={{
        //          textAlign: "center",
        //          padding: "10px",
        //          width: "100px",
        //          whiteSpace: "normal",
        //          wordBreak: "break-word",
        //        }}
        //      >
        //        <Typography variant="h6" fontWeight={300}>
        //          {basic.id}
        //        </Typography>
        //      </TableCell>
           
        //      <TableCell
        //        sx={{
        //          textAlign: "center",
        //          padding: "10px",
        //          width: "150px",
        //          whiteSpace: "normal",
        //          wordBreak: "break-word",
        //        }}
        //      >
        //        <Typography variant="h6" fontWeight={300}>
        //          {basic.Department}
        //        </Typography>
        //      </TableCell>
           
        //      <TableCell
        //        sx={{
        //          textAlign: "left",
        //          padding: "10px",
        //          width: "100%", 
        //          whiteSpace: "normal",
        //          wordBreak: "break-word",
        //        }}
        //      >
        //        <Typography variant="h6" fontWeight={500}  mb={1}>
        //          {basic.Service}
        //        </Typography>

        //        <Typography variant="h6" fontWeight={300} fontSize={".9rem"} mb={3}>
        //          {basic.SevData}
        //        </Typography>

        //        <Typography variant="h6" fontWeight={300} fontSize={".9rem"} mb={3}>
        //          {basic.SevData2}
        //        </Typography>

        //        <Typography variant="h6" fontWeight={300} fontSize={".9rem"} mb={3}>
        //          {basic.SevData3}
        //        </Typography>

        //        <Typography variant="h6" fontWeight={500} mb={1}>
        //          {basic.ContactDetails}
        //        </Typography>

        //        <Typography variant="h6" fontWeight={300} fontSize={".9rem"}>
        //          {basic.conData}
        //        </Typography>

               
        //      </TableCell>
        //    </TableRow>
           
        //       ))}
        //     </TableBody>
        //   </Table>
        // </TableContainer>
      // </BlankCard>               

//                 </Scrollbar>
//             </DialogContent>
//             <DialogActions>
//                 <Button color="primary" onClick={handleClose}>
//                     Close
//                 </Button>
//                 {/* <Button onClick={handleClose}>OK</Button> */}
//             </DialogActions>
//         </Dialog>
//     );
// };

// export default ViewDetailsPopup;









"use client";
import React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogProps,
  IconButton,
  Typography,
  Table,
  TableHead,
  TableCell,
  TableContainer,
  TableRow,
  TableBody,
  Stack,
  CardContent,
  Box,
  Card,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Scrollbar from "@/app/components/custom-scroll/Scrollbar"; // Import Scrollbar
import { IconX } from "@tabler/icons-react";
import BlankCard from "@/app/components/shared/BlankCard";
import { AllEventData, TableType } from "./ViewDetailsData";



interface PopupProps {
  open: boolean;
  handleClose: () => void;
  title: string;
}

const ViewDetailsPopup: React.FC<PopupProps> = ({
  open,
  handleClose,
  title,
}) => {
  const descriptionElementRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const basics: TableType[] = AllEventData;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));



  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      PaperProps={{ sx: { width: "80%", height: "90%" } }}
      maxWidth="lg"
    >
      <DialogTitle sx={{
        textAlign: "center", display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        // fontSize:{xs:"15px"}
        fontSize: { xs: ".9rem" }
      }}>

        {title}

        <IconButton onClick={handleClose} size="small" sx={{ ml: 2 }}>
          <IconX size={24} />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>






        <Scrollbar sx={{ height: "100%" }}>
        <BlankCard>
      {isMobile ? (
        <Box>
          {basics.map((basic) => (
            <Card key={basic.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">Sr no.: {basic.id}</Typography>
                <Typography variant="h6" fontWeight="bold">Department/Cell Name:</Typography>
                <Typography variant="body1" mb={1}>{basic.Department}</Typography>

                <Typography variant="h6" fontWeight="bold">Details:</Typography>
                <Typography variant="body2" fontWeight={500} mb={1}>{basic.Service}</Typography>
                <Typography variant="body2" mb={1}>{basic.SevData}</Typography>
                <Typography variant="body2" mb={1}>{basic.SevData2}</Typography>
                <Typography variant="body2" mb={1}>{basic.SevData3}</Typography>

                <Typography variant="h6" fontWeight="bold" mt={2}>Contact:</Typography>
                <Typography variant="body2" fontWeight={500}>{basic.ContactDetails}</Typography>
                <Typography variant="body2">{basic.conData}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <TableContainer>
        <Table
          aria-label="simple table"
          sx={{
            whiteSpace: "nowrap",
            width: "100%",
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "5%", textAlign: "center", fontWeight: "bold" }}>
                <Typography variant="h6">Sr no.</Typography>
              </TableCell>
              <TableCell sx={{ width: "20%", textAlign: "center", fontWeight: "bold" }}>
                <Typography variant="h6">Department/Cell Name</Typography>
              </TableCell>
              <TableCell sx={{ width: "60%", textAlign: "center", fontWeight: "bold" }}>
                <Typography variant="h6">Details</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {basics.map((basic) => (
           <TableRow key={basic.id}>
           <TableCell
             sx={{
               textAlign: "center",
               padding: "10px",
               width: "100px",
               whiteSpace: "normal",
               wordBreak: "break-word",
             }}
           >
             <Typography variant="h6" fontWeight={300}>
               {basic.id}
             </Typography>
           </TableCell>
         
           <TableCell
             sx={{
               textAlign: "center",
               padding: "10px",
               width: "150px",
               whiteSpace: "normal",
               wordBreak: "break-word",
             }}
           >
             <Typography variant="h6" fontWeight={300}>
               {basic.Department}
             </Typography>
           </TableCell>
         
           <TableCell
             sx={{
               textAlign: "left",
               padding: "10px",
               width: "100%", 
               whiteSpace: "normal",
               wordBreak: "break-word",
             }}
           >
             <Typography variant="h6" fontWeight={500}  mb={1}>
               {basic.Service}
             </Typography>

             <Typography variant="h6" fontWeight={300} fontSize={".9rem"} mb={3}>
               {basic.SevData}
             </Typography>

             <Typography variant="h6" fontWeight={300} fontSize={".9rem"} mb={3}>
               {basic.SevData2}
             </Typography>

             <Typography variant="h6" fontWeight={300} fontSize={".9rem"} mb={3}>
               {basic.SevData3}
             </Typography>

             <Typography variant="h6" fontWeight={500} mb={1}>
               {basic.ContactDetails}
             </Typography>

             <Typography variant="h6" fontWeight={300} fontSize={".9rem"}>
               {basic.conData}
             </Typography>

             
           </TableCell>
         </TableRow>
         
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      )}
    </BlankCard>

        </Scrollbar>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleClose}>
          Close
        </Button>
        {/* <Button onClick={handleClose}>OK</Button> */}
      </DialogActions>
    </Dialog>
  );
};

export default ViewDetailsPopup;
