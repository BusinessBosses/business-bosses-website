import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import DownloadIcon from "@mui/icons-material/Download";

interface MagazineIssue {
  id: string;
  title: string;
  issue_number?: string;
  description?: string;
  cover_image_url?: string;
  pdf_url: string;
  publish_date: string;
}

interface MagazineSpotlightProps {
  latestIssue: MagazineIssue | null;
}

const TOC_ITEMS = [
  { section: "Cover Story", detail: "Abubakar Nur Khalil: From Vision to Venture" },
  { section: "The Next Big Idea", detail: "Prodatar: the trusted record of your business identity" },
  { section: "The Shift", detail: "Why Africa's early-stage startups are attracting global attention" },
  { section: "Founder's Playbook", detail: "5 lessons from building, scaling and staying agile" },
  { section: "The Signal", detail: "The trends, stats and opportunities shaping the next chapter" },
];

export default function MagazineSpotlight({ latestIssue }: MagazineSpotlightProps) {
  return (
    <Box sx={{ py: 8, backgroundColor: "#FAFAFA", borderTop: "1px solid #F1F5F9", borderBottom: "1px solid #F1F5F9" }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          {/* Cover Column */}
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                position: "relative",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.2)",
                border: "1px solid #E2E8F0",
                backgroundColor: "#0F172A",
                aspectRatio: "3/4",
                maxHeight: "520px",
                mx: "auto",
              }}
            >
              <CardMedia
                component="img"
                image={latestIssue?.cover_image_url || "https://f005.backblazeb2.com/file/business-bosses-alt/uploads/1790681821114-dcaa8856f97ce667.png"}
                alt={latestIssue?.title || "Business Bosses Magazine Cover"}
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
          </Grid>

          {/* Content Column */}
          <Grid item xs={12} md={7}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
              <Chip label="LATEST ISSUE" size="small" sx={{ bgcolor: "#E11D48", color: "#FFF", fontWeight: 800, fontSize: "11px", px: 1 }} />
              <Typography sx={{ fontSize: "13px", color: "#64748B", fontWeight: 600 }}>
                {latestIssue?.issue_number || "Issue 01"} • {latestIssue?.publish_date ? new Date(latestIssue.publish_date).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "September 2026"}
              </Typography>
            </Box>

            <Typography variant="h3" sx={{ fontWeight: 900, fontSize: { xs: "28px", md: "38px" }, color: "#0F172A", mb: 2 }}>
              {latestIssue?.title || "From Vision to Venture"}
            </Typography>

            <Typography sx={{ fontSize: "16px", color: "#475569", mb: 4, lineHeight: 1.6 }}>
              {latestIssue?.description || "Our first issue features Abubakar Nur Khalil, Founder and CEO of Recursive Capital, on building, raising and delivering."}
            </Typography>

            {/* Table of contents */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4, borderTop: "1px solid #E2E8F0", pt: 3 }}>
              {TOC_ITEMS.map((item, idx) => (
                <Grid container key={idx} spacing={2} sx={{ borderBottom: "1px dashed #F1F5F9", pb: 1.5 }}>
                  <Grid item xs={4} sm={3}>
                    <Typography sx={{ fontWeight: 700, fontSize: "13px", color: "#0F172A" }}>{item.section}</Typography>
                  </Grid>
                  <Grid item xs={8} sm={9}>
                    <Typography sx={{ fontSize: "13px", color: "#64748B" }}>{item.detail}</Typography>
                  </Grid>
                </Grid>
              ))}
            </Box>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              {latestIssue?.pdf_url && (
                <Button
                  variant="contained"
                  onClick={() => window.open(latestIssue.pdf_url, "_blank")}
                  sx={{
                    backgroundColor: "#E11D48",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    px: 3,
                    py: 1.2,
                    borderRadius: "8px",
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#BE123C" },
                  }}
                >
                  Read Issue 01
                </Button>
              )}
              {latestIssue?.pdf_url && (
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  href={latestIssue.pdf_url}
                  download
                  sx={{
                    borderColor: "#CBD5E1",
                    color: "#0F172A",
                    fontWeight: 700,
                    px: 3,
                    py: 1.2,
                    borderRadius: "8px",
                    textTransform: "none",
                    "&:hover": { borderColor: "#94A3B8" },
                  }}
                >
                  Download PDF
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
