import { Box, Grid, Typography } from '@mui/material';
import React from 'react'
import { Controller, useForm } from 'react-hook-form';

const AddProduct = () => {
    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
      } = useForm();
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
            Name of the Seller
          </Typography>
          <Controller
            name="seller_id"
            control={control}
            defaultValue=""
            rules={{ required: "Seller name is required" }}
            render={({ field }) => (
              <>
                <StyledSelectField
                  placeholder="Enter Seller name"
                  options={option}
                  {...field}
                />
                {errors.seller && (
                  <span style={{ color: "red" }}>
                    {errors.seller.message}
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
                {errors.photo && (
                  <span style={{ color: "red" }}>
                    {errors.photo.message}
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
                  <span style={{ color: "red" }}>
                    {errors.desc.message}
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
                  <span style={{ color: "red" }}>
                    {errors.offer.message}
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
                <StyledInput placeholder="Select the unit" {...field} />
                {errors.unit && (
                  <span style={{ color: "red" }}>
                    {errors.unit.message}
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
              name="Cancel"
              variant="secondary"
              onClick={(event) => handleClear(event)}
              style={{ width: "auto" }}
            >
              Cancel
            </StyledButton>
            <StyledButton
              name={loading ? "Saving..." : "Save"}
              variant="primary"
              type="submit"
            >
              Save
            </StyledButton>
          </Stack>
        </Grid>
      </Grid>
    </form>
  </Box>
  )
}

export default AddProduct
