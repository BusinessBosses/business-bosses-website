import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface MagazineIssue {
  id: string;
  title: string;
  issue_number?: string;
  description?: string;
  cover_image_url?: string;
  pdf_url: string;
  publish_date: string;
}

interface MagazineArchiveProps {
  magazines: MagazineIssue[];
  loading?: boolean;
}

export default function MagazineArchive({ magazines, loading = false }: MagazineArchiveProps) {
  return (
    <Box sx={{ py: 8, backgroundColor: "#FFFFFF" }}>
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Box>
            <Typography sx={{ color: "#E11D48", fontWeight: 800, fontSize: "12px", letterSpacing: "1.5px", mb: 0.5 }}>
              ALL ISSUES
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#0F172A" }}>
              Catch up on every issue
            </Typography>
          </Box>
          <Chip label="2026" sx={{ bgcolor: "#0F172A", color: "#FFF", fontWeight: 700 }} />
        </Box>

        <Grid container spacing={3}>
          {loading ? (
            [1, 2, 3].map((idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Card elevation={0} sx={{ border: "1px solid #F1F5F9", borderRadius: "12px", overflow: "hidden" }}>
                  <Skeleton variant="rectangular" sx={{ aspectRatio: "3/4", width: "100%" }} />
                  <CardContent sx={{ p: 2 }}>
                    <Skeleton width="40%" height={16} sx={{ mb: 1 }} />
                    <Skeleton width="80%" height={22} sx={{ mb: 1 }} />
                    <Skeleton width="30%" height={16} />
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            magazines.map((issue) => (
              <Grid item xs={12} sm={6} md={3} key={issue.id}>
                <Card
                  elevation={0}
                  sx={{
                    border: "1px solid #F1F5F9",
                    borderRadius: "12px",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "transform 0.2s",
                    "&:hover": { transform: "translateY(-4px)" },
                  }}
                  onClick={() => issue.pdf_url && window.open(issue.pdf_url, "_blank")}
                >
                  <Box sx={{ aspectRatio: "3/4", backgroundColor: "#0F172A", overflow: "hidden" }}>
                    <CardMedia
                      component="img"
                      image={issue.cover_image_url || "https://f005.backblazeb2.com/file/business-bosses-alt/uploads/1790681821114-dcaa8856f97ce667.png"}
                      alt={issue.title}
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </Box>
                  <CardContent sx={{ p: 2 }}>
                    <Typography sx={{ fontSize: "11px", color: "#64748B", mb: 0.5 }}>
                      {issue.issue_number || "Issue"} • {issue.publish_date ? new Date(issue.publish_date).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : ""}
                    </Typography>
                    <Typography sx={{ fontSize: "14px", fontWeight: 800, color: "#0F172A", mb: 1, lineHeight: 1.3 }}>
                      {issue.title}
                    </Typography>
                    <Typography sx={{ fontSize: "12px", color: "#E11D48", fontWeight: 700, display: "flex", alignItems: "center", gap: 0.5 }}>
                      Read <ArrowForwardIcon sx={{ fontSize: 14 }} />
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}

          {/* Placeholder cards for upcoming issues matching design when fewer than 3 issues exist */}
          {!loading && magazines.length < 3 && [
            { num: "02", subtitle: "Next Issue" },
            { num: "03", subtitle: "—" },
          ].slice(0, 3 - magazines.length).map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.num}>
              <Card
                elevation={0}
                sx={{
                  border: "1px solid #F1F5F9",
                  borderRadius: "12px",
                  overflow: "hidden",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <Box
                  sx={{
                    aspectRatio: "3/4",
                    backgroundColor: "#F8FAFC",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    borderBottom: "1px solid #F1F5F9",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "48px",
                      fontWeight: 900,
                      color: "#CBD5E1",
                      lineHeight: 1,
                      mb: 1,
                    }}
                  >
                    {item.num}
                  </Typography>
                  <Typography sx={{ fontSize: "13px", color: "#94A3B8", fontWeight: 500 }}>
                    Coming soon
                  </Typography>
                </Box>
                <CardContent sx={{ p: 2 }}>
                  <Typography sx={{ fontSize: "12px", color: "#94A3B8", mb: 0.5 }}>
                    Issue {item.num}
                  </Typography>
                  <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "#64748B" }}>
                    {item.subtitle}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}

          {/* Email Subscribe Box */}
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={0} sx={{ borderRadius: "12px", p: 3, backgroundColor: "#FFF1F2", border: "1px solid #FFE4E6", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 900, color: "#0F172A", mb: 1 }}>
                  Never miss an issue
                </Typography>
                <Typography sx={{ fontSize: "13px", color: "#64748B", mb: 3 }}>
                  Get each new issue in your inbox, free.
                </Typography>
                <input
                  type="email"
                  placeholder="Your email"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "6px",
                    border: "1px solid #CBD5E1",
                    marginBottom: "12px",
                    fontSize: "13px",
                    outline: "none",
                  }}
                />
              </Box>
              <Button variant="contained" fullWidth sx={{ backgroundColor: "#0F172A", color: "#FFF", fontWeight: 700, textTransform: "none", py: 1.2, "&:hover": { backgroundColor: "#1E293B" } }}>
                Subscribe
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
