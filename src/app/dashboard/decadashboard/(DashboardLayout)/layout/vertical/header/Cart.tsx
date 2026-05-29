import React, { useState } from "react";
import { IconX } from "@tabler/icons-react";
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CartItems from "./CartItem";
import { Icon } from "@iconify/react";

const Cart = () => {
 
  const [showDrawer, setShowDrawer] = useState(false);
  const handleDrawerClose = () => {
    setShowDrawer(false);
  };

  const cartContent = (
    <Box> 
      {/* ------------------------------------------- */}
      {/* Cart Content */}
      {/* ------------------------------------------- */}
      <Box>
        <CartItems />
      </Box>
    </Box>
  );

  return (
    <Box>
      <Button
        size="large"
        className="btn-rounded-circle-40"
        onClick={() => setShowDrawer(true)}
        color="inherit"
      >
        <Badge color="primary" badgeContent="0">
          <Icon icon="solar:cart-3-line-duotone" width="24" height="24" />
        </Badge>
      </Button>
      {/* ------------------------------------------- */}
      {/* Cart Sidebar */}
      {/* ------------------------------------------- */}
      <Drawer
        anchor="right"
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        PaperProps={{ sx: { maxWidth: "500px" } }}
      >
        <Box
          display="flex"
          alignItems="center"
          p={3}
          pb={0}
          justifyContent="space-between"
        >
          <Typography variant="h5" fontWeight={600}>
            Shopping Cart
          </Typography>
          <Box>
            <IconButton
              color="inherit"
              sx={{
                color: (theme) => theme.palette.grey.A200,
              }}
              onClick={handleDrawerClose}
            >
              <IconX size="1rem" />
            </IconButton>
          </Box>
        </Box>

        {/* component */}
        {cartContent}
        
      </Drawer>
    </Box>
  );
};

export default Cart;
