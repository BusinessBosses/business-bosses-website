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
    icon: Assets.pwu1,
    title: "Get More Customers",
    description:
      "We showcase your product promotions, and deals, driving revenue growth and expanding your customer base",
  },
  {
    icon: Assets.pwu2,
    title: "Selected Referrals",
    description:
      "We can refer potential customers to your brand, fostering new leads generation, new customer relationships and loyalty",
  },
  {
    icon: Assets.pwu3,
    title: "Exclusive Brand Positioning",
    description:
      "We help position your brand as a supporter of entrepreneurship within the business community to attract potential leads",
  },
  {
    icon: Assets.pwu4,
    title: "Entrepreneurial Support",
    description:
      "We can provide resources, encourage innovation, technology adoption, and regulatory guidance to entrepreneurs.",
  },
  {
    icon: Assets.pwu5,
    title: "Economic Development",
    description:
      "We can help support local economic growth by promoting entrepreneurship, job creation within a given region",
  },
  {
    icon: Assets.pwu6,
    title: "Community Engagement",
    description:
      "We can help engage with businesses seeking feedback and support, to build stronger relationships within communities.",
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
            Why Partner with Us
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "grey",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            Business Bosses is an entrepreneurship empowerment platform,
            connecting your brand or organisation with over 130,000
            entrepreneurs across 50+ countries
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
                <img src={item.icon} width="60" height="60" />
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
