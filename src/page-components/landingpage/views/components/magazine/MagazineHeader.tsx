import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import Skeleton from "@mui/material/Skeleton";
import { MagazinePageHeaderContent } from "../../../../../lib/site-content";

interface MagazineHeaderProps {
  onReadLatest: () => void;
  onGetFeatured: () => void;
  content?: MagazinePageHeaderContent;
  loading?: boolean;
}

export default function MagazineHeader({ onReadLatest, onGetFeatured, content, loading = false }: MagazineHeaderProps) {
  const badge = content?.badge || "BUSINESS BOSSES MAGAZINE";
  const title = content?.title || "Stories from the people building what’s next";
  const description =
    content?.description ||
    "A free monthly digital magazine for visionary leaders and bold builders. Founder stories, big ideas and practical lessons you can use in your business.";
  const readBtnText = content?.readBtnText || "Read the latest issue";
  const featuredBtnText = content?.featuredBtnText || "Get featured";
  const tagline = content?.tagline || "Free to read • New issue every month • Read on any device";

  return (
    <Box sx={{ pt: { xs: 8, md: 10 }, pb: { xs: 6, md: 8 }, textAlign: "center", backgroundColor: "#FAFAFA" }}>
      <Container maxWidth="md">
        {loading ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Skeleton variant="rounded" width={180} height={24} sx={{ mb: 2, borderRadius: "9999px" }} />
            <Skeleton width="80%" height={48} sx={{ mb: 1 }} />
            <Skeleton width="60%" height={48} sx={{ mb: 2 }} />
            <Skeleton width="90%" height={24} />
            <Skeleton width="75%" height={24} sx={{ mb: 4 }} />
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              <Skeleton variant="rounded" width={180} height={46} sx={{ borderRadius: "8px" }} />
              <Skeleton variant="rounded" width={140} height={46} sx={{ borderRadius: "8px" }} />
            </Box>
            <Skeleton width={300} height={20} />
          </Box>
        ) : (
          <>
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
              {badge}
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
              {title}
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
              {description}
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
                {readBtnText}
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
                {featuredBtnText}
              </Button>
            </Box>

            <Typography sx={{ fontSize: "13px", color: "#94A3B8", fontWeight: 500 }}>
              {tagline}
            </Typography>
          </>
        )}
      </Container>
    </Box>
  );
}
