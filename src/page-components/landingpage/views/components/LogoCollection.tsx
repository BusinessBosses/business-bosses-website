"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/system";
import Assets from "../../../../assets";

const whiteLogos = [
  Assets.logo1,
  Assets.logo2,
  Assets.logo3,
  Assets.logo4,
  Assets.logo5,
];

const darkLogos = [
  Assets.logo1,
  Assets.logo2,
  Assets.logo3,
  Assets.logo4,
  Assets.logo5,
];

const logoStyle = {
  width: "120px",
  height: "100px",
  margin: "0 32px",
  opacity: 1.0,
};

export default function LogoCollection() {
  const theme = useTheme();
  const logos = theme.palette.mode === "light" ? darkLogos : whiteLogos;

  return (
    <Box id="logoCollection" sx={{ py: 4 }}>
      <Typography
        component="p"
        variant="subtitle2"
        align="center"
        sx={{ color: "text.secondary" }}
      >
        Our Partners
      </Typography>
      <Grid container sx={{ justifyContent: "center", mt: 0.5, opacity: 0.6 }}>
        {logos.map((logo, index) => (
          <Grid item key={index}>
            <img
              src={logo}
              // alt={`Fake company number ${index + 1}`}
              style={logoStyle}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
