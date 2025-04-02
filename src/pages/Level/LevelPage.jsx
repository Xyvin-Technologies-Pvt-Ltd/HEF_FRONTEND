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
import { useLocation, useNavigate } from "react-router-dom";
import useHierarchyStore from "../../store/hierarchyStore";
import { toast } from "react-toastify";
import { getchapterList } from "../../api/hierarchyapi";
import { generateExcel } from "../../utils/generateExcel";
const tabMapping = {
  state: 0,
  zone: 1,
  district: 2,
  chapter: 3,
};
const LevelPage = () => {
  const { fetchLevels } = useListStore();
  const storedTab = localStorage.getItem("levelTab");
  const [selectedRows, setSelectedRows] = useState([]);
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [row, setRow] = useState(10);
  const [isChange, setIsChange] = useState(false);
  const { deleteLevels } = useHierarchyStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { type } = location?.state || {};
  const [selectedTab, setSelectedTab] = useState(
    storedTab !== null ? Number(storedTab) : tabMapping[type] ?? 0
  );

  useEffect(() => {
    if (type && tabMapping.hasOwnProperty(type)) {
      setSelectedTab(tabMapping[type]);
      localStorage.setItem("levelTab", tabMapping[type]); 
    }
  }, [type]);
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
      type = "state";
    } else if (selectedTab === 1) {
      type = "zone";
    } else if (selectedTab === 2) {
      type = "district";
    } else if (selectedTab === 3) {
      type = "chapter";
    }
    fetchLevels(type, filter);
  }, [, pageNo, search, row, selectedTab, isChange]);

  const handleChange = (event, newValue) => {
    localStorage.setItem("levelTab", newValue);
    setSelectedTab(newValue);
  };
  const handleEdit = (id) => {
    const typeMapping = {
      0: "state",
      1: "zone",
      2: "district",
      3: "chapter",
    };

    const type = typeMapping[selectedTab];
    navigate(`/levels/level`, {
      state: { levelId: id, category: type, isUpdate: true },
    });
  };
  const handleSelectionChange = (newSelectedIds) => {
    setSelectedRows(newSelectedIds);
  };
  const handleDelete = async () => {
    if (selectedRows.length > 0) {
      try {
        const typeMapping = {
          0: "state",
          1: "zone",
          2: "district",
          3: "chapter",
        };

        const type = typeMapping[selectedTab];
        await Promise.all(
          selectedRows?.map((id) => deleteLevels(type, { levelId: id }))
        );
        toast.success("Deleted successfully");
        setIsChange(!isChange);
        setSelectedRows([]);
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleRowDelete = async (id) => {
    const typeMapping = {
      0: "state",
      1: "zone",
      2: "district",
      3: "chapter",
    };

    const type = typeMapping[selectedTab];
    try {
      await deleteLevels(type, { levelId: id });
      toast.success("Deleted successfully");
      setIsChange(!isChange);
    } catch (error) {
      toast.error(error.message);
    }
  };
  const handleDownload = async () => {
    try {
      const data = await getchapterList();
      const csvData = data?.data;
      if (csvData && csvData.headers && csvData.body) {
        generateExcel(csvData.headers, csvData.body, "Chapter");
      } else {
        console.error(
          "Error: Missing headers or data in the downloaded content"
        );
      }
    } catch (error) {
      console.error("Error downloading users:", error);
    }
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
            {selectedTab === 3 && (
              <StyledButton
                name={"Download csv"}
                variant="primary"
                onClick={handleDownload}
              />
            )}
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
            onSelectionChange={handleSelectionChange}
            onDelete={handleDelete}
            onDeleteRow={handleRowDelete}
            pageNo={pageNo}
            setPageNo={setPageNo}
            rowPerSize={row}
            setRowPerSize={setRow}
            onModify={handleEdit}
          />
        </Box>
      </Box>
    </>
  );
};

export default LevelPage;
