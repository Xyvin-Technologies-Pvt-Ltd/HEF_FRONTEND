import { Box, Grid, Stack, Tab, Tabs, Typography } from "@mui/material";
import React, { useState } from "react";
import Promotionform from "../../components/Promotion/PromotionForm.jsx";

const Createpromotion = () => {
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
            Create Promotion
          </Typography>
        </Stack>
      </Stack>

      <Grid container padding={"15px"}>
        <Grid item md={8}>
          <Promotionform />
        </Grid>
      </Grid>
    </>
  );
};

export default Createpromotion;
