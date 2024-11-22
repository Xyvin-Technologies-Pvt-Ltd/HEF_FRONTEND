import { Box, Grid, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddRole from "../../components/Setting/AddRole";
export default function AddRolePage() {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);

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

  return (
    <>
      {" "}
      <Box padding={"15px"} bgcolor={"#FFFFFF"}>
        <Grid container alignItems="center">
          <Grid item xs={6}>
            <Typography variant="h4" color={"#4A4647"}>
              Role management 
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Grid container item xs={12} padding={'15px'}>
        <Grid item xs={6}>
          <AddRole />
        </Grid>
      </Grid>
    </>
  );
}
