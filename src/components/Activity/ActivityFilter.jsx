import { useEffect, useState } from "react";
import {
  Typography,
  Dialog,
  DialogContent,
  Stack,
  DialogTitle,
  Box,
  Grid,
  Divider,
  Paper,
} from "@mui/material";
import { ReactComponent as CloseIcon } from "../../assets/icons/CloseIcon.svg";
import { StyledButton } from "../../ui/StyledButton";
import { StyledCalender } from "../../ui/StyledCalender";
import StyledSelectField from "../../ui/StyledSelectField";
import { getAllLevel, getLevels } from "../../api/hierarchyapi";

const ActivityFilter = ({ open, onClose, onApply }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState(null);
  const [type, setType] = useState(null);
  const [stateOptions, setStateOptions] = useState([]);
  const [zoneOptions, setZoneOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [chapterOptions, setChapterOptions] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  
  const handleClear = (event) => {
    event.preventDefault();
    setType(null);
    setStartDate("");
    setEndDate("");
    setStatus(null);
    setSelectedState(null);
    setSelectedZone(null);
    setSelectedDistrict(null);
    setSelectedChapter(null);
    onApply({
      type: "",
      startDate: "",
      endDate: "",
      status: "",
      chapter: "",
    });
    onClose();
  };

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const stateData = await getAllLevel("state");
        const formattedOptions = stateData?.data?.map((state) => ({
          value: state?._id,
          label: state?.name,
        }));
        setStateOptions(formattedOptions);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchStates();
  }, []);

  const fetchData = async (type, id) => {
    try {
      const response = await getLevels(id, type);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleStateChange = async (stateId) => {
    setSelectedState(stateId);
    setSelectedZone(null);
    setSelectedDistrict(null);
    setSelectedChapter(null);
    setZoneOptions([]);
    setDistrictOptions([]);
    setChapterOptions([]);

    if (stateId) {
      const zones = await fetchData("state", stateId.value);
      setZoneOptions(
        zones.map(({ _id, name }) => ({ value: _id, label: name }))
      );
    }
  };

  const handleZoneChange = async (zoneId) => {
    setSelectedZone(zoneId);
    setSelectedDistrict(null);
    setSelectedChapter(null);
    setDistrictOptions([]);
    setChapterOptions([]);

    if (zoneId) {
      const districts = await fetchData("zone", zoneId.value);
      setDistrictOptions(
        districts.map(({ _id, name }) => ({ value: _id, label: name }))
      );
    }
  };

  const handleDistrictChange = async (districtId) => {
    setSelectedDistrict(districtId);
    setSelectedChapter(null);
    setChapterOptions([]);

    if (districtId) {
      const chapters = await fetchData("district", districtId.value);
      setChapterOptions(
        chapters.map(({ _id, name }) => ({ value: _id, label: name }))
      );
    }
  };

  const handleChapterChange = (chapterId) => {
    setSelectedChapter(chapterId);
  };
  
  const handleApply = () => {
    onApply({
      type: type?.value || "",
      startDate,
      endDate,
      status: status?.value || "",
      chapter: selectedChapter?.value || "",
    });
    onClose();
  };
  
  const handleStatusChange = (selectedOption) => {
    setStatus(selectedOption);
  };
  
  const handleTypeChange = (selectedOption) => {
    setType(selectedOption);
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
      <DialogContent sx={{ padding: 0, bgcolor: "#F9F9F9", pb: 3 }}>
        <Grid container spacing={2} p={2} >
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography mb={1}>Start Date</Typography>
                <StyledCalender
                  value={startDate}
                  onChange={(selectedDate) => setStartDate(selectedDate)}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography mb={1}>End Date</Typography>
                <StyledCalender
                  value={endDate}
                  onChange={(selectedDate) => setEndDate(selectedDate)}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                borderRadius: '12px', 
                border: '1px solid rgba(0, 0, 0, 0.12)',
                backgroundColor: '#fff'
              }}
            >
              <Typography variant="h6" mb={2} color="#4F4F4F" fontWeight={600}>
                Chapter
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography mb={1}>Select State</Typography>
                  <StyledSelectField
                    placeholder="Select State"
                    options={stateOptions}
                    value={selectedState}
                    onChange={handleStateChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography mb={1}>Select Zone</Typography>
                  <StyledSelectField
                    placeholder="Select Zone"
                    options={zoneOptions}
                    value={selectedZone}
                    onChange={handleZoneChange}
                    disabled={!selectedState}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography mb={1}>Select District</Typography>
                  <StyledSelectField
                    placeholder="Select District"
                    options={districtOptions}
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                    disabled={!selectedZone}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography mb={1}>Select Chapter</Typography>
                  <StyledSelectField
                    placeholder="Select Chapter"
                    options={chapterOptions}
                    value={selectedChapter}
                    onChange={handleChapterChange}
                    disabled={!selectedDistrict}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          <Grid item xs={12} mb={15}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography mb={1}>Business Type</Typography>
                <StyledSelectField
                  placeholder="Select Type"
                  options={[
                    { value: "Business", label: "Business" },
                    { value: "One v One Meeting", label: "One v One Meeting" },
                    { value: "Referral", label: "Referral" },
                  ]}
                  value={type}
                  onChange={handleTypeChange}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography mb={1}>Status</Typography>
                <StyledSelectField
                  placeholder="Select Status"
                  options={[
                    { value: "accepted", label: "Accepted" },
                    { value: "pending", label: "Pending" },
                    { value: "meeting_scheduled", label: "Meeting Scheduled" },
                    { value: "rejected", label: "Rejected" },
                    { value: "completed", label: "Completed" },
                  ]}
                  value={status}
                  onChange={handleStatusChange}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <Divider />
      <Stack direction={"row"} spacing={2} padding={2} justifyContent={"end"}>
        <StyledButton variant="secondary" name="Reset" onClick={handleClear} />
        <StyledButton variant="primary" name="Apply" onClick={handleApply} />
      </Stack>
    </Dialog>
  );
};

export default ActivityFilter;