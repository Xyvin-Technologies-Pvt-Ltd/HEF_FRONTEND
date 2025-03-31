import {
  Box,
  Grid,
  Typography,
  Stack,
  LinearProgress,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import StyledInput from "../../ui/StyledInput";
import StyledSelectField from "../../ui/StyledSelectField";
import { StyledMultilineTextField } from "../../ui/StyledMultilineTextField";
import { StyledButton } from "../../ui/StyledButton";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { getLevels, getAllLevel } from "../../api/hierarchyapi";
import useActivityStore from "../../store/activityStore";
import { StyledCalender } from "../../ui/StyledCalender";
import { StyledTime } from "../../ui/StyledTime";

const AddActivity = () => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { addActivity } = useActivityStore();
  const [type, setType] = useState();
  const [loadings, setLoadings] = useState(false);
  const [stateOptions, setStateOptions] = useState([]);
  const [zoneOptions, setZoneOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [chapterOptions, setChapterOptions] = useState([]);
  const [memberOptions, setMemberOptions] = useState([]);

  const mode = [
    { value: "online", label: "online" },
    { value: "offline", label: "offline" },
  ];
  const activityOptions = [
    { value: "Business", label: "Business" },
    { value: "One v One Meeting", label: "One v One Meeting" },
    { value: "Referral", label: "Referral" },
  ];

  const handleClear = (event) => {
    event.preventDefault();
    reset();
    navigate(-1);
  };
  const handleTypeChange = (selectedOption) => {
    setType(selectedOption?.value);
  };
  const businessType = watch("type");
  const onSubmit = async (data) => {
    try {
      setLoadings(true);

      const formData = {
        type: data?.type?.value,
        sender: data?.sender?.value,
        title: data?.title,
        description: data?.description,
        member: data?.member?.value,
        ...(data?.date && { date: data?.date }),
        ...(data?.time && { time: data?.time }),
        amount: data?.amount,
      };
      if (type === "online") {
        formData.meetingLink = data?.link;
      } else {
        formData.location = data?.location;
      }
      if (businessType?.value === "Referral") {
        formData.referral = {
          name: data?.name,
          phone: data?.phone,
          email: data?.email,
          address: data?.address,
          ...(data?.info && { info: data?.info }),
        };
      }

      await addActivity(formData);

      reset();
      navigate("/activity");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadings(false);
    }
  };
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
  const selectedSender = watch("sender");
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
    setMemberOptions([]);
    const members = await fetchData("user", chapterId);
    setMemberOptions(
      members.map(({ _id, name }) => ({ value: _id, label: name }))
    );
  };
  const filteredReceiverOptions = memberOptions?.filter(
    (option) => option.value !== selectedSender?.value
  );
  return (
    <>
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
                Type
              </Typography>
              <Controller
                name="type"
                control={control}
                defaultValue=""
                rules={{ required: "Type is required" }}
                render={({ field }) => (
                  <>
                    <StyledSelectField
                      placeholder="Choose activity type"
                      options={activityOptions}
                      {...field}
                    />
                    {errors.type && (
                      <span style={{ color: "red" }}>
                        {errors.type.message}
                      </span>
                    )}
                  </>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" color="textSecondary">
                Business Giver
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
                name="sender"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <>
                    <StyledSelectField
                      placeholder="Choose the member"
                      options={memberOptions}
                      {...field}
                    />
                  </>
                )}
              />
            </Grid>{" "}
            <Grid item xs={6}></Grid>
            <Grid item xs={12}>
              <Typography variant="h6" color="textSecondary">
                Business Receiver
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="receiverstate"
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
                name="recieverzone"
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
                name="recieverdistrict"
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
                name="recieverchapter"
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
                name="member"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <>
                    <StyledSelectField
                      placeholder="Choose the member"
                      options={filteredReceiverOptions}
                      {...field}
                    />
                  </>
                )}
              />
            </Grid>{" "}
            <Grid item xs={6}></Grid>
            <Grid item xs={12}>
              <Typography
                sx={{ marginBottom: 1 }}
                variant="h6"
                color="textSecondary"
              >
                Title
              </Typography>
              <Controller
                name="title"
                control={control}
                defaultValue=""
                rules={{ required: "Title is required" }}
                render={({ field }) => (
                  <>
                    <StyledInput placeholder="Enter the Title" {...field} />
                    {errors.title && (
                      <span style={{ color: "red" }}>
                        {errors.title.message}
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
                Amount
              </Typography>
              <Controller
                name="amount"
                control={control}
                defaultValue=""
                rules={{ required: "Amount is required" }}
                render={({ field }) => (
                  <>
                    <StyledInput placeholder="Enter the Amount" {...field} />
                    {errors.amount && (
                      <span style={{ color: "red" }}>
                        {errors.amount.message}
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
                Description
              </Typography>
              <Controller
                name="description"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <>
                    <StyledMultilineTextField
                      placeholder="Enter the Description"
                      {...field}
                    />
                  </>
                )}
              />
            </Grid>
            {businessType?.value === "One v One Meeting" && (
              <>
                <Grid item xs={6}>
                  <Typography
                    sx={{ marginBottom: 1 }}
                    variant="h6"
                    color="textSecondary"
                  >
                    Choose Meeting Type
                  </Typography>
                  <Controller
                    name="mode"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <>
                        <StyledSelectField
                          placeholder="Select type"
                          options={mode}
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            handleTypeChange(e);
                          }}
                        />
                      </>
                    )}
                  />
                </Grid>
                {type === "offline" && (
                  <Grid item xs={6}>
                    <Typography
                      sx={{ marginBottom: 1 }}
                      variant="h6"
                      color="textSecondary"
                    >
                      Location
                    </Typography>
                    <Controller
                      name="location"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <>
                          <StyledInput
                            placeholder="Enter the Location"
                            {...field}
                          />
                        </>
                      )}
                    />
                  </Grid>
                )}
                {type === "online" && (
                  <Grid item xs={6}>
                    <Typography
                      sx={{ marginBottom: 1 }}
                      variant="h6"
                      color="textSecondary"
                    >
                      Meeting Link
                    </Typography>
                    <Controller
                      name="link"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <>
                          <StyledInput
                            placeholder="Enter the Meeting Link"
                            {...field}
                          />
                        </>
                      )}
                    />
                  </Grid>
                )}
                <Grid item xs={6}>
                  <Typography
                    sx={{ marginBottom: 1 }}
                    variant="h6"
                    color="textSecondary"
                  >
                    Date
                  </Typography>
                  <Controller
                    name="date"
                    control={control}
                    defaultValue={null}
                    render={({ field }) => (
                      <>
                        <StyledCalender {...field} />
                      </>
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    sx={{ marginBottom: 1 }}
                    variant="h6"
                    color="textSecondary"
                  >
                    Time
                  </Typography>
                  <Controller
                    name="time"
                    control={control}
                    defaultValue={null}
                    render={({ field }) => (
                      <>
                        <StyledTime {...field} />
                      </>
                    )}
                  />
                </Grid>
              </>
            )}
            {businessType?.value === "Referral" && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" color="textSecondary">
                    Referral Details
                  </Typography>
                </Grid>
                <Grid item xs={6}>
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
                      <>
                        <StyledInput placeholder="Enter the name" {...field} />
                      </>
                    )}
                  />
                </Grid>{" "}
                <Grid item xs={6}>
                  <Typography
                    sx={{ marginBottom: 1 }}
                    variant="h6"
                    color="textSecondary"
                  >
                    Email
                  </Typography>
                  <Controller
                    name="email"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <>
                        <StyledInput placeholder="Enter the email" {...field} />
                      </>
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    sx={{ marginBottom: 1 }}
                    variant="h6"
                    color="textSecondary"
                  >
                    Phone
                  </Typography>
                  <Controller
                    name="phone"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <>
                        <StyledInput placeholder="Enter the phone" {...field} />
                      </>
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    sx={{ marginBottom: 1 }}
                    variant="h6"
                    color="textSecondary"
                  >
                    Info
                  </Typography>
                  <Controller
                    name="info"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <>
                        <StyledMultilineTextField
                          placeholder="Add any extra details (optional)"
                          {...field}
                        />
                      </>
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    sx={{ marginBottom: 1 }}
                    variant="h6"
                    color="textSecondary"
                  >
                    Address
                  </Typography>
                  <Controller
                    name="address"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <>
                        <StyledMultilineTextField
                          placeholder="Enter the address"
                          {...field}
                        />
                      </>
                    )}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={6}></Grid>
            <Grid item xs={12}>
              <Stack direction={"row"} spacing={2} justifyContent={"flex-end"}>
                <StyledButton
                  name="Cancel"
                  variant="secondary"
                  onClick={(event) => handleClear(event)}
                  disabled={loadings}
                />
                <StyledButton
                  name={loadings ? "Saving..." : "Save"}
                  variant="primary"
                  type="submit"
                />
              </Stack>
            </Grid>
          </Grid>
        </form>
      </Box>
    </>
  );
};

export default AddActivity;
