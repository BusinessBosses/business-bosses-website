import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

interface MagazineHeaderProps {
  onReadLatest: () => void;
  onGetFeatured: () => void;
}

export default function MagazineHeader({ onReadLatest, onGetFeatured }: MagazineHeaderProps) {
  return (
    <Box sx={{ pt: { xs: 8, md: 10 }, pb: { xs: 6, md: 8 }, textAlign: "center", backgroundColor: "#FAFAFA" }}>
      <Container maxWidth="md">
        <Typography
          sx={{
            color: "#E11D48",
            fontWeight: 800,
            fontSize: "13px",
            letterSpacing: "2px",
            mb: 1.5,
            textTransform: "uppercase",
          }}
        >
          BUSINESS BOSSES MAGAZINE
        </Typography>
        <Typography
          variant="h1"
          sx={{
            fontWeight: 900,
            fontSize: { xs: "32px", sm: "44px", md: "52px" },
            color: "#0F172A",
            lineHeight: 1.15,
            mb: 2.5,
            letterSpacing: "-0.5px",
          }}
        >
          Stories from the people building what’s next
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: "16px", md: "18px" },
            color: "#64748B",
            maxWidth: "680px",
            mx: "auto",
            mb: 4,
            lineHeight: 1.6,
          }}
        >
          A free monthly digital magazine for visionary leaders and bold builders. Founder stories, big ideas and practical lessons you can use in your business.
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap", mb: 4 }}>
          <Button
            variant="contained"
            size="large"
            onClick={onReadLatest}
            sx={{
              backgroundColor: "#E11D48",
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: "15px",
              px: 3.5,
              py: 1.4,
              borderRadius: "8px",
              textTransform: "none",
              boxShadow: "0 4px 14px rgba(225, 29, 72, 0.3)",
              "&:hover": { backgroundColor: "#BE123C" },
            }}
          >
            Read the latest issue
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={onGetFeatured}
            sx={{
              borderColor: "#CBD5E1",
              color: "#334155",
              fontWeight: 700,
              fontSize: "15px",
              px: 3.5,
              py: 1.4,
              borderRadius: "8px",
              textTransform: "none",
              "&:hover": { borderColor: "#94A3B8", backgroundColor: "#F8FAFC" },
            }}
          >
            Get featured
          </Button>
        </Box>

        <Typography sx={{ fontSize: "13px", color: "#94A3B8", fontWeight: 500 }}>
          Free to read &nbsp;•&nbsp; New issue every month &nbsp;•&nbsp; Read on any device
        </Typography>
      </Container>
    </Box>
  );
}
