import { Box, Grid, Stack, Tab, Tabs, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import AdminManagement from "./AdminManagement.jsx";
import RoleManagement from "./RoleManagement.jsx";
import AdminActivity from "./AdminActivity.jsx";
import { useAdminStore } from "../../store/adminStore.js";

const SettingsPage = () => {
  const { singleAdmin } = useAdminStore();
  const canViewRoles = singleAdmin?.role?.permissions?.includes(
    "roleManagement_view"
  );

  const tabs = [];
  const tabComponents = [];

  tabs.push("Admin Management");
  tabComponents.push(<AdminManagement />);
  if (canViewRoles) {
    tabs.push("Role Management");
    tabComponents.push(<RoleManagement />);
  }
  tabs.push("Admin Activity");
  tabComponents.push(<AdminActivity />);
  const storedTab = parseInt(localStorage.getItem("settingTab") || "0", 10);
  const [selectedTab, setSelectedTab] = useState(
    storedTab >= tabs.length ? 0 : storedTab
  );
  useEffect(() => {
    if (storedTab >= tabs.length) {
      localStorage.setItem("settingTab", "0");
    }
  }, [tabs.length, storedTab]);
  const handleChange = (event, newValue) => {
    localStorage.setItem("settingTab", newValue);
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
        {tabs.map((label, index) => (
          <Tab key={index} label={label} />
        ))}
      </Tabs>
      <Box padding="15px" marginBottom={4}>
        <Grid container>
          <Grid item md={12}>
            {tabComponents[selectedTab]}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default SettingsPage;
