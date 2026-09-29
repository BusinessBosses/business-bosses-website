"use client";
import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Chip from "@mui/material/Chip";
import { withDefaults, WebsiteMagazineContent } from "../../../../lib/site-content";

export default function MagazineSection({ content }: { content?: Partial<WebsiteMagazineContent> }) {
  const mag = withDefaults<WebsiteMagazineContent>("bb_website_magazine", content);

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: "#ffffff",
        position: "relative",
      }}
    >
      <Container maxWidth="lg">
        {/* Dashed outer card matching prototype */}
        <Box
          sx={{
            position: "relative",
            border: "1.5px dashed #E53E3E",
            borderRadius: "24px",
            p: { xs: 3, sm: 5, md: 7 },
            pt: { xs: 5, sm: 6, md: 7 },
            bgcolor: "#FAFAFA",
          }}
        >
          {/* Eyebrow badge docked at top-left border */}
          {mag.badge && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: { xs: 20, sm: 36 },
                transform: "translateY(-50%)",
                bgcolor: "#D93829",
                color: "#ffffff",
                px: 2,
                py: 0.6,
                borderRadius: "9999px",
                fontSize: { xs: "0.68rem", sm: "0.75rem" },
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                boxShadow: "0 2px 8px rgba(217, 56, 41, 0.25)",
              }}
            >
              {mag.badge}
            </Box>
          )}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "320px 1fr" },
              gap: { xs: 4, md: 6 },
              alignItems: "center",
            }}
          >
            {/* Magazine Cover with Book Drop Shadow */}
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "center", md: "flex-start" },
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: { xs: "220px", sm: "260px", md: "290px" },
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow:
                    "0 20px 35px -5px rgba(0, 0, 0, 0.35), 0 10px 15px -5px rgba(0, 0, 0, 0.2)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px) scale(1.02)",
                    boxShadow:
                      "0 25px 45px -5px rgba(0, 0, 0, 0.4), 0 15px 20px -5px rgba(0, 0, 0, 0.25)",
                  },
                }}
              >
                <img
                  src={mag.coverImage || "/magazine_issue_01.png"}
                  alt={mag.title || "Business Bosses Magazine Cover"}
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    objectFit: "cover",
                  }}
                />
              </Box>
            </Box>

            {/* Content Details */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              {/* Issue Subtitle */}
              {mag.issueSubtitle && (
                <Typography
                  variant="caption"
                  sx={{
                    color: "#D93829",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    fontSize: { xs: "0.72rem", sm: "0.82rem" },
                    textTransform: "uppercase",
                  }}
                >
                  {mag.issueSubtitle}
                </Typography>
              )}

              {/* Title */}
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  color: "#111827",
                  fontWeight: 800,
                  fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.75rem" },
                  lineHeight: 1.15,
                }}
              >
                {mag.title}
              </Typography>

              {/* Description */}
              <Typography
                variant="body1"
                sx={{
                  color: "#6B7280",
                  fontSize: { xs: "0.95rem", sm: "1.05rem" },
                  lineHeight: 1.6,
                  maxWidth: "600px",
                }}
              >
                {mag.description}
              </Typography>

              {/* Tags Pills */}
              {mag.tags && mag.tags.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: 1.2,
                    pt: 0.5,
                  }}
                >
                  {mag.tags
                    .filter((tag) => Boolean(tag && tag.trim()))
                    .map((tag, idx) => (
                      <Box
                        key={idx}
                        component="span"
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          px: 2,
                          py: 0.7,
                          borderRadius: "9999px",
                          bgcolor: "#FFFFFF !important",
                          background: "#FFFFFF !important",
                          border: "1px solid #E5E7EB",
                          color: "#1F2937 !important",
                          fontWeight: 600,
                          fontSize: "0.78rem",
                          lineHeight: 1.2,
                          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.04)",
                        }}
                      >
                        {tag.trim()}
                      </Box>
                    ))}
                </Box>
              )}

              {/* Action Buttons */}
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: 3,
                  pt: 1.5,
                }}
              >
                <Button
                  component="a"
                  href={mag.readButtonLink || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="contained"
                  disableElevation
                  sx={{
                    bgcolor: "#D93829 !important",
                    background: "#D93829 !important",
                    backgroundImage: "none !important",
                    color: "#ffffff !important",
                    px: 3.5,
                    py: 1.4,
                    borderRadius: "8px",
                    fontWeight: 700,
                    textTransform: "none",
                    fontSize: "0.95rem",
                    border: "none !important",
                    boxShadow: "0 4px 14px rgba(217, 56, 41, 0.35) !important",
                    "&:hover": {
                      bgcolor: "#B82C1F !important",
                      background: "#B82C1F !important",
                      backgroundImage: "none !important",
                    },
                  }}
                >
                  {mag.readButtonText || "Read the latest issue"}
                </Button>

                {mag.allIssuesText && (
                  <Link
                    href={mag.allIssuesLink || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    sx={{
                      color: "#111827",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      display: "inline-flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    {mag.allIssuesText}
                  </Link>
                )}
              </Box>

              {/* Contact / Get Featured footer link */}
              {mag.contactText && (
                <Box sx={{ pt: 1 }}>
                  <Link
                    href={mag.contactLink || "mailto:support@businessbosses.org"}
                    underline="hover"
                    sx={{
                      color: "#D93829",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                    }}
                  >
                    {mag.contactText}
                  </Link>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
