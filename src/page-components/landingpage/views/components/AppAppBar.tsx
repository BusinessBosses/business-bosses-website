"use client";
import * as React from "react";
import { PaletteMode, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ToggleColorMode from "./ToggleColorMode";

import Sitemark from "./SitemarkIcon";
import Assets from "../../../../assets";
import RoutesPath from "../../../../constants/Routes";
import { useRouter, usePathname } from "next/navigation";
import LandingPageforPartners from "../../LandingPageforPartners";

interface AppAppBarProps {
  mode: PaletteMode;
  toggleColorMode: () => void;
}

export default function AppAppBar({ mode, toggleColorMode }: AppAppBarProps) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const scrollToSection = (sectionId: string) => {
    const sectionElement = document.getElementById(sectionId);
    const offset = 128;
    if (sectionElement) {
      const targetScroll = sectionElement.offsetTop - offset;
      sectionElement.scrollIntoView({ behavior: "smooth" });
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
      setOpen(false);
    }
  };

  return (
    <AppBar
      position="relative"
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        pt: { xs: 1, md: 1.5 },
        pb: 1,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          variant="regular"
          sx={(theme) => ({
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
            maxHeight: 40,
          })}
        >
          <Box
            sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}
          >
            <img
              src={Assets.Logo}
              className="w-10 h-10 my-3 cursor-pointer"
              alt=""
              onClick={() => {
                router.push(RoutesPath.index);
              }}
            />
            <Typography
              variant="body2"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: "#000",
                fontSize: "16px",
                marginLeft: "10px",
              }}
            >
              Business Bosses
            </Typography>
          </Box>
          <Box
            sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}
          >
            <Box sx={{ display: { xs: "none", md: "flex", gap: 10 } }}>
              <Button
                variant="text"
                color="info"
                size="medium"
                onClick={() => router.push(RoutesPath.index)}
                sx={{
                  color: pathname === "/" || pathname === "/about" ? "#e11d48" : "#000",
                  fontWeight: pathname === "/" || pathname === "/about" ? 700 : 500,
                }}
              >
                About
              </Button>
              <Button
                variant="text"
                color="info"
                size="medium"
                onClick={() => router.push(RoutesPath.partners)}
                sx={{
                  color: pathname?.startsWith("/partners") ? "#e11d48" : "#000",
                  fontWeight: pathname?.startsWith("/partners") ? 700 : 500,
                }}
              >
                Become a Partner
              </Button>
              <Button
                variant="text"
                color="info"
                size="medium"
                onClick={() => router.push(RoutesPath.magazine)}
                sx={{
                  color: pathname?.startsWith("/magazine") ? "#e11d48" : "#000",
                  fontWeight: pathname?.startsWith("/magazine") ? 700 : 500,
                }}
              >
                Magazine
              </Button>
              <Button
                variant="text"
                color="info"
                size="medium"
                onClick={() => router.push(RoutesPath.news)}
                sx={{
                  color: pathname?.startsWith("/news") ? "#e11d48" : "#000",
                  fontWeight: pathname?.startsWith("/news") ? 700 : 500,
                }}
              >
                News
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 2,
              alignItems: "center",
            }}
          >
            <Button
              sx={{
                backgroundColor: "white",
                color: "#000",
                borderRadius: "8px",
                px: 4,
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                },
              }}
              variant="text"
              size="small"
              href="https://businessbosses.onelink.me/xLWk/36a2ff16"
            >
              Sign in
            </Button>
            <Button
              href="https://businessbosses.onelink.me/xLWk/36a2ff16"
              sx={{
                backgroundColor: "#e11d48",
                color: "#fff",
                borderRadius: "8px",
                px: 4,
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "#be123c",
                },
              }}
              size="small"
            >
              Get Started
            </Button>
          </Box>
          <Box sx={{ display: { sm: "flex", md: "none" } }}>
            <IconButton
              aria-label="Menu button"
              onClick={toggleDrawer(true)}
              sx={{
                color: "#232324", // default icon color
                backgroundColor: "transparent", // default background color
                "&:hover": {
                  backgroundColor: "#f0f0f0", // hover background color
                },
              }} // Use your custom color here
            >
              <MenuIcon />
            </IconButton>
            <Drawer anchor="top" open={open} onClose={toggleDrawer(false)}>
              <Box sx={{ p: 2, backgroundColor: "info" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)} color="primary">
                    <CloseRoundedIcon sx={{ color: "#000" }} />
                  </IconButton>
                </Box>
                <MenuItem onClick={() => router.push(RoutesPath.index)}>
                  About
                </MenuItem>
                <MenuItem
                  onClick={() => router.push(RoutesPath.partners)}
                >
                  Become a Partner
                </MenuItem>
                <MenuItem onClick={() => router.push(RoutesPath.magazine)}>
                  Magazine
                </MenuItem>
                <MenuItem onClick={() => router.push(RoutesPath.news)}>
                  News
                </MenuItem>
                <MenuItem>
                  <Button
                    sx={{
                      backgroundColor: "#e11d48",
                      color: "#fff",
                      borderRadius: "8px",
                      fontWeight: 600,
                      "&:hover": {
                        backgroundColor: "#be123c",
                      },
                    }}
                    fullWidth
                    href="https://businessbosses.onelink.me/xLWk/36a2ff16"
                  >
                    Get Started
                  </Button>
                </MenuItem>
                <MenuItem>
                  <Button
                    sx={{
                      backgroundColor: "white",
                      color: "#000",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      "&:hover": {
                        backgroundColor: "#f0f0f0",
                      },
                    }}
                    variant="outlined"
                    fullWidth
                    href="https://businessbosses.onelink.me/xLWk/36a2ff16"
                  >
                    Sign in
                  </Button>
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
