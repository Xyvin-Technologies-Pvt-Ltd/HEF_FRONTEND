import { Box, Grid, Typography, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import StyledInput from "../../ui/StyledInput";
import { StyledButton } from "../../ui/StyledButton";
import styled from "styled-components";
import { useRoleStore } from "../../store/roleStore";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import StyledSelectField from "../../ui/StyledSelectField";

const CircleButton = styled.span`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #f58220;
  border-radius: 50%;
  cursor: pointer;
  margin-right: 10px;
  position: relative;
  background-color: transparent;
  &:before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: ${(props) => (props.selected ? "10px" : "0px")};
    height: ${(props) => (props.selected ? "10px" : "0px")};
    background-color: #f58220;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.2s ease, height 0.2s ease;
  }
  &:hover {
    background-color: rgba(255, 0, 0, 0.1);
  }
`;

// List of permissions
const permissionsList = [
  { id: "roleManagement", name: "Role Management" },
  { id: "adminManagement", name: "Admin Management" },
  { id: "memberManagement", name: "Member Management" },
  { id: "eventManagement", name: "Event Management" },
  { id: "collegeManagement", name: "College Management" },
  { id: "newsManagement", name: "News Management" },
  { id: "promotionManagement", name: "Promotion Management" },
  { id: "hierarchyManagement", name: "Hierarchy Management" },
  { id: "activityManagement", name: " Activity Management" },
  { id: "productManagement", name: "Product Management" },
];

const AddRole = () => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addRole, getRoleById, singleRole, updateRole } = useRoleStore();
  const location = useLocation();
  const { roleId, isUpdate } = location.state || {};
  const handleClear = (event) => {
    event.preventDefault();
    reset();
    setPermissions([]);
    navigate(-1);
  };
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const roleData = {
        roleName: data.roleName,
        description: data.description,
        ...(data?.status && { status: data?.status?.value }),

        permissions,
      };
      if (isUpdate) {
        await updateRole(roleId, roleData);
      } else {
        await addRole(roleData);
      }
      reset();
      setPermissions([]);
      navigate("/settings");
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isUpdate && roleId) {
      getRoleById(roleId);
    }
  }, [roleId, isUpdate]);
  useEffect(() => {
    if (singleRole && isUpdate) {
      setValue("roleName", singleRole.roleName);
      setPermissions(singleRole.permissions);
      setValue("description", singleRole.description);
      const selectedStatus = singleRole.status ? { value: true, label: "Active" } : { value: false, label: "Inactive" };
      setValue("status", selectedStatus);
    }
  }, [singleRole, isUpdate, setValue]);

  const handlePermissionChange = (permissionId, type) => {
    const permissionKey = `${permissionId}_${type}`;

    setPermissions((prev) =>
      prev.includes(permissionKey)
        ? prev.filter((p) => p !== permissionKey)
        : [...prev, permissionKey]
    );
  };

  const isPermissionSelected = (permissionId, type) => {
    return permissions?.includes(`${permissionId}_${type}`);
  };

  return (
    <Box
      sx={{ padding: 3 }}
      bgcolor={"white"}
      borderRadius={"12px"}
      border={"1px solid rgba(0, 0, 0, 0.12)"}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography
              sx={{ marginBottom: 1 }}
              variant="h6"
              color="textSecondary"
            >
              Role Name
            </Typography>
            <Controller
              name="roleName"
              control={control}
              defaultValue=""
              rules={{ required: "Role Name is required" }}
              render={({ field }) => (
                <>
                  <StyledInput
                    placeholder="Enter the name of the role"
                    {...field}
                  />
                  {errors.roleName && (
                    <Typography color="error">
                      {errors.roleName.message}
                    </Typography>
                  )}
                </>
              )}
            />
          </Grid>

          {/* Role Description */}
          <Grid item xs={12}>
            <Typography
              sx={{ marginBottom: 1 }}
              variant="h6"
              color="textSecondary"
            >
              Role Description
            </Typography>
            <Controller
              name="description"
              control={control}
              defaultValue=""
              rules={{ required: "Description is required" }}
              render={({ field }) => (
                <>
                  <StyledInput
                    placeholder="Enter the role description"
                    {...field}
                  />
                  {errors.description && (
                    <Typography color="error">
                      {errors.description.message}
                    </Typography>
                  )}
                </>
              )}
            />
          </Grid>

          {/* Select Access */}
          <Grid item xs={12}>
            <Typography variant="h6" color="textSecondary">
              Select access
            </Typography>
            <Grid container sx={{ mt: 4 }} spacing={2}>
              <Grid item xs={4}>
                <Typography variant="h6">Permissions</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography
                  variant="h6"
                  display={"flex"}
                  justifyContent={"center"}
                >
                  View
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography
                  variant="h6"
                  display={"flex"}
                  justifyContent={"center"}
                >
                  Modify
                </Typography>
              </Grid>

              {permissionsList.map((permission) => (
                <Grid
                  container
                  key={permission.id}
                  alignItems="center"
                  sx={{ mt: 2 }}
                  p={1}
                >
                  <Grid item xs={4} p={1}>
                    <Typography variant="h6" color="textSecondary">
                      {permission.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} display={"flex"} justifyContent={"center"}>
                    <CircleButton
                      selected={isPermissionSelected(permission.id, "view")}
                      onClick={() =>
                        handlePermissionChange(permission.id, "view")
                      }
                    />
                  </Grid>
                  <Grid item xs={4} display={"flex"} justifyContent={"center"}>
                    <CircleButton
                      selected={isPermissionSelected(permission.id, "modify")}
                      onClick={() =>
                        handlePermissionChange(permission.id, "modify")
                      }
                    />
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Typography
              sx={{ marginBottom: 1 }}
              variant="h6"
              color="textSecondary"
            >
              Status
            </Typography>
            <Controller
              name="status"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <>
                  <StyledSelectField
                    options={[
                      { value: true, label: "Active" },
                      { value: false, label: "Inactive" },
                    ]}
                    placeholder="Choose the Status"
                    {...field}
                  />
                </>
              )}
            />
          </Grid>
          {/* Buttons */}
          <Grid item xs={6}></Grid>
          <Grid item xs={6}>
            <Stack direction={"row"} spacing={2} justifyContent={"flex-end"}>
              <StyledButton
                name="Cancel"
                variant="secondary"
                onClick={(e) => handleClear(e)}
                disabled={loading}
              />
              <StyledButton
                name={loading ? "Saving..." : "Save"}
                variant="primary"
                type="submit"
                disabled={loading}
              />
            </Stack>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddRole;
