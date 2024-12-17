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

const DashboardPage = () => {
  const [data, setData] = useState({});
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const totalRevenue = {
    title: "MemberShip Revenue",
    amount: `₹ ${data?.totalRevenue ? data?.totalRevenue : 0}`,
    icon: RevenueIcon,
    percentage: `${
      data?.totalRevenuePercentage ? data?.totalRevenuePercentage : 0
    }`,
  };

  const activeMember = {
    title: "Business",
    amount: data?.activeUserCount,
    icon: ActiveMemberIcon,
  };
  const premiumMember = {
    title: "1 on 1 meetings",
    amount: data?.activePremiumUserCount,
    icon: PremiumIcon,
  };
  const frozenMember = {
    title: "Referrals",
    amount: data?.suspendedUserCount,
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
  const notifications = {
    title: "Notifications",
    amount: 0,
    icon: NotificationIcon,
  };
  const promotions = {
    title: "Promotions",
    amount: data?.promotionCount,
    icon: PromotionIcon,
  };
  const states = {
    title: "State PST Users",
    amount: data?.eventCount,
    icon: StateIcon,
  };
  const zones = {
    title: "Zone PST Users",
    amount: data?.newsCount,
    icon: ZoneIcon,
  };
  const districts = {
    title: "District PST Users",
    amount: 0,
    icon: DistrictIcon,
  };
  const chapters = {
    title: "Chapter PST Users",
    amount: data?.promotionCount,
    icon: ChapterIcon,
  };
  // const fetchData = async () => {
  //   try {
  //     const response = await getDashboard(year, month);
  //     setData(response.data);
  //   } catch (error) {
  //     console.error("Error fetching dashboard data:", error);
  //   }
  // };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const selectedMonth = moment(date).format("MM");
    const selectedYear = moment(date).format("YYYY");
    setMonth(Number(selectedMonth));
    setYear(Number(selectedYear));
  };
  // useEffect(() => {
  //   fetchData();
  // }, [month, year]);

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
            <Box width={"100%"}>
              {" "}
              <DashboardCard
                isMobile
                data={activeMember}
                height={"185px"}
              />{" "}
            </Box>{" "}
            <Box width={"100%"}>
              {" "}
              <DashboardCard
                isMobile
                data={premiumMember}
                height={"185px"}
              />{" "}
            </Box>
            <Box width={"100%"}>
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
          <ActivityCharts />
        </Grid>{" "}
        <Grid item md={4}>
          <TopMemberList/>
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
          </Stack>
        </Grid>
        <Grid item md={6}>
          <Stack spacing={2}>
            <Stack direction={"row"} spacing={2}>
              {" "}
              <Box width={"100%"}>
                {" "}
                <DashboardCard data={events} height={"160px"} />{" "}
              </Box>{" "}
              <Box width={"100%"}>
                {" "}
                <DashboardCard data={news} height={"160px"} />{" "}
              </Box>
            </Stack>
            <Stack direction={"row"} spacing={2}>
              {" "}
              <Box width={"100%"}>
                {" "}
                <DashboardCard data={notifications} height={"160px"} />{" "}
              </Box>{" "}
              <Box width={"100%"}>
                {" "}
                <DashboardCard data={promotions} height={"160px"} />{" "}
              </Box>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

export default DashboardPage;
