"use client";
import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Skeleton from "@mui/material/Skeleton";

import { withDefaults, WebsiteFaqContent } from "../../../../lib/site-content";

export default function FAQ({
  content,
  loading = false,
}: {
  content?: Partial<WebsiteFaqContent>;
  loading?: boolean;
}) {
  const faqContent = withDefaults<WebsiteFaqContent>("bb_website_faq", content);
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Box
      sx={{
        backgroundRepeat: "no-repeat",
        color: "white",
        bgcolor: "#ffffff",
      }}
    >
      <Container
        id="faq"
        sx={{
          pt: { xs: 4, sm: 12 },
          pb: { xs: 8, sm: 16 },
          position: "relative",
          display: "flex",

          flexDirection: "column",
          alignItems: "center",
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Typography
          component="h1"
          variant="h1"
          sx={{
            color: "#232324",
            fontSize: { xs: "20px", md: "30px" },
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          {faqContent.title || "Frequently Asked Questions"}
        </Typography>
        <Box sx={{ width: "100%" }}>
          {loading ? (
            [1, 2, 3, 4].map((idx) => (
              <Box key={idx} sx={{ p: 2, mb: 2, bgcolor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <Skeleton width="60%" height={26} />
              </Box>
            ))
          ) : (
            (faqContent.items || []).map((item, index) => {
              const panelId = `panel${index + 1}`;
              return (
                <Accordion
                  key={index}
                  expanded={expanded === panelId}
                  onChange={handleChange(panelId)}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`${panelId}d-content`}
                    id={`${panelId}d-header`}
                  >
                    <Typography component="h3" variant="subtitle2">
                      {item.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography
                      variant="body2"
                      gutterBottom
                      sx={{ maxWidth: { sm: "100%", md: "70%" }, whiteSpace: "pre-line" }}
                    >
                      {item.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              );
            })
          )}
        </Box>
      </Container>
    </Box>
  );
}
