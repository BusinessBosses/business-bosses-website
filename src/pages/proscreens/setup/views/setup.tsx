import { Business } from "@mui/icons-material";
import React from "react";
import { Container, PaletteMode } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { Shop } from "../../../../common/interfaces/Shop";
import getLPTheme from "../../../landingpage/getLPTheme";
import AppAppBar from "../../../landingpage/views/components/AppAppBar";
import ProSubscribeSection from "../../biz-center/components/prosubscribesection";
import CustomCard from "../../biz-center/components/customcard";
import Assets from "../../../../assets";
import CustomDropdown from "../../biz-center/components/customdropdown";
import CustomEditText from "../../biz-center/components/customedittext";
import CustomTextWidget from "../../biz-center/components/customtextwidget";
import ProCustomButton from "../../biz-center/components/procustombutton";
import Footer from "../../../landingpage/views/components/Footer";
import { PartnerData } from "../../../../common/interfaces/partnerdata";
import { PartnerDatatile } from "../../../../common/interfaces/partnerdatatile";
import ComputerHeader from "../../../home/views/components/ComputerHeader";
import { CountryDropdown } from "react-country-region-selector";
import PaymentMethodSelector from "../../biz-center/components/paymentmethod";

interface SetupShopProps {
  shop?: Shop;
  backToHome?: boolean;
  partnerData: PartnerData | null;
  partnerDatatile: PartnerDatatile | null;
}

interface ToggleCustomThemeProps {
  showCustomTheme: boolean;
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

const SetupShop = ({ shop, partnerData, partnerDatatile }: SetupShopProps) => {
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
  const [selectedImage, setSelectedImage] = React.useState(
    Assets.shopplaceholder
  );
  const [country, setCountry] = React.useState("");
  const [paymentSelections, setPaymentSelections] = React.useState<Record<string, boolean>>({});
  const [isSubmit, setIsSubmit] = React.useState(false);
  const [walletDetails, setWalletDetails] = React.useState<Record<string, string>>({});
  const [paypalDetails, setPaypalDetails] = React.useState<Record<string, string>>({});
  const [bankDetails, setBankDetails] = React.useState<Record<string, string>>({});

  const LPtheme = createTheme(getLPTheme(mode));

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.match("image.*")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be less than 5MB");
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  // Clean up object URLs when component unmounts
  React.useEffect(() => {
    return () => {
      if (selectedImage && selectedImage !== Assets.shopplaceholder) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [selectedImage]);

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
      image:
        selectedImage !== Assets.shopplaceholder
          ? "custom-image"
          : "default-image",
    });
    setIsSubmit(true);
  };

  const defaultTheme = createTheme({
    palette: {
      mode,
      background: {
        default: "#ffffff",
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
      <div className="hidden md:block">
        <ComputerHeader
          partnerData={partnerData}
          partnerDatatile={partnerDatatile}
        />
      </div>

      <div>
        <div className="bg-backgroundcolor items-center justify-center">
          <Container maxWidth="lg">
            <div className="flex flex-col md:flex-row items-center justify-center w-full h-[calc(100vh-80px)]">
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

              <div className="flex-col w-full h-full py-5 space-y-4 overflow-scroll">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />

                <CustomCard
                  caption={"Customise your Biz-Center"}
                  subText={"Add a photo for your biz-center"}
                  buttonText={"Choose Photo"}
                  onPressed={() =>
                    document.getElementById("image-upload")?.click()
                  }
                  imagePath={selectedImage}
                  iconPath={Assets.uploadicon}
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
                  value={name}
                  onChange={setName}
                  maxLength={30}
                />
                <CustomEditText
                  optionalText={"(Description)"}
                  maxLength={300}
                  caption="Biz-Center Message *"
                  hintText={"Enter biz-center description here"}
                  value={description}
                  onChange={setDescription}
                />
                <CustomEditText
                  optionalText={"(Optional)"}
                  caption="Phone Number"
                  hintText={"+448908654321"}
                  value={phone}
                  onChange={setPhone}
                />
                <CustomEditText
                  optionalText={"(Optional)"}
                  caption="Business Email Address"
                  hintText={"example@business.com"}
                  value={email}
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
                <CountryDropdown
                  classes="bg-[#F4F4F4] outline-none border-none rounded-lg block w-full p-3"
                  value={country ?? ""}
                  onChange={(val) => {
                    setCountry(val);
                  }}
                />
                <PaymentMethodSelector
                  onSelectionChange={(newSelections) => {
                    setPaymentSelections(newSelections);
                  }}
                  onComplete={(details) => {
                    setBankDetails(details.bankDetails);
                    setPaypalDetails(details.paypalDetails);
                    setWalletDetails(details.walletDetails);
                  }}
                />
                <CustomDropdown
                  caption={"Select Payment Method"}
                  iconName={""}
                  items={["Bank Transfer", "Credit Card", "PayPal"]}
                  onChanged={(newValue) => setBankValue(newValue ?? "")}
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
};

export default SetupShop;
