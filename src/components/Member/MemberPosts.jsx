import React, { useEffect, useState } from "react";
import StyledTable from "../../ui/StyledTable";
import StyledSearchbar from "../../ui/StyledSearchbar";
import { Box, Stack } from "@mui/material";
import { useFeedStore } from "../../store/feedStore";
import { postColumns } from "../../assets/json/TableData";
import FeedApproval from "../Approve/FeedApproval";
import FeedReject from "../Approve/FeedReject";
import { useListStore } from "../../store/listStore";

const MemberPosts = ({ id }) => {
  const { fetchFeedByUser } = useListStore();
  const [pageNo, setPageNo] = useState(1);
  const[row,setRow] = useState(10)
  const [rejectOpen, setRejectOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [isChange, setIsChange] = useState(false);
  const [approvalId, setApprovalId] = useState(null);
  useEffect(() => {
    let filter = {};

    filter.pageNo = pageNo;
    filter.limit = row
    fetchFeedByUser(id, filter);
  }, [isChange, pageNo,row]);

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
      <>
        <Stack
          direction={"row"}
          justifyContent={"end"}
          paddingBottom={"15px"}
          alignItems={"center"}
        >
          <Stack direction={"row"} spacing={2}>
            <StyledSearchbar />
          </Stack>
        </Stack>{" "}
        <Box
          borderRadius={"16px"}
          bgcolor={"white"}
          p={1}
          border={"1px solid rgba(0, 0, 0, 0.12)"}
        >
          <StyledTable
            columns={postColumns}
            payment
            onAction={handleReject}
            onModify={handleApprove}
            pageNo={pageNo}
            setPageNo={setPageNo}
            rowPerSize={row}
            setRowPerSize={setRow}
          />{" "}
          <FeedApproval
            open={approveOpen}
            onClose={handleCloseApprove}
            id={approvalId}
            setIsChange={setIsChange}
          />
          <FeedReject
            open={rejectOpen}
            onClose={handleCloseReject}
            id={approvalId}
            setIsChange={setIsChange}
          />
        </Box>
      </>
    </>
  );
};

export default MemberPosts;
