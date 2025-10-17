import { useState } from "react";
import { Box, Stack, Badge, Tooltip } from "@mui/material";
import { StyledButton } from "../../ui/StyledButton";
import { getGuestsDownload , getEventById } from "../../api/eventapi";
import DownloadPopup from "../../components/Member/DownloadPopup";
import { generateExcel } from "../../utils/generateExcel";
import { generatePDF } from "../../utils/generatePDF";
import { toast } from "react-toastify";
import EventTable from "../../ui/EventTable";

const GuestTable = ({ eventId, data }) => {
  const [downloadPopupOpen, setDownloadPopupOpen] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const sortedData = [...data].sort((a, b) =>
    a.name?.toLowerCase().localeCompare(b.name?.toLowerCase())
  );

  const handleDownloadExcel = async () => {
    setDownloadLoading(true);
    try {
      const res = await getGuestsDownload(eventId);
      if (res?.data?.headers && res?.data?.body) {
        const sortedBody = [...res.data.body].sort((a, b) =>
          a.name?.toLowerCase().localeCompare(b.name?.toLowerCase())
        );
        generateExcel(res?.data?.headers, res?.data.body, "Guests");
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
      const res = await getGuestsDownload(eventId);
      if (res?.data?.headers && res?.data?.body) {
        const sortedBody = [...res.data.body].sort((a, b) =>
          a.name?.toLowerCase().localeCompare(b.name?.toLowerCase())
        );

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

        generatePDF(res?.data?.headers, res?.data?.body, "Guests List", eventInfo);
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
    { title: "Registration Date", field: "registrationDate" },
  ];

  return (
    <Box padding="15px">
      <Stack direction="row" justifyContent="end" spacing={2} mb={2}>
        <StyledButton
          variant="primary"
          name="Download"
          onClick={() => setDownloadPopupOpen(true)}
        />
      </Stack>

      <EventTable columns={guestColumns} data={sortedData} menu />

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
