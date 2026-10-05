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
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DownloadIcon from "@mui/icons-material/Download";
import LaunchIcon from "@mui/icons-material/Launch";
import Assets from "../../../../assets";
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
    // Fetch magazines from backend API or fallback
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

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#0F172A",
        color: "#ffffff",
        minHeight: "100vh",
        pb: 10,
      }}
    >
      {/* Sticky Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          backgroundColor: "#1E293B",
          position: "sticky",
          top: 0,
          zIndex: 100,
          borderBottom: "1px solid #334155",
        }}
      >
        <Box
          onClick={() => router.back()}
          sx={{
            position: "absolute",
            left: 20,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: "#334155",
          }}
        >
          <Assets.Backbutton width={20} height={20} />
        </Box>
        <Typography sx={{ fontSize: "18px", fontWeight: 700, letterSpacing: "1px", color: "#FACC15" }}>
          BUSINESS BOSSES MAGAZINE
        </Typography>
      </Box>

      {/* Hero Banner matching mockup design */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
          py: 8,
          borderBottom: "1px solid #334155",
          textAlign: "center",
          px: 2,
        }}
      >
        <Container maxWidth="md">
          <Typography
            sx={{
              color: "#FACC15",
              fontWeight: 800,
              fontSize: { xs: "14px", md: "16px" },
              letterSpacing: "3px",
              mb: 1.5,
              textTransform: "uppercase",
            }}
          >
            BUSINESS BOSSES MAGAZINE
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              fontSize: { xs: "32px", md: "48px" },
              color: "#FFFFFF",
              lineHeight: 1.2,
              mb: 2,
            }}
          >
            Tell your story in the next issue
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "16px", md: "20px" },
              color: "#94A3B8",
              maxWidth: "700px",
              mx: "auto",
              mb: 4,
            }}
          >
            Founder profiles, The Next Big Idea and Founder’s Playbook. For visionary leaders and bold builders.
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={() => router.push("/becomeapartner")}
            sx={{
              backgroundColor: "#FACC15",
              color: "#0F172A",
              fontWeight: 800,
              fontSize: "16px",
              px: 4,
              py: 1.5,
              borderRadius: "30px",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#EAB308",
              },
            }}
          >
            Apply to be Featured
          </Button>
        </Container>
      </Box>

      {/* Magazine Issues Section */}
      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, textAlign: "left", color: "#FFFFFF" }}>
          Digital Issues & PDF Downloads
        </Typography>

        {loading ? (
          <Typography sx={{ color: "#94A3B8", textAlign: "center", py: 8 }}>
            Loading magazine issues...
          </Typography>
        ) : magazines.length === 0 ? (
          <Box
            sx={{
              p: 6,
              textAlign: "center",
              backgroundColor: "#1E293B",
              borderRadius: "16px",
              border: "1px solid #334155",
            }}
          >
            <PictureAsPdfIcon sx={{ fontSize: 48, color: "#FACC15", mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#FFFFFF", mb: 1 }}>
              Upcoming Release Coming Soon
            </Typography>
            <Typography sx={{ color: "#94A3B8", maxW: "500px", mx: "auto" }}>
              Our upcoming digital magazine issues will be uploaded here shortly. Apply today to get your brand featured!
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {magazines.map((issue) => (
              <Grid item key={issue.id} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#1E293B",
                    color: "#FFFFFF",
                    borderRadius: "16px",
                    border: "1px solid #334155",
                    overflow: "hidden",
                    transition: "transform 0.2s, border-color 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      borderColor: "#FACC15",
                    },
                  }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      height: 240,
                      backgroundColor: "#334155",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundImage: issue.cover_image_url ? `url(${issue.cover_image_url})` : "none",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {!issue.cover_image_url && (
                      <PictureAsPdfIcon sx={{ fontSize: 64, color: "#FACC15" }} />
                    )}
                  </CardMedia>

                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    {issue.issue_number && (
                      <Chip
                        label={issue.issue_number}
                        size="small"
                        sx={{
                          backgroundColor: "#FACC15",
                          color: "#0F172A",
                          fontWeight: 700,
                          mb: 1.5,
                        }}
                      />
                    )}
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, lineHeight: 1.3 }}>
                      {issue.title}
                    </Typography>
                    {issue.description && (
                      <Typography variant="body2" sx={{ color: "#94A3B8", mb: 2 }}>
                        {issue.description}
                      </Typography>
                    )}
                  </CardContent>

                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<DownloadIcon />}
                      href={issue.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        backgroundColor: "#334155",
                        color: "#FFFFFF",
                        fontWeight: 700,
                        textTransform: "none",
                        borderRadius: "8px",
                        "&:hover": {
                          backgroundColor: "#475569",
                        },
                      }}
                    >
                      Download PDF
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
