import { Box, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import EventTable from "../../ui/EventTable";
import { StyledButton } from "../../ui/StyledButton";
import { getRsvpDownload, getEventRsvp, getEventById, removeEventRsvp } from "../../api/eventapi";
import DownloadPopup from "../../components/Member/DownloadPopup";
import { generateExcel } from "../../utils/generateExcel";
import { generatePDF } from "../../utils/generatePDF";
import { toast } from "react-toastify";

const RsvpTable = ({ eventId }) => {
  const [data, setData] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [rowPerSize, setRowPerSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [downloadPopupOpen, setDownloadPopupOpen] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  // Fetch RSVP data from backend
  const fetchRsvp = async () => {
    setLoading(true);
    try {
      const res = await getEventRsvp(eventId, pageNo, rowPerSize);
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
  }, [eventId, pageNo, rowPerSize]);

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
        const eventInfo = {
          eventName: eventRes?.data?.eventName,
          eventDateTime: new Date(eventRes?.data?.startDate).toLocaleString(
            "en-US",
            { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }
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


  return (
    <Box padding="15px">
      {/* Download Button */}
      <Stack direction="row" justifyContent="end" spacing={2} mb={2}>
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