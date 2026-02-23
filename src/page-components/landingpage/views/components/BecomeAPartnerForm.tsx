"use client";
import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import Assets from "../../../../assets";
import { CountryDropdown } from "react-country-region-selector";

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

  const partnershipTypes = [
    "Select type",
    "Brand deals/Discounts",
    "Organisation Initiatives",
    "Government Initiatives",
    "Other",
  ];

  const companyCategories = [
    "Select category",
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

  return (
    <Box sx={{ width: "100%" }}>
      <Stack spacing={0.5}>
        {/* Company Name */}
        <FormCard>
          <Label>Company Name *</Label>
          <Input placeholder="Enter your company name" />
        </FormCard>

        {/* Company Email */}
        <FormCard>
          <Label>Company Email Address *</Label>
          <Input placeholder="Enter your company email address" />
        </FormCard>

        {/* Company Phone */}
        <FormCard>
          <Label>Company Phone Number (Optional)</Label>
          <Typography sx={{ fontSize: "12px", color: "grey", mb: 1 }}>
            Please add your country code. Eg. +44 100 000 0000
          </Typography>
          <Input placeholder="Enter your company phone number" />
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
            <Select>
              {partnershipTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
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
          <Input placeholder="Enter website or link" />
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
            <Select>
              {companyCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
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
          <UploadBox>
            <img src={Assets.uploadicon} width={32} height={32} />
            <Typography sx={{ mt: 1, fontSize: "14px", color: "grey" }}>
              Tap to select file
            </Typography>
          </UploadBox>
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
          >
            Submit
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
