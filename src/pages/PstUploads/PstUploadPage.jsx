import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { ReactComponent as CloseIcon } from "../../assets/icons/CloseIcon.svg";
import { ReactComponent as FilterIcon } from "../../assets/icons/FilterIcon.svg";
import StyledTable from "../../ui/StyledTable";
import StyledSearchbar from "../../ui/StyledSearchbar";
import { StyledButton } from "../../ui/StyledButton";
import StyledSelectField from "../../ui/StyledSelectField";
import { levelRoleUploadColumns } from "../../assets/json/TableData";
import { useListStore } from "../../store/listStore";
import { useAdminStore } from "../../store/adminStore";
import {
  deleteLevelRoleUpload,
  downloadLevelRoleUploadFile,
  getLevelRoleUploadById,
  getLevelRoleUploads,
} from "../../api/levelRoleUploadapi";
import DownloadPopup from "../../components/Member/DownloadPopup";
import { generateExcel } from "../../utils/generateExcel";
import { generatePDF } from "../../utils/generatePDF";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import moment from "moment";

const downloadColumns = [
  { header: "Title", key: "title" },
  { header: "Uploaded by", key: "uploadedByName" },
  { header: "Role", key: "roleLabel" },
  { header: "Level", key: "level" },
  { header: "Date", key: "createdAt" },
  { header: "File", key: "fileName" },
];

const roleOptions = [
  { value: "president", label: "President" },
  { value: "secretary", label: "Secretary" },
  { value: "treasurer", label: "Treasurer" },
];

const DetailField = ({ label, value }) => (
  <Grid item xs={12} sm={6}>
    <Typography variant="subtitle1" color="textSecondary" fontWeight="bold">
      {label}
    </Typography>
    <Typography variant="h6" color="textPrimary" sx={{ wordBreak: "break-word" }}>
      {value !== undefined && value !== null && String(value).trim() !== ""
        ? String(value)
        : "-"}
    </Typography>
  </Grid>
);

const getUploadDisplay = (item) => {
  if (!item) return null;
  const uploadedByName =
    item.uploadedByName ||
    item.uploadedBy?.name ||
    (typeof item.uploadedBy === "string" ? item.uploadedBy : "") ||
    "";
  const roleLabel =
    item.roleLabel ||
    (item.role
      ? item.role.charAt(0).toUpperCase() + item.role.slice(1)
      : "");
  const level =
    item.level ||
    [item.levelName, item.levelType].filter(Boolean).join(" ") ||
    "";
  return {
    ...item,
    uploadedByName,
    roleLabel,
    level,
    type: item.type || "",
    title: item.title || "",
    description: item.description || "",
  };
};

const PstUploadPage = () => {
  const { fetchLevelRoleUploads, lists } = useListStore();
  const { singleAdmin } = useAdminStore();
  const [pageNo, setPageNo] = useState(1);
  const [row, setRow] = useState(10);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [draftRole, setDraftRole] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [downloadPopupOpen, setDownloadPopupOpen] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloadRows, setDownloadRows] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(
    downloadColumns.map((column) => column.key)
  );

  const canModify = singleAdmin?.role?.permissions?.includes(
    "pstUploadManagement_modify"
  );

  useEffect(() => {
    const filter = {
      pageNo,
      limit: row,
      type: "report",
    };
    if (search) filter.search = search;
    if (role) filter.role = role;
    fetchLevelRoleUploads(filter);
  }, [pageNo, row, search, role, refresh]);

  const handleView = async (id) => {
    const fromList = lists?.find((item) => String(item?._id) === String(id));
    const initial = getUploadDisplay(fromList);

    // Open with list row first so details never stay blank
    if (initial) {
      setSelected(initial);
      setOpen(true);
    } else {
      setOpen(true);
    }

    try {
      const response = await getLevelRoleUploadById(id);
      const detail = getUploadDisplay(response?.data);
      if (detail?._id || detail?.title || detail?.type) {
        setSelected(getUploadDisplay({ ...initial, ...detail }));
      } else if (!initial) {
        toast.error(response?.message || "Failed to load upload details");
      }
    } catch (error) {
      if (!initial) {
        toast.error(
          error?.response?.data?.message || "Failed to load upload details"
        );
      }
    }
  };

  const handleDelete = async () => {
    if (!selected?._id) return;
    try {
      await deleteLevelRoleUpload(selected._id);
      toast.success("Upload deleted");
      setOpen(false);
      setSelected(null);
      setRefresh((value) => !value);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  };

  const handleFileDownload = async (item) => {
    const id = item?._id || selected?._id;
    const fileName = item?.fileName || selected?.fileName || "report";
    if (!id) return;
    try {
      const response = await downloadLevelRoleUploadFile(id);
      saveAs(new Blob([response.data]), fileName);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Download failed");
    }
  };

  const loadDownloadRows = async () => {
    const response = await getLevelRoleUploads({
      pageNo: 1,
      limit: 10000,
      type: "report",
      ...(search ? { search } : {}),
      ...(role ? { role } : {}),
    });
    const rows = (response?.data || []).map((item) => ({
      ...item,
      createdAt: item.createdAt
        ? moment(item.createdAt).format("DD-MM-YYYY")
        : "",
    }));
    setDownloadRows(rows);
    return rows;
  };

  const handleOpenDownloadPopup = async () => {
    setDownloadPopupOpen(true);
    setSelectedKeys(downloadColumns.map((column) => column.key));
    try {
      await loadDownloadRows();
    } catch (error) {
      toast.error("Failed to prepare download");
    }
  };

  const buildDownloadPayload = (rows) => {
    const headers = downloadColumns.filter((column) =>
      selectedKeys.includes(column.key)
    );
    const body = rows.map((row) =>
      selectedKeys.reduce((acc, key) => {
        acc[key] = row?.[key] ?? "";
        return acc;
      }, {})
    );
    return { headers, body };
  };

  const handleDownloadExcel = async () => {
    setDownloadLoading(true);
    try {
      const rows = downloadRows.length ? downloadRows : await loadDownloadRows();
      const { headers, body } = buildDownloadPayload(rows);
      if (!headers.length || !body.length) {
        toast.error("No data to download");
        return;
      }
      generateExcel(headers, body, "PST_Reports");
      toast.success("Excel downloaded successfully");
    } catch (error) {
      toast.error("Failed to download Excel");
    } finally {
      setDownloadLoading(false);
      setDownloadPopupOpen(false);
    }
  };

  const handleDownloadPDF = async () => {
    setDownloadLoading(true);
    try {
      const rows = downloadRows.length ? downloadRows : await loadDownloadRows();
      const { headers, body } = buildDownloadPayload(rows);
      if (!headers.length || !body.length) {
        toast.error("No data to download");
        return;
      }
      generatePDF(headers, body, "PST_Reports");
      toast.success("PDF downloaded successfully");
    } catch (error) {
      toast.error("Failed to download PDF");
    } finally {
      setDownloadLoading(false);
      setDownloadPopupOpen(false);
    }
  };

  const handleApplyFilter = () => {
    setRole(draftRole?.value || "");
    setPageNo(1);
    setFilterOpen(false);
  };

  const handleResetFilter = (event) => {
    event?.preventDefault?.();
    setDraftRole(null);
    setRole("");
    setPageNo(1);
    setFilterOpen(false);
  };

  return (
    <>
      <Box
        padding={"10px"}
        bgcolor={"#FFFFFF"}
        sx={{ height: { xs: "auto", sm: "70px" }, minHeight: "70px" }}
        display={"flex"}
        alignItems={"center"}
      >
        <Typography variant="h4" color={"textSecondary"}>
          PST Uploads
        </Typography>
      </Box>
      <Divider />
      <Box padding={"15px"}>
        <Stack
          direction={"row"}
          justifyContent={"end"}
          paddingBottom={"15px"}
          alignItems={"center"}
          sx={{
            flexWrap: { xs: "wrap", sm: "nowrap" },
            rowGap: { xs: 1, sm: 0 },
          }}
        >
          <Stack
            direction={"row"}
            spacing={2}
            alignItems={"center"}
            sx={{ width: { xs: "100%", sm: "auto" }, minWidth: 0 }}
          >
            <StyledSearchbar
              placeholder={"Search"}
              onchange={(event) => {
                setSearch(event.target.value);
                setPageNo(1);
              }}
            />
            <StyledButton
              variant={"primary"}
              name={"Download"}
              onClick={handleOpenDownloadPopup}
            />
            <Badge
              color="error"
              variant="dot"
              invisible={!role}
              sx={{
                flexShrink: 0,
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
                onClick={() => {
                  setDraftRole(
                    roleOptions.find((option) => option.value === role) || null
                  );
                  setFilterOpen(true);
                }}
                style={{
                  cursor: "pointer",
                  boxShadow: role ? "0 0 8px rgba(245, 130, 32, 0.6)" : "none",
                  borderColor: role ? "#F58220" : "rgba(0, 0, 0, 0.12)",
                }}
              >
                <FilterIcon />
              </Box>
            </Badge>
          </Stack>
        </Stack>
        <Box
          borderRadius={"16px"}
          bgcolor={"white"}
          p={1}
          border={"1px solid rgba(0, 0, 0, 0.12)"}
        >
          <StyledTable
            columns={levelRoleUploadColumns}
            menu
            onView={handleView}
            onFileDownload={handleFileDownload}
            pageNo={pageNo}
            setPageNo={setPageNo}
            rowPerSize={row}
            setRowPerSize={setRow}
          />
        </Box>
      </Box>

      <Dialog
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: { xs: 0, sm: "12px" },
            position: "absolute",
            top: 0,
            right: 0,
            height: "100vh",
            width: { xs: "100%", sm: "430px" },
            maxWidth: "100%",
          },
        }}
      >
        <DialogTitle sx={{ height: "auto", padding: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h3" color={"#4F4F4F"}>
              Filter
            </Typography>
            <Typography
              onClick={handleResetFilter}
              color="#E71D36"
              style={{ cursor: "pointer" }}
            >
              <CloseIcon />
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ padding: 0 }}>
          <Stack spacing={2} padding={2}>
            <Typography>Role</Typography>
            <StyledSelectField
              placeholder="Select role"
              options={roleOptions}
              value={draftRole}
              onChange={(selectedOption) => setDraftRole(selectedOption)}
            />
          </Stack>
        </DialogContent>
        <Stack direction={"row"} spacing={2} padding={2} justifyContent={"end"}>
          <StyledButton
            variant="secondary"
            name="Reset"
            onClick={handleResetFilter}
          />
          <StyledButton
            variant="primary"
            name="Apply"
            onClick={handleApplyFilter}
          />
        </Stack>
      </Dialog>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        PaperProps={{
          sx: { borderRadius: "12px" },
        }}
      >
        <DialogTitle
          sx={{
            height: "auto",
            padding: 3,
            bgcolor: "#f4f5f7",
            borderRadius: "12px",
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" color="textPrimary" fontWeight="bold">
              {selected?.title || "Upload Details"}
            </Typography>
            <Box onClick={() => setOpen(false)} style={{ cursor: "pointer" }}>
              <CloseIcon />
            </Box>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ height: "auto", padding: 3 }}>
          <Grid container spacing={3}>
            <DetailField label="Type" value={selected?.type} />
            <DetailField label="Uploaded by" value={selected?.uploadedByName} />
            <DetailField label="Role" value={selected?.roleLabel} />
            <DetailField label="Level" value={selected?.level} />
            <DetailField
              label="Date"
              value={
                selected?.createdAt
                  ? moment(selected.createdAt).format("DD-MM-YYYY")
                  : ""
              }
            />
            <DetailField label="Note" value={selected?.description} />
            {selected?.fileUrl ? (
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  fontWeight="bold"
                >
                  File
                </Typography>
                <Typography
                  component="button"
                  type="button"
                  onClick={() => handleFileDownload(selected)}
                  variant="h6"
                  sx={{
                    color: "#F58220",
                    textDecoration: "none",
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    font: "inherit",
                  }}
                >
                  {selected.fileName || "Download file"}
                </Typography>
              </Grid>
            ) : null}
          </Grid>
          <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={2}
            paddingTop={3}
          >
            {selected?.fileUrl ? (
              <StyledButton
                name="Download"
                variant="primary"
                onClick={() => handleFileDownload(selected)}
              />
            ) : null}
            {canModify && selected?._id ? (
              <StyledButton
                name="Delete"
                variant="secondary"
                onClick={handleDelete}
              />
            ) : null}
          </Stack>
        </DialogContent>
      </Dialog>
      <DownloadPopup
        open={downloadPopupOpen}
        onClose={() => setDownloadPopupOpen(false)}
        onDownloadExcel={handleDownloadExcel}
        onDownloadPDF={handleDownloadPDF}
        loading={downloadLoading}
        columns={downloadColumns}
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      />
    </>
  );
};

export default PstUploadPage;
