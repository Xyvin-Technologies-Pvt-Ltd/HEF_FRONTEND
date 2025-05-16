import { Box, Grid, Stack, Tab, Tabs, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import EmailNotification from "../../components/Notification/EmailNotification";
import InAppNotification from "../../components/Notification/InAppNotification";
import NotificationLog from "./NotificationLog";
import { useAdminStore } from "../../store/adminStore";

const Notificationpage = () => {
  const { singleAdmin } = useAdminStore();
  const canManageNotifications = singleAdmin?.role?.permissions?.includes(
    "notificationManagement_modify"
  );

  const tabs = [];
  if (canManageNotifications) {
    tabs.push("E-mail Notifications", "In-app Notifications");
  }
  tabs.push("Notification Logs");
  const storedTab = parseInt(
    localStorage.getItem("notificationTab") || "0",
    10
  );
  const [selectedTab, setSelectedTab] = useState(
    storedTab >= tabs.length ? 0 : storedTab
  );

  useEffect(() => {
    if (storedTab >= tabs.length) {
      localStorage.setItem("notificationTab", "0");
    }
  }, [tabs.length, storedTab]);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
    localStorage.setItem("notificationTab", newValue);
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
        {tabs.map((label, index) => (
          <Tab key={index} label={label} />
        ))}
      </Tabs>
      <Box padding="15px" marginBottom={4}>
        {canManageNotifications && selectedTab === 0 && (
          <Grid container>
            <Grid item md={7}>
              <EmailNotification />
            </Grid>
          </Grid>
        )}
        {canManageNotifications && selectedTab === 1 && (
          <Grid container>
            <Grid item md={7}>
              <InAppNotification />
            </Grid>
          </Grid>
        )}
        {selectedTab === (canManageNotifications ? 2 : 0) && (
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
