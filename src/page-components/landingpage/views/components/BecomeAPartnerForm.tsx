"use client";
import * as React from "react";
import { useState, useRef } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import Assets from "../../../../assets";
import { CountryDropdown } from "react-country-region-selector";
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

const Select = styled("select")(({ theme }) => ({
  width: "100%",
  border: "none",
  outline: "none",
  fontSize: "14px",
  color: "#232324CC",
  backgroundColor: "transparent",
  appearance: "none",
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

export default function BecomeAPartnerForm() {
  const [country, setCountry] = useState("");
  const [dealDescription, setDealDescription] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyUrl, setCompanyUrl] = useState("");
  const [companyPhoto, setCompanyPhoto] = useState<string | null>(null);
  const [partnershipType, setPartnershipType] = useState("");
  const [category, setCategory] = useState("");

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

  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const uploadResponse = await serviceApi.uploadFile(file);
        if (uploadResponse && uploadResponse.success) {
          setCompanyPhoto(uploadResponse.data?.url || uploadResponse.data);
          toast.success("Image uploaded successfully");
        } else {
          toast.error("Failed to upload image");
        }
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Failed to upload image");
      }
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
      const payload = {
        companyName,
        companyDescription: dealDescription,
        companyUrl,
        companyPhoto,
        companyEmail,
        companyPhone,
        location: country,
        partnershipType,
        category,
      };

      const response = await serviceApi.post("/partner", payload);

      if (response?.success) {
        toast.success("Partner created successfully!");
        // Reset form
        setCompanyName("");
        setCompanyEmail("");
        setCompanyPhone("");
        setCompanyUrl("");
        setCompanyPhoto(null);
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
          <Typography sx={{ fontSize: "12px", color: "grey", mb: 1 }}>
            Please add your country code. Eg. +44 100 000 0000
          </Typography>
          <Input 
            placeholder="Enter your company phone number" 
            value={companyPhone}
            onChange={(e) => setCompanyPhone(e.target.value)}
          />
        </FormCard>

        {/* Company Location */}
        <FormCard>
          <Label>Company Location *</Label>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <CountryDropdown
              value={country}
              onChange={(val) => setCountry(val)}
              classes="country-dropdown-custom"
              defaultOptionLabel="Select country"
            />
            <img src={Assets.Nexticonblack} width={12} height={12} />
          </Box>
        </FormCard>

        {/* Type of Partnership */}
        <FormCard>
          <Label>Type of Partnership *</Label>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Select value={partnershipType} onChange={(e) => setPartnershipType(e.target.value)}>
              {partnershipTypes.map((type) => (
                <option key={type} value={type}>
                  {type || "Select type"}
                </option>
              ))}
            </Select>
            <img src={Assets.dropdown} width={12} height={12} />
          </Box>
        </FormCard>

        {/* Description of deal */}
        <FormCard sx={{ position: "relative" }}>
          <Label>Description of your deal/offering *</Label>
          <Typography sx={{ fontSize: "12px", color: "grey", mb: 1 }}>
            Eg. 30% discount on new membership
          </Typography>
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
        <FormCard>
          <Label>Company Category *</Label>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              {companyCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat || "Select category"}
                </option>
              ))}
            </Select>
            <img src={Assets.dropdown} width={12} height={12} />
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
            {companyPhoto ? (
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

        {/* Submit Button & Consent */}
        <Box sx={{ mt: 4, textAlign: "center", px: 2 }}>
          <Typography sx={{ fontSize: "12px", color: "grey", mb: 3 }}>
            By clicking submit, you{" "}
            <span style={{ textDecoration: "underline" }}>
              agree to let Business Bosses use your logo
            </span>{" "}
            and branding on marketing materials to promote the partnership
          </Typography>
          <button
            className="bg-primary rounded-xl py-3.5 text-white text-md flex items-center justify-center font-bold w-full"
            style={{ maxWidth: "300px", margin: "0 auto" }}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </Box>
      </Stack>

      <style jsx global>{`
        .country-dropdown-custom {
          width: 100%;
          border: none;
          outline: none;
          font-size: 14px;
          color: #232324cc;
          background-color: transparent;
          appearance: none;
        }
      `}</style>
    </Box>
  );
}
