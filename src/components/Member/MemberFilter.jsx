import { useEffect, useState } from "react";
import {
  Typography,
  Dialog,
  DialogContent,
  Stack,
  DialogTitle,
  Box,
} from "@mui/material";
import { ReactComponent as CloseIcon } from "../../assets/icons/CloseIcon.svg";
import { StyledButton } from "../../ui/StyledButton.jsx";
import StyledInput from "../../ui/StyledInput.jsx";
import StyledSelectField from "../../ui/StyledSelectField.jsx";
import { useMemberStore } from "../../store/Memberstore";

const MemberFilter = ({ open, onClose, onApply }) => {
  const { memberStatus, memberInstalled, setMemStatus, setMemInstalled } =
    useMemberStore();
  const [membershipId, setMembershipId] = useState("");
  const [status, setStatus] = useState(null);
  const [name, setName] = useState("");
  const [installed, setInstalled] = useState(null);

  const handleClear = (event) => {
    event.preventDefault();
    setName("");
    setMembershipId("");
    setMemStatus(null);
    setMemInstalled(null);
    setStatus(null);
    setInstalled(null);
    onApply({
      name: "",
      membershipId: "",
      status: "",
      installed: "",
    });
    onClose();
  };

  const handleApply = (appliedStatus = status, appliedUser = installed) => {
    onApply({
      name,
      membershipId,
      status: appliedStatus?.value || status?.value || "",
      installed: appliedUser?.value || installed?.value || false,
    });
    onClose();
  };
  useEffect(() => {
    if (memberStatus) {
      const newStatus = { value: memberStatus, label: memberStatus };
      setStatus(newStatus);
      handleApply(newStatus, installed);
    }

    if (memberInstalled) {
      const newUser = {
        value: memberInstalled,
        label: memberInstalled === true ? "True" : "False",
      };
      setInstalled(newUser);
      handleApply(status, newUser);
    }
  }, [memberStatus, memberInstalled]);
  const handleStatusChange = (selectedOption) => {
    setStatus(selectedOption);
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
            onClick={onClose}
            color="#E71D36"
            style={{ cursor: "pointer" }}
          >
            <CloseIcon />
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ padding: 0 }}>
        <Stack spacing={2} padding={2} mb={12}>
          <Typography>Name</Typography>
          <StyledInput
            placeholder={"Enter Member Name"}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Typography>Membership Id</Typography>
          <StyledInput
            placeholder={"Enter Membership Id"}
            value={membershipId}
            onChange={(e) => setMembershipId(e.target.value)}
          />

          <Typography>Status</Typography>
          <StyledSelectField
            placeholder="Select Status"
            options={[
              { value: "active", label: "active" },
              { value: "inactive", label: "inactive" },
              { value: "suspended", label: "suspended" },
            ]}
            value={status}
            onChange={handleStatusChange}
          />

          <Typography>Installed Users</Typography>
          <StyledSelectField
            placeholder="Select Value"
            options={[
              { value: true, label: "True" },
              { value: false, label: "False" },
            ]}
            value={installed}
            onChange={(selectedOption) => setInstalled(selectedOption)}
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

export default MemberFilter;
