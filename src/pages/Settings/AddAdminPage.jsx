import React, { useState } from "react";
import ResponsiveTabs from "../../ui/ResponsiveTabs";
import { Box, Divider, Grid, Tab, Typography } from "@mui/material";

import AddAdmin from "../../components/Setting/AddAdmin";
import BulkAddForm from "../../components/Setting/BulkAddForm";

const AddAdminPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  return (
    <>
      {" "}
      <Box
        padding={"10px"}
        bgcolor={"#FFFFFF"}
        sx={{ height: { xs: "auto", sm: "70px" }, minHeight: "70px" }}
        display={"flex"}
        alignItems={"center"}
      >
        <Grid container alignItems="center">
          <Grid item xs={12} sm={6}>
            <Typography variant="h4" color={"textSecondary"}>
              Admin Management
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <>
        <ResponsiveTabs
          value={selectedTab}
          onChange={handleChange}
          aria-label="tabs"
          TabIndicatorProps={{
            style: {
              backgroundColor: "#F58220",
              height: 4,
              borderRadius: "4px",
            },
          }}
          sx={{
            paddingTop: "0px",
            "& .MuiTabs-indicator": {
              backgroundColor: "#F58220",
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontSize: "16px",
              fontWeight: 600,
              color: "#686465",
            },
            "& .MuiTab-root.Mui-selected": {
              color: "#F58220",
            },
          }}
        >
          <Tab label="Single Add" />
          <Tab label="Bulk Add" />
        </ResponsiveTabs>
        <Divider />
        <Box padding="15px" marginBottom={4}>
          {selectedTab === 0 && (
            <Grid container>
              <Grid item md={8}>
                <AddAdmin />
              </Grid>
            </Grid>
          )}
          {selectedTab === 1 && (
            <Grid>
              {" "}
              <Grid container>
                <Grid item md={7}>
                  <BulkAddForm/>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Box>
      </>
    </>
  );
};

export default AddAdminPage;
