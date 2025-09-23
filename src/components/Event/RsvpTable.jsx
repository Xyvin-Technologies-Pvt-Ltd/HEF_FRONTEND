import { Box, Stack } from "@mui/material";
import React, { useState } from "react";
import EventTable from "../../ui/EventTable";
import { StyledButton } from "../../ui/StyledButton";
import { generateExcel } from "../../utils/generateExcel";
import { generatePDF } from "../../utils/generatePDF";
import DownloadPopup from "../../components/Member/DownloadPopup";

const RsvpTable = ({ data }) => {
  const [downloadPopupOpen, setDownloadPopupOpen] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  // Table columns
  const userColumns = [
    { title: "Name", field: "name", padding: "none" },
    { title: "Phone", field: "phone" },
    { title: "Chapter", field: "chaptername" },
  ];

  // Excel download
  const handleDownloadExcel = () => {
    if (!data || data.length === 0) return;

    setDownloadLoading(true);
    try {
      const formattedData = data.map((item) => ({
        Name: item.name,
        Phone: item.phone,
        Chapter: item.chaptername || "Unknown",
      }));

      const headers = ["Name", "Phone", "Chapter"];
      generateExcel(headers, formattedData, "RSVP List");
    } catch (error) {
      console.error("Excel download error:", error);
    } finally {
      setDownloadLoading(false);
      setDownloadPopupOpen(false);
    }
  };

  // PDF download
  const handleDownloadPDF = () => {
    if (!data || data.length === 0) return;

    setDownloadLoading(true);
    try {
      const formattedData = data.map((item) => ({
        Name: item.name,
        Phone: item.phone,
        Chapter: item.chaptername || "Unknown",
      }));

      const headers = [
        { header: "Name", key: "Name" },
        { header: "Phone", key: "Phone" },
        { header: "Chapter", key: "Chapter" },
      ];

      generatePDF(headers, formattedData, "RSVP List");
    } catch (error) {
      console.error("PDF download error:", error);
    } finally {
      setDownloadLoading(false);
      setDownloadPopupOpen(false);
    }
  };

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

      {/* RSVP Table */}
      <EventTable columns={userColumns} data={data} menu />

      {/* Download Popup */}
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
