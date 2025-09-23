import React, { useEffect, useState } from "react";
import { Box, Stack, Badge, Tooltip } from "@mui/material";
import StyledTable from "../../ui/StyledTable";
import { StyledButton } from "../../ui/StyledButton";
import { getGuests } from "../../api/eventapi";
import DownloadPopup from "../../components/Member/DownloadPopup";
import { generateExcel } from "../../utils/generateExcel";
import { generatePDF } from "../../utils/generatePDF";
import { toast } from "react-toastify";
import { ReactComponent as FilterIcon } from "../../assets/icons/FilterIcon.svg";
import EventTable from "../../ui/EventTable";

const GuestTable = ({ eventId }) => {
  const [guests, setGuests] = useState([]);
  const [filters, setFilters] = useState({
    filterMode: "full", // "guestOnly" / "guestWithCoMember" / "full"
  });
  const [downloadPopupOpen, setDownloadPopupOpen] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  // Fetch guests from backend
  const fetchGuests = async () => {
    if (!eventId) return;
    try {
      const res = await getGuests(eventId, filters.filterMode);
      // console.table(res);
      setGuests(res.data || []);
    } catch (error) {
      console.error("Error fetching guests:", error);
      toast.error("Failed to fetch guests");
    }
  };
  console.log("guests", guests);
  useEffect(() => {
    fetchGuests();
  }, [filters, eventId]);

  const handleDownloadExcel = async () => {
    setDownloadLoading(true);
    try {
      const res = await getGuests(eventId, filters.filterMode);
      if (res.headers && res.body) {
        generateExcel(res.headers, res.body, "Guests");
        toast.success("Excel downloaded successfully!");
      } else {
        toast.error("No data available for download");
      }
    } catch (error) {
      console.error("Excel download error:", error);
      toast.error("Failed to download Excel");
    } finally {
      setDownloadLoading(false);
      setDownloadPopupOpen(false);
    }
  };

  const handleDownloadPDF = async () => {
    setDownloadLoading(true);
    try {
      const res = await getGuests(eventId, filters.filterMode);
      if (res.headers && res.body) {
        generatePDF(res.headers, res.body, "Guests");
        toast.success("PDF downloaded successfully!");
      } else {
        toast.error("No data available for download");
      }
    } catch (error) {
      console.error("PDF download error:", error);
      toast.error("Failed to download PDF");
    } finally {
      setDownloadLoading(false);
      setDownloadPopupOpen(false);
    }
  };

  const guestColumns = [
    { title: "GuestName", field: "name", padding: "none" },
    { title: "Contact", field: "contact" },
    { title: "Category", field: "category" },
    { title: "C/O Member", field: "addedBy" },
  ];

  const hasActiveFilters = filters.filterMode !== "full";

  // Toggle filter mode when badge is clicked
  const toggleFilterMode = () => {
    const nextMode =
      filters.filterMode === "full"
        ? "guestOnly"
        : filters.filterMode === "guestOnly"
        ? "guestWithCoMember"
        : "full";
    setFilters({ filterMode: nextMode });
  };

  return (
    <Box padding="15px">
      <Stack direction="row" justifyContent="end" spacing={2} mb={2}>
        <StyledButton
          variant="primary"
          name="Download"
          onClick={() => setDownloadPopupOpen(true)}
        />
        <Tooltip title={`Filter Mode: ${filters.filterMode}`}>
          <Badge
            color="error"
            variant="dot"
            invisible={!hasActiveFilters}
            sx={{
              "& .MuiBadge-dot": {
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#F58220",
              },
            }}
            overlap="circular"
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Box
              bgcolor="#fff"
              borderRadius="50%"
              width="48px"
              height="48px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              border="1px solid rgba(0,0,0,0.12)"
              onClick={toggleFilterMode}
              style={{
                cursor: "pointer",
                boxShadow: hasActiveFilters
                  ? "0 0 5px rgba(245,130,32,0.5)"
                  : "none",
                borderColor: hasActiveFilters ? "#F58220" : "rgba(0,0,0,0.12)",
              }}
            >
              <FilterIcon />
            </Box>
          </Badge>
        </Tooltip>
      </Stack>

      <EventTable columns={guestColumns} data={guests} />

      <DownloadPopup
        open={downloadPopupOpen}
        onClose={() => setDownloadPopupOpen(false)}
        onDownloadExcel={handleDownloadExcel}
        onDownloadPDF={handleDownloadPDF}
        loading={downloadLoading}
      />
    </Box>
  );
};

export default GuestTable;
