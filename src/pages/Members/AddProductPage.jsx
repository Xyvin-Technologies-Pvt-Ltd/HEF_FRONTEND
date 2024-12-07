import React from "react";
import { Box, Grid,  Stack, Typography } from "@mui/material";
import AddProduct from "../../components/Member/AddProduct";

const AddProductPage = () => {
  return (
    <>
      <Stack
        direction={"row"}
        padding={"10px"}
        bgcolor={"#fff"}
        height={"70px"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Stack>
          <Typography variant="h4" color="textSecondary">
           Product
          </Typography>
        </Stack>
      </Stack>
      <Grid container padding={"15px"}>
        <Grid item xs={12} md={8}>
          <AddProduct />
        </Grid>
      </Grid>
    </>
  );
};

export default AddProductPage;
