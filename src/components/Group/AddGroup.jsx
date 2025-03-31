import { Box, Grid, Typography, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import StyledInput from "../../ui/StyledInput";
import StyledSelectField from "../../ui/StyledSelectField";
import { StyledButton } from "../../ui/StyledButton";
import { useDropDownStore } from "../../store/dropDownStore";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { useGroupStore } from "../../store/groupStore";
import { getAllLevel, getLevels } from "../../api/hierarchyapi";

const AddGroup = () => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const location = useLocation();
  const { groupId, isUpdate } = location?.state || {};
  const [stateOptions, setStateOptions] = useState([]);
  const [zoneOptions, setZoneOptions] = useState([]);
  const [selectedMemberOptions, setSelectedMemberOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [chapterOptions, setChapterOptions] = useState([]);
  const [memberOptions, setMemberOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addGroups, fetchGroupById, singleGroup, updateGroup } =
    useGroupStore();
  const navigate = useNavigate();

  const fetchData = async (type, id) => {
    try {
      const response = await getLevels(id, type);

      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const stateData = await getAllLevel("state");
        const formattedOptions = stateData?.data?.map((state) => ({
          value: state?._id,
          label: state?.name,
        }));
        setStateOptions(formattedOptions);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchStates();
  }, []);
  const handleStateChange = async (stateId) => {
    setZoneOptions([]);
    setDistrictOptions([]);
    setChapterOptions([]);
    setMemberOptions([]);
    const zones = await fetchData("state", stateId.value);
    setZoneOptions(zones.map(({ _id, name }) => ({ value: _id, label: name })));
  };

  const handleZoneChange = async (zoneId) => {
    setDistrictOptions([]);
    setChapterOptions([]);
    setMemberOptions([]);
    const districts = await fetchData("zone", zoneId);
    setDistrictOptions(
      districts.map(({ _id, name }) => ({ value: _id, label: name }))
    );
  };
  const handleDistrictChange = async (districtId) => {
    setChapterOptions([]);
    setMemberOptions([]);
    const chapters = await fetchData("district", districtId);
    setChapterOptions(
      chapters.map(({ _id, name }) => ({ value: _id, label: name }))
    );
  };
  const handleChapterChange = async (chapterId) => {
    const members = await fetchData("user", chapterId);

    // Apply the same filtering logic as in EmailNotification
    const memberOptionsList =
      members && Array.isArray(members)
        ? selectedMemberOptions.some((opt) => opt?.value === "*")
          ? [{ value: "*", label: "All" }]
          : [
              { value: "*", label: "All" },
              ...members.map(({ _id, name }) => ({ value: _id, label: name })),
            ]
        : [];

    setMemberOptions(memberOptionsList);
  };
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
        singleGroup?.participants?.map((participant) => ({
          value: participant?._id,
          label: participant?.name,
        })) || [];
      setValue("participants", participantOptions);
      if (singleGroup?.participants?.length > 0) {
        const firstParticipant = singleGroup.participants[0];

        const stateOption = {
          value: firstParticipant.chapter.districtId.zoneId.stateId._id,
          label: firstParticipant.chapter.districtId.zoneId.stateId.name,
        };
        setValue("state", stateOption);
        setStateOptions([stateOption]);

        const zoneOption = {
          value: firstParticipant.chapter.districtId.zoneId._id,
          label: firstParticipant.chapter.districtId.zoneId.name,
        };
        setValue("zone", zoneOption);
        setZoneOptions([zoneOption]);

        const districtOption = {
          value: firstParticipant.chapter.districtId._id,
          label: firstParticipant.chapter.districtId.name,
        };
        setValue("district", districtOption);
        setDistrictOptions([districtOption]);

        const chapterOption = {
          value: firstParticipant.chapter._id,
          label: firstParticipant.chapter.name,
        };
        setValue("chapter", chapterOption);
        setChapterOptions([chapterOption]);
        handleChapterChange(firstParticipant.chapter._id);
      }
    }
  }, [singleGroup, isUpdate, setValue]);

  const handleClear = (event) => {
    event.preventDefault();
    reset();
    navigate(-1);
  };
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      // Check if "All" is selected
      const isAllSelected = data?.participants?.some(
        (user) => user.value === "*"
      );

      const formData = {
        groupName: data?.groupName,
        groupInfo: data?.groupInfo,
      };

      // If "All" is selected, set participants to ["*"] and include chapter
      if (isAllSelected) {
        formData.participants = ["*"];
        formData.chapter = data.chapter.value; // Add the chapter ID
      } else {
        // Otherwise, use the selected participant IDs
        formData.participantIds = data?.participants?.map(
          (user) => user?.value
        );
      }

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
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="state"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <>
                  <StyledSelectField
                    placeholder="Choose the state"
                    options={stateOptions}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleStateChange(e);
                    }}
                  />{" "}
                </>
              )}
            />
          </Grid>{" "}
          <Grid item xs={6}>
            <Controller
              name="zone"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <>
                  <StyledSelectField
                    placeholder="Choose the zone"
                    options={zoneOptions}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleZoneChange(e.value);
                    }}
                  />
                </>
              )}
            />
          </Grid>{" "}
          <Grid item xs={6}>
            <Controller
              name="district"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <>
                  <StyledSelectField
                    placeholder="Choose the district"
                    options={districtOptions}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleDistrictChange(e.value);
                    }}
                  />
                </>
              )}
            />
          </Grid>{" "}
          <Grid item xs={6}>
            <Controller
              name="chapter"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <>
                  <StyledSelectField
                    placeholder="Choose the chapter"
                    options={chapterOptions}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleChapterChange(e.value);
                    }}
                  />
                </>
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="participants"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <>
                  <Controller
                    name="participants"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <StyledSelectField
                        placeholder="Choose the member"
                        options={memberOptions}
                        isMulti
                        {...field}
                        onChange={(selected) => {
                          let updatedSelection = [...selected];
                          const allJustAdded =
                            selected.some((opt) => opt?.value === "*") &&
                            !selectedMemberOptions.some(
                              (opt) => opt?.value === "*"
                            );

                          const allJustRemoved =
                            !selected.some((opt) => opt?.value === "*") &&
                            selectedMemberOptions.some(
                              (opt) => opt?.value === "*"
                            );

                          if (allJustAdded) {
                            updatedSelection = selected.filter(
                              (opt) => opt?.value === "*"
                            );
                          } else if (
                            selected.some((opt) => opt?.value === "*") &&
                            selected.length > 1
                          ) {
                            updatedSelection = selected.filter(
                              (opt) => opt?.value !== "*"
                            );
                          }

                          setSelectedMemberOptions(updatedSelection);
                          field.onChange(updatedSelection);

                          if (allJustAdded || allJustRemoved) {
                            const chapterValue =
                              control.getValues("chapter")?.value;
                            if (chapterValue) {
                              handleChapterChange(chapterValue);
                            }
                          }
                        }}
                      />
                    )}
                  />
                </>
              )}
            />
          </Grid>{" "}
          <Grid item xs={12}>
            <Stack direction={"row"} spacing={2} justifyContent={"flex-end"}>
              <StyledButton
                name="Cancel"
                variant="secondary"
                onClick={(e) => handleClear(e)}
              />
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
