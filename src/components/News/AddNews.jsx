import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Stack,
  Dialog,
  DialogContent,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import StyledSelectField from "../../ui/StyledSelectField";
import StyledInput from "../../ui/StyledInput";
import { StyledEventUpload } from "../../ui/StyledEventUpload";
import { StyledMultilineTextField } from "../../ui/StyledMultilineTextField";
import { StyledButton } from "../../ui/StyledButton";
import { useNewsStore } from "../../store/newsStore";
import uploadFileToS3 from "../../utils/s3Upload";
import { toast } from "react-toastify";
import { ReactComponent as CloseIcon } from "../../assets/icons/CloseIcon.svg";
import StyledCropImage from "../../ui/StyledCropImage";
export default function AddNews({ isUpdate, setSelectedTab }) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      category: null,
      title: "",
      image: "",
      content: "",
    },
  });
  const { singleNews, fetchNewsById, addNewses, updateNews } = useNewsStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  const option = [
    { value: "Latest", label: "Latest" },
    { value: "Current Affairs", label: "Current Affairs" },
    { value: "Trending", label: "Trending" },
    { value: "Entertainment", label: "Entertainment" },
    { value: "History", label: "History" },
    { value: "Volunteering", label: "Volunteering" },
    { value: "Events/ Programmes", label: "Events/ Programmes" },
  ];
  useEffect(() => {
    if (isUpdate && id) {
      fetchNewsById(id);
    }
  }, [id, isUpdate, fetchNewsById]);
  useEffect(() => {
    if (singleNews && isUpdate) {
      const selectedCategory = option.find(
        (item) => item?.value === singleNews.category
      );
      setValue("category", selectedCategory || "");
      setValue("title", singleNews.title);
      setValue("content", singleNews.content);
      setValue("image", singleNews.media);
      setPreviewImageUrl(singleNews.media);
    }
  }, [singleNews, isUpdate, setValue]);
  const handlePreviewOpen = () => {
    setPreviewOpen(true);
  };

  const handlePreviewClose = () => {
    setPreviewOpen(false);
  };

  const onImageChange = (file) => {
    setImageFile(file);
    setValue("image", file);
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
      setLoading(true);
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
      const formData = {
        category: data.category.value,
        title: data.title,
        media: imageUrl ? imageUrl : "",
        content: data.content,
      };
      if (isUpdate && id) {
        await updateNews(id, formData);
      } else {
        await addNewses(formData);
        setSelectedTab(0);
      }
      navigate(`/news`);
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
              Choose category
            </Typography>
            <Controller
              name="category"
              control={control}
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <>
                  <StyledSelectField
                    placeholder="Latest"
                    options={option}
                    {...field}
                  />
                  {errors.category && (
                    <span style={{ color: "red" }}>
                      {errors.category.message}
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
              Title
            </Typography>
            <Controller
              name="title"
              control={control}
              rules={{ required: "Title is required" }}
              render={({ field }) => (
                <>
                  <StyledInput placeholder="Enter the news title" {...field} />
                  {errors.title && (
                    <span style={{ color: "red" }}>{errors.title.message}</span>
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
              Upload Photo or video
            </Typography>
            <Controller
              name="image"
              control={control}
              defaultValue=""
              rules={{ required: "File is required" }}
              render={({ field: { onChange, value } }) => (
                <>
                  <StyledCropImage
                    label="Upload image here"
                    onChange={(file) => {
                      onImageChange(file);
                      onChange(file);
                    }}
                    ratio={16 / 9}
                    value={value}
                  />
                  {errors.image && (
                    <span style={{ color: "red" }}>{errors.image.message}</span>
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
              Add content
            </Typography>
            <Controller
              name="content"
              control={control}
              rules={{ required: "Content is required" }}
              render={({ field }) => (
                <>
                  <StyledMultilineTextField
                    placeholder="Add Description in less than 500 words"
                    {...field}
                  />
                  {errors.content && (
                    <span style={{ color: "red" }}>
                      {errors.content.message}
                    </span>
                  )}
                </>
              )}
            />
          </Grid>
          <Grid item xs={6}></Grid>
          <Grid item xs={6} display={"flex"} justifyContent={"end"}>
            <Stack direction={"row"} spacing={2}>
              <StyledButton
                name="Preview"
                variant="secondary"
                onClick={(event) => {
                  event.preventDefault();
                  handlePreviewOpen();
                }}
              />
              <StyledButton
                name={loading ? "Publishing" : "Publish"}
                variant="primary"
                type="submit"
              />
            </Stack>
          </Grid>
        </Grid>
      </form>
      <Dialog
        open={previewOpen}
        onClose={handlePreviewClose}
        maxWidth="sm"
        fullWidth
      >
        {" "}
        <Stack direction={"row"} justifyContent={"end"} padding={2}>
          <Typography
            onClick={handlePreviewClose}
            color="#E71D36"
            style={{ cursor: "pointer" }}
          >
            <CloseIcon />
          </Typography>
        </Stack>
        <DialogContent>
          <Typography variant="h6" fontWeight="bold">
            Category:
          </Typography>
          <Typography>{getValues("category")?.label || "N/A"}</Typography>

          <Typography variant="h6" fontWeight="bold" mt={2}>
            Title:
          </Typography>
          <Typography>{getValues("title") || "N/A"}</Typography>

          <Typography variant="h6" fontWeight="bold" mt={2}>
            Content:
          </Typography>
          <Typography>{getValues("content") || "N/A"}</Typography>

          <Typography variant="h6" fontWeight="bold" mt={2}>
            Image:
          </Typography>

          {previewImageUrl ? (
            <Box
              component="img"
              src={previewImageUrl}
              alt="Preview"
              sx={{
                width: "100%",
                maxHeight: "300px",
                mt: 1,
                objectFit: "contain",
              }}
            />
          ) : (
            <Typography color="textSecondary">No image selected</Typography>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
