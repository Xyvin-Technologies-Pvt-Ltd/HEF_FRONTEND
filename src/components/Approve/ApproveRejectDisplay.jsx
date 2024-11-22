import {
  Typography,
  Dialog,
  DialogContent,
  Stack,
  DialogTitle,
  Box,
  Divider,
} from "@mui/material";
import { ReactComponent as CloseIcon } from "../../assets/icons/CloseIcon.svg";
import { StyledButton } from "../../ui/StyledButton";

const ApproveRejectDisplay = ({ open, onClose, data, onChange }) => {
  const handleClear = (event) => {
    event.preventDefault();
    onClose();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onChange();
    onClose();
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { borderRadius: "12px" },
      }}
    >
      <DialogTitle sx={{ height: "auto", padding: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h3" color={"textTertiary"}>
            Rejection Preview
          </Typography>
          <Typography
            onClick={handleClear}
            color="#E71D36"
            style={{ cursor: "pointer" }}
          >
            <CloseIcon />
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ height: "auto", width: "430px", padding: 0 }}>
        <Stack
          spacing={2}
          padding={2}
          direction={"row"}
          justifyContent={"space-between"}
        >
          <Typography variant="h7" color={"textTertiary"} fontWeight={700}>
            Member Name
          </Typography>
          <Typography variant="h7" color={"textSecondary"}>
            {data?.name || "Prabodhan Fitzgerald"}
          </Typography>
        </Stack>
        <Divider />
        <Stack
          spacing={2}
          padding={2}
          direction={"row"}
          justifyContent={"space-between"}
        >
          <Typography variant="h7" color={"textTertiary"} fontWeight={700}>
            Category
          </Typography>
          <Typography variant="h7" color={"textSecondary"}>
            {data?.category}
          </Typography>
        </Stack>
        <Divider />
        <Stack
          spacing={2}
          padding={2}
          direction={"row"}
          justifyContent={"space-between"}
        >
          <Typography variant="h7" color={"textTertiary"} fontWeight={700}>
            Status
          </Typography>
          <Typography
            variant="h7"
            color="#EB5860"
            sx={{
              padding: "0px 6px",
              borderRadius: "12px",
              border: "1px solid #EB5860",
            }}
          >
            {data?.status}
          </Typography>
        </Stack>
        <Divider />
        <Stack spacing={2} padding={2}>
          <Typography variant="h7" color={"textTertiary"} fontWeight={700}>
            Reason for Rejection
          </Typography>
          <Typography variant="h7" color={"textSecondary"}>
            {data?.reason }
          </Typography>
        </Stack>
      </DialogContent>
      <Stack direction={"row"} spacing={2} padding={2} justifyContent={"end"}>
        <StyledButton variant="secondary" name="Cancel" onClick={handleClear} />
        <StyledButton variant="primary" name="Send" onClick={handleSubmit} />
      </Stack>
    </Dialog>
  );
};

export default ApproveRejectDisplay;
