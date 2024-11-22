import { useState } from "react";
import {
  Typography,
  Dialog,
  DialogContent,
  Stack,
  DialogTitle,
  Box,
} from "@mui/material";
import { ReactComponent as CloseIcon } from "../assets/icons/CloseIcon.svg";
import { StyledButton } from "./StyledButton";
import StyledInput from "./StyledInput";
import { StyledCalender } from "./StyledCalender";
import StyledSelectField from "./StyledSelectField";

const AdminFilter = ({ open, onClose, onApply }) => {
  const [date, setDate] = useState("");
  const [status, setStatus] = useState(null);
  const [type, setType] = useState("");

  const handleClear = (event) => {
    event.preventDefault();
    setType("");
    setDate("");
    setStatus(null);
    onApply({ type: "", date: "", status: "", date: "" });
    onClose();
  };

  const handleApply = () => {
    onApply({ type, date, status: status?.value || "" });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "12px",
          position: "absolute",
          top: 0,
          right: 0,
          height: "100vh",
          width: "430px",
        },
      }}
    >
      <DialogTitle sx={{ height: "auto", padding: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h3" color={"#4F4F4F"}>
            Filter
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
      <DialogContent sx={{ padding: 0 }}>
        <Stack spacing={2} padding={2}>
          <Typography>Type</Typography>
          <StyledInput
            placeholder={"Enter Http Type"}
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
          <Typography>Created At</Typography>
          <StyledCalender
            value={date}
            onChange={(selectedDate) => setFrom(selectedDate)}
          />

          <Typography>Status</Typography>
          <StyledSelectField
            placeholder="Select Status"
            options={[
              { value: "success", label: "Success" },
              { value: "failure", label: "Failure" },
            ]}
            value={status}
            onChange={(selectedOption) => setStatus(selectedOption)}
          />
        </Stack>
      </DialogContent>
      <Stack direction={"row"} spacing={2} padding={2} justifyContent={"end"}>
        <StyledButton variant="secondary" name="Reset" onClick={handleClear} />
        <StyledButton variant="primary" name="Apply" onClick={handleApply} />
      </Stack>
    </Dialog>
  );
};

export default AdminFilter;
