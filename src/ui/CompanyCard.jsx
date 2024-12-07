import React from "react";
import { Grid, Stack, Typography, Box, Chip } from "@mui/material";
import { ReactComponent as EmailIcon } from "../assets/icons/EmailIcon.svg";
import { ReactComponent as PhoneIcon } from "../assets/icons/PhoneIcon.svg";
import { ReactComponent as WebsiteIcon } from "../assets/icons/WebsiteIcon.svg";
import { Link } from "react-router-dom";
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
          {" "}
          <Link
            to={company?.company?.websites}
            target="_blank"
            rel="noopener noreferrer"
          >
            {company?.company?.websites}
          </Link>
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
              <EmailIcon />{" "}
            </Stack>
            <Typography variant="h7" color={"textTertiary"}>
              {company?.company?.email}
            </Typography>
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default CompanyCard;
