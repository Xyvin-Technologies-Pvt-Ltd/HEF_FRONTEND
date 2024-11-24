import React from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";
import LevelAdd from "../../components/Level/LevelAdd";

const AddLevelPage = () => {
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
            Level
          </Typography>
        </Stack>
      </Stack>
      <Grid container padding={"15px"}>
        <Grid item xs={12} md={8}>
          <LevelAdd/>
        </Grid>
      </Grid>
    </>
  );
};

export default AddLevelPage;
