import React, { useEffect, useState } from "react";
import ResponsiveTabs from "../../ui/ResponsiveTabs";
import {
  Box,
  Divider,
  Grid,
  Stack,
  Tab,
  Typography,
} from "@mui/material";
import FeedList from "./FeedList";
import MembershipApproval from "./MembershipApproval";

const ApprovalPage = () => {
  const storedTab = localStorage.getItem("approvalTab");
  const [selectedTab, setSelectedTab] = useState(storedTab ? Number(storedTab) : 0);

  const handleChange = (event, newValue) => {
    localStorage.setItem("approvalTab", newValue);
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
        <Typography variant="h4" color={"textSecondary"}>
          Approval
        </Typography>
      </Box>
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
        <Tab label="Requirements" />
        <Tab label="Business Posts" />
      </ResponsiveTabs>
      <Divider />{" "}
      <Box padding={"15px"}>
        {selectedTab === 0 && (
          <Grid>
            <FeedList />
          </Grid>
        )}
        {selectedTab === 1 && (
          <Grid>
            <MembershipApproval />
          </Grid>
        )}
      </Box>
    </>
  );
};

export default ApprovalPage;
