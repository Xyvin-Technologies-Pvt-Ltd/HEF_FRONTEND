import { Box, FormHelperText, Grid, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyledButton } from "../../ui/StyledButton";
import StyledInput from "../../ui/StyledInput";
import { StyledEventUpload } from "../../ui/StyledEventUpload";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import StyledSelectField from "../../ui/StyledSelectField";
import { useProductStore } from "../../store/productStore";
import { toast } from "react-toastify";
import { upload } from "../../api/adminapi";

const AddProduct = () => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const location = useLocation();
  const { productId, isUpdate } = location.state || {};
  const { addProduct, updateProduct, fetchProductById, product } =
    useProductStore();
  const [imageFile, setImageFile] = useState(null);
  useEffect(() => {
    if (isUpdate && productId) {
      fetchProductById(productId);
    }
  }, [productId, isUpdate]);

  const units = [
    { value: "Kg", label: "Kg" },
    { value: "Ltr", label: "Ltr" },
  ];
  const tagOptions = [
    { value: "latest", label: "Latest" },
    { value: "currentAffairs", label: "Current Affairs" },
    { value: "trending", label: "Trending" },
    { value: "entertainment", label: "Entertainment" },
    { value: "history", label: "History" },
  ];
  useEffect(() => {
    if (product && isUpdate) {
      setValue("productname", product.name);
      setValue("description", product.description);
      setValue("price", product.price);
      setValue("offer_price", product.offerPrice);
      setValue("moq", product.moq);
      setValue("image", product.image);
      const sellerUnit = units.find((unit) => unit?.value === product.units);
      if (sellerUnit) {
        setValue("units", {
          value: sellerUnit.value,
          label: sellerUnit.label,
        });
      }
      const selectedTags = product?.tags?.map((Id) =>
        tagOptions.find((option) => option?.value === Id)
      );

      setValue("tags", selectedTags || []);
    }
  }, [product, isUpdate, setValue]);
  const onSubmit = async (data) => {
    try {
      setLoading(true);
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
      const formData = {
        name: data?.productname,
        image: imageUrl ? imageUrl : "",
        price: data?.price,
        description: data?.description,
        offerPrice: data?.offer_price,
        moq: data?.moq,
        tags: data?.tags.map((i) => i.value),
        units: data?.units?.value,
      };
      if (isUpdate) {
        formData.seller = product?.seller;
        await updateProduct(productId, formData);
        navigate(`/members/${product.seller}`);
      } else {
        formData.seller = id;
        await addProduct(formData);
        navigate(`/members/${id}`);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box sx={{ padding: 3 }} bgcolor={"white"} borderRadius={"12px"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography
              sx={{ marginBottom: 1 }}
              variant="h6"
              fontWeight={500}
              color={"#333333"}
            >
              Name of the product
            </Typography>
            <Controller
              name="productname"
              control={control}
              defaultValue=""
              rules={{ required: "Product Name is required" }}
              render={({ field }) => (
                <>
                  <StyledInput
                    placeholder="Enter the Product name"
                    {...field}
                  />
                  {errors.productname && (
                    <span style={{ color: "red" }}>
                      {errors.productname.message}
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
              fontWeight={500}
              color={"#333333"}
            >
              Product image
            </Typography>
            <Controller
              name="image"
              control={control}
              defaultValue=""
              rules={{ required: "Image is required" }}
              render={({ field: { onChange, value } }) => (
                <>
                  <StyledEventUpload
                    label="Upload Product Image"
                    onChange={(file) => {
                      setImageFile(file);
                      onChange(file);
                    }}
                    value={value}
                  />
                  <FormHelperText style={{ color: "#888" }}>
                    File size limit: 1 MB
                  </FormHelperText>
                  {errors.photo && (
                    <span style={{ color: "red" }}>{errors.photo.message}</span>
                  )}
                </>
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography
              sx={{ marginBottom: 1 }}
              variant="h6"
              fontWeight={500}
              color={"#333333"}
            >
              Description
            </Typography>
            <Controller
              name="description"
              control={control}
              defaultValue=""
              rules={{ required: "Product Name is required" }}
              render={({ field }) => (
                <>
                  <StyledInput
                    placeholder="Add Description in less than 500 words"
                    {...field}
                  />
                  {errors.desc && (
                    <span style={{ color: "red" }}>{errors.desc.message}</span>
                  )}
                </>
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography
              sx={{ marginBottom: 1 }}
              variant="h6"
              fontWeight={500}
              color={"#333333"}
            >
              Actual price
            </Typography>
            <Controller
              name="price"
              control={control}
              defaultValue=""
              rules={{ required: "Actual price  is required" }}
              render={({ field }) => (
                <>
                  <StyledInput placeholder="Rs 00" {...field} />
                  {errors.actual && (
                    <span style={{ color: "red" }}>
                      {errors.actual.message}
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
              fontWeight={500}
              color={"#333333"}
            >
              Offer price
            </Typography>
            <Controller
              name="offer_price"
              control={control}
              defaultValue=""
              rules={{ required: "Offer price  is required" }}
              render={({ field }) => (
                <>
                  <StyledInput placeholder="Rs 00" {...field} />
                  {errors.offer && (
                    <span style={{ color: "red" }}>{errors.offer.message}</span>
                  )}
                </>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography
              sx={{ marginBottom: 1 }}
              variant="h6"
              fontWeight={500}
              color={"#333333"}
            >
              Moq
            </Typography>
            <Controller
              name="moq"
              control={control}
              defaultValue=""
              rules={{ required: "Moq is required" }}
              render={({ field }) => (
                <>
                  <StyledInput placeholder="Enter moq" {...field} />
                  {errors.moq && (
                    <span style={{ color: "red" }}>{errors.moq.message}</span>
                  )}
                </>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography
              sx={{ marginBottom: 1 }}
              variant="h6"
              fontWeight={500}
              color={"#333333"}
            >
              Add Tags
            </Typography>

            <Controller
              name="tags"
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <>
                  <StyledSelectField
                    placeholder="Select Tag"
                    options={tagOptions}
                    isMulti
                    {...field}
                  />
                </>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography
              sx={{ marginBottom: 1 }}
              variant="h6"
              fontWeight={500}
              color={"#333333"}
            >
              Per Unit
            </Typography>
            <Controller
              name="units"
              control={control}
              defaultValue=""
              rules={{ required: "Units is required" }}
              render={({ field }) => (
                <>
                  <StyledSelectField
                    options={units}
                    placeholder="Select Unit"
                    {...field}
                  />
                  {errors.units && (
                    <span style={{ color: "red" }}>{errors.units.message}</span>
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
                name="Cancel"
                variant="secondary"
                onClick={(event) => handleClear(event)}
                style={{ width: "auto" }}
                disabled={loading}
              >
                Cancel
              </StyledButton>
              <StyledButton
                name={loading ? "Saving..." : "Save"}
                variant="primary"
                type="submit"
                disabled={loading}
              >
                Save
              </StyledButton>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddProduct;
