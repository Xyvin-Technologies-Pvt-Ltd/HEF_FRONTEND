import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Stack,
  LinearProgress,
  FormHelperText,
} from "@mui/material";
import { StyledButton } from "../../ui/StyledButton.jsx";
import StyledInput from "../../ui/StyledInput.jsx";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import StyledSelectField from "../../ui/StyledSelectField.jsx";
import { ReactComponent as Delete } from "../../assets/icons/DeleteIcon.svg";
import { StyledEventUpload } from "../../ui/StyledEventUpload.jsx";
import { StyledCalender } from "../../ui/StyledCalender.jsx";
import { StyledTime } from "../../ui/StyledTime.jsx";
import { useEventStore } from "../../store/eventStore.js";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { StyledMultilineTextField } from "../../ui/StyledMultilineTextField.jsx";
import StyledCropImage from "../../ui/StyledCropImage.jsx";
import { useDropDownStore } from "../../store/dropDownStore.js";
import moment from "moment";
import { upload } from "../../api/adminapi.js";

export default function AddEvent({ isUpdate }) {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      speakers: [
        {
          name: "",
          designation: "",
          role: "",
          image: "",
        },
      ],
    },
  });
  const { id } = useParams();
  const [loadings, setLoadings] = useState(false);
  const { user, fetchListofUser } = useDropDownStore();
  const [type, setType] = useState();

  const navigate = useNavigate();
  const handleTypeChange = (selectedOption) => {
    setType(selectedOption?.value);
  };
  useEffect(() => {
    fetchListofUser();
  }, []);

  const users =
    user && Array.isArray(user)
      ? user.map((i) => ({
          value: i._id,
          label: i.name,
        }))
      : [];
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "speakers",
  });

  const { addEvent, updateEvent, fetchEventById, event, loading } =
    useEventStore();

  useEffect(() => {
    if (isUpdate && id) {
      fetchEventById(id);
    }
  }, [isUpdate, id, fetchEventById]);

  useEffect(() => {
    if (event && isUpdate) {
      const selectedType = types.find((item) => item?.value === event.type);
      setValue("type", selectedType || "");
      setValue("eventName", event.eventName);
      setValue("venue", event.venue);
      setValue("image", event.image);
      setValue("startDate", event.startDate);
      setValue("eventDate", event.eventDate);
      setValue("eventEndDate", event.eventEndDate);
      setValue("endDate", event.endDate);
      setValue("startTime", event.startTime);
      setValue("endTime", event.endTime);
      setValue("description", event.description);
      setValue("organiserName", event.organiserName);
      setValue("limit", event.limit);
      const selectedplatform = option.find(
        (item) => item.value === event.platform
      );
      setValue("platform", selectedplatform || "");
      setValue("link", event.link);
      const selectedTags = event?.coordinator?.map((coord) => ({
        value: coord?._id,
        label: coord?.name,
      }));
      setValue("coordinator", selectedTags || []);
      setValue("speakers", event.speakers || []);
      setType(selectedType?.value);

      if (Array.isArray(event.speakers) && event.speakers.length > 0) {
        replace(
          event.speakers.map((speaker) => ({
            name: speaker.name || "",
            designation: speaker.designation || "",
            role: speaker.role || "",
            image: speaker.image || "",
          }))
        );
      } else {
        replace([
          {
            name: "",
            designation: "",
            role: "",
            image: "",
          },
        ]);
      }
    }
  }, [event, isUpdate, setValue]);
  const [imageFile, setImageFile] = useState(null);

  const handleClear = (event) => {
    event.preventDefault();
    if (isUpdate) {
      navigate("/events/list");
    }

    reset();
  };
  const option = [{ value: "Zoom", label: "Zoom" }];

  const types = [
    { value: "Online", label: "Online" },
    { value: "Offline", label: "Offline" },
  ];

  const onSubmit = async (data) => {
    try {
      setLoadings(true);
      let imageUrl = data?.image || "";
      if (imageFile) {
        try {
          imageUrl = await new Promise(async (resolve, reject) => {
            try {
              const response = await upload(imageFile);
              resolve(response?.data || "");
            } catch (error) {
              reject(error);
            }
          });
        } catch (error) {
          console.error("Failed to upload image:", error);
          return;
        }
      }

      const filteredSpeakers = data.speakers.filter(
        (speaker) =>
          speaker.name || speaker.designation || speaker.role || speaker.image
      );

      const speakersData = await Promise.all(
        filteredSpeakers.map(async (speaker) => {
          let speakerImageUrl = speaker.image || "";

          if (speaker?.image && typeof speaker.image === "object") {
            try {
              speakerImageUrl = await new Promise(async (resolve, reject) => {
                try {
                  const response = await upload(speaker.image);
                  resolve(response?.data || "");
                } catch (error) {
                  reject(error);
                }
              });
            } catch (error) {
              console.error(`Failed to upload image for speaker:`, error);
            }
          }

          return {
            name: speaker?.name,
            designation: speaker?.designation,
            role: speaker?.role,
            image: speakerImageUrl || "",
          };
        })
      );
      const currentDate = moment().startOf("day");
      const startDate = moment(data?.startDate).startOf("day");
      const endDate = moment(data?.endDate).startOf("day");

      let status;
      if (currentDate.isAfter(endDate)) {
        status = "pending";
      } else if (currentDate.isSameOrAfter(startDate)) {
        status = "live";
      } else {
        status = "pending";
      }
      const formData = {
        type: data?.type?.value,
        eventName: data?.eventName,
        ...(imageUrl && { image: imageUrl }),
        startDate: data?.startDate,
        startTime: data?.startTime,
        endDate: data?.endDate,
        eventDate: data?.eventDate,
        ...(data?.eventEndDate && { eventEndDate: data?.eventEndDate }),
        endTime: data?.endTime,
        speakers: speakersData,
        description: data?.description,
        organiserName: data?.organiserName,
        limit: data?.limit,
        status: status,
        coordinator: data?.coordinator?.map((coordinator) => coordinator.value),
      };

      if (type === "Online") {
        formData.platform = data?.platform.value;
        formData.link = data?.link;
      } else {
        formData.venue = data?.venue;
      }

      if (isUpdate && id) {
        await updateEvent(id, formData);
        navigate("/events/list");
      } else {
        await addEvent(formData);
        navigate("/events/list");
      }

      reset();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadings(false);
    }
  };

  const addSpeaker = () => {
    append({
      name: "",
      designation: "",
      role: "",
      image: "",
    });
  };

  const removeSpeaker = (index) => {
    // Prevent removing the last speaker form
    if (fields.length > 1) {
      remove(index);
    } else {
      // Clear the fields instead of removing
      setValue(`speakers.${index}.name`, "");
      setValue(`speakers.${index}.designation`, "");
      setValue(`speakers.${index}.role`, "");
      setValue(`speakers.${index}.image`, "");
    }
  };

  const renderSpeakers = () => (
    <Grid item xs={12}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" color="textSecondary">
          Add Speakers
        </Typography>
        <Box
          onClick={addSpeaker}
          sx={{
            width: "auto",
            padding: "8px 16px",
            cursor: "pointer",
            fontWeight: 500,
            fontSize: "16px",
            color: "#004797",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          + Add more
        </Box>
      </Stack>

      {fields.map((field, index) => (
        <Box key={field.id} sx={{ position: "relative", mb: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <Controller
                name={`speakers.${index}.name`}
                control={control}
                render={({ field }) => (
                  <StyledInput placeholder="Enter speaker name" {...field} />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name={`speakers.${index}.designation`}
                control={control}
                render={({ field }) => (
                  <StyledInput
                    placeholder="Enter speaker designation"
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name={`speakers.${index}.role`}
                control={control}
                render={({ field }) => (
                  <StyledInput placeholder="Enter speaker role" {...field} />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name={`speakers.${index}.image`}
                control={control}
                render={({ field }) => (
                  <StyledEventUpload
                    label="Upload speaker image"
                    onChange={(file) => field.onChange(file)}
                    value={field.value}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Box
            onClick={() => removeSpeaker(index)}
            sx={{
              // position: "absolute",
              cursor: "pointer",
              padding: "8px",
              mt: 2,
              pb: 2,
            }}
          >
            <Delete />
          </Box>
        </Box>
      ))}
    </Grid>
  );

  return (
    <>
      {loading ? (
        <LinearProgress />
      ) : (
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
                  Type of event
                </Typography>
                <Controller
                  name="type"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Type of event is required" }}
                  render={({ field }) => (
                    <>
                      <StyledSelectField
                        placeholder="Enter Event Type"
                        options={types}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleTypeChange(e);
                        }}
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
              <Grid item xs={6}>
                <Typography
                  sx={{ marginBottom: 1 }}
                  variant="h6"
                  color="textSecondary"
                >
                  Name of event
                </Typography>
                <Controller
                  name="eventName"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Name of event is required" }}
                  render={({ field }) => (
                    <>
                      <StyledInput
                        placeholder="Enter the name of event"
                        {...field}
                      />
                      {errors.eventName && (
                        <span style={{ color: "red" }}>
                          {errors.eventName.message}
                        </span>
                      )}
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
                  Event Image
                </Typography>
                <Controller
                  name="image"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value } }) => (
                    <>
                      <StyledCropImage
                        label="Upload image here"
                        onChange={(file) => {
                          setImageFile(file);
                          onChange(file);
                        }}
                        ratio={16 / 9}
                        value={value}
                      />
                      <FormHelperText style={{ color: "#888" }}>
                        File size limit: 1 MB | Recommended aspect ratio: 16:9
                      </FormHelperText>
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
                  rules={{ required: "Description is required" }}
                  render={({ field }) => (
                    <>
                      <StyledMultilineTextField
                        placeholder={"Add description"}
                        {...field}
                      />
                      {errors.description && (
                        <span style={{ color: "red" }}>
                          {errors.description.message}
                        </span>
                      )}
                    </>
                  )}
                />
              </Grid>
              {type === "Online" && (
                <>
                  <Grid item xs={6}>
                    <Typography
                      sx={{ marginBottom: 1 }}
                      variant="h6"
                      color="textSecondary"
                    >
                      Virtual platform
                    </Typography>
                    <Controller
                      name="platform"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <>
                          <StyledSelectField
                            placeholder="Select  Platform"
                            options={option}
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
                      Link to the event
                    </Typography>
                    <Controller
                      name="link"
                      control={control}
                      defaultValue=""
                      rules={{
                        required:
                          "Link to the event is required for online events",
                      }}
                      render={({ field }) => (
                        <>
                          <StyledInput placeholder="Enter link" {...field} />
                          {errors.link && (
                            <span style={{ color: "red" }}>
                              {errors.link.message}
                            </span>
                          )}
                        </>
                      )}
                    />
                  </Grid>
                </>
              )}
              {type === "Offline" && (
                <Grid item xs={6}>
                  <Typography
                    sx={{ marginBottom: 1 }}
                    variant="h6"
                    color="textSecondary"
                  >
                    Venue
                  </Typography>
                  <Controller
                    name="venue"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Venue is required for offline events" }}
                    render={({ field }) => (
                      <>
                        <StyledInput placeholder="Enter venue" {...field} />
                        {errors.venue && (
                          <span style={{ color: "red" }}>
                            {errors.venue.message}
                          </span>
                        )}
                      </>
                    )}
                    x
                  />
                </Grid>
              )}

              <Grid item xs={6}>
                <Typography
                  sx={{ marginBottom: 1 }}
                  variant="h6"
                  color="textSecondary"
                >
                  Event Start Date
                </Typography>
                <Controller
                  name="eventDate"
                  control={control}
                  defaultValue={null}
                  rules={{ required: "Event Date is required" }}
                  render={({ field }) => (
                    <>
                      <StyledCalender {...field} />
                      {errors.eventDate && (
                        <span style={{ color: "red" }}>
                          {errors.eventDate.message}
                        </span>
                      )}
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
                  Event End Date
                </Typography>
                <Controller
                  name="eventEndDate"
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
                  Start Date
                </Typography>
                <Controller
                  name="startDate"
                  control={control}
                  defaultValue={null}
                  rules={{ required: "Start Date is required" }}
                  render={({ field }) => (
                    <>
                      <StyledCalender {...field} />
                      {errors.startDate && (
                        <span style={{ color: "red" }}>
                          {errors.startDate.message}
                        </span>
                      )}
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
                  End Date
                </Typography>
                <Controller
                  name="endDate"
                  control={control}
                  defaultValue={null}
                  rules={{ required: "End Date is required" }}
                  render={({ field }) => (
                    <>
                      <StyledCalender {...field} />
                      {errors.endDate && (
                        <span style={{ color: "red" }}>
                          {errors.endDate.message}
                        </span>
                      )}
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
                  Start Time
                </Typography>
                <Controller
                  name="startTime"
                  control={control}
                  defaultValue={null}
                  rules={{ required: "Start Time is required" }}
                  render={({ field }) => (
                    <>
                      <StyledTime {...field} />
                      {errors.startTime && (
                        <span style={{ color: "red" }}>
                          {errors.startTime.message}
                        </span>
                      )}
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
                  End Time
                </Typography>
                <Controller
                  name="endTime"
                  control={control}
                  defaultValue={null}
                  rules={{ required: "End Time is required" }}
                  render={({ field }) => (
                    <>
                      <StyledTime {...field} />
                      {errors.endTime && (
                        <span style={{ color: "red" }}>
                          {errors.endTime.message}
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
                  Organiser Name
                </Typography>
                <Controller
                  name="organiserName"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Organiser Name is required" }}
                  render={({ field }) => (
                    <>
                      <StyledInput
                        placeholder="Enter organiser Name"
                        {...field}
                      />
                      {errors.organiserName && (
                        <span style={{ color: "red" }}>
                          {errors.organiserName.message}
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
                  Members Limit
                </Typography>
                <Controller
                  name="limit"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Limit is required" }}
                  render={({ field }) => (
                    <>
                      <StyledInput
                        placeholder="Enter members limit"
                        {...field}
                      />
                      {errors.limit && (
                        <span style={{ color: "red" }}>
                          {errors.limit.message}
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
                  Coordinator
                </Typography>
                <Controller
                  name="coordinator"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Coordinator is required" }}
                  render={({ field }) => (
                    <>
                      <StyledSelectField
                        placeholder="Select member"
                        options={users}
                        isMulti
                        {...field}
                      />
                      {errors.coordinator && (
                        <span style={{ color: "red" }}>
                          {errors.coordinator.message}
                        </span>
                      )}
                    </>
                  )}
                />
              </Grid>
              {renderSpeakers()}
              <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
                <Stack direction="row" spacing={2}>
                  <StyledButton
                    type="button"
                    onClick={handleClear}
                    variant={"secondary"}
                    name={"Clear"}
                    disabled={loadings}
                  />

                  <StyledButton
                    name={loadings ? "Saving..." : "Save"}
                    type="submit"
                    disabled={loadings}
                    variant={"primary"}
                  />
                </Stack>
              </Grid>
            </Grid>
          </form>
        </Box>
      )}{" "}
    </>
  );
}
