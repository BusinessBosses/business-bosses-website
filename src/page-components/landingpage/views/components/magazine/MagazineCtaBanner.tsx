import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

import { MagazinePageCtaContent } from "../../../../../lib/site-content";

interface MagazineCtaBannerProps {
  onGetFeatured: () => void;
  content?: MagazinePageCtaContent;
}

const FEATURE_POINTS = [
  { num: "01", title: "Founder profile", desc: "Your journey, your business and what you've learned, told in your words." },
  { num: "02", title: "The Next Big Idea", desc: "Building something new? Show our readers the product or idea behind it." },
  { num: "03", title: "Founder's Playbook", desc: "Share a practical lesson other business owners can put to work." },
];

export default function MagazineCtaBanner({ onGetFeatured, content }: MagazineCtaBannerProps) {
  const badge = content?.badge || "GET FEATURED";
  const title = content?.title || "Tell your story in the next issue";
  const description =
    content?.description ||
    "Founder profiles, The Next Big Idea and Founder’s Playbook. For visionary leaders and bold builders.";
  const btnText = content?.btnText || "Get featured";
  const tagline = content?.tagline || "Free to apply • Selected by our editors";

  return (
    <Box sx={{ py: 10, backgroundColor: "#0B0F19", color: "#FFFFFF" }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography sx={{ color: "#E11D48", fontWeight: 800, fontSize: "12px", letterSpacing: "1.5px", mb: 1 }}>
              {badge}
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 900, fontSize: { xs: "32px", md: "44px" }, mb: 2, lineHeight: 1.1 }}>
              {title}
            </Typography>
            <Typography sx={{ fontSize: "16px", color: "#94A3B8", mb: 4, lineHeight: 1.6 }}>
              {description}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                onClick={onGetFeatured}
                sx={{
                  backgroundColor: "#E11D48",
                  color: "#FFFFFF",
                  fontWeight: 800,
                  px: 3.5,
                  py: 1.4,
                  borderRadius: "8px",
                  textTransform: "none",
                  "&:hover": { backgroundColor: "#BE123C" },
                }}
              >
                {btnText}
              </Button>
              <Typography sx={{ fontSize: "13px", color: "#64748B" }}>
                {tagline}
              </Typography>
            </Box>
          </Grid>

          {/* Feature Options List */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {FEATURE_POINTS.map((item) => (
                <Box
                  key={item.num}
                  sx={{
                    p: 2.5,
                    borderRadius: "12px",
                    backgroundColor: "#161F30",
                    border: "1px solid #1E293B",
                    display: "flex",
                    gap: 2,
                  }}
                >
                  <Typography sx={{ color: "#E11D48", fontWeight: 800, fontSize: "14px" }}>{item.num}</Typography>
                  <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: "15px", color: "#FFFFFF", mb: 0.5 }}>{item.title}</Typography>
                    <Typography sx={{ fontSize: "13px", color: "#94A3B8", lineHeight: 1.5 }}>{item.desc}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
