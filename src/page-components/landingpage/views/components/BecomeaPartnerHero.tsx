"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Assets from "../../../../assets";
import BecomeAPartnerForm from "./BecomeAPartnerForm";
import { useRouter } from "../../../../common/hooks/useAppNavigation";

export default function BecomeAPartnerHero() {
  const router = useRouter();

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#f4f4f4",
        minHeight: "100vh",
        pb: 10,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          backgroundColor: "#ffffff",
          position: "sticky",
          top: 0,
          zIndex: 100,
          mb: 3,
        }}
      >
        <Box
          onClick={() => router.back()}
          sx={{
            position: "absolute",
            left: 20,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: "#F4F4F4",
          }}
        >
          <Assets.Backbutton width={20} height={20} />
        </Box>
        <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>
          Become a Partner
        </Typography>
      </Box>

      <Container maxWidth="sm">
        <BecomeAPartnerForm />
      </Container>
    </Box>
  );
}
