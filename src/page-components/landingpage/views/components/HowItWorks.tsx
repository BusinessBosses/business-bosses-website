"use client";
import { Box, Card, Container, Grid, Stack, Typography } from "@mui/material";
import React from "react";
import Assets from "../../../../assets";
import RoutesPath from "../../../../constants/Routes";
import { useRouter } from "../../../../common/hooks/useAppNavigation";

const items = [
  {
    icon: Assets.hiwone,
    title: "Choose Partnership",
    description:
      "Choose type of partnership or customised to suit your brand or organisation ",
  },
  {
    icon: Assets.hiwtwo,
    title: "Set Up",
    description:
      "Provide information about your brand or organisation to help set up your partnership ",
  },
  {
    icon: Assets.hiwthree,
    title: "Get Featured",
    description:
      "Become a partner, get featured and receive partnership success report",
  },
];

const HowItWorks: React.FC<{ onBecomePartner?: () => void }> = ({ onBecomePartner }) => {
  const router = useRouter();
  return (
    <Box
      id="highlights"
      sx={{
        backgroundRepeat: "no-repeat",
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: "white",
        bgcolor: "#f4f4f4",
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
            How It Works
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
                alignItems="center"
                sx={{
                  color: "inherit",
                  p: 3,
                  height: "100%",
                  border: "0px solid",
                  // borderColor: "hsla(220, 25%, 25%, .3)",
                  background: "transparent",
                  backgroundColor: "transparent",
                  boxShadow: "none",
                }}
              >
                <img src={item.icon} width="150" height="150" />
                <div style={{ textAlign: "center" }}>
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
        <div
          className="px-5 pt-2 "
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="mt-3 gap-2">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <button
                onClick={onBecomePartner ? onBecomePartner : () => router.push(RoutesPath.becomeapartner)}
                className="bg-primary rounded-xl py-3.5 text-white text-md flex items-center justify-center font-bold p-2 px-20"
              >
                Become A Partner
              </button>
            </div>
          </div>
        </div>
      </Container>
    </Box>
  );
};

export default HowItWorks;
