import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

interface SubmitNewsModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { author: string; title: string; imageUrl: string; summary: string }) => void;
  submitting: boolean;
}

export default function SubmitNewsModal({ open, onClose, onSubmit, submitting }: SubmitNewsModalProps) {
  const [memberAuthor, setMemberAuthor] = React.useState("");
  const [memberTitle, setMemberTitle] = React.useState("");
  const [memberImageUrl, setMemberImageUrl] = React.useState("");
  const [memberSummary, setMemberSummary] = React.useState("");

  const [uploadingImage, setUploadingImage] = React.useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("https://businessbosses.com.ng/upload.php", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data && (data.fileUrl || data.url)) {
        setMemberImageUrl(data.fileUrl || data.url);
      } else {
        alert("Upload failed. Please check the file or use an image URL.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload image. Please try again or paste a link.");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleSubmit = () => {
    if (!memberTitle.trim()) {
      alert("Title is required");
      return;
    }
    // Rule: Member news posts need an image before they can be submitted. (Image compulsory)
    if (!memberImageUrl.trim()) {
      alert("An image is compulsory before submitting a news post. Please upload an image.");
      return;
    }
    onSubmit({
      author: memberAuthor,
      title: memberTitle,
      imageUrl: memberImageUrl,
      summary: memberSummary,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 900, fontSize: "20px" }}>Submit Member News</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <TextField
            label="Business / Founder Name *"
            fullWidth
            value={memberAuthor}
            onChange={(e) => setMemberAuthor(e.target.value)}
            placeholder="e.g. Adaeze Textiles"
          />
          <TextField
            label="News Headline / Title *"
            fullWidth
            value={memberTitle}
            onChange={(e) => setMemberTitle(e.target.value)}
            placeholder="e.g. Adaeze Textiles opens wholesale orders to UK boutiques"
          />
          
          {/* Image Upload Area */}
          <Box sx={{ p: 2, border: "1px dashed #CBD5E1", borderRadius: "8px", bgcolor: "#F8FAFC" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
              <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#334155" }}>
                Article Cover Image * <span style={{ color: "#E11D48" }}>(Compulsory)</span>
              </Typography>
              <label>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileUpload}
                  disabled={uploadingImage}
                />
                <Button
                  component="span"
                  variant="outlined"
                  size="small"
                  disabled={uploadingImage}
                  sx={{ textTransform: "none", fontWeight: 700, fontSize: "12px", borderColor: "#CBD5E1" }}
                >
                  {uploadingImage ? "Uploading..." : "Upload Image"}
                </Button>
              </label>
            </Box>

            {memberImageUrl && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 1.5, p: 1, bgcolor: "#FFFFFF", borderRadius: "6px", border: "1px solid #E2E8F0" }}>
                <img
                  src={memberImageUrl}
                  alt="Upload preview"
                  style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "4px" }}
                />
                <Box sx={{ flex: 1, overflow: "hidden" }}>
                  <Typography sx={{ fontSize: "12px", color: "#059669", fontWeight: 700 }}>
                    ✓ Image uploaded successfully
                  </Typography>
                  <Typography sx={{ fontSize: "11px", color: "#64748B", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                    {memberImageUrl}
                  </Typography>
                </Box>
                <Button
                  size="small"
                  onClick={() => setMemberImageUrl("")}
                  sx={{ fontSize: "11px", color: "#E11D48", textTransform: "none", minWidth: "auto" }}
                >
                  Remove
                </Button>
              </Box>
            )}

            {!memberImageUrl && (
              <TextField
                size="small"
                fullWidth
                value={memberImageUrl}
                onChange={(e) => setMemberImageUrl(e.target.value)}
                placeholder="Or paste direct image URL (https://...)"
                sx={{ mt: 1 }}
              />
            )}
          </Box>
          <TextField
            label="News Summary / Story *"
            fullWidth
            multiline
            rows={4}
            value={memberSummary}
            onChange={(e) => setMemberSummary(e.target.value)}
            placeholder="Briefly describe your launch or milestone..."
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} sx={{ color: "#64748B", fontWeight: 700 }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting}
          sx={{ bgcolor: "#E11D48", color: "#FFF", fontWeight: 800, "&:hover": { bgcolor: "#BE123C" } }}
        >
          {submitting ? "Submitting..." : "Submit News"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
