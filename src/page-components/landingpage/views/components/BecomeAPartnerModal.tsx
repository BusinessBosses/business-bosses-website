"use client";
import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { FiX } from "react-icons/fi";
import Box from "@mui/material/Box";
import BecomeAPartnerForm from "./BecomeAPartnerForm";

interface BecomeAPartnerModalProps {
  open: boolean;
  onClose: () => void;
}

export default function BecomeAPartnerModal({ open, onClose }: BecomeAPartnerModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "20px",
          bgcolor: "#f4f4f4",
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#fff" }}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            left: 16,
            top: 12,
            color: (theme) => theme.palette.grey[500],
            bgcolor: "#F4F4F4",
            "&:hover": { bgcolor: "#EAEAEA" },
          }}
        >
          <FiX size={20} />
        </IconButton>
        <Box sx={{ fontSize: "18px", fontWeight: 600 }}>Become a Partner</Box>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <BecomeAPartnerForm onSuccess={onClose} />
      </DialogContent>
    </Dialog>
  );
}