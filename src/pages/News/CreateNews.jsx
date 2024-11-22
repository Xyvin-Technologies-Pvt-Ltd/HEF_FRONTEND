import { Grid, Stack, Typography } from "@mui/material";
import React from "react";
import AddNews from "../../components/News/AddNews";

const CreateNews = () => {
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
            Create News
          </Typography>
        </Stack>
      </Stack>

      <Grid container padding={"15px"}>
        <Grid item md={8}>
          <AddNews />
        </Grid>
      </Grid>
    </>
  );
};

export default CreateNews;
