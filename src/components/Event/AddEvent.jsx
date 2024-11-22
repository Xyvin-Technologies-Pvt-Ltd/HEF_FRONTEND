import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Stack, LinearProgress } from "@mui/material";
import { StyledButton } from "../../ui/StyledButton.jsx";
import StyledInput from "../../ui/StyledInput.jsx";
import { Controller, useForm } from "react-hook-form";
import StyledSelectField from "../../ui/StyledSelectField.jsx";
import { ReactComponent as Delete } from "../../assets/icons/DeleteIcon.svg";
import { StyledEventUpload } from "../../ui/StyledEventUpload.jsx";
import { StyledCalender } from "../../ui/StyledCalender.jsx";
import { StyledTime } from "../../ui/StyledTime.jsx";
import uploadFileToS3 from "../../utils/s3Upload.js";
import { useEventStore } from "../../store/eventStore.js";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { StyledMultilineTextField } from "../../ui/StyledMultilineTextField.jsx";
import StyledCropImage from "../../ui/StyledCropImage.jsx";

export default function AddEvent({ setSelectedTab, isUpdate }) {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const { id } = useParams();
  const [loadings, setLoadings] = useState(false);
  const [type, setType] = useState();
  const navigate = useNavigate();
  const handleTypeChange = (selectedOption) => {
    setType(selectedOption?.value);
  };
  const [speakers, setSpeakers] = useState([
    {
      name: "",
      designation: "",
      role: "",
      image: "",
    },
  ]);

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
      setValue("endDate", event.endDate);
      setValue("startTime", event.startTime);
      setValue("endTime", event.endTime);
      setValue("description", event.description);
      setValue("organiserName", event.organiserName);
      const selectedplatform = option.find(
        (item) => item.value === event.platform
      );
      setValue("platform", selectedplatform || "");
      setValue("link", event.link);
      setValue("speakers", event.speakers || []);
      setType(selectedType?.value);

      if (Array.isArray(event.speakers)) {
        setSpeakers(event.speakers);
        event.speakers.forEach((speaker, index) => {
          setValue(`speakers[${index}].name`, speaker.name || "");
          setValue(`speakers[${index}].designation`, speaker.designation || "");
          setValue(`speakers[${index}].role`, speaker.role || "");
          setValue(`speakers[${index}].image`, speaker.image || "");
        });
      }
    }
  }, [event, isUpdate, setValue]);

  console.log(speakers);
  const [imageFile, setImageFile] = useState(null);

  const handleClear = (event) => {
    event.preventDefault();
    if (isUpdate) {
      navigate("/events/list");
    }
    setSelectedTab(0);

    reset();
  };
  console.log(setSelectedTab);
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
          imageUrl = await new Promise((resolve, reject) => {
            uploadFileToS3(
              imageFile,
              (location) => resolve(location),
              (error) => reject(error)
            );
          });
        } catch (error) {
          console.error("Failed to upload image:", error);
          return;
        }
      }
  
      // Filter out speakers with all empty fields
      const filteredSpeakers = data.speakers.filter(
        (speaker) => speaker.name || speaker.designation || speaker.role || speaker.image
      );
  
      const speakersData = await Promise.all(
        filteredSpeakers.map(async (speaker, index) => {
          let speakerImageUrl = speakers[index]?.image || "";
  
          if (speaker?.image && typeof speaker.image === "object") {
            try {
              speakerImageUrl = await new Promise((resolve, reject) => {
                uploadFileToS3(
                  speaker.image,
                  (location) => resolve(location),
                  (error) => reject(error)
                );
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
  
      const formData = {
        type: data?.type?.value,
        eventName: data?.eventName,
        image: imageUrl,
        startDate: data?.startDate,
        startTime: data?.startTime,
        endDate: data?.endDate,
        endTime: data?.endTime,
        speakers: speakersData,
        description: data?.description,
        organiserName: data?.organiserName,
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
        setSelectedTab(0);
      }
  
      reset();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadings(false);
    }
  };
  

  const addSpeaker = () => {
    setSpeakers([
      ...speakers,
      {
        name: "",
        designation: "",
        role: "",
        image: "",
      },
    ]);
  };

  const removeSpeaker = (index) => {
    const newSpeakers = speakers.filter((_, i) => i !== index);
    setSpeakers(newSpeakers);
    console.log("arrayspeaker", newSpeakers);
    setValue("speakers", newSpeakers);
  };

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
                  rules={{ required: "Image is required" }}
                  render={({ field: { onChange, value } }) => (
                    <>
                      <StyledCropImage
                        label="Upload image here"
                        onChange={(file) => {
                          setImageFile(file);
                          onChange(file);
                        }}ratio={16 / 9}
                        value={value}
                      />
                      {errors.image && (
                        <span style={{ color: "red" }}>
                          {errors.image.message}
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
                <Grid item xs={12}>
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
                  />
                </Grid>
              )}

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
                <Stack direction="row" justifyContent="space-between">
                  <Typography
                    sx={{ marginBottom: 1 }}
                    variant="h6"
                    color="textSecondary"
                  >
                    Add Speakers
                  </Typography>
                  <Typography
                    sx={{ marginBottom: 1 }}
                    variant="h6"
                    fontWeight={500}
                    color={"#004797"}
                    onClick={addSpeaker}
                  >
                    + Add more
                  </Typography>
                </Stack>
                {speakers.map((speaker, index) => (
                  <Grid container spacing={4} key={index}>
                    <Grid item xs={6}>
                      <Controller
                        name={`speakers[${index}].name`}
                        control={control}
                        defaultValue={speaker?.name || ""}
                        render={({ field }) => (
                          <>
                            <StyledInput
                              placeholder="Enter speaker name"
                              {...field}
                            />
                          </>
                        )}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Controller
                        name={`speakers[${index}].designation`}
                        control={control}
                        defaultValue={speaker?.designation || ""}
                        render={({ field }) => (
                          <>
                            <StyledInput
                              placeholder="Enter speaker designation"
                              {...field}
                            />
                          </>
                        )}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Controller
                        name={`speakers[${index}].role`}
                        control={control}
                        defaultValue={speaker?.role || ""}
                        render={({ field }) => (
                          <>
                            <StyledInput
                              placeholder="Enter speaker role"
                              {...field}
                            />
                          </>
                        )}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Controller
                        name={`speakers[${index}].image`}
                        control={control}
                        defaultValue={speaker?.image || ""}
                        render={({ field }) => (
                          <>
                            <StyledEventUpload
                              label="Upload speaker image"
                              onChange={(file) => {
                                const updatedSpeakers = [...speakers];
                                updatedSpeakers[index].image = file;
                                setSpeakers(updatedSpeakers);
                                field.onChange(file);
                              }}
                              value={field.value}
                            />
                          </>
                        )}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      display={"flex"}
                      justifyContent={"flex-end"}
                    >
                      <Delete onClick={() => removeSpeaker(index)} />
                    </Grid>
                  </Grid>
                ))}
              </Grid>

              <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
                <Stack direction="row" spacing={2}>
                  <StyledButton
                    type="button"
                    onClick={handleClear}
                    variant={"secondary"}
                    name={"Clear"}
                  />

                  <StyledButton
                    name={loadings ? "Saving..." : "Save"}
                    type="submit"
                    loading={loadings}
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
