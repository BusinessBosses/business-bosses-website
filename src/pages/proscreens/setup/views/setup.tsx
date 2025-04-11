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
import ShopController from "../../biz-center/controllers/ShopController";
import { useAppSelector } from "../../../../redux/store/store";
import serviceApi from "../../../../services/serviceApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [description, setDescription] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const profile = useAppSelector((state) => state.user);
  const [selectedImage, setSelectedImage] = React.useState(
    Assets.shopplaceholder
  );
  const shopRedux = useAppSelector((state) => state.shop.shopInfo);
  const [location, setLocation] = React.useState("");
  const [paymentSelections, setPaymentSelections] = React.useState<
    Record<string, boolean>
  >({});
  const [isSubmit, setIsSubmit] = React.useState(false);
  const [walletDetails, setWalletDetails] = React.useState<
    Record<string, string>
  >({});
  const [paypalDetails, setPaypalDetails] = React.useState<
    Record<string, string>
  >({});
  const [bankDetails, setBankDetails] = React.useState<Record<string, string>>(
    {}
  );

  const LPtheme = createTheme(getLPTheme(mode));

  const navigate = useNavigate();

  // Redirect: If shop prop is null and shop Redux slice has data, redirect.
  React.useEffect(() => {
    if (!shop && shopRedux) {
      navigate("/pro/dashboard", { replace: true });
    }
  }, [shop, shopRedux, navigate]);

  // Pre-fill form fields if "shop" exists (edit mode)
  React.useEffect(() => {
    if (shop) {
      setName(shop.name || "");
      setEmail(shop.email || "");
      setPhone(shop.phone || "");
      setDescription(shop.description || "");
      setLocation(shop.location || "");
      setCategory(shop.category || "");
      setImageType(shop.imageType || "");
      setIgslValue(shop.instagram || "");
      setFbslValue(shop.facebook || "");
      setLslValue(shop.linkedIn || "");
      setXslValue(shop.twitter || ""); // if shop.twitter exists in your schema
      setCslValue(shop.url || "");
      if (shop.image) {
        setSelectedImage(shop.image);
        // Not setting selectedFile as the image is already on your server.
      }
      // If your shop has payment methods, you can load them into your selectors.
      // For example:
      // setPaymentSelections({ Bank: shopHasBank, Paypal: shopHasPaypal, ... });
      // And similarly populate bankDetails, paypalDetails, walletDetails.
    }
  }, [shop]);

  // Modified file upload handler: store both preview and file.
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type (ensure it's an image)
      if (!file.type.match("image.*")) {
        toast.error("Please select an image file", { autoClose: 3000 });
        return;
      }
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB", { autoClose: 3000 });
        return;
      }
      // Set file for upload and preview URL for display.
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setSelectedFile(file);
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

  // A helper function to upload the file to your backend.
  const uploadFile = async (file: File): Promise<{ success: boolean; fileUrl?: string }> => {
    const response = await serviceApi.uploadFile(file);
                    if (response) {
                        return response;
                    } else {
                        return { success: false };
                    }
  };

  // Define the currency mapping based on your Flutter code.
const currencyValues: Record<string, string> = {
  Afghanistan: "AFN",
  Albania: "ALL",
  Algeria: "DZD",
  AmericanSamoa: "USD",
  Andorra: "EUR",
  Angola: "AOA",
  Anguilla: "XCD",
  Antarctica: "",
  "Antigua and Barbuda": "XCD",
  Argentina: "ARS",
  Armenia: "AMD",
  Aruba: "AWG",
  Australia: "AUD",
  Austria: "EUR",
  Azerbaijan: "AZN",
  "Bahamas (The)": "BSD",
  Bahrain: "BHD",
  Bangladesh: "BDT",
  Barbados: "BBD",
  Belarus: "BYN",
  Belgium: "EUR",
  Belize: "BZD",
  Benin: "XOF",
  Bermuda: "BMD",
  Bhutan: "BTN",
  "Bhutan (Indian Rupee)": "INR",
  "Bolivia, Plurinational State of": "BOB",
  "Bolivia (Plurinational State of) (Mvdol)": "BOV",
  "Bonaire, Sint Eustatius and Saba": "USD",
  "Bosnia and Herzegovina": "BAM",
  Botswana: "BWP",
  "Bouvet Island": "NOK",
  Brazil: "BRL",
  "British Indian Ocean Territory": "USD",
  "Brunei Darussalam": "BND",
  Bulgaria: "BGN",
  "Burkina Faso": "XOF",
  Burundi: "BIF",
  "Cabo Verde": "CVE",
  Cambodia: "KHR",
  Cameroon: "XAF",
  Canada: "CAD",
  "Cayman Islands (The)": "KYD",
  "Central African Republic": "XAF",
  Chad: "XAF",
  "Chile (Unidad de Fomento)": "CLF",
  "Chile (Chilean Peso)": "CLP",
  China: "CNY",
  "Christmas Island": "AUD",
  "Cocos (Keeling) Islands": "AUD",
  Colombia: "COP",
  Comoros: "KMF",
  "Congo, The Democratic Republic of the Congo": "CDF",
  Congo: "XAF",
  "Cook Islands": "NZD",
  "Costa Rica": "CRC",
  Croatia: "EUR",
  Cuba: "CUP",
  Curaçao: "ANG",
  Cyprus: "EUR",
  "Czech Republic": "CZK",
  "Cote d'Ivoire": "XOF",
  Denmark: "DKK",
  Djibouti: "DJF",
  Dominica: "XCD",
  "Dominican Republic (The)": "DOP",
  Ecuador: "USD",
  Egypt: "EGP",
  "El Salvador": "USD",
  "Equatorial Guinea": "XAF",
  Eritrea: "ERN",
  Estonia: "EUR",
  Ethiopia: "ETB",
  "European Union": "EUR",
  "Falkland Islands (Malvinas)": "FKP",
  "Faroe Islands": "DKK",
  Fiji: "FJD",
  Finland: "EUR",
  France: "EUR",
  "French Guiana": "EUR",
  "French Polynesia": "XPF",
  "French Southern Territories": "EUR",
  Gabon: "XAF",
  "Gambia (The)": "GMD",
  Georgia: "GEL",
  Germany: "EUR",
  Ghana: "GHS",
  Gibraltar: "GIP",
  Greece: "EUR",
  Greenland: "DKK",
  Grenada: "XCD",
  Guadeloupe: "EUR",
  Guam: "USD",
  Guatemala: "GTQ",
  Guernsey: "GBP",
  Guinea: "GNF",
  "Guinea-Bissau": "XOF",
  Guyana: "GYD",
  Haiti: "HTG",
  "Heard Island and McDonald Islands": "AUD",
  "Holy See (Vatican City State)": "EUR",
  Honduras: "HNL",
  "Hong Kong": "HKD",
  Hungary: "HUF",
  Iceland: "ISK",
  India: "INR",
  Indonesia: "IDR",
  "Iran, Islamic Republic of Persian Gulf": "IRR",
  Iraq: "IQD",
  Ireland: "EUR",
  "Isle of Man": "GBP",
  Israel: "ILS",
  Italy: "EUR",
  Jamaica: "JMD",
  Japan: "JPY",
  Jersey: "GBP",
  Jordan: "JOD",
  Kazakhstan: "KZT",
  Kenya: "KES",
  Kiribati: "AUD",
  "Korea, Democratic People’s Republic of Korea)": "KPW",
  "Korea, Republic of South Korea": "KRW",
  Kuwait: "KWD",
  Kyrgyzstan: "KGS",
  Laos: "LAK",
  Latvia: "EUR",
  Lebanon: "LBP",
  "Lesotho (Loti)": "LSL",
  "Lesotho (Rand)": "ZAR",
  Liberia: "LRD",
  "Libyan Arab Jamahiriya": "LYD",
  Liechtenstein: "CHF",
  Lithuania: "EUR",
  Luxembourg: "EUR",
  Macao: "MOP",
  Madagascar: "MGA",
  Malawi: "MWK",
  Malaysia: "MYR",
  Maldives: "MVR",
  Mali: "XOF",
  Malta: "EUR",
  "Marshall Islands (The)": "USD",
  Martinique: "EUR",
  Mauritania: "MRU",
  Mauritius: "MUR",
  Mayotte: "EUR",
  "Member Countries of the African Development Bank Group": "XUA",
  "Mexico (Mexican Peso)": "MXN",
  "Mexico (Mexican Unidad de Inversion - UDI)": "MXV",
  "Micronesia, Federated States of Micronesia": "USD",
  Moldova: "MDL",
  Monaco: "EUR",
  Mongolia: "MNT",
  Montenegro: "EUR",
  Montserrat: "XCD",
  Morocco: "MAD",
  Mozambique: "MZN",
  Myanmar: "MMK",
  Namibia: "NAD",
  Nauru: "AUD",
  Nepal: "NPR",
  "Netherlands (The)": "EUR",
  "New Caledonia": "XPF",
  "New Zealand": "NZD",
  Nicaragua: "NIO",
  "Niger (The)": "XOF",
  Nigeria: "NGN",
  Niue: "NZD",
  "Norfolk Island": "AUD",
  "Northern Mariana Islands (The)": "USD",
  Norway: "NOK",
  Oman: "OMR",
  Pakistan: "PKR",
  Palau: "USD",
  "Palestinian Territory, Occupied, State of": "",
  Panama: "PAB",
  "Papua New Guinea": "PGK",
  Paraguay: "PYG",
  Peru: "PEN",
  "Philippines (The)": "PHP",
  Pitcairn: "NZD",
  Poland: "PLN",
  Portugal: "EUR",
  "Puerto Rico": "USD",
  Qatar: "QAR",
  "Republic of North Macedonia": "MKD",
  Romania: "RON",
  "Russian Federation (The)": "RUB",
  Rwanda: "RWF",
  Réunion: "EUR",
  "Saint Barthélemy": "EUR",
  "Saint Helena, Ascension and Tristan da Cunha": "SHP",
  "Saint Kitts and Nevis": "XCD",
  "Saint Lucia": "XCD",
  "Saint Martin (French Part)": "EUR",
  "Saint Pierre and Miquelon": "EUR",
  "Saint Vincent and the Grenadines": "XCD",
  Samoa: "WST",
  "San Marino": "EUR",
  "Sao Tome and Principe": "STN",
  "Saudi Arabia": "SAR",
  Senegal: "XOF",
  Serbia: "RSD",
  Seychelles: "SCR",
  "Sierra Leone": "SLE",
  Singapore: "SGD",
  "Sint Maarten (Dutch Part)": "ANG",
  'Sistema Unitario de Compensacion Regional de Pagos "Sucre"': "XSU",
  Slovakia: "EUR",
  Slovenia: "EUR",
  "Solomon Islands": "SBD",
  Somalia: "SOS",
  "South Africa": "ZAR",
  "South Georgia and the South Sandwich Islands": "",
  "South Sudan": "SSP",
  Spain: "EUR",
  "Sri Lanka": "LKR",
  "Sudan (The)": "SDG",
  Suriname: "SRD",
  "Svalbard and Jan Mayen": "NOK",
  Swaziland: "SZL",
  Sweden: "SEK",
  "Switzerland (WIR Euro)": "CHE",
  "Switzerland (Swiss Franc)": "CHF",
  "Switzerland (WIR Franc)": "CHW",
  "Syrian Arab Republic": "SYP",
  "Taiwan (Province of China)": "TWD",
  Tajikistan: "TJS",
  "Tanzania, United Republic of Tanzania": "TZS",
  Thailand: "THB",
  "Timor-Leste": "USD",
  Togo: "XOF",
  Tokelau: "NZD",
  Tonga: "TOP",
  "Trinidad and Tobago": "TTD",
  Tunisia: "TND",
  Turkey: "TRY",
  Turkmenistan: "TMT",
  "Turks and Caicos Islands": "USD",
  Tuvalu: "AUD",
  Uganda: "UGX",
  Ukraine: "UAH",
  "United Arab Emirates (The)": "AED",
  "United Kingdom": "GBP",
  "United States": "USD",
  "United States of America (The)": "USD",
  "United States of America (The) (US Dollar Next day)": "USN",
  "Uruguay (Uruguay Peso en Unidades Indexadas - URUIURUI)": "UYI",
  "Uruguay (Peso Uruguayo)": "UYU",
  Uzbekistan: "UZS",
  Vanuatu: "VUV",
  "Venezuela, Bolivarian Republic of Venezuela": "VEF",
  "Venezuela (Bolivarian Republic of)": "VED",
  Vietnam: "VND",
  "Virgin Islands, British": "USD",
  "Virgin Islands, U.S.": "USD",
  "Wallis and Futuna": "XPF",
  "Western Sahara": "MAD",
  Yemen: "YER",
  Zambia: "ZMW",
  Zimbabwe: "ZWL",
  "Aland Islands": "EUR",
};

// Validate required fields. Mimics the Flutter validations.
const validateForm = (): boolean => {
  if (!name.trim()) {
    toast.error("Shop name is required", { autoClose: 3000 });
    return false;
  }
  if (!location.trim()) {
    toast.error("Location is required", { autoClose: 3000 });
    return false;
  }
  if (!category.trim()) {
    toast.error("Select a category", { autoClose: 3000 });
    return false;
  }
  if (paymentSelections["Bank"] && Object.keys(bankDetails).length === 0) {
    toast.error("Bank payment details are required", { autoClose: 3000 });
    return false;
  }
  if (paymentSelections["Paypal"] && Object.keys(paypalDetails).length === 0) {
    toast.error("Paypal payment details are required", { autoClose: 3000 });
    return false;
  }
  if (paymentSelections["Wallet"] && Object.keys(walletDetails).length === 0) {
    toast.error("Wallet payment details are required", { autoClose: 3000 });
    return false;
  }
  return true;
};


const handleSubmit = async () => {
  // Stop if validations fail.
  if (!validateForm()) {
    return;
  }
  setIsSubmit(true);
  // Build an array of payment methods similar to the Flutter code.
  const paymentMethods = [];
  if (paymentSelections["Bank"] && Object.keys(bankDetails).length > 0) {
    paymentMethods.push({
      paymentMethod: "Bank",
      details: JSON.stringify(bankDetails),
    });
  }
  if (paymentSelections["Paypal"] && Object.keys(paypalDetails).length > 0) {
    paymentMethods.push({
      paymentMethod: "Paypal",
      details: JSON.stringify(paypalDetails),
    });
  }
  if (paymentSelections["Wallet"] && Object.keys(walletDetails).length > 0) {
    paymentMethods.push({
      paymentMethod: "Wallet",
      details: JSON.stringify(walletDetails),
    });
  }
  if (paymentSelections["Cash"]) {
    paymentMethods.push({
      paymentMethod: "Cash",
      details: "some details",
    });
  }

  // Use the currencyValues mapping to determine the correct currency.
  const currency = location && currencyValues[location] ? currencyValues[location] : "USD";

  let imageUrl = selectedImage !== Assets.shopplaceholder ? "custom-image" : "default-image";

  // If a file was selected, upload it and get the URL.
  if (selectedFile) {
    console.log(selectedFile);
    const uploadResponse = await uploadFile(selectedFile);
    if (uploadResponse.success && uploadResponse.fileUrl) {
      imageUrl = uploadResponse.fileUrl;
    } else {
      toast.error("Error while uploading image!", { autoClose: 3000 });
      setIsSubmit(false);
      return;
    }
  }

  // Create the payload, mirroring the Flutter code structure.
  const payload = {
    userId: profile.profile?.uid,
    name,
    email,
    phone,
    description,
    image: imageUrl,
    location,
    paymentMethods,
    currency,
    details: "Some additional details about the shop",
    instagram: igslValue,
    twitter: xslValue,
    facebook: fbslValue,
    linkedIn: lslValue,
    url: cslValue,
    imageType: imageType ? imageType.toLowerCase() : "",
    category,
  };

  console.log("Payload to send:", payload);
  // Update shop if it exists; otherwise, add a new shop.
  let response;
  if (shop) {
    response = await ShopController.updateShop(shop.id, payload);
  } else {
    response = await ShopController.addShop(payload);
  }
  console.log(response);
  setIsSubmit(false);
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

                <CountryDropdown
                  classes="bg-white outline-none border-none rounded-lg text-sm font-semibold block w-full p-3"
                  value={location ?? ""}
                  onChange={(val) => {
                    setLocation(val);
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
