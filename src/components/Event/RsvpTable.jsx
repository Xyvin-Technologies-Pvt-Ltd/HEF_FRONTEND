import { Box, Stack } from "@mui/material";
import React, { useState } from "react";
import StyledSearchbar from "../../ui/StyledSearchbar";
import EventTable from "../../ui/EventTable";
const RsvpTable = ({ data }) => {
  const userColumns = [
    { title: "Name", field: "name", padding: "none" },
    { title: "Phone", field: "phone" },
    { title: "Member Id", field: "memberId" },
    
  ];
  return (
    <>
      <Stack
        direction={"row"}
        justifyContent={"end"}
        paddingBottom={'15px'}
        alignItems={"center"}
      >
        <Stack direction={"row"} spacing={2}>
          <StyledSearchbar />
        </Stack>
      </Stack>{" "}
      <Box
        borderRadius={"16px"}
        bgcolor={"white"}
        p={1}
        border={"1px solid rgba(0, 0, 0, 0.12)"}
      >
        <EventTable columns={userColumns} data={data} menu />{" "}
      </Box>
    </>
  );
};

export default RsvpTable;
