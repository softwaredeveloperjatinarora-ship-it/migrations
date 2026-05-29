import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Icon } from "@iconify/react";
import { useSession, signOut } from "next-auth/react"
import { Stack } from "@mui/system";
import { encryptData, decryptDataforResponse } from "@/app/api/services/auth/Encrptdecrpt";
import { getprofileAction } from "@/app/actions/DECAActions/DistanceExamination/ProfileDetails/getprofileAction";
import { setProfileData } from "@/store/profile/profileSlice";
import EmergencyTable from "@/app/components/views/ProfilePageViews/EmergencyNumber/EmergencyTable";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import { Skeleton } from "@mui/material";
import { setMenuData } from "@/store/menu/menuSlice";
import CircleIcon from '@mui/icons-material/Circle';
import { setCenterNumber } from "@/store/CenterNumber/centerNumberSlice";
import { getFacultyProfile } from "@/app/actions/DECAActions/DistanceExamination/dummy/facultyProfile";
import { GetCenterNo } from "@/app/actions/DECAActions/DistanceExamination/GetCenterNumber/getCenterNumber";

// const WS_URL = "ws://172.18.12.25/Socket/pool/SalesTeam/ws";

// const profile = [
//   // {
//   //   href: "/dashboard/user-profile",
//   //   title: "My Profile",
//   //   // subtitle: "Account Settings",
//   //   icon: <Icon icon="solar:wallet-2-line-duotone" width="20" height="20" />,
//   //   color: "primary",
//   // },
//   // {
//   //   href: "/dashboard/change-password",
//   //   title: "Change Password",
//   //   // subtitle: "Account Settings",
//   //   icon: <Icon icon="fluent-mdl2:profile-search" width="20" height="20" />,
//   //   color: "warning",
//   // },
// ];

const Profile = () => {

  const dispatch = useDispatch();
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up("lg"))
  const [anchorEl2, setAnchorEl2] = useState(null);
  const isDataFetched = useRef(false);
  const [profileDatadata, setProfile] = useState<any[]>([]); // Now it's an array
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { data: session } = useSession()
  const getCurrentTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const username = useSelector((state: any) => state.user?.username);
  const profileData = useSelector((state: any) => state.profile.profileData);
console.log("profileData",profileData)
  console.log("username", username)
  const fetchProfileData = async () => {
console.log("session?.user?.token",session?.user?.token)
    setLoading(true);
    try {
      const formfields = {
        "EmpId": Number(username)
      };

      let splitValue = String(session?.user?.token).split("NEXT2121ANG");
      const credentialsJson = JSON.stringify(formfields);
      const { Data } = encryptData(credentialsJson, splitValue[1]);
      const response = await getFacultyProfile(Data);
      const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);
      console.log("decryptedData", decryptedData)
      const parsedData = JSON.parse(decryptedData);
      setProfile(Array.isArray(parsedData) ? parsedData : [parsedData]);
      dispatch(setProfileData(Object.values(parsedData)))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleMenuData = (data: any) => {
    transformMenuData(data);
  };

  const transformMenuData = (data: any) => {
    const categories: any = {};

    data.forEach((item: any) => {
      const {
        category,
        subCategory,
        menuId,
        text,
        navigationUrl,
        description,
        isActive,
        type,
        target,
        enableForCID,
      } = item;

      if (!categories[category]) {
        categories[category] = { id: category, title: category, children: [] };
      }

      let subCategoryItem = categories[category].children.find(
        (sub: any) => sub.id === subCategory
      );
      if (!subCategoryItem) {
        subCategoryItem = { id: subCategory, title: subCategory, children: [] };
        categories[category].children.push(subCategoryItem);
      }

      subCategoryItem.children.push({
        id: menuId,
        title: text,
        href: navigationUrl,
        description: description,
        isActive: isActive,
        type: type,
        target: target,
        enableForCID: enableForCID,
      });
    });

    ;
    dispatch(setMenuData(Object.values(categories)));
  };

  const handleClick2 = (event: any) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };


  useEffect(() => {
    if (session?.user?.token && username) {
      fetchProfileData();
    }
  }, []);


  useEffect(() => {
    const fetchCenter = async () => {
      if (!session?.user?.token) {
        console.warn("Session or token missing during fetch");
        return;
      }

      const splitValue = session?.user?.token?.split('NEXT2121ANG');

      const formfields = {
        "EmpId": Number(username),
      };

      const credentialsJson = JSON.stringify(formfields);
      const { Data } = encryptData(credentialsJson, splitValue[1]);

      const response = await GetCenterNo(Data);
      console.log("fetchCenter", response)
      const decrypted = decryptDataforResponse(response?.data, splitValue[1]);
      const parsed = JSON.parse(decrypted);
      console.log("parsed", parsed)
      const centerNo = parsed?.[0]?.CenterNo;
      console.log("cen", centerNo)
      if (centerNo != null) {
        dispatch(setCenterNumber(String(centerNo)));
      }

    };
    fetchCenter();
  }, []);

  return (
    <Box>
      {/* <MenuComponent onDataFetched={handleMenuData} /> */}
      {/* <> */}

      {loading ? (
        <LoadingSkeleton lgUp={false} />
      ) : (



        <Button
          size="large"
          aria-label="show 11 new notifications"
          color="inherit"
          aria-controls="msgs-menu"
          aria-haspopup="true"
          sx={{
            ...(typeof anchorEl2 === "object" && {
              color: "primary.main",
            }),
            display: "flex",
            gap: 2,
          }}
          onClick={handleClick2}
        >

          <img
            src={`data:image/jpg;base64,${profileData[0]?.Snap}`}
            style={{
              height: 45,
              width: 45,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "50%",
            }}
          />

          {lgUp ? <Box textAlign="left">
            <Typography variant="h6" color="textPrimary" display="flex" alignItems=""> {profileData[0]?.Name}</Typography>
            <Box display="flex" alignItems="center" mb={1}>
              {/* <CircleIcon  sx={{ fontSize:"10px",color: isConnected ? 'success.main' : "#FF4D4D", mr: 0.5 }} /> */}
              {/* <Typography variant="body2" color="textPrimary">
        {isConnected ? 'Online' : `Offline - Last seen ${getCurrentTime()}`}
      </Typography> */}
            </Box>

          </Box> : ""}
        </Button>

      )}
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            width: "360px",
            p: 4,
          },
        }}
      >
        <Typography variant="h5">User Profile</Typography>
        <Stack direction="row" py={3} spacing={2} alignItems="center">
          <img
            src={`data:image/jpg;base64,${profileData[0]?.Snap}`}
            style={{
              height: 95,
              width: 95,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "auto",
              borderRadius: "50%",
            }}
          />
          <Box>
            {/* Name */}
            <Typography
              variant="h6"
              color="textPrimary"
              fontWeight={600}
              sx={{ lineHeight: 1.4 }}
            >
              Name : {profileData[0]?.Name}
            </Typography>

            {/* Mobile Number */}
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ marginTop: "4px", display: "flex", alignItems: "center", gap: 1 }}
            >
              <Icon icon="solar:call-line-duotone" width="16" height="16" />
              Mobile No. - {profileData[0]?.MobileNo}
            </Typography>
          </Box>
        </Stack>

        <Divider />

        {/* {profile?.map((profile) => (
          <Box key={profile.title}>
            <Box sx={{ py: 0.5, px: 0 }} className="hover-text-primary">
              <Link href={profile.href} onClick={handleClose2}>
                <Stack direction="row" spacing={2}>
                  <Box

                    minWidth="47px"
                    height="47px"
                    bgcolor={profile.color + ".light"}
                    color={profile.color + ".main"}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >

                    {profile.icon}
                  </Box>
                  <Box>
                    <Typography

                      variant="subtitle2"
                      fontWeight={600}
                      color="textPrimary"
                      className="text-hover"
                      noWrap
                      sx={{
                        width: "240px",
                        marginTop: "10px"
                      }}
                    >
                      {profile.title}
                    </Typography>

                  </Box>
                </Stack>
              </Link>
            </Box>

          </Box>
        ))} */}

        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          marginTop: 0.5,
          cursor: "pointer",
          justifyContent: 'space-between'
        }} className="hover-text-primary">


          <EmergencyTable />
        </Box>
        <Box mt={2}>
          <Button
            href="/dashboard/DECA"
            variant="contained"
            color="primary"
            component={Link}
            fullWidth
            onClick={() => signOut()}
          >
            Log out
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

const LoadingSkeleton = ({ lgUp }: { lgUp: boolean }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        px: 1,
      }}
    >
      {/* Circular Skeleton for profile image */}
      <Skeleton
        variant="circular"
        width={45}
        height={45}
        animation="wave"
      />


      {/* Text Skeleton if lgUp is true */}
      {lgUp && (
        <Box>
          <Skeleton
            variant="text"
            width={80}
            height={24}
            animation="wave"
          />
        </Box>
      )}
    </Box>
  );
};

export default Profile;


