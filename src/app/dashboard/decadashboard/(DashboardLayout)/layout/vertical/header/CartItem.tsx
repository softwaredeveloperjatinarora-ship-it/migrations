import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import emptyCart from "/public/images/products/empty-shopping-cart.svg";

import Image from "next/image";

const CartItems = () => {
  return (
    <Box px={3}>
      <Box textAlign="center" mb={3}>
        <Image src={emptyCart} alt="cart" width={200} />
        <Typography variant="h5" mb={2}>
          Cart is Empty
        </Typography>
        <Button
          component={Link}
          href="/"
          variant="contained"
        >
          Go back to Shopping
        </Button>
      </Box>
    </Box>
  );
};

export default CartItems;
