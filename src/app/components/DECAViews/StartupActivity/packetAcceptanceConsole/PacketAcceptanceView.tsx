"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Avatar,
} from "@mui/material";
import {
  IconListDetails,
} from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { encryptData, decryptDataforResponse } from "@/app/api/services/auth/Encrptdecrpt";
import { useSelector } from "react-redux";
import { IconCheck, IconClockHour4 } from "@tabler/icons-react";
import { getstudentAction } from "@/app/actions/DECAActions/DistanceExamination/packetAcceptanceConsole/getMaterial";
interface PacketAcceptanceViewProps {
  onPacketStatusChange?: (status: boolean) => void;
}

const PacketAcceptanceView: React.FC<PacketAcceptanceViewProps> = ({ onPacketStatusChange }) => {
  const centerNumber = useSelector((state: any) => state.center.centerNumber)
  const [staticPkts, setStaticPkts] = useState<any[]>([]);
  const [allPacketsReceived, setAllPacketsReceived] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Helper function to get encryption key from session
  const getEncryptionKey = () => {
    const splitValue = session?.user?.token?.split('NEXT2121ANG');
    if (!splitValue || splitValue.length < 2) {
      throw new Error('Invalid token format');
    }
    return splitValue[1];
  };

  // Helper function to prepare encrypted form data
  const prepareEncryptedFormData = (data: any) => {
    try {
      const encryptionKey = getEncryptionKey();
      const dataJson = JSON.stringify(data);
      const { Data } = encryptData(dataJson, encryptionKey);

      const formData = new FormData();
      formData.append('data', Data);
      return formData;
    } catch (error) {
      console.error('Error preparing encrypted form data:', error);
      throw error;
    }
  };

  // Check if all packets have Receive status as true
  const checkAllPacketsReceived = (packetsData: any[]) => {
    try {
      // If there are no packets, default to false
      if (packetsData.length === 0) {
        setAllPacketsReceived(false);
        if (onPacketStatusChange) {
          onPacketStatusChange(false);
        }
        return;
      }

      // Check if every packet has Receive status as true
      const allReceived = packetsData.every((packet: any) => packet.Receive === "True" || packet.Receive === 1);
      setAllPacketsReceived(allReceived);

      // Notify parent component of status change
      if (onPacketStatusChange) {
        onPacketStatusChange(allReceived);
      }
    } catch (error) {
      console.error("Error checking packet status:", error);
      setAllPacketsReceived(false);
      if (onPacketStatusChange) {
        onPacketStatusChange(false);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Prepare encrypted data for getMaterial
        const requestData = {
          CenterNo: centerNumber,
        };

        const encryptedFormData = prepareEncryptedFormData(requestData);
        const response = await getstudentAction(encryptedFormData);
console.log("response",response)
        if (response && response.encryptedData) {
          // Decrypt the response data on client side
          const encryptionKey = getEncryptionKey();
          const decryptedData = JSON.parse(decryptDataforResponse(response.encryptedData, encryptionKey));

          // Transform the data
          const transformedData = decryptedData.map((item: any) => ({
            id: item.Id, // Correct key is Id, not id
            Pktname: item.Pktno,
            From: item.Serialfrom,
            To: item.Serialto,
            Count: item.Cnt,
            Type: item.Description,
            Status: item.Receive || 0, // Defaulting to 0 if Status is missing or null
          }));

          setStaticPkts(transformedData);

          // Check packet status using the original decrypted data
          checkAllPacketsReceived(decryptedData);
        } else if (response && response.status === 'error') {
          setError(response.message || 'Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching packet data:', error);
        setError('An error occurred while fetching packet data');
        setAllPacketsReceived(false);
        if (onPacketStatusChange) {
          onPacketStatusChange(false);
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch data if session is available
    if (session?.user?.token) {
      fetchData();
    } 
  }, [session, centerNumber, onPacketStatusChange]);

  // Loading state
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <CircularProgress size={60} thickness={4} color="primary" />
        <Typography variant="h6" color="textSecondary">
          Loading packet information...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Typography variant="h6" color="error" align="center">
          {error}
        </Typography>
        <Typography variant="body2" color="textSecondary" align="center">
          Please try refreshing the page or contact support if the issue persists.
        </Typography>
      </Box>
    );
  }

  // Calculate total packets and sheets
  const totalPackets = staticPkts.length;
  const totalSheets = staticPkts.reduce((sum, pkt) => sum + parseInt(pkt.Count || 0), 0);

  // Calculate counts for each type
  const counts = staticPkts.reduce((acc: { [key: string]: any[] }, pkt) => {
    if (!acc[pkt.Type]) {
      acc[pkt.Type] = [];
    }
    acc[pkt.Type].push(pkt);
    return acc;
  }, {});

  // Define the desired order of packet types
  const desiredOrder = ["Theory Sheets", "Library Sheets", "Practical Sheets"];

  // Create ordered entries
  const orderedEntries: [string, any[]][] = [];

  // First, add the types in desired order if they exist
  desiredOrder.forEach(type => {
    if (counts[type]) {
      orderedEntries.push([type, counts[type]]);
    }
  });

  // Then add any remaining types that weren't in the desired order
  Object.entries(counts).forEach(([type, packets]) => {
    if (!desiredOrder.includes(type)) {
      orderedEntries.push([type, packets]);
    }
  });

  // Status indicator component that adapts based on screen size

  const StatusIndicator = ({ isComplete }: { isComplete: boolean }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        bgcolor: isComplete ? "success.light" : "error.light",
        color: isComplete ? "success.main" : "error.main",
        px: 1.2,
        py: 0.3,
        border: "1px solid",
        borderColor: isComplete ? "success.main" : "error.main",
        borderRadius: 2,
        fontSize: "11px",
        fontWeight: 600,
        textTransform: "uppercase",
        boxShadow: 1,
      }}
    >
      {isComplete ? <IconCheck size={14} /> : <IconClockHour4 size={14} />}
      {/* {isComplete ? "Completed" : "Pending"} */}
    </Box>
  );


  // Handle case where no packets are available
  if (staticPkts.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Typography variant="h6" color="textSecondary" align="center">
          No packets found
        </Typography>
        <Typography variant="body2" color="textSecondary" align="center">
          There are currently no packets available for this center.
        </Typography>
      </Box>
    );
  }

 return (
  <Box>
    <Grid container spacing={2}>
      {/* Total Packets Card */}
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <Box
          bgcolor="warning.light"
          sx={{
            position: "relative",
            borderRadius: "8px",
            minHeight: "70px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            px: 2,
            py: 1.5,
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              boxShadow: theme.shadows[4],
            },
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Avatar
                sx={{
                  bgcolor: "warning.main",
                  color: "white",
                  width: 36,
                  height: 36,
                  fontWeight: 600,
                  boxShadow: theme.shadows[2],
                }}
              >
                <IconListDetails size={18} />
              </Avatar>
              <Box>
                <Typography fontWeight={600} variant="body1">
                  Total Packets: {totalPackets}
                </Typography>
                <Typography fontWeight={500} variant="body2" color="text.secondary">
                  Total Sheets: {totalSheets}
                </Typography>
              </Box>
            </Stack>
            <StatusIndicator isComplete={allPacketsReceived} />
          </Stack>
        </Box>
      </Grid>

      {/* Cards for each packet type */}
      {orderedEntries.map(([type, packets]) => {
        const count = packets.length;
        const allTypeReceived = packets.every(pkt => pkt.Status === 1 || pkt.Status === "True");
        const totalSheetsforpkt = packets.reduce((sum, pkt) => sum + parseInt(pkt.Count || 0), 0);

        const bgColor =
          type === "Theory Sheets"
            ? "secondary"
            : type === "Practical Sheets"
              ? "secondary"
              : type === "Library Sheets"
                ? "secondary"
                : "primary";

        return (
          <Grid key={type} size={{ xs: 12, sm: 6, lg: 3 }}>
            <Box
              bgcolor={`${bgColor}.light`}
              sx={{
                position: "relative",
                borderRadius: "8px",
                minHeight: "70px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                px: 2,
                py: 1.5,
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Avatar
                    sx={{
                      bgcolor: `${bgColor}.dark`,
                      color: "white",
                      width: 36,
                      height: 36,
                      fontWeight: 600,
                      boxShadow: theme.shadows[2],
                    }}
                  >
                    <IconListDetails size={18} />
                  </Avatar>
                  <Box>
                    <Typography fontWeight={600} variant="body1">
                      {type.replace("Sheets", "Packets")}
                    </Typography>
                    <Typography fontWeight={500} variant="body2" color="text.secondary">
                      Total Packets: {count}
                    </Typography>
                    <Typography fontWeight={500} variant="body2" color="text.secondary">
                      Total Sheets: {totalSheetsforpkt}
                    </Typography>
                  </Box>
                </Stack>
                <StatusIndicator isComplete={allTypeReceived} />
              </Stack>
            </Box>
          </Grid>
        );
      })}
    </Grid>
  </Box>
);

};

export default PacketAcceptanceView;