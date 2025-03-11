import React, { useEffect, useState } from "react";
import StyledTable from "../../ui/StyledTable";
import { Badge, Box, Stack, Typography } from "@mui/material";
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
  const [selectedTab, setSelectedTab] = useState("All");
  const [row, setRow] = useState(10);
  const [filters, setFilters] = useState({
    name: "",
    membershipId: "",
    status: "",
    installed: "",
  });
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
                  filters.status ||
                  (filters.installed !== undefined && filters.installed !== "")
                )
              }
              sx={{
                "& .MuiBadge-dot": {
                  width: "15px",
                  height: "15px",
                  borderRadius: "50%",
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
                style={{ cursor: "pointer" }}
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
    </>
  );
};

export default MemberList;
