import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const Myaddress = [
  {
    id: 1,
    name: 'Self'
  },
  {
    id: 2,
    name: 'By an authorized person'
  },
  {
    id: 3,
    name: 'By Post & scan copy'
  },
];

interface Props {
  onSelect: (id: number) => void;
}
const SecondStep = ({ onSelect }: Props) => {
  return (
    <>
      <Grid container spacing={3} mb={3} mt={1}>
        {Myaddress.map((address) => (
          <Grid
            key={address.id}         
            size={{
              lg: 4,
              xs: 12,
            }}
           onClick={() => onSelect(address.id)}
           sx={{cursor:'pointer' }}
           color={'primary'}
          >
            <Paper variant="outlined"  sx={{ p: 2 ,borderColor: "primary.main" , backgroundColor:"primary.light" }}>
              <Typography variant="h6" align='center' mb={1}>
                {address.name}
              </Typography>
              {/* <Button variant="outlined" onClick={nexStep}>
                Deliver To this address
              </Button> */}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default SecondStep;

















