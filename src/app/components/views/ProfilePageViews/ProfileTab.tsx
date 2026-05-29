"use client";

import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { IconUserCircle } from "@tabler/icons-react";
import ArticleIcon from "@mui/icons-material/Article";
import IntroCard from "./IntroCard";
import ProfileForm from "./ProfileForm";
const TabPanel = ({
  children,
  value,
  index,
}: {
  children: React.ReactNode;
  value: string;
  index: string;
}) => {
  return (
    <Box role="tabpanel" hidden={value !== index}>
      {value === index && <Box p={2}>{children}</Box>}
    </Box>
  );
};

const ProfileTab = () => {
  const [value, setValue] = useState("0"); // Store tab index as a string

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue.toString()); // Ensure string type
  };

  return (
    <>
      <Box
        mt={1}
        sx={{
          mt: 1,
          backgroundColor: (theme) => theme.palette.grey[100],
          display: "flex",
          justifyContent: "flex-end",
          borderRadius:"0"
        }}
      >
        {/* Tabs Navigation */}
        <Tabs value={value} onChange={handleChange}>
          <Tab icon={<IconUserCircle size="20" />} label="Profile" value="0" />
          <Tab icon={<ArticleIcon />} label="Update Profile" value="1" />
        </Tabs>
      </Box>

      <TabPanel value={value} index="0">
        <IntroCard />
      </TabPanel>
      <TabPanel value={value} index="1">
        <ProfileForm />
      </TabPanel>
    </>
  );
};

export default ProfileTab;
