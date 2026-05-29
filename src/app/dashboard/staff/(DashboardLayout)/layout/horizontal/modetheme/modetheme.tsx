
import React, { useEffect } from 'react';
import { IconButton } from '@mui/material'; // Ensure this import is correct
import { Icon } from '@iconify/react';
import { useDispatch, useSelector } from 'react-redux';
import { setDarkMode } from '@/store/customizer/CustomizerSlice'; // Assuming you have this action
import { AppState, ProfileState } from '@/store/store';
import { useSession } from 'next-auth/react';
import { decryptDataforResponse, encryptData } from '@/app/api/services/auth/Encrptdecrpt';
import { getthemeAction } from '@/app/actions/headerAction/Theme/getthemeAction';

const ThemeToggleButton: React.FC = () => {
  // Get the current theme mode from Redux store
  const customizer = useSelector((state: AppState) => state.customizer);
  const { data: session } = useSession();
  const dispatch = useDispatch();

  // Get umsMode from profile data (if available)
  const profilee = useSelector((state: ProfileState) => state.profile) as {
    profileData: { umsMode: string }[];
  };

  // Default mode from profile data (if available)
  const umsModeCode = profilee.profileData[0]?.umsMode || 'light'; // Default to 'light' if no profile data

  // Function to handle the theme toggle
  const handleThemeToggle = () => {
    const newMode = customizer.activeMode === 'light' ? 'dark' : 'light'; // Toggle mode
    dispatch(setDarkMode(newMode)); // Dispatch to update Redux store

    localStorage.setItem("selectedMode", newMode); // Update the theme in localStorage

    const formfields = { UMSColor: null, UMSMode: newMode }; // Form data for the API call

    if (!session || !session.user || !session.user.token) {
      console.error("Session or token is missing");
      return;
    }

    let splitValue = session.user.token.split("NEXT2121ANG"); // Split token
    const credentialsJson = JSON.stringify(formfields);
    const { Data } = encryptData(credentialsJson, splitValue[1]); // Encrypt data

    // Call the API to update the theme
    getthemeAction(Data).then(response => {
      const apiData = response.ApiData;
      const decryptedData = decryptDataforResponse(apiData, splitValue[1]);
      // console.log("set themecolour", decryptedData); // Log decrypted data (you can update your UI based on this)
    }).catch(error => {
      console.error("Error changing theme:", error);
    });
  };

  // UseEffect to read theme from localStorage on load and set it to Redux store
  useEffect(() => {
    const storedTheme = localStorage.getItem("selectedMode");
    if (storedTheme) {
      dispatch(setDarkMode(storedTheme)); // Set theme on page load
    } else {
      dispatch(setDarkMode(umsModeCode)); // Set theme based on profilee if no theme in localStorage
    }
  }, [dispatch, umsModeCode]);

  return (
    <IconButton size="large" color="inherit" onClick={handleThemeToggle}>
      {customizer.activeMode === 'light' ? (
        <Icon icon="solar:moon-line-duotone" width="21" height="21" />
      ) : (
        <Icon icon="solar:sun-2-line-duotone" width="21" height="21" />
      )}
    </IconButton>
  );
};

export default ThemeToggleButton;
