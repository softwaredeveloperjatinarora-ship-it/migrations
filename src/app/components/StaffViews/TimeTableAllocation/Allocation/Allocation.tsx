// import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField'
// import BlankCard from '@/app/components/shared/BlankCard';
// import ChildCard from '@/app/components/shared/ChildCard'
// import { Autocomplete, Box, Button, CircularProgress, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
// import React, { useState } from 'react'
// import { basicsTableData, EnTableType, TableType, WomenHelpCenter } from '../../ProfilePageViews/EmergencyNumber/tableData';
// import { Icon } from '@iconify/react';



// const top100Films = [
//   { title: 'The Shawshank Redemption', year: 1994 },
//   { title: 'The Godfather', year: 1972 },
//   { title: 'The Godfather: Part II', year: 1974 },
//   { title: 'The Dark Knight', year: 2008 },
//   { title: '12 Angry Men', year: 1957 },
//   { title: "Schindler's List", year: 1993 },
//   { title: 'Pulp Fiction', year: 1994 },
//   {
//     title: 'The Lord of the Rings: The Return of the King',
//     year: 2003,
//   },
//   { title: 'The Good, the Bad and the Ugly', year: 1966 },
//   { title: 'Fight Club', year: 1999 },
//   {
//     title: 'The Lord of the Rings: The Fellowship of the Ring',
//     year: 2001,
//   },
//   {
//     title: 'Star Wars: Episode V - The Empire Strikes Back',
//     year: 1980,
//   },
//   { title: 'Forrest Gump', year: 1994 },
//   { title: 'Inception', year: 2010 },
//   {
//     title: 'The Lord of the Rings: The Two Towers',
//     year: 2002,
//   },
//   { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
//   { title: 'Goodfellas', year: 1990 },
//   { title: 'The Matrix', year: 1999 },
//   { title: 'Seven Samurai', year: 1954 },
//   {
//     title: 'Star Wars: Episode IV - A New Hope',
//     year: 1977,
//   },
//   { title: 'City of God', year: 2002 },
//   { title: 'Se7en', year: 1995 },
//   { title: 'The Silence of the Lambs', year: 1991 },
//   { title: "It's a Wonderful Life", year: 1946 },
//   { title: 'Life Is Beautiful', year: 1997 },
//   { title: 'The Usual Suspects', year: 1995 },
//   { title: 'Léon: The Professional', year: 1994 },
//   { title: 'Spirited Away', year: 2001 },
//   { title: 'Saving Private Ryan', year: 1998 },
//   { title: 'Once Upon a Time in the West', year: 1968 },
//   { title: 'American History X', year: 1998 },
//   { title: 'Interstellar', year: 2014 },
// ];

// const Allocation = () => {

//   const basics: TableType[] = basicsTableData;


//   const [showTable, setShowTable] = useState(false);
//   const [loading, setLoading] = useState<boolean>(false);

//   const handleFetch = () => {
//     setLoading(true);
//     setShowTable(false);


//     setTimeout(() => {
//       setLoading(false);
//       setShowTable(true);
//     }, 1000);
//   };
//   return (
//     <>
//       <Box sx={{ marginBottom: "20px" }}>
//         <ChildCard>
//           <Box >

//             <Grid container spacing={2} alignItems="center" sx={{ marginBottom: 0 }}>
//               <Grid size={{ xs: 12, sm: 4, md: 3, lg: 6 }}>
//                 <TextField
//                   label="Term ID"
//                   // value={termID}
//                   // onChange={(e) => handleTermIDNumericInput(e.target.value, settermID)}
//                   size="small"
//                   required
//                   fullWidth
//                   inputProps={{
//                     maxLength: 30,
//                     inputMode: "numeric",
//                     pattern: "[0-9,]*",
//                   }}
//                   placeholder="e.g., 124251, 125263"
//                 />
//               </Grid>


//  <Grid size={{ xs: 12, sm: 4, md: 3, lg: 3 }}>
//                 <Button variant="contained" fullWidth onClick={handleFetch}>Save</Button>

//  </Grid>

//   <Grid size={{ xs: 12, sm: 4, md: 3, lg: 3 }}>
//       <Button variant="outlined">
//                 <Icon icon="line-md:download-loop" width="25" height="25" />
//               </Button>
//   </Grid>


//             </Grid>


//             {/* <Box sx={{ display: { lg: "flex" }, alignItems: "center", gap: 1, marginRight: { lg: "10px" }, }}> */}
//             {/* <Typography
//                 variant="h6"
//                 sx={{
//                   fontSize: "14px",
//                   whiteSpace: "nowrap",
//                   display: { xs: "flex" },
//                   justifyContent: { xs: "center" },

//                 }}
//               >
//                 Term ID:
//               </Typography>
//               <Autocomplete
//                 multiple
//                 fullWidth
//                 // sx={{ width: { lg: 928 } }}
//                 size="small"
//                 id="tags-outlined"
//                 options={top100Films}
//                 getOptionLabel={(option) => option.title}
//                 // defaultValue={[top100Films[13]]}
//                 filterSelectedOptions
//                 renderInput={(params) => (
//                   <CustomTextField {...params} placeholder="Select" aria-label="Select" />
//                 )}
//               /> */}
//             {/* </Box> */}



//           </Box>


//           {/* <Box sx={{ marginTop: "10px", display: 'flex', justifyContent: { lg: 'space-between', xs: 'center' }, alignItems: 'center', gap: 1 }}>



//             <Box sx={{ display: "flex", justifyContent: "center" }}>
//               <Button variant="contained" onClick={handleFetch}>Save</Button>
//             </Box>


//             <Box
//               sx={{
//                 // position: { xs: 'absolute', lg: 'static' },
//                 // top: { xs: "-83px" },
//                 // right: { xs: "-23px" },
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 // zIndex: 1 // optional, in case overlapping issues
//               }}
//             >
//               <Button variant="outlined">
//                 <Icon icon="line-md:download-loop" width="25" height="25" />
//               </Button>
//             </Box>





//           </Box> */}

//         </ChildCard>

//       </Box>



//       {loading ? (
//         <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
//           <CircularProgress />
//         </Box>
//       ) :

//         (showTable && (


//           <BlankCard>
//             <TableContainer>
//               <Table
//                 aria-label="simple table"
//                 sx={{
//                   whiteSpace: "nowrap",
//                   width: "100%",
//                 }}
//               >
//                 <TableHead>
//                   <TableRow>
//                     <TableCell sx={{ fontWeight: "bold" }}>
//                       <Typography variant="h6">Course Code</Typography>
//                     </TableCell>
//                     <TableCell sx={{ fontWeight: "bold" }}>
//                       <Typography variant="h6">Course Name</Typography>
//                     </TableCell>
//                     <TableCell sx={{ fontWeight: "bold" }}>
//                       <Typography variant="h6">Start date</Typography>
//                     </TableCell>
//                     <TableCell sx={{ fontWeight: "bold" }}>
//                       <Typography variant="h6">End Date</Typography>
//                     </TableCell>
//                     <TableCell sx={{ fontWeight: "bold" }}>
//                       <Typography variant="h6">Grp</Typography>
//                     </TableCell>
//                     <TableCell sx={{ fontWeight: "bold" }}>
//                       <Typography variant="h6">Lectures</Typography>
//                     </TableCell>
//                     <TableCell sx={{ fontWeight: "bold" }}>
//                       <Typography variant="h6">Tutorial</Typography>
//                     </TableCell>
//                     <TableCell sx={{ fontWeight: "bold" }}>
//                       <Typography variant="h6">Practical</Typography>
//                     </TableCell>
//                     <TableCell sx={{ fontWeight: "bold" }}>
//                       <Typography variant="h6">RefactoredCnt</Typography>
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {basics.map((basic) => (
//                     <TableRow key={basic.id}>
//                       {/* Hostel Column */}
//                       <TableCell sx={{ padding: "10px" }}>
//                         <Typography variant="h6" fontWeight={400}>{basic.name}</Typography>
//                       </TableCell>

//                       {/* Block Column */}
//                       <TableCell sx={{ padding: "10px" }}>
//                         <Stack direction="column" spacing={1} >
//                           {basic.teams?.map((team) => (
//                             <Typography
//                               key={team.id}
//                               variant="h6"
//                               fontWeight={400}
//                               sx={{
//                                 bgcolor: team.color,
//                                 padding: "5px 10px",
//                                 borderRadius: "5px",
//                                 minWidth: "50px",
//                               }}
//                             >
//                               {team.text}
//                             </Typography>
//                           ))}
//                         </Stack>
//                       </TableCell>

//                       {/* Landline Number Column */}
//                       <TableCell sx={{ padding: "10px" }}>
//                         <Stack direction="column" spacing={1}>
//                           {Array.isArray(basic.pname) ? (
//                             basic.pname.map((team) => (
//                               <Typography
//                                 key={team.id}
//                                 variant="h6"
//                                 fontWeight={400}
//                                 sx={{
//                                   minWidth: "50px",
//                                   padding: "5px",
//                                 }}
//                               >
//                                 {basic.name}
//                               </Typography>
//                             ))
//                           ) : (
//                             <Typography variant="h6" fontWeight={400}>{basic.pname}</Typography>
//                           )}
//                         </Stack>
//                       </TableCell>

//                       {/* Mobile Number Column */}
//                       <TableCell sx={{ padding: "10px" }}>
//                         <Typography variant="h6" fontWeight={400}>{basic.name}</Typography>
//                       </TableCell>



//                       <TableCell sx={{ padding: "10px" }}>
//                         <Typography variant="h6" fontWeight={400}>{basic.name}</Typography>
//                       </TableCell>

//                       <TableCell sx={{ padding: "10px" }}>
//                         <Typography variant="h6" fontWeight={400}>{basic.name}</Typography>
//                       </TableCell>

//                       <TableCell sx={{ padding: "10px" }}>
//                         <Typography variant="h6" fontWeight={400}>{basic.name}</Typography>
//                       </TableCell>

//                       <TableCell sx={{ padding: "10px" }}>
//                         <Typography variant="h6" fontWeight={400}>{basic.name}</Typography>
//                       </TableCell>

//                       <TableCell sx={{ padding: "10px" }}>
//                         <Typography variant="h6" fontWeight={400}>{basic.name}</Typography>
//                       </TableCell>


//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </BlankCard>
//         ))}
//     </>
//   )
// }

// export default Allocation
