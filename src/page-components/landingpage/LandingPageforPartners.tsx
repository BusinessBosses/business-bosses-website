"use client";
import * as React from "react";
import { PaletteMode } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import getLPTheme from "./getLPTheme";
import AppAppBar from "./views/components/AppAppBar";
import Footer from "./views/components/Footer";
import PartnersHighlights from "./views/components/PartnersHighlights";
import PartnersHero from "./views/components/PartnersHero";
import LogoCollection from "./views/components/LogoCollection";
import HowItWorks from "./views/components/HowItWorks";
import { useInView } from "react-intersection-observer";

import BecomeAPartnerModal from "./views/components/BecomeAPartnerModal";
import { ServerUrl } from "../../config/config";
import { withDefaults, WebsitePartnersContent } from "../../lib/site-content";

export default function LandingPageforPartners() {
  const [mode, setMode] = React.useState<PaletteMode>("light");
  const [showCustomTheme] = React.useState(true);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = React.useState(false);
  const [cmsContent, setCmsContent] = React.useState<Record<string, any>>({});

  const LPtheme = React.useMemo(() => createTheme(getLPTheme(mode)), [mode]);
  const defaultTheme = React.useMemo(() => createTheme({ palette: { mode } }), [mode]);

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
        console.error("Failed to load partners CMS content:", err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const partnersContent = withDefaults<WebsitePartnersContent>(
    "bb_website_partners",
    cmsContent.bb_website_partners
  );

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
      <PartnersHero
        onBecomePartner={() => setIsPartnerModalOpen(true)}
        content={partnersContent}
      />
      <Box sx={{ bgcolor: "background.default" }}>
        <div
          ref={partnersHighlightsRef}
          className={`slide-up ${partnersHighlightsInView ? "visible" : ""}`}
        >
          <PartnersHighlights content={partnersContent} />
        </div>
        <div
          ref={howItWorksRef}
          className={`slide-up ${howItWorksInView ? "visible" : ""}`}
        >
          <HowItWorks
            onBecomePartner={() => setIsPartnerModalOpen(true)}
            content={partnersContent}
          />
        </div>
        <div
          ref={logoCollectionRef}
          className={`slide-up ${logoCollectionInView ? "visible" : ""}`}
        >
          <LogoCollection />
        </div>
        <Footer content={cmsContent.bb_website_footer} />
      </Box>
      <BecomeAPartnerModal
        open={isPartnerModalOpen}
        onClose={() => setIsPartnerModalOpen(false)}
      />
    </ThemeProvider>
  );
}
