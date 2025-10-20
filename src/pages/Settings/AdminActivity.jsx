import { Box, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ReactComponent as FilterIcon } from "../../assets/icons/FilterIcon.svg";
import StyledSearchbar from "../../ui/StyledSearchbar.jsx";
import StyledTable from "../../ui/StyledTable.jsx";
import { adminActivityColumns } from "../../assets/json/TableData.js";
import AdminFilter from "../../ui/AdminFilter.jsx";
import { useListStore } from "../../store/listStore.js";
import ActivityView from "./ActivityView.jsx";
import { useAdminStore } from "../../store/adminStore.js";
export default function AdminActivity() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [row, setRow] = useState(10);
  const [search, setSearch] = useState("");
  const [preview, setPreview] = useState(false);
  const { getActivity } = useListStore();
  const { activity, fetchAdminActivity } = useAdminStore();
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    date: "",
  });
  useEffect(() => {
    let filter = {};

    filter.limit = row;
    filter.pageNo = pageNo;
    if (filters.type) filter.method = filters.type;
    if (filters.status) filter.status = filters.status;
    if (filters.date) filter.date = filters.date;
    if (search) filter.search = search;
    getActivity(filter);
  }, [pageNo, row, filters,search]);
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
              <StyledSearchbar placeholder={"Search by Endpoint"}
                value={search}
                onchange={(e) => setSearch(e.target.value)}
              />
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
              pageNo={pageNo}
              setPageNo={setPageNo}
              rowPerSize={row}
              setRowPerSize={setRow}
              menu
              onView={async (id) => {
                await fetchAdminActivity(id);
                setPreview(true);
              }}
            />{" "}
            <AdminFilter
              open={filterOpen}
              onClose={handleCloseFilter}
              onApply={handleApplyFilter}
            />
            <ActivityView
              open={preview}
              onClose={() => setPreview(false)}
              data={activity}
            />
          </Box>
        </Grid>
      </>
    </>
  );
}
