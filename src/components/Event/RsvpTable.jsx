import { Box, Drawer, Stack, Badge, } from "@mui/material";
import React, { useEffect, useState, useMemo } from "react";
import EventTable from "../../ui/EventTable";
import { StyledButton } from "../../ui/StyledButton";
import { getRsvpDownload, getEventRsvp, getEventById, removeEventRsvp } from "../../api/eventapi";
import DownloadPopup from "../../components/Member/DownloadPopup";
import { generateExcel } from "../../utils/generateExcel";
import { generatePDF } from "../../utils/generatePDF";
import { toast } from "react-toastify";
import RsvpFilter from "../../components/Event/RsvpFilter";
import { ReactComponent as FilterIcon } from "../../assets/icons/FilterIcon.svg";

const RsvpTable = ({ eventId }) => {
  const [data, setData] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [rowPerSize, setRowPerSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [downloadPopupOpen, setDownloadPopupOpen] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({});

  const isFilterApplied = useMemo(
    () => Boolean(filters?.chapterId),
    [filters]
  );


  // Fetch RSVP data from backend
  const fetchRsvp = async () => {
    setLoading(true);
    try {
      const res = await getEventRsvp(eventId, pageNo, rowPerSize, filters?.chapterId);
      setData(res?.data || []);
      setTotalCount(res?.totalCount || 0);
    } catch (err) {
      console.error("RSVP fetch error:", err);
      toast.error("Failed to fetch RSVPs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) fetchRsvp();
  }, [eventId, pageNo, rowPerSize, filters]);

  const sortedData = [...(data || [])].sort((a, b) =>
    (a.name || "").trim().toLowerCase().localeCompare((b.name || "").trim().toLowerCase())
  );

  const handleDownloadExcel = async () => {
    setDownloadLoading(true);
    try {
      const res = await getRsvpDownload(eventId);
      if (res?.data?.headers && res?.data?.body) {
        const sortedBody = [...res.data.body].sort((a, b) =>
          a.name?.toLowerCase().localeCompare(b.name?.toLowerCase())
        );
        generateExcel(res?.data?.headers, sortedBody, "Rsvp");
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
      const res = await getRsvpDownload(eventId);
      if (res?.data?.headers && res?.data?.body) {
        
        const { body,totalSeats, registeredCount, balanceSeats } = res.data;

        const eventRes = await getEventById(eventId);
         const formatEventDateTime = (date, time) => {
          if (!date) return "";
          const d = new Date(date);
          const t = time ? new Date(time) : null;

          if (t) {
            d.setHours(t.getHours());
            d.setMinutes(t.getMinutes());
          }

          return d.toLocaleString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
        };
        const eventInfo = {
          eventName: eventRes?.data?.eventName,
          eventDateTime: formatEventDateTime(
            eventRes?.data?.startDate,
            eventRes?.data?.startTime
          ),
          totalSeats,
          registeredCount,
          balanceSeats
        };
        generatePDF(res.data.headers, body, "RSVP List", eventInfo);
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
const handleRemoveRsvp = async (row) => {
    try {
      const userId = row.user?._id || row._id;
      if (!userId) throw new Error("User ID missing");

      await removeEventRsvp(eventId, userId);
      toast.success(`${row.name} removed successfully`);
      fetchRsvp();
    } catch (error) {
      console.error("Remove RSVP error:", error);
      toast.error("Failed to remove RSVP");
    }
  };
  const userColumns = [
    { title: "Name", field: "name", padding: "none" },
    { title: "Phone", field: "phone" },
    { title: "Chapter", field: "chaptername" },
    { title: "Registration Date", field: "registeredDate" },
  ]


  
  const handleApplyFilter = (values) => {
    setFilters(values);
    setPageNo(1);
  };

  return (
    <Box padding="15px">
      {/* Download Button */}
      <Stack direction="row" justifyContent="end" spacing={2} mb={2}>
        <Badge
          color="error"
          variant="dot"
          invisible={false}
          sx={{
            "& .MuiBadge-dot": {
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "#F58220",
              right: 8,
              top: 8,
            },
          }}
          overlap="circular"
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <Box
            bgcolor="#FFFFFF"
            borderRadius="50%"
            width="48px"
            height="48px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            border="1px solid #F58220"
            onClick={() => setFilterOpen(true)}
            sx={{
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 0 8px rgba(245, 130, 32, 0.6)",
            }}
          >
            <FilterIcon />
          </Box>
        </Badge>


        <StyledButton
          variant="primary"
          name="Download"
          onClick={() => setDownloadPopupOpen(true)}
        />
      </Stack>

      <EventTable
        columns={userColumns}
        data={sortedData}
        menu={false}
        loading={loading}
        pageNo={pageNo}
        setPageNo={setPageNo}
        rowPerSize={rowPerSize}
        setRowPerSize={setRowPerSize}
        totalCount={totalCount}
        rsvp={true} 
       handleRemoveRsvp={handleRemoveRsvp} 

      />
      <Drawer
        anchor="right"
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
      >
        <RsvpFilter
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          onApply={handleApplyFilter}
          appliedFilters={filters}
        />
      </Drawer>

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

export default RsvpTable;