import React, { useState } from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";
import AddMember from "../../components/Member/AddMember";
import { StyledButton } from "../../ui/StyledButton";
import BulkAdd from "../../components/Member/BulkAdd";

const AddMemberPage = () => {
  const [bulk, setBulk] = useState(false);

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
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          width={"100%"}
        >
          <Typography variant="h4" color="textSecondary">
            Member
          </Typography>
          <StyledButton
            name={bulk ? "Single Add " : "Bulk Upload"}
            variant={"primary"}
            onClick={() => setBulk(!bulk)}
          />
        </Stack>
      </Stack>
      <Grid container padding={"15px"}>
        <Grid item xs={12} md={8}>
          {bulk ? <BulkAdd /> : <AddMember />}
        </Grid>
      </Grid>
    </>
  );
};

export default AddMemberPage;
