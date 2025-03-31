import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import StyledSearchbar from "../../ui/StyledSearchbar";
import StyledTable from "../../ui/StyledTable";
import { approvalColumns, feedColumns } from "../../assets/json/TableData";
import { useFeedStore } from "../../store/feedStore";
import FeedApproval from "../../components/Approve/FeedApproval";
import FeedReject from "../../components/Approve/FeedReject";
import { useListStore } from "../../store/listStore";
import { toast } from "react-toastify";
import { StyledButton } from "../../ui/StyledButton";
import FeedView from "../../components/Approve/FeedView";

const FeedList = () => {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [isChange, setIsChange] = useState(false);
  const { fetchFeed } = useListStore();
  const [view, setView] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [row, setRow] = useState(10);
  const { deleteFeeds } = useFeedStore();
  const { fetchFeedById, feeds } = useFeedStore();
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
  }, [isChange, pageNo, search, row]);
  const handleSelectionChange = (newSelectedIds) => {
    setSelectedRows(newSelectedIds);
  };
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
  const handleDelete = () => {
    if (selectedRows.length > 0) {
      setDeleteDialogOpen(true);
    }
  };
  const handleView = async (id) => {
    await fetchFeedById(id);
    setView(true);
  };
  const confirmDelete = async () => {
    setDeleteDialogOpen(false);
    try {
      await Promise.all(selectedRows.map((id) => deleteFeeds(id)));
      toast.success("Deleted successfully");
      setIsChange(!isChange);
      setSelectedRows([]);
    } catch (error) {
      toast.error(error.message);
    }
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
          onSelectionChange={handleSelectionChange}
          setPageNo={setPageNo}
          approve
          onView={handleView}
          onDelete={handleDelete}
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
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          PaperProps={{
            sx: { borderRadius: "12px", padding: 2 },
          }}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent sx={{ height: "auto", width: "330px" }}>
            <DialogContentText>
              Are you sure you want to delete the selected items?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <StyledButton
              variant="secondary"
              name="Cancel"
              onClick={(event) => {
                event.preventDefault();
                setDeleteDialogOpen(false);
              }}
            />
            <StyledButton
              variant="primary"
              name={"Delete"}
              onClick={(event) => {
                event.preventDefault();
                confirmDelete();
              }}
            />
          </DialogActions>
        </Dialog>
      </Box>
      <FeedView open={view} onClose={() => setView(false)} data={feeds} />
    </>
  );
};

export default FeedList;
