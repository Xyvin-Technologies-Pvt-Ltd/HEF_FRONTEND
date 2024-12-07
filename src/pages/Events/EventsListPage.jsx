import { Box, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import EventList from "../../components/Event/EventList";
import MenuIcon from "@mui/icons-material/Menu";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { StyledButton } from "../../ui/StyledButton";
import EventView from "./EventView";
import { useNavigate } from "react-router-dom";

const EventListpage = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);

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
            Events
          </Typography>
        </Stack>
        <Stack direction={"row"} spacing={2}>
          <StyledButton
            variant={"primary"}
            name={"Add Event"}
            onClick={() => {
              navigate("/events/add");
            }}
          />
        </Stack>
      </Stack>{" "}
      <Box padding="15px">
        <Stack spacing={2} direction="row" justifyContent="flex-end">
          <Box
            bgcolor={selectedTab === 0 ? "#FFF0E2" : "#FFFFFF"}
            borderRadius="50%"
            width="48px"
            height="48px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSelectedTab(0);
            }}
          >
            <MenuIcon
              style={{
                color: selectedTab === 1 ? "#292D32" : "#F58220",
              }}
            />
          </Box>
          <Box
            bgcolor={selectedTab === 1 ? "#FFF0E2" : "#FFFFFF"}
            borderRadius="50%"
            width="48px"
            height="48px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSelectedTab(1);
            }}
          >
            <CalendarMonthIcon
              style={{
                color: selectedTab === 0 ? "#292D32" : "#F58220",
              }}
            />
          </Box>
        </Stack>
        {selectedTab === 0 ? <EventList /> : <EventView />}
      </Box>
    </>
  );
};

export default EventListpage;
