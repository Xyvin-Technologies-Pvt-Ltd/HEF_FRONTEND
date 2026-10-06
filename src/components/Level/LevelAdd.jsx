import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Stack,
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  LinearProgress,
} from "@mui/material";
import { StyledButton } from "../../ui/StyledButton.jsx";
import { Controller, useForm } from "react-hook-form";
import StyledSelectField from "../../ui/StyledSelectField.jsx";
import StyledInput from "../../ui/StyledInput.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useHierarchyStore from "../../store/hierarchyStore.js";
import { getAllLevel, getLevels } from "../../api/hierarchyapi.js";

import { Delete } from "@mui/icons-material";

export default function LevelAdd() {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    getValues,
  } = useForm();
  const navigate = useNavigate();

  const location = useLocation();
  const { levelId, category, isUpdate } = location.state || {};
  const [type, setType] = useState();
  const [submitting, setSubmitting] = useState(false);
  const { addLevel, fetchLevelById, level, updateLevel } =
    useHierarchyStore();
  const [open, setOpen] = useState(false);
  const [stateOptions, setStateOptions] = useState([]);
  const [adminStateOptions, setAdminStateOptions] = useState([]);
  const [adminZoneOptions, setAdminZoneOptions] = useState([]);
  const [adminDistrictOptions, setAdminDistrictOptions] = useState([]);
  const [adminChapterOptions, setAdminChapterOptions] = useState([]);
  const [adminMemberOptions, setAdminMemberOptions] = useState([]);
  const [zoneOptions, setZoneOptions] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [viewAdmin, setViewAdmin] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const roleOptions = [
    { value: "president", label: "President" },
    { value: "secretary", label: "Secretary" },
    { value: "treasurer", label: "Treasurer" },
  ];
  const availableRoleOptions = roleOptions?.filter(
    (role) => !admins?.some((admin) => admin.role === role.value)
  );

  const handleTypeChange = (selectedOption) => {
    setType(selectedOption.value);
  };
  useEffect(() => {
    if (isUpdate && levelId && category) {
      let filter = {};
      filter.levelId = levelId;
      fetchLevelById(category, filter);
    }
  }, [levelId, isUpdate]);

  const handleOpenDialog = () => {
    setValue("adminRole", null);
    setValue("adminState", null);
    setValue("adminZone", null);
    setValue("adminDistrict", null);
    setValue("adminChapter", null);
    setValue("adminMember", null);
    setAdminZoneOptions([]);
    setAdminDistrictOptions([]);
    setAdminChapterOptions([]);
    setAdminMemberOptions([]);
    setOpen(true);
  };

  useEffect(() => {
    if (
      level &&
      isUpdate &&
      stateOptions.length &&
      zoneOptions.length &&
      districtOptions.length
    ) {
      setValue("name", level.name);
      setValue("type", { value: category, label: category });
      setType(category);

      const initialAdmins = (level.admins || []).map((a) => ({
        role: a.role,
        user: typeof a.user === "object" ? a.user?._id : a.user,
      }));
      const initialViewAdmins = (level.admins || []).map((a) => ({
        role: a.role,
        roleLabel: a.role ? a.role.charAt(0).toUpperCase() + a.role.slice(1) : "",
        user: typeof a.user === "object" ? a.user?._id : a.user,
        userName: typeof a.user === "object" ? a.user?.name : a.user,
      }));

      setAdmins(initialAdmins);
      setViewAdmin(initialViewAdmins);

      if (category === "zone") {
        const selectedState = stateOptions.find(
          (option) => option.value === level.stateId
        );
        if (selectedState) setValue("state", selectedState);
      } else if (category === "district") {
        const selectedZone = zoneOptions.find(
          (option) => option.value === level.zoneId
        );
        if (selectedZone) setValue("zone", selectedZone);
      } else if (category === "chapter") {
        const selectedDistrict = districtOptions.find(
          (option) => option.value === level.districtId
        );
        if (selectedDistrict) setValue("district", selectedDistrict);
        setValue("shortCode", level?.shortCode);
      }
    }
  }, [level, isUpdate, setValue, stateOptions, zoneOptions, districtOptions]);

  useEffect(() => {
    const fetchData = async (type, setter) => {
      try {
        const data = await getAllLevel(type);
        const formattedOptions = data?.data?.map((item) => ({
          value: item?._id,
          label: item?.name,
        }));
        setter(formattedOptions);
      } catch (error) {
        console.error(`Error fetching ${type} data:`, error);
      }
    };

    fetchData("state", setStateOptions);
    fetchData("zone", setZoneOptions);
    fetchData("district", setDistrictOptions);
  }, []);
  const option = [
    { value: "state", label: "State" },
    { value: "zone", label: "Zone" },
    { value: "district", label: "District" },
    { value: "chapter", label: "Chapter" },
  ];

  const handleClear = (event) => {
    event.preventDefault();
    reset();
    setAdmins([]);
    setViewAdmin([]);
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      const formData = {};
      const cleanedAdmins = (admins || []).map((a) => ({
        role: a.role,
        user: typeof a.user === "object" ? a.user?._id : a.user,
      }));
      formData.admins = cleanedAdmins;
      formData.name = data?.name;

      if (type === "zone") {
        formData.stateId = data?.state?.value;
      } else if (type === "district") {
        formData.zoneId = data?.zone?.value;
      } else if (type === "chapter") {
        formData.districtId = data?.district?.value;
        formData.shortCode = data?.shortCode;
      }
      if (isUpdate) {
        let filter = {};
        filter.levelId = levelId;
        await updateLevel(type, formData, filter);
      } else {
        await addLevel(type, formData);
      }
      navigate("/levels", { state: { type: type } });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddAdmin = (e) => {
    e.preventDefault();
    const formValues = getValues();

    if (!formValues.adminRole?.value || !formValues.adminMember?.value) {
      toast.warning("Please select both a role and a member");
      return;
    }

    const newAdmin = {
      role: formValues.adminRole?.value,
      user: formValues.adminMember?.value,
    };
    const viewAdminData = {
      role: formValues.adminRole?.value,
      roleLabel: formValues.adminRole?.label,
      user: formValues.adminMember?.value,
      userName: formValues.adminMember?.label,
    };
    setViewAdmin([...viewAdmin, viewAdminData]);
    setAdmins([...admins, newAdmin]);

    setValue("adminRole", null);
    setValue("adminState", null);
    setValue("adminZone", null);
    setValue("adminDistrict", null);
    setValue("adminChapter", null);
    setValue("adminMember", null);

    setAdminZoneOptions([]);
    setAdminDistrictOptions([]);
    setAdminChapterOptions([]);
    setAdminMemberOptions([]);
    setOpen(false);
  };

  const handleRemoveAdmin = (index) => {
    const updatedAdmins = admins.filter((_, idx) => idx !== index);
    const updatedViewAdmin = viewAdmin.filter((_, idx) => idx !== index);
    setAdmins(updatedAdmins);
    setViewAdmin(updatedViewAdmin);
  };

  const fetchDialog = async (type, id, filter) => {
    try {
      const response = await getLevels(id, type, filter);

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
        setAdminStateOptions(formattedOptions);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchStates();
  }, []);
  const handleStateChange = async (stateId) => {
    setAdminZoneOptions([]);
    setAdminDistrictOptions([]);
    setAdminChapterOptions([]);
    setAdminMemberOptions([]);
    setValue("adminZone", null);
    setValue("adminDistrict", null);
    setValue("adminChapter", null);
    setValue("adminMember", null);
    if (!stateId?.value) return;
    const zones = await fetchDialog("state", stateId.value);
    setAdminZoneOptions(
      zones ? zones.map(({ _id, name }) => ({ value: _id, label: name })) : []
    );
  };

  const handleZoneChange = async (zoneId) => {
    setAdminDistrictOptions([]);
    setAdminChapterOptions([]);
    setAdminMemberOptions([]);
    setValue("adminDistrict", null);
    setValue("adminChapter", null);
    setValue("adminMember", null);
    if (!zoneId) return;
    const districts = await fetchDialog("zone", zoneId);
    setAdminDistrictOptions(
      districts ? districts.map(({ _id, name }) => ({ value: _id, label: name })) : []
    );
  };
  const handleDistrictChange = async (districtId) => {
    setAdminChapterOptions([]);
    setAdminMemberOptions([]);
    setValue("adminChapter", null);
    setValue("adminMember", null);
    if (!districtId) return;
    const chapters = await fetchDialog("district", districtId);
    setAdminChapterOptions(
      chapters ? chapters.map(({ _id, name }) => ({ value: _id, label: name })) : []
    );
  };
  const handleChapterChange = async (chapterId) => {
    setAdminMemberOptions([]);
    setValue("adminMember", null);
    if (!chapterId) return;
    const members = await fetchDialog("user", chapterId, { chooseAdmin: true });
    setAdminMemberOptions(
      members ? members.map(({ _id, name }) => ({ value: _id, label: name })) : []
    );
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
              Choose type <span style={{ color: "red" }}>*</span>
            </Typography>
            <Controller
              name="type"
              control={control}
              defaultValue=""
              rules={{ required: "Type is required" }}
              render={({ field }) => (
                <>
                  <StyledSelectField
                    placeholder="Select the type"
                    options={option}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleTypeChange(e);
                    }}
                  />
                  {errors.type && (
                    <span style={{ color: "red" }}>{errors.type.message}</span>
                  )}
                </>
              )}
            />
          </Grid>{" "}
          {type === "zone" && (
            <Grid item xs={12}>
              <Typography
                sx={{ marginBottom: 1 }}
                variant="h6"
                color="textSecondary"
              >
                State
              </Typography>
              <Controller
                name="state"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <StyledSelectField
                    placeholder="Select the state"
                    options={stateOptions}
                    {...field}
                  />
                )}
              />
            </Grid>
          )}
          {type === "district" && (
            <Grid item xs={12}>
              <Typography
                sx={{ marginBottom: 1 }}
                variant="h6"
                color="textSecondary"
              >
                Zone
              </Typography>
              <Controller
                name="zone"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <StyledSelectField
                    placeholder="Select the zone"
                    options={zoneOptions}
                    {...field}
                  />
                )}
              />
            </Grid>
          )}
          {type === "chapter" && (
            <>
              <Grid item xs={12}>
                <Typography
                  sx={{ marginBottom: 1 }}
                  variant="h6"
                  color="textSecondary"
                >
                  District
                </Typography>
                <Controller
                  name="district"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <StyledSelectField
                      placeholder="Select the district"
                      options={districtOptions}
                      {...field}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography
                  sx={{ marginBottom: 1 }}
                  variant="h6"
                  color="textSecondary"
                >
                  Chapter Short Code
                </Typography>
                <Controller
                  name="shortCode"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <StyledInput
                      placeholder={"Enter the chapter short code"}
                      {...field}
                    />
                  )}
                />
              </Grid>
            </>
          )}
          <Grid item xs={12}>
            <Typography
              sx={{ marginBottom: 1 }}
              variant="h6"
              color="textSecondary"
            >
              Name  <span style={{ color: "red" }}>*</span>
            </Typography>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <StyledInput placeholder={"Enter the name"} {...field} />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            {viewAdmin?.length > 0 ? (
              <Box sx={{ mt: 2 }}>
                {viewAdmin?.map((admin, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 2,
                      mb: 1,
                      border: "1px solid rgba(0, 0, 0, 0.12)",
                      borderRadius: "8px",
                    }}
                  >
                    <div>
                      <Typography
                        variant="subtitle2"
                        color="primary"
                        sx={{ textTransform: "capitalize", fontWeight: 600 }}
                      >
                        {admin?.roleLabel ||
                          (admin?.role
                            ? admin.role.charAt(0).toUpperCase() +
                              admin.role.slice(1)
                            : "")}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {admin?.userName ||
                          (typeof admin?.user === "object"
                            ? admin?.user?.name
                            : admin?.user)}
                      </Typography>
                    </div>
                    <IconButton
                      onClick={() => handleRemoveAdmin(index)}
                      size="small"
                      sx={{ color: "error.main" }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography
                color="textSecondary"
                sx={{ textAlign: "center", py: 4 }}
              >
                No admins added yet. Click "Add Admin" to add admins.
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} display={"flex"} justifyContent={"end"} mb={4}>
            {" "}
            <Typography
              sx={{ marginBottom: 1, cursor: "pointer" }}
              variant="h6"
              fontWeight={500}
              color={"#004797"}
              onClick={handleOpenDialog}
            >
              + Add Admin
            </Typography>
          </Grid>
          <Grid item xs={12} display={"flex"} justifyContent={"end"}>
            {" "}
            <Stack direction={"row"} spacing={2}>
              <StyledButton
                name="Clear"
                variant="secondary"
                disabled={submitting}
                onClick={(event) => handleClear(event)}
              />
              <StyledButton
                name={submitting ? "Submitting" : "Submit"}
                variant="primary"
                type="submit"
                disabled={submitting}
              />
            </Stack>
          </Grid>
          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            fullWidth
            maxWidth={"md"}
            style={{ borderRadius: "12px", padding: "20px" }}
          >
            <DialogContent style={{ padding: "20px", paddingBottom: "40px" }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography
                    sx={{ marginBottom: 1 }}
                    variant="h6"
                    color="textSecondary"
                  >
                    Role
                  </Typography>
                  <Controller
                    name="adminRole"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <StyledSelectField
                        placeholder="Choose the Role"
                        options={availableRoleOptions}
                        {...field}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    sx={{ marginBottom: 1 }}
                    variant="h6"
                    color="textSecondary"
                  >
                    State
                  </Typography>
                  <Controller
                    name="adminState"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <StyledSelectField
                        placeholder="Choose the state"
                        options={adminStateOptions}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleStateChange(e);
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    sx={{ marginBottom: 1 }}
                    variant="h6"
                    color="textSecondary"
                  >
                    Zone
                  </Typography>
                  <Controller
                    name="adminZone"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <StyledSelectField
                        placeholder="Choose the zone"
                        options={adminZoneOptions}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleZoneChange(e?.value);
                        }}
                      />
                    )}
                  />
                </Grid>{" "}
                <Grid item xs={6}>
                  <Typography
                    sx={{ marginBottom: 1 }}
                    variant="h6"
                    color="textSecondary"
                  >
                    District
                  </Typography>
                  <Controller
                    name="adminDistrict"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <StyledSelectField
                        placeholder="Choose the district"
                        options={adminDistrictOptions}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleDistrictChange(e?.value);
                        }}
                      />
                    )}
                  />
                </Grid>{" "}
                <Grid item xs={6}>
                  <Typography
                    sx={{ marginBottom: 1 }}
                    variant="h6"
                    color="textSecondary"
                  >
                    Chapter
                  </Typography>
                  <Controller
                    name="adminChapter"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <StyledSelectField
                        placeholder="Choose the chapter"
                        options={adminChapterOptions}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleChapterChange(e?.value);
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6} mb={16}>
                  <Typography
                    sx={{ marginBottom: 1 }}
                    variant="h6"
                    color="textSecondary"
                  >
                    Member
                  </Typography>
                  <Controller
                    name="adminMember"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <StyledSelectField
                        placeholder="Choose the member"
                        options={adminMemberOptions}
                        {...field}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <StyledButton
                name={"Add"}
                variant="primary"
                onClick={handleAddAdmin}
              />
            </DialogActions>
          </Dialog>
        </Grid>
      </form>
    </Box>
  );
}
