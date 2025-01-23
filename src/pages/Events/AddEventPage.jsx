import { Box, Grid, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import AddEvent from "../../components/Event/AddEvent";

export default function AddEventPage() {
  const { id } = useParams();

  return (
    <>
      {" "}
      <Box padding={"10px"} bgcolor={"#FFFFFF"}>
        <Grid container alignItems="center">
          <Grid item xs={6}>
            <Typography variant="h4" color={"textSecondary"}>
              Events / Add event
            </Typography>
          </Grid>
          <Grid
            item
            xs={6}
            container
            justifyContent="flex-end"
            spacing={2}
            height={"70px"}
          >
            <Grid item></Grid>
            <Grid item></Grid>
          </Grid>
        </Grid>
      </Box>
      <Grid container item xs={12}>
        <Grid item xs={10} padding={2}>
          <AddEvent />
        </Grid>
      </Grid>
    </>
  );
}
