import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/system";
import Assets from "../../../../assets";

const items = [
  {
    title: "Boss Up Challenge",
    subtext:
      "Win challenges to boost your business, increasing awareness and visibility",
    image: Assets.landing0,
  },
  {
    title: "Business Referrals",
    subtext: "Reach wider audience and organically grow your business globally",
    image: Assets.landing1,
  },
  {
    title: "Peer to Peer Resources",
    subtext: "Access to peer to peer donations and start up resources",
    image: Assets.landing2,
  },
];

export default function Features() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        backgroundRepeat: "no-repeat",
        bgcolor: "#f4f4f4",
      }}
    >
      <Container
        id="Features"
        sx={{
          pt: { xs: 4, sm: 12 },
          pb: { xs: 8, sm: 16 },
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Box
          sx={{
            width: { sm: "100%", md: "100%" },
            textAlign: { sm: "center", md: "center" },
          }}
        >
         <Typography
            component="h1"
            variant="h1"
            sx={{
              color: "#232324",
              fontSize: { xs: "20px", md: "30px" },
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            Our Unique Features
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            We believe in entrepreneurship, so we built features to help support
            entrepreneurs globally.
          </Typography>
        </Box>
        <Grid container spacing={2} justifyContent="center">
          {items.map((item, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={index}
              sx={{
                display: "flex",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  flexGrow: 1,
                  px: 1,
                  pt: 2,
                  backgroundColor: "white",
                }}
              >
                <CardContent>
                  <div style={{ textAlign: "center" }}>
                    <Typography
                      gutterBottom
                      sx={{ fontWeight: "bold", color: "#232324" }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", pb: 3 }}
                    >
                      {item.subtext}
                    </Typography>

                    <img
                      src={item.image}
                      style={{ maxWidth: "100%", height: "auto" }}
                    />
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            width: { sm: "100%", md: "100%" },
            textAlign: { sm: "center", md: "center" },
          }}
        >
          <Typography
            component="h2"
            variant="h6"
            sx={{
              color: "text.primary",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            View Complete App Features
          </Typography>
          <div className="px-5 pb-3">
            <div
              className="mt-3 "
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Assets.Appstorelogo
                  onClick={() =>
                    (window.location.href =
                      "https://apps.apple.com/gh/app/business-bosses-networking/id1569332982")
                  }
                />
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Assets.Playstorelogo
                  onClick={() =>
                    (window.location.href =
                      "https://play.google.com/store/search?q=Business%20bosses&c=apps")
                  }
                />
              </div>
            </div>
          </div>
        </Box>
      </Container>
    </Box>
  );
}
