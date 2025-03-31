import React, { useEffect, useState } from "react";
import { useListStore } from "../../store/listStore";
import { ReactComponent as LocationIcon } from "../../assets/icons/LocationIcon.svg";

import { ReactComponent as RecordIcon } from "../../assets/icons/RecordingIcon.svg";
import { ReactComponent as CalendarIcon } from "../../assets/icons/CalendarIcon.svg";
import { ReactComponent as EventIcon } from "../../assets/icons/EventDayIcon.svg";
import moment from "moment";
import {
  Dialog,
  Typography,
  Box,
  Stack,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { StyledButton } from "../../ui/StyledButton";
import { Link, useNavigate } from "react-router-dom";
import { ZoomOutMap } from "@mui/icons-material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "#FFC107";
    case "live":
      return "#2E7D32";
    case "completed":
      return "#1976D2";
    case "cancelled":
      return "#D32F2F";
    default:
      return "#000000";
  }
};

const EventView = () => {
  const { fetchEvent, lists } = useListStore();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(moment().month());
  const [currentYear, setCurrentYear] = useState(moment().year());
  const navigate = useNavigate();
  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const events = lists?.map((event) => ({
    ...event,
    start: new Date(event?.eventDate),
    day: moment(event?.eventDate)?.date(),
  }));

  const daysInMonth = moment()
    .year(currentYear)
    .month(currentMonth)
    .daysInMonth();

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setOpenDialog(true);
  };

  const closeDialog = () => {
    setSelectedEvent(null);
    setOpenDialog(false);
  };

  const handleMonthChange = (step) => {
    const newMonth = currentMonth + step;
    if (newMonth < 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else if (newMonth > 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth(newMonth);
    }
  };

  const dayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thrs", "Fri", "Sat"];
  const handleView = (e, id) => {
    e.preventDefault();
    navigate(`/events/${id}`);
  };
  const handleEdit = (id) => {
    navigate(`/events/edit/${id}`);
  };

  const formatDate = (date) => {
    return date ? moment.utc(date).format("DD-MM-YYYY") : "-";
  };
  return (
    <>
      <Box padding={"60px"} paddingTop={"20px"}>
        <Box display="flex" alignItems="center" marginBottom={2}>
          <Typography variant="h5" fontWeight="bold" marginRight={2}>
            {moment().year(currentYear).month(currentMonth).format("MMMM YYYY")}
          </Typography>
          <IconButton onClick={() => handleMonthChange(-1)} size="small">
            <ArrowDropDownIcon style={{ color: "#000" }} />
          </IconButton>
          <IconButton onClick={() => handleMonthChange(1)} size="small">
            <ArrowDropUpIcon style={{ color: "#000" }} />
          </IconButton>
        </Box>

        <Box
          display="grid"
          gridTemplateColumns="repeat(7, 1fr)"
          gap={2}
          marginBottom={2}
        >
          {dayHeaders?.map((day) => (
            <Box key={day} padding={1} bgcolor={"#F58220"} width={"130px"}>
              <Typography
                align="center"
                fontSize={"16px"}
                fontWeight={400}
                style={{
                  color: "#FFFFFF",
                }}
              >
                {day}
              </Typography>
            </Box>
          ))}
        </Box>
        <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={2}>
          {Array.from({ length: daysInMonth })?.map((_, day) => {
            const date = day + 1;
            const dayEvents = events?.filter(
              (event) =>
                moment(event?.start)?.year() === currentYear &&
                moment(event?.start)?.month() === currentMonth &&
                moment(event?.start)?.date() === date
            );

            return (
              <Stack
                key={date}
                border="1px solid #F58220"
                padding={"10px"}
                width={"130px"}
                minHeight={"108px"}
                borderRadius="10px"
                justifyContent={"space-between"}
                style={{
                  backgroundColor: dayEvents?.length ? "#FFDEC2" : "#FFF",
                }}
              >
                <Stack direction={"row"} justifyContent={"space-between"}>
                  <Typography variant="h7" color="#333333">
                    {date}
                  </Typography>
                  {dayEvents?.length > 0 && <EventIcon />}
                </Stack>
                {dayEvents?.length > 0 ? (
                  dayEvents?.map((event, index) => (
                    <Typography
                      variant="h7"
                      color="#333333"
                      key={index}
                      sx={{
                        cursor: "pointer",
                      }}
                      onClick={() => handleEventClick(event)}
                    >
                      {event?.eventName}
                    </Typography>
                  ))
                ) : (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography
                      variant="h7"
                      color="#333333"
                      sx={{
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        navigate(`/events/add`);
                      }}
                    >
                      Add Event
                    </Typography>
                    <AddCircleOutlineIcon sx={{ marginLeft: "2px" }} />
                  </Box>
                )}
              </Stack>
            );
          })}
        </Box>

        {selectedEvent && (
          <Dialog
            open={openDialog}
            onClose={closeDialog}
            fullWidth
            maxWidth="md"
          >
            <Box padding={3}>
              <Typography variant="h5" color="#EB5860" fontWeight={700}>
                {selectedEvent?.eventName}
              </Typography>
              <Stack padding={3} direction="row" spacing={2}>
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  style={{ width: "348px", height: "252px", objectFit: "fill" }}
                />
                <Stack spacing={2} width={"100%"}>
                  <Stack direction={"row"} justifyContent={"space-between"}>
                    <Typography
                      variant="h7"
                      color="#2E7D32"
                      sx={{
                        padding: "0px 6px",
                        borderRadius: "12px",
                        border: "1px solid",
                        borderColor: getStatusColor(selectedEvent?.status),
                        color: getStatusColor(selectedEvent?.status),
                        width: "fit-content",
                      }}
                    >
                      {selectedEvent?.status}
                    </Typography>
                    <ZoomOutMap
                      style={{ cursor: "pointer" }}
                      onClick={(e) => handleView(e, selectedEvent?._id)}
                    />
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CalendarIcon />
                    <Typography variant="h7" color={"textTertiary"}>
                      {formatDate(selectedEvent?.startDate)}
                    </Typography>
                  </Stack>
                  {selectedEvent?.venue && (
                    <Stack direction="row" alignItems="flex-start" spacing={1}>
                      <LocationIcon />
                      <Typography variant="h7" color={"textTertiary"}>
                        {selectedEvent?.venue}
                      </Typography>
                    </Stack>
                  )}
                  {selectedEvent?.type === "Online" && (
                    <Stack direction="row" spacing={6}>
                      <Stack spacing={1}>
                        {" "}
                        <Typography
                          variant="h6"
                          fontWeight={700}
                          color={"#000"}
                        >
                          Event platform
                        </Typography>
                        <Stack direction={"row"} spacing={1}>
                          <RecordIcon />
                          <Typography variant="h7" color={"textTertiary"}>
                            {selectedEvent?.platform}
                          </Typography>
                        </Stack>
                      </Stack>
                      <Stack spacing={1}>
                        {" "}
                        <Typography
                          variant="h6"
                          fontWeight={700}
                          color={"#000"}
                        >
                          Link
                        </Typography>
                        <Stack direction={"row"} spacing={1}>
                          {" "}
                          <InsertLinkIcon />
                          <Link
                            to={selectedEvent?.link}
                            style={{ textDecoration: "none" }}
                          >
                            {" "}
                            <Typography variant="h7" color={"textTertiary"}>
                              {selectedEvent?.platform}
                            </Typography>
                          </Link>
                        </Stack>
                      </Stack>
                    </Stack>
                  )}
                  <Stack spacing={1}>
                    <Typography variant="h6" fontWeight={700} color={"#000"}>
                      Description
                    </Typography>
                    <Typography variant="h7" color={"textTertiary"}>
                      {selectedEvent?.description}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
              <Stack direction={"row"}>
                <Stack width={"50%"}>
                  {" "}
                  <Typography>Speakers</Typography>
                  {selectedEvent?.speakers?.map((speaker, index) => (
                    <li
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        margin: "8px 0",
                      }}
                    >
                      {" "}
                      <Typography
                        variant="h7"
                        color="textSecondary"
                        style={{ marginRight: "8px" }}
                      >
                        {index + 1}.
                      </Typography>
                      <img
                        src={speaker?.image}
                        alt={speaker?.name}
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          marginRight: "8px",
                        }}
                      />
                      <Typography variant="h7" color="textSecondary">
                        {speaker?.name} ({speaker?.designation})
                      </Typography>
                    </li>
                  ))}
                </Stack>
                <Stack width={"50%"}>
                  {" "}
                  <Typography>Coordinators</Typography>
                  {selectedEvent?.coordinator?.map((speaker, index) => (
                    <li
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        margin: "8px 0",
                      }}
                    >
                      {" "}
                      <Typography
                        variant="h7"
                        color="textSecondary"
                        style={{ marginRight: "8px" }}
                      >
                        {index + 1}.
                      </Typography>
                      <img
                        src={speaker?.image}
                        alt={speaker?.name}
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          marginRight: "8px",
                        }}
                      />
                      <Typography variant="h7" color="textSecondary">
                        {speaker?.name} 
                      </Typography>
                    </li>
                  ))}
                </Stack>
              </Stack>
            </Box>
            <DialogActions>
              <StyledButton
                type="button"
                onClick={closeDialog}
                variant={"secondary"}
                name={"Cancel"}
              />

              <StyledButton
                name={"Edit Event"}
                onClick={() => handleEdit(selectedEvent?._id)}
                variant={"primary"}
              />
            </DialogActions>
          </Dialog>
        )}
      </Box>
    </>
  );
};

export default EventView;
