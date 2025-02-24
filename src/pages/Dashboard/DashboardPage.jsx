import { Box, Grid, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ReactComponent as RevenueIcon } from "../../assets/icons/RevenueIcon.svg";
import { ReactComponent as ActiveMemberIcon } from "../../assets/icons/ActiveMemberIcon.svg";
import { ReactComponent as PremiumIcon } from "../../assets/icons/PremiumIcon.svg";
import { ReactComponent as FrozenIcon } from "../../assets/icons/FrozenIcon.svg";
import { ReactComponent as EventsIcon } from "../../assets/icons/EventsIcon.svg";
import { ReactComponent as NewsIcon } from "../../assets/icons/NewsIcon.svg";
import { ReactComponent as NotificationIcon } from "../../assets/icons/NotificationsIcon.svg";
import { ReactComponent as PromotionIcon } from "../../assets/icons/PromotionIcon.svg";
import { ReactComponent as StateIcon } from "../../assets/icons/StateIcon.svg";
import { ReactComponent as ZoneIcon } from "../../assets/icons/ZoneIcon.svg";
import { ReactComponent as DistrictIcon } from "../../assets/icons/DistrictIcon.svg";
import { ReactComponent as ChapterIcon } from "../../assets/icons/ChapterIcon.svg";

import moment from "moment";
import { DashboardCard } from "../../components/Dashboard/DashboardCard";
import ActivityCharts from "../../components/Dashboard/ActivityCharts";
import TopMemberList from "../../components/Dashboard/TopMemberList";
import { getDashboard } from "../../api/adminapi";
import { useNavigate } from "react-router-dom";
import { useMemberStore } from "../../store/Memberstore";

const DashboardPage = () => {
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { setMemStatus, setMemInstalled } = useMemberStore();
  const totalRevenue = {
    title: "MemberShip Revenue",
    amount: `₹ ${data?.memberShipRevenue ? data?.memberShipRevenue : 0}`,
    icon: RevenueIcon,
  };

  const activeMember = {
    title: "Business",
    amount: data?.businessCount,
    icon: ActiveMemberIcon,
  };
  const premiumMember = {
    title: "1 on 1 meetings",
    amount: data?.oneVOneMeetingCount,
    icon: PremiumIcon,
  };
  const frozenMember = {
    title: "Referrals",
    amount: data?.referralsCount,
    icon: FrozenIcon,
  };
  const events = {
    title: "Events",
    amount: data?.eventCount,
    icon: EventsIcon,
  };
  const news = {
    title: "News",
    amount: data?.newsCount,
    icon: NewsIcon,
  };
  const totalCount = {
    title: "Member Count",
    amount: data?.totalUsers,
    icon: NewsIcon,
  };
  const activeUsers = {
    title: "Active Users",
    amount: data?.activeUsers,
    icon: NewsIcon,
  };
  const inactiveUsers = {
    title: "Inactive Users",
    amount: data?.inactiveUsers,
    icon: NewsIcon,
  };
  const installedUsers = {
    title: "Installed Users",
    amount: data?.installedUsers,
    icon: NewsIcon,
  };
  const notifications = {
    title: "Notifications",
    amount: data?.notificationCount,
    icon: NotificationIcon,
  };
  const promotions = {
    title: "Promotions",
    amount: data?.promotionCount,
    icon: PromotionIcon,
  };
  const states = {
    title: "State PST Users",
    amount: data?.statePST,
    icon: StateIcon,
  };
  const zones = {
    title: "Zone PST Users",
    amount: data?.zonePST,
    icon: ZoneIcon,
  };
  const districts = {
    title: "District PST Users",
    amount: data?.districtPST,
    icon: DistrictIcon,
  };
  const chapters = {
    title: "Chapter PST Users",
    amount: data?.chapterPST,
    icon: ChapterIcon,
  };
  const fetchData = async () => {
    try {
      const response = await getDashboard();
      setData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const selectedMonth = moment(date).format("MM");
    const selectedYear = moment(date).format("YYYY");
    setMonth(Number(selectedMonth));
    setYear(Number(selectedYear));
  };
  useEffect(() => {
    fetchData();
  }, []);
  const fetchInstalled = async () => {
    setMemStatus(null);
    setMemInstalled(true);
    navigate(`/members`);
  };
  const fetchStatus = async (status) => {
    setMemStatus(status);
    setMemInstalled(null);
    navigate(`/members`);
  };
  return (
    <>
      <Box
        padding={"10px"}
        bgcolor={"#FFFFFF"}
        height={"70px"}
        display={"flex"}
        alignItems={"center"}
      >
        <Typography variant="h4" color={"#4A4647"}>
          Dashboard
        </Typography>
      </Box>
      <Grid container padding={"15px"} paddingTop={3} spacing={4}>
        <Grid item md={6}>
          <Stack direction={"row"} spacing={2}>
            {" "}
            <Box width={"100%"}>
              {" "}
              <DashboardCard
                data={totalRevenue}
                height={"185px"}
                // isDate
                // onDateChange={handleDateChange}
                // selectedDate={selectedDate}
                isMobile
              />
            </Box>{" "}
          </Stack>
        </Grid>
        <Grid item md={6}>
          {" "}
          <Stack direction={"row"} spacing={2}>
            {" "}
            <Box
              width={"100%"}
              sx={{ cursor: "pointer" }}
              onClick={() => {
                navigate("/activity", { state: { tab: 1 } });
              }}
            >
              {" "}
              <DashboardCard
                isMobile
                data={activeMember}
                height={"185px"}
              />{" "}
            </Box>{" "}
            <Box
              width={"100%"}
              sx={{ cursor: "pointer" }}
              onClick={() => {
                navigate("/activity", { state: { tab: 2 } });
              }}
            >
              {" "}
              <DashboardCard
                isMobile
                data={premiumMember}
                height={"185px"}
              />{" "}
            </Box>
            <Box
              width={"100%"}
              sx={{ cursor: "pointer" }}
              onClick={() => {
                navigate("/activity", { state: { tab: 3 } });
              }}
            >
              {" "}
              <DashboardCard
                isMobile
                data={frozenMember}
                height={"185px"}
              />{" "}
            </Box>
          </Stack>
        </Grid>{" "}
        <Grid item md={8}>
          <ActivityCharts data={data?.graph} />
        </Grid>{" "}
        <Grid item md={4}>
          <TopMemberList userData={data?.topPerformers} />
        </Grid>
        <Grid item md={6}>
          <Stack spacing={2}>
            <Stack direction={"row"} spacing={2}>
              {" "}
              <Box width={"100%"}>
                {" "}
                <DashboardCard data={states} height={"160px"} />{" "}
              </Box>{" "}
              <Box width={"100%"}>
                {" "}
                <DashboardCard data={zones} height={"160px"} />{" "}
              </Box>
            </Stack>

            <Stack direction={"row"} spacing={2}>
              {" "}
              <Box width={"100%"}>
                {" "}
                <DashboardCard data={districts} height={"160px"} />{" "}
              </Box>{" "}
              <Box width={"100%"}>
                {" "}
                <DashboardCard data={chapters} height={"160px"} />{" "}
              </Box>
            </Stack>
            <Stack direction={"row"} spacing={2}>
              {" "}
              <Box
                width={"100%"}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  navigate("/members");
                }}
              >
                {" "}
                <DashboardCard data={totalCount} height={"160px"} />{" "}
              </Box>{" "}
              <Box
                width={"100%"}
                sx={{ cursor: "pointer" }}
                onClick={fetchInstalled}
              >
                {" "}
                <DashboardCard data={installedUsers} height={"160px"} />{" "}
              </Box>
            </Stack>
          </Stack>
        </Grid>
        <Grid item md={6}>
          <Stack spacing={2}>
            <Stack direction={"row"} spacing={2}>
              {" "}
              <Box
                width={"100%"}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  navigate("/events/list");
                }}
              >
                {" "}
                <DashboardCard data={events} height={"160px"} />{" "}
              </Box>{" "}
              <Box
                width={"100%"}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  navigate("/news");
                }}
              >
                {" "}
                <DashboardCard data={news} height={"160px"} />{" "}
              </Box>
            </Stack>
            <Stack direction={"row"} spacing={2}>
              {" "}
              <Box
                width={"100%"}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  navigate("/notifications");
                }}
              >
                {" "}
                <DashboardCard data={notifications} height={"160px"} />{" "}
              </Box>{" "}
              <Box
                width={"100%"}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  navigate("/promotions");
                }}
              >
                {" "}
                <DashboardCard data={promotions} height={"160px"} />{" "}
              </Box>
            </Stack>
            <Stack direction={"row"} spacing={2}>
              {" "}
              <Box
                width={"100%"}
                sx={{ cursor: "pointer" }}
                onClick={() => fetchStatus("inactive")}
              >
                
                {" "}
                <DashboardCard data={inactiveUsers} height={"160px"} />{" "}
              </Box>{" "}
              <Box
                width={"100%"}
                sx={{ cursor: "pointer" }}
                onClick={() => fetchStatus("active")}
              >
                {" "}
                <DashboardCard data={activeUsers} height={"160px"} />{" "}
              </Box>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

export default DashboardPage;
