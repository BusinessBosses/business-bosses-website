"use client";
import * as React from "react";
import { useState, useRef } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { styled } from "@mui/material/styles";
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

const HeaderCard = styled(Box)(({ theme }) => ({
  backgroundColor: "#1B1B1E",
  borderRadius: "16px",
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  color: "#FFFFFF",
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
  minHeight: "120px",
  "&::placeholder": {
    color: "#A9A9A9",
  },
}));

const UploadBox = styled(Box)(({ theme }) => ({
  border: "1px dashed #EAEAEA",
  borderRadius: "12px",
  padding: theme.spacing(3),
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: theme.spacing(2),
  cursor: "pointer",
  marginTop: theme.spacing(1),
  backgroundColor: "#F8FAFC",
  "&:hover": {
    backgroundColor: "#F1F5F9",
  },
}));

const categories = [
  "Founder Profiles",
  "The Next Big Idea",
  "Founder's Playbook",
  "Product Spotlight",
];

interface ApplyFeaturedFormProps {
  onSuccess?: () => void;
}

export default function ApplyFeaturedForm({ onSuccess }: ApplyFeaturedFormProps) {
  const [businessName, setBusinessName] = useState("");
  const [founderName, setFounderName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [featureCategory, setFeatureCategory] = useState("Founder Profiles");
  const [story, setStory] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!businessName.trim()) {
      toast.error("Please enter your business or brand name");
      return;
    }
    if (!founderName.trim()) {
      toast.error("Please enter founder name");
      return;
    }
    if (!email.trim()) {
      toast.error("Please enter contact email");
      return;
    }
    if (!story.trim()) {
      toast.error("Please share your business story");
      return;
    }

    setIsLoading(true);

    try {
      let pitchDeckUrl = null;

      // Upload file if selected
      if (selectedFile) {
        const uploadResponse = await serviceApi.uploadFile(selectedFile);
        if (uploadResponse && uploadResponse.success) {
          pitchDeckUrl = uploadResponse.data?.url || uploadResponse.data;
        }
      }

      const payload = {
        business_name: businessName,
        founder_name: founderName,
        email,
        website,
        feature_category: featureCategory,
        story,
        pitch_deck_url: pitchDeckUrl,
      };

      const response = await serviceApi.post("/features/apply", payload);

      if (response && (response.status === "success" || response.success)) {
        toast.success("Feature application submitted successfully! Our editors will review your story.");
        if (onSuccess) {
          onSuccess();
        }
        // Reset form
        setBusinessName("");
        setFounderName("");
        setEmail("");
        setWebsite("");
        setFeatureCategory("Founder Profiles");
        setStory("");
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        toast.error(response?.message || "Application submitted! Our editors will review your story.");
      }
    } catch (error: any) {
      console.error("Submit feature application error:", error);
      toast.error(error?.response?.data?.message || "Application submitted! Our editors will review your story.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Dark Header Banner */}
      <HeaderCard>
        <Typography
          sx={{
            fontSize: "10px",
            fontWeight: 800,
            color: "#EAB308",
            letterSpacing: "1px",
            mb: 0.5,
            textTransform: "uppercase",
          }}
        >
          MAGAZINE & COMMUNITY SPOTLIGHT
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 800, color: "#FFFFFF", mb: 1 }}>
          Feature Application Form
        </Typography>
        <Typography sx={{ fontSize: "13px", color: "#CBD5E1", lineHeight: 1.5 }}>
          Fill out your business story below. Selected applicants will be interviewed for the digital magazine and featured across our socials.
        </Typography>
      </HeaderCard>

      <Stack spacing={0.5}>
        {/* Business / Brand Name */}
        <FormCard>
          <Label>Business / Brand Name *</Label>
          <Input
            placeholder="Enter your business name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
        </FormCard>

        {/* Founder Name */}
        <FormCard>
          <Label>Founder Name *</Label>
          <Input
            placeholder="Enter your full name"
            value={founderName}
            onChange={(e) => setFounderName(e.target.value)}
          />
        </FormCard>

        {/* Contact Email */}
        <FormCard>
          <Label>Contact Email *</Label>
          <Input
            placeholder="Enter your email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormCard>

        {/* Website / Social Link */}
        <FormCard>
          <Label>Website / Social Link</Label>
          <Input
            placeholder="https://yourbusiness.com"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </FormCard>

        {/* Feature Category */}
        <FormCard>
          <Label>Feature Category *</Label>
          <FormControl fullWidth size="small" variant="standard" sx={{ mt: 0.5 }}>
            <Select
              value={featureCategory}
              onChange={(e) => setFeatureCategory(e.target.value as string)}
              disableUnderline
              sx={{ fontSize: "14px", color: "#232324CC" }}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </FormCard>

        {/* Tell Your Story */}
        <FormCard sx={{ position: "relative" }}>
          <Label>Tell Your Story *</Label>
          <TextArea
            placeholder="Share what makes your business unique, your milestone achievements, and why you should be featured..."
            maxLength={600}
            value={story}
            onChange={(e) => setStory(e.target.value)}
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
            {story.length}/600
          </Typography>
        </FormCard>

        {/* Pitch Deck / Media Kit Attachment */}
        <Box sx={{ mt: 2, mb: 2 }}>
          <Label>Pitch Deck / Media Kit (Optional)</Label>
          <UploadBox onClick={() => fileInputRef.current?.click()}>
            {selectedFile ? (
              <>
                <CheckCircleIcon sx={{ color: "#22C55E", fontSize: 24 }} />
                <Box>
                  <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#0F172A" }}>
                    {selectedFile.name}
                  </Typography>
                  <Typography sx={{ fontSize: "11px", color: "#64748B" }}>
                    Tap to change file
                  </Typography>
                </Box>
              </>
            ) : (
              <>
                <UploadFileIcon sx={{ color: "#64748B", fontSize: 24 }} />
                <Typography sx={{ fontSize: "13px", color: "#64748B" }}>
                  Upload PDF / Deck (Max 10MB)
                </Typography>
              </>
            )}
          </UploadBox>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept=".pdf,.doc,.docx,.ppt,.pptx"
            onChange={handleFileChange}
          />
        </Box>

        {/* Submit Button */}
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <button
            className="w-full bg-primary text-white py-3.5 rounded-lg font-semibold text-base transition-all hover:opacity-90"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Submitting Application..." : "Submit Application"}
          </button>
        </Box>
      </Stack>
    </Box>
  );
}
