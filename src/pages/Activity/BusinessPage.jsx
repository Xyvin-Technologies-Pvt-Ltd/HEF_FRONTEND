import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Divider,
  Grid,
  Stack,
  Tab,
  Tabs,
  Tooltip,
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
import { generateExcel } from "../../utils/generateExcel";
import { getBusinessDwld } from "../../api/activityapi";
import { useAdminStore } from "../../store/adminStore";
import { generatePDF } from "../../utils/generatePDF";
import DownloadPopup from "../../components/Member/DownloadPopup";


const BusinessPage = () => {
  const navigate = useNavigate();
  const [pageNo, setPageNo] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isChange, setIsChange] = useState(false);
  const [search, setSearch] = useState();
  const [row, setRow] = useState(10);
  const { fetchActivity } = useListStore();
  const { singleAdmin } = useAdminStore();
  const { removeActivity } = useActivityStore();
  const [downloadPopupOpen, setDownloadPopupOpen] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    startDate: "",
    endDate: "",
    chapter: "",
    chapterLabel: "All Chapters",
  });
  const location = useLocation();
  const { tab } = location.state || {};
  const storedTab = localStorage.getItem("businessTab");

  const [selectedTab, setSelectedTab] = useState(() => {
    if (tab !== undefined) return tab;
    if (storedTab) return Number(storedTab);
    return 0;
  });
  useEffect(() => {
    if (tab !== undefined) {
      setSelectedTab(tab);
    }
  }, []);
  const handleApplyFilter = (newFilters) => {
    setFilters(newFilters);
  };
  const handleChange = (event, newValue) => {
    localStorage.setItem("businessTab", newValue);
    setSelectedTab(newValue);
  };
  const handleSelectionChange = (newSelectedIds) => {
    setSelectedRows(newSelectedIds);
  };
  const handleDelete = async () => {
    if (selectedRows.length > 0) {
      try {
        await Promise.all(selectedRows?.map((id) => removeActivity(id)));
        toast.success("Deleted successfully");
        setIsChange(!isChange);
        setSelectedRows([]);
      } catch (error) {
        toast.error(error.message);
      }
    }
  };
  useEffect(() => {
    if (filters.type === "Business") setSelectedTab(1);
    else if (filters.type === "One v One Meeting") setSelectedTab(2);
    else if (filters.type === "Referral") setSelectedTab(3);
    else if (filters.type !== "") setSelectedTab(0);
  }, [filters.type]);

  useEffect(() => {
    let filter = {};
    if (search) {
      filter.search = search;
      setPageNo(1);
    }
    filter.sortByAmount = "true";
    if (filters.chapter) filter.chapter = filters.chapter;
    if (filters.status) filter.status = filters.status;
    if (filters.startDate) filter.startDate = filters.startDate;
    if (filters.endDate) filter.endDate = filters.endDate;

    if (filters.type) {
      filter.type = filters.type;
    } else {
      if (selectedTab === 1) {
        filter.type = "Business";
      } else if (selectedTab === 2) {
        filter.type = "One v One Meeting";
        filter.sortByAmount = "false";
      } else if (selectedTab === 3) {
        filter.type = "Referral";
      }
    }
    filter.pageNo = pageNo;
    filter.limit = row;
    fetchActivity(filter);
  }, [isChange, pageNo, search, row, selectedTab, filters]);
  const hasActiveFilters = Object.values(filters).some((value) => value);
  const activityColumns = [
    { title: "Date", field: "date", padding: "none" },
    { title: "Business giver", field: "senderName" },
    { title: "Business receiver", field: "memberName" },
    { title: "Request Type", field: "type" },
    { title: "Status", field: "status" },
    ...(selectedTab !== 2
      ? [
        {
          title: "Amount ↓",
          field: "amount",
          render: (value) => (value ? `₹${value.toLocaleString()}` : "N/A"),
        },
      ]
      : []),
    ...(selectedTab === 3
      ? [{ title: "Referral", field: "referralName" }]
      : []),
  ];
  const getReportTitle = () => {
    if (selectedTab === 1) return "Business Report";
    if (selectedTab === 2) return "One-on-One Meetings Report";
    if (selectedTab === 3) return "Referral Report";
    return "All Activities Report";
  };

  const handleDownloadExcel = async () => {
    setDownloadLoading(true);
    try {
      // ✅ Build filter with selectedTab
      let filter = { ...filters, sortByAmount: "true" };

      if (selectedTab === 1) {
        filter.type = "Business";
      } else if (selectedTab === 2) {
        filter.type = "One v One Meeting";
      } else if (selectedTab === 3) {
        filter.type = "Referral";
      }

      const data = await getBusinessDwld(filter);
      const csvData = data.data;

      if (csvData?.headers && csvData?.body) {
        const sortedBody = csvData.body.sort(
          (a, b) => (b.amount || 0) - (a.amount || 0)
        );
        const chapterName = filters.chapterLabel || "All_Chapters";
        generateExcel(csvData.headers, sortedBody, getReportTitle(), chapterName);
        toast.success("Excel downloaded successfully!");
      } else {
        toast.error("Invalid data for Excel download");
      }
    } catch (error) {
      console.error("Excel download error:", error);
      toast.error("Failed to download Excel");
    } finally {
      setDownloadLoading(false);
      setDownloadPopupOpen(false);
    }
  };

  // PDF Download
  const handleDownloadPDF = async () => {
    setDownloadLoading(true);
    try {
      // ✅ Build filter with selectedTab
      let filter = { ...filters, sortByAmount: "true" };

      if (selectedTab === 1) {
        filter.type = "Business";
      } else if (selectedTab === 2) {
        filter.type = "One v One Meeting";
      } else if (selectedTab === 3) {
        filter.type = "Referral";
      }

      const data = await getBusinessDwld(filter);
      const csvData = data.data;

      if (csvData?.headers && csvData?.body) {
        const sortedBody = csvData.body.sort(
          (a, b) => (b.amount || 0) - (a.amount || 0)
        );

        // ✅ Custom headers for Business page (UI-like)
        const customHeaders = [
          { header: "Date", key: "createdAt" },
          { header: "Business Giver", key: "senderName" },
          { header: "Business Receiver", key: "memberName" },
          { header: "Request Type", key: "type" },
          { header: "Status", key: "status" },
        ];


        if (selectedTab !== 2) {
          customHeaders.push({ header: "Amount", key: "amount" });
        }
        if (selectedTab === 3) {
          customHeaders.push({ header: "Referral", key: "referralName" });
        }

        generatePDF(customHeaders, sortedBody, getReportTitle(), null, filters.chapterLabel);
        toast.success("PDF downloaded successfully!");
      } else {
        toast.error("Invalid data for PDF download");
      }
    } catch (error) {
      console.error("PDF download error:", error);
      toast.error("Failed to download PDF");
    } finally {
      setDownloadLoading(false);
      setDownloadPopupOpen(false);
    }
  };
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
          {singleAdmin?.role?.permissions?.includes(
            "activityManagement_modify"
          ) && (
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
            )}
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
            <StyledButton
              variant={"primary"}
              name={"Download"}
              onClick={() => setDownloadPopupOpen(true)}
            />
            <Tooltip title={hasActiveFilters ? "Active filters" : "Filter"}>
              <Badge
                color="error"
                variant="dot"
                invisible={!hasActiveFilters}
                sx={{
                  "& .MuiBadge-dot": {
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "#F58220",
                    right: 8,
                    top: 8,
                  },
                }}
                overlap="circular"
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
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
                  style={{
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: hasActiveFilters
                      ? "0 0 5px rgba(245, 130, 32, 0.5)"
                      : "none",
                    borderColor: hasActiveFilters
                      ? "#F58220"
                      : "rgba(0, 0, 0, 0.12)",
                  }}
                  className={hasActiveFilters ? "filter-active" : ""}
                >
                  <FilterIcon />
                </Box>
              </Badge>
            </Tooltip>
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
        <DownloadPopup
          open={downloadPopupOpen}
          onClose={() => setDownloadPopupOpen(false)}
          onDownloadExcel={handleDownloadExcel}
          onDownloadPDF={handleDownloadPDF}
          loading={downloadLoading}
        />
      </Box>
    </>
  );
};

export default BusinessPage;