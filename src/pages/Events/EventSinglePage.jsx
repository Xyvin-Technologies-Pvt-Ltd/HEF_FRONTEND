import React, { useEffect, useState } from "react";
import { Box, Grid, Skeleton, Tab, Tabs, Typography } from "@mui/material";
import SpeakerTable from "../../components/Event/SpeakerTable";
import RsvpTable from "../../components/Event/RsvpTable";
import CancelEvent from "../../components/Event/CancelEvent";
import { useParams } from "react-router-dom";
import PostponeEvent from "../../components/Event/PostponeEvent";
import { StyledButton } from "../../ui/StyledButton";
import EventCard from "../../ui/EventCard";
import { useEventStore } from "../../store/eventStore";
import OrganinserCard from "../../components/Event/OrganinserCard";

const EventSinglePage = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [postponeOpen, setPostponeOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [isChange, setIsChange] = useState(false);
  const { loading } = useEventStore();
  const { id } = useParams();

  const { fetchEventById, event } = useEventStore();
  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handlePostpone = () => {
    setPostponeOpen(true);
  };
  const handleClosePostpone = () => {
    setPostponeOpen(false);
  };
  const handleCancel = () => {
    setCancelOpen(true);
  };
  const handleCloseCancel = () => {
    setCancelOpen(false);
  };
  const handleIsChange = () => {
    setIsChange(!isChange);
  };
  useEffect(() => {
    fetchEventById(id);
  }, [id, isChange]);
  return (
    <>
      {" "}
      <Box
        padding={"10px"}
        bgcolor={"#FFFFFF"}
        height={"70px"}
        display={"flex"}
        alignItems={"center"}
      >
        <Grid container alignItems="center">
          <Grid item xs={6}>
            <Typography variant="h4" color={"textSecondary"}>
              Events / {event?.eventName}
            </Typography>
          </Grid>
          <Grid item xs={6} container justifyContent="flex-end" spacing={2}>
            {event?.status === "pending" && (
              <>
                <Grid item>
                  <StyledButton
                    name="Cancel"
                    variant="secondary"
                    onClick={handleCancel}
                  />
                </Grid>
                <Grid item>
                  <StyledButton
                    name="Postpone"
                    variant="primary"
                    onClick={handlePostpone}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      </Box>{" "}
      <Box padding="30px" marginBottom={4}>
        <Grid container alignItems="center" spacing={4}>
          {loading ? (
            <Grid item md={6}>
              <Skeleton variant="rectangular" width="100%" height={200} />
            </Grid>
          ) : (
            <>
              <Grid item md={6}>
                <EventCard user={event} />
              </Grid>
              <Grid item md={6} xs={12}>
                <OrganinserCard data={event} />
              </Grid>
            </>
          )}
        </Grid>
      </Box>
      <Box marginBottom={4}>
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          aria-label="tabs"
          TabIndicatorProps={{
            style: {
              backgroundColor: "#F58220",
              height: 4,
              borderRadius: "4px",
            },
          }}
          sx={{
            bgcolor: "white",
            paddingTop: "24px",
            "& .MuiTabs-indicator": {
              backgroundColor: "#F58220",
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontSize: "16px",
              fontWeight: 600,
              color: "#686465",
            },
            "& .MuiTab-root.Mui-selected": {
              color: "#F58220",
            },
          }}
        >
          <Tab label="Speaker List" />
          <Tab label="RSVP list" />
        </Tabs>
      </Box>{" "}
      <Box padding="15px" paddingTop={0} marginBottom={4}>
        {selectedTab === 0 && (
          <Grid>
            <SpeakerTable data={event?.speakers} />
          </Grid>
        )}{" "}
        {selectedTab === 1 && (
          <Grid>
            <RsvpTable data={event?.rsvp} />
          </Grid>
        )}
      </Box>{" "}
      <PostponeEvent
        open={postponeOpen}
        onClose={handleClosePostpone}
        onChange={handleIsChange}
        data={event}
      />
      <CancelEvent
        open={cancelOpen}
        onClose={handleCloseCancel}
        onChange={handleIsChange}
        data={event}
      />
    </>
  );
};

export default EventSinglePage;
