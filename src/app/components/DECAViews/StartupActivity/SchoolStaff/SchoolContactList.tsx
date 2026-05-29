import { useEffect, useState } from "react";
import ContactItem from "./SchoolContactListItem";

import {
  Box,
  Typography,
  CircularProgress,
  Card,
  TextField,
  InputAdornment,
  Divider,
  List,
  Paper
} from "@mui/material";
import EditContactDialog from "./EditContactDialog";
import { IconSearch } from '@tabler/icons-react';
import { useSelector } from "react-redux";
import { decryptDataforResponse, encryptData } from "@/app/api/services/auth/Encrptdecrpt";
import { useSession } from "next-auth/react";
import { getSchoolStaffAction } from "@/app/actions/DECAActions/DistanceExamination/schoolStaff/getSchoolStaff";
export interface SchoolStaff {
  id: string;
  CenterNo: string;
  Name: string | null;
  PhoneNo: string | null;
  AddedBy: string | null;
  IsActive: string;
}

type Props = {
  showrightSidebar: () => void;
  reloadContactList?: () => void;
};

const ContactList = ({ showrightSidebar, reloadContactList }: Props) => {

  const { data: session } = useSession();
  const centerNumber = useSelector((state: any) => state.center.centerNumber)
  const [schoolStaff, setSchoolStaff] = useState<SchoolStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  // State for edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<SchoolStaff | null>(null);

  const fetchSchoolStaff = async () => {
    try {
      if (!session?.user?.token) {
        console.warn("Session or token missing during fetch");
        return;
      } ``

      const splitValue = session.user?.token.split("NEXT2121ANG");

      const formfields = {
        CenterNo: centerNumber,
      };

      const credentialsJson = JSON.stringify(formfields);
      const { Data } = encryptData(credentialsJson, splitValue[1]);

      const response = await getSchoolStaffAction(Data);
      const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);

      let parsedData;
      parsedData = JSON.parse(decryptedData);
      setSchoolStaff(parsedData);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching school staff:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (centerNumber) {
      fetchSchoolStaff();
    }
  }, []);

  // Filter staff based on search query
  const filteredStaff = Array.isArray(schoolStaff)
    ? schoolStaff.filter(staff =>
      staff.Name?.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];

  const handleContactClick = (id: string | null) => {
    setSelectedContactId(id);
    showrightSidebar();
  };

  const handleStarContact = (id: string) => {
    // You can implement this functionality if needed

  };

  const handleEditContact = (id: string) => {
    const contact = schoolStaff.find(staff => staff.id === id);
    if (contact) {
      setSelectedContact(contact);
      setEditDialogOpen(true);
    }
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedContact(null);
  };

  const handleUpdateSuccess = () => {
    handleCloseEditDialog();
    fetchSchoolStaff(); // Reload the contact list after update
  };

  return (
    <>
      <EditContactDialog
        open={editDialogOpen}
        contact={selectedContact}
        onClose={handleCloseEditDialog}
        onUpdateSuccess={handleUpdateSuccess}
        allContacts={schoolStaff}
      />

      <Box sx={{ pt: 0, pb: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search staff..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconSearch size={20} />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 1 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle2" color="text.secondary">
            Total Staff: {filteredStaff.length}
          </Typography>
        </Box>
      </Box>

      <Divider />

      <Box sx={{
        flexGrow: 1,
        overflowY: 'auto',
        height: 'calc(100vh - 240px)',
        maxHeight: '178px'
      }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <CircularProgress size={30} />
          </Box>
        ) : (
          <>
            {filteredStaff.length > 0 ? (
              <List sx={{ p: 0 }}>
                {filteredStaff.reverse().map((staff) => (
                  <ContactItem
                    key={staff.id}
                    id={staff.id}
                    firstname={staff.Name || "No Name"}
                    lastname=""
                    image=""
                    phone={staff.PhoneNo || "No Phone"}
                    department=""
                    starred={false}
                    active={staff.id === selectedContactId}
                    onContactClick={() => handleContactClick(staff.id)}
                    onEditClick={() => handleEditContact(staff.id)}
                  // onStarredClick={() => handleStarContact(staff.id)}
                  />
                ))}
              </List>
            ) : (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="textSecondary">No staff found</Typography>
              </Box>
            )}
          </>
        )}
      </Box>
    </>
  );
};

export default ContactList;