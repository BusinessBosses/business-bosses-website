"use client";
import * as React from "react";
import { useState, useRef } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import Assets from "../../../../assets";
import { toast } from "react-toastify";
import serviceApi from "../../../../services/serviceApi";

const FormCard = styled(Card)(({ theme }) => ({
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  padding: theme.spacing(3),
  boxShadow: "none",
  marginBottom: theme.spacing(2),
  width: "100%",
  border: "1px solid #EAEAEA",
}));

const Label = styled(Typography)(({ theme }) => ({
  color: "#333333",
  fontSize: "14px",
  fontWeight: 700,
  marginBottom: theme.spacing(1),
}));

const Input = styled("input")(({ theme }) => ({
  width: "100%",
  border: "none",
  outline: "none",
  fontSize: "14px",
  color: "#232324CC",
  backgroundColor: "transparent",
  "&::placeholder": {
    color: "#A9A9A9",
  },
}));

const TextArea = styled("textarea")(({ theme }) => ({
  width: "100%",
  border: "none",
  outline: "none",
  fontSize: "14px",
  color: "#232324CC",
  backgroundColor: "transparent",
  resize: "none",
  minHeight: "100px",
  "&::placeholder": {
    color: "#A9A9A9",
  },
}));

const UploadBox = styled(Box)(({ theme }) => ({
  border: "1px dashed #EAEAEA",
  borderRadius: "12px",
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  marginTop: theme.spacing(1),
  backgroundColor: "#F4F4F4",
}));

// Country list for searchable dropdown
const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
  "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain",
  "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria",
  "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde",
  "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros",
  "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark",
  "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador",
  "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland",
  "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada",
  "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
  "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati",
  "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia",
  "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi",
  "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania",
  "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro",
  "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands",
  "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia",
  "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay",
  "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa",
  "San Marino", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone",
  "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa",
  "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden",
  "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste",
  "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
  "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom",
  "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela",
  "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

interface BecomeAPartnerFormProps {
  onSuccess?: () => void;
}

export default function BecomeAPartnerForm({ onSuccess }: BecomeAPartnerFormProps) {
  const [country, setCountry] = useState("");
  const [countryQuery, setCountryQuery] = useState("");
  const [dealDescription, setDealDescription] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyUrl, setCompanyUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [companyPhoto, setCompanyPhoto] = useState<string | null>(null);
  const [partnershipType, setPartnershipType] = useState("");
  const [partnershipTypeOpen, setPartnershipTypeOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);

  const partnershipTypes = [
    "",
    "Brand deals/Discounts",
    "Organisation Initiatives",
    "Government Initiatives",
    "Other",
  ];

  const companyCategories = [
    "",
    "Agriculture, Food & Beverage",
    "Business Services & Consulting",
    "Learning & Education",
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

  const filteredCountries = countries.filter((c) =>
    c.toLowerCase().includes(countryQuery.toLowerCase())
  );

  // Handle file selection - just preview, no upload yet
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setSelectedFile(file);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validation
    if (!companyName.trim()) {
      toast.error("Please enter your company name");
      return;
    }
    if (!companyEmail.trim()) {
      toast.error("Please enter your company email");
      return;
    }
    if (!country) {
      toast.error("Please select your company location");
      return;
    }
    if (!partnershipType) {
      toast.error("Please select partnership type");
      return;
    }
    if (!dealDescription.trim()) {
      toast.error("Please enter deal description");
      return;
    }
    if (!customMessage.trim()) {
      toast.error("Please enter a customized message");
      return;
    }
    if (!companyUrl.trim()) {
      toast.error("Please enter website or redeem link");
      return;
    }
    if (!category) {
      toast.error("Please select company category");
      return;
    }

    setIsLoading(true);

    try {
      // Upload image if selected
      let photoUrl = companyPhoto;
      if (selectedFile && !companyPhoto) {
        const uploadResponse = await serviceApi.uploadFile(selectedFile);
        if (uploadResponse && uploadResponse.success) {
          photoUrl = uploadResponse.data?.url || uploadResponse.data;
        }
      }

      const payload = {
        companyName,
        companyDescription: dealDescription,
        companyUrl,
        companyPhoto: photoUrl,
        companyEmail,
        companyPhone,
        location: country,
        partnershipType,
        category,
      };

      const response = await serviceApi.post("/partner", payload);

      if (response?.success) {
        toast.success("Partner created successfully!");
        if (onSuccess) {
          onSuccess();
        }
        // Reset form
        setCompanyName("");
        setCompanyEmail("");
        setCompanyPhone("");
        setCompanyUrl("");
        setCompanyPhoto(null);
        setSelectedFile(null);
        setImagePreview(null);
        setCountry("");
        setPartnershipType("");
        setDealDescription("");
        setCustomMessage("");
        setCategory("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        toast.error(response?.message || "Failed to create partner");
      }
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(error?.response?.data?.message || "Failed to submit form");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stack spacing={0.5}>
        {/* Company Name */}
        <FormCard>
          <Label>Company Name *</Label>
          <Input 
            placeholder="Enter your company name" 
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </FormCard>

        {/* Company Email */}
        <FormCard>
          <Label>Company Email Address *</Label>
          <Input 
            placeholder="Enter your company email address" 
            type="email"
            value={companyEmail}
            onChange={(e) => setCompanyEmail(e.target.value)}
          />
        </FormCard>

        {/* Company Phone */}
        <FormCard>
          <Label>Company Phone Number (Optional)</Label>
          <Input 
            placeholder="Enter your company phone number" 
            value={companyPhone}
            onChange={(e) => setCompanyPhone(e.target.value)}
          />
        </FormCard>

        {/* Company Location */}
        <FormCard sx={{ position: "relative", overflow: "visible" }}>
          <Label>Company Location *</Label>
          <Box sx={{ position: "relative" }}>
            <Box
              onClick={() => setCountryOpen(!countryOpen)}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
            >
              <span style={{ color: country ? "#232324CC" : "#A9A9A9", fontSize: "14px" }}>
                {country || "Select country"}
              </span>
              <img src={Assets.dropdown} width={12} height={12} />
            </Box>
            {countryOpen && (
              <Box sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                mt: 1,
                maxHeight: "200px",
                overflowY: "auto",
                border: "1px solid #EAEAEA",
                borderRadius: "8px",
                bgcolor: "#fff",
                zIndex: 9999,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
              }}>
                <Box sx={{ p: 1, borderBottom: "1px solid #EAEAEA" }}>
                  <Input
                    placeholder="Search country..."
                    value={countryQuery}
                    onChange={(e) => setCountryQuery(e.target.value)}
                    style={{ padding: "4px 8px" }}
                  />
                </Box>
                {filteredCountries.map((c) => (
                  <Box
                    key={c}
                    onClick={() => {
                      setCountry(c);
                      setCountryOpen(false);
                      setCountryQuery("");
                    }}
                    sx={{
                      px: 2,
                      py: 1,
                      cursor: "pointer",
                      "&:hover": { bgcolor: "#F4F4F4" }
                    }}
                  >
                    {c}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </FormCard>

        {/* Type of Partnership */}
        <FormCard sx={{ position: "relative", overflow: "visible" }}>
          <Label>Type of Partnership *</Label>
          <Box sx={{ position: "relative" }}>
            <Box
              onClick={() => setPartnershipTypeOpen(!partnershipTypeOpen)}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
            >
              <span style={{ color: partnershipType ? "#232324CC" : "#A9A9A9", fontSize: "14px" }}>
                {partnershipType || "Select type"}
              </span>
              <img src={Assets.dropdown} width={12} height={12} />
            </Box>
            {partnershipTypeOpen && (
              <Box sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                mt: 1,
                border: "1px solid #EAEAEA",
                borderRadius: "8px",
                bgcolor: "#fff",
                zIndex: 9999,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
              }}>
                {partnershipTypes.filter(t => t).map((type) => (
                  <Box
                    key={type}
                    onClick={() => {
                      setPartnershipType(type);
                      setPartnershipTypeOpen(false);
                    }}
                    sx={{
                      px: 2,
                      py: 1.5,
                      cursor: "pointer",
                      "&:hover": { bgcolor: "#F4F4F4" }
                    }}
                  >
                    {type}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </FormCard>

        {/* Description of deal */}
        <FormCard sx={{ position: "relative" }}>
          <Label>Description of your deal/offering *</Label>
          <TextArea
            placeholder="Eg. 30% discount on new membership"
            maxLength={300}
            value={dealDescription}
            onChange={(e) => setDealDescription(e.target.value)}
          />
          <Typography
            sx={{
              position: "absolute",
              bottom: 12,
              right: 16,
              fontSize: "12px",
              color: "#A9A9A9",
            }}
          >
            {dealDescription.length}/300
          </Typography>
        </FormCard>

        {/* Customized Message */}
        <FormCard sx={{ position: "relative" }}>
          <Label>Add customised message, bio or note *</Label>
          <TextArea
            placeholder="Enter your customised message"
            maxLength={300}
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
          />
          <Typography
            sx={{
              position: "absolute",
              bottom: 12,
              right: 16,
              fontSize: "12px",
              color: "#A9A9A9",
            }}
          >
            {customMessage.length}/300
          </Typography>
        </FormCard>

        {/* Redeem Link */}
        <FormCard>
          <Label>Website or link to redeem the deal *</Label>
          <Input 
            placeholder="Enter website or link" 
            value={companyUrl}
            onChange={(e) => setCompanyUrl(e.target.value)}
          />
        </FormCard>

        {/* Company Category */}
        <FormCard sx={{ position: "relative", overflow: "visible" }}>
          <Label>Company Category *</Label>
          <Box sx={{ position: "relative" }}>
            <Box
              onClick={() => setCategoryOpen(!categoryOpen)}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
            >
              <span style={{ color: category ? "#232324CC" : "#A9A9A9", fontSize: "14px" }}>
                {category || "Select category"}
              </span>
              <img src={Assets.dropdown} width={12} height={12} />
            </Box>
            {categoryOpen && (
              <Box sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                mt: 1,
                maxHeight: "200px",
                overflowY: "auto",
                border: "1px solid #EAEAEA",
                borderRadius: "8px",
                bgcolor: "#fff",
                zIndex: 9999,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
              }}>
                {companyCategories.filter(c => c).map((cat) => (
                  <Box
                    key={cat}
                    onClick={() => {
                      setCategory(cat);
                      setCategoryOpen(false);
                    }}
                    sx={{
                      px: 2,
                      py: 1.5,
                      cursor: "pointer",
                      "&:hover": { bgcolor: "#F4F4F4" }
                    }}
                  >
                    {cat}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </FormCard>

        {/* File Upload */}
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <img src={Assets.Gallery} width={20} height={20} />
            <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
              Add image or file
            </Typography>
          </Box>
          <UploadBox onClick={() => fileInputRef.current?.click()}>
            {imagePreview ? (
              <Box sx={{ textAlign: "center" }}>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{ maxWidth: "100%", maxHeight: "100px", borderRadius: "8px" }} 
                />
                <Typography sx={{ mt: 1, fontSize: "12px", color: "grey" }}>
                  Tap to change file
                </Typography>
              </Box>
            ) : companyPhoto ? (
              <Box sx={{ textAlign: "center" }}>
                <img 
                  src={companyPhoto} 
                  alt="Company" 
                  style={{ maxWidth: "100%", maxHeight: "100px", borderRadius: "8px" }} 
                />
                <Typography sx={{ mt: 1, fontSize: "12px", color: "green" }}>
                  Image uploaded ✓
                </Typography>
              </Box>
            ) : (
              <>
                <img src={Assets.uploadicon} width={32} height={32} />
                <Typography sx={{ mt: 1, fontSize: "14px", color: "grey" }}>
                  Tap to select file
                </Typography>
              </>
            )}
          </UploadBox>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleFileChange}
          />
        </Box>

        {/* Submit Button */}
        <Box sx={{ mt: 4, textAlign: "center", px: 2 }}>
          <button
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
          <Typography sx={{ fontSize: "12px", color: "grey", mt: 2 }}>
            By clicking submit, you{" "}
            <span style={{ textDecoration: "underline" }}>
              agree to let Business Bosses use your logo
            </span>{" "}
            and branding on marketing materials to promote the partnership
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}
