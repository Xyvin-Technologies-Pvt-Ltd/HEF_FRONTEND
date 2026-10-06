import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Grid,
  Stack,
  Tab,
  Tabs,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
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
import { generatePDF } from "../../utils/generatePDF"
import { useAdminStore } from "../../store/adminStore";
import DownloadPopup from "../../components/Member/DownloadPopup";
const tabMapping = {
  state: 0,
  zone: 1,
  district: 2,
  chapter: 3,
};
const LevelPage = () => {
  const { fetchLevels, lists } = useListStore();
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
  const { singleAdmin } = useAdminStore();
  const [downloadPopupOpen, setDownloadPopupOpen] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [pstModalOpen, setPstModalOpen] = useState(false);
  const [selectedLevelForPst, setSelectedLevelForPst] = useState(null);

  const handleView = (id) => {
    const found = lists?.find((item) => item._id === id);
    if (found) {
      setSelectedLevelForPst(found);
      setPstModalOpen(true);
    }
  };
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
    setPageNo(1);
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
  const handleDownloadExcel = async () => {
    setDownloadLoading(true);
    try {
      let filter = {};
      if (search) filter.search = search;
      let type;
      if (selectedTab === 0) type = "state";
      else if (selectedTab === 1) type = "zone";
      else if (selectedTab === 2) type = "district";
      else if (selectedTab === 3) type = "chapter";

      filter.type = type;

      console.log("Excel Download - Filters:", filter);

      const data = await getchapterList(filter);
      console.log("Excel Download - API Response:", data);

      const csvData = data?.data;
      if (csvData && csvData.headers && csvData.body) {
        generateExcel(csvData.headers, csvData.body, "Levels");
        toast.success("Excel file downloaded successfully!");
      } else {
        console.error("Error: Missing headers or data in downloaded content", {
          csvData,
          hasHeaders: !!csvData?.headers,
          hasBody: !!csvData?.body,
        });
        toast.error("Error downloading Excel file - Invalid data");
      }
    } catch (error) {
      console.error("Error downloading Excel:", error);
      toast.error(`Error downloading Excel file: ${error.message}`);
    } finally {
      setDownloadLoading(false);
      setDownloadPopupOpen(false);
    }
  };
  const handleDownloadPDF = async () => {
    setDownloadLoading(true);
    try {
      let filter = {};
      if (search) filter.search = search;
      let type;
      if (selectedTab === 0) type = "state";
      else if (selectedTab === 1) type = "zone";
      else if (selectedTab === 2) type = "district";
      else if (selectedTab === 3) type = "chapter";

      filter.type = type;

      console.log("PDF Download - Filters:", filter);

      const data = await getchapterList(filter); 
      console.log("PDF Download - API Response:", data);

      const csvData = data?.data;
      if (csvData && csvData.headers && csvData.body) {
        generatePDF(csvData.headers, csvData.body, "Levels");
        toast.success("PDF file downloaded successfully!");
      } else {
        console.error("Error: Missing headers or data in downloaded content", {
          csvData,
          hasHeaders: !!csvData?.headers,
          hasBody: !!csvData?.body,
        });
        toast.error("Error downloading PDF file - Invalid data");
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error(`Error downloading PDF file: ${error.message}`);
    } finally {
      setDownloadLoading(false);
      setDownloadPopupOpen(false);
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
          {singleAdmin?.role?.permissions?.includes(
            "hierarchyManagement_modify"
          ) && (
              <StyledButton
                name={
                  <>
                    <AddIcon /> Add Level
                  </>
                }
                variant="primary"
                onClick={() => navigate("/levels/level")}
              />
            )}
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
              onchange={(e) => {
                setSearch(e.target.value);
                setPageNo(1);
              }}
            />
            {selectedTab === 3 && (
              <StyledButton
                variant={"primary"}
                name={"Download"}
                onClick={() => setDownloadPopupOpen(true)}
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
          {singleAdmin?.role?.permissions?.includes(
            "hierarchyManagement_modify"
          ) ? (
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
              onView={handleView}
            />
          ) : (
            <StyledTable
              columns={levelColumns}
              onSelectionChange={handleSelectionChange}
              menu
              onDeleteRow={handleRowDelete}
              pageNo={pageNo}
              setPageNo={setPageNo}
              rowPerSize={row}
              setRowPerSize={setRow}
              onModify={handleEdit}
              onView={handleView}
            />
          )}
          <DownloadPopup
            open={downloadPopupOpen}
            onClose={() => setDownloadPopupOpen(false)}
            onDownloadExcel={handleDownloadExcel}
            onDownloadPDF={handleDownloadPDF}
            loading={downloadLoading}
          />
          <Dialog
            open={pstModalOpen}
            onClose={() => setPstModalOpen(false)}
            fullWidth
            maxWidth="sm"
            PaperProps={{
              sx: { borderRadius: "16px", p: 1 },
            }}
          >
            <DialogTitle
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                pb: 1,
              }}
            >
              <Box>
                <Typography variant="h6" fontWeight={600} color="primary">
                  PST Members
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  {selectedLevelForPst?.name} ({selectedLevelForPst?.category ? selectedLevelForPst.category.charAt(0).toUpperCase() + selectedLevelForPst.category.slice(1) : "Level"})
                </Typography>
              </Box>
              <IconButton onClick={() => setPstModalOpen(false)} size="small">
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ pt: 1 }}>
              {selectedLevelForPst?.admins &&
              selectedLevelForPst.admins.length > 0 ? (
                <Stack spacing={2} sx={{ mt: 1 }}>
                  {selectedLevelForPst.admins.map((admin, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        p: 2,
                        borderRadius: "12px",
                        border: "1px solid rgba(0, 0, 0, 0.08)",
                        bgcolor: "#fafafa",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                          <Typography
                            variant="caption"
                            sx={{
                              bgcolor: "#FFF0E6",
                              color: "#F58220",
                              fontWeight: 700,
                              px: 1,
                              py: 0.25,
                              borderRadius: "4px",
                              textTransform: "capitalize",
                            }}
                          >
                            {admin?.role}
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            color="textPrimary"
                          >
                            {admin?.user?.name || (typeof admin?.user === "string" ? admin?.user : "N/A")}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="textSecondary">
                          {admin?.user?.phone ? `Phone: ${admin?.user?.phone}` : ""}
                          {admin?.user?.phone && admin?.user?.email ? " • " : ""}
                          {admin?.user?.email ? `Email: ${admin?.user?.email}` : ""}
                        </Typography>
                        {admin?.user?.memberId && (
                          <Typography
                            variant="caption"
                            color="textSecondary"
                            display="block"
                          >
                            Member ID: {admin?.user?.memberId}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Typography
                  color="textSecondary"
                  sx={{ py: 3, textAlign: "center" }}
                >
                  No PST members assigned to this level yet.
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <StyledButton
                name="Close"
                variant="secondary"
                onClick={() => setPstModalOpen(false)}
              />
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </>
  );
};

export default LevelPage;
