import { Box, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import StyledSearchbar from "../../ui/StyledSearchbar";
import StyledTable from "../../ui/StyledTable";
import { approvalColumns, feedColumns } from "../../assets/json/TableData";
import { useFeedStore } from "../../store/feedStore";
import FeedApproval from "../../components/Approve/FeedApproval";
import FeedReject from "../../components/Approve/FeedReject";
import { useListStore } from "../../store/listStore";

const BusinessState = () => {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [isChange, setIsChange] = useState(false);
  const { fetchFeed } = useListStore();
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [row, setRow] = useState(10);
  const [approvalId, setApprovalId] = useState(null);
  useEffect(() => {
    let filter = {};
    filter.pageNo = pageNo;
    filter.limit = row;
    if (search) {
      filter.search = search;
      setPageNo(1);
    }
    fetchFeed(filter);
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
          columns={feedColumns}
          pageNo={pageNo}
          setPageNo={setPageNo}
          payment
          onModify={handleApprove}
          onAction={handleReject}
          rowPerSize={row}
          setRowPerSize={setRow}
        />
        <FeedReject
          open={rejectOpen}
          onClose={handleCloseReject}
          id={approvalId}
          setIsChange={setIsChange}
        />
        <FeedApproval
          open={approveOpen}
          onClose={handleCloseApprove}
          id={approvalId}
          setIsChange={setIsChange}
        />
      </Box>
    </>
  );
};

export default BusinessState;
