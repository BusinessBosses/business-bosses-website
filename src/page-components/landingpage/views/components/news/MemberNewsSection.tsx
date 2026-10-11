import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import { NewsArticle } from "./NewsFeed";

interface MemberNewsSectionProps {
  memberArticles: NewsArticle[];
  onSubmitModalOpen: () => void;
  loading?: boolean;
}

const RULES = [
  "Verified businesses only",
  "Headline, 150-300 words, one image and one link",
  "Real news only: no adverts or discount offers",
  "Reviewed by our team before it goes live",
];

export default function MemberNewsSection({ memberArticles, onSubmitModalOpen, loading = false }: MemberNewsSectionProps) {
  return (
    <Container maxWidth="lg">
      <Box sx={{ pt: 6, borderTop: "1px solid #E2E8F0" }}>
        <Typography sx={{ fontWeight: 800, color: "#E11D48", fontSize: "12px", letterSpacing: "1.5px", mb: 0.5 }}>
          MEMBER NEWS
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 900, color: "#0F172A", mb: 1 }}>
          News from verified Business Bosses
        </Typography>
        <Typography sx={{ fontSize: "14px", color: "#64748B", mb: 5 }}>
          Launches, milestones and announcements from businesses in our community. Every post is submitted by a verified member.
        </Typography>

        <Grid container spacing={4}>
          {/* Left Column: Member News Posts */}
          <Grid item xs={12} md={7}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {loading ? (
                [1, 2].map((idx) => (
                  <Card
                    key={idx}
                    elevation={0}
                    sx={{ p: 2.5, borderRadius: "16px", border: "1px solid #E2E8F0", bgcolor: "#FFFFFF", display: "flex", gap: 2.5, alignItems: "center" }}
                  >
                    <Skeleton variant="rectangular" sx={{ width: "120px", height: "100px", borderRadius: "10px" }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Skeleton width="40%" height={20} sx={{ mb: 1 }} />
                      <Skeleton width="90%" height={26} sx={{ mb: 1 }} />
                      <Skeleton width="75%" height={18} />
                    </Box>
                  </Card>
                ))
              ) : memberArticles.length === 0 ? (
                <Card elevation={0} sx={{ p: 4, border: "1px dashed #CBD5E1", borderRadius: "12px", textAlign: "center", bgcolor: "#FFFFFF" }}>
                  <Typography sx={{ color: "#64748B", fontWeight: 600 }}>
                    No member news submitted yet. Be the first verified business to submit news!
                  </Typography>
                </Card>
              ) : (
                memberArticles.map((memberPost) => (
                  <Card
                    key={memberPost.id}
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: "16px",
                      border: "1px solid #E2E8F0",
                      bgcolor: "#FFFFFF",
                      display: "flex",
                      gap: 2.5,
                      alignItems: "center",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={memberPost.image_url}
                      alt=""
                      sx={{ width: "120px", height: "100px", borderRadius: "10px", objectFit: "cover" }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                        <Typography sx={{ fontWeight: 800, fontSize: "12px", color: "#0F172A" }}>
                          {memberPost.author_name || "Verified Member"}
                        </Typography>
                        <Chip label="Verified" size="small" sx={{ bgcolor: "#DCFCE7", color: "#166534", fontWeight: 800, fontSize: "10px", height: "20px" }} />
                      </Box>
                      <Typography sx={{ fontWeight: 800, fontSize: "15px", color: "#0F172A", mb: 0.5, lineHeight: 1.3 }}>
                        {memberPost.title}
                      </Typography>
                      <Typography sx={{ fontSize: "12px", color: "#64748B", mb: 1, lineHeight: 1.4 }}>
                        {memberPost.summary}
                      </Typography>
                      <Typography sx={{ fontSize: "12px", fontWeight: 800, color: "#E11D48", cursor: "pointer" }}>
                        Read more →
                      </Typography>
                    </Box>
                  </Card>
                ))
              )}
            </Box>
          </Grid>

          {/* Right Column: Submit News Box */}
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                bgcolor: "#0F172A",
                color: "#FFFFFF",
                p: 4,
                borderRadius: "20px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>
                  Submit your news
                </Typography>
                <Typography sx={{ fontSize: "14px", color: "#94A3B8", mb: 3 }}>
                  Launching something or hit a milestone? Share it with the Business Bosses community.
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 4 }}>
                  {RULES.map((rule, idx) => (
                    <Typography key={idx} sx={{ fontSize: "13px", color: "#CBD5E1", display: "flex", alignItems: "center", gap: 1 }}>
                      <span style={{ color: "#E11D48", fontWeight: 900 }}>✓</span> {rule}
                    </Typography>
                  ))}
                </Box>
              </Box>

              <Box>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={onSubmitModalOpen}
                  sx={{
                    bgcolor: "#E11D48",
                    color: "#FFF",
                    fontWeight: 800,
                    py: 1.4,
                    borderRadius: "10px",
                    textTransform: "none",
                    "&:hover": { bgcolor: "#BE123C" },
                  }}
                >
                  Submit your news
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
