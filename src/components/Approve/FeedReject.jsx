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
import { useFeedStore } from "../../store/feedStore";

const FeedReject = ({ open, onClose, id, setIsChange }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();
  const { updateFeed } = useFeedStore();
  const onSubmit = async (formData) => {
    try {
      const updateData = {
        reason: formData?.reason,
      };
      await updateFeed("reject", id, updateData);
      setIsChange((prev) => !prev);
    } catch (error) {
      console.error("Error rejecting feed:", error);
    } finally {
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
            />
            <StyledButton variant="primary" name="Send" type="submit" />
          </Stack>
        </form>
      </Dialog>
    </>
  );
};

export default FeedReject;
