import React, { useEffect, useState } from "react";
import { Box, Stack, Tab, Tabs } from "@mui/material";

import StyledTable from "../../ui/StyledTable";
import StyledSearchbar from "../../ui/StyledSearchbar";
import { useNavigate, useParams } from "react-router-dom";
import { useListStore } from "../../store/listStore";

const MemberActivity = () => {
  const storeTab = localStorage.getItem("memberactivityTab");
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(storeTab? Number(storeTab) : 0);
  const [pageNo, setPageNo] = useState(1);
  const [search, setSearch] = useState();
  const [row, setRow] = useState(10);
  const { fetchActivity } = useListStore();
  const {id}=useParams();
  const handleChange = (event, newValue) => {
    localStorage.setItem("memberactivityTab", newValue);
    setSelectedTab(newValue);
  };
  useEffect(() => {
    let filter = {user:id};
    if (search) {
      filter.search = search;
      setPageNo(1);
    }
    if (selectedTab === 1) {
      filter.type = "Business";
    } else if (selectedTab === 2) {
      filter.type = "One v One Meeting";
    } else if (selectedTab === 3) {
      filter.type = "Referral";
    }
    filter.pageNo = pageNo;
    filter.limit = row;
    fetchActivity(filter);
  }, [pageNo, search, row, id,selectedTab]);
  const activityColumns = [
    { title: "Date", field: "createdAt", padding: "none" },
    { title: "Business giver", field: "senderName" },
    { title: "Business receiver", field: "memberName" },
    { title: "Request Type", field: "type" },
    { title: "Status", field: "status" },
    ...(selectedTab === 3
      ? [{ title: "Referral", field: "referralName" }]
      : []),
  ];
  return (
    <>
      {" "}
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

          backgroundColor: "white",
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
        <Tab label="All" />
        <Tab label="Business" />
        <Tab label="1 on 1 meeting" />
        <Tab label="Referrals" />
      </Tabs>
      <Box padding={"15px"}>
        <Stack
          direction={"row"}
          justifyContent={"end"}
          paddingBottom={"15px"}
          alignItems={"center"}
        >
          <Stack direction={"row"} spacing={2} mt={2}>
            <StyledSearchbar placeholder={"Search"} />
          </Stack>
        </Stack>
        <Box
          borderRadius={"16px"}
          bgcolor={"white"}
          p={1}
          border={"1px solid rgba(0, 0, 0, 0.12)"}
        >
          <StyledTable
            columns={activityColumns}
            pageNo={pageNo}
            setPageNo={setPageNo}
            menu
            rowPerSize={row}
            setRowPerSize={setRow}
          />
        </Box>
      </Box>
    </>
  );
};

export default MemberActivity;
