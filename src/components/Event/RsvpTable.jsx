import { Box, Stack } from "@mui/material";
import React, { useState } from "react";
import EventTable from "../../ui/EventTable";
import { StyledButton } from "../../ui/StyledButton";
import { getRsvpDownload, getEventById } from "../../api/eventapi";
import DownloadPopup from "../../components/Member/DownloadPopup";
import { generateExcel } from "../../utils/generateExcel";
import { generatePDF } from "../../utils/generatePDF";
const RsvpTable = ({ eventId, data }) => {

  const [downloadPopupOpen, setDownloadPopupOpen] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const handleDownloadExcel = async () => {
    setDownloadLoading(true);
    try {
      const res = await getRsvpDownload(eventId);
      if (res?.data?.headers && res?.data?.body) {
        generateExcel(res?.data?.headers, res?.data.body, "Rsvp");
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
        // get event details separately
        const eventRes = await getEventById(eventId);
        const eventInfo = {
          eventName: eventRes?.data?.eventName,
          eventDateTime: new Date(eventRes?.data?.startDate).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        generatePDF(res?.data?.headers, res?.data?.body, "RSVP List", eventInfo);
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

      <EventTable columns={userColumns} data={data} />

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