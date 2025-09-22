import { Box, Stack } from "@mui/material";
import React from "react";
import EventTable from "../../ui/EventTable";

const GuestTable = ({ data }) => {
  const userColumns = [
    { title: "guest name", field: "name", padding: "none" },
    { title: "contact", field: "contact" },
    { title: "category", field: "category" },
    { title: "C/O Member", field: "addedBy" },
  ];

  return (
    <>
      <Stack
        direction="row"
        justifyContent="end"
        paddingBottom="15px"
        alignItems="center"
      >
        {/* Placeholder for future search/filter components */}
        {/* <Stack direction="row" spacing={2}>
          <StyledSearchbar />
        </Stack> */}
      </Stack>

      <Box
        borderRadius="16px"
        bgcolor="white"
        p={1}
        border="1px solid rgba(0, 0, 0, 0.12)"
      >
        <EventTable columns={userColumns} data={data} menu />
      </Box>
    </>
  );
};

export default GuestTable;
