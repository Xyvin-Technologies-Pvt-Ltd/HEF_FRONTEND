import React from "react";
import { Grid, Stack, Typography, Box } from "@mui/material";
import { ReactComponent as EmailIcon } from "../assets/icons/CalendarIcon.svg";
import { ReactComponent as LocationIcon } from "../assets/icons/LocationIcon.svg";
import moment from "moment";

const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "#FFC107"; // Yellow
    case "live":
      return "#2E7D32"; // Green
    case "completed":
      return "#1976D2"; // Blue
    case "cancelled":
      return "#D32F2F"; // Red
    default:
      return "#000000"; // Default border color
  }
};

const EventCard = ({ user }) => {
  const formatDate = (date) => {
    return date ? moment.utc(date).format("DD-MM-YYYY") : "-";
  };

  return (
    <Grid
      container
      spacing={2}
      bgcolor={"white"}
      borderRadius={"12px"}
      minHeight={"220px"}
      position="relative"
    >
      <Grid
        item
        md={12}
        xs={12}
        lg={6}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <img
          src={user?.image}
          alt="img"
          width={"192px"}
          height={"200px"}
          style={{ borderRadius: "12px" ,objectFit:"cover"}}
        />
      </Grid>

      <Grid
        item
        md={12}
        xs={12}
        lg={6}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Stack spacing={"10px"}>
          <Typography variant="h7" color={"#EB5860"}>
            {user?.eventName}
          </Typography>

          <Typography
            variant="h7"
            color="#2E7D32"
            sx={{
              padding: "0px 6px",
              borderRadius: "12px",
              border: "1px solid #2E7D32",
              width: "fit-content",
            }}
          >
            {user?.type}
          </Typography>

          <Stack direction="row" alignItems="center" spacing={1}>
            <EmailIcon />
            <Typography variant="h7" color={"textTertiary"}>
              {formatDate(user?.startDate)} - {formatDate(user?.endDate)}
            </Typography>
          </Stack>
          {user?.venue && (
            <Stack direction="row" alignItems="flex-start" spacing={1}>
              <LocationIcon />
              <Typography variant="h7" color={"textTertiary"}>
                {user?.venue}
              </Typography>
            </Stack>
          )}
          <Typography
            variant="h7"
            color="#2E7D32"
            sx={{
              padding: "0px 6px",
              borderRadius: "12px",
              border: "1px solid",
              borderColor: getStatusColor(user?.status),
              color: getStatusColor(user?.status),
              width: "fit-content",
              textTransform: "capitalize",
            }}
          >
            {user?.status}
          </Typography>

          {user?.platform && (
            <Stack direction="row" alignItems="flex-start" spacing={1}>
              <Typography variant="h7" color={"textTertiary"}>
                {user?.platform}
              </Typography>
            </Stack>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default EventCard;
