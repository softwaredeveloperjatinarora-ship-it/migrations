
"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  DialogActions,
} from "@mui/material";
import Scrollbar from "@/app/components/custom-scroll/Scrollbar";
import { decryptDataforResponse, encryptData } from "@/app/api/services/auth/Encrptdecrpt";
import { useSession } from "next-auth/react";
import { getFeeextensionPopupAction } from "@/app/actions/headerAction/FeeextensionPopup/getFeeextensionPopupAction";



interface PopupProps {
  title?: string;
}

const FeeextensionPopup = ({ onDataFetched }: any) => {
  const descriptionElementRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const isDataFetched = useRef(false);
  const [open, setOpen] = useState(false);
  const [feeData, setfeeData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchFeeData = async () => {
      if (isDataFetched.current) return;
      setLoading(true);

      try {
        const response1 = await getFeeextensionPopupAction();

        let splitValue = String(session?.user?.token).split("NEXT2121ANG");
        if (response1.status === "success") {
          let apiData1 = response1.ApiData;
          const decryptedData = decryptDataforResponse(
            apiData1,
            splitValue[1]
          );


          // const parsed1 = JSON.parse(decryptedData1);

          const parsedData = JSON.parse(decryptedData)

          console.log("🔍 parsedDatafeeextension:", parsedData);

          setfeeData(parsedData);


          // const hasValidMessage = parsedData.some(
          //   (item) =>
          //     item.Message !== null &&
          //     typeof item.Message === "string" &&
          //     item.Message.trim().length > 0
          // );

          if (parsedData.length > 0) {
            setOpen(true);
          }


          onDataFetched(parsedData);
        } else {
          setError(response1.message);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
        isDataFetched.current = true;
      }
    };

    fetchFeeData();
  }, [onDataFetched, session]);

  useEffect(() => {
    if (open && descriptionElementRef.current) {
      descriptionElementRef.current.focus();
    }
  }, [open]);

  const decodeHtmlEntities = (html: string): string => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const cleanHtmlMessage = (rawHtml: string): string => {
    const decoded = decodeHtmlEntities(rawHtml);
    return decoded
    // .replace(/<li>/gi, "• ")
    // .replace(/<\/li>/gi, "<br/>")
    // .replace(/<\/?ul[^>]*>/gi, "")
    // .replace(/<\/h3>/gi, "</h3><br/>");
  };

  const handleClose = () => setOpen(false);







  const handleConfirm = async () => {
    // console.log("popupid mark read",popupid)

    // const formfields = {
    //   Id: popupid
    // }
    // if (!session || !session.user || !session.user.token) {
    //   throw new Error("Session or token is missing");
    // }

    // let splitValue = session.user.token.split("NEXT2121ANG");
    // const credentialsJson = JSON.stringify(formfields);

    // // Encrypt the data
    // const { Data } = encryptData(credentialsJson, splitValue[1]);
    // const response1 = await savePlacementdrivePopupAction(Data);
    // let apiData = response1.ApiData;
    // const decryptedData = decryptDataforResponse(apiData, splitValue[1]);
    // console.log("response mark as read save popup ",decryptedData)

    setOpen(false)

  };

  if (!open) return null;

  return (
    <>
      {feeData.map((item: any, index: number) => (


        <Dialog
          key={index}
          open={open}
          onClose={handleClose}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
          PaperProps={{ sx: { width: { xs: "100%", lg: "55%" }, height: { xs: "40%", lg: "45%" } } }}
          maxWidth="lg"
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {"Campus Drive Notifications"}
          </DialogTitle>

          <DialogContent dividers>
            <Scrollbar sx={{ height: "100%" }}>
              <Box sx={{ fontSize: "12px" }}>

                <Typography

                  variant="body1"
                  color="text.primary"
                  dangerouslySetInnerHTML={{
                    __html: cleanHtmlMessage(item.Message),
                  }}
                />

              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mt: 2,
                  gap: 1,
                }}
              >
              </Box>
            </Scrollbar>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" sx={{ width: { lg: 140, xs: 119 } }} onClick={() => handleConfirm()}>
              Mark as Read
            </Button>
            <Button variant="contained" sx={{ width: { lg: 140, xs: 139 } }} onClick={handleClose}>
              Remind me later
            </Button>
          </DialogActions>
        </Dialog>
      ))}
    </>
  );
};

export default FeeextensionPopup;
