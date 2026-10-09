"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Chip from "@mui/material/Chip";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AppAppBar from "./AppAppBar";
import Footer from "./Footer";
import { useRouter } from "../../../../common/hooks/useAppNavigation";

interface MagazineIssue {
  id: string;
  title: string;
  issue_number?: string;
  description?: string;
  cover_image_url?: string;
  pdf_url: string;
  publish_date: string;
}

export default function MagazineHero() {
  const router = useRouter();
  const [magazines, setMagazines] = React.useState<MagazineIssue[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://orca-app-5dg8w.ondigitalocean.app/api/v1";
    fetch(`${apiUrl}/magazines`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data && Array.isArray(data.data)) {
          setMagazines(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching magazines:", err);
        setLoading(false);
      });
  }, []);

  const latestIssue = magazines.length > 0 ? magazines[0] : null;

  return (
    <Box sx={{ width: "100%", backgroundColor: "#FFFFFF", color: "#0F172A", minHeight: "100vh" }}>
      {/* Navbar */}
      <AppAppBar mode="light" toggleColorMode={() => {}} />

      {/* Hero Header Section */}
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
              onClick={() => {
                if (latestIssue?.pdf_url) {
                  window.open(latestIssue.pdf_url, "_blank");
                }
              }}
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
              onClick={() => router.push("/apply-featured")}
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

      {/* 5 Sections Highlight Grid */}
      <Box sx={{ py: 8, backgroundColor: "#FFFFFF", borderTop: "1px solid #F1F5F9" }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 5 }}>
            <Typography sx={{ color: "#E11D48", fontWeight: 800, fontSize: "12px", letterSpacing: "1.5px", mb: 0.5 }}>
              INSIDE EVERY ISSUE
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#0F172A", fontSize: { xs: "24px", md: "32px" } }}>
              Five sections. One goal: help you build.
            </Typography>
          </Box>

          <Grid container spacing={2.5}>
            {[
              { num: "01", tag: "People", title: "Cover Story", desc: "An in-depth profile of a founder changing their industry." },
              { num: "02", tag: "Innovation", title: "The Next Big Idea", desc: "A product or business we think will shape what comes next." },
              { num: "03", tag: "Business trends", title: "The Shift", desc: "The changes in markets and technology that small businesses need to know." },
              { num: "04", tag: "Practical lessons", title: "Founder's Playbook", desc: "Real lessons from founders, written so you can use them this week." },
              { num: "05", tag: "Data & insights", title: "The Signal", desc: "The numbers behind the headlines, explained in plain English." },
            ].map((sec) => (
              <Grid item xs={12} sm={6} md={2.4} key={sec.num}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    p: 2.5,
                    border: "1px solid #F1F5F9",
                    borderRadius: "12px",
                    backgroundColor: "#FAFAFA",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": { borderColor: "#CBD5E1", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" },
                  }}
                >
                  <Typography sx={{ fontSize: "11px", fontWeight: 700, color: "#E11D48", mb: 1 }}>
                    {sec.num} • {sec.tag}
                  </Typography>
                  <Typography variant="h6" sx={{ fontSize: "16px", fontWeight: 800, color: "#0F172A", mb: 1 }}>
                    {sec.title}
                  </Typography>
                  <Typography sx={{ fontSize: "13px", color: "#64748B", lineHeight: 1.5 }}>
                    {sec.desc}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Featured Latest Issue Spotlight */}
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
                  image={latestIssue?.cover_image_url || "/magazine_cover.png"}
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
                {[
                  { section: "Cover Story", detail: "Abubakar Nur Khalil: From Vision to Venture" },
                  { section: "The Next Big Idea", detail: "Prodatar: the trusted record of your business identity" },
                  { section: "The Shift", detail: "Why Africa's early-stage startups are attracting global attention" },
                  { section: "Founder's Playbook", detail: "5 lessons from building, scaling and staying agile" },
                  { section: "The Signal", detail: "The trends, stats and opportunities shaping the next chapter" },
                ].map((item, idx) => (
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

      {/* Catch up on every issue archive */}
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
                      image={issue.cover_image_url || "/magazine_cover.png"}
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

      {/* Dark Footer Call To Action Banner */}
      <Box sx={{ py: 10, backgroundColor: "#0B0F19", color: "#FFFFFF" }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography sx={{ color: "#E11D48", fontWeight: 800, fontSize: "12px", letterSpacing: "1.5px", mb: 1 }}>
                GET FEATURED
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 900, fontSize: { xs: "32px", md: "44px" }, mb: 2, lineHeight: 1.1 }}>
                Tell your story in the next issue
              </Typography>
              <Typography sx={{ fontSize: "16px", color: "#94A3B8", mb: 4, lineHeight: 1.6 }}>
                Founder profiles, The Next Big Idea and Founder’s Playbook. For visionary leaders and bold builders.
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  onClick={() => router.push("/apply-featured")}
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
                  Get featured
                </Button>
                <Typography sx={{ fontSize: "13px", color: "#64748B" }}>
                  Free to apply • Selected by our editors
                </Typography>
              </Box>
            </Grid>

            {/* Feature Options List */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {[
                  { num: "01", title: "Founder profile", desc: "Your journey, your business and what you've learned, told in your words." },
                  { num: "02", title: "The Next Big Idea", desc: "Building something new? Show our readers the product or idea behind it." },
                  { num: "03", title: "Founder's Playbook", desc: "Share a practical lesson other business owners can put to work." },
                ].map((item) => (
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

      {/* Main Site Footer */}
      <Footer />
    </Box>
  );
}

