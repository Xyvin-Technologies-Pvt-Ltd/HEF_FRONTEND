import { Box, Stack } from "@mui/material";
import React, { useState } from "react";
import EventTable from "../../ui/EventTable";
const RsvpTable = ({ data }) => {
  const userColumns = [
    { title: "Name", field: "name", padding: "none" },
    { title: "Phone", field: "phone" },
     { title: "Chapter", field: "chaptername" },
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
