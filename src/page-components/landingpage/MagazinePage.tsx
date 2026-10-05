"use client";
import * as React from "react";
import { PaletteMode } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import getLPTheme from "./getLPTheme";
import MagazineHero from "./views/components/MagazineHero";

export default function MagazinePage() {
  const [mode] = React.useState<PaletteMode>("dark");
  const [showCustomTheme] = React.useState(true);

  const LPtheme = React.useMemo(() => createTheme(getLPTheme(mode)), [mode]);
  const defaultTheme = React.useMemo(() => createTheme({ palette: { mode } }), [mode]);

  return (
    <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
      <CssBaseline />
      <MagazineHero />
    </ThemeProvider>
  );
}
