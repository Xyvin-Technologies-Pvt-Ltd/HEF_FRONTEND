import React, { useEffect, useState } from "react";
import StyledTable from "../../ui/StyledTable";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import StyledSearchbar from "../../ui/StyledSearchbar";
import { paymentColumns } from "../../assets/json/TableData";
import { useListStore } from "../../store/listStore";
import { StyledButton } from "../../ui/StyledButton";
import ParentSubscription from "./ParenrSubscription";
import ParentSub from "./ParentSub";
import { usePaymentStore } from "../../store/paymentStore";
import PaymentView from "./PaymentView";
import { toast } from "react-toastify";

const MemberPage = () => {
  const storedTab = localStorage.getItem("paymentTab");
  const { fetchPayment } = useListStore();
  const [pageNo, setPageNo] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [row, setRow] = useState(10);
  const [selectedTab, setSelectedTab] = useState(storedTab ? Number(storedTab) : 0);
  const [open, setOpen] = useState(false);
  const [isChange, setIsChange] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState("");
  const [paymentId, setPaymentId] = useState(null);
  const [openView, setOpenView] = useState(false);
  const { patchPayments, fetchSinglePayment, singlePayment, deletePayments } =
    usePaymentStore();
  const handleTabChange = (event, newValue) => {
    localStorage.setItem("paymentTab", newValue);
    setSelectedTab(newValue);
  };
  const handleParent = () => {
    setOpen(true);
  };
  const handleApprove = async (id) => {
    setPaymentId(id);
    setConfirmationAction("approve");
    setConfirmOpen(true);
  };

  const handleReject = async (id) => {
    setPaymentId(id);
    setConfirmationAction("reject");
    setConfirmOpen(true);
  };
  const confirmAction = async () => {
    if (confirmationAction === "approve") {
      await patchPayments(paymentId, { status: "accepted" });
    } else if (confirmationAction === "reject") {
      await patchPayments(paymentId, { status: "cancelled" });
    }
    setConfirmOpen(false);
    setIsChange(!isChange);
  };
  const handleView = async (id) => {
    await fetchSinglePayment(id);
    setOpenView(true);
  };
  const handleSelectionChange = (newSelectedIds) => {
    setSelectedRows(newSelectedIds);
  };
  const handleDelete = async () => {
    if (selectedRows.length > 0) {
      try {
        await Promise.all(selectedRows?.map((id) => deletePayments(id)));
        toast.success("Payments deleted successfully");
        setIsChange(!isChange);
        setSelectedRows([]);
      } catch {
        toast.error(error.message);
      }
    }
  };
  useEffect(() => {
    if (selectedTab === 3) return; 
  
    let filter = {
      pageNo,
      limit: row,
    };
  
    if (search) {
      filter.search = search;
      setPageNo(1);
    }
  
    if (selectedTab === 1) {
      filter.status = "active";
    } else if (selectedTab === 2) {
      filter.status = "pending";
    }
  
    fetchPayment(filter);
  }, [pageNo, search, row, selectedTab !== 3 ? selectedTab : null, isChange]); 
  

  return (
    <>
      <Stack
        direction={"row"}
        padding={"10px"}
        bgcolor={"#fff"}
        height={"70px"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Stack>
          <Typography variant="h4" color="textSecondary">
            Payments
          </Typography>
        </Stack>
        <Stack direction={"row"} spacing={2}>
          {selectedTab === 3 && (
            <StyledButton name="Add" variant="primary" onClick={handleParent} />
          )}
        </Stack>
      </Stack>
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
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
        <Tab label="All Payments" />
        <Tab label="Active Payments" />
        <Tab label="Pending Payments" />
        <Tab label="Parent Subscription" />
      </Tabs>
      <Divider />
      {(selectedTab === 0 || selectedTab === 1 || selectedTab === 2) && (
        <Box padding={"15px"}>
          <Box
            borderRadius={"16px"}
            bgcolor={"white"}
            p={1}
            border={"1px solid rgba(0, 0, 0, 0.12)"}
          >
            <StyledTable
              columns={paymentColumns}
              pageNo={pageNo}
              payment
              onSelectionChange={handleSelectionChange}
              onDelete={handleDelete}
              setPageNo={setPageNo}
              rowPerSize={row}
              setRowPerSize={setRow}
              onModify={handleApprove}
              onView={handleView}
              onAction={handleReject}
            />
          </Box>
        </Box>
      )}
      {selectedTab === 3 && (
        <Box padding="15px" marginBottom={4}>
          <ParentSubscription />
        </Box>
      )}
      <ParentSub open={open} onClose={() => setOpen(false)} />
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        aria-labelledby="confirm-dialog-title"
      >
        <DialogTitle id="confirm-dialog-title">
          {confirmationAction === "approve"
            ? "Confirm Approval"
            : "Confirm Rejection"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to{" "}
            {confirmationAction === "approve" ? "approve" : "reject"} this
            payment?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <StyledButton
            name="Cancel"
            variant="secondary"
            onClick={() => setConfirmOpen(false)}
          />
          <StyledButton
            name={confirmationAction === "approve" ? "Approve" : "Reject"}
            variant="primary"
            onClick={confirmAction}
          />
        </DialogActions>
      </Dialog>
      <PaymentView
        open={openView}
        onClose={() => setOpenView(false)}
        data={singlePayment}
      />
    </>
  );
};

export default MemberPage;
