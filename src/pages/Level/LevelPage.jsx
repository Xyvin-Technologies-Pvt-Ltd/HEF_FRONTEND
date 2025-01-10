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
import { useListStore } from "../../store/listStore";
import { levelColumns } from "../../assets/json/TableData";
import StyledSearchbar from "../../ui/StyledSearchbar";
import { StyledButton } from "../../ui/StyledButton";

import { ReactComponent as AddIcon } from "../../assets/icons/AddIcon.svg";
import { useNavigate } from "react-router-dom";

const LevelPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const { fetchLevels } = useListStore();
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [row, setRow] = useState(10);
  const navigate = useNavigate();
  useEffect(() => {
    let filter = {};
    filter.pageNo = pageNo;
    filter.limit = row;
    if (search) {
      filter.search = search;
      setPageNo(1);
    }
    let type;
    if (selectedTab === 0) {
      type = "all";
    } else if (selectedTab === 1) {
      type = "state";
    } else if (selectedTab === 2) {
      type = "zone";
    } else if (selectedTab === 3) {
      type = "district";
    } else if (selectedTab === 4) {
      type = "chapter";
    } else if (selectedTab === 5) {
      type = "members";
    }
    fetchLevels(type, filter);
  }, [, pageNo, search, row, selectedTab]);

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
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          width={"100%"}
        >
          <Typography variant="h4" color={"textSecondary"}>
            Level
          </Typography>{" "}
          <StyledButton
            name={
              <>
                <AddIcon /> Add Level
              </>
            }
            variant="primary"
            onClick={() => navigate("/levels/level")}
          />
        </Stack>
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
        <Tab label="All" />
        <Tab label="State" />
        <Tab label="Zone" />
        <Tab label="District" />
        <Tab label="Chapter" />
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
            columns={levelColumns}
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

export default LevelPage;
