import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { visuallyHidden } from "@mui/utils";

import FacebookIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

import SitemarkIcon from "./SitemarkIcon";
import Assets from "../../../../assets";

function Copyright() {
  return (
    <Typography variant="body2" sx={{ color: "white", mt: 1 }}>
      {"Copyright © "}
      <div> Business Bosses&nbsp;</div>
      {new Date().getFullYear()}
    </Typography>
  );
}

export default function Footer() {
  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: "100%",
        backgroundColor: "#232324",
        backgroundRepeat: "no-repeat",
        // ...theme.applyStyles('dark', {
        //   backgroundImage:
        //     'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)',
        // }),
      })}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: { xs: 4, sm: 8 },
          py: { xs: 8, sm: 10 },
          textAlign: { sm: "center", md: "left" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              minWidth: { xs: "100%", sm: "60%" },
            }}
          >
            <Box sx={{ width: { xs: "100%", sm: "60%" } }}>
              <Box display="flex" alignItems="center">
                <img
                  src={Assets.Logo}
                  alt="Business Bosses Logo"
                  onClick={() => {
                    // dispatch(onChangeRoute(0));
                    // navigate(RoutesPath.home);
                  }}
                  style={{
                    width: "2.5rem",
                    height: "2.5rem",
                    marginRight: "0.75rem",
                  }}
                />
                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{ fontWeight: 600, color: "white" }}
                >
                  Business Bosses
                </Typography>
              </Box>

              <Typography
                variant="body2"
                gutterBottom
                sx={{ fontWeight: 600, mt: 2, color: "white" }}
              >
                Join the newsletter
              </Typography>
              <Typography variant="body2" sx={{ color: "white", mb: 2 }}>
                Subscribe for weekly updates. No spams ever!
              </Typography>
              <Stack direction="row" spacing={1} useFlexGap>
                <InputLabel htmlFor="email-newsletter" sx={visuallyHidden}>
                  Email
                </InputLabel>
                <TextField
                  id="email-newsletter"
                  hiddenLabel
                  size="small"
                  variant="outlined"
                  fullWidth
                  aria-label="Enter your email address"
                  placeholder="Your email address"
                  // slotProps={{
                  //   htmlInput: {
                  //     autoComplete: 'off',
                  //     'aria-label': 'Enter your email address',
                  //   },
                  // }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ flexShrink: 0 }}
                >
                  Subscribe
                </Button>
              </Stack>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: "medium", color: "white" }}
            >
              Links
            </Typography>
            <Link
              color="white"
              variant="body2"
              href="#"
              style={{ opacity: 0.5 }}
            >
              About
            </Link>
            <Link
              color="white"
              variant="body2"
              href="#"
              style={{ opacity: 0.5 }}
            >
              Partners
            </Link>
            <Link
              color="white"
              variant="body2"
              href="#"
              style={{ opacity: 0.5 }}
            >
              Business Tools
            </Link>

            <Link
              color="white"
              variant="body2"
              href="#"
              style={{ opacity: 0.5 }}
            >
              FAQs
            </Link>
          </Box>
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: "medium", color: "white" }}
            >
              Company
            </Typography>
            <Link
              color="white"
              variant="body2"
              href="#"
              style={{ opacity: 0.5 }}
            >
              About us
            </Link>
            <Link
              color="white"
              variant="body2"
              href="#"
              style={{ opacity: 0.5 }}
            >
              Careers
            </Link>
            <Link
              color="white"
              variant="body2"
              href="#"
              style={{ opacity: 0.5 }}
            >
              Contact
            </Link>
          </Box>
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: "medium", color: "white" }}
            >
              Legal
            </Typography>
            <Link
              color="white"
              variant="body2"
              href="#"
              style={{ opacity: 0.5 }}
            >
              Terms
            </Link>
            <Link
              color="white"
              variant="body2"
              href="#"
              style={{ opacity: 0.5 }}
            >
              Privacy
            </Link>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            pt: { xs: 4, sm: 8 },
            width: "100%",
            // borderTop: "1px solid",
            // borderColor: "divider",
          }}
        >
          <div>
            <Link color="white" variant="body2" href="#">
              Privacy Policy
            </Link>
            <Typography
              sx={{ display: "inline", color: "white", mx: 0.5, opacity: 0.5 }}
            >
              &nbsp;•&nbsp;
            </Typography>
            <Link color="white" variant="body2" href="#">
              Terms of Service
            </Link>
            <Copyright />
          </div>
          {/* <Stack
            direction="row"
            spacing={1}
            useFlexGap
            sx={{ justifyContent: "left", color: "white" }}
          > */}
          {/* <IconButton
            color="inherit"
            href="https://github.com/mui"
            aria-label="GitHub"
            sx={{ alignSelf: "center" }}
          >
            <FacebookIcon />
          </IconButton> */}
          {/* <IconButton
            color="inherit"
            href="https://x.com/MaterialUI"
            aria-label="X"
            sx={{ alignSelf: "center" }}
          >
            {/* <TwitterIcon /> */}
          {/* </IconButton> */}
          {/* <IconButton
            color="inherit"
            href="https://www.linkedin.com/company/mui/"
            aria-label="LinkedIn"
            sx={{ alignSelf: "center" }}
          >
            <LinkedInIcon />
          </IconButton> */}
          {/* </Stack> */}
        </Box>
      </Container>
    </Box>
  );
}
