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

import { ReactComponent as FilterIcon } from "../../assets/icons/FilterIcon.svg";

import StyledSearchbar from "../../ui/StyledSearchbar";
import { useListStore } from "../../store/listStore";
import { StyledButton } from "../../ui/StyledButton";

import { ReactComponent as AddIcon } from "../../assets/icons/AddIcon.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useActivityStore from "../../store/activityStore";
import ActivityFilter from "../../components/Activity/ActivityFilter";

const BusinessPage = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isChange, setIsChange] = useState(false);
  const [search, setSearch] = useState();
  const [row, setRow] = useState(10);
  const { fetchActivity } = useListStore();
  const { removeActivity } = useActivityStore();
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    date: "",
  });
  const location = useLocation();
  const { tab } = location.state || {};
  useEffect(() => {
    if (tab !== undefined) {
      setSelectedTab(tab);
    }
  }, [tab]);

  const handleApplyFilter = (newFilters) => {
    setFilters(newFilters);
  };
  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  const handleSelectionChange = (newSelectedIds) => {
    setSelectedRows(newSelectedIds);
  };
  const handleDelete = async () => {
    if (selectedRows.length > 0) {
      await Promise.all(selectedRows?.map((id) => removeActivity(id)));
      toast.success("Deleted successfully");
      setIsChange(!isChange);
      setSelectedRows([]);
    }
  };

  useEffect(() => {
    let filter = {};
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
  }, [isChange, pageNo, search, row, selectedTab]);
  const activityColumns = [
    { title: "Date", field: "date", padding: "none" },
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
            <Box
              bgcolor={"#FFFFFF"}
              borderRadius={"50%"}
              width={"48px"}
              height={"48px"}
              display="flex"
              alignItems="center"
              justifyContent="center"
              border="1px solid rgba(0, 0, 0, 0.12)"
              onClick={() => setFilterOpen(true)}
              style={{ cursor: "pointer" }}
            >
              <FilterIcon />
            </Box>
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
            menu
            setPageNo={setPageNo}
            onDelete={handleDelete}
            onSelectionChange={handleSelectionChange}
            rowPerSize={row}
            setRowPerSize={setRow}
          />
        </Box>
        <ActivityFilter
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          onApply={handleApplyFilter}
        />
      </Box>
    </>
  );
};

export default BusinessPage;
