"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AppAppBar from "./AppAppBar";
import Footer from "./Footer";

interface NewsArticle {
  id: string;
  title: string;
  summary?: string;
  content?: string;
  category: string;
  image_url: string;
  is_featured: boolean;
  is_member_news: boolean;
  author_name?: string;
  author_verified?: boolean;
  publish_date: string;
}

export default function NewsHero() {
  const [articles, setArticles] = React.useState<NewsArticle[]>([]);
  const [selectedFilter, setSelectedFilter] = React.useState<string>("All");
  const [categoryCounts, setCategoryCounts] = React.useState<Record<string, number>>({});
  
  // Submit modal state
  const [openModal, setOpenModal] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [memberTitle, setMemberTitle] = React.useState("");
  const [memberAuthor, setMemberAuthor] = React.useState("");
  const [memberImageUrl, setMemberImageUrl] = React.useState("");
  const [memberSummary, setMemberSummary] = React.useState("");

  const fetchNews = React.useCallback(async () => {
    try {
      const res = await fetch("https://orca-app-5dg8w.ondigitalocean.app/api/v1/news");
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          setArticles(json.data);
          setCategoryCounts(json.categoryCounts || {});
        }
      }
    } catch (err) {
      console.error("Failed to fetch news:", err);
    }
  }, []);

  React.useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Featured article: Only one post can be featured at a time
  const featuredArticle = articles.find((a) => a.is_featured) || articles[0];

  // Latest non-featured articles
  const latestArticles = articles.filter((a) => a.id !== featuredArticle?.id && !a.is_member_news);
  
  // Member news articles
  const memberNewsArticles = articles.filter((a) => a.is_member_news);

  // Filter Rule: A filter only appears once it has three or more posts
  const availableCategories = Object.keys(categoryCounts).filter(
    (cat) => categoryCounts[cat] >= 3
  );

  const filteredLatest = latestArticles.filter((item) => {
    if (selectedFilter === "All") return true;
    return item.category?.toLowerCase() === selectedFilter.toLowerCase();
  });

  const handleMemberSubmit = async () => {
    if (!memberTitle.trim()) {
      alert("Title is required");
      return;
    }
    // Rule: Member news posts need an image before they can be submitted. (Image compulsory)
    if (!memberImageUrl.trim()) {
      alert("An image URL is compulsory before submitting a news post.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("https://orca-app-5dg8w.ondigitalocean.app/api/v1/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: memberTitle,
          author_name: memberAuthor || "Verified Member",
          image_url: memberImageUrl,
          summary: memberSummary,
          category: "Member news",
          is_member_news: true,
          author_verified: true,
        }),
      });

      if (res.ok) {
        alert("Member news post submitted successfully!");
        setOpenModal(false);
        setMemberTitle("");
        setMemberAuthor("");
        setMemberImageUrl("");
        setMemberSummary("");
        fetchNews();
      } else {
        const errJson = await res.json();
        alert("Failed to submit news: " + (errJson.message || "Unknown error"));
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      alert("Error submitting news article");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ bgcolor: "#F8FAFC", minHeight: "100vh" }}>
      <AppAppBar mode="light" toggleColorMode={() => {}} />

      {/* Header Section */}
      <Box sx={{ pt: { xs: 6, md: 10 }, pb: 6, bgcolor: "#FFFFFF", borderBottom: "1px solid #E2E8F0" }}>
        <Container maxWidth="lg">
          <Typography sx={{ fontWeight: 800, color: "#E11D48", fontSize: "13px", letterSpacing: "1.5px", mb: 1 }}>
            NEWS
          </Typography>
          <Typography variant="h2" sx={{ fontWeight: 900, color: "#0F172A", fontSize: { xs: "32px", md: "48px" }, mb: 2 }}>
            What’s new at Business Bosses
          </Typography>
          <Typography sx={{ fontSize: "16px", color: "#64748B", maxWidth: "680px", mb: 4 }}>
            Product updates, partner announcements, events and community news from Business Bosses.
          </Typography>

          {/* Dynamic Filter Buttons - A filter only appears once it has 3 or more posts */}
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            <Button
              variant={selectedFilter === "All" ? "contained" : "outlined"}
              onClick={() => setSelectedFilter("All")}
              sx={{
                borderRadius: "20px",
                textTransform: "none",
                fontWeight: 700,
                fontSize: "13px",
                bgcolor: selectedFilter === "All" ? "#0F172A" : "transparent",
                color: selectedFilter === "All" ? "#FFF" : "#475569",
                borderColor: "#CBD5E1",
                "&:hover": { bgcolor: selectedFilter === "All" ? "#1E293B" : "#F1F5F9" },
              }}
            >
              All
            </Button>
            {availableCategories.map((cat) => (
              <Button
                key={cat}
                variant={selectedFilter === cat ? "contained" : "outlined"}
                onClick={() => setSelectedFilter(cat)}
                sx={{
                  borderRadius: "20px",
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "13px",
                  bgcolor: selectedFilter === cat ? "#E11D48" : "transparent",
                  color: selectedFilter === cat ? "#FFF" : "#475569",
                  borderColor: "#CBD5E1",
                  "&:hover": { bgcolor: selectedFilter === cat ? "#BE123C" : "#F1F5F9" },
                }}
              >
                {cat}
              </Button>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Main Content Area */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Latest News Title */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 900, color: "#0F172A" }}>
            Latest news
          </Typography>
          <Typography sx={{ fontSize: "13px", color: "#94A3B8", fontWeight: 600 }}>
            Newest first
          </Typography>
        </Box>

        {/* Featured Card (Only one post can be featured at a time) */}
        {featuredArticle && (
          <Card
            elevation={0}
            sx={{
              borderRadius: "16px",
              border: "1px solid #E2E8F0",
              mb: 6,
              overflow: "hidden",
              bgcolor: "#FFFFFF",
              boxShadow: "0 10px 30px -10px rgba(0,0,0,0.05)",
            }}
          >
            <Grid container alignItems="stretch">
              <Grid item xs={12} md={7}>
                <CardMedia
                  component="img"
                  image={featuredArticle.image_url || "https://f005.backblazeb2.com/file/business-bosses-alt/uploads/1790681821114-dcaa8856f97ce667.png"}
                  alt={featuredArticle.title}
                  sx={{ width: "100%", height: "100%", minHeight: "320px", objectFit: "cover" }}
                />
              </Grid>
              <Grid item xs={12} md={5} sx={{ p: { xs: 4, md: 6 }, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                  <Chip label="FEATURED" size="small" sx={{ bgcolor: "#E11D48", color: "#FFF", fontWeight: 800, fontSize: "10px" }} />
                  <Chip label={featuredArticle.category || "App update"} size="small" sx={{ bgcolor: "#F1F5F9", color: "#475569", fontWeight: 700, fontSize: "10px" }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 900, color: "#0F172A", mb: 2, lineHeight: 1.2 }}>
                  {featuredArticle.title}
                </Typography>
                <Typography sx={{ fontSize: "14px", color: "#64748B", mb: 3, lineHeight: 1.6 }}>
                  {featuredArticle.summary || "Get verified free with Prodatar. Verified businesses get a badge and appear first across Business Bosses."}
                </Typography>
                <Typography sx={{ fontSize: "13px", fontWeight: 800, color: "#E11D48", cursor: "pointer", display: "flex", alignItems: "center", gap: 0.5 }}>
                  Read more →
                </Typography>
              </Grid>
            </Grid>
          </Card>
        )}

        {/* Grid of Latest Articles */}
        <Grid container spacing={3} sx={{ mb: 10 }}>
          {filteredLatest.slice(0, 6).map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  borderRadius: "16px",
                  border: "1px solid #E2E8F0",
                  bgcolor: "#FFFFFF",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardMedia
                  component="img"
                  image={item.image_url || "https://f005.backblazeb2.com/file/business-bosses-alt/uploads/1790681821114-dcaa8856f97ce667.png"}
                  alt={item.title}
                  sx={{ height: "180px", objectFit: "cover" }}
                />
                <CardContent sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <Box>
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1.5 }}>
                      <Typography sx={{ fontSize: "12px", fontWeight: 800, color: "#3B82F6" }}>
                        {item.category}
                      </Typography>
                      <Typography sx={{ fontSize: "12px", color: "#94A3B8" }}>•</Typography>
                      <Typography sx={{ fontSize: "12px", color: "#94A3B8" }}>
                        {new Date(item.publish_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A", mb: 1, lineHeight: 1.3 }}>
                      {item.title}
                    </Typography>
                    <Typography sx={{ fontSize: "13px", color: "#64748B", mb: 2, lineHeight: 1.5 }}>
                      {item.summary}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: "13px", fontWeight: 800, color: "#E11D48", cursor: "pointer" }}>
                    Read more →
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* MEMBER NEWS SECTION */}
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
                {memberNewsArticles.length === 0 ? (
                  <Card elevation={0} sx={{ p: 4, border: "1px dashed #CBD5E1", borderRadius: "12px", textAlign: "center", bgcolor: "#FFFFFF" }}>
                    <Typography sx={{ color: "#64748B", fontWeight: 600 }}>
                      No member news submitted yet. Be the first verified business to submit news!
                    </Typography>
                  </Card>
                ) : (
                  memberNewsArticles.map((memberPost) => (
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
                    {["Verified businesses only", "Headline, 150-300 words, one image and one link", "Real news only: no adverts or discount offers", "Reviewed by our team before it goes live"].map((rule, idx) => (
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
                    onClick={() => setOpenModal(true)}
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

      {/* Member News Submission Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 900, fontSize: "20px" }}>Submit Member News</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              label="Business / Founder Name *"
              fullWidth
              value={memberAuthor}
              onChange={(e) => setMemberAuthor(e.target.value)}
              placeholder="e.g. Adaeze Textiles"
            />
            <TextField
              label="News Headline / Title *"
              fullWidth
              value={memberTitle}
              onChange={(e) => setMemberTitle(e.target.value)}
              placeholder="e.g. Adaeze Textiles opens wholesale orders to UK boutiques"
            />
            <TextField
              label="Image URL * (Compulsory)"
              fullWidth
              value={memberImageUrl}
              onChange={(e) => setMemberImageUrl(e.target.value)}
              placeholder="https://f005.backblazeb2.com/file/business-bosses-alt/..."
              helperText="Member news posts MUST include an image before submitting"
            />
            <TextField
              label="News Summary / Story *"
              fullWidth
              multiline
              rows={4}
              value={memberSummary}
              onChange={(e) => setMemberSummary(e.target.value)}
              placeholder="Briefly describe your launch or milestone..."
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenModal(false)} sx={{ color: "#64748B", fontWeight: 700 }}>
            Cancel
          </Button>
          <Button
            onClick={handleMemberSubmit}
            variant="contained"
            disabled={submitting}
            sx={{ bgcolor: "#E11D48", color: "#FFF", fontWeight: 800, "&:hover": { bgcolor: "#BE123C" } }}
          >
            {submitting ? "Submitting..." : "Submit News"}
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </Box>
  );
}
