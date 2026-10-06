"use client";
import * as React from "react";
import { PaletteMode } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import getLPTheme from "./getLPTheme";
import ApplyFeaturedHero from "./views/components/ApplyFeaturedHero";

export default function ApplyFeaturedPage() {
  const [mode] = React.useState<PaletteMode>("light");
  const [showCustomTheme] = React.useState(true);

  const LPtheme = React.useMemo(() => createTheme(getLPTheme(mode)), [mode]);
  const defaultTheme = React.useMemo(() => createTheme({ palette: { mode } }), [mode]);

  return (
    <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
      <CssBaseline />
      <ApplyFeaturedHero />
    </ThemeProvider>
  );
}
