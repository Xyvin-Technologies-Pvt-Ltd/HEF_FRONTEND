import { Box, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import Promotionform from "../../components/Promotion/PromotionForm";

const EditPromotion = () => {
  const isUpdate = true;
  return (
    <>
      <Box
        padding={"10px"}
        height={"70px"}
        display={"flex"}
        alignItems={"center"}
        bgcolor={"#FFFFFF"}
      >
        <Grid container alignItems="center">
          <Grid item xs={6} spacing={2}>
            <Typography variant="h4" color={"#4A4647"}>
              Edit Promotion
            </Typography>
          </Grid>{" "}
        </Grid>
      </Box>
      <Box padding="15px" marginBottom={4}>
        <Grid container>
          <Grid item md={6}>
            <Promotionform isUpdate={isUpdate} />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default EditPromotion;
