import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";
import ConstructionRoundedIcon from "@mui/icons-material/ConstructionRounded";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import SettingsSuggestRoundedIcon from "@mui/icons-material/SettingsSuggestRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import ThumbUpAltRoundedIcon from "@mui/icons-material/ThumbUpAltRounded";
import Assets from "../../../../assets";

const items = [
  {
    icon: Assets.marketplacelanding,
    title: "Marketplace",
    description:
      "An e-commerce section to sell your products and services globally",
  },
];

export default function Reviews() {
  return (
    <Box
      id="Reviews"
      sx={{
        backgroundRepeat: "no-repeat",
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: "white",
        bgcolor: "#ffffff",
      }}
    >
      <Container
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Box
          sx={{
            width: { sm: "100%", md: "60%" },
            textAlign: { sm: "left", md: "center" },
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
            Reviews
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "grey.400",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            19k+ Satisfied Users
          </Typography>
        </Box>

        <Stack
          direction="row"
          component={Card}
          spacing={1}
          useFlexGap
          sx={{
            color: "inherit",
            p: 3,
            width: "100%",
            height: "100%",
            border: "1px solid",
            borderColor: "#fff",
            background: "transparent",
            backgroundColor: "#ffffff",
            boxShadow: "none",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Assets.Quoteicon style={{ width: "40px", height: "40px" }} />
          <div style={{ alignItems: "center", justifyContent: "center" }}>
            <Typography
              variant="body2"
              sx={{
                color: "grey.400",
                px: {
                  xs: 4,
                  sm: 4,
                  justifyContent: "center",
                  textAlign: "center",
                },
              }}
            >
              Business Bosses has revolutionized the way I network and
              collaborate with fellow entrepreneurs. As a fashion designer and
              startup owner, I've always been on the lookout for a platform that
              caters specifically to the unique needs of entrepreneurs, and
              Business Bosses has exceeded my expectations in every way.
            </Typography>
          </div>
          <Assets.Quoteicon
            style={{
              width: "40px",
              height: "40px",
              transform: "scaleX(-1) scaleY(-1)",
            }}
          />
        </Stack>
      </Container>
    </Box>
  );
}
