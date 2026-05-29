
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { IconX } from "@tabler/icons-react";
import Link from "next/link";
import { Icon } from "@iconify/react";

//import { menuState } from "../../../../../../store/store";
import Scrollbar from '@/app/components/custom-scroll/Scrollbar';
import { useSelector } from "react-redux";

interface menuType {
  title: string;
  id: string;
  subheader: string;
  children?: menuType[];
  href?: string;
}

const Search = () => {
  const [search, setSearch] = useState("");
  //const menu = useSelector((state: menuState) => state.menu); // fetch menu store in redux
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Preprocess menu data to add default href values for missing ones
  const preprocessMenuData = (menuData: menuType[]): menuType[] => {
    return menuData.map((item) => ({
      ...item,
      children: item.children
        ? preprocessMenuData(item.children) // Recursively process children
        : undefined,
    }));
  };

  //const processedMenuData = preprocessMenuData(menu.menuData);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Filter only third-level children that match the search
  const filterRoutes = (rotr: menuType[], cSearch: string) => {
    if (rotr.length > 1) {
      return rotr
        .map((t) => t.children) // Look at the children
        .flatMap((childArray) =>
          childArray
            ? childArray
                .map((child) => child.children) // Look at the grandchildren (third level)
                .flat()
                .filter(
                  (thirdLevel) =>
                    thirdLevel &&
                    thirdLevel.href &&
                    thirdLevel.title
                      .toLocaleLowerCase()
                      .includes(cSearch.toLocaleLowerCase()) // Filter based on title match
                ) || []
            : []
        );
    }

    return [];
  };

 // const searchData = filterRoutes(processedMenuData, search);

  return (
    <>
      <Button
        aria-label=""
        color="inherit"
        variant="outlined"
        aria-controls="search-menu"
        aria-haspopup="true"
        size="large"
        onClick={handleClick}
        startIcon={<Icon icon="solar:magnifer-linear" width={24} />}
        sx={{
          borderColor: (theme) => theme.palette.divider,
          borderRadius: "25px",
          
        }}
      >
         searching...
      </Button>
      <Menu
       sx={{height:{xs:700}}}
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <Stack direction="row" spacing={2} p={3} alignItems="center">
          <TextField
            id="tb-search"
            placeholder="Search here"
            fullWidth
            onChange={(e) => setSearch(e.target.value)}
            inputProps={{ "aria-label": "Search here" }}
          />
          <IconButton size="small" onClick={handleClose}>
            <IconX size="18" />
          </IconButton>
        </Stack>
        <Divider />
        <Scrollbar sx={{ height: { xs: "100px", sm: "300px", xl: "300px" } }}>
        <Box p={2} sx={{ overflow: "auto" }}>
          <Typography variant="h5" p={1}>
            Quick Page Links
          </Typography>
          

          <Box>
          
              <List component="nav">
                {/* {searchData.map(
                  (thirdLevel: menuType | undefined) =>
                    thirdLevel && (
                      <ListItemButton
                        sx={{ py: 0.5, px: 1 }}
                        href={thirdLevel.href || "/"} // Redirect to href or fallback to "/"
                        component={Link}
                        key={thirdLevel.id}
                      >
                     
                        <ListItemText
                          sx={{
                            width: "6px",
                            my: 0,
                            py: 0.5,
                            whiteSpace: "normal",
                            wordWrap: "break-word",
                            overflowWrap: "break-word",
                          }}
                        >
                          {thirdLevel.title}{" "}
                        </ListItemText>
                      </ListItemButton>
                    )
                )} */}
              </List>
            
          </Box>
         
        </Box>
        </Scrollbar>
      </Menu>
    </>
  );
};

export default Search;
