"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";
import ConstructionRoundedIcon from "@mui/icons-material/ConstructionRounded";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import SettingsSuggestRoundedIcon from "@mui/icons-material/SettingsSuggestRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import ThumbUpAltRoundedIcon from "@mui/icons-material/ThumbUpAltRounded";
import Assets from "../../../../assets";

const items = [
  {
    icon: Assets.marketplacelanding,
    title: "Marketplace",
    description:
      "An e-commerce section to sell your products and services globally",
  },
  {
    icon: Assets.monetisation,
    title: "Monetisation",
    description:
      "Earn digital coins posting resources that are valuable to other entrepreneurs and withdraw in cash ",
  },
  {
    icon: Assets.liveevents,
    title: "Live Events",
    description:
      "Host live events, live classes and workshops to promote your products or services to generate leads.",
  },
  {
    icon: Assets.businesstools,
    title: "News",
    description:
      "Stay updated with the latest business news, trends, and insights to keep your business ahead.",
  },
  {
    icon: Assets.analyser,
    title: "Analyser",
    description:
      "Valuable insights into user networking activities and ranking to help track growth.",
  },
  {
    icon: Assets.suppliers,
    title: "Find Suppliers",
    description:
      "Find verified suppliers and manufacturer to source wholesale priced goods",
  },
];

export default function Highlights() {
  return (
    <Box
      id="highlights"
      sx={{
        backgroundRepeat: "no-repeat",
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: "white",
        bgcolor: "#ffffff",
      }}
    >
      <Container
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Box
          sx={{
            width: { sm: "100%", md: "60%" },
            textAlign: { sm: "left", md: "center" },
          }}
        >
          <Typography
            component="h1"
            variant="h1"
            sx={{
              color: "#232324",
              fontSize: { xs: "20px", md: "30px" },
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            Benefits of Joining Business Bosses
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "grey",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            We empower you with resources to start, promote and grow your
            business.
          </Typography>
        </Box>
        <Grid container spacing={2.5}>
          {items.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Stack
                direction="column"
                component={Card}
                spacing={1}
                useFlexGap
                sx={{
                  color: "inherit",
                  p: 3,
                  height: "100%",
                  // border: "1px solid",
                  // borderColor: "hsla(220, 25%, 25%, .3)",
                  background: "transparent",
                  backgroundColor: "#ffffff",
                  boxShadow: "none",
                }}
              >
                <img src={item.icon} alt={item.title} width="60" height="60" />
                <div>
                  <Typography
                    gutterBottom
                    sx={{ fontWeight: "bold", color: "#232324" }}
                  >
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "grey" }}>
                    {item.description}
                  </Typography>
                </div>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
