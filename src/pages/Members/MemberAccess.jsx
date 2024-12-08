import { Box, Grid, Stack, Typography } from "@mui/material";
import React from "react";
import StyledSwitch from "../../ui/StyledSwitch";

const MemberAccess = () => {
  return (
    <Grid container spacing={2} minHeight={"420px"}>
      <Box
        width={"50%"}
        bgcolor={"white"}
        padding={4}
        margin={2}
        borderRadius={"12px"}
      >
        <Typography variant="h4" color="#00" mb={3}>
          User Access
        </Typography>
        <Stack direction={"row"} mb={2} justifyContent={"space-between"}>
          <Typography variant="h6" color="#6F7782">
            Send Notifications
          </Typography>
          <StyledSwitch checked={true}/>
        </Stack>
        <Stack direction={"row"} mb={2} justifyContent={"space-between"}>
          <Typography variant="h6" color="#6F7782">
            Post Requirements
          </Typography>
          <StyledSwitch />
        </Stack>
        <Stack direction={"row"} mb={2} justifyContent={"space-between"}>
          <Typography variant="h6" color="#6F7782">
            Add Awards
          </Typography>
        </Stack>{" "}
        <Stack direction={"row"} mb={2} justifyContent={"space-between"}>
          <Typography variant="h6" color="#6F7782">
            Add Certificates
          </Typography>
        </Stack>{" "}
        <Stack direction={"row"} mb={2} justifyContent={"space-between"}>
          <Typography variant="h6" color="#6F7782">
            Add Social media Handles
          </Typography>
        </Stack>
      </Box>
    </Grid>
  );
};

export default MemberAccess;
