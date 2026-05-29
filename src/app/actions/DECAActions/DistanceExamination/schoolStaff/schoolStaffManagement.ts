// "use client";
// import React, { useEffect, useState } from 'react';
// import { useFormik } from 'formik';
// import * as yup from 'yup';
// import { useSelector, useDispatch } from '@/store/hooks';
// import { AppState } from '@/store/store';
// import {
//   SelectContact,
//   fetchContacts,
//   DeleteContact,
//   toggleStarredContact,
//   SearchContact
// } from '@/store/Contacts/ContactSlice';

// // MUI Components
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Fab from '@mui/material/Fab';
// import InputAdornment from '@mui/material/InputAdornment';
// import TextField from '@mui/material/TextField';
// import Avatar from '@mui/material/Avatar';
// import List from '@mui/material/List';
// import ListItemAvatar from '@mui/material/ListItemAvatar';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemText from '@mui/material/ListItemText';
// import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';
// import Card from '@mui/material/Card';
// import { useTheme } from '@mui/material/styles';

// // Icons
// import { IconMenu2, IconSearch, IconStar, IconTrash } from '@tabler/icons-react';

// // Custom Components
// import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
// import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
// import Scrollbar from '@/app/components/custom-scroll/Scrollbar';

// // Types
// import type { ContactType } from '@/app/dashboard/(DashboardLayout)/types/apps/contact';

// // Validation Schema
// const validationSchema = yup.object().shape({
//   name: yup.string().required("Name is required").min(3, "Name must be at least 3 characters"),
//   phone: yup
//     .string()
//     .required("Phone number is required")
//     .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
// });

// // Contact List Item Component
// const ContactListItem = ({
//   onContactClick,
//   onStarredClick,
//   onDeleteClick,
//   id,
//   firstname,
//   lastname,
//   image,
//   phone,
//   starred,
//   active,
// }) => {
//   const theme = useTheme();
//   const warningColor = theme.palette.warning.main;

//   return (
//     <ListItemButton sx={{ mb: 1 }} selected={active}>
//       <ListItemAvatar>
//         <Avatar alt={image} src={image} />
//       </ListItemAvatar>
//       <ListItemText>
//         <Stack direction="row" gap="10px" alignItems="center">
//           <Box mr="auto" onClick={onContactClick}>
//             <Typography variant="subtitle1" noWrap fontWeight={600} sx={{ maxWidth: '150px' }}>
//               {firstname} {lastname}
//             </Typography>
//             <Typography variant="body2" color="text.secondary" noWrap>
//               {phone}
//             </Typography>
//           </Box>
//           <IconStar
//             onClick={onStarredClick}
//             size="16"
//             stroke={1.5}
//             style={{ fill: starred ? warningColor : '', stroke: starred ? warningColor : '' }}
//           />
//           <IconTrash onClick={onDeleteClick} size="16" stroke={1.5} />
//         </Stack>
//       </ListItemText>
//     </ListItemButton>
//   );
// };

// // Search Component
// const SearchComponent = ({ onMenuClick }) => {
//   const searchTerm = useSelector((state: AppState) => state.contactsReducer.contactSearch);
//   const dispatch = useDispatch();

//   return (
//     <Box display="flex" sx={{ p: 2 }}>
//       <Fab
//         onClick={onMenuClick}
//         color="primary"
//         size="small"
//         sx={{ mr: 1, flexShrink: '0', display: { xs: 'block', lineHeight: '10px', lg: 'none' } }}
//       >
//         <IconMenu2 width="16" />
//       </Fab>
//       <TextField
//         id="outlined-basic"
//         fullWidth
//         size="small"
//         value={searchTerm}
//         placeholder="Search Contacts"
//         variant="outlined"
//         onChange={(e) => dispatch(SearchContact(e.target.value))}
//         InputProps={{
//           endAdornment: (
//             <InputAdornment position="end">
//               <IconSearch size={'16'} />
//             </InputAdornment>
//           ),
//         }}
//       />
//     </Box>
//   );
// };

// // Contact List Component
// const ContactListComponent = ({ onRightSidebarOpen }) => {
//   const dispatch = useDispatch();
  
//   useEffect(() => {
//     dispatch(fetchContacts());
//   }, [dispatch]);

//   const getVisibleContacts = (
//     contacts: ContactType[],
//     filter: string,
//     contactSearch: string
//   ) => {
//     const search = contactSearch.toLowerCase();
    
//     switch (filter) {
//       case "show_all":
//         return contacts.filter(
//           (c) => !c.deleted && c.firstname.toLowerCase().includes(search)
//         );
//       case "frequent_contact":
//         return contacts.filter(
//           (c) =>
//             !c.deleted &&
//             c.frequentlycontacted &&
//             c.firstname.toLowerCase().includes(search)
//         );
//       case "starred_contact":
//         return contacts.filter(
//           (c) =>
//             !c.deleted &&
//             c.starred &&
//             c.firstname.toLowerCase().includes(search)
//         );
//       case "engineering_department":
//         return contacts.filter(
//           (c) =>
//             !c.deleted &&
//             c.department === "Engineering" &&
//             c.firstname.toLowerCase().includes(search)
//         );
//       case "support_department":
//         return contacts.filter(
//           (c) =>
//             !c.deleted &&
//             c.department === "Support" &&
//             c.firstname.toLowerCase().includes(search)
//         );
//       case "sales_department":
//         return contacts.filter(
//           (c) =>
//             !c.deleted &&
//             c.department === "Sales" &&
//             c.firstname.toLowerCase().includes(search)
//         );
//       default:
//         return contacts.filter(
//           (c) => !c.deleted && c.firstname.toLowerCase().includes(search)
//         );
//     }
//   };

//   const contacts = useSelector((state: AppState) =>
//     getVisibleContacts(
//       state.contactsReducer.contacts,
//       state.contactsReducer.currentFilter,
//       state.contactsReducer.contactSearch
//     )
//   );

//   const active = useSelector((state: AppState) => state.contactsReducer.contactContent);

//   return (
//     <Scrollbar
//       sx={{
//         height: { lg: "calc(100vh - 400px)", md: "calc(100vh - 400px)" },
//         maxHeight: "400px",
//       }}
//     >
//       <List>
//         {contacts.map((contact) => (
//           <ContactListItem
//             key={contact.id}
//             active={contact.id === active}
//             {...contact}
//             onContactClick={() => {
//               dispatch(SelectContact(contact.id));
//               onRightSidebarOpen();
//             }}
//             onDeleteClick={() => dispatch(DeleteContact(contact.id))}
//             onStarredClick={() => dispatch(toggleStarredContact(contact.id))}
//           />
//         ))}
//       </List>
//     </Scrollbar>
//   );
// };

// // Staff Form Component
// const StaffForm = () => {
//   const [loading, setLoading] = useState(false);
  
//   const formik = useFormik({
//     initialValues: {
//       name: "",
//       phone: "",
//     },
//     validationSchema,
//     onSubmit: async (values, { resetForm }) => {
//       setLoading(true);
//       try {
//         // Add your API call to save the staff member here
//         console.log("Submitting staff data:", values);
//         await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
//         resetForm();
//       } catch (error) {
//         console.error("Error submitting form:", error);
//       } finally {
//         setLoading(false);
//       }
//     }
//   });

//   return (
//     <form onSubmit={formik.handleSubmit}>
//       <Stack spacing={3}>
//         <Box>
//           <CustomFormLabel htmlFor="staff-name">Staff Name</CustomFormLabel>
//           <CustomTextField
//             id="staff-name"
//             name="name"
//             placeholder="Enter Name"
//             fullWidth
//             value={formik.values.name}
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//           />
//           {formik.touched.name && formik.errors.name && (
//             <Typography color="error" variant="caption" sx={{ mt: 1 }}>
//               {formik.errors.name}
//             </Typography>
//           )}
//         </Box>
        
//         <Box>
//           <CustomFormLabel htmlFor="staff-phone">Phone Number</CustomFormLabel>
//           <CustomTextField
//             id="staff-phone"
//             name="phone"
//             placeholder="10-digit phone number"
//             fullWidth
//             value={formik.values.phone}
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//           />
//           {formik.touched.phone && formik.errors.phone && (
//             <Typography color="error" variant="caption" sx={{ mt: 1 }}>
//               {formik.errors.phone}
//             </Typography>
//           )}
//         </Box>
        
//         <Stack direction="row" spacing={2}>
//           <Button variant="contained" type="submit" disabled={loading}>
//             {loading ? "Saving..." : "Submit"}
//           </Button>
//           <Button variant="text" color="error" onClick={() => formik.handleReset()}>
//             Cancel
//           </Button>
//         </Stack>
//       </Stack>
//     </form>
//   );
// };

// // Combined Component
// const SchoolStaffManagement = () => {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  
//   return (
//     <Card sx={{ p: 3 }}>
//       <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
//         {/* Staff Form Section */}
//         <Box sx={{ flex: 1 }}>
//           <Typography variant="h5" sx={{ mb: 3 }}>Add Staff Member</Typography>
//           <StaffForm />
//         </Box>
        
//         {/* Staff List Section */}
//         <Box sx={{ flex: 1 }}>
//           <Typography variant="h5" sx={{ mb: 2 }}>Staff Directory</Typography>
//           <SearchComponent onMenuClick={() => setMenuOpen(!menuOpen)} />
//           <ContactListComponent onRightSidebarOpen={() => setRightSidebarOpen(true)} />
//         </Box>
//       </Box>
//     </Card>
//   );
// };

// export default SchoolStaffManagement;