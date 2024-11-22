import { Box, Grid, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import StyledTable from "../../ui/StyledTable.jsx";
import { eventHistoryColumns, eventList, userData } from "../../assets/json/TableData";
import { StyledButton } from "../../ui/StyledButton";
import StyledSearchbar from "../../ui/StyledSearchbar.jsx";
import { useListStore } from "../../store/listStore.js";
export default function EventHistorypage() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [search, setSearch] = useState("");
  const { fetchEvent } = useListStore();
  const [row, setRow] = useState(10);
  const handleOpenFilter = () => {
    setFilterOpen(true);
  };
  useEffect(() => {
    let filter = {};
    if (search) {
      filter.search = search;
      setPageNo(1);
    }
    filter.status = "completed";
    filter.pageNo = pageNo;
    filter.limit = row;
    fetchEvent(filter);
  }, [pageNo, search, row]);
  const handleCloseFilter = () => {
    setFilterOpen(false);
  };

  return (
    <>
      {" "}
      <Box
        padding={"10px"}
        bgcolor={"#FFFFFF"}
        height={"70px"}
        display={"flex"}
        alignItems={"center"}
      >
        <Grid container alignItems="center">
          <Grid item xs={6}>
            <Typography variant="h4" color={"textSecondary"}>
              Event history
            </Typography>
          </Grid>
          <Grid item xs={6} container justifyContent="flex-end" spacing={2}>
            <Grid item>
            
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <Box padding="15px" marginBottom={4}>
        <>
          <Stack
            direction={"row"}
            justifyContent={"end"}
            paddingBottom={"15px"}
            alignItems={"center"}
          >
            <Stack direction={"row"} spacing={2}>
              <StyledSearchbar
                placeholder={"Search"}
                onchange={(e) => setSearch(e.target.value)}
              />
            </Stack>
          </Stack>{" "}
          <Box
            borderRadius={"16px"}
            bgcolor={"white"}
            p={1}
            border={"1px solid rgba(0, 0, 0, 0.12)"}
          >
            <StyledTable
              columns={eventList}
              data={userData}
              pageNo={pageNo}
              setPageNo={setPageNo}
              rowPerSize={row}
              setRowPerSize={setRow}
            />{" "}
          </Box>
        </>
      </Box>
    </>
  );
}
