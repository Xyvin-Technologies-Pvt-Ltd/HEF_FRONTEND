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

const ApprovalPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [isChange, setIsChange] = useState(false);
  const { fetchFeed } = useListStore();
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [row, setRow] = useState(10);
  const [approvalId, setApprovalId] = useState(null);
  useEffect(() => {
    let filter = {};
    filter.pageNo = pageNo;
    filter.limit = row;
    if (search) {
      filter.search = search;
      setPageNo(1);
    }
    fetchFeed(filter);
  }, [isChange, pageNo, search, row, selectedTab]);

  const handleReject = (id) => {
    setApprovalId(id);
    setRejectOpen(true);
  };
  const handleCloseReject = () => {
    setRejectOpen(false);
  };
  const handleApprove = (id) => {
    setApprovalId(id);
    setApproveOpen(true);
  };
  const handleCloseApprove = () => {
    setApproveOpen(false);
  };
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
        <Tab label="State PSRT" />
        <Tab label="Zone PSRT" />
        <Tab label="District PSRT" />
        <Tab label="Chapter PSRT" />
        <Tab label="Members" />
      </Tabs>
      <Divider />{" "}
      <Box padding={"15px"}>
        {" "}
        <Stack
          direction={"row"}
          justifyContent={"end"}
          paddingBottom={"15px"}
          alignItems={"center"}
        >
          <Stack direction={"row"} spacing={2}>
            <StyledSearchbar
              placeholder={"Search"}
              onchange={(e) => setSearch(e.target.value)}
            />
          </Stack>
        </Stack>
        <Box
          borderRadius={"16px"}
          bgcolor={"white"}
          p={1}
          border={"1px solid rgba(0, 0, 0, 0.12)"}
        >
          <StyledTable
            columns={feedColumns}
            pageNo={pageNo}
            setPageNo={setPageNo}
            payment
            onModify={handleApprove}
            onAction={handleReject}
            rowPerSize={row}
            setRowPerSize={setRow}
          />
          <FeedReject
            open={rejectOpen}
            onClose={handleCloseReject}
            id={approvalId}
            setIsChange={setIsChange}
          />
          <FeedApproval
            open={approveOpen}
            onClose={handleCloseApprove}
            id={approvalId}
            setIsChange={setIsChange}
          />
        </Box>
      </Box>
    </>
  );
};

export default ApprovalPage;
