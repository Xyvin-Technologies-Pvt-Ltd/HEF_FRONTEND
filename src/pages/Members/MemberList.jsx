import React, { useEffect, useState } from "react";
import StyledTable from "../../ui/StyledTable";
import { Box, Stack, Typography } from "@mui/material";
import { StyledButton } from "../../ui/StyledButton";
import StyledSearchbar from "../../ui/StyledSearchbar";

import { ReactComponent as AddIcon } from "../../assets/icons/AddIcon.svg";
import { memberColumns, userData } from "../../assets/json/TableData";
import { useNavigate } from "react-router-dom";
import DeleteProfile from "../../components/Member/DeleteProfile";
import { useListStore } from "../../store/listStore";
import { getMember } from "../../api/memberapi";
import { generateExcel } from "../../utils/generateExcel";
import SuspendProfile from "../../components/Member/SuspendProfile";

const MemberList = () => {
  const navigate = useNavigate();
  const { fetchMember } = useListStore();
  const [search, setSearch] = useState("");
  const [isChange, setIschange] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [memberId, setMemberId] = useState(null);
  const [pageNo, setPageNo] = useState(1);
  const [selectedTab, setSelectedTab] = useState("All");
  const [row, setRow] = useState(10);
  useEffect(() => {
    let filter = {};
    filter.pageNo = pageNo;
    if (search) {
      filter.search = search;
      setPageNo(1);
    }
    filter.limit = row;
    fetchMember(filter);
  }, [isChange, pageNo, search, row]);

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
          justifyContent={"space-between"}
          paddingBottom={"15px"}
          alignItems={"center"}
        >
          <Stack direction={"row"} spacing={1}>
            <StyledButton
              name="All"
              variant={selectedTab === "All" ? "primary" : "third"}
              onClick={() => handleTabChange("All")}
            />
            <StyledButton
              name="State PST"
              variant={selectedTab === "Latest" ? "primary" : "third"}
              onClick={() => handleTabChange("Latest")}
            />
            <StyledButton
              name="Zone PST"
              variant={selectedTab === "Trending" ? "primary" : "third"}
              onClick={() => handleTabChange("Trending")}
            />
            <StyledButton
              name="District PST"
              variant={selectedTab === "Trending" ? "primary" : "third"}
              onClick={() => handleTabChange("Trending")}
            />{" "}
            <StyledButton
              name="Chapter PST"
              variant={selectedTab === "Trending" ? "primary" : "third"}
              onClick={() => handleTabChange("Trending")}
            />
          </Stack>
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
      </Box>
    </>
  );
};

export default MemberList;
