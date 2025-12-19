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
import { Routes, useNavigate } from "react-router-dom";
import LandingPageforPartners from "../../LandingPageforPartners";

interface AppAppBarProps {
  mode: PaletteMode;
  toggleColorMode: () => void;
}

export default function AppAppBar({ mode, toggleColorMode }: AppAppBarProps) {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

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
                // navigate(RoutesPath.home);
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
                onClick={() => navigate(RoutesPath.landingpage)}
              >
                About
              </Button>
              <Button
                variant="text"
                color="info"
                size="medium"
                onClick={() => navigate(RoutesPath.landingpageforpartners)}
              >
                Partners
              </Button>
              <Button
                variant="text"
                color="info"
                size="medium"
                onClick={() => navigate(RoutesPath.businesstools)}
              >
                Business Tools
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
              color="primary"
              variant="text"
              size="small"
              onClick={() => navigate(RoutesPath.login)}
            >
              Sign in
            </Button>
            <Button
              onClick={() => navigate(RoutesPath.register)}
              color="primary"
              variant="contained"
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
                <MenuItem onClick={() => navigate(RoutesPath.landingpage)}>
                  About
                </MenuItem>
                <MenuItem
                  onClick={() => navigate(RoutesPath.landingpageforpartners)}
                >
                  Partners
                </MenuItem>
                <MenuItem onClick={() => navigate(RoutesPath.businesstools)}>
                  Business Tools
                </MenuItem>
                <MenuItem>
                  <Button
                    color="primary"
                    variant="contained"
                    fullWidth
                    onClick={() => navigate(RoutesPath.register)}
                  >
                    Join Now
                  </Button>
                </MenuItem>
                <MenuItem>
                  <Button
                    color="primary"
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate(RoutesPath.login)}
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
