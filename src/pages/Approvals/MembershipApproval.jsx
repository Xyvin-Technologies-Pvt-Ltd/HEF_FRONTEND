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
import RejectEntry from "../../components/Approve/RejectEntry";
import ApproveApproval from "../../components/Approve/ApproveApproval";
import { approvalColumns } from "../../assets/json/TableData";
import { useListStore } from "../../store/listStore";
import { toast } from "react-toastify";
import { useProductStore } from "../../store/productStore";
import { StyledButton } from "../../ui/StyledButton";
import ProductView from "../../components/Member/ProductView";

const MembershipApproval = () => {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [isChange, setIsChange] = useState(false);
  const { fetchApproval } = useListStore();
  const [selectedRows, setSelectedRows] = useState([]);
  const [approvalId, setApprovalId] = useState(null);
  const [search, setSearch] = useState("");
  const [view, setView] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [row, setRow] = useState(10);
  const { deleteProduct, fetchProductById, product } = useProductStore();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const handleChange = () => {
    setIsChange((prev) => !prev);
  };
  useEffect(() => {
    let filter = {};
    filter.pageNo = pageNo;
    filter.limit = row;
    if (search) {
      filter.search = search;
      setPageNo(1);
    }
    fetchApproval(filter);
  }, [isChange, pageNo, search, row]);
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
  const handleSelectionChange = (newSelectedIds) => {
    setSelectedRows(newSelectedIds);
  };
  const handleDelete = async () => {
    if (selectedRows.length > 0) {
      setDeleteDialogOpen(true);
    }
  };
  const handleView = async (id) => {
    await fetchProductById(id);
    setView(true);
  };
  const confirmDelete = async () => {
    setDeleteDialogOpen(false);
    try {
      await Promise.all(selectedRows?.map((id) => deleteProduct(id)));
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
          columns={approvalColumns}
          approve
          onView={handleView}
          onSelectionChange={handleSelectionChange}
          onModify={handleApprove}
          onAction={handleReject}
          pageNo={pageNo}
          setPageNo={setPageNo}
          rowPerSize={row}
          onDelete={handleDelete}
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
      <ProductView
        open={view}
        onClose={() => setView(false)}
        data={product}
        view
      />
    </>
  );
};

export default MembershipApproval;
