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

export default function FAQ() {
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
          Frequently Asked Questions
        </Typography>
        <Box sx={{ width: "100%" }}>
          <Accordion
            expanded={expanded === "panel1"}
            onChange={handleChange("panel1")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1d-content"
              id="panel1d-header"
            >
              <Typography component="h3" variant="subtitle2">
                How can I promote my business on Business Bosses?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                variant="body2"
                gutterBottom
                sx={{ maxWidth: { sm: "100%", md: "70%" } }}
              >
                Promoting your business on Business Bosses is straightforward.
                Here are a few ways to do it:
                <br />
                <br />
                <b>1. Create a Compelling Profile:</b> Ensure your profile is complete
                with detailed information about your business, including a logo,
                business description, and contact information.
                <br />
                <br />
                <b>2. Share Content:</b> Regularly post updates, articles, and content
                that highlight your business’s expertise and achievements. This
                can include blog posts, case studies, and success stories.
                <br />
                <br />
                <b>3. Join and Contribute to Groups:</b> Actively participate in
                discussion groups related to your industry. Share your knowledge
                and insights, and position yourself as a thought leader.
                <br />
                <br />
                <b>4. Advertise:</b> Business Bosses offers advertising options that allow
                you to target specific audiences. You can create sponsored posts
                and ads to increase your business’s visibility.
                <br />
                <br />
                <b>5. Network:</b> Connect with other entrepreneurs and engage in
                conversations. Building relationships can lead to business
                opportunities and collaborations.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "panel2"}
            onChange={handleChange("panel2")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2d-content"
              id="panel2d-header"
            >
              <Typography component="h3" variant="subtitle2">
                Is Business Bosses free to use, or are there any subscription
                plans available?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                variant="body2"
                gutterBottom
                sx={{ maxWidth: { sm: "100%", md: "70%" } }}
              >
                Business Bosses offers both free and premium subscription plans.
                The free version provides access to basic features such as
                networking, messaging, and some resources. For enhanced
                functionalities, you can opt for one of our premium plans, which
                include advanced tools, exclusive content, priority customer
                support, and access to manage your business. Subscription
                details and pricing can be found in the "Premium Subscription"
                section of the app.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "panel3"}
            onChange={handleChange("panel3")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3d-content"
              id="panel3d-header"
            >
              <Typography component="h3" variant="subtitle2">
                How can I find and join discussion groups related to my industry
                on Business Bosses?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                variant="body2"
                gutterBottom
                sx={{ maxWidth: { sm: "100%", md: "70%" } }}
              >
                To find and join discussion groups related to your industry on
                Business Bosses, follow these steps:
                <br />
                1. Navigate to the "Boss Up" section of the website or on the
                app.
                <br />
                2. Use the search bar to find groups by keywords related to your
                industry or interests.
                <br />
                3. Browse through the list of groups in Learning and read their
                descriptions to find ones that match your needs.
                <br />
                4. Click "Join" to become a member of the group. Some groups may
                require admin approval before you can join.
                <br />
                5. Once you're a member, you can participate in discussions,
                share insights, ask questions, and network with other
                professionals in your industry.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "panel4"}
            onChange={handleChange("panel4")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel4d-content"
              id="panel4d-header"
            >
              <Typography component="h3" variant="subtitle2">
                How do I contact customer support if I have a question or issue?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                variant="body2"
                gutterBottom
                sx={{ maxWidth: { sm: "100%", md: "70%" } }}
              >
                You can reach our customer support team by emailing
                <Link> support@businessbosses.co.uk</Link>. We&apos;re here to
                assist you promptly.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Container>
    </Box>
  );
}
