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
import Button from "@mui/material/Button";
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

export default function NewsFeed({ featuredArticle, latestArticles, loading = false }: NewsFeedProps) {
  const [selectedArticle, setSelectedArticle] = React.useState<NewsArticle | null>(null);
  const [visibleCount, setVisibleCount] = React.useState<number>(6);

  const getValidImageUrl = (url?: string) => {
    if (!url || typeof url !== "string") return "";
    const trimmed = url.trim();
    if (!trimmed || trimmed === "null" || trimmed === "undefined") return "";
    if (trimmed.includes("prodatar.com/report")) return "";
    return trimmed;
  };

  const getPlaceholderBg = (category?: string) => {
    const c = category?.toLowerCase() || "";
    if (c.includes("partner")) return { bg: "#ECFDF5", color: "#10B981", border: "#D1FAE5" };
    if (c.includes("community")) return { bg: "#FEF3C7", color: "#F59E0B", border: "#FDE68A" };
    if (c.includes("member")) return { bg: "#FFEDD5", color: "#F97316", border: "#FED7AA" };
    if (c.includes("app") || c.includes("update")) return { bg: "#EFF6FF", color: "#3B82F6", border: "#DBEAFE" };
    return { bg: "#FFF1F2", color: "#F43F5E", border: "#FFE4E6" };
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Latest News Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#0F172A", fontSize: { xs: "24px", md: "32px" } }}>
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
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                position: "relative",
                bgcolor: getValidImageUrl(featuredArticle.image_url) ? "#F8FAFC" : "#FFF1F2",
                minHeight: { xs: "260px", md: "340px" },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {getValidImageUrl(featuredArticle.image_url) ? (
                <img
                  src={getValidImageUrl(featuredArticle.image_url)}
                  alt={featuredArticle.title}
                  onError={(e: any) => {
                    e.currentTarget.style.display = "none";
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    minHeight: "340px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5, color: "#DC2626", p: 4, textAlign: "center" }}>
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <Typography sx={{ fontWeight: 800, fontSize: "15px", color: "#B91C1C" }}>
                    Add news image
                  </Typography>
                </Box>
              )}
            </Grid>
            <Grid item xs={12} md={6} sx={{ p: { xs: 4, md: 5 }, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <Box sx={{ display: "flex", gap: 1, mb: 2, alignItems: "center", flexWrap: "wrap" }}>
                <Chip
                  label="FEATURED"
                  size="small"
                  sx={{
                    bgcolor: "#E11D48 !important",
                    color: "#FFFFFF !important",
                    fontWeight: 800,
                    fontSize: "10px",
                    letterSpacing: "0.5px",
                    height: "22px",
                    "& .MuiChip-label": { color: "#FFFFFF !important" },
                  }}
                />
                <Chip
                  label={featuredArticle.category || "App update"}
                  size="small"
                  sx={{ bgcolor: "#F1F5F9", color: "#475569", fontWeight: 700, fontSize: "11px", height: "22px" }}
                />
                <Typography sx={{ fontSize: "12px", color: "#94A3B8" }}>•</Typography>
                <Typography sx={{ fontSize: "12px", color: "#94A3B8", fontWeight: 600 }}>
                  {new Date(featuredArticle.publish_date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#0F172A", mb: 2, fontSize: { xs: "22px", md: "26px" }, lineHeight: 1.3 }}>
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
      <Grid container spacing={3} sx={{ mb: 6 }}>
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
          latestArticles.slice(0, visibleCount).map((item) => {
            const hasValidImg = Boolean(getValidImageUrl(item.image_url));
            const placeholderTheme = getPlaceholderBg(item.category);

            return (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card
                  elevation={0}
                  onClick={() => setSelectedArticle(item)}
                  sx={{
                    height: "100%",
                    borderRadius: "16px",
                    border: "1px solid #E2E8F0",
                    bgcolor: "#FFFFFF",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: "0 12px 28px -8px rgba(0,0,0,0.08)",
                    },
                  }}
                >
                  {hasValidImg ? (
                    <CardMedia
                      component="img"
                      image={getValidImageUrl(item.image_url)}
                      alt={item.title}
                      sx={{ height: "180px", objectFit: "cover" }}
                    />
                  ) : (
                    <Box
                      sx={{
                        height: "180px",
                        bgcolor: placeholderTheme.bg,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                        color: placeholderTheme.color,
                        borderBottom: `1px solid ${placeholderTheme.border}`,
                      }}
                    >
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                      <Typography sx={{ fontWeight: 700, fontSize: "12px", color: placeholderTheme.color }}>
                        Add news image
                      </Typography>
                    </Box>
                  )}
                  <CardContent sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <Box>
                      <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1.5 }}>
                        <Typography sx={{ fontSize: "12px", fontWeight: 800, color: "#2563EB" }}>
                          {item.category || "News"}
                        </Typography>
                        <Typography sx={{ fontSize: "12px", color: "#94A3B8" }}>•</Typography>
                        <Typography sx={{ fontSize: "12px", color: "#94A3B8" }}>
                          {new Date(item.publish_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                        </Typography>
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A", mb: 1, lineHeight: 1.35, fontSize: "17px" }}>
                        {item.title}
                      </Typography>
                      <Typography sx={{ fontSize: "13px", color: "#64748B", mb: 2, lineHeight: 1.55 }}>
                        {item.summary}
                      </Typography>
                    </Box>
                    <Typography
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedArticle(item);
                      }}
                      sx={{ fontSize: "13px", fontWeight: 800, color: "#E11D48", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
                    >
                      Read more →
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        )}
      </Grid>

      {/* Load more news button matching design */}
      {!loading && latestArticles.length > visibleCount && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 10 }}>
          <Box
            component="button"
            onClick={() => setVisibleCount((prev) => prev + 6)}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: "10px",
              border: "1px solid #CBD5E1",
              bgcolor: "#FFFFFF",
              color: "#0F172A",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": {
                bgcolor: "#F8FAFC",
                borderColor: "#94A3B8",
              },
            }}
          >
            Load more news
          </Box>
        </Box>
      )}

      {/* Modern, Polished Article Reader Modal */}
      <Dialog
        open={Boolean(selectedArticle)}
        onClose={() => setSelectedArticle(null)}
        maxWidth="md"
        fullWidth
        scroll="paper"
        PaperProps={{
          sx: {
            borderRadius: "20px",
            boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
            bgcolor: "#FFFFFF",
            maxHeight: "90vh",
            overflowY: "auto",
          },
        }}
      >
        {selectedArticle && (
          <Box sx={{ position: "relative", display: "flex", flexDirection: "column" }}>
            {/* Modal Close Action Button */}
            <IconButton
              onClick={() => setSelectedArticle(null)}
              aria-label="close"
              sx={{
                position: "absolute",
                right: 16,
                top: 16,
                zIndex: 10,
                bgcolor: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(4px)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                "&:hover": { bgcolor: "#FFFFFF" },
              }}
            >
              <CloseIcon sx={{ fontSize: "20px", color: "#0F172A" }} />
            </IconButton>

            {/* Hero Cover Image or Graphic */}
            {getValidImageUrl(selectedArticle.image_url) ? (
              <Box
                sx={{
                  width: "100%",
                  maxHeight: { xs: "260px", md: "400px" },
                  overflow: "hidden",
                  bgcolor: "#0F172A",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={getValidImageUrl(selectedArticle.image_url)}
                  alt={selectedArticle.title}
                  onError={(e: any) => {
                    e.currentTarget.style.display = "none";
                  }}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "400px",
                    width: "auto",
                    height: "auto",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </Box>
            ) : (
              <Box
                sx={{
                  py: 6,
                  bgcolor: getPlaceholderBg(selectedArticle.category).bg,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1.5,
                  color: getPlaceholderBg(selectedArticle.category).color,
                  borderBottom: `1px solid ${getPlaceholderBg(selectedArticle.category).border}`,
                }}
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                <Typography sx={{ fontWeight: 800, fontSize: "14px" }}>
                  {selectedArticle.category || "Business Bosses News"}
                </Typography>
              </Box>
            )}

            {/* Modal Body */}
            <Box sx={{ p: { xs: 3, md: 5 } }}>
              {/* Category, Date & Verification Meta */}
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", flexWrap: "wrap", mb: 2 }}>
                <Chip
                  label={selectedArticle.category || "News"}
                  size="small"
                  sx={{
                    bgcolor: "#F1F5F9",
                    color: "#0F172A",
                    fontWeight: 800,
                    fontSize: "11px",
                    height: "24px",
                  }}
                />
                {selectedArticle.author_verified && (
                  <Chip
                    label="✓ Verified Member"
                    size="small"
                    sx={{
                      bgcolor: "#DCFCE7",
                      color: "#166534",
                      fontWeight: 800,
                      fontSize: "11px",
                      height: "24px",
                    }}
                  />
                )}
                <Typography sx={{ fontSize: "13px", color: "#64748B", fontWeight: 500 }}>
                  {new Date(selectedArticle.publish_date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Typography>
              </Box>

              {/* Title */}
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: "24px", md: "32px" },
                  color: "#0F172A",
                  lineHeight: 1.25,
                  mb: 3,
                }}
              >
                {selectedArticle.title}
              </Typography>

              {/* Excerpt / Summary Lead Callout */}
              {selectedArticle.summary && (
                <Box
                  sx={{
                    p: 2.5,
                    mb: 3.5,
                    bgcolor: "#F8FAFC",
                    borderLeft: "4px solid #E11D48",
                    borderRadius: "0 12px 12px 0",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "15px",
                      lineHeight: 1.6,
                      color: "#334155",
                      fontWeight: 600,
                      fontStyle: "italic",
                    }}
                  >
                    {selectedArticle.summary}
                  </Typography>
                </Box>
              )}

              {/* Full Content (Rich Text HTML or Plain Text) */}
              {selectedArticle.content && /<[a-z][\s\S]*>/i.test(selectedArticle.content) ? (
                <Box
                  sx={{
                    fontSize: "16px",
                    lineHeight: 1.85,
                    color: "#334155",
                    mb: 4,
                    "& p": { mb: 2 },
                    "& h2, & h3, & h4": { color: "#0F172A", fontWeight: 800, mt: 3, mb: 1.5 },
                    "& ul, & ol": { pl: 3, mb: 2 },
                    "& li": { mb: 0.5 },
                    "& blockquote": {
                      borderLeft: "4px solid #E11D48",
                      pl: 2,
                      py: 0.5,
                      my: 2,
                      fontStyle: "italic",
                      bgcolor: "#F8FAFC",
                      borderRadius: "0 8px 8px 0",
                    },
                    "& a": { color: "#E11D48", textDecoration: "underline", fontWeight: 600 },
                    "& strong": { color: "#0F172A", fontWeight: 800 },
                  }}
                  dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                />
              ) : (
                <Typography
                  sx={{
                    fontSize: "16px",
                    lineHeight: 1.85,
                    color: "#334155",
                    whiteSpace: "pre-line",
                    mb: 4,
                  }}
                >
                  {selectedArticle.content || selectedArticle.summary}
                </Typography>
              )}

              {/* Author / Source signature footer */}
              <Box
                sx={{
                  pt: 3,
                  borderTop: "1px solid #F1F5F9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box
                    sx={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "50%",
                      bgcolor: "#E11D48",
                      color: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 900,
                      fontSize: "14px",
                    }}
                  >
                    {(selectedArticle.author_name || "B")[0].toUpperCase()}
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: "14px", fontWeight: 800, color: "#0F172A" }}>
                      {selectedArticle.author_name || "Business Bosses Editorial"}
                    </Typography>
                    <Typography sx={{ fontSize: "12px", color: "#94A3B8" }}>
                      {selectedArticle.is_member_news ? "Community Contributor" : "Official Publication"}
                    </Typography>
                  </Box>
                </Box>

                <Button
                  variant="outlined"
                  onClick={() => setSelectedArticle(null)}
                  sx={{
                    borderRadius: "10px",
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "13px",
                    borderColor: "#CBD5E1",
                    color: "#475569",
                    "&:hover": { borderColor: "#94A3B8", bgcolor: "#F8FAFC" },
                  }}
                >
                  Close Article
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Dialog>
    </Container>
  );
}
