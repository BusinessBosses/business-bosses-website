'use client';
import React from "react";
import { PaletteMode } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import getLPTheme from "./getLPTheme";
import AppAppBar from "./views/components/AppAppBar";
import FAQ from "./views/components/FAQ";
import Footer from "./views/components/Footer";
import Hero from "./views/components/Hero";

import Reviews from "./views/components/Reviews";
import { useInView } from "react-intersection-observer";

import Solutions from "./views/components/Solutions";
import Loginsection from "./views/components/Loginsection";

import { ServerUrl } from "../../config/config";

export default function LandingPage() {
  const [mode, setMode] = React.useState<PaletteMode>("light");
  const [showCustomTheme] = React.useState(true);
  const [cmsContent, setCmsContent] = React.useState<Record<string, any>>({});
  const LPtheme = createTheme(getLPTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });

  const toggleColorMode = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  React.useEffect(() => {
    let isMounted = true;
    fetch(`${ServerUrl}/ai-visibility/landing-content`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data?.success && data?.data) {
          setCmsContent(data.data);
        }
      })
      .catch((err) => {
        console.error("Failed to load dynamic website content:", err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const { ref: loginRef, inView: loginInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: reviewsRef, inView: reviewsInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
      <CssBaseline />
      <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
      <Hero content={cmsContent.bb_website_hero} />
      <Solutions
        howItWorksContent={cmsContent.bb_website_how_it_works}
        solutionsContent={cmsContent.bb_website_solutions}
      />
      <Box sx={{ bgcolor: "background.default" }}>
        <div
          ref={loginRef}
          className={`slide-up ${loginInView ? "visible" : ""}`}
        >
          <Loginsection />
        </div>
        <div
          ref={reviewsRef}
          className={`slide-up ${reviewsInView ? "visible" : ""}`}
        >
          <Reviews content={cmsContent.bb_website_reviews} />
        </div>
        <FAQ content={cmsContent.bb_website_faq} />
        <Footer content={cmsContent.bb_website_footer} />
      </Box>
    </ThemeProvider>
  );
}
