import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

export default function PressAndNewsletterSection() {
  return (
    <Box sx={{ bgcolor: "#0F172A", color: "#FFFFFF", py: { xs: 8, md: 10 }, mt: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          {/* Left Column: Press & Media */}
          <Grid item xs={12} md={6}>
            <Typography sx={{ fontWeight: 800, color: "#E11D48", fontSize: "12px", letterSpacing: "1.5px", mb: 1 }}>
              PRESS & MEDIA
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 900, color: "#FFFFFF", fontSize: { xs: "28px", md: "36px" }, mb: 2 }}>
              Writing about Business Bosses?
            </Typography>
            <Typography sx={{ fontSize: "15px", color: "#94A3B8", mb: 4, maxWidth: "480px", lineHeight: 1.6 }}>
              Get our media kit, logos and key facts, or talk to the team about a story.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
              <Button
                variant="contained"
                href="mailto:support@businessbosses.org?subject=Media%20Kit%20Request"
                sx={{
                  bgcolor: "#E11D48",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  px: 3,
                  py: 1.2,
                  borderRadius: "8px",
                  textTransform: "none",
                  "&:hover": { bgcolor: "#BE123C" },
                }}
              >
                Download media kit
              </Button>
              <Button
                variant="text"
                href="mailto:press@businessbosses.org"
                sx={{
                  color: "#FFFFFF",
                  fontWeight: 700,
                  textTransform: "none",
                  "&:hover": { color: "#E11D48" },
                }}
              >
                Press enquiries →
              </Button>
            </Box>
          </Grid>

          {/* Right Column: Newsletter Subscription Box */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                bgcolor: "#1E293B",
                p: { xs: 4, md: 5 },
                borderRadius: "16px",
                border: "1px solid #334155",
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 900, color: "#FFFFFF", mb: 1 }}>
                Get the news first
              </Typography>
              <Typography sx={{ fontSize: "14px", color: "#94A3B8", mb: 3 }}>
                Monthly updates and each new magazine issue, straight to your inbox. Free.
              </Typography>
              <Box sx={{ display: "flex", gap: 1.5, flexWrap: { xs: "wrap", sm: "nowrap" } }}>
                <TextField
                  placeholder="Your email"
                  size="small"
                  fullWidth
                  sx={{
                    bgcolor: "#FFFFFF",
                    borderRadius: "8px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#E11D48",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    px: 3,
                    borderRadius: "8px",
                    textTransform: "none",
                    whiteSpace: "nowrap",
                    "&:hover": { bgcolor: "#BE123C" },
                  }}
                >
                  Subscribe
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
