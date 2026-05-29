
import { usePathname } from "next/navigation";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSelector } from '@/store/hooks';
import NavItem from '../NavItem';
import NavCollapse from '../NavCollapse';
import { AppState, menuState } from '@/store/store';
import { useState } from 'react';
import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { IconMenu2 } from "@tabler/icons-react";
import { useRouter } from 'next/navigation'; // Updated import

interface ParentComponentProps {
  onDataFetched?: (data: any) => void;
}

const NavListing = ({ onDataFetched, ...rest }: ParentComponentProps) => {
  const pathname = usePathname();
  const pathDirect = pathname;
  const pathWithoutLastPart = pathname.slice(0, pathname.lastIndexOf('/'));
  const customizer = useSelector((state: AppState) => state.customizer);
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
  const hideMenu = lgUp ? customizer.isCollapse && !customizer.isSidebarHover : '';
   const menu = useSelector((state: menuState) => state.menu); 


  const handleItemClick = (href: string) => {
    const baseUrl = 'https://ums.lpu.in/';
    const fullUrl = `${baseUrl}${href}`;
    const router = useRouter();
    router.push(fullUrl);
  };




  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Function to handle opening of the menu
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Function to handle closing of the menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Menu items list (this can be dynamic)
  const importantlink = [
    { label: 'Hostel Booking', link: '/dashboard/hostel/hosteldashboard' },
    { label: 'Apply for Edu-Revolution', link: '/revolution' },
    { label: 'RMS', link: '/RMS' },
    { label: 'Fee Dashboard', link: '/feedashboard' },
    { label: 'Issued Books', link: '/issuedbooks' },
    { label: 'Academic Calendar', link: '/academiccalendar' },
    { label: 'Emergency Number', link: '/emergencynumber' },
    { label: 'Certificate Request', link: '/dashboard/bonafidecerificates' },
    { label: 'Part-time job Application', link: '/parttimejobapplication' }
  ];

  const router = useRouter();

  return (
    <Box >
      {/* <MenuComponent onDataFetched={handleMenuData} /> */}
      {/* <Container sx={{maxWidth:"85%"}}> */}
      <List sx={{ p: 0, display: 'flex', justifyContent: "space-between", gap: '2px', zIndex: '100', marginLeft: "6.5%" }}>

        <Box sx={{ display: "flex", gap: "2px" }}>

          {menu.menuData.map((category: any) => {
            if (category.children && category.children.length > 0) {
              return (
                <NavCollapse
                  menu={category}
                  pathDirect={pathDirect}
                  hideMenu={hideMenu}
                  pathWithoutLastPart={pathWithoutLastPart}
                  level={1}
                  key={category.id} onClick={undefined} />
              );
            } else {
              return (
                <NavItem
                  item={category}
                  key={category.id}
                  pathDirect={pathDirect}
                  hideMenu={hideMenu}
                  onClick={() => handleItemClick(category.href)}
                />
              );
            }
          })}
        </Box>

        <Box sx={{ marginRight: '8.5%' }}>
          <Tooltip title="Important Links and Information  ">
            <IconButton >
                {/* <IconButton onClick={handleMenuClick}> */}
              <IconMenu2 stroke={1.5} />
            </IconButton>
          </Tooltip>
        </Box>

      </List>



      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {importantlink.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              handleMenuClose();
              router.push(item.link);
            }}
          >
            {item.label}
          </MenuItem>
        ))}

      </Menu>

    </Box>
  );
};

export default NavListing;




