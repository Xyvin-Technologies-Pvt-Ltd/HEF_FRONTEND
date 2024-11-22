import { Box, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import AddNews from "../../components/News/AddNews.jsx";

const EditNews = () => {
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
              News List / Edit News
            </Typography>
          </Grid>{" "}
        </Grid>
      </Box>
      <Box padding="15px" marginBottom={4}>
        <Grid container>
          <Grid item md={6}>
            <AddNews  isUpdate={isUpdate}/>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default EditNews;
