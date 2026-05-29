"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography, Stack, Avatar, AvatarGroup } from "@mui/material";
import { 
  IconBook, 
  IconBookDownload, 
  IconBookOff, 
  IconChevronRight
} from "@tabler/icons-react";
import { useTheme } from "@mui/material/styles";

interface Props {
  onOpenSidebar: () => void;
  items?: Course[];
}

interface Course {
  name: string;
  price: string;
}

const ExamFeeCart = ({ onOpenSidebar, items }: Props) => {
  const theme = useTheme();
  const secondary = theme.palette.secondary.main;
  const secondarylight = theme.palette.secondary.light;
  const error = theme.palette.error.main;
  const errorlight = theme.palette.error.light;
  const warning = theme.palette.warning.main;
  const warninglight = theme.palette.warning.light;

  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const itemCount = items?.length || 0;
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);
  console.log(itemCount)
  useEffect(() => {
    if (itemCount > 0) {
      setIsRemoving(false);
      setIsVisible(true);
      setAnimatingIndex(itemCount - 1);
      setTimeout(() => setAnimatingIndex(null), 400);
    } else {
      setIsRemoving(true);
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [itemCount]);

  // Function to generate different icons based on item count
  const generateAddedIcons = () => {
    const icons = [
      <IconBook width={20} height={20} key="1" />, // 1st item
      <IconBook width={20} height={20} key="2" />,      // 2nd item
      <IconBookDownload width={20} height={20} key="3" /> // 3rd item
    ];

    return icons.slice(0, Math.min(itemCount, 3)).map((icon, index) => (
      <Avatar
        key={index}
        sx={{
          height: 28,
          width: 28,
          bgcolor: errorlight,
          color: error,
          transform: animatingIndex === index ? "scale(1.2)" : "scale(1)",
          transition: "transform 0.4s ease-in-out",
        }}
      >
        {icon}
      </Avatar>
    ));
  };

  return (
    <>
      {(isVisible || isRemoving) && (
        <Box
          sx={{
            position: "fixed",
            bottom: isRemoving ? "-100px" : 16,
            left: "50%",
            transform: "translateX(-50%)",
            width: "90%",
            maxWidth:itemCount==0?190:itemCount==1?190:itemCount==2?215:240,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 14px",
            borderRadius: "40px",
            boxShadow: 3,
            backgroundColor: "primary.main",
            opacity: isRemoving ? 0 : 1,
            transition: "opacity 0.3s ease-in-out, bottom 0.3s ease-in-out",
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <AvatarGroup>
              {generateAddedIcons()}
            </AvatarGroup>
          </Stack>
          <Stack direction="row" spacing={0.8} alignItems="center">
            <Stack direction="column" spacing={0.1} alignItems="center">
              <Typography variant="body1" fontWeight="bold" color="white">
                View Course
              </Typography>
              <Typography variant="body2" color="white" textAlign="center">
                {itemCount} Courses
              </Typography>
            </Stack>
            <Avatar
              variant="rounded"
              sx={{
                bgcolor: "#e35633",
                color: "white",
                width: 35,
                height: 35,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconChevronRight width={20} onClick={onOpenSidebar} style={{ cursor: "pointer" }} />
            </Avatar>
          </Stack>
        </Box>
      )}
    </>
  );
};

export default ExamFeeCart;
