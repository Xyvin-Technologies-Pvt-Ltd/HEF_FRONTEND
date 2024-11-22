import { Box, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import StyledSearchbar from "../../ui/StyledSearchbar";
import StyledTable from "../../ui/StyledTable";
import RejectEntry from "../../components/Approve/RejectEntry";
import ApproveApproval from "../../components/Approve/ApproveApproval";
import { approvalColumns } from "../../assets/json/TableData";
import { useListStore } from "../../store/listStore";

const MembershipApproval = () => {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [isChange, setIsChange] = useState(false);
  const { fetchApproval } = useListStore();
  const [approvalId, setApprovalId] = useState(null);
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const[row, setRow] = useState(10)

  const handleChange = () => {
    setIsChange((prev) => !prev);
  };
  useEffect(() => {
    let filter = {};
    filter.pageNo = pageNo;
    filter.limit = row
    if (search) {
      filter.search = search;
      setPageNo(1);
    }
    fetchApproval(filter);
  }, [isChange, pageNo, search,row]);
  const handleReject = (id) => {
    setApprovalId(id);
    setRejectOpen(true);
  };
  const handleCloseReject = () => {
    setRejectOpen(false);
  };
  const handleApprove = (id) => {
    setApprovalId(id);
    setApproveOpen(true);
  };
  const handleCloseApprove = () => {
    setApproveOpen(false);
  };

  return (
    <>
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
          columns={approvalColumns}
          payment
          onModify={handleApprove}
          onAction={handleReject}
          pageNo={pageNo}
          setPageNo={setPageNo}
          rowPerSize={row}
          setRowPerSize={setRow}
        />
        <RejectEntry
          open={rejectOpen}
          onClose={handleCloseReject}
          id={approvalId}
          setIsChange={handleChange}
        />
        <ApproveApproval
          open={approveOpen}
          onClose={handleCloseApprove}
          id={approvalId}
          setIsChange={handleChange}
        />
      </Box>
    </>
  );
};

export default MembershipApproval;
