"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CircularProgress from "@mui/material/CircularProgress";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import AppAppBar from "./landingpage/views/components/AppAppBar";
import MagazineFooter from "./landingpage/views/components/magazine/MagazineFooter";

export default function SettingsStandalone() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState("");
  
  const handleConfirmDelete = () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address to proceed.");
      return;
    }
        setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowConfirmation(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <Box sx={{ width: "100%", backgroundColor: "#FAFAFA", minHeight: "100vh", color: "#0F172A" }}>
      {/* Global Navbar */}
      <AppAppBar mode="light" toggleColorMode={() => {}} />

      {/* Hero Header */}
      <Box
        sx={{
          py: { xs: 8, md: 9 },
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #F1F5F9",
          textAlign: "center",
        }}
      >
        <Container maxWidth="sm">
          <Chip
            icon={<LockOutlinedIcon sx={{ fontSize: "16px !important", color: "#E11D48 !important" }} />}
            label="ACCOUNT PREFERENCES"
            sx={{
              backgroundColor: "#FFF1F2",
              color: "#E11D48",
              fontWeight: 800,
              fontSize: "12px",
              letterSpacing: "1px",
              mb: 2,
              px: 1,
            }}
          />
          <Typography
            variant="h1"
            sx={{
              fontWeight: 900,
              fontSize: { xs: "32px", sm: "42px" },
              color: "#0F172A",
              lineHeight: 1.2,
              mb: 1.5,
              letterSpacing: "-0.5px",
            }}
          >
            Account Settings
          </Typography>
          <Typography sx={{ fontSize: "15px", color: "#64748B", maxWidth: "480px", mx: "auto", lineHeight: 1.6 }}>
            Manage privacy settings and account security for Business Bosses.
          </Typography>
        </Container>
      </Box>

      {/* Content Body */}
      <Container maxWidth="sm" sx={{ py: { xs: 6, md: 8 } }}>
        {isSuccess ? (
          <Card
            elevation={0}
            sx={{
              p: { xs: 3, sm: 5 },
              textAlign: "center",
              borderRadius: "16px",
              border: "1px solid #E2E8F0",
              backgroundColor: "#FFFFFF",
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                backgroundColor: "#DCFCE7",
                color: "#16A34A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2.5,
              }}
            >
              <CheckCircleOutlineRoundedIcon sx={{ fontSize: 36 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 900, color: "#0F172A", mb: 1 }}>
              Request Submitted
            </Typography>
            <Typography sx={{ color: "#64748B", fontSize: "14px", lineHeight: 1.6, mb: 3 }}>
              We have received your account deletion request for <strong>{email}</strong>. Our data team will review and process your request within 30 days in accordance with GDPR regulations.
            </Typography>
            <Button
              variant="outlined"
              href="/"
              sx={{
                borderColor: "#CBD5E1",
                color: "#0F172A",
                fontWeight: 700,
                textTransform: "none",
                borderRadius: "8px",
                px: 3,
                py: 1,
                "&:hover": { borderColor: "#94A3B8" },
              }}
            >
              Return to Home
            </Button>
          </Card>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {/* Danger Zone Card */}
            <Card
              elevation={0}
              sx={{
                borderRadius: "16px",
                border: "1px solid #FFE4E6",
                backgroundColor: "#FFFFFF",
                overflow: "hidden",
                boxShadow: "0 2px 12px rgba(225, 29, 72, 0.04)",
              }}
            >
              <Box sx={{ backgroundColor: "#FFF1F2", px: 3, py: 2, borderBottom: "1px solid #FFE4E6", display: "flex", alignItems: "center", gap: 1.5 }}>
                <WarningAmberRoundedIcon sx={{ color: "#E11D48", fontSize: 20 }} />
                <Typography sx={{ fontWeight: 800, fontSize: "13px", color: "#9F1239", letterSpacing: "0.5px" }}>
                  DANGER ZONE
                </Typography>
              </Box>

              <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                <Typography variant="h6" sx={{ fontWeight: 900, color: "#0F172A", mb: 1 }}>
                  Delete Account
                </Typography>
                <Typography sx={{ color: "#64748B", fontSize: "14px", lineHeight: 1.6, mb: 3 }}>
                  Permanently remove your personal profile, business listings, and associated data from Business Bosses servers. This action is irreversible.
                </Typography>

                <Button
                  variant="contained"
                  startIcon={<DeleteForeverOutlinedIcon />}
                  onClick={() => setShowConfirmation(true)}
                  sx={{
                    backgroundColor: "#E11D48",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    textTransform: "none",
                    borderRadius: "8px",
                    px: 3,
                    py: 1.2,
                    boxShadow: "0 4px 14px rgba(225, 29, 72, 0.25)",
                    "&:hover": { backgroundColor: "#BE123C" },
                  }}
                >
                  Request Account Deletion
                </Button>
              </CardContent>
            </Card>

            {/* Informational Guidance */}
            <Box
              sx={{
                p: 3,
                borderRadius: "14px",
                backgroundColor: "#F8FAFC",
                border: "1px solid #E2E8F0",
              }}
            >
              <Typography sx={{ fontWeight: 800, fontSize: "14px", color: "#0F172A", mb: 1.5 }}>
                What happens when your account is deleted?
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {[
                  "All your profile information and credentials will be purged permanently.",
                  "Your active business listings, posts, and comments will be removed.",
                  "Any active subscriptions will be cancelled immediately.",
                  "This action is permanent and cannot be undone.",
                ].map((item, idx) => (
                  <Typography key={idx} sx={{ fontSize: "13px", color: "#64748B", lineHeight: 1.6 }}>
                    • {item}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Box>
        )}
      </Container>

      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirmation}
        onClose={() => !isSubmitting && setShowConfirmation(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "16px", p: 1 },
        }}
      >
        <DialogTitle sx={{ fontWeight: 900, color: "#0F172A", pb: 1 }}>
          Confirm Account Deletion
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: "14px", color: "#64748B", mb: 3, lineHeight: 1.6 }}>
            Are you absolutely sure you want to proceed? Please enter the email address linked to your account to confirm this request.
          </Typography>

          
          <TextField
            fullWidth
            size="small"
            label="Account Email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            autoFocus
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button
            onClick={() => setShowConfirmation(false)}
            disabled={isSubmitting}
            sx={{ textTransform: "none", color: "#64748B", fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            disabled={isSubmitting}
            variant="contained"
            sx={{
              backgroundColor: "#E11D48",
              color: "#FFFFFF",
              fontWeight: 700,
              textTransform: "none",
              borderRadius: "8px",
              px: 2.5,
              "&:hover": { backgroundColor: "#BE123C" },
            }}
          >
            {isSubmitting ? <CircularProgress size={20} color="inherit" /> : "Yes, Delete Account"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Global Clean Footer */}
      <MagazineFooter />
    </Box>
  );
}
