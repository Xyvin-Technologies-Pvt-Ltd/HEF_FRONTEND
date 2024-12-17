import { useState } from "react";
import {
  Typography,
  Dialog,
  DialogContent,
  Stack,
  DialogTitle,
  Box,
  Grid,
} from "@mui/material";
import { ReactComponent as CloseIcon } from "../../assets/icons/CloseIcon.svg";
import { StyledButton } from "../../ui/StyledButton";
import { StyledCalender } from "../../ui/StyledCalender";
import StyledSelectField from "../../ui/StyledSelectField";

const ActivityFilter = ({ open, onClose, onApply }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState(null);
  const [state, setState] = useState(null);
  const [zone, setZone] = useState(null);
  const [district, setDistrict] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [type, setType] = useState(null);
  const [member, setMember] = useState(null);

  const handleClear = (event) => {
    event.preventDefault();
    setType(null);
    setStartDate("");
    setEndDate("");
    setStatus(null);
    setState(null);
    setZone(null);
    setDistrict(null);
    setChapter(null);
    setMember(null);
    onApply({
      type: "",
      startDate: "",
      endDate: "",
      status: "",
      state: "",
      zone: "",
      district: "",
      chapter: "",
      member: "",
    });
    onClose();
  };

  const handleApply = () => {
    onApply({
      type: type?.value || "",
      startDate,
      endDate,
      status: status?.value || "",
      state: state?.value || "",
      zone: zone?.value || "",
      district: district?.value || "",
      chapter: chapter?.value || "",
      member: member?.value || "",
    });
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
          width: "630px",
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
      <DialogContent sx={{ padding: 0, bgcolor: "#F9F9F9", pb: 8 }}>
        <Grid container>
          <Grid item xs={6}>
            <Stack spacing={2} padding={2}>
              <Typography>Start Date</Typography>
              <StyledCalender
                value={startDate}
                onChange={(selectedDate) => setStartDate(selectedDate)}
              />
              <Typography>State</Typography>
              <StyledSelectField
                placeholder="Select State"
                options={[]}
                value={state}
                onChange={(selectedOption) => setState(selectedOption)}
              />

              <Typography>District</Typography>
              <StyledSelectField
                placeholder="Select District"
                options={[]}
                value={district}
                onChange={(selectedOption) => setDistrict(selectedOption)}
              />
              <Typography>Member</Typography>
              <StyledSelectField
                placeholder="Select Member"
                options={[]}
                value={member}
                onChange={(selectedOption) => setMember(selectedOption)}
              />
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Stack spacing={2} padding={2}>
              <Typography>End Date</Typography>
              <StyledCalender
                value={endDate}
                onChange={(selectedDate) => setEndDate(selectedDate)}
              />
              <Typography>Zone</Typography>
              <StyledSelectField
                placeholder="Select zone"
                options={[]}
                value={zone}
                onChange={(selectedOption) => setZone(selectedOption)}
              />

              <Typography>Chapter</Typography>
              <StyledSelectField
                placeholder="Select Chapter"
                options={[]}
                value={chapter}
                onChange={(selectedOption) => setChapter(selectedOption)}
              />
              <Typography>Requsest Type</Typography>
              <StyledSelectField
                placeholder="Select Type"
                options={[]}
                value={type}
                onChange={(selectedOption) => setType(selectedOption)}
              />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={2} padding={2}>
              {" "}
              <Typography>Status</Typography>
              <StyledSelectField
                placeholder="Select Status"
                options={[]}
                value={status}
                onChange={(selectedOption) => setStatus(selectedOption)}
              />
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
      <Stack direction={"row"} spacing={2} padding={2} justifyContent={"end"}>
        <StyledButton variant="secondary" name="Reset" onClick={handleClear} />
        <StyledButton variant="primary" name="Apply" onClick={handleApply} />
      </Stack>
    </Dialog>
  );
};

export default ActivityFilter;
