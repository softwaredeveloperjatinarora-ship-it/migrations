"use client";

import * as React from "react";
import {
  Box,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  CircularProgress,
  ListSubheader,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import {
  encryptData,
  decryptDataforResponse,
} from "@/app/api/services/auth/Encrptdecrpt";
import { getSchoolStaffAction } from "@/app/actions/DECAActions/DistanceExamination/schoolStaff/getSchoolStaff";
import { assignExamDuty } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/staffAllocation/addAssignExamDuty";

interface ThirdStepProps {
  selectedDate: Date | null;
  selectedTime: string;
  examType: number;
  handleStaffAllocation: (data: boolean) => void;
  staffAllocation: boolean;
}

export interface SchoolStaff {
  id: string;
  CenterNo: string;
  Name: string | null;
  PhoneNo: string | null;
  AddedBy: string | null;
  IsActive: string;
}

const ThirdStep: React.FC<ThirdStepProps> = ({
  selectedDate,
  selectedTime,
  handleStaffAllocation,
  staffAllocation,
}) => {
  const centerNumber = useSelector((state: any) => state.center.centerNumber);
  const { data: session } = useSession();
  const [schoolStaff, setSchoolStaff] = React.useState<SchoolStaff[]>([]);
  const [filter, setFilter] = React.useState("");
  const [allocation, setAllocation] = React.useState({
    "soc (Suprintendent of Centre)": "",
    "dsoc (Deputy Suprintendent of Centre)": "",
    clerical: "",
    computerOperator: "",
  });
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // Fetch School Staff
  const fetchSchoolStaff = async () => {
    try {
      if (!session?.user?.token) {
        console.warn("Session or token missing during fetch");
        return;
      }

      const splitValue = session.user?.token.split("NEXT2121ANG");
      const formfields = { CenterNo: centerNumber };

      const credentialsJson = JSON.stringify(formfields);
      const { Data } = encryptData(credentialsJson, splitValue[1]);

      const response = await getSchoolStaffAction(Data);
      const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);

      const parsedData = JSON.parse(decryptedData);
      setSchoolStaff(parsedData);
    } catch (error) {
      console.error("Error fetching school staff:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle change
  const handleChange = (role: keyof typeof allocation, value: string) => {
    setAllocation((prev) => ({ ...prev, [role]: value }));
  };

  // Filter staff for dropdown (no duplicates)
  const getAvailableStaff = (currentValue: string) => {
    const selected = Object.values(allocation).filter(
      (id) => id && id !== currentValue
    );

    let available = schoolStaff.filter(
      (staff) => !selected.includes(staff.id) && staff.Name?.trim()
    );

    if (filter) {
      available = available.filter((staff) =>
        staff.Name?.toLowerCase().includes(filter.toLowerCase())
      );
    }
    return available;
  };
  const EmpId = useSelector((state: any) => state.user?.username);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!allocation["soc (Suprintendent of Centre)"] || !allocation["dsoc (Deputy Suprintendent of Centre)"] || !allocation.clerical || !allocation.computerOperator) {
      setErrorMsg("All fields are required.");
      return;
    }

    try {
      setSubmitting(true);

      const splitValue = session?.user?.token?.split("NEXT2121ANG");
      if (!splitValue) throw new Error("Invalid session token");

      // ✅ Build API payload as array
      const formfields = [
        {
          CenterNo: centerNumber,
          ExamDates: selectedDate ? selectedDate.toISOString().split("T")[0] : "",
          ExamTime: selectedTime,
          Designation: "SOC",
          StaffRefID: allocation["soc (Suprintendent of Centre)"],
          StaffName: schoolStaff.find((s) => s.id === allocation["soc (Suprintendent of Centre)"])?.Name ?? "",
          AddBy: EmpId, // or any user id you have in token/session
        },
        {
          CenterNo: centerNumber,
          ExamDates: selectedDate ? selectedDate.toISOString().split("T")[0] : "",
          ExamTime: selectedTime,
          Designation: "DSOC",
          StaffRefID: allocation["dsoc (Deputy Suprintendent of Centre)"],
          StaffName: schoolStaff.find((s) => s.id === allocation["dsoc (Deputy Suprintendent of Centre)"])?.Name ?? "",
          AddBy: EmpId
        },
        {
          CenterNo: centerNumber,
          ExamDates: selectedDate ? selectedDate.toISOString().split("T")[0] : "",
          ExamTime: selectedTime,
          Designation: "Clerical",
          StaffRefID: allocation.clerical,
          StaffName: schoolStaff.find((s) => s.id === allocation.clerical)?.Name ?? "",
          AddBy: EmpId,
        },
        {
          CenterNo: centerNumber,
          ExamDates: selectedDate ? selectedDate.toISOString().split("T")[0] : "",
          ExamTime: selectedTime,
          Designation: "Computer Operator",
          StaffRefID: allocation.computerOperator,
          StaffName: schoolStaff.find((s) => s.id === allocation.computerOperator)?.Name ?? "",
          AddBy: EmpId,
        },
      ];


      const { Data } = encryptData(JSON.stringify(formfields), splitValue[1]);
      const response = await assignExamDuty(Data);

      if (response) {
        const decrypted = decryptDataforResponse(response?.data, splitValue[1]);
        const parsed = JSON.parse(decrypted);

        // Access message
        const message = parsed[0]?.Message;
        setSuccessMsg(message);
        handleStaffAllocation(true);
      } else {
        setErrorMsg("Failed to save staff allocation.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };


  const handleReset = () => {
    setAllocation({ "soc (Suprintendent of Centre)": "", "dsoc (Deputy Suprintendent of Centre)": "", clerical: "", computerOperator: "" });
    setErrorMsg(null);
    setSuccessMsg(null);
    handleStaffAllocation(false);
  };

  const allFilled = Object.values(allocation).every((val) => val);

  React.useEffect(() => {
    fetchSchoolStaff();
  }, [session, centerNumber]);

  return (
    <Box>
      <Box
        component="form"
        onSubmit={handleSubmit}
        onReset={handleReset}
        p={3}
        borderRadius={2}
        sx={{
          backgroundColor: (theme: any) =>
            theme.palette.mode === "light" ? "white" : "#111c2d",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main", mb: 2 }}>
          Staff Allocation
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={2} columns={12}>
            {["soc (Suprintendent of Centre)", "dsoc (Deputy Suprintendent of Centre)", "clerical", "computerOperator"].map((role) => (
              <Grid key={role} size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel shrink sx={{ mb: 1, fontWeight: 600 }}>
                    {role.toUpperCase()}
                  </InputLabel>

                  <Select
                    label={role.toUpperCase()}
                    value={allocation[role as keyof typeof allocation] ?? ""}
                    onChange={(e) =>
                      handleChange(role as keyof typeof allocation, e.target.value)
                    }
                    disabled={staffAllocation}
                    displayEmpty
                    renderValue={(selected) =>
                      selected
                        ? getAvailableStaff(allocation[role as keyof typeof allocation]).find(
                          (s) => s.id === selected
                        )?.Name
                        : <em style={{ color: '#999' }}>Select a person</em>
                    }
                    MenuProps={{
                      PaperProps: { style: { maxHeight: 300 } },
                    }}
                  >
                    {getAvailableStaff(allocation[role as keyof typeof allocation]).map(
                      (staff) => (
                        <MenuItem key={staff.id} value={staff.id}>
                          {staff.Name}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </FormControl>
              </Grid>
            ))}


            <Grid
              size={{ xs: 12 }}
              display="flex"
              justifyContent="center"
              gap={2}
              mt={2}
            >
              {!staffAllocation ? (
                <>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!allFilled || submitting}
                  >
                    {submitting ? <CircularProgress size={20} /> : "Submit"}
                  </Button>
                  <Button type="reset" variant="outlined" color="secondary">
                    Reset
                  </Button>
                </>
              ) : (
                <Button onClick={handleReset} variant="contained">
                  Edit Allocation
                </Button>
              )}
            </Grid>

            {errorMsg && (
              <Grid size={{ xs: 12 }}>
                <Typography color="error" textAlign="center" mt={2}>
                  {errorMsg}
                </Typography>
              </Grid>
            )}

            {successMsg && (
              <Grid size={{ xs: 12 }}>
                <Typography color="success.main" textAlign="center" mt={2}>
                  {successMsg}
                </Typography>
              </Grid>
            )}
          </Grid>

        )}
      </Box>
    </Box>
  );
};

export default ThirdStep;
