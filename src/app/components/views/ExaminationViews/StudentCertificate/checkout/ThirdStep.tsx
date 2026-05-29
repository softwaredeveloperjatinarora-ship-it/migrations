import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Radio from "@mui/material/Radio";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import { InputAdornment, OutlinedInput } from "@mui/material";
import { IconAddressBook, IconHome, IconPhone, IconPin, IconUser, IconWorld } from "@tabler/icons-react";

interface deliveryType {
  id: number;
  title: string;
  description: string;
}

interface paymentType {
  value: string;
  title: string;
  description: string;
  icons: string;
}
interface ThirdStepProps {
  deliveryMode: number | null;
}

const Delivery: deliveryType[] = [
  {
    id: 1,
    title: "Express (₹500.00)",
    description: "Delivered on Early Time",
  },
  {
    id: 2,
    title: "Normal Mode  (₹0)",
    description: "Delivered on Regular Time",
  },
];

const DeliveryOptionPost: deliveryType[] = [
  {
    id: 1,
    title: "Domestic (₹500.00)",
    description: "Delivery within India.",
  },
  {
    id: 2,
    title: "International (₹3000.00)",
    description: "Delivery to international addresses",
  },
];

const Payment: paymentType[] = [

  {
    value: "Online Payment",
    title: "Credit / Debit Card / UPI",
    description: "We support Mastercard, Visa and Rupay.",
    icons: "/images/backgrounds/mastercard.svg",
  }
];

const ThirdStep = ({ deliveryMode }: ThirdStepProps) => {
  const [selectedValue, setSelectedValue] = React.useState(1);

  const handleDChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue( parseInt(event.target.value));
  };
  const [selectedPyament, setSelectedPyament] = React.useState("Online Payment");

  const handlePChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPyament(event.target.value);
  };
 

     if (deliveryMode === 1) {
  return (
    <>
      <Paper variant="outlined" sx={{ p: 3, mt: 4 }}>
      <Typography variant="h6">Delivery Option</Typography>
      <Grid container spacing={3} mt={1}>
        {Delivery.map((option) => (
          <Grid
            key={option.id}
            size={{
              lg: 6,
              xs: 12
            }}>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderColor:
                  selectedValue === option.id ? "primary.main" : "",
                backgroundColor:
                  selectedValue === option.id ? "primary.light" : "",
              }}
            >
              <Stack direction={"row"} alignItems="center" gap={1}>
                <Radio
                  checked={selectedValue === option.id}
                  onChange={handleDChange}
                  value={option.id}
                  name="radio-buttons"
                  inputProps={{ "aria-label": option.title }}
                />
                <Box>
                  <Typography variant="h6">{option.title}</Typography>
                  <Typography variant="subtitle2">
                    {option.description}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
    <Paper variant="outlined" sx={{ p: 3, mt: 4 }}>
      <Typography variant="h6">Payment Option</Typography>
      <Grid container spacing={3} alignItems="center">
        <Grid
          size={{
            lg: 8,
            xs: 12
          }}>
          <Grid container spacing={3} mt={2}>
            {Payment.map((option) => (
              <Grid
                key={option.value}
                size={{
                  lg: 12,
                  xs: 12
                }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderColor:
                      selectedPyament === option.value ? "primary.main" : "",
                    backgroundColor:
                      selectedPyament === option.value ? "primary.light" : "",
                  }}
                >
                  <Stack direction={"row"} alignItems="center" gap={1}>
                    <Radio
                      checked={selectedPyament === option.value}
                      onChange={handlePChange}
                      value={option.value}
                      name="radio-buttons"
                      inputProps={{ "aria-label": option.title }}
                    />
                    <Box>
                      <Typography variant="h6">{option.title}</Typography>
                      <Typography variant="subtitle2">
                        {option.description}
                      </Typography>
                    </Box>
                    <Box ml="auto">
                      {option.icons ? (
                        <Image src={'/images/backgrounds/mastercard.svg'} alt="payment" width={40} height={40} />
                      ) : (
                        ""
                      )}
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Paper> 
  </>
  );
  } else if (deliveryMode === 2) {
    return <>
    <Paper variant="outlined" sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6">Consent Form</Typography>
        <Grid container spacing={3} mb={2}>
          <Grid
            size={{
              lg: 6,
              md: 12,
              sm: 12,
            }}
          >
            <CustomFormLabel htmlFor="fname">Student Name</CustomFormLabel>
            <OutlinedInput
              startAdornment={
                <InputAdornment position="start">
                  <IconUser />
                </InputAdornment>
              }
              id="fname"
              placeholder="Name"
              fullWidth
            />
            <CustomFormLabel htmlFor="fbank">Father Name</CustomFormLabel>
            <OutlinedInput
              startAdornment={
                <InputAdornment position="start">
                  <IconUser />
                </InputAdornment>
              }
              id="fbank"
              placeholder="Mobile No"
              fullWidth
            />
          </Grid>
          <Grid
            size={{
              lg: 6,
              md: 12,
              sm: 12,
            }}
          >
            <CustomFormLabel htmlFor="facount">
              Authorized Person's Name
            </CustomFormLabel>
            <OutlinedInput
              startAdornment={
                <InputAdornment position="start">
                  <IconUser />
                </InputAdornment>
              }
              id="facount"
              placeholder="Country"
              fullWidth
            />
            <CustomFormLabel htmlFor="fifsc">
             Name of Guardian (Authorized Person)
            </CustomFormLabel>
            <OutlinedInput
              startAdornment={
                <InputAdornment position="start">
                  <IconUser />
                </InputAdornment>
              }
              id="fifsc"
              placeholder="State"
              fullWidth
            />
          </Grid>
           <Grid
            size={{
              lg: 6,
              md: 12,
              sm: 12,
            }}
            mt={'-25px'}
          >
            <CustomFormLabel htmlFor="facount">
             ID Proof Number
            </CustomFormLabel>
            <OutlinedInput
              startAdornment={
                <InputAdornment position="start">
                  <IconAddressBook />
                </InputAdornment>
              }
              id="facount"
              placeholder="Aadhar / Voter ID / Passport"
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant="body2" color="text.secondary" fontWeight={'bold'} > 
              The opted ID proof should be shown by the authorized person for
              verification at the time of collection of certificate(s) from the
              university.
            </Typography>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant="body2" color="text.secondary" fontWeight={'bold'} mt={0.5}>
              I confirm that the authorized person has the authority to sign on
              acknowledgment of the certificate(s). I will be fully responsible
              for any loss or misplacement of documents after collection.
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </>;
  } else if (deliveryMode === 3) {
    return <>
    <Paper variant="outlined" sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6">Delivery Option</Typography>
        <Grid container spacing={3} mt={1}>
          {DeliveryOptionPost.map((option) => (
            <Grid
              key={option.id}
              size={{
                lg: 6,
                xs: 12,
              }}
            >
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderColor:
                    selectedValue === option.id ? "primary.main" : "",
                  backgroundColor:
                    selectedValue === option.id ? "primary.light" : "",
                }}
              >
                <Stack direction={"row"} alignItems="center" gap={1}>
                  <Radio
                    checked={selectedValue === option.id}
                    onChange={handleDChange}
                    value={option.id}
                    name="radio-buttons"
                    inputProps={{ "aria-label": option.title }}
                  />
                  <Box>
                    <Typography variant="h6">{option.title}</Typography>
                    <Typography variant="subtitle2">
                      {option.description}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
       <Paper variant="outlined" sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6">Delivery Address</Typography>
      <Grid container spacing={3} mb={2}>
        <Grid
          size={{
            lg: 6,
            md: 12,
            sm: 12,
          }}
        >
          <CustomFormLabel htmlFor="fname">Name</CustomFormLabel>
          <OutlinedInput
            startAdornment={
              <InputAdornment position="start">
                <IconUser />
              </InputAdornment>
            }
            id="fname"
            placeholder="Name"
            fullWidth
          />
          <CustomFormLabel htmlFor="fbank">Mobile No</CustomFormLabel>
          <OutlinedInput
            startAdornment={
              <InputAdornment position="start">
                <IconPhone />
              </InputAdornment>
            }
            id="fbank"
            placeholder="Mobile No"
            fullWidth
          />
        </Grid>
        <Grid
          size={{
            lg: 6,
            md: 12,
            sm: 12,
          }}
        >
          <CustomFormLabel htmlFor="facount">Country</CustomFormLabel>
          <OutlinedInput
            startAdornment={
              <InputAdornment position="start">
                <IconWorld />
              </InputAdornment>
            }
            id="facount"
            placeholder="Country"
            fullWidth
          />
          <CustomFormLabel htmlFor="fifsc">State</CustomFormLabel>
          <OutlinedInput
            startAdornment={
              <InputAdornment position="start">
                <IconWorld />
              </InputAdornment>
            }
            id="fifsc"
            placeholder="State"
            fullWidth
          />
        </Grid>
        <Grid
          size={{
            lg: 6,
            md: 12,
            sm: 12,
          }}
          mt={'-25px'}
        >
          <CustomFormLabel  htmlFor="facount">City</CustomFormLabel>
          <OutlinedInput
            startAdornment={
              <InputAdornment position="start">
                <IconHome />
              </InputAdornment>
            }
            id="facount"
            placeholder="City"
            fullWidth
          />
        </Grid>
        <Grid
          size={{
            lg: 6,
            md: 12,
            sm: 12,
          }}
           mt={'-25px'}
        >
          <CustomFormLabel htmlFor="fifsc">PinCode</CustomFormLabel>
          <OutlinedInput
            startAdornment={
              <InputAdornment position="start">
                <IconPin />
              </InputAdornment>
            }
            id="fifsc"
            placeholder="Pin Code"
            fullWidth
          />
        </Grid>
          <Grid
          size={{
            sm: 12
          }}
           mt={'-25px'}
        >
          <CustomFormLabel htmlFor="fifsc">Address</CustomFormLabel>
          <OutlinedInput
            startAdornment={
              <InputAdornment position="start">
                <IconAddressBook />
              </InputAdornment>
            }
            id="fifsc"
            placeholder="Address"
            fullWidth
            rows={1}
            multiline
            
          />
        </Grid>
      </Grid>
      </Paper> 
    </>;
  }
    
};

export default ThirdStep;
