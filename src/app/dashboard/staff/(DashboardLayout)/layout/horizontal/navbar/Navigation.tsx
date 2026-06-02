
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Drawer from '@mui/material/Drawer';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import NavListing from './NavListing';
import Logo from '../../shared/logo/Logo';
import { useSelector, useDispatch } from '@/store/hooks';
import { toggleMobileSidebar } from '@/store/customizer/CustomizerSlice';
import SidebarItems from '../../vertical/sidebar/SidebarItems';
import { AppState } from '@/store/store';
import { IconButton, Menu, MenuItem, Slider, Tooltip } from '@mui/material';
import { IconMenu2 } from '@tabler/icons-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Updated import
interface NavigationProps {
  slider: boolean;
  setSlider: (value: boolean) => void;
}

const Navigation = ({ slider, setSlider }: NavigationProps) => {
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
  const customizer = useSelector((state: AppState) => state.customizer);
  const dispatch = useDispatch();
  const router = useRouter(); // Proper hook usage
  const [show,setshow] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
 
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  

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

  if (lgUp) {
    return (
      <Box sx={{ background: (theme) => theme.palette.background.paper, borderRadius: 0 }} py={2}>
        <Container sx={{ maxWidth: customizer.isLayout === 'boxed' ? 'lg' : '100%!important' }}>
          {/* <NavListing /> */}
        </Container>
      </Box>
    );
  }

  return (
    <Drawer
      anchor="left"
      open={slider||false}
       onClose={() => setSlider(false)}
      variant="temporary"
      PaperProps={{
        sx: {
          width: customizer.SidebarWidth,
          border: '0 !important',
          boxShadow: (theme) => theme.shadows[8],
        },
      }}
    >
      <Box px={2} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Logo />
        {/* <Tooltip title="Important Links and Information">
          <IconButton onClick={handleMenuClick}>
            <IconMenu2 stroke={1.5} />
          </IconButton>
        </Tooltip> */}
      </Box>

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
        {/* {importantlink.map((item, index) => (     commented 29-07-2025
          <MenuItem
            key={index}
            onClick={() => {
              handleMenuClose();
              router.push(item.link);
                 setSlider(false)
            }}
          >
            {item.label}
          </MenuItem>
        ))} */}
      </Menu>

      <SidebarItems onCloseSidebar={() => setSlider(false)}/>
    </Drawer>
  );
};

export default Navigation;
