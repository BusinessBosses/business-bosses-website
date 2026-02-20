'use client';
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
import TwitterIcon from "react-share/lib/TwitterIcon";
import { useRouter } from "next/navigation";
import RoutesPath from "../../../../constants/Routes";

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
  const router = useRouter();
  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: "100%",
        backgroundColor: "#232324",
        backgroundRepeat: "no-repeat",
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
              <div className="mt-5">
                <Link color="white" variant="body2" href="#">
                  Privacy Policy
                </Link>
                <Typography
                  sx={{
                    display: "inline",
                    color: "white",
                    mx: 0.5,
                    opacity: 0.5,
                  }}
                >
                  &nbsp;•&nbsp;
                </Typography>
                <Link color="white" variant="body2" href="#">
                  Terms of Service
                </Link>
                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                  <Copyright />
                </Box>
              </div>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: "flex", sm: "flex" },
              flexDirection: "column",
              gap: 1,
              width: { xs: "100%", sm: "auto" },
              mt: { xs: 4, sm: 0 },
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
              onClick={() => router.push(RoutesPath.landingpageforpartners)}
              style={{ opacity: 0.5 }}
            >
              Partners
            </Link>
            <Link
              color="white"
              variant="body2"
              href="https://businessbosses.news"
              style={{ opacity: 0.5 }}
            >
              News
            </Link>
          </Box>
          <Box
            sx={{
              display: { xs: "flex", sm: "flex" },
              flexDirection: "column",
              gap: 1,
              width: { xs: "100%", sm: "auto" },
              mt: { xs: 4, sm: 0 },
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
              href="mailto:support@businessbosses.co.uk"
              style={{ opacity: 0.5 }}
            >
              Contact
            </Link>
          </Box>
          {/* <Box
            sx={{
              display: { xs: "flex", sm: "flex" },
              flexDirection: "column",
              gap: 1,
              width: { xs: "100%", sm: "auto" },
              mt: { xs: 4, sm: 0 },
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
          </Box> */}

          <Box sx={{ marginTop: 5, display: { xs: "block", sm: "none" } }}>
            <Copyright />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
