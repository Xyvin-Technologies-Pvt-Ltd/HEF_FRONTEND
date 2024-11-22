import React from "react";
import { Box, Grid,  Stack, Typography } from "@mui/material";
import AddMember from "../../components/Member/AddMember";

const AddMemberPage = () => {
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
            Add Member
          </Typography>
        </Stack>
      </Stack>
      <Grid container padding={"15px"}>
        <Grid item xs={12} md={8}>
          <AddMember />
        </Grid>
      </Grid>
    </>
  );
};

export default AddMemberPage;
