import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Assets from "../../../../../assets";

export default function MagazineFooter() {
  return (
    <Box sx={{ py: 4, backgroundColor: "#FFFFFF", borderTop: "1px solid #E2E8F0" }}>
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        {/* Brand */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <img
            src={Assets.Logo}
            alt="Business Bosses Logo"
            style={{ width: 28, height: 28 }}
          />
          <Typography sx={{ fontWeight: 700, fontSize: "14px", color: "#0F172A" }}>
            Business Bosses
          </Typography>
        </Box>

        {/* Links and Copyright */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: { xs: 2, sm: 3 },
            justifyContent: { xs: "center", sm: "flex-end" },
          }}
        >
          <Link
            href="mailto:support@businessbosses.co.uk"
            sx={{
              color: "#64748B",
              fontSize: "13px",
              textDecoration: "none",
              "&:hover": { color: "#0F172A", textDecoration: "underline" },
            }}
          >
            support@businessbosses.co.uk
          </Link>
          <Link
            href="/privacypolicy"
            sx={{
              color: "#64748B",
              fontSize: "13px",
              textDecoration: "none",
              "&:hover": { color: "#0F172A", textDecoration: "underline" },
            }}
          >
            Privacy
          </Link>
          <Link
            href="#"
            sx={{
              color: "#64748B",
              fontSize: "13px",
              textDecoration: "none",
              "&:hover": { color: "#0F172A", textDecoration: "underline" },
            }}
          >
            Terms
          </Link>
          <Typography sx={{ fontSize: "13px", color: "#94A3B8" }} suppressHydrationWarning>
            © {new Date().getFullYear()} Business Bosses
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
