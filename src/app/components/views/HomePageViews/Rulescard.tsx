import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useSelector } from "@/store/hooks";
import { AppState } from "@/store/store";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import { Icon } from "@iconify/react";
import Link from "next/link";
import Grid from "@mui/material/Grid";

const RulesCard = () => {
  const customizer = useSelector((state: AppState) => state.customizer);
  const theme = useTheme();
  const borderColor = theme.palette.divider;

  const stats = [
    {
      subtitle: "Scholarship Guidelines",
      Link: "https://ums.lpu.in/lpuums/Policy/StudentFee/S.No.%206.pdf",
      icon: "/images/Homepageimage/top-warning-shape.png",
      iconsm: <Icon icon="hugeicons:student" width="30" height="30" />,
    },
    {
      subtitle: "Academic Rules",
      Link: "chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/https://ums.lpu.in/lpuums/Static%20Information/Academic%20calender/An%20Extract%20of%20changes%20in%20rules%20w%20e%20f%20Session%202013-14.pdf",
      icon: "/images/Homepageimage/top-error-shape.png",
      iconsm: <Icon icon="hugeicons:note" width="30" height="30" />,
    },
    {
      subtitle: "Examination Rules",
      Link: "chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/https://ums.lpu.in/lpuums/Static%20Information/Academic%20calender/An%20Extract%20of%20changes%20in%20rules%20w%20e%20f%20Session%202013-14.pdf",
      icon: "/images/Homepageimage/top-info-shape.png",
      iconsm: <Icon icon="carbon:result" width="30" height="30" />,
    },
    {
      subtitle: "Library Rules",
      Link: "chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/https://ums.lpu.in/lpuums/Static%20Information/Library%20Policy.pdf",
      icon: "/images/Homepageimage/top-info-shape.png",
      iconsm: (
        <Icon icon="academicons:semantic-scholar" width="30" height="30" />
      ),
    },
    {
      subtitle: "Credit Transfer",
      Link: "chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/https://ums.lpu.in/lpuums/Static%20Information/GUIDELINES_FOR_CREDIT_TRANSFER_OPTION.pdf",
      icon: "/images/Homepageimage/top-error-shape.png",
      iconsm: (
        <Icon icon="solar:card-transfer-outline" width="30" height="30" />
      ),
    },
    {
      subtitle: "Welfare Guidelines",
      Link: "https://ums.lpu.in/lpuums/frmDSAStudentPolicyView.aspx",
      icon: "/images/Homepageimage/top-warning-shape.png",
      iconsm: <Icon icon="lucide-lab:elephant-face" width="30" height="30" />,
    },
  ];

  return (
    <Grid container spacing={3}>
      {stats.map((stat, i) => (
        <Grid key={i} size ={{ sm: 6, xs: 6, md: 4}} >
          <Link href={stat.Link} target="_blank">
            {/* xs=12: full width on small screens, sm=6: 2 in a row, md=4: 3 in a row */}
            <Card
              sx={{
                height: "150px",
                padding: 0,
                border: !customizer.isCardShadow
                  ? `1px solid ${borderColor}`
                  : "none",
                backgroundColor: "primary.main",
                color: "white",
                position: "relative",
                transition:
                  "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
                },
              }}
              elevation={customizer.isCardShadow ? 9 : 0}
              variant={!customizer.isCardShadow ? "outlined" : undefined}
            >
              <Image
                src={stat.icon}
                alt="img"
                className="top-img"
                width={59}
                height={81}
              />
              <CardContent sx={{ textAlign: "center" /*margin: 1.5 */ }}>
                <Box mb={2}>{stat.iconsm}</Box>
                <Typography component="span" variant="subtitle2">
                  {stat.subtitle}
                </Typography>
              </CardContent>
            </Card>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
};

export default RulesCard;
