"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import InputLabel from "@mui/material/InputLabel";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { visuallyHidden } from "@mui/utils";
import { styled } from "@mui/material/styles";
import Assets from "../../../../assets";
import ComputerBossuppartnersection from "../../../bossuppartnerpage/computerbossupsection";
import PartnersField from "./partnerstiles";
import RoutesPath from "../../../../constants/Routes";
import { useRouter } from "../../../../common/hooks/useAppNavigation";

const StyledBox = styled("div")(({ theme }) => ({
  alignSelf: "center",
  width: "100%",
  height: 400,
  marginTop: theme.spacing(8),
  borderRadius: theme.shape.borderRadius,
  outline: "1px solid",
  boxShadow: "0 0 12px 8px hsla(220, 25%, 80%, 0.2)",
  backgroundImage: `url(${"/static/images/templates/templates-images/hero-light.png"})`,
  outlineColor: "hsla(220, 25%, 80%, 0.5)",
  backgroundSize: "cover",
  [theme.breakpoints.up("sm")]: {
    marginTop: theme.spacing(10),
    height: 700,
  },
  // ...theme.applyStyles('dark', {
  //   boxShadow: '0 0 24px 12px hsla(210, 100%, 25%, 0.2)',
  //   backgroundImage: `url(${'/static/images/templates/templates-images/hero-dark.png'})`,
  //   outlineColor: 'hsla(210, 100%, 80%, 0.1)',
  // }),
}));

import Skeleton from "@mui/material/Skeleton";

export default function PartnersHero({
  onBecomePartner,
  content,
  loading = false,
}: {
  onBecomePartner?: () => void;
  content?: {
    heroTitle?: string;
    heroDescription?: string;
    ctaText?: string;
  };
  loading?: boolean;
}) {
  const router = useRouter();
  const heroTitle = content?.heroTitle || "Partner with Business Bosses";
  const heroDescription =
    content?.heroDescription ||
    "We are looking for brands who want to offer deals to win new Customers, and organisations looking to support Entrepreneurship to improve economical growth";
  const ctaText = content?.ctaText || "Become A Partner";

  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: "100%",
        backgroundColor: "#f4f4f4",
        backgroundRepeat: "no-repeat",
      })}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: { md: "row", xs: "column" },
          alignItems: "center",
          pt: { xs: 10, sm: 10 },
          pb: { xs: 10, sm: 10 },
        }}
      >
        <div style={{ alignItems: "center", width: "100%" }}>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
              <Skeleton width="60%" height={48} sx={{ mb: 2 }} />
              <Skeleton width="80%" height={24} />
              <Skeleton width="70%" height={24} sx={{ mb: 4 }} />
              <Skeleton variant="rounded" width={220} height={50} sx={{ borderRadius: "12px", mb: 8 }} />
            </div>
          ) : (
            <>
              <Stack
                spacing={2}
                useFlexGap
                sx={{ alignItems: "center", width: { xs: "100%", sm: "100%" } }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: "center",
                    fontSize: { xs: "30px", md: "40px" },
                    justifyContent: "center",
                    textAlign: "center",
                    width: { sm: "100%", md: "100%" },
                  }}
                >
                  {heroTitle}
                </Typography>
                <Typography
                  sx={{
                    textAlign: "center",
                    color: "text.secondary",
                    width: { sm: "100%", md: "100%" },
                    pb: { xs: 2, sm: 2 },
                  }}
                >
                  {heroDescription}
                </Typography>
              </Stack>
              <div
                className="px-5 pb-20"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div className="mt-3 gap-2">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <button
                      onClick={
                        onBecomePartner
                          ? onBecomePartner
                          : () => router.push(RoutesPath.becomeapartner)
                      }
                      className="bg-primary rounded-xl py-3.5 text-white text-md flex items-center justify-center font-bold p-2 px-20"
                    >
                      {ctaText}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* <div>
          <Container>
            <PartnersField
              initialPartnerData={null}
              initialPartnerDatatile={null}
            />
          </Container>
        </div> */}
      </Container>
    </Box>
  );
}
