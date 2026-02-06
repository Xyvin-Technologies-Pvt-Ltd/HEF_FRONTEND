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
import StyledSelectField from "../../ui/StyledSelectField.jsx";
import { getAllLevel, getLevels } from "../../api/hierarchyapi.js";

const RsvpFilter = ({ open, onClose, onApply, appliedFilters }) => {
    const [stateOptions, setStateOptions] = useState([]);
    const [zoneOptions, setZoneOptions] = useState([]);
    const [districtOptions, setDistrictOptions] = useState([]);
    const [chapterOptions, setChapterOptions] = useState([]);

    const [selectedState, setSelectedState] = useState(null);
    const [selectedZone, setSelectedZone] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedChapter, setSelectedChapter] = useState(null);


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
                console.error("Error fetching states:", error);
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
            setZoneOptions(zones.map(({ _id, name }) => ({ value: _id, label: name })));
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
            chapterId: selectedChapter?.value || "",
            chapterName: selectedChapter?.label || "All Chapters",
        });
        onClose();
    };

    const handleReset = () => {
        setSelectedState(null);
        setSelectedZone(null);
        setSelectedDistrict(null);
        setSelectedChapter(null);
        setZoneOptions([]);
        setDistrictOptions([]);
        setChapterOptions([]);
        onApply({});
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
                    <Typography variant="subtitle1" fontWeight="medium">
                        Choose Chapter
                    </Typography>

                    <Box sx={{ p: 2, backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
                        <Typography>Select State</Typography>
                        <StyledSelectField
                            placeholder="Select State"
                            options={stateOptions}
                            value={selectedState}
                            onChange={handleStateChange}
                        />

                        <Typography sx={{ mt: 2 }}>Select Zone</Typography>
                        <StyledSelectField
                            placeholder="Select Zone"
                            options={zoneOptions}
                            value={selectedZone}
                            onChange={handleZoneChange}
                            disabled={!selectedState}
                        />

                        <Typography sx={{ mt: 2 }}>Select District</Typography>
                        <StyledSelectField
                            placeholder="Select District"
                            options={districtOptions}
                            value={selectedDistrict}
                            onChange={handleDistrictChange}
                            disabled={!selectedZone}
                        />

                        <Typography sx={{ mt: 2 }}>Select Chapter</Typography>
                        <StyledSelectField
                            placeholder="Select Chapter"
                            options={chapterOptions}
                            value={selectedChapter}
                            onChange={handleChapterChange}
                            disabled={!selectedDistrict}
                        />
                    </Box>
                </Stack>
            </DialogContent>

            <Stack direction={"row"} spacing={2} padding={2} justifyContent={"end"}>
                <StyledButton variant="secondary" name="Reset" onClick={handleReset} />
                <StyledButton variant="primary" name="Apply" onClick={handleApply} />
            </Stack>
        </Dialog>
    );
};

export default RsvpFilter;
