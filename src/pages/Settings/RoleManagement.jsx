import { Box, Grid, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StyledButton } from "../../ui/StyledButton.jsx";
import StyledSearchbar from "../../ui/StyledSearchbar.jsx";
import StyledTable from "../../ui/StyledTable.jsx";
import { roleColumns } from "../../assets/json/TableData";
import { useRoleStore } from "../../store/roleStore.js";
import { toast } from "react-toastify";
import { useListStore } from "../../store/listStore.js";

import { ReactComponent as AddIcon } from "../../assets/icons/AddIcon.svg";
export default function RoleManagement() {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [isChange, setIsChange] = useState(false);
  const { deleteRoles } = useRoleStore();
  const { getRoles } = useListStore();
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
  };
  const handleDelete = async () => {
    if (selectedRows.length > 0) {
      try {
        await Promise.all(selectedRows?.map((id) => deleteRoles(id)));
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
      await deleteRoles(id);
      toast.success("Deleted successfully");
      setIsChange(!isChange);
    } catch (error) {
      toast.error(error.message);
    }
  };
  const handleEdit = (id) => {
    navigate(`/settings/add-role`, {
      state: { roleId: id, isUpdate: true },
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
    getRoles(filter);
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
                placeholder="Search "
                onchange={(e) => setSearch(e.target.value)}
              />
            </Grid>
            <Grid item></Grid>
            <Grid item>
              <StyledButton
                name={
                  <>
                    <AddIcon /> Add Role
                  </>
                }
                variant="primary"
                onClick={() => navigate("/settings/add-role")}
              />
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
              columns={roleColumns}
              onSelectionChange={handleSelectionChange}
              onModify={handleEdit}
              onDelete={handleDelete}
              pageNo={pageNo}
              setPageNo={setPageNo}
              onDeleteRow={handleRowDelete}
              rowPerSize={row}
              setRowPerSize={setRow}
            />{" "}
          </Box>
        </Grid>
      </>
    </>
  );
}
