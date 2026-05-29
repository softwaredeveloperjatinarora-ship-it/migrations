import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Image from "next/image";
import { getBannerAction } from "@/utils/loginslider/getBannerAction";
import { Card, Skeleton, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { Icon } from "@iconify/react";
import Link from "next/link";

const BannerSlider = () => {
  const isDataFetched = useRef(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [bannerdata, setBanner] = useState<any[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const defaultBanner = "/images/landingpage/default-banner.jpg";
  const defaultImages = [{ Uri: defaultBanner, Link: "#" }];

  useEffect(() => {
    const fetchBannerData = async () => {
      if (isDataFetched.current) return;

      try {
        setLoading(true);
        const response = await getBannerAction();

        if (response?.status === "success" && Array.isArray(response?.ApiData) && response.ApiData.length > 0) {
          setBanner(response.ApiData);
          setError(false);
        } else {
          setBanner(defaultImages);
          setError(true);
        }
      } catch (err) {
        setBanner(defaultImages);
        setError(true);
      } finally {
        setLoading(false);
        isDataFetched.current = true;
      }
    };

    fetchBannerData();
  }, []);

  useEffect(() => {
    if (bannerdata.length > 1 && !isHovered) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % bannerdata.length);
      }, 5000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [bannerdata.length, currentSlide, isHovered]);

  const goToSlide = (index: number) => {
    if (index < 0 || index >= bannerdata.length) return;
    setCurrentSlide(index);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (bannerdata.length > 1 && !isHovered) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % bannerdata.length);
      }, 5000);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          width: "605px",
          borderRadius: "8px",
          height: { lg: "580px", md: "310px", sm: "150px", xs: "150px" },
        }}
      >
        <LoadingSkeleton />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        overflow: "hidden",
        position: "relative",
        width: "605px",
        borderRadius: "8px",
        height: { lg: "595px", md: "310px", sm: "150px", xs: "150px" },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {error || !Array.isArray(bannerdata) || bannerdata.length === 0 ? (
        <DefaultBannerView />
      ) : (
        <>
          <Box sx={{ position: "absolute", top: 10, left: 10, zIndex: 2 }}>
            <Image
              src="/images/backgrounds/seal.svg"
              alt="Seal Logo"
              width={60}
              height={60}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              transition: "transform 0.5s ease",
              width: `${bannerdata.length * 100}%`,
              height: "100%",
              transform: `translateX(-${currentSlide * (100 / bannerdata.length)}%)`,
            }}
          >
            {Array.isArray(bannerdata) &&
              bannerdata.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    flex: `0 0 ${100 / bannerdata.length}%`,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <Link
                    href={item.Link || "#"}
                    target="_blank"
                    style={{ display: "block", height: "100%" }}
                  >
                    <Image
                      src={item.Uri || defaultBanner}
                      alt={`Banner ${index + 1}`}
                      fill
                      style={{ objectFit: "cover" }}
                      priority={index === 0}
                    />
                  </Link>
                </Box>
              ))}
          </Box>

          {bannerdata.length > 1 && (
            <Box
              sx={{
                position: "absolute",
                top: "16px",
                right: "16px",
                display: "flex",
                gap: "6px",
                zIndex: 1,
                padding: "4px 8px",
                borderRadius: "12px",
                backdropFilter: "blur(2px)",
              }}
            >
              {bannerdata.map((_, index) => (
                <Box
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    goToSlide(index);
                  }}
                  sx={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor:
                      index === currentSlide ? "#ffffff" : "rgba(255, 255, 255, 0.5)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#ffffff",
                      transform: "scale(1.2)",
                    },
                  }}
                />
              ))}
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

const DefaultBannerView = () => (
  <Grid
    container
    justifyContent="center"
    alignItems="center"
    sx={{
      backgroundImage: 'url(/images/backgrounds/profilebg-3.jpg)',
      backgroundSize: "cover",
      height: "595px",
      width: "605px",
    }}
  >
    <Grid textAlign="center">
      <Image src="/images/backgrounds/seal.svg" alt="Seal" width={150} height={150} />
      <Card sx={{ p: 4, maxWidth: "80%", mx: "auto", mt: 2 }}>
        <Typography variant="h5" color="primary" fontWeight="bold">
          Welcome to LPU - UMS
        </Typography>
        <Typography variant="body1" mt={1}>
          A smart home-grown web-based ERP solution
        </Typography>
      </Card>
      <Image
        src="/images/backgrounds/qr-code.png"
        alt="QR Code"
        width={120}
        height={120}
        style={{ marginTop: "20px" }}
      />
      <Typography variant="h6" mt={2}>Download Our Official App</Typography>
    </Grid>
  </Grid>
);

const LoadingSkeleton = () => (
  <Card sx={{ backgroundColor: "transparent" }}>
    <Stack direction="row" gap={2} sx={{ display: "flex", alignItems: "center", overflow: "hidden" }}>
      <Box
        sx={{
          width: "100%",
          height: { lg: "519px", md: "310px", sm: "150px", xs: "150px" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "8px",
        }}
      >
        <Skeleton variant="rectangular" width="100%" height="100%" sx={{ position: "absolute", top: 0, left: 0 }} />
        <Icon icon="fluent:image-multiple-off-16-regular" width="60" height="60" color="#ccc" />
      </Box>
    </Stack>
  </Card>
);

export default BannerSlider;
