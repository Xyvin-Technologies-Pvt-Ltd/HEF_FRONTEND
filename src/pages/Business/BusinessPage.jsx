import React, { useEffect, useState } from "react";
import { Box, Divider, Grid, Tab, Tabs, Typography } from "@mui/material";
import FeedList from "../Approvals/FeedList";
import MembershipApproval from "../Approvals/MembershipApproval";
import BusinessState from "../../components/Business/BusinessState";

const BusinessPage = () => {
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
        height={"70px"}
        display={"flex"}
        alignItems={"center"}
      >
        <Typography variant="h4" color={"textSecondary"}>
          Business
        </Typography>
      </Box>
      <Tabs
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
        <Tab label="State PSRT" />
        <Tab label="Zone PSRT" />
        <Tab label="District PSRT" />
        <Tab label="Chapter PSRT" />
        <Tab label="Members" />
      </Tabs>
      <Divider />
      <Box padding={"15px"}>
        {selectedTab === 0 && (
          <Grid>
            <BusinessState />
          </Grid>
        )}
        {selectedTab === 1 && (
          <Grid>
            <BusinessState />
          </Grid>
        )}
        {selectedTab === 2 && (
          <Grid>
            <BusinessState />
          </Grid>
        )}
        {selectedTab === 3 && (
          <Grid>
            <BusinessState />
          </Grid>
        )}{" "}
        {selectedTab === 4 && (
          <Grid>
            <BusinessState />
          </Grid>
        )}
      </Box>
    </>
  );
};

export default BusinessPage;
