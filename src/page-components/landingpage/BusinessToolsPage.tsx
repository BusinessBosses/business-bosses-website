"use client";
import * as React from "react";
import { Container, PaletteMode } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import getLPTheme from "./getLPTheme";
import AppAppBar from "./views/components/AppAppBar";
import FAQ from "./views/components/FAQ";
import Footer from "./views/components/Footer";
import Hero from "./views/components/Hero";
import Highlights from "./views/components/Highlights";
import LogoCollection from "./views/components/Detailssection";
import Pricing from "./views/components/Pricing";
import Features from "./views/components/Features";
import Loginsection from "./views/components/Loginsection";
import Reviews from "./views/components/Reviews";
import Assets from "../../assets";
import CustomEditText from "../proscreens/biz-center/components/customedittext";
import CustomDropdown from "../proscreens/biz-center/components/customdropdown";
import ProCustomButton from "../proscreens/biz-center/components/procustombutton";
import CustomTextWidget from "../proscreens/biz-center/components/customtextwidget";
import CustomCard from "../proscreens/biz-center/components/customcard";
import ProSubscribeSection from "../proscreens/biz-center/components/prosubscribesection";
import { Shop } from "../../common/interfaces/Shop";
import SetupShop from "../proscreens/setup/views/setup";

interface ToggleCustomThemeProps {
  showCustomTheme: Boolean;
  toggleCustomTheme: () => void;
}

function ToggleCustomTheme({
  showCustomTheme,
  toggleCustomTheme,
}: ToggleCustomThemeProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100dvw",
        position: "fixed",
        bottom: 24,
      }}
    >
      <ToggleButtonGroup
        color="primary"
        exclusive
        value={showCustomTheme}
        onChange={toggleCustomTheme}
        aria-label="Toggle design language"
        sx={{
          backgroundColor: "background.default",
          "& .Mui-selected": {
            pointerEvents: "none",
          },
        }}
      >
        <ToggleButton value>
          <AutoAwesomeRoundedIcon sx={{ fontSize: "20px", mr: 1 }} />
          Custom theme
        </ToggleButton>
        <ToggleButton value={false}>Material Design 2</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}

interface SetupShopProps {
  shop?: Shop;
  backToHome?: boolean;
}

export default function BusinessToolsPage({ shop }: SetupShopProps) {
  const [mode, setMode] = React.useState<PaletteMode>("light");
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);

  const [bankValue, setBankValue] = React.useState("");
  const [name, setName] = React.useState("");
  const [igslValue, setIgslValue] = React.useState("");
  const [fbslValue, setFbslValue] = React.useState("");
  const [lslValue, setLslValue] = React.useState("");
  const [xslValue, setXslValue] = React.useState("");
  const [cslValue, setCslValue] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [imageType, setImageType] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const LPtheme = createTheme(getLPTheme(mode));
  const [isSubmit, setIsSubmit] = React.useState(false);

  const handleSubmit = () => {
    console.log("Form submitted with:", {
      name,
      description,
      phone,
      email,
      category,
      imageType,
      bankValue,
      socialLinks: {
        instagram: igslValue,
        facebook: fbslValue,
        linkedIn: lslValue,
        x: xslValue,
        custom: cslValue,
      },
    });
    setIsSubmit(true);
    // Add your form submission logic here
  };

  const defaultTheme = createTheme({
    palette: {
      mode,
      background: {
        default: "#ffffff", // Using hex instead of "white"
      },
    },
  });

  const toggleColorMode = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const toggleCustomTheme = () => {
    setShowCustomTheme((prev) => !prev);
  };

  const categories = [
    "Agriculture, Food & Beverage",
    "Books & Education",
    "Construction & Real Estate",
    "Fashion & Beauty",
    "Finance & Legal",
    "Healthcare & Wellness",
    "Home, Gardens & Outdoors",
    "Jewellery & Timepieces",
    "Media & Entertainment",
    "Security, Safety & Equipment",
    "Technology, Games & Electronic",
    "Vehicle & Transportation",
  ];

  return (
    <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
      <CssBaseline />
      <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
      <div>
       <SetupShop partnerData={null} partnerDatatile={null}/>
      </div>
     
    </ThemeProvider>
  );
}
