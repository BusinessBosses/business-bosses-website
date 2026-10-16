import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export interface NewsArticle {
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

interface NewsFeedProps {
  featuredArticle: NewsArticle | undefined;
  latestArticles: NewsArticle[];
  loading?: boolean;
}

const DEFAULT_NEWS_IMAGE = "https://f005.backblazeb2.com/file/business-bosses-alt/uploads/1790681821114-dcaa8856f97ce667.png";

export default function NewsFeed({ featuredArticle, latestArticles, loading = false }: NewsFeedProps) {
  const [selectedArticle, setSelectedArticle] = React.useState<NewsArticle | null>(null);

  const getValidImageUrl = (url?: string) => {
    if (!url) return DEFAULT_NEWS_IMAGE;
    // If it's a web link instead of direct image or failed url, use default
    if (url.includes("prodatar.com/report") || (!url.match(/\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/i) && !url.includes("backblaze") && !url.includes("cloudinary") && !url.includes("unsplash"))) {
      return DEFAULT_NEWS_IMAGE;
    }
    return url;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Latest News Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#0F172A", fontSize: { xs: "24px", md: "32px" } }}>
          Latest news
        </Typography>
        <Typography sx={{ fontSize: "13px", color: "#94A3B8", fontWeight: 600 }}>
          Newest first
        </Typography>
      </Box>

      {/* Featured Card (Only one post can be featured at a time) */}
      {loading ? (
        <Card
          elevation={0}
          sx={{
            borderRadius: "16px",
            border: "1px solid #E2E8F0",
            mb: 6,
            overflow: "hidden",
            bgcolor: "#FFFFFF",
          }}
        >
          <Grid container alignItems="stretch">
            <Grid item xs={12} md={7}>
              <Skeleton variant="rectangular" sx={{ width: "100%", height: "100%", minHeight: "320px" }} />
            </Grid>
            <Grid item xs={12} md={5} sx={{ p: { xs: 4, md: 6 } }}>
              <Skeleton width="30%" height={24} sx={{ mb: 2 }} />
              <Skeleton width="90%" height={38} sx={{ mb: 1 }} />
              <Skeleton width="75%" height={38} sx={{ mb: 2 }} />
              <Skeleton width="100%" height={20} />
              <Skeleton width="85%" height={20} sx={{ mb: 3 }} />
              <Skeleton width="25%" height={20} />
            </Grid>
          </Grid>
        </Card>
      ) : featuredArticle ? (
        <Card
          elevation={0}
          sx={{
            borderRadius: "16px",
            border: "1px solid #E2E8F0",
            mb: 6,
            overflow: "hidden",
            bgcolor: "#FFFFFF",
            boxShadow: "0 10px 30px -10px rgba(0,0,0,0.05)",
            cursor: "pointer",
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 14px 34px -10px rgba(0,0,0,0.08)",
            },
          }}
          onClick={() => setSelectedArticle(featuredArticle)}
        >
          <Grid container alignItems="stretch">
            <Grid item xs={12} md={7} sx={{ position: "relative", bgcolor: "#0F172A", minHeight: "320px" }}>
              <img
                src={getValidImageUrl(featuredArticle.image_url)}
                alt={featuredArticle.title}
                onError={(e: any) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = DEFAULT_NEWS_IMAGE;
                }}
                style={{
                  width: "100%",
                  height: "100%",
                  minHeight: "320px",
                  maxHeight: "420px",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </Grid>
            <Grid item xs={12} md={5} sx={{ p: { xs: 4, md: 6 }, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <Chip
                  label="FEATURED"
                  size="small"
                  sx={{
                    bgcolor: "#E11D48 !important",
                    color: "#FFFFFF !important",
                    fontWeight: 800,
                    fontSize: "10px",
                    "& .MuiChip-label": { color: "#FFFFFF !important" },
                  }}
                />
                <Chip label={featuredArticle.category || "App update"} size="small" sx={{ bgcolor: "#F1F5F9", color: "#475569", fontWeight: 700, fontSize: "10px" }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: "#0F172A", mb: 2, fontSize: { xs: "22px", md: "26px" }, lineHeight: 1.3 }}>
                {featuredArticle.title}
              </Typography>
              <Typography sx={{ fontSize: "14px", color: "#64748B", mb: 3, lineHeight: 1.6 }}>
                {featuredArticle.summary || "Get verified free with Prodatar. Verified businesses get a badge and appear first across Business Bosses."}
              </Typography>
              <Typography
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedArticle(featuredArticle);
                }}
                sx={{
                  fontSize: "13px",
                  fontWeight: 800,
                  color: "#E11D48",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                  width: "fit-content",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Read more →
              </Typography>
            </Grid>
          </Grid>
        </Card>
      ) : null}

      {/* Grid of Latest Articles */}
      <Grid container spacing={3} sx={{ mb: 10 }}>
        {loading ? (
          [1, 2, 3].map((idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card elevation={0} sx={{ height: "100%", borderRadius: "16px", border: "1px solid #E2E8F0", bgcolor: "#FFFFFF" }}>
                <Skeleton variant="rectangular" sx={{ height: "180px", width: "100%" }} />
                <CardContent sx={{ p: 3 }}>
                  <Skeleton width="40%" height={18} sx={{ mb: 1 }} />
                  <Skeleton width="90%" height={26} sx={{ mb: 1 }} />
                  <Skeleton width="70%" height={18} sx={{ mb: 2 }} />
                  <Skeleton width="30%" height={18} />
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          latestArticles.slice(0, 6).map((item) => (
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
                  <Typography
                    onClick={() => setSelectedArticle(item)}
                    sx={{ fontSize: "13px", fontWeight: 800, color: "#E11D48", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
                  >
                    Read more →
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Article Reader Modal */}
      <Dialog
        open={Boolean(selectedArticle)}
        onClose={() => setSelectedArticle(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "16px", p: { xs: 2, md: 3 } },
        }}
      >
        {selectedArticle && (
          <>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", pb: 1 }}>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Chip
                  label={selectedArticle.category || "News"}
                  size="small"
                  sx={{ bgcolor: "#F1F5F9", color: "#0F172A", fontWeight: 700 }}
                />
                {selectedArticle.author_verified && (
                  <Chip
                    label="✓ Verified"
                    size="small"
                    sx={{ bgcolor: "#ECFDF5", color: "#059669", fontWeight: 700 }}
                  />
                )}
                <Typography sx={{ fontSize: "12px", color: "#94A3B8" }}>
                  {new Date(selectedArticle.publish_date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Typography>
              </Box>
              <IconButton onClick={() => setSelectedArticle(null)} size="small">
                <CloseIcon />
              </IconButton>
            </Box>

            <DialogTitle sx={{ px: 0, pt: 1, pb: 2, fontWeight: 800, fontSize: { xs: "22px", md: "28px" }, color: "#0F172A", lineHeight: 1.25 }}>
              {selectedArticle.title}
            </DialogTitle>

            <DialogContent sx={{ px: 0, pt: 1 }}>
              <Box
                sx={{
                  borderRadius: "12px",
                  overflow: "hidden",
                  mb: 3,
                  maxHeight: "360px",
                  bgcolor: "#0F172A",
                }}
              >
                <img
                  src={getValidImageUrl(selectedArticle.image_url)}
                  alt={selectedArticle.title}
                  onError={(e: any) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = DEFAULT_NEWS_IMAGE;
                  }}
                  style={{ width: "100%", maxHeight: "360px", objectFit: "cover", display: "block" }}
                />
              </Box>

              <Typography
                sx={{
                  fontSize: "16px",
                  lineHeight: 1.8,
                  color: "#334155",
                  whiteSpace: "pre-line",
                }}
              >
                {selectedArticle.content || selectedArticle.summary}
              </Typography>

              {selectedArticle.author_name && (
                <Box sx={{ mt: 4, pt: 2, borderTop: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Typography sx={{ fontSize: "13px", color: "#64748B" }}>
                    Published by: <strong>{selectedArticle.author_name}</strong>
                  </Typography>
                </Box>
              )}
            </DialogContent>
          </>
        )}
      </Dialog>
    </Container>
  );
}
