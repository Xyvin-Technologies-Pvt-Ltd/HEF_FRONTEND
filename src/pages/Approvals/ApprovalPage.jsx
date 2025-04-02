import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Grid,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import FeedList from "./FeedList";
import StyledTable from "../../ui/StyledTable";
import FeedReject from "../../components/Approve/FeedReject";
import FeedApproval from "../../components/Approve/FeedApproval";
import { useListStore } from "../../store/listStore";
import { feedColumns } from "../../assets/json/TableData";
import StyledSearchbar from "../../ui/StyledSearchbar";
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
        height={"70px"}
        display={"flex"}
        alignItems={"center"}
      >
        <Typography variant="h4" color={"textSecondary"}>
          Requirements
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
        <Tab label="Requirements" />
        <Tab label="Business Posts" />
      </Tabs>
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
