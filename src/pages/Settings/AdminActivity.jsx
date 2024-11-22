import { Box, Grid, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as FilterIcon } from "../../assets/icons/FilterIcon.svg";
import StyledSearchbar from "../../ui/StyledSearchbar.jsx";
import StyledTable from "../../ui/StyledTable.jsx";
import { adminActivityColumns, userData } from "../../assets/json/TableData.js";
import AdminFilter from "../../ui/AdminFilter.jsx";
export default function AdminActivity() {
  const navigate = useNavigate();
  const [filterOpen, setFilterOpen] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [row, setRow] = useState(10);
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    date: "",
  });
  const handleOpenFilter = () => {
    setFilterOpen(true);
  };

  const handleCloseFilter = () => {
    setFilterOpen(false);
  };
  const handleApplyFilter = (newFilters) => {
    setFilters(newFilters);
  };
  return (
    <>
      <>
        <Grid container alignItems="center">
          <Grid item xs={6}></Grid>
          <Grid
            item
            xs={6}
            container
            display={"flex"}
            alignItems={"center"}
            justifyContent="flex-end"
            spacing={2}
          >
            <Grid item>
              <StyledSearchbar placeholder={"Search"} />
            </Grid>
            <Grid item>
              <Box
                bgcolor={"#FFFFFF"}
                borderRadius={"50%"}
                width={"48px"}
                height={"48px"}
                display="flex"
                alignItems="center"
                justifyContent="center"
                border="1px solid rgba(0, 0, 0, 0.12)"
                onClick={handleOpenFilter}
                style={{ cursor: "pointer" }}
              >
                <FilterIcon />
              </Box>
            </Grid>
          </Grid>
        </Grid>

        <Grid marginTop={"15px"}>
          {" "}
          <Box
            borderRadius={"16px"}
            bgcolor={"white"}
            p={1}
            border={"1px solid rgba(0, 0, 0, 0.12)"}
          >
            <StyledTable
              columns={adminActivityColumns}
              data={userData}
              pageNo={pageNo}
              setPageNo={setPageNo}
              rowPerSize={row}
              setRowPerSize={setRow}
            />{" "}
            <AdminFilter
              open={filterOpen}
              onClose={handleCloseFilter}
              onApply={handleApplyFilter}
            />
          </Box>
        </Grid>
      </>
    </>
  );
}
