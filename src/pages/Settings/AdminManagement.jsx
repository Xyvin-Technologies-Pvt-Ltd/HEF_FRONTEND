import { Box, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StyledButton } from "../../ui/StyledButton.jsx";
import StyledSearchbar from "../../ui/StyledSearchbar.jsx";
import StyledTable from "../../ui/StyledTable.jsx";
import { adminColumns, userData } from "../../assets/json/TableData";
import { useListStore } from "../../store/listStore.js";
import { ReactComponent as AddIcon } from "../../assets/icons/AddIcon.svg";

export default function AdminManagement() {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [isChange, setIsChange] = useState(false);
  const { getAdmins } = useListStore();
  const [pageNo, setPageNo] = useState(1);
  const [row, setRow] = useState(10);
  const [search, setSearch] = useState("");
  const handleOpenFilter = () => {
    setFilterOpen(true);
  };

  const handleCloseFilter = () => {
    setFilterOpen(false);
  };
  const handleSelectionChange = (newSelectedIds) => {
    setSelectedRows(newSelectedIds);
    console.log("Selected items:", newSelectedIds);
  };
  useEffect(() => {
    let filter = {};
    filter.pageNo = pageNo;
    filter.limit = row;
    if (search) {
      filter.search = search;
      setPageNo(1);
    }
    getAdmins(filter);
  }, [isChange, pageNo, search, row]);
  return (
    <>
      {" "}
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
              <StyledSearchbar
                placeholder={"Search"}
                onchange={(e) => setSearch(e.target.value)}
              />
            </Grid>
            <Grid item></Grid>
            <Grid item>
              <StyledButton
                name={
                  <>
                    <AddIcon /> Add Admin
                  </>
                }
                variant="primary"
                onClick={() => navigate("/settings/add-admin")}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid marginTop={"15px"}>
          <Box
            borderRadius={"16px"}
            bgcolor={"white"}
            p={1}
            border={"1px solid rgba(0, 0, 0, 0.12)"}
          >
            <StyledTable
              columns={adminColumns}
              pageNo={pageNo}
              setPageNo={setPageNo}
              rowPerSize={row}
              setRowPerSize={setRow}
              onSelectionChange={handleSelectionChange}
            />{" "}
          </Box>
        </Grid>
      </>
    </>
  );
}
