import React from "react";
import { Grid, Stack, Typography, Box, Chip } from "@mui/material";
import { ReactComponent as EmailIcon } from "../assets/icons/EmailIcon.svg";
import { ReactComponent as PhoneIcon } from "../assets/icons/PhoneIcon.svg";
import { ReactComponent as WebsiteIcon } from "../assets/icons/WebsiteIcon.svg";
import { Link } from "react-router-dom";
const CompanyCard = ({ companies }) => {
  return (
    <Grid
      container
      spacing={2}
      bgcolor={"white"}
      borderRadius={"12px"}
      padding={"16px"}
    >
      <Typography variant="h4" color="#000000" mb={2}>
        Companies
      </Typography>
      {companies?.map((company) => (
        <Grid
          item
          xs={12}
          key={company?._id}
          borderBottom="1px solid #E0E0E0"
          paddingBottom="12px"
          marginBottom="12px"
        >
          <Box>
            <Typography variant="h5" color="#000000" mt={1}>
              {company?.name}
            </Typography>
            {company?.designation && (
              <Typography variant="h6" color="#000000" mt={0.5}>
                {company?.designation}
              </Typography>
            )}
          </Box>
          <Stack spacing={1} mt={2}>
            <Link
              to={company?.websites}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1E88E5", textDecoration: "none" }}
            >
              {company?.websites}
            </Link>
            <Stack direction="row" alignItems="center" spacing={1}>
              <PhoneIcon />
              <Typography variant="body2" color="textSecondary">
                {company?.phone}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <EmailIcon />
              <Typography variant="body2" color="textSecondary">
                {company?.email}
              </Typography>
            </Stack>
          </Stack>
        </Grid>
      ))}
    </Grid>
  );
};

export default CompanyCard;
