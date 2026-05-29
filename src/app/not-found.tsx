"use client";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import React, { useEffect } from "react";

export default function NotFound() {
  const pathname = usePathname();
  const [loading, setLoading] = React.useState(true);
  //This Component is Handle Both cases Not - Found and Auto Login
  useEffect(() => {
        let loginName = pathname.split("/").filter(Boolean).at(-1); // gets last segment
        if(!loginName) return ;
        if(loginName?.length <= 500) {
          setLoading(false);
        }
  }, []);
  return (
     <></>
        )
       
 
}
