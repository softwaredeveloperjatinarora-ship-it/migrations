
import React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Grid from "@mui/material/Grid";
import { Theme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import NextLink from "next/link";

import { IconCircle } from "@tabler/icons-react";
import { Icon } from "@iconify/react";
import Link from "next/link";

interface BreadCrumbItem {
  title: string;
  to?: string;
  icon?: string;
}

interface BreadCrumbType {
  subtitle?: string;
  items?: BreadCrumbItem[];
  title: string;
  titleIcon?: string; // ✅ Optional icon before the title
  children?: React.ReactNode;
}

const Breadcrumb = ({ subtitle, items, title, titleIcon }: BreadCrumbType) => {
  const lgDown = useMediaQuery((theme: any) => theme.breakpoints.down("lg"));

  return (
    <Grid
      container
      sx={{
        backgroundColor: (theme) => theme.palette.background.paper,
        borderRadius: (theme: Theme) => (theme.shape.borderRadius as number) / 18,
        p: "30px 25px 20px",
        marginBottom: "30px",
        position: "relative",
        overflow: "hidden",
        marginTop: lgDown ? 3 : 0,
      }}
    >
      {/* Title Section */}
      <Grid  size={{ lg: 8, xs: 12,sm:6 }} mb={1}>
        <Typography
          variant="h4"
          mb={0}
          sx={{ display: "flex", alignItems: "center" }}
        >
          {titleIcon && (
            <Icon
              icon={titleIcon}
              style={{ marginRight: 8, fontSize: 24 }}
            />
          )}
          {title}
        </Typography>
      </Grid>

      {/* Subtitle & Breadcrumbs */}
      <Grid
      size={{ lg: 4, xs: 12,sm:6 }}
     
        mb={1}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          flexWrap: "wrap",
        }}
      >
        {subtitle && (
          <Typography
            color="textSecondary"
            variant="h6"
            fontWeight={400}
            mb={0}
            mr={2}
          >
            {subtitle}
          </Typography>
        )}

        <Breadcrumbs
          separator={
            <IconCircle
              size="5"
              fill="textSecondary"
              fillOpacity={"0.6"}
              style={{ margin: "0 5px" }}
            />
          }
          sx={{ alignItems: "center" }}
          aria-label="breadcrumb"
        >
          {items?.map((item) => (
            <div key={item.title}>
              {item.to ? (
                <Link href={item.to} passHref>
                  
                  <Typography
                  // component="a"
                    color="textSecondary"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    {item.icon && (
                      <Icon
                        icon={item.icon}
                        style={{ marginRight: 6, fontSize: 20 }}
                      />
                    )}
                    {item.title}
                  </Typography>
                </Link>
              ) : (
                <Typography
                  color="textPrimary"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  {item.icon && (
                    <Icon
                      icon={item.icon}
                      style={{ marginRight: 6, fontSize: 20 }}
                    />
                  )}
                  {item.title}
                </Typography>
              )}
            </div>
          ))}
        </Breadcrumbs>
      </Grid>
    </Grid>
  );
};

export default Breadcrumb;
