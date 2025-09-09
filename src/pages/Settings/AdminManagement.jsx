import { Box, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StyledButton } from "../../ui/StyledButton.jsx";
import StyledSearchbar from "../../ui/StyledSearchbar.jsx";
import StyledTable from "../../ui/StyledTable.jsx";
import { adminColumns } from "../../assets/json/TableData";
import { useListStore } from "../../store/listStore.js";
import { ReactComponent as AddIcon } from "../../assets/icons/AddIcon.svg";
import { toast } from "react-toastify";
import { useAdminStore } from "../../store/adminStore.js";
import PasswordResetDialog from "../../ui/PasswordResetDialog.jsx";

export default function AdminManagement() {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [isChange, setIsChange] = useState(false);
  const { getAdmins, lists } = useListStore();
  const [pageNo, setPageNo] = useState(1);
  const [row, setRow] = useState(10);
  const [search, setSearch] = useState("");
  const { deleteAdmins, resetAdminPassword } = useAdminStore();
  const { singleAdmin } = useAdminStore();
  
  // Password reset dialog state
  const [passwordResetDialog, setPasswordResetDialog] = useState({
    open: false,
    adminData: null,
  });
  const [resetLoading, setResetLoading] = useState(false);

  const handlePasswordReset = async (id) => {
    // Find the admin data from the current list
    const adminData = lists?.find(admin => admin._id === id);
    if (adminData) {
      setPasswordResetDialog({
        open: true,
        adminData,
      });
    }
  };

  const handlePasswordResetConfirm = async (adminId, sendEmail, customEmail) => {
    try {
      setResetLoading(true);
      const response = await resetAdminPassword(adminId, sendEmail, customEmail);
      
      let message;
      if (customEmail) {
        message = `Admin account updated successfully! New email: ${customEmail}, new password sent. Admin can now login with the new email and password.`;
      } else {
        message = "Password reset successfully. New password sent to admin's email.";
      }
      
      toast.success(message);
      setPasswordResetDialog({ open: false, adminData: null });
      setIsChange(!isChange); // Refresh the list
    } catch (error) {
      toast.error(error.message || "Password reset failed");
    } finally {
      setResetLoading(false);
    }
  };

  const handlePasswordResetClose = () => {
    setPasswordResetDialog({ open: false, adminData: null });
  };

  const handleSelectionChange = (newSelectedIds) => {
    setSelectedRows(newSelectedIds);
  };
  const handleDelete = async () => {
    if (selectedRows.length > 0) {
      try {
        await Promise.all(selectedRows?.map((id) => deleteAdmins(id)));
        toast.success("Deleted successfully");
        setIsChange(!isChange);
        setSelectedRows([]);
      } catch (error) {
        toast.error(error.message);
      }
    }
  };
  const handleRowDelete = async (id) => {
    try {
      await deleteAdmins(id);
      toast.success("Deleted successfully");
      setIsChange(!isChange);
    } catch (error) {
      toast.error(error.message);
    }
  };
  const handleEdit = (id) => {
    navigate(`/settings/add-admin`, {
      state: { adminId: id, isUpdate: true },
    });
  };
  useEffect(() => {
    let filter = {};
    filter.pageNo = pageNo;
    filter.limit = row;
    if (search) {
      filter.search = search;
    }
    getAdmins(filter);
  }, [isChange, pageNo, search, row, getAdmins]);
  return (
    <>
      {" "}
      <>
        <Grid container alignItems="center">
          <Grid item xs={6}></Grid>
          <Grid
            item
            xs={6}
            container
            display={"flex"}
            alignItems={"center"}
            justifyContent="flex-end"
            spacing={2}
          >
            <Grid item>
              <StyledSearchbar
                placeholder={"Search"}
                onchange={(e) => {
                  setSearch(e.target.value);
                  setPageNo(1);
                }}
              />
            </Grid>
            <Grid item></Grid>
            <Grid item>
              {singleAdmin?.role?.permissions?.includes(
                "adminManagement_modify"
              ) && (
                <StyledButton
                  name={
                    <>
                      <AddIcon /> Add Admin
                    </>
                  }
                  variant="primary"
                  onClick={() => navigate("/settings/add-admin")}
                />
              )}
            </Grid>
          </Grid>
        </Grid>

        <Grid marginTop={"15px"}>
          <Box
            borderRadius={"16px"}
            bgcolor={"white"}
            p={1}
            border={"1px solid rgba(0, 0, 0, 0.12)"}
          >
            {singleAdmin?.role?.permissions?.includes(
              "adminManagement_modify"
            ) ? (
              <StyledTable
                columns={adminColumns}
                // onView={handleEdit}
                onModify={handleEdit}
                pageNo={pageNo}
                setPageNo={setPageNo}
                rowPerSize={row}
                setRowPerSize={setRow}
                onSelectionChange={handleSelectionChange}
                onDelete={handleDelete}
                onDeleteRow={handleRowDelete}
                onPasswordReset={handlePasswordReset}
              />
            ) : (
              <StyledTable
                columns={adminColumns}
                onView={handleEdit}
                onModify={handleEdit}
                pageNo={pageNo}
                setPageNo={setPageNo}
                rowPerSize={row}
                setRowPerSize={setRow}
                onSelectionChange={handleSelectionChange}
                menu
                onDeleteRow={handleRowDelete}
                onPasswordReset={handlePasswordReset}
              />
            )}
          </Box>
        </Grid>
      </>
      
      {/* Password Reset Dialog */}
      <PasswordResetDialog
        open={passwordResetDialog.open}
        onClose={handlePasswordResetClose}
        onConfirm={handlePasswordResetConfirm}
        adminData={passwordResetDialog.adminData}
        loading={resetLoading}
      />
    </>
  );
}
