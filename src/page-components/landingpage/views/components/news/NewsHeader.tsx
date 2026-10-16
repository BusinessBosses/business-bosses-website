import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

interface NewsHeaderProps {
  selectedFilter: string;
  onSelectFilter: (category: string) => void;
  availableCategories: string[];
}

export default function NewsHeader({
  selectedFilter,
  onSelectFilter,
  availableCategories,
}: NewsHeaderProps) {
  return (
    <Box sx={{ pt: { xs: 6, md: 10 }, pb: 6, bgcolor: "#FFFFFF", borderBottom: "1px solid #E2E8F0" }}>
      <Container maxWidth="lg">
        <Typography sx={{ fontWeight: 800, color: "#E11D48", fontSize: "13px", letterSpacing: "1.5px", mb: 1 }}>
          NEWS
        </Typography>
        <Typography variant="h2" sx={{ fontWeight: 700, color: "#0F172A", fontSize: { xs: "30px", md: "40px" }, mb: 2, lineHeight: 1.25 }}>
          What’s new at Business Bosses
        </Typography>
        <Typography sx={{ fontSize: "16px", color: "#64748B", maxWidth: "680px", mb: 4 }}>
          Product updates, partner announcements, events and community news from Business Bosses.
        </Typography>

        {/* Dynamic Filter Buttons - A filter only appears once it has 3 or more posts */}
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          <Button
            variant={selectedFilter === "All" ? "contained" : "outlined"}
            onClick={() => onSelectFilter("All")}
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
              onClick={() => onSelectFilter(cat)}
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
  );
}
