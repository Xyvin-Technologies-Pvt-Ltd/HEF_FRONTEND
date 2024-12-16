import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Stack } from "@mui/material";
import { StyledButton } from "../../ui/StyledButton.jsx";
import { Controller, useForm } from "react-hook-form";
import StyledSelectField from "../../ui/StyledSelectField.jsx";
import StyledInput from "../../ui/StyledInput.jsx";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { usePromotionStore } from "../../store/promotionstore.js";
import { toast } from "react-toastify";
import { getMember } from "../../api/memberapi.js";
import useHierarchyStore from "../../store/hierarchyStore.js";
import { getAllLevel } from "../../api/hierarchyapi.js";

export default function LevelAdd({ isUpdate }) {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    getValues,
  } = useForm();
  const navigate = useNavigate();
  const { id } = useParams();

  const location = useLocation();
  const { value } = location.state || {};
  const [type, setType] = useState();
  const [submitting, setSubmitting] = useState(false);
  const { addState, addZone, addDistrict, addChapter } = useHierarchyStore();
  usePromotionStore();
  const [adminOptions, setAdminOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [zoneOptions, setZoneOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);

  const handleTypeChange = (selectedOption) => {
    setType(selectedOption.value);
  };
  useEffect(() => {
    const fetchData = async (type, setter) => {
      try {
        const data = await getAllLevel(type);
        const formattedOptions = data?.data?.map((item) => ({
          value: item?.id,
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

    const fetchAdmins = async () => {
      try {
        const adminData = await getMember();
        const formattedOptions = adminData?.data?.map((admin) => ({
          value: admin?._id,
          label: admin?.name,
        }));
        setAdminOptions(formattedOptions);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdmins();
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
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      const admins = data?.admin?.map((admin) => admin?.value);
      const formData = { admins, name: data?.name };

      if (type === "state") await addState(formData);
      else if (type === "zone")
        await addZone({ ...formData, stateId: data?.state?.value });
      else if (type === "district")
        await addDistrict({ ...formData, zoneId: data?.zone?.value });
      else if (type === "chapter")
        await addChapter({ ...formData, districtId: data?.district?.value });

      navigate("/levels");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
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
              Choose type
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
          <Grid item xs={12}>
            <Typography
              sx={{ marginBottom: 1 }}
              variant="h6"
              color="textSecondary"
            >
              Name
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
          )}
          <Grid item xs={12}>
            <Typography
              sx={{ marginBottom: 1 }}
              variant="h6"
              color="textSecondary"
            >
              Admins
            </Typography>
            <Controller
              name="admin"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <StyledSelectField
                  placeholder="Select the admins"
                  isMulti
                  options={adminOptions}
                  {...field}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}></Grid>
          <Grid item xs={6} display={"flex"} justifyContent={"end"}>
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
              />
            </Stack>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
