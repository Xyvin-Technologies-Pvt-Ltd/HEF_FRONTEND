import React from "react";
import { Box, Grid,  Stack, Typography } from "@mui/material";
import AddActivity from "../../components/Activity/AddActivity";

const AddActivityPage = () => {
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
            Activity
          </Typography>
        </Stack>
      </Stack>
      <Grid container padding={"15px"}>
        <Grid item xs={12} md={8}>
       <AddActivity/>
        </Grid>
      </Grid>
    </>
  );
};

export default AddActivityPage;
