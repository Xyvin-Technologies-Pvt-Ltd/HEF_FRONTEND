import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { StyledButton } from "../../ui/StyledButton.jsx";
import { Controller, useForm } from "react-hook-form";
import StyledSelectField from "../../ui/StyledSelectField.jsx";
import { StyledEventUpload } from "../../ui/StyledEventUpload.jsx";
import StyledInput from "../../ui/StyledInput.jsx";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { StyledMultilineTextField } from "../../ui/StyledMultilineTextField.jsx";
import { StyledCalender } from "../../ui/StyledCalender.jsx";
import uploadFileToS3 from "../../utils/s3Upload.js";
import { usePromotionStore } from "../../store/promotionstore.js";
import { toast } from "react-toastify";
import moment from "moment";
import StyledCropImage from "../../ui/StyledCropImage.jsx";

export default function Promotionform({ isUpdate }) {
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
  const [imageFile, setImageFile] = useState(null);
  const [type, setType] = useState();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  const { addPromotions, fetchPromotionById, updatePromotion, promotion } =
    usePromotionStore();

  const handleTypeChange = (selectedOption) => {
    setType(selectedOption.value);
  };

  const option = [
    { value: "banner", label: "Banner" },
    { value: "video", label: "Video" },
    { value: "poster", label: "Poster" },
    { value: "notice", label: "Notice" },
  ];
  const getAspectRatio = () => {
    switch (type) {
      case "banner":
        return 2 / 1;
      case "poster":
        return 19 / 20;
      default:
        return 1;
    }
  };

  useEffect(() => {
    if (isUpdate && id) {
      fetchPromotionById(id);
    }
  }, [id, isUpdate, fetchPromotionById]);
  const handleClear = (event) => {
    event.preventDefault();
    setPreviewOpen(true); // Open preview dialog on clicking "Preview"
  };

  const handleClosePreview = () => {
    setPreviewOpen(false); // Close preview dialog
  };
  const getYouTubeId = (url) => {
    const regExp =
      /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|watch\?.+&v=)([^&]{11}).*/;
    const match = url?.match(regExp);
    return match ? match[1] : null;
  };

  useEffect(() => {
    if (isUpdate && promotion) {
      const selectedType = option.find(
        (item) => item?.value === promotion.type
      );
      setValue("type", selectedType || "");
      setValue("startDate", promotion.startDate);
      setValue("endDate", promotion.endDate);

      if (promotion.type === "notice") {
        setValue("title", promotion.title || "");
        setValue("description", promotion.description || "");
        setValue("link", promotion.link || "");
      } else if (promotion.type === "video") {
        setValue("title", promotion.title || "");
        setValue("link", promotion.link || "");
      } else if (promotion.type === "banner" || "") {
        setValue("media", promotion.media || "");
        setPreviewImageUrl(promotion.media);
      } else if (promotion.type === "poster" || "") {
        setValue("media", promotion.media || "");
        setPreviewImageUrl(promotion.media);
        setValue("link", promotion.link || "");
      }

      setType(promotion.type);
    }
  }, [isUpdate, promotion, setValue]);
  const onImageChange = (file) => {
    setImageFile(file);
    setValue("media", file);
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewImageUrl(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewImageUrl("");
    }
  };
  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      let imageUrl = data?.media || "";

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
      const formData = {
        startDate: data?.startDate,
        endDate: data?.endDate,
      };
      if (type === "banner") {
        formData.type = "banner";
        formData.media = imageUrl;
      } else if (type === "video") {
        formData.type = "video";
        formData.link = data?.link;
        formData.title = data?.title;
      } else if (type === "notice") {
        formData.type = "notice";
        formData.title = data?.title;
        formData.description = data?.description;
        formData.link = data?.link;
      } else if (type === "poster") {
        formData.type = "poster";
        formData.media = imageUrl;
        formData.link = data?.link;
      }
      if (isUpdate && id) {
        await updatePromotion(id, formData);
      } else {
        await addPromotions(formData);
      }
      navigate("/promotions");
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
          {(type === "banner" || type === "poster") && (
            <Grid item xs={12}>
              <Typography
                sx={{ marginBottom: 1 }}
                variant="h6"
                color="textSecondary"
              >
                Upload image
              </Typography>
              <Controller
                name="media"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value } }) => (
                  <>
                    <StyledCropImage
                      label="Upload image here"
                      onChange={(file) => {
                        onImageChange(file);
                        onChange(file);
                      }}
                      ratio={getAspectRatio()}
                      value={value}
                    />
                  </>
                )}
              />
            </Grid>
          )}
          {type === "video" && (
            <>
              <Grid item xs={12}>
                <Typography
                  sx={{ marginBottom: 1 }}
                  variant="h6"
                  color="textSecondary"
                >
                  Add Youtube link
                </Typography>
                <Controller
                  name="link"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <StyledInput placeholder="Add Youtube link" {...field} />
                    </>
                  )}
                />
              </Grid>{" "}
            </>
          )}{" "}
          {(type === "video" || type === "notice") && (
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
                render={({ field }) => (
                  <>
                    <StyledInput placeholder="Title" {...field} />
                  </>
                )}
              />
            </Grid>
          )}{" "}
          {type === "notice" && (
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
                rules={{
                  validate: (value) =>
                    value.length <= 500 ||
                    "Content must be less than 500 characters",
                }}
                render={({ field }) => (
                  <>
                    <StyledMultilineTextField
                      placeholder="Add Description in less than 500 characters"
                      maxLength={500}
                      errorMessage="Please enter less than 500 characters."
                      {...field}
                    />
                  </>
                )}
              />
            </Grid>
          )}
          {(type === "notice" || type === "poster") && (
            <Grid item xs={12}>
              <Typography
                sx={{ marginBottom: 1 }}
                variant="h6"
                color="textSecondary"
              >
                Link
              </Typography>
              <Controller
                name="link"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <>
                    <StyledInput placeholder="Link" {...field} />
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
              defaultValue=""
              rules={{ required: "Start Date is required" }}
              render={({ field }) => (
                <>
                  <StyledCalender
                    label="Select start date from Calender"
                    {...field}
                  />
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
              defaultValue=""
              rules={{ required: "End Date is required" }}
              render={({ field }) => (
                <>
                  <StyledCalender
                    label="Select end date from Calender"
                    {...field}
                  />
                  {errors.endDate && (
                    <span style={{ color: "red" }}>
                      {errors.endDate.message}
                    </span>
                  )}
                </>
              )}
            />
          </Grid>
          <Grid item xs={6}></Grid>
          <Grid item xs={6} display={"flex"} justifyContent={"end"}>
            {" "}
            <Stack direction={"row"} spacing={2}>
              <StyledButton
                name="Preview"
                variant="secondary"
                disabled={submitting}
                onClick={(event) => handleClear(event)}
              >
                Preview
              </StyledButton>
              <StyledButton
                name={submitting ? "Publishing" : "Publish"}
                variant="primary"
                type="submit"
              >
                Publish
              </StyledButton>
            </Stack>
          </Grid>
        </Grid>
      </form>
      <Dialog
        open={previewOpen}
        onClose={handleClosePreview}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          sx={{ backgroundColor: "#f5f5f5", borderBottom: "1px solid #e0e0e0" }}
        >
          Promotion Preview
        </DialogTitle>
        <DialogContent
          sx={{ p: 4, backgroundColor: "#fafafa", borderRadius: "12px" }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#3f51b5",
              textAlign: "center",
              mb: 3,
              borderBottom: "2px solid #e0e0e0",
              p: 3,
            }}
          >
            Type: {type}
          </Typography>

          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ mb: 1, fontSize: "1.1rem" }}
          >
            Start Date: {moment(getValues("startDate")).format("MMMM Do YYYY")}
          </Typography>

          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ mb: 3, fontSize: "1.1rem" }}
          >
            End Date: {moment(getValues("endDate")).format("MMMM Do YYYY")}
          </Typography>

          {type === "notice" && (
            <>
              <Typography
                variant="h6"
                sx={{
                  mt: 3,
                  fontWeight: "bold",
                  color: "#3f51b5",
                  textDecoration: "underline",
                  mb: 1,
                }}
              >
                Title: {getValues("title")}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1, lineHeight: "1.6" }}
              >
                Description: {getValues("description")}
              </Typography>

              <Typography
                variant="body2"
                color="primary"
                sx={{ wordBreak: "break-word" }}
              >
                Link: {getValues("link")}
              </Typography>
            </>
          )}

          {(type === "banner" || type === "poster") && (
            <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
              {previewImageUrl ? (
                <Box
                  component="img"
                  src={previewImageUrl}
                  alt="Preview"
                  sx={{
                    maxWidth: "100%",
                    maxHeight: "300px",
                    borderRadius: "12px",
                    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
                    transition: "transform 0.3s",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                />
              ) : (
                <Typography color="textSecondary">No image selected</Typography>
              )}
            </Box>
          )}

          {type === "video" && (
            <>
              <Typography
                variant="h6"
                sx={{
                  mt: 4,
                  fontWeight: "bold",
                  color: "#3f51b5",
                  textAlign: "center",
                  mb: 2,
                  textDecoration: "underline",
                }}
              >
                Title: {getValues("title")}
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                <iframe
                  width="100%"
                  height="315"
                  src={`https://www.youtube.com/embed/${getYouTubeId(
                    getValues("link")
                  )}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allowFullScreen
                  style={{
                    borderRadius: "12px",
                    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
                    transition: "transform 0.3s",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                ></iframe>
              </Box>
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: "flex-end", p: 2 }}>
          <StyledButton
            onClick={handleClosePreview}
            variant="secondary"
            name={"Close"}
          >
            Close
          </StyledButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
