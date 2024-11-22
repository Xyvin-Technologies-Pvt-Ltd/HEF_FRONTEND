import React from "react";
import { Grid, Stack, Typography, Box, Chip } from "@mui/material";
import { ReactComponent as EmailIcon } from "../assets/icons/EmailIcon.svg";
import { ReactComponent as PhoneIcon } from "../assets/icons/PhoneIcon.svg";
import { ReactComponent as LocationIcon } from "../assets/icons/LocationIcon.svg";
const CompanyCard = ({ company }) => {
  return (
    <Grid
      container
      spacing={2}
      bgcolor={"white"}
      borderRadius={"12px"}
      padding={"9px"}
      minHeight={"420px"}
    >
      <Grid item xs={12} display="flex" alignItems="center">
        <img
          src={company?.company?.logo}
          alt="img"
          width={"50px"}
          height={"50px"}
          style={{ borderRadius: "12px", marginRight: "16px" }}
        />
        <Box>
          <Typography variant="h4" color="#000000" mt={1}>
            {company?.company?.name}
          </Typography>
          <Typography variant="h7" color="#000000" mt={1}>
            {company?.company?.designation}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Stack spacing={"14px"}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Stack>
              {" "}
              <PhoneIcon />{" "}
            </Stack>
            <Typography variant="h7" color={"textTertiary"}>
              {company?.company?.phone}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="flex-start" spacing={1}>
            <Stack>
              {" "}
              <LocationIcon />{" "}
            </Stack>
            <Typography variant="h7" color={"textTertiary"}>
              {company?.company?.address}
            </Typography>
          </Stack>{" "}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default CompanyCard;
