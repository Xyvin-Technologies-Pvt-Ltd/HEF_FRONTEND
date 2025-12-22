import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { StyledButton } from "../../ui/StyledButton";
import StyledInput from "../../ui/StyledInput";
import StyledCropImage from "../../ui/StyledCropImage";
import { upload } from "../../api/adminapi";
import { toast } from "react-toastify";
import { useCategoryStore } from "../../store/categoryStore";

const AddCategory = ({ open, onClose, categoryId, onChange }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const { fetchCategoryById, singleCategory, addCategory, editCategory } =
    useCategoryStore();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (categoryId) {
        setFetching(true);
        try {
          await fetchCategoryById(categoryId);
        } finally {
          setFetching(false);
        }
      } else {
        reset({ name: "", icon: "" });
      }
    };
    fetchData();
  }, [categoryId, fetchCategoryById, reset]);

  useEffect(() => {
    if (singleCategory && categoryId) {
      reset({
        name: singleCategory?.name || "",
        icon: singleCategory?.icon || "",
      });
    }
  }, [singleCategory, categoryId, reset]);

  const handleClear = () => {
    reset();
    setImageFile(null);
    onClose();
  };

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      let iconUrl = formData?.icon || "";
      if (imageFile) {
        const response = await upload(imageFile);
        iconUrl = response?.data || "";
      }
      const payload = { name: formData?.name, icon: iconUrl };
      if (categoryId) {
        await editCategory(categoryId, payload);
      } else {
        await addCategory(payload);
      }
      onChange?.();
      handleClear();
    } catch (error) {
      toast.error(error?.message || "Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { borderRadius: "12px", bgcolor: "#fff" },
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle sx={{ height: "auto", padding: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" color="textPrimary">
              {categoryId ? "Edit Category" : "Add Category"}
            </Typography>
            <Typography
              onClick={handleClear}
              color="#AEB9E1"
              sx={{ cursor: "pointer" }}
            >
              <Close fontSize="small" />
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent
          sx={{ height: "auto", width: "430px", bgcolor: "#fff" }}
        >
          {fetching ? (
            <Typography>Loading...</Typography>
          ) : (
            <Stack spacing={2} paddingTop={2}>
              <Stack spacing={1}>
                <Typography variant="h6" color="textSecondary">
                  Category Name <span style={{ color: "red" }}>*</span>
                </Typography>
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Category name is required" }}
                  render={({ field }) => (
                    <StyledInput placeholder="Enter category name" {...field} />
                  )}
                />
                {errors.name?.message && (
                  <Typography color="error" variant="body2">
                    {errors.name.message}
                  </Typography>
                )}
              </Stack>
              <Stack spacing={1}>
                <Typography variant="h6" color="textSecondary">
                  Category Icon <span style={{ color: "red" }}>*</span>
                </Typography>
                <Controller
                  name="icon"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Category icon is required" }}
                  render={({ field: { onChange, value } }) => (
                    <StyledCropImage
                      label="Upload icon"
                      ratio={1 / 1}
                      onChange={(file) => {
                        setImageFile(file);
                        onChange(file);
                      }}
                      value={value}
                    />
                  )}
                />
                {errors.icon?.message && (
                  <Typography color="error" variant="body2">
                    {errors.icon.message}
                  </Typography>
                )}
              </Stack>
            </Stack>
          )}
          <Stack
            direction={"row"}
            spacing={2}
            paddingTop={3}
            justifyContent={"end"}
          >
            <StyledButton
              variant="secondary"
              name="Cancel"
              onClick={handleClear}
              disabled={loading}
              type="button"
            />
            <StyledButton
              variant="primary"
              name={loading ? "Saving..." : "Save"}
              type="submit"
              disabled={loading || fetching}
            />
          </Stack>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default AddCategory;

