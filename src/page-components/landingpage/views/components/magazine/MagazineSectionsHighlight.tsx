import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

const SECTIONS = [
  { num: "01", tag: "People", title: "Cover Story", desc: "An in-depth profile of a founder changing their industry." },
  { num: "02", tag: "Innovation", title: "The Next Big Idea", desc: "A product or business we think will shape what comes next." },
  { num: "03", tag: "Business trends", title: "The Shift", desc: "The changes in markets and technology that small businesses need to know." },
  { num: "04", tag: "Practical lessons", title: "Founder's Playbook", desc: "Real lessons from founders, written so you can use them this week." },
  { num: "05", tag: "Data & insights", title: "The Signal", desc: "The numbers behind the headlines, explained in plain English." },
];

export default function MagazineSectionsHighlight() {
  return (
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
          {SECTIONS.map((sec) => (
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
  );
}
