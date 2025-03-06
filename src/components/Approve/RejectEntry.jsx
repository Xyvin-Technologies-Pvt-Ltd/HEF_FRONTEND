import {
  Typography,
  Dialog,
  DialogContent,
  Stack,
  DialogTitle,
  Box,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { ReactComponent as CloseIcon } from "../../assets/icons/CloseIcon.svg";

import { StyledButton } from "../../ui/StyledButton";
import { StyledMultilineTextField } from "../../ui/StyledMultilineTextField";
import { useProductStore } from "../../store/productStore";
import { useState } from "react";

const RejectEntry = ({ open, onClose, id, setIsChange }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();
  const { updateProduct } = useProductStore();
  const [loading, setLoading] = useState(false);
  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const updateData = {
        reason: formData?.reason,
        status: "rejected",
      };

      await updateProduct(id, updateData);

      setIsChange((prev) => !prev);
    } catch (error) {
      console.error("Error rejecting feed:", error);
    } finally {
      setLoading(false);
      onClose();
    }
  };
  const handleClear = (event) => {
    event.preventDefault();
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: { borderRadius: "12px" },
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle sx={{ height: "auto", padding: 3 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h3" color={"textTertiary"}>
                Rejection notice
              </Typography>
              <Typography
                onClick={onClose}
                color="#E71D36"
                style={{ cursor: "pointer" }}
              >
                <CloseIcon />
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent
            sx={{ height: "auto", width: "430px", backgroundColor: "#F9F9F9" }}
          >
            <Stack spacing={2} paddingTop={2}>
              <Typography variant="h7" color={"textTertiary"}>
                Reason for Rejection
              </Typography>
              <Controller
                name="reason"
                control={control}
                rules={{ required: "Content is required" }}
                render={({ field }) => (
                  <>
                    <StyledMultilineTextField
                      placeholder={"Add reason"}
                      {...field}
                    />
                    {errors.reason && (
                      <span style={{ color: "red" }}>
                        {errors.reason.message}
                      </span>
                    )}
                  </>
                )}
              />
            </Stack>
          </DialogContent>
          <Stack
            direction={"row"}
            spacing={2}
            padding={2}
            justifyContent={"end"}
          >
            <StyledButton
              variant="secondary"
              name="Cancel"
              onClick={(event) => handleClear(event)}
              disabled={loading}
            />
            <StyledButton
              variant="primary"
              name={loading ? "Submitting..." : "Submit"}
              type="submit"
              disabled={loading}
            />
          </Stack>
        </form>
      </Dialog>
    </>
  );
};

export default RejectEntry;
