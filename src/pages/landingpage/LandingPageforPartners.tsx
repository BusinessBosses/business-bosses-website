import * as React from "react";
import { PaletteMode } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import getLPTheme from "./getLPTheme";
import AppAppBar from "./views/components/AppAppBar";
import FAQ from "./views/components/FAQ";
import Footer from "./views/components/Footer";
import Hero from "./views/components/Hero";
import Highlights from "./views/components/Highlights";
import Pricing from "./views/components/Pricing";
import Features from "./views/components/Features";
import Loginsection from "./views/components/Loginsection";
import Reviews from "./views/components/Reviews";
import PartnersHighlights from "./views/components/PartnersHighlights";
import PartnersHero from "./views/components/PartnersHero";
import LogoCollection from "./views/components/LogoCollection";
import HowItWorks from "./views/components/HowItWorks";
import { useInView } from "react-intersection-observer";
import "../../assets/animations.css"; // Import your animations CSS file

interface ToggleCustomThemeProps {
  showCustomTheme: Boolean;
  toggleCustomTheme: () => void;
}

function ToggleCustomTheme({
  showCustomTheme,
  toggleCustomTheme,
}: ToggleCustomThemeProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100dvw",
        position: "fixed",
        bottom: 24,
      }}
    >
      <ToggleButtonGroup
        color="primary"
        exclusive
        value={showCustomTheme}
        onChange={toggleCustomTheme}
        aria-label="Toggle design language"
        sx={{
          backgroundColor: "background.default",
          "& .Mui-selected": {
            pointerEvents: "none",
          },
        }}
      >
        <ToggleButton value>
          <AutoAwesomeRoundedIcon sx={{ fontSize: "20px", mr: 1 }} />
          Custom theme
        </ToggleButton>
        <ToggleButton value={false}>Material Design 2</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}

export default function LandingPageforPartners() {
  const [mode, setMode] = React.useState<PaletteMode>("light");
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const LPtheme = createTheme(getLPTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });

  const toggleColorMode = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const toggleCustomTheme = () => {
    setShowCustomTheme((prev) => !prev);
  };

  // Custom hook for intersection observer
  const { ref: partnersHeroRef, inView: partnersHeroInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: partnersHighlightsRef, inView: partnersHighlightsInView } =
    useInView({
      triggerOnce: true,
      threshold: 0.1,
    });

  const { ref: howItWorksRef, inView: howItWorksInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: logoCollectionRef, inView: logoCollectionInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
      <CssBaseline />
      <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
      <div
        ref={partnersHeroRef}
        className={`fade-in ${partnersHeroInView ? "visible" : ""}`}
      ></div>
      <PartnersHero />
      <Box sx={{ bgcolor: "background.default" }}>
        <div
          ref={partnersHighlightsRef}
          className={`slide-up ${partnersHighlightsInView ? "visible" : ""}`}
        >
          <PartnersHighlights />
        </div>
        <div
          ref={howItWorksRef}
          className={`slide-up ${howItWorksInView ? "visible" : ""}`}
        >
          <HowItWorks />
        </div>
        <div
          ref={logoCollectionRef}
          className={`slide-up ${logoCollectionInView ? "visible" : ""}`}
        >
          <LogoCollection />
        </div>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
