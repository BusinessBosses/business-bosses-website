import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
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

  const handleSubmit = () => {
    if (!memberTitle.trim()) {
      alert("Title is required");
      return;
    }
    // Rule: Member news posts need an image before they can be submitted. (Image compulsory)
    if (!memberImageUrl.trim()) {
      alert("An image URL is compulsory before submitting a news post.");
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
          <TextField
            label="Image URL * (Compulsory)"
            fullWidth
            value={memberImageUrl}
            onChange={(e) => setMemberImageUrl(e.target.value)}
            placeholder="https://f005.backblazeb2.com/file/business-bosses-alt/..."
            helperText="Member news posts MUST include an image before submitting"
          />
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
