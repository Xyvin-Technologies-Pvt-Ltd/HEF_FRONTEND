import { Box, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StyledButton } from "../../ui/StyledButton.jsx";
import StyledSearchbar from "../../ui/StyledSearchbar.jsx";
import StyledTable from "../../ui/StyledTable.jsx";
import { adminColumns } from "../../assets/json/TableData";
import { useListStore } from "../../store/listStore.js";
import { ReactComponent as AddIcon } from "../../assets/icons/AddIcon.svg";
import { toast } from "react-toastify";
import { useAdminStore } from "../../store/adminStore.js";

export default function AdminManagement() {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [isChange, setIsChange] = useState(false);
  const { getAdmins } = useListStore();
  const [pageNo, setPageNo] = useState(1);
  const [row, setRow] = useState(10);
  const [search, setSearch] = useState("");
  const { deleteAdmins } = useAdminStore();
  const handleOpenFilter = () => {
    setFilterOpen(true);
  };

  const handleCloseFilter = () => {
    setFilterOpen(false);
  };
  const handleSelectionChange = (newSelectedIds) => {
    setSelectedRows(newSelectedIds);
  };
  const handleDelete = async () => {
    if (selectedRows.length > 0) {
      try {
        await Promise.all(selectedRows?.map((id) => deleteAdmins(id)));
        toast.success("Deleted successfully");
        setIsChange(!isChange);
        setSelectedRows([]);
      } catch (error) {
        toast.error(error.message);
      }
    }
  };
  const handleRowDelete = async (id) => {
    try {
      await deleteAdmins(id);
      toast.success("Deleted successfully");
      setIsChange(!isChange);
    } catch (error) {
      toast.error(error.message);
    }
  };
  const handleEdit = (id) => {
    navigate(`/settings/add-admin`, {
      state: { adminId: id, isUpdate: true },
    });
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
              onModify={handleEdit}
              pageNo={pageNo}
              setPageNo={setPageNo}
              rowPerSize={row}
              setRowPerSize={setRow}
              onSelectionChange={handleSelectionChange}
              onDelete={handleDelete}
              onDeleteRow={handleRowDelete}
            />{" "}
          </Box>
        </Grid>
      </>
    </>
  );
}
