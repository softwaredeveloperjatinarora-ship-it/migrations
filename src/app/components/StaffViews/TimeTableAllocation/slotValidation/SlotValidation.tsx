// // import React, { useState } from 'react'
// // import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField'
// // import { Autocomplete, Box, Button, CircularProgress, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
// // import ChildCard from '@/app/components/shared/ChildCard';
// // import BlankCard from '@/app/components/shared/BlankCard';
// // import { basicsTableData, TableType } from '../../ProfilePageViews/EmergencyNumber/tableData';
// // import { Icon } from '@iconify/react';



// // const top100Films = [
// //   { label: 'The Shawshank Redemption', year: 1994 },
// //   { label: 'The Godfather', year: 1972 },
// //   { label: 'The Godfather: Part II', year: 1974 },
// //   { label: 'The Dark Knight', year: 2008 },
// //   { label: '12 Angry Men', year: 1957 },
// //   { label: "Schindler's List", year: 1993 },
// //   { label: 'Pulp Fiction', year: 1994 },
// //   {
// //     label: 'The Lord of the Rings: The Return of the King',
// //     year: 2003,
// //   },
// //   { label: 'The Good, the Bad and the Ugly', year: 1966 },
// //   { label: 'Fight Club', year: 1999 },
// //   {
// //     label: 'The Lord of the Rings: The Fellowship of the Ring',
// //     year: 2001,
// //   },
// //   {
// //     label: 'Star Wars: Episode V - The Empire Strikes Back',
// //     year: 1980,
// //   },
// //   { label: 'Forrest Gump', year: 1994 },
// //   { label: 'Inception', year: 2010 },
// //   {
// //     label: 'The Lord of the Rings: The Two Towers',
// //     year: 2002,
// //   },
// //   { label: "One Flew Over the Cuckoo's Nest", year: 1975 },
// //   { label: 'Goodfellas', year: 1990 },
// //   { label: 'The Matrix', year: 1999 },
// //   { label: 'Seven Samurai', year: 1954 },
// //   {
// //     label: 'Star Wars: Episode IV - A New Hope',
// //     year: 1977,
// //   },
// //   { label: 'City of God', year: 2002 },
// //   { label: 'Se7en', year: 1995 },
// //   { label: 'The Silence of the Lambs', year: 1991 },
// //   { label: "It's a Wonderful Life", year: 1946 },
// //   { label: 'Life Is Beautiful', year: 1997 },
// //   { label: 'The Usual Suspects', year: 1995 },
// //   { label: 'Léon: The Professional', year: 1994 },
// //   { label: 'Spirited Away', year: 2001 },
// //   { label: 'Saving Private Ryan', year: 1998 },
// //   { label: 'Once Upon a Time in the West', year: 1968 },
// //   { label: 'American History X', year: 1998 },
// //   { label: 'Interstellar', year: 2014 },
// //   { label: 'Casablanca', year: 1942 },
// //   { label: 'City Lights', year: 1931 },
// //   { label: 'Psycho', year: 1960 },
// //   { label: 'The Green Mile', year: 1999 },
// //   { label: 'The Intouchables', year: 2011 },
// //   { label: 'Modern Times', year: 1936 },
// //   { label: 'Raiders of the Lost Ark', year: 1981 },
// //   { label: 'Rear Window', year: 1954 },
// //   { label: 'The Pianist', year: 2002 },
// //   { label: 'The Departed', year: 2006 },
// //   { label: 'Terminator 2: Judgment Day', year: 1991 },
// //   { label: 'Back to the Future', year: 1985 },
// //   { label: 'Whiplash', year: 2014 },
// //   { label: 'Gladiator', year: 2000 },
// //   { label: 'Memento', year: 2000 },
// //   { label: 'The Prestige', year: 2006 },
// //   { label: 'The Lion King', year: 1994 },
// //   { label: 'Apocalypse Now', year: 1979 },
// //   { label: 'Alien', year: 1979 },
// //   { label: 'Sunset Boulevard', year: 1950 },
// //   {
// //     label: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
// //     year: 1964,
// //   },
// //   { label: 'The Great Dictator', year: 1940 },
// //   { label: 'Cinema Paradiso', year: 1988 },
// //   { label: 'The Lives of Others', year: 2006 },
// //   { label: 'Grave of the Fireflies', year: 1988 },
// //   { label: 'Paths of Glory', year: 1957 },
// //   { label: 'Django Unchained', year: 2012 },
// //   { label: 'The Shining', year: 1980 },
// //   { label: 'WALL·E', year: 2008 },
// //   { label: 'American Beauty', year: 1999 },
// //   { label: 'The Dark Knight Rises', year: 2012 },
// //   { label: 'Princess Mononoke', year: 1997 },
// //   { label: 'Aliens', year: 1986 },
// //   { label: 'Oldboy', year: 2003 },
// //   { label: 'Once Upon a Time in America', year: 1984 },
// //   { label: 'Witness for the Prosecution', year: 1957 },
// //   { label: 'Das Boot', year: 1981 },
// //   { label: 'Citizen Kane', year: 1941 },
// //   { label: 'North by Northwest', year: 1959 },
// //   { label: 'Vertigo', year: 1958 },
// //   {
// //     label: 'Star Wars: Episode VI - Return of the Jedi',
// //     year: 1983,
// //   },
// //   { label: 'Reservoir Dogs', year: 1992 },
// //   { label: 'Braveheart', year: 1995 },
// //   { label: 'M', year: 1931 },
// //   { label: 'Requiem for a Dream', year: 2000 },
// //   { label: 'Amélie', year: 2001 },
// //   { label: 'A Clockwork Orange', year: 1971 },
// //   { label: 'Like Stars on Earth', year: 2007 },
// //   { label: 'Taxi Driver', year: 1976 },
// //   { label: 'Lawrence of Arabia', year: 1962 },
// //   { label: 'Double Indemnity', year: 1944 },
// //   {
// //     label: 'Eternal Sunshine of the Spotless Mind',
// //     year: 2004,
// //   },
// //   { label: 'Amadeus', year: 1984 },
// //   { label: 'To Kill a Mockingbird', year: 1962 },
// //   { label: 'Toy Story 3', year: 2010 },
// //   { label: 'Logan', year: 2017 },
// //   { label: 'Full Metal Jacket', year: 1987 },
// //   { label: 'Dangal', year: 2016 },
// //   { label: 'The Sting', year: 1973 },
// //   { label: '2001: A Space Odyssey', year: 1968 },
// //   { label: "Singin' in the Rain", year: 1952 },
// //   { label: 'Toy Story', year: 1995 },
// //   { label: 'Bicycle Thieves', year: 1948 },
// //   { label: 'The Kid', year: 1921 },
// //   { label: 'Inglourious Basterds', year: 2009 },
// //   { label: 'Snatch', year: 2000 },
// //   { label: '3 Idiots', year: 2009 },
// //   { label: 'Monty Python and the Holy Grail', year: 1975 },
// // ];


// // const SlotValidation = () => {

// //    const basics: TableType[] = basicsTableData;


// //      const [showTable, setShowTable] = useState(false);
// //          const [loading, setLoading] = useState<boolean>(false);

// //       const handleFetch = () => {
// //            setLoading(true);
// //            setShowTable(false);


// //            setTimeout(() => {
// //                setLoading(false);
// //                setShowTable(true);
// //            }, 1000);
// //        };


// //   return (
// //     <>
// //       <Box sx={{ marginBottom: "20px" }}>
// //         <ChildCard >
// //           <Box sx={{ display: { lg: "flex" }, justifyContent: "space-between" }}>
// //             <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginBottom: { xs: "10px" } }}>

// //               <Typography
// //                 variant="h6"
// //                 sx={{
// //                   fontSize: "14px",
// //                   whiteSpace: "nowrap",
// //                   display: { xs: "flex" },
// //                   justifyContent: { xs: "center" },
// //                 }}
// //               >
// //                 UID:
// //               </Typography>
// // {/* <Autocomplete
// //   disablePortal
// //   id="combo-box-demo"
// //   options={top100Films}
// //   // fullWidth
// //   sx={{ width: 170 }}
// //   size="small"
// //   renderInput={(params) => (
// //     <CustomTextField {...params} placeholder="Select movie" aria-label="Select movie" />
// //   )}
// // /> */}


// //  <Autocomplete
// //                 disablePortal
// //                 id="uid-autocomplete"
// //                 options={top100Films} // empty or numeric options if needed
// //                 freeSolo // allow manual input
// //                 sx={{ width: 170 }}
// //                 size="small"
// //                 filterOptions={(x) => x} // disable built-in filtering
// //                 renderInput={(params) => (
// //                   <CustomTextField
// //                     {...params}
// //                     placeholder="Enter 5-digit UID"
// //                     inputProps={{
// //                       ...params.inputProps,
// //                       inputMode: "numeric",
// //                       pattern: "[0-9]*",
// //                       maxLength: 6,
// //                       onInput: (e: { target: { value: string; }; }) => {
// //                         e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 5);
// //                       },
// //                     }}
// //                   />
// //                 )}
// //               />



// //             </Box>



// //             <Box sx={{ display: "flex", alignItems: "center", gap: 1, margin: "0px" }}>
// //               <Typography
// //                 variant="h6"
// //                 sx={{
// //                   fontSize: "14px",
// //                   whiteSpace: "nowrap",
// //                   display: { xs: "flex" },
// //                   justifyContent: { xs: "center" },
// //                 }}
// //               >
// //                 Cource Code :
// //               </Typography>
// //               <CustomTextField
// //                 // id="error-text-input"
// //                 // variant="outlined"
// //                 // fullWidth
// //                 sx={{ width: 150 }}
// //                 size="small"
// //                 required
// //               // error
// //               // helperText="Incorrect entry."
// //               />
// //             </Box>



// //             <Box sx={{ position: 'relative', display: { lg: 'flex', xs: 'block' }, justifyContent: { lg: 'space-between' } }}>

// //                           {/* ... Start Date and End Date Boxes here ... */}

// //                           {/* Button at top-right in mobile */}
// //                           <Box
// //                             sx={{
// //                               position: { xs: 'absolute', lg: 'static' },
// //                               top: { xs: "-105px" },
// //                               right: { xs: "-20px" },
// //                               display: 'flex',
// //                               alignItems: 'center',
// //                               justifyContent: 'center',
// //                               zIndex: 1 // optional, in case overlapping issues
// //                             }}
// //                           >
// //                             <Button variant="outlined">
// //                               <Icon icon="line-md:download-loop" width="25" height="25" />
// //                             </Button>
// //                           </Box>

// //                         </Box>


// //           </Box>



// //           <Box sx={{ marginTop: "10px", display: "flex", alignItems: "center", gap: 1, marginLeft: "0px" }}>


// //             <Typography
// //               variant="h6"
// //               sx={{
// //                 fontSize: "14px",
// //                 whiteSpace: "nowrap",
// //                 display: { xs: "flex" },
// //                 justifyContent: { xs: "center" },
// //               }}
// //             >
// //               Term ID:
// //             </Typography>

// //             <Autocomplete
// //               multiple
// //               fullWidth
// //               // sx={{ width:  {lg:950,xs:240} }}
// //               size="small"
// //               id="tags-outlined"
// //               options={top100Films}
// //               getOptionLabel={(option) => option.label}
// //               // defaultValue={[top100Films[13]]}
// //               filterSelectedOptions
// //               renderInput={(params) => (
// //                 <CustomTextField {...params} placeholder="Select" aria-label="Select" />
// //               )}
// //             />
// //           </Box>



// //           <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, marginTop: "10px" }}>

// //             <Button variant="contained" onClick={handleFetch}>Validate</Button>

// //           </Box>

// //         </ChildCard>
// //       </Box>





// //  {loading ? (
// //                 <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
// //                     <CircularProgress />
// //                 </Box>
// //             ) :

// //                 (showTable && (



// //  <BlankCard>
// //                 <TableContainer>
// //                     <Table
// //                         aria-label="simple table"
// //                         sx={{
// //                             whiteSpace: "nowrap",
// //                             width: "100%",
// //                         }}
// //                     >
// //                         <TableHead>
// //                             <TableRow>
// //                                 <TableCell sx={{ fontWeight: "bold" }}>
// //                                     <Typography variant="h6">Course Code</Typography>
// //                                 </TableCell>
// //                                 <TableCell sx={{ fontWeight: "bold" }}>
// //                                     <Typography variant="h6">Course Name</Typography>
// //                                 </TableCell>
// //                                 <TableCell sx={{ fontWeight: "bold" }}>
// //                                     <Typography variant="h6">Start date</Typography>
// //                                 </TableCell>
// //                                 <TableCell sx={{ fontWeight: "bold" }}>
// //                                     <Typography variant="h6">End Date</Typography>
// //                                 </TableCell>
// //                                 <TableCell sx={{ fontWeight: "bold" }}>
// //                                     <Typography variant="h6">Grp</Typography>
// //                                 </TableCell>
// //                                 <TableCell sx={{ fontWeight: "bold" }}>
// //                                     <Typography variant="h6">Lectures</Typography>
// //                                 </TableCell>
// //                                 <TableCell sx={{ fontWeight: "bold" }}>
// //                                     <Typography variant="h6">Tutorial</Typography>
// //                                 </TableCell>
// //                                 <TableCell sx={{ fontWeight: "bold" }}>
// //                                     <Typography variant="h6">Practical</Typography>
// //                                 </TableCell>
// //                                 <TableCell sx={{ fontWeight: "bold" }}>
// //                                     <Typography variant="h6">RefactoredCnt</Typography>
// //                                 </TableCell>
// //                             </TableRow>
// //                         </TableHead>
// //                         <TableBody>
// //                             {basics.map((basic) => (
// //                                 <TableRow key={basic.id}>
// //                                     {/* Hostel Column */}
// //                                     <TableCell sx={{ padding: "10px" }}>
// //                                         <Typography variant="h6" fontWeight={400}>{basic.name}</Typography>
// //                                     </TableCell>

// //                                     {/* Block Column */}
// //                                     <TableCell sx={{ padding: "10px" }}>
// //                                         <Stack direction="column" spacing={1} >
// //                                             {basic.teams?.map((team) => (
// //                                                 <Typography
// //                                                     key={team.id}
// //                                                     variant="h6"
// //                                                     fontWeight={400}
// //                                                     sx={{
// //                                                         bgcolor: team.color,
// //                                                         padding: "5px 10px",
// //                                                         borderRadius: "5px",
// //                                                         minWidth: "50px",
// //                                                     }}
// //                                                 >
// //                                                     {team.text}
// //                                                 </Typography>
// //                                             ))}
// //                                         </Stack>
// //                                     </TableCell>

// //                                     {/* Landline Number Column */}
// //                                     <TableCell sx={{ padding: "10px" }}>
// //                                         <Stack direction="column" spacing={1}>
// //                                             {Array.isArray(basic.pname) ? (
// //                                                 basic.pname.map((team) => (
// //                                                     <Typography
// //                                                         key={team.id}
// //                                                         variant="h6"
// //                                                         fontWeight={400}
// //                                                         sx={{
// //                                                             minWidth: "50px",
// //                                                             padding: "5px",
// //                                                         }}
// //                                                     >
// //                                                         {basic.name}
// //                                                     </Typography>
// //                                                 ))
// //                                             ) : (
// //                                                 <Typography variant="h6" fontWeight={400}>{basic.pname}</Typography>
// //                                             )}
// //                                         </Stack>
// //                                     </TableCell>

// //                                     {/* Mobile Number Column */}
// //                                     <TableCell sx={{ padding: "10px" }}>
// //                                         <Typography variant="h6" fontWeight={400}>{basic.name}</Typography>
// //                                     </TableCell>



// //                                     <TableCell sx={{ padding: "10px" }}>
// //                                         <Typography variant="h6" fontWeight={400}>{basic.name}</Typography>
// //                                     </TableCell>

// //                                     <TableCell sx={{ padding: "10px" }}>
// //                                         <Typography variant="h6" fontWeight={400}>{basic.name}</Typography>
// //                                     </TableCell>

// //                                     <TableCell sx={{ padding: "10px" }}>
// //                                         <Typography variant="h6" fontWeight={400}>{basic.name}</Typography>
// //                                     </TableCell>

// //                                     <TableCell sx={{ padding: "10px" }}>
// //                                         <Typography variant="h6" fontWeight={400}>{basic.name}</Typography>
// //                                     </TableCell>

// //                                     <TableCell sx={{ padding: "10px" }}>
// //                                         <Typography variant="h6" fontWeight={400}>{basic.name}</Typography>
// //                                     </TableCell>


// //                                 </TableRow>
// //                             ))}
// //                         </TableBody>
// //                     </Table>
// //                 </TableContainer>
// //             </BlankCard>
// // ))}


// //     </>
// //   )
// // }

// // export default SlotValidation



















// import React, { useState } from 'react'
// import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField'
// import { Autocomplete, Box, Button, CircularProgress, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
// import ChildCard from '@/app/components/shared/ChildCard';
// import BlankCard from '@/app/components/shared/BlankCard';
// import { basicsTableData, TableType } from '../../ProfilePageViews/EmergencyNumber/tableData';
// import { Icon } from '@iconify/react';



// const top100Films = [
//   { label: 'The Shawshank Redemption', year: 1994 },
//   { label: 'The Godfather', year: 1972 },
//   { label: 'The Godfather: Part II', year: 1974 },
//   { label: 'The Dark Knight', year: 2008 },
//   { label: '12 Angry Men', year: 1957 },
//   { label: "Schindler's List", year: 1993 },
//   { label: 'Pulp Fiction', year: 1994 },
//   {
//     label: 'The Lord of the Rings: The Return of the King',
//     year: 2003,
//   },
//   { label: 'The Good, the Bad and the Ugly', year: 1966 },
//   { label: 'Fight Club', year: 1999 },
//   {
//     label: 'The Lord of the Rings: The Fellowship of the Ring',
//     year: 2001,
//   },
//   {
//     label: 'Star Wars: Episode V - The Empire Strikes Back',
//     year: 1980,
//   },
//   { label: 'Forrest Gump', year: 1994 },
//   { label: 'Inception', year: 2010 },
//   {
//     label: 'The Lord of the Rings: The Two Towers',
//     year: 2002,
//   },
//   { label: "One Flew Over the Cuckoo's Nest", year: 1975 },
//   { label: 'Goodfellas', year: 1990 },
//   { label: 'The Matrix', year: 1999 },
//   { label: 'Seven Samurai', year: 1954 },
//   {
//     label: 'Star Wars: Episode IV - A New Hope',
//     year: 1977,
//   },
//   { label: 'City of God', year: 2002 },
//   { label: 'Se7en', year: 1995 },
//   { label: 'The Silence of the Lambs', year: 1991 },
//   { label: "It's a Wonderful Life", year: 1946 },
//   { label: 'Life Is Beautiful', year: 1997 },
//   { label: 'The Usual Suspects', year: 1995 },
//   { label: 'Léon: The Professional', year: 1994 },
//   { label: 'Spirited Away', year: 2001 },
//   { label: 'Saving Private Ryan', year: 1998 },
//   { label: 'Once Upon a Time in the West', year: 1968 },
//   { label: 'American History X', year: 1998 },
//   { label: 'Interstellar', year: 2014 },
//   { label: 'Casablanca', year: 1942 },
//   { label: 'City Lights', year: 1931 },
//   { label: 'Psycho', year: 1960 },
//   { label: 'The Green Mile', year: 1999 },
//   { label: 'The Intouchables', year: 2011 },
//   { label: 'Modern Times', year: 1936 },
//   { label: 'Raiders of the Lost Ark', year: 1981 },
//   { label: 'Rear Window', year: 1954 },
//   { label: 'The Pianist', year: 2002 },
//   { label: 'The Departed', year: 2006 },
//   { label: 'Terminator 2: Judgment Day', year: 1991 },
//   { label: 'Back to the Future', year: 1985 },
//   { label: 'Whiplash', year: 2014 },
//   { label: 'Gladiator', year: 2000 },
//   { label: 'Memento', year: 2000 },
//   { label: 'The Prestige', year: 2006 },
//   { label: 'The Lion King', year: 1994 },
//   { label: 'Apocalypse Now', year: 1979 },
//   { label: 'Alien', year: 1979 },
//   { label: 'Sunset Boulevard', year: 1950 },
//   {
//     label: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
//     year: 1964,
//   },
//   { label: 'The Great Dictator', year: 1940 },
//   { label: 'Cinema Paradiso', year: 1988 },
//   { label: 'The Lives of Others', year: 2006 },
//   { label: 'Grave of the Fireflies', year: 1988 },
//   { label: 'Paths of Glory', year: 1957 },
//   { label: 'Django Unchained', year: 2012 },
//   { label: 'The Shining', year: 1980 },
//   { label: 'WALL·E', year: 2008 },
//   { label: 'American Beauty', year: 1999 },
//   { label: 'The Dark Knight Rises', year: 2012 },
//   { label: 'Princess Mononoke', year: 1997 },
//   { label: 'Aliens', year: 1986 },
//   { label: 'Oldboy', year: 2003 },
//   { label: 'Once Upon a Time in America', year: 1984 },
//   { label: 'Witness for the Prosecution', year: 1957 },
//   { label: 'Das Boot', year: 1981 },
//   { label: 'Citizen Kane', year: 1941 },
//   { label: 'North by Northwest', year: 1959 },
//   { label: 'Vertigo', year: 1958 },
//   {
//     label: 'Star Wars: Episode VI - Return of the Jedi',
//     year: 1983,
//   },
//   { label: 'Reservoir Dogs', year: 1992 },
//   { label: 'Braveheart', year: 1995 },
//   { label: 'M', year: 1931 },
//   { label: 'Requiem for a Dream', year: 2000 },
//   { label: 'Amélie', year: 2001 },
//   { label: 'A Clockwork Orange', year: 1971 },
//   { label: 'Like Stars on Earth', year: 2007 },
//   { label: 'Taxi Driver', year: 1976 },
//   { label: 'Lawrence of Arabia', year: 1962 },
//   { label: 'Double Indemnity', year: 1944 },
//   {
//     label: 'Eternal Sunshine of the Spotless Mind',
//     year: 2004,
//   },
//   { label: 'Amadeus', year: 1984 },
//   { label: 'To Kill a Mockingbird', year: 1962 },
//   { label: 'Toy Story 3', year: 2010 },
//   { label: 'Logan', year: 2017 },
//   { label: 'Full Metal Jacket', year: 1987 },
//   { label: 'Dangal', year: 2016 },
//   { label: 'The Sting', year: 1973 },
//   { label: '2001: A Space Odyssey', year: 1968 },
//   { label: "Singin' in the Rain", year: 1952 },
//   { label: 'Toy Story', year: 1995 },
//   { label: 'Bicycle Thieves', year: 1948 },
//   { label: 'The Kid', year: 1921 },
//   { label: 'Inglourious Basterds', year: 2009 },
//   { label: 'Snatch', year: 2000 },
//   { label: '3 Idiots', year: 2009 },
//   { label: 'Monty Python and the Holy Grail', year: 1975 },
// ];


// const SlotValidation = () => {

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
//           <Box sx={{ p: 0 }}>

//             <Grid container spacing={2} alignItems="center" sx={{ marginBottom: 2 }}>
//               <Grid size={{ xs: 12, sm: 4, md: 3, lg: 5 }}>
//                 <TextField
//                   label="UID"
//                   // value={threshold}
//                   // onChange={(e) => handleNumericInput(e.target.value, setThreshold)}
//                   size="small"
//                   required
//                   fullWidth
//                   inputProps={{ maxLength: 5, inputMode: "numeric", pattern: "[0-9]*" }}
//                   placeholder="Enter 5-digit UID"
//                 />

//               </Grid>



//               <Grid size={{ xs: 12, sm: 4, md: 3, lg: 5 }}>
//                 <TextField
//                   label="Cource Code "
//                   // value={threshold}
//                   // onChange={(e) => handleNumericInput(e.target.value, setThreshold)}
//                   size="small"
//                   required
//                   fullWidth
//                   inputProps={{ maxLength: 5, inputMode: "numeric", pattern: "[0-9]*" }}
//                 />

//               </Grid>


//               <Grid size={{ xs: 12, sm: 4, md: 3, lg: 2 }}>
//                 <Button variant="outlined">
//                   <Icon icon="line-md:download-loop" width="25" height="25" />
//                 </Button>

//               </Grid>



//             </Grid>

//           </Box>



//           <Grid container spacing={2} alignItems="center" sx={{ mt: 0 }}>


//             <Grid size={{ xs: 12, sm: 6, md: 3, lg: 5 }}>
//               <TextField
//                 label="Term ID"
//                 // value={termID}
//                 // onChange={(e) => handleTermIDNumericInput(e.target.value, settermID)}
//                 size="small"
//                 required
//                 fullWidth
//                 inputProps={{
//                   maxLength: 30,
//                   inputMode: "numeric",
//                   pattern: "[0-9,]*",
//                 }}
//                 placeholder="e.g., 124251, 125263"
//               />

//             </Grid>

//             <Grid size={{ xs: 12, sm: 4, md: 3, lg: 3 }}>

//               <Button variant="contained" fullWidth onClick={handleFetch}>Validate</Button>
//             </Grid>


//           </Grid>


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

// export default SlotValidation
