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

import StyledTable from "../../ui/StyledTable";
import { activityColumns } from "../../assets/json/TableData";
import StyledSearchbar from "../../ui/StyledSearchbar";
import { useListStore } from "../../store/listStore";
import { StyledButton } from "../../ui/StyledButton";

import { ReactComponent as AddIcon } from "../../assets/icons/AddIcon.svg";
import { useNavigate } from "react-router-dom";

const BusinessPage = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [search, setSearch] = useState();
  const [row, setRow] = useState(10);
  const { fetchActivity } = useListStore();
  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  useEffect(() => {
    let filter = {};
    if (search) {
      filter.search = search;
      setPageNo(1);
    }
    filter.pageNo = pageNo;
    filter.limit = row;
    fetchActivity(filter);
  }, [pageNo, search, row]);
  return (
    <>
      {" "}
      <Stack
        direction={"row"}
        padding={"10px"}
        bgcolor={"#fff"}
        height={"70px"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Stack>
          <Typography variant="h4" color={"textSecondary"}>
            Activity
          </Typography>
        </Stack>
        <Stack direction={"row"} spacing={2} justifyContent={"flex-end"}>
          <StyledButton
            variant={"primary"}
            name={
              <>
                <AddIcon />
                Create Activity
              </>
            }
            onClick={() => {
              navigate("/activity/activity");
            }}
          />
        </Stack>
      </Stack>
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
          margin: 2,
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
            // payment
            // onModify={handleApprove}
            // onAction={handleReject}
            rowPerSize={row}
            setRowPerSize={setRow}
          />
        </Box>
      </Box>
    </>
  );
};

export default BusinessPage;
