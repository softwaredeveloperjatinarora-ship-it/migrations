"use client";
import { useState, useEffect, useRef } from "react";
//import { getmenuAction } from "../../../../actions/headerAction/menu/getmenuAction";
import { decryptDataforResponse } from "@/app/api/services/auth/Encrptdecrpt";
import { useSession } from "next-auth/react";

const MenuComponent = ({ onDataFetched }: any) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isDataFetched = useRef(false); // To prevent duplicate fetches
  const { data: session } = useSession();
  useEffect(() => {
    const fetchMenuData = async () => {
      // if (isDataFetched.current) return;

      // try {
      //   setLoading(true);

      //   const response = await getmenuAction();
      //   let splitValue = String(session?.user?.token).split("NEXT2121ANG");
      //   if (response.status === "success") {
      //     const apiData = response.ApiData;
      //     let apiData1 = decryptDataforResponse(apiData, splitValue[1]);

      //     // Parse if data is a JSON string with escaped characters
      //     if (typeof apiData1 === "string") {
      //       apiData1 = JSON.parse(apiData1.replace(/\\/g, ""));
      //     }

      //     onDataFetched(apiData1); // Pass data to parent
      //   } else {
      //     setError(response.message);
      //   }
      // } catch (err) {
      //   setError(err instanceof Error ? err.message : "Unknown error occurred");
      // } finally {
      //   setLoading(false);
      //   isDataFetched.current = true;
      // }
    };

    fetchMenuData();
  }, [onDataFetched]);

  if (loading) {
    return 
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return null; // No UI needed for this component
};

export default MenuComponent;
