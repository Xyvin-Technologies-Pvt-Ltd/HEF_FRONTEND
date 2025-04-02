import React, { useEffect, useState } from "react";
import StyledTable from "../../ui/StyledTable";
import {
  Badge,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Typography,
} from "@mui/material";
import { StyledButton } from "../../ui/StyledButton";
import StyledSearchbar from "../../ui/StyledSearchbar";
import { memberColumns, userData } from "../../assets/json/TableData";
import { useNavigate } from "react-router-dom";
import DeleteProfile from "../../components/Member/DeleteProfile";
import { useListStore } from "../../store/listStore";
import SuspendProfile from "../../components/Member/SuspendProfile";
import { ReactComponent as FilterIcon } from "../../assets/icons/FilterIcon.svg";
import MemberFilter from "../../components/Member/MemberFilter";
import { getDwld } from "../../api/adminapi";
import { generateExcel } from "../../utils/generateExcel";
import { toast } from "react-toastify";
import { useMemberStore } from "../../store/Memberstore";
const MemberList = () => {
  const navigate = useNavigate();
  const { fetchMember } = useListStore();
  const [search, setSearch] = useState("");
  const [isChange, setIschange] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [memberId, setMemberId] = useState(null);
  const [pageNo, setPageNo] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const { deleteMembers } = useMemberStore();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("All");
  const [row, setRow] = useState(10);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    membershipId: "",
    status: "",
    installed: "",
    from: "",
    to: "",
    chapter: "",
  });
  const handleSelectionChange = (newSelectedIds) => {
    setSelectedRows(newSelectedIds);
  };
  const handleDelete = () => {
    if (selectedRows.length > 0) {
      setConfirmDeleteOpen(true);
    }
  };

  const confirmDelete = async () => {
    setConfirmDeleteOpen(false);
    setLoading(true);
    if (selectedRows.length > 0) {
      try {
        await Promise.all(selectedRows?.map((id) => deleteMembers(id)));
        toast.success("Deleted successfully");
        setIschange(!isChange);
        setSelectedRows([]);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    let filter = {};
    filter.pageNo = pageNo;
    if (search) {
      filter.search = search;
      setPageNo(1);
    }
    filter.limit = row;
    if (filters.name) filter.name = filters.name;
    if (filters.membershipId) filter.membershipId = filters.membershipId;
    if (filters.from) filter.from = filters.from;
    if (filters.to) filter.to = filters.to;
    if (filters.chapter) filter.chapter = filters.chapter;
    if (filters.status) filter.status = filters.status;
    if (typeof filters.installed === "boolean") {
      filter.installed = filters.installed;
    }
    fetchMember(filter);
  }, [isChange, pageNo, search, row, filters]);
  const handleDownload = async () => {
    try {
      let filter = {};

      if (filters.name) filter.name = filters.name;
      if (filters.membershipId) filter.membershipId = filters.membershipId;
      if (filters.status) filter.status = filters.status;
      if (filters.from) filter.from = filters.from;
      if (filters.to) filter.to = filters.to;
      if (filters.chapter) filter.chapter = filters.chapter;
      if (typeof filters.installed === "boolean") {
        filter.installed = filters.installed;
      }
      const data = await getDwld(filter);
      const csvData = data.data;
      if (csvData && csvData.headers && csvData.body) {
        generateExcel(csvData.headers, csvData.body, "Members");
      } else {
        console.error(
          "Error: Missing headers or data in the downloaded content"
        );
      }
    } catch (error) {
      console.error("Error downloading users:", error);
    }
  };

  const handleRowDelete = (id) => {
    setMemberId(id);
    setDeleteOpen(true);
  };
  const handleCloseDelete = () => {
    setMemberId(null);
    setDeleteOpen(false);
  };
  const handleSuspend = (id) => {
    setMemberId(id);
    setSuspendOpen(true);
  };
  const handleCloseSuspend = () => {
    setMemberId(null);
    setSuspendOpen(false);
  };
  const handleChange = () => {
    setIschange(!isChange);
  };
  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };
  return (
    <>
      <Box padding={"15px"}>
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
            />{" "}
            <StyledButton
              variant={"primary"}
              name={"Download"}
              onClick={handleDownload}
            />
            <Badge
              color="error"
              variant="dot"
              invisible={
                !(
                  filters.name ||
                  filters.membershipId ||
                  filters.from ||
                  filters.to ||
                  filters.status ||
                  filters.chapter ||
                  (filters.installed !== undefined && filters.installed !== "")
                )
              }
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
                  boxShadow:
                    filters.name ||
                    filters.membershipId ||
                    filters.from ||
                    filters.to ||
                    filters.status ||
                    filters.chapter ||
                    (filters.installed !== undefined &&
                      filters.installed !== "")
                      ? "0 0 8px rgba(245, 130, 32, 0.6)"
                      : "none",
                  borderColor:
                    filters.name ||
                    filters.membershipId ||
                    filters.from ||
                    filters.to ||
                    filters.status ||
                    filters.chapter ||
                    (filters.installed !== undefined &&
                      filters.installed !== "")
                      ? "#F58220"
                      : "rgba(0, 0, 0, 0.12)",
                }}
              >
                {" "}
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
            columns={memberColumns}
            member
            onDeleteRow={handleRowDelete}
            onView={(id) => {
              navigate(`/members/${id}`);
            }}
            pageNo={pageNo}
            setPageNo={setPageNo}
            onModify={(id) => {
              navigate(`/members/member`, {
                state: { memberId: id, isUpdate: true },
              });
            }}
            onDelete={handleDelete}
            onSelectionChange={handleSelectionChange}
            onAction={handleSuspend}
            rowPerSize={row}
            setRowPerSize={setRow}
          />
          <DeleteProfile
            open={deleteOpen}
            onClose={handleCloseDelete}
            onChange={handleChange}
            id={memberId}
          />
          <SuspendProfile
            open={suspendOpen}
            onClose={handleCloseSuspend}
            onChange={handleChange}
            id={memberId}
          />
        </Box>
        <MemberFilter
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          onApply={(filters) => setFilters(filters)}
        />
      </Box>
      <Dialog
        open={confirmDeleteOpen}
        PaperProps={{
          sx: { borderRadius: "12px", padding: 2 },
        }}
        onClose={() => setConfirmDeleteOpen(false)}
      >
        <DialogContent sx={{ height: "auto", width: "330px" }}>
          <Stack
            // direction={"row"}
            spacing={2}
            paddingTop={2}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Typography
              variant="h3"
              color={"textTertiary"}
              textAlign={"center"}
            >
              Are you sure you want to delete the profile ?{" "}
            </Typography>
            <Typography
              variant="h7"
              color={"textSecondary"}
              textAlign={"center"}
            >
              {/* Lorem ipsum dolor sit amet consectetur. Eget in ac urna
                   suspendisse.{" "} */}
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <StyledButton
            name="Cancel"
            variant={"secondary"}
            disabled={loading}
            onClick={() => setConfirmDeleteOpen(false)}
          />
          <StyledButton
            name={loading ? "Deleting..." : "Confirm"}
            variant="primary"
            disabled={loading}
            onClick={confirmDelete}
          />
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MemberList;
