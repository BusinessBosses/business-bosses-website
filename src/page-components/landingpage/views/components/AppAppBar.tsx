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
import { useRouter } from "next/navigation";
import LandingPageforPartners from "../../LandingPageforPartners";

interface AppAppBarProps {
  mode: PaletteMode;
  toggleColorMode: () => void;
}

export default function AppAppBar({ mode, toggleColorMode }: AppAppBarProps) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

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
      className="hidden md:block"
      position="relative"
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        mt: 2,
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
                // dispatch(onChangeRoute(0));
                // router.push(RoutesPath.home);
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
                onClick={() => router.push(RoutesPath.landingpage)}
              >
                About
              </Button>
              <Button
                variant="text"
                color="info"
                size="medium"
                onClick={() => router.push(RoutesPath.landingpageforpartners)}
              >
                Become a Partner
              </Button>
              <Button
                variant="text"
                color="info"
                size="medium"
                href="https://businessbosses.news"
              >
                News
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 0.5,
              alignItems: "center",
            }}
          >
            <Button
              sx={{
                backgroundColor: "white",
                color: "red",
                "&:hover": {
                  backgroundColor: "darkred",
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
                backgroundColor: "red",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "darkred",
                },
              }}
              size="small"
            >
              Sign up
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
                    <CloseRoundedIcon color="info" />
                  </IconButton>
                </Box>
                <MenuItem onClick={() => router.push(RoutesPath.landingpage)}>
                  About
                </MenuItem>
                <MenuItem
                  onClick={() => router.push(RoutesPath.landingpageforpartners)}
                >
                  Become a Partner
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    (window.location.href = "https://businessbosses.news")
                  }
                >
                  News
                </MenuItem>
                <MenuItem>
                  <Button
                    sx={{
                      backgroundColor: "red",
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "darkred",
                      },
                    }}
                    fullWidth
                    href="https://businessbosses.onelink.me/xLWk/36a2ff16"
                  >
                    Join Now
                  </Button>
                </MenuItem>
                <MenuItem>
                  <Button
                    sx={{
                      backgroundColor: "red",
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "darkred",
                      },
                    }}
                    variant="outlined"
                    fullWidth
                    href="https://businessbosses.onelink.me/xLWk/36a2ff16"
                  >
                    Log in
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
