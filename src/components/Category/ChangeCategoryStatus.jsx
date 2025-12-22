import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { StyledButton } from "../../ui/StyledButton";
import { useState } from "react";
import { toast } from "react-toastify";
import { useCategoryStore } from "../../store/categoryStore";

const ChangeCategoryStatus = ({ open, onClose, id, deactivate }) => {
  const [loading, setLoading] = useState(false);
  const { setTrigger, editCategory } = useCategoryStore();

  const handleClear = () => {
    onClose();
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await editCategory(id, { status: !deactivate });
      setTrigger();
    } catch (error) {
      toast.error(error?.message || "Failed to update status");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { borderRadius: "12px", bgcolor: "#fff" } }}
    >
      <DialogTitle sx={{ height: "auto", p: 2 }}>
        <IconButton onClick={handleClear} size="small" sx={{ float: "right" }}>
          <Close fontSize="small" sx={{ color: "#AEB9E1" }} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 0, width: "400px", overflow: "hidden" }}>
        <Typography
          variant="h5"
          fontWeight={500}
          mb={3}
          color="textPrimary"
          textAlign={"center"}
        >
          Are you sure you want to {deactivate ? "deactivate" : "activate"} this
          category?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 2 }}>
        <StyledButton
          name="Cancel"
          variant="secondary"
          onClick={handleClear}
          disabled={loading}
        />
        <StyledButton
          name={"Confirm"}
          variant="primary"
          disabled={loading}
          onClick={handleConfirm}
        />
      </DialogActions>
    </Dialog>
  );
};

export default ChangeCategoryStatus;

