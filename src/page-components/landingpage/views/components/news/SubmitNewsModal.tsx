import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Tooltip from "@mui/material/Tooltip";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import TitleIcon from "@mui/icons-material/Title";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import LinkIcon from "@mui/icons-material/Link";

interface SubmitNewsModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { author: string; title: string; imageUrl: string; summary: string; content?: string }) => void;
  submitting: boolean;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://orca-app-5dg8w.ondigitalocean.app/api/v1";

export default function SubmitNewsModal({ open, onClose, onSubmit, submitting }: SubmitNewsModalProps) {
  const [memberAuthor, setMemberAuthor] = React.useState("");
  const [memberTitle, setMemberTitle] = React.useState("");
  const [memberImageUrl, setMemberImageUrl] = React.useState("");
  const [memberSummary, setMemberSummary] = React.useState("");
  const [htmlContent, setHtmlContent] = React.useState("");

  const editorRef = React.useRef<HTMLDivElement>(null);
  const [uploadingImage, setUploadingImage] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isDragOver, setIsDragOver] = React.useState(false);

  // Sync editor content on open / close
  React.useEffect(() => {
    if (!open) {
      setErrorMessage(null);
    } else {
      setTimeout(() => {
        if (editorRef.current && !editorRef.current.innerHTML.trim() && htmlContent) {
          editorRef.current.innerHTML = htmlContent;
        }
      }, 50);
    }
  }, [open]);

  const execCmd = (command: string, value: string | undefined = undefined) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, value);
    setHtmlContent(editorRef.current.innerHTML);
  };

  const insertLink = () => {
    const url = prompt("Enter web link URL (e.g. https://example.com):");
    if (url) {
      execCmd("createLink", url);
    }
  };

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }

    setUploadingImage(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    // 1. Primary upload
    try {
      const res = await fetch("https://businessbosses.com.ng/upload.php", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      const uploadedUrl = data?.fileUrl || data?.url;
      if (uploadedUrl) {
        setMemberImageUrl(uploadedUrl);
        setUploadingImage(false);
        return;
      }
    } catch (primaryErr) {
      console.warn("Primary upload.php failed, trying backend fallback:", primaryErr);
    }

    // 2. Fallback to API uploads endpoint
    try {
      const fallbackRes = await fetch(`${API_BASE}/uploads/fallback`, {
        method: "POST",
        body: formData,
      });
      const fallbackData = await fallbackRes.json();
      const fallbackUrl = fallbackData?.data?.url || fallbackData?.fileUrl;
      if (fallbackUrl) {
        setMemberImageUrl(fallbackUrl);
        setUploadingImage(false);
        return;
      }
    } catch (fallbackErr) {
      console.error("Backend upload fallback also failed:", fallbackErr);
    }

    setErrorMessage("Failed to upload image. Please try again or paste a public image URL.");
    setUploadingImage(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const editorBody = editorRef.current?.innerHTML?.trim() || htmlContent.trim();
    const plainTextBody = editorRef.current?.innerText?.trim() || "";

    if (!memberAuthor.trim()) {
      setErrorMessage("Founder or business name is required.");
      return;
    }
    if (!memberTitle.trim()) {
      setErrorMessage("News headline/title is required.");
      return;
    }
    if (!memberImageUrl.trim()) {
      setErrorMessage("An article cover image is compulsory before submitting.");
      return;
    }
    if (!plainTextBody && !memberSummary.trim()) {
      setErrorMessage("Please write your news article story.");
      return;
    }

    const finalSummary = memberSummary.trim() || (plainTextBody.slice(0, 180) + (plainTextBody.length > 180 ? "..." : ""));

    onSubmit({
      author: memberAuthor.trim(),
      title: memberTitle.trim(),
      imageUrl: memberImageUrl.trim(),
      summary: finalSummary,
      content: editorBody || finalSummary,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          borderRadius: "24px",
          boxShadow: "0 25px 60px -15px rgba(15, 23, 42, 0.3)",
          bgcolor: "#FFFFFF",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      }}
    >
      {/* Header (Fixed) */}
      <Box
        sx={{
          px: { xs: 3, md: 5 },
          pt: 3.5,
          pb: 2.5,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          borderBottom: "1px solid #F1F5F9",
          bgcolor: "#FFFFFF",
          flexShrink: 0,
        }}
      >
        <Box>
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <Typography sx={{ fontSize: "11px", fontWeight: 800, color: "#E11D48", textTransform: "uppercase", letterSpacing: "1.2px" }}>
              Public Newsroom
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 900, color: "#0F172A", fontSize: { xs: "22px", md: "26px" }, tracking: "-0.5px" }}>
            Submit Member News
          </Typography>
          <Typography sx={{ fontSize: "13px", color: "#64748B", mt: 0.5 }}>
            Publish your business launch, milestone or announcement. Verified articles appear on the homepage and news feed.
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          disabled={submitting}
          sx={{
            color: "#64748B",
            bgcolor: "#F8FAFC",
            "&:hover": { bgcolor: "#F1F5F9", color: "#0F172A" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Form Content (Scrollable Body) */}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, overflow: "hidden" }}>
        <Box sx={{ px: { xs: 3, md: 5 }, py: 3.5, display: "flex", flexDirection: "column", gap: 3, overflowY: "auto", flex: 1 }}>
          {errorMessage && (
            <Alert severity="error" sx={{ borderRadius: "14px", fontSize: "13px", fontWeight: 600 }}>
              {errorMessage}
            </Alert>
          )}

          {/* Row 1: Founder/Business & Headline */}
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" }, gap: 2.5 }}>
            <Box>
              <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#0F172A", mb: 0.75 }}>
                Business or Founder <span style={{ color: "#E11D48" }}>*</span>
              </Typography>
              <input
                type="text"
                value={memberAuthor}
                onChange={(e) => setMemberAuthor(e.target.value)}
                placeholder="e.g. Adaeze Textiles"
                disabled={submitting}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "12px",
                  border: "1px solid #E2E8F0",
                  backgroundColor: "#F8FAFC",
                  fontSize: "14px",
                  color: "#0F172A",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </Box>

            <Box>
              <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#0F172A", mb: 0.75 }}>
                Headline / Title <span style={{ color: "#E11D48" }}>*</span>
              </Typography>
              <input
                type="text"
                value={memberTitle}
                onChange={(e) => setMemberTitle(e.target.value)}
                placeholder="e.g. Adaeze Textiles opens wholesale orders to UK boutiques"
                disabled={submitting}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "12px",
                  border: "1px solid #E2E8F0",
                  backgroundColor: "#F8FAFC",
                  fontSize: "14px",
                  color: "#0F172A",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </Box>
          </Box>

          {/* Row 2: Cover Image Upload */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
              <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#0F172A" }}>
                Article Cover Image <span style={{ color: "#E11D48" }}>* (Compulsory)</span>
              </Typography>
              <Typography sx={{ fontSize: "12px", color: "#94A3B8" }}>
                PNG, JPG or WEBP (16:9 banner recommended)
              </Typography>
            </Box>

            {!memberImageUrl ? (
              <Box
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                sx={{
                  border: isDragOver ? "2px dashed #E11D48" : "2px dashed #CBD5E1",
                  bgcolor: isDragOver ? "#FFF1F2" : "#F8FAFC",
                  borderRadius: "16px",
                  p: 3.5,
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1.5,
                  "&:hover": {
                    borderColor: "#E11D48",
                    bgcolor: "#FFF1F2",
                  },
                }}
              >
                <input
                  type="file"
                  id="submit-news-file-input"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  disabled={uploadingImage || submitting}
                />
                <label htmlFor="submit-news-file-input" style={{ width: "100%", cursor: "pointer" }}>
                  {uploadingImage ? (
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                      <CircularProgress size={32} sx={{ color: "#E11D48" }} />
                      <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#E11D48" }}>
                        Uploading image...
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "14px",
                          bgcolor: "#FFF1F2",
                          color: "#E11D48",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <CloudUploadIcon />
                      </Box>
                      <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "#0F172A" }}>
                        Click to upload cover image or drag & drop
                      </Typography>
                      <Typography sx={{ fontSize: "12px", color: "#64748B" }}>
                        Clear graphics, press photos, or announcements
                      </Typography>
                    </Box>
                  )}
                </label>
              </Box>
            ) : (
              <Box
                sx={{
                  p: 2,
                  bgcolor: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box
                  component="img"
                  src={memberImageUrl}
                  alt="Cover preview"
                  sx={{
                    width: "84px",
                    height: "56px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    border: "1px solid #E2E8F0",
                    bgcolor: "#FFFFFF",
                  }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.25 }}>
                    <CheckCircleIcon sx={{ fontSize: "16px", color: "#10B981" }} />
                    <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#065F46" }}>
                      Cover image attached
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "11px",
                      color: "#64748B",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {memberImageUrl}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => setMemberImageUrl("")}
                  disabled={submitting}
                  sx={{
                    color: "#EF4444",
                    bgcolor: "#FEE2E2",
                    "&:hover": { bgcolor: "#FCA5A5" },
                  }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>

          {/* Row 3: Short Lead Excerpt */}
          <Box>
            <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#0F172A", mb: 0.75 }}>
              Summary / Lead Excerpt
            </Typography>
            <input
              type="text"
              value={memberSummary}
              onChange={(e) => setMemberSummary(e.target.value)}
              placeholder="1-2 sentences summarizing the key announcement (appears in previews)"
              disabled={submitting}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "12px",
                border: "1px solid #E2E8F0",
                backgroundColor: "#F8FAFC",
                fontSize: "14px",
                color: "#0F172A",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </Box>

          {/* Row 4: Rich Text Editor */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
              <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#0F172A" }}>
                Full Article Story <span style={{ color: "#E11D48" }}>*</span>
              </Typography>
              <Typography sx={{ fontSize: "12px", color: "#94A3B8" }}>
                Format text with bold, headings, quotes, and links
              </Typography>
            </Box>

            {/* Editor Container */}
            <Box
              sx={{
                border: "1px solid #E2E8F0",
                borderRadius: "16px",
                bgcolor: "#FFFFFF",
                overflow: "hidden",
                boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
              }}
            >
              {/* Rich Text Toolbar */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  p: 1,
                  bgcolor: "#F8FAFC",
                  borderBottom: "1px solid #E2E8F0",
                  flexWrap: "wrap",
                }}
              >
                <Tooltip title="Bold">
                  <IconButton size="small" onClick={() => execCmd("bold")} sx={{ color: "#475569", "&:hover": { bgcolor: "#E2E8F0" } }}>
                    <FormatBoldIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Italic">
                  <IconButton size="small" onClick={() => execCmd("italic")} sx={{ color: "#475569", "&:hover": { bgcolor: "#E2E8F0" } }}>
                    <FormatItalicIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Box sx={{ width: "1px", height: "18px", bgcolor: "#CBD5E1", mx: 0.5 }} />

                <Tooltip title="Heading">
                  <IconButton size="small" onClick={() => execCmd("formatBlock", "<h3>")} sx={{ color: "#475569", "&:hover": { bgcolor: "#E2E8F0" } }}>
                    <TitleIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Bullet List">
                  <IconButton size="small" onClick={() => execCmd("insertUnorderedList")} sx={{ color: "#475569", "&:hover": { bgcolor: "#E2E8F0" } }}>
                    <FormatListBulletedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Quote">
                  <IconButton size="small" onClick={() => execCmd("formatBlock", "<blockquote>")} sx={{ color: "#475569", "&:hover": { bgcolor: "#E2E8F0" } }}>
                    <FormatQuoteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Box sx={{ width: "1px", height: "18px", bgcolor: "#CBD5E1", mx: 0.5 }} />

                <Tooltip title="Insert Link">
                  <IconButton size="small" onClick={insertLink} sx={{ color: "#475569", "&:hover": { bgcolor: "#E2E8F0" } }}>
                    <LinkIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>

              {/* Editable Area */}
              <Box
                ref={editorRef}
                contentEditable={!submitting}
                onInput={() => {
                  if (editorRef.current) {
                    setHtmlContent(editorRef.current.innerHTML);
                  }
                }}
                data-placeholder="Write your news article here... What happened, quotes from founders, key achievements, and what's next..."
                sx={{
                  minHeight: "180px",
                  p: 2.5,
                  outline: "none",
                  fontSize: "15px",
                  lineHeight: 1.8,
                  color: "#0F172A",
                  "&:empty:before": {
                    content: "attr(data-placeholder)",
                    color: "#94A3B8",
                    fontStyle: "italic",
                  },
                  "& h3": { fontSize: "18px", fontWeight: 800, color: "#0F172A", my: 1.5 },
                  "& blockquote": {
                    borderLeft: "3px solid #E11D48",
                    pl: 2,
                    my: 1.5,
                    color: "#475569",
                    fontStyle: "italic",
                    bgcolor: "#F8FAFC",
                    py: 0.5,
                  },
                  "& ul": { pl: 3, my: 1 },
                  "& a": { color: "#E11D48", textDecoration: "underline" },
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Modal Actions (Fixed Bottom) */}
        <Box
          sx={{
            px: { xs: 3, md: 5 },
            py: 2.5,
            borderTop: "1px solid #F1F5F9",
            bgcolor: "#F8FAFC",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <Typography sx={{ fontSize: "12px", color: "#64748B", fontWeight: 500 }}>
            Reviewed by editorial team before going live
          </Typography>
          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Button
              onClick={onClose}
              disabled={submitting}
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 700,
                color: "#64748B",
                px: 2.5,
                "&:hover": { bgcolor: "#E2E8F0" },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting || uploadingImage}
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 800,
                bgcolor: "#E11D48",
                color: "#FFFFFF",
                px: 3.5,
                py: 1,
                boxShadow: "0 4px 12px rgba(225, 29, 72, 0.25)",
                "&:hover": { bgcolor: "#BE123C" },
              }}
            >
              {submitting ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={16} sx={{ color: "#FFFFFF" }} />
                  <span>Submitting...</span>
                </Box>
              ) : (
                "Submit for Review"
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
