"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Assets from "../../../../assets";
import ApplyFeaturedForm from "./ApplyFeaturedForm";
import { useRouter } from "../../../../common/hooks/useAppNavigation";

export default function ApplyFeaturedHero() {
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
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
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
        <Typography sx={{ fontSize: "18px", fontWeight: 700, color: "#1B1B1E" }}>
          Apply to be Featured
        </Typography>
      </Box>

      <Container maxWidth="sm">
        <ApplyFeaturedForm />
      </Container>
    </Box>
  );
}
