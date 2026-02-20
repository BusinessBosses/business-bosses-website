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

export default function LandingPage() {
  const [mode, setMode] = React.useState<PaletteMode>("light");
  const [showCustomTheme] = React.useState(true);
  const LPtheme = createTheme(getLPTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });

  const toggleColorMode = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };


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
      <Hero />
      <Solutions/>
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
          <Reviews />
        </div>
        <FAQ />
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
