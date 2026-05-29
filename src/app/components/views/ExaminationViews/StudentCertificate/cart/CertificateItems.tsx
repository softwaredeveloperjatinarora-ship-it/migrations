import { Box, Button, Stack, Typography } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { certificate } from '../CertificateList';
import {
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'; 
import { IconCertificate } from '@tabler/icons-react';

interface Props {
  items?: certificate[];

}

const CertificateItems = ({items}:Props) => {
  return (
    <>
      <Box px={3}>
        {items!.length > 0 ? (
          <>
            {items!.map((item, index) => (
              <Card key={index} elevation={9} sx={{ mb: 1,p:1}}>
                <CardContent sx={{p:1}}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar
                      sx={{
                        bgcolor: "primary.light",
                        color: "primary.main",
                        width: 40,
                        height: 40,
                      }}
                    >
                      <IconCertificate />
                    </Avatar>

                    <Box flexGrow={1}>
                      <Typography variant="subtitle1" fontWeight={600}>
                         {item.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        mt={0.5}
                      >
                        Price: ₹{item.price}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <Box textAlign="center" mb={3}>
            <Image
              src="/images/backgrounds/board-2799814.jpg"
              alt="cart"
              width={200}
              height={200}
            />
            <Typography variant="h5" mb={2}>
              No certificate added
            </Typography>
            <Button component={Link} href="#" variant="contained">
              Go back to Add Certificate
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
}

export default CertificateItems
