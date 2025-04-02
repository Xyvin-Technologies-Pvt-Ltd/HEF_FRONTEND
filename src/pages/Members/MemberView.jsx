import {
  Box,
  Divider,
  Grid,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MemberProfile from "../../components/Member/MemberProfile";
import MemberAnalytics from "../../components/Member/MemberAnalytics";
import { useMemberStore } from "../../store/Memberstore";
import { useFeedStore } from "../../store/feedStore";
import Subscription from "./Subscription";
import MemberProducts from "../../components/Member/MemberProducts";
import MemberActivity from "../../components/Member/MemberActivity";

const MemberView = () => {
  const storedTab = localStorage.getItem("memberViewTab");
  const [selectedTab, setSelectedTab] = useState(storedTab ? Number(storedTab) : 0);
  const [isChange, setIsChange] = useState(false);
  const { id } = useParams();
  const { fetchMemberById, member, loading, refreshMember } = useMemberStore();

  const handleIsChange = () => {
    setIsChange(!isChange);
  };

  useEffect(() => {
    fetchMemberById(id);
  }, [isChange, refreshMember]);
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
      </Box>{" "}
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
        <Tab label="Profile" />
        <Tab label="Subscriptions" />
        <Tab label="Business Posts" />
        <Tab label="Activity" />
        {/* <Tab label="Analytics" /> */}
      </Tabs>
      <Box padding="15px" marginBottom={4}>
        {selectedTab === 0 && (
          <Grid spacing={2}>
            <MemberProfile data={member} loading={loading} />
          </Grid>
        )}
        {selectedTab === 1 && (
          <Grid spacing={2}>
            <Subscription id={id} loading={loading} />
          </Grid>
        )}
        {selectedTab === 2 && (
          <Grid>
            <MemberProducts id={id} />
          </Grid>
        )}
        {selectedTab === 3 && (
          <Grid>
            <MemberActivity id={id} />
          </Grid>
        )}

        {selectedTab === 4 && (
          <Grid container item xs={12}>
            {" "}
            <MemberAnalytics />
          </Grid>
        )}
      </Box>
    </>
  );
};

export default MemberView;
