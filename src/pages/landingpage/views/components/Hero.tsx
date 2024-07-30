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

export default function Hero() {
  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: "100%",
        backgroundColor: "#f4f4f4",
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
          flexDirection: { md: "row", xs: "column" },
          alignItems: "center",
          pt: { xs: 10, sm: 10 },
          pb: { xs: 10, sm: 10 },
        }}
      >
        <div style={{ alignItems: "center" }}>
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
                padding: { xs: "0 20px", sm: "0 30px" },
              }}
            >
              Empowering Entrepreneurs to Succeed
            </Typography>

            <Typography
              sx={{
                textAlign: "center",
                color: "text.secondary",
                width: { sm: "100%", md: "100%" },
                pb: { xs: 2, sm: 2 },
                padding: { xs: "0 20px", sm: "0 30px" },
              }}
            >
              Business Bosses is a social commerce platform that empowers
              entrepreneurs with resources they need to start, promote and grow
              their businesses efficiently
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
                <Assets.Appstorelogo
                  onClick={() =>
                    (window.location.href =
                      "https://apps.apple.com/gh/app/business-bosses-networking/id1569332982")
                  }
                />
                <Assets.Playstorelogo
                  onClick={() =>
                    (window.location.href =
                      "https://play.google.com/store/search?q=Business%20bosses&c=apps")
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Container
              sx={{
                width: { xs: "300px", md: "600px" },
                height: { xs: "230px", md: "500px" },
                borderRadius: "16px",
              }}
            >
              <img
                src={Assets.bbboost}
                style={{ width: "100%", height: "100%", borderRadius: "16px" }}
                className="mb-3 cursor-pointer"
                alt=""
              />
            </Container>
          </div>
        </div>
      </Container>
    </Box>
  );
}
