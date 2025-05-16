import { Box, Divider, Grid, Tab, Tabs, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MemberProfile from "../../components/Member/MemberProfile";
import MemberAnalytics from "../../components/Member/MemberAnalytics";
import { useMemberStore } from "../../store/Memberstore";
import Subscription from "./Subscription";
import MemberProducts from "../../components/Member/MemberProducts";
import MemberActivity from "../../components/Member/MemberActivity";
import { useAdminStore } from "../../store/adminStore";

const MemberView = () => {
  const { id } = useParams();
  const { fetchMemberById, member, loading, refreshMember } = useMemberStore();
  const { singleAdmin } = useAdminStore();

  const canViewSubscriptions = singleAdmin?.role?.permissions?.includes(
    "memberManagement_modify"
  );

  const tabs = ["Profile"];
  const components = [
    <MemberProfile key="profile" data={member} loading={loading} />,
  ];

  if (canViewSubscriptions) {
    tabs.push("Subscriptions");
    components.push(
      <Subscription key="subscription" id={id} loading={loading} />
    );
  }

  tabs.push("Business Posts");
  components.push(<MemberProducts key="products" id={id} />);

  tabs.push("Activity");
  components.push(<MemberActivity key="activity" id={id} />);

  tabs.push("Analytics");
  components.push(
    <Grid container item xs={12} key="analytics">
      <MemberAnalytics />
    </Grid>
  );

  const storedTab = parseInt(localStorage.getItem("memberViewTab") || "0", 10);
  const [selectedTab, setSelectedTab] = useState(
    storedTab >= tabs.length ? 0 : storedTab
  );

  useEffect(() => {
    fetchMemberById(id);
    if (storedTab >= tabs.length) {
      localStorage.setItem("memberViewTab", "0");
    }
  }, [refreshMember, id, storedTab, tabs.length]);

  const handleChange = (event, newValue) => {
    localStorage.setItem("memberViewTab", newValue);
    setSelectedTab(newValue);
  };

  return (
    <>
      <Box
        padding={"20px"}
        bgcolor={"#FFFFFF"}
        height={"70px"}
        display={"flex"}
        alignItems={"center"}
      >
        <Typography variant="h4" color={"textSecondary"}>
          Member
        </Typography>
      </Box>
      <Divider />
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
        <Grid spacing={2}>{components[selectedTab]}</Grid>
      </Box>
    </>
  );
};

export default MemberView;
