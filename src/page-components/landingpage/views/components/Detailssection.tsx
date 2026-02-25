"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/system";

const items = [
  {
    title: "130,000+",
    subtext: "Entrepreneurs Reached",
  },
  {
    title: "23,000+",
    subtext: "Businesses",
  },
  {
    title: "50+",
    subtext: "Countries Globally",
  },
];

const logoStyle = {
  width: "100px",
  height: "80px",
  margin: "0 32px",
  opacity: 0.7,
};

export default function Detailssection() {
  const theme = useTheme();

  return (
    <Box id="Detailssection" sx={{ py: 4 }}>
      <Grid container sx={{ justifyContent: "center", mt: 0.5, opacity: 0.6 }}>
        {items.map((item, index) => (
          <Grid item key={index} sx={{ textAlign: 'center', ml: 10 , mr:10, mt:3 , mb:3}}>
            <Box>
              <Typography
                gutterBottom
                sx={{ fontWeight: "bold", color: "#232324", fontSize: "30px" }}
              >
                {item.title}
              </Typography>
              <Typography variant="body2" sx={{ color: "black" }}>
                {item.subtext}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
