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
    console.log("Form submitted");
  };
  const defaultTheme = createTheme({ palette: { mode } });

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
        <div className=" bg-backgroundcolor items-center justify-center ">
          <Container maxWidth="lg">
            <div className="flex flex-col md:flex-row items-center justify-center w-full h-[calc(100vh-80px)] md:px-5 px-0">
              <div className="w-full pt-5 space-y items-start justify-start md:text-left text-center">
                <div className="text-lg font-bold">
                  Set Up Your Biz-Centre & Start Selling
                </div>
                <div className="text-sm">
                  Smart way to Sell & Manage your Business, All in One Place.
                </div>
                <div className="text-sm">Free and Easy to Setup</div>

                <div className="hidden md:flex">
                  <ProSubscribeSection />
                </div>
              </div>

              <div className="flex-col w-full h-full py-5  space-y-4 overflow-scroll">
                <CustomCard
                  caption={"Customise your Biz-Center"}
                  subText={"Add a photo for your biz-center"}
                  buttonText={"Choose Photo"}
                  onPressed={function (): void {
                    throw new Error("Function not implemented.");
                  }}
                  imagePath={Assets.shopplaceholder}
                />
                <CustomDropdown
                  caption="Image Type"
                  hintText="Choose an image type"
                  items={["Circle", "Banner"]}
                  onChanged={(newValue) => setImageType(newValue ?? "")}
                />
                <CustomEditText
                  caption="Biz-Center Name *"
                  hintText={"Enter biz-center name here"}
                  value={""}
                  onChange={setName}
                />
                <CustomEditText
                  maxLength={300}
                  caption="Biz-Center Message * (Description)"
                  hintText={"Enter biz-center description here"}
                  value={""}
                  onChange={setDescription}
                />
                <CustomEditText
                  caption="Phone Number (Optional)"
                  hintText={"+448908654321"}
                  value={""}
                  onChange={setPhone}
                />
                <CustomEditText
                  caption="Business Email Address (Optional)"
                  hintText={"example@business.com"}
                  value={""}
                  onChange={setEmail}
                />

                <CustomDropdown
                  initialValue={"category"}
                  caption="Select Category *"
                  hintText="Choose a category"
                  items={categories}
                  onChanged={(newValue) => setCategory(newValue ?? "")}
                />
                <CustomTextWidget
                  caption={"Location"}
                  iconName={"Assets.phone"}
                />
                <CustomDropdown
                  caption={"Select Payment Method"}
                  iconName={""}
                  items={[]}
                />
                <CustomEditText
                  maxLength={300}
                  isPaymentField={true}
                  isSL={true}
                  caption="Social Links"
                  hintText=""
                  value={bankValue}
                  onChange={setBankValue}
                  pm1Hint="Enter Instagram URL"
                  pm2Hint="Enter Facebook URL"
                  pm3Hint="Enter LinkedIn URL"
                  pm4Hint="Enter X URL"
                  pm5Hint="Enter Custom URL"
                  pm1Value={igslValue}
                  pm1OnChange={setIgslValue}
                  pm2Value={fbslValue}
                  pm2OnChange={setFbslValue}
                  pm3Value={lslValue}
                  pm3OnChange={setLslValue}
                  pm4Value={xslValue}
                  pm4OnChange={setXslValue}
                  pm5Value={cslValue}
                  pm5OnChange={setCslValue}
                />

                <ProCustomButton
                  color="bg-primary"
                  text={shop ? "Save Changes" : "Complete Setup"}
                  loading={isSubmit}
                  onPressed={handleSubmit}
                />
              </div>
            </div>
          </Container>
        </div>
      </div>
      <Box sx={{ bgcolor: "background.default" }}>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
