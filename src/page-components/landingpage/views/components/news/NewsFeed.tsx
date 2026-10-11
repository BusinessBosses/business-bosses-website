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

export default function NewsFeed({ featuredArticle, latestArticles, loading = false }: NewsFeedProps) {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Latest News Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: "#0F172A" }}>
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
                  <Typography sx={{ fontSize: "13px", fontWeight: 800, color: "#E11D48", cursor: "pointer" }}>
                    Read more →
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
}
