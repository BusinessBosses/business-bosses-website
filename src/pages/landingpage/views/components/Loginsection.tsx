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
import FilledButton from "../../../../common/components/buttons/FilledButton";
import RoutesPath from "../../../../constants/Routes";
import { useNavigate } from "react-router-dom";

export default function Loginsection() {
  const navigate = useNavigate();
  return (
    <Box
      id="Loginsection"
      sx={{
        backgroundRepeat: "no-repeat",
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: "white",
        bgcolor: "#f4f4f4",
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
        <Stack
          direction="column"
          component={Card}
          spacing={1}
          useFlexGap
          sx={{
            color: "inherit",
            p: 10,
            height: "100%",
            // border: "1px solid",
            // borderColor: "hsla(220, 25%, 25%, .3)",
            background: "transparent",
            backgroundColor: "#ffffff",
            boxShadow: "none",
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
            Take your business to the next level
          </Typography>
          <div className="flex justify-center items-center pt-20">
            <button
              onClick={() => navigate(RoutesPath.register)}
              className={`bg-primary rounded-xl py-3.5 text-white text-md flex items-center justify-center font-bold px-10 md:px-20`}
            >
              Join Now
            </button>
          </div>

          <div className="flex gap-2 justify-center pt-5">
            <Typography variant="body2" sx={{ color: "grey" }}>
              Already have an account?
            </Typography>
            <div
              className="font-bold text-primary"
              onClick={() => navigate(RoutesPath.login)}
            >
              Login
            </div>
          </div>
        </Stack>
      </Container>
    </Box>
  );
}
