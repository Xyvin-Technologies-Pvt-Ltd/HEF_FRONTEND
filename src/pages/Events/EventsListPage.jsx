import { Box, Grid, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import EventList from "../../components/Event/EventList";
import AddEvent from "../../components/Event/AddEvent";

const EventListpage = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <>
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
        <Tab label="Events" />
        <Tab label="Add Events" />
      </Tabs>
      <Box padding="15px" marginBottom={4}>
        {selectedTab === 0 && (
          <Grid spacing={2}>
            <EventList />
          </Grid>
        )}
        {selectedTab === 1 && (
          <Grid container>
            <Grid item md={8}>
              <AddEvent setSelectedTab={setSelectedTab} />
            </Grid>
          </Grid>
        )}
      </Box>
    </>
  );
};

export default EventListpage;
