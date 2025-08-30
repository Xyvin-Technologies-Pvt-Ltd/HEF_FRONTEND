import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: "16px",
    minWidth: "400px",
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: "linear-gradient(135deg, #FF6B35 0%, #FF8E53 100%)",
  color: "white",
  textAlign: "center",
  fontWeight: 600,
  fontSize: "20px",
}));

const StyledButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: "20px",
  padding: "8px 24px",
  fontWeight: 600,
  textTransform: "none",
  fontSize: "14px",
  ...(variant === "primary" && {
    background: "linear-gradient(135deg, #FF6B35 0%, #FF8E53 100%)",
    color: "white",
    border: "none",
    "&:hover": {
      background: "linear-gradient(135deg, #E55A2B 0%, #E57A42 100%)",
      transform: "translateY(-1px)",
    },
  }),
  ...(variant === "secondary" && {
    background: "transparent",
    color: "#666",
    border: "1px solid #ddd",
    "&:hover": {
      background: "#f5f5f5",
      borderColor: "#999",
    },
  }),
}));

const PasswordResetDialog = ({
  open,
  onClose,
  onConfirm,
  adminData,
  loading = false,
}) => {
  const [customEmail, setCustomEmail] = useState("");
  const [useCustomEmail, setUseCustomEmail] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setCustomEmail(email);
    
    // Basic email validation
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleConfirm = () => {
    if (useCustomEmail && customEmail) {
      if (emailError) {
        return; // Don't proceed if there's an email error
      }
      onConfirm(adminData._id, true, customEmail);
    } else {
      onConfirm(adminData._id, true, null);
    }
  };

  const handleClose = () => {
    setCustomEmail("");
    setUseCustomEmail(false);
    setEmailError("");
    onClose();
  };

  return (
    <StyledDialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <StyledDialogTitle>
        {useCustomEmail && customEmail ? 'Update Admin Email & Password' : 'Reset Admin Password'}
      </StyledDialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        <Box mb={2}>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to reset the password for{" "}
            <strong>{adminData?.name}</strong>?
          </Typography>
          
          <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
            A new random password will be generated and sent to the email address. 
            <strong>Note: If you provide a custom email, your admin email will be updated to the new email address.</strong>
          </Alert>
        </Box>

        <Box mb={2}>
          <Typography variant="subtitle2" gutterBottom>
            <strong>Current Login Email:</strong> {adminData?.email}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            This is your current email address for login.
          </Typography>
          {useCustomEmail && customEmail && (
            <Alert severity="success" sx={{ mt: 1 }}>
              <strong>New Login Email:</strong> {customEmail}
            </Alert>
          )}
        </Box>

        <FormControlLabel
          control={
            <Checkbox
              checked={useCustomEmail}
              onChange={(e) => setUseCustomEmail(e.target.checked)}
              color="primary"
            />
          }
          label="Send password to a different email address"
        />
        
        {useCustomEmail && (
          <Alert severity="warning" sx={{ mt: 1, mb: 2 }}>
            <strong>Important:</strong> Your admin email address will be updated to {customEmail}. You will login using this new email address with the new password.
          </Alert>
        )}

        {useCustomEmail && (
          <TextField
            fullWidth
            label="Custom Email Address"
            variant="outlined"
            value={customEmail}
            onChange={handleEmailChange}
            error={!!emailError}
            helperText={emailError}
            placeholder="Enter email address"
            sx={{ mt: 1 }}
          />
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <StyledButton
          variant="secondary"
          onClick={handleClose}
          disabled={loading}
        >
          Cancel
        </StyledButton>
        <StyledButton
          variant="primary"
          onClick={handleConfirm}
          disabled={loading || (useCustomEmail && (!customEmail || !!emailError))}
        >
          {loading ? "Processing..." : (useCustomEmail && customEmail ? "Update Email & Password" : "Reset Password")}
        </StyledButton>
      </DialogActions>
    </StyledDialog>
  );
};

export default PasswordResetDialog;
