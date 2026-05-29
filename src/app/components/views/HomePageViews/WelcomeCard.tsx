
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useSelector } from "@/store/hooks";
import { AppState, ProfileState } from "@/store/store";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
const WelcomeCard = () => {
  const profilee = useSelector((state: ProfileState) => state.profile) as { profileData: { registerationNumber: number, programName: string, studentSection: string, snap: string, name: string, studentEmail: any,batchYear: number }[] };
  const customizer = useSelector((state: AppState) => state.customizer);
  const theme = useTheme();
  const borderColor = theme.palette.divider;

  return (
    <>
      <Card
        sx={{
          height: { xs: "310px", sm: "140px", lg: "150px" },
          mt: { xs: 3, lg: 0, md: 0, sm: 0 }, // ✅ Equal margin from top & bottom
          padding: 0,
          border: !customizer.isCardShadow ? `1px solid ${borderColor}` : "none",
          overflow: "unset",
          display: "flex", // ✅ Ensures vertical alignment
          alignItems: "center", // ✅ Centers content
        }}
        elevation={customizer.isCardShadow ? 9 : 0}
        variant={!customizer.isCardShadow ? "outlined" : undefined}
      >
        <CardContent sx={{ width: "100%", py: 2 }}> {/* ✅ Equal padding from top & bottom */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" }, // Stack vertically on mobile
              justifyContent: "center",
              alignItems: "center",
              gap: 2, // Equal spacing
              width: "100%",
            }}
          >
            {/* Profile Picture */}
            <img
              src={`data:image/jpg;base64,${profilee.profileData[0]?.snap}`}
              alt="Profile Picture"
              style={{
                width: 82,
                objectFit: "cover",
                borderRadius: "10%",
                objectPosition: "center",
              }}
              
            />
            

            {/* Profile Information */}
            <Box
              sx={{
                flex: 1,
                color: "#c6d1e9",
                cursor: "default",
                textAlign: "center",
              }}
            >
              <Typography fontSize={"20px"} variant="h4" color="primary.main">
                {profilee.profileData[0]?.name || "N/A"}
              </Typography>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                sx={{ fontSize: "13px", fontWeight: "bold" }}
              >
                VID: {profilee.profileData[0]?.registerationNumber || "N/A"} | Section:{" "}
                {profilee.profileData[0]?.studentSection || "N/A"} | Batch:{" "} {profilee.profileData[0]?.batchYear || "N/A"}
              </Typography>

             

              <Typography
                variant="subtitle2"
                color="textSecondary"
                sx={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "normal",
                }}
              >
                {profilee.profileData[0]?.programName || "N/A"}
              </Typography>
            
            </Box>

            {/* Button */}
            <Button
              size="large"
              variant="text"
              color="primary"
              sx={{
                whiteSpace: "nowrap",
              }}
            >
              Raise RMS
            </Button>
          </Box>
        </CardContent>
      </Card>

    </>
  );
};

export default WelcomeCard;
