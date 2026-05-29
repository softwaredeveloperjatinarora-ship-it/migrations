"use client";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import BlankCard from "@/app/components/shared/BlankCard";
import ChildCard from "@/app/components/shared/ChildCard";
import {
  Badge,
  Button,
  Chip,
  Grid,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  SelectChangeEvent,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { IconMail, IconMenu2, IconPhone } from "@tabler/icons-react";
import { useState } from "react";
import DescriptionIcon from '@mui/icons-material/Description';
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import HistoryIcon from '@mui/icons-material/History';
import { Alegreya } from "next/font/google";

const categoryOptions = [
  "Duplicate Certificate",
  "Any Other",
];
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const OtherRequest = () => {
  const [formData, setFormData] = useState({
    mobile: "",
    email: "",
    category: "",
    description: "",
    file: null as File | null,
  });

const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFormData((prev) => ({ ...prev, file }));
  };

  const handleSubmit = () => {
    // Handle form submission (validation or API call)
    alert(JSON.stringify(formData))
    console.log(formData);
  };

  return (
    <BlankCard>
      <ChildCard title="Other Requests">
        <Typography
          variant="h6"
          fontWeight={600}
          mb={1}
          align="center"
          mt={"-15px"}
        >
          Provide the brief description and attach all the supporting documents
          <Typography
            component="span"
            color="primary"
            fontWeight={600}
            sx={{ textDecoration: "underline" }}
          >
            {" "}
            (in merged PDF, JPEG or ZIP folder)
          </Typography>
        </Typography>
        <Grid container spacing={1.5}>
          <Grid
            size={{ xs: 12 }}
            display="flex"
            justifyContent="flex-end"
            alignItems="flex-end"
          >
            <Badge badgeContent={6} color="primary">
              <Chip
                icon={<HistoryIcon />}
                label="View History"
                variant="outlined"
                color="primary"
                sx={{
                  fontWeight: 500,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                  cursor: "pointer",
                  backgroundColor: "primary.main",
                 color: "white",
                }}
              />
            </Badge>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} mt={"-25px"}>
            <CustomFormLabel htmlFor="phone">Phone</CustomFormLabel>
            <OutlinedInput
              startAdornment={
                <InputAdornment position="start">
                  <IconPhone />
                </InputAdornment>
              }
              id="phone"
              placeholder="Phone"
              fullWidth
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              type="tel"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} mt={"-25px"}>
            <CustomFormLabel htmlFor="email">E-Mail</CustomFormLabel>
            <OutlinedInput
              startAdornment={
                <InputAdornment position="start">
                  <IconMail />
                </InputAdornment>
              }
              id="email"
              placeholder="E-Mail"
              fullWidth
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
            />
          </Grid>
          <Grid size={{ xs: 12 }} mt={"-25px"}>
            <CustomFormLabel htmlFor="standard-select-category">
              Select Category
            </CustomFormLabel>
            <CustomSelect
              id="standard-select-category"
              name="category"
              value={formData.category}
              onChange={(e: any) =>
                setFormData((prev) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }
              fullWidth
              variant="outlined"
              displayEmpty
              renderValue={(selected: string) => {
                if (!selected) {
                  return <em>Select Category</em>;
                }
                return selected;
              }}
              input={
                <OutlinedInput
                  startAdornment={
                    <InputAdornment position="start">
                      <IconMenu2 />
                    </InputAdornment>
                  }
                />
              }
            >
              <MenuItem disabled value="">
                <em>Select Category</em>
              </MenuItem>
              {categoryOptions.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </CustomSelect>
            {/* <TextField
              fullWidth
              select
              required
              label="Select Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              {categoryOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField> */}
          </Grid>
          <Grid size={{ xs: 12 }} mt={"-25px"}>
            <CustomFormLabel htmlFor="description">Description</CustomFormLabel>
            <OutlinedInput
              startAdornment={
                <InputAdornment position="start">
                  <DescriptionIcon />
                </InputAdornment>
              }
              multiline
              rows={1}
              id="description"
              placeholder="Enter Description"
              fullWidth
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
            >
              Attach File (Max 500KB)
              <VisuallyHiddenInput
                type="file"
                accept=".pdf,.jpeg,.jpg,.zip"
                onChange={handleFileChange}
              />
            </Button>
            {formData.file && (
              <Typography variant="body2" mt={1}>
                Selected file: {formData.file.name}
              </Typography>
            )}
          </Grid>
        </Grid>

        <Stack direction="row" justifyContent="flex-end" mt={1}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Save
          </Button>
        </Stack>
      </ChildCard>
    </BlankCard>
  );
};

export default OtherRequest;
