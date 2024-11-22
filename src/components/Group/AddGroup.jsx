import { Box, Grid, Typography, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import StyledInput from "../../ui/StyledInput";
import StyledSelectField from "../../ui/StyledSelectField";
import { StyledButton } from "../../ui/StyledButton";
import { useDropDownStore } from "../../store/dropDownStore";
import { useGroupStore } from "../../store/groupstore";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

const AddGroup = () => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const { user, fetchListofUser } = useDropDownStore();
  const location = useLocation();
  const { groupId, isUpdate } = location?.state || {};
  const [loading, setLoading] = useState(false);
  const { addGroups, fetchGroupById, singleGroup, updateGroup } =
    useGroupStore();
  const navigate = useNavigate();
  useEffect(() => {
    fetchListofUser();
  }, []);
  const option =
    user && Array.isArray(user)
      ? user?.map((i) => ({
          value: i?._id,
          label: i?.name,
        }))
      : [];
  useEffect(() => {
    if (isUpdate && groupId) {
      fetchGroupById(groupId);
    }
  }, [groupId, isUpdate, fetchGroupById]);
  useEffect(() => {
    if (singleGroup && isUpdate) {
      setValue("groupName", singleGroup?.groupName);
      setValue("groupInfo", singleGroup?.groupInfo);
      const participantOptions =
        singleGroup?.participants?.map((id) => {
          const matchedOption = option.find((opt) => opt?.value === id);
          return matchedOption;
        }) || [];
      setValue("participants", participantOptions);
    }
  }, [singleGroup, isUpdate, setValue]);
const handleClear = (event) => {
  event.preventDefault();
  reset();
  navigate(-1);
}
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const participants = data?.participants?.map((user) => user?.value);
      const formData = {
        participantIds: participants,
        groupName: data?.groupName,
        groupInfo: data?.groupInfo,
      };
      if (isUpdate && groupId) {
        await updateGroup(groupId, formData);
      } else {
        await addGroups(formData);
      }
      reset();
      navigate("/groups");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
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
              Group Name
            </Typography>
            <Controller
              name="groupName"
              control={control}
              defaultValue=""
              rules={{ required: "Group Name is required" }}
              render={({ field }) => (
                <>
                  <StyledInput placeholder="Enter the Group name" {...field} />
                  {errors.groupName && (
                    <span style={{ color: "red" }}>
                      {errors.groupName.message}
                    </span>
                  )}
                </>
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography
              sx={{ marginBottom: 1 }}
              variant="h6"
              color="textSecondary"
            >
              Group Information
            </Typography>
            <Controller
              name="groupInfo"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <>
                  <StyledInput placeholder="Type the content here" {...field} />
                  {errors.groupInfo && (
                    <span style={{ color: "red" }}>
                      {errors.groupInfo.message}
                    </span>
                  )}
                </>
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography
              sx={{ marginBottom: 1 }}
              variant="h6"
              color="textSecondary"
            >
              Participants
            </Typography>
            <Controller
              name="participants"
              control={control}
              defaultValue=""
              rules={{ required: "Group participants is required" }}
              render={({ field }) => (
                <>
                  <StyledSelectField
                    options={option}
                    isMulti
                    placeholder="Choose the Group participants"
                    {...field}
                  />
                  {errors.participants && (
                    <span style={{ color: "red" }}>
                      {errors.participants.message}
                    </span>
                  )}
                </>
              )}
            />
          </Grid>

          <Grid item xs={6}></Grid>
          <Grid item xs={6}>
            <Stack direction={"row"} spacing={2} justifyContent={"flex-end"}>
              <StyledButton name="Cancel" variant="secondary" onClick={(e) => handleClear(e)} />
              <StyledButton
                name={loading ? "Saving..." : "Save"}
                variant="primary"
                type="submit"
              />
            </Stack>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddGroup;
