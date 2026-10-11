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
}

export default function MagazineArchive({ magazines }: MagazineArchiveProps) {
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
          {magazines.map((issue) => (
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
          ))}

          {/* Placeholder items if few issues exist */}
          {magazines.length < 3 &&
            [2, 3].slice(0, 3 - magazines.length).map((num) => (
              <Grid item xs={12} sm={6} md={3} key={num}>
                <Card elevation={0} sx={{ border: "1px border-dashed #E2E8F0", borderRadius: "12px", p: 3, textAlign: "center", backgroundColor: "#F8FAFC", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: "#CBD5E1", mb: 1 }}>
                    0{num}
                  </Typography>
                  <Typography sx={{ fontSize: "13px", color: "#94A3B8" }}>Coming soon</Typography>
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
