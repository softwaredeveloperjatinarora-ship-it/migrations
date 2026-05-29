import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Badge from "@mui/material/Badge";
import { IconButton, Paper, TextField, Typography } from "@mui/material";
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import ArticleIcon from "@mui/icons-material/Article";
import { useTheme, useMediaQuery } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { OJTMessages } from "@/app/actions/OJTDashboard/OJTMessageAction";
import { decryptDataforResponse } from "@/app/api/services/auth/Encrptdecrpt";



export default function Messages({ onDataFetched }: any) {
  const [open, setOpen] = React.useState<boolean>(false);
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    
    setSearchQuery(e.target.value);
  };


  const [loading, setLoading] = useState<boolean>(true);
  const isDataFetched = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const [message, setmessage] = useState<any[]>([]);


  useEffect(() => {
    const fetchPlacementData = async () => {
      if (isDataFetched.current) return;

      try {
        setLoading(true);
        const response = await OJTMessages();
        // console.log("message ", response)

        if (response.status === "success") {
          let apiData = response.ApiData;
          let splitValue = String(session?.user?.token).split("NEXT2121ANG");
          const decryptedData = decryptDataforResponse(apiData, splitValue[1]);
          const parsedData = JSON.parse(decryptedData);
          // console.log("message", parsedData)
          setmessage(parsedData);
          onDataFetched(apiData);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
        isDataFetched.current = true;
      }
    };

    fetchPlacementData();
  }, [onDataFetched, session]);





const filteredData = searchQuery
  ? message.filter((item) =>
      item?.Subject?.toLowerCase().includes(searchQuery.toLowerCase()) 
     
      
    )
  : message;

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setOpen(open);
    };

  const list = () => (
    <Box
      sx={{
        width: isMobile ? "100vw" : 500,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: (theme) =>
          theme.palette.mode === "light" ? "#f5f5f5" : "#121212",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
        <IconButton onClick={() => setOpen(false)}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ p: 2 }}>
        <Typography
          variant="h6"
          sx={{
            px: 0,
            textAlign: "center",
            mt: -7,
            mb: 1,
            fontWeight: 600,
            fontSize: isMobile ? "1rem" : "1.25rem",
            color: "text.primary",
          }}
        >
          Messages
        </Typography>

        <TextField
          onChange={handleSearchQuery}
          label="Search Notifications"
          variant="outlined"
          fullWidth
          sx={{
            width: "90%",
            mx: isMobile ? 1 : 2,
            mb: 1,
            borderRadius: 2,
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? "background.light" : "background.dark",
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "rgba(0, 0, 0, 0.23)" },
              "&:hover fieldset": { borderColor: "blue" },
              "&.Mui-focused fieldset": { borderColor: "blue" },
            },
          }}
        />
      </Box>
      <List sx={{ overflowY: "auto", px: 2, pb: 2 }}>
        {filteredData.length > 0 ? (
          filteredData.map((item,id) => (
            <ListItem key={id} sx={{ pb: 2 }}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  borderRadius: 1,
                  bgcolor: (theme) =>
                    theme.palette.mode === "light" ? "#ffffff" : "#1e1e1e",
                  width: "100%",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "flex-start", mt: 1 }}>
                  <Typography
                    variant="body1"
                    fontWeight={600}
                    sx={{ display: "flex", alignItems: "flex-start" }}
                  >
                    <ArticleIcon
                      sx={{
                        mr: 1,
                        width: 16,
                        height: 16,
                        mt: "3px",
                        color: "#0085DB",
                      }}
                    />
                    {item.Subject}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "flex-start", mt: 1 }}>
                  <MessageOutlinedIcon
                    sx={{
                      width: 17,
                      height: 16,
                      mt: "4px",
                      mr: 1,
                      color: "#D3865E",
                    }}
                  />
                  <Typography variant="caption">{item.Announcement}</Typography>
                </Box>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ float: "right" }}
                >
                  <span style={{ fontWeight: "bold" }}>Date: </span>
                  {item.MsgStartDate ? item.MsgStartDate.split('T')[0] : ''}
                </Typography>

              </Paper>
            </ListItem>
          ))
        ) : (
          <Typography variant="body1" sx={{ textAlign: "center", mt: 4 }}>
            No Messages Found...
          </Typography>
        )}
      </List>
    </Box>
  );

  return (
    <div style={{ position: "relative", cursor: "pointer" }}>
      <Badge
        badgeContent={message.length}
        color="primary"
        overlap="circular"
        sx={{ position: "absolute", top: 2, right: 0, pr: "3px" }}
        onClick={toggleDrawer(true)}
      >
        <MessageOutlinedIcon />
      </Badge>
      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
    </div>
  );
}
