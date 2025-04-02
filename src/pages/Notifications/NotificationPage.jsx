import { Box, Grid, Stack, Tab, Tabs, Typography } from "@mui/material";
import React, { useState } from "react";
import EmailNotification from "../../components/Notification/EmailNotification";
import InAppNotification from "../../components/Notification/InAppNotification";
import NotificationLog from "./NotificationLog";

const Notificationpage = () => {
  const storedTab = localStorage.getItem("notificationTab");
  const [selectedTab, setSelectedTab] = useState(storedTab ? Number(storedTab) : 0);

  const handleChange = (event, newValue) => {
    localStorage.setItem("notificationTab", newValue);
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
        <Tab label="E-mail Notifications" />
        <Tab label="In-app Notifications" />
        <Tab label="Notification Logs" />
      </Tabs>
      <Box padding="15px" marginBottom={4}>
        {selectedTab === 0 && (
          <Grid container>
            <Grid item md={7}>
              <EmailNotification />
            </Grid>
          </Grid>
        )}
        {selectedTab === 1 && (
          <Grid container>
            <Grid item md={7}>
              <InAppNotification />
            </Grid>
          </Grid>
        )}
        {selectedTab === 2 && (
          <Grid container>
            <Grid item md={12}>
              <NotificationLog />
            </Grid>
          </Grid>
        )}
      </Box>
    </>
  );
};

export default Notificationpage;
