import { Box, Grid, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ReactComponent as RevenueIcon } from "../../assets/icons/RevenueIcon.svg";
import { ReactComponent as MembershipRevenueIcon } from "../../assets/icons/MembershipRevenueIcon.svg";
import { ReactComponent as AppRevenueIcon } from "../../assets/icons/AppRevenueIcon.svg";
import { ReactComponent as TotalProductIcon } from "../../assets/icons/TotalProductIcon.svg";
import { ReactComponent as TotalRequirementIcon } from "../../assets/icons/TotalRequirementIcon.svg";
import { ReactComponent as TotalMemberIcon } from "../../assets/icons/TotalMemberIcon.svg";
import { ReactComponent as ActiveMemberIcon } from "../../assets/icons/ActiveMemberIcon.svg";
import { ReactComponent as PremiumIcon } from "../../assets/icons/PremiumIcon.svg";
import { ReactComponent as FrozenIcon } from "../../assets/icons/FrozenIcon.svg";
import { ReactComponent as EventsIcon } from "../../assets/icons/EventsIcon.svg";
import { ReactComponent as NewsIcon } from "../../assets/icons/NewsIcon.svg";
import { ReactComponent as NotificationIcon } from "../../assets/icons/NotificationsIcon.svg";
import { ReactComponent as PromotionIcon } from "../../assets/icons/PromotionIcon.svg";

import moment from "moment";
import { DashboardCard } from "../../components/Dashboard/DashboardCard";

const DashboardPage = () => {
  const [data, setData] = useState({});
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const totalMember = {
    title: "Total KSSIA Members",
    amount: data?.userCount,
    icon: TotalMemberIcon,
  };
  const totalRevenue = {
    title: "Total Revenue",
    amount: `₹ ${data?.totalRevenue ? data?.totalRevenue : 0}`,
    icon: RevenueIcon,
    percentage: `${
      data?.totalRevenuePercentage ? data?.totalRevenuePercentage : 0
    }`,
  };
  const membershipRevenue = {
    title: "Membership Revenue",
    amount: `₹ ${
      data?.totalCategoryMembershipRevenue
        ? data?.totalCategoryMembershipRevenue
        : 0
    }`,
    icon: MembershipRevenueIcon,
    percentage: `${
      data?.membershipRevenuePercentage ? data?.membershipRevenuePercentage : 0
    }`,
  };
  const appRevenue = {
    title: "App Revenue",
    amount: `₹ ${
      data?.totalCategoryAppRevenue ? data?.totalCategoryAppRevenue : 0
    }`,
    icon: AppRevenueIcon,
    percentage: `${
      data?.appRevenuePercentage ? data?.appRevenuePercentage : 0
    }`,
  };
  const activeMember = {
    title: "Active Users",
    amount: data?.activeUserCount,
    icon: ActiveMemberIcon,
  };
  const premiumMember = {
    title: "Premium Users",
    amount: data?.activePremiumUserCount,
    icon: PremiumIcon,
  };
  const frozenMember = {
    title: "Frozen Users",
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
  const products = {
    title: "Total Products",
    amount: data?.productCount,
    icon: TotalProductIcon,
  };
  const requirements = {
    title: "Total Requirements",
    amount: data?.requirementCount,
    icon: TotalRequirementIcon,
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
          <Stack spacing={2}>
            {" "}
            <DashboardCard
              data={totalRevenue}
              isDate
              onDateChange={handleDateChange}
              selectedDate={selectedDate}
            />
            <Stack direction={"row"} spacing={2}>
              {" "}
              <Box width={"100%"}>
                {" "}
                <DashboardCard
                  isMobile
                  data={membershipRevenue}
                  isDate
                  onDateChange={handleDateChange}
                  selectedDate={selectedDate}
                />{" "}
              </Box>{" "}
              <Box width={"100%"}>
                {" "}
                <DashboardCard
                  isMobile
                  data={appRevenue}
                  isDate
                  onDateChange={handleDateChange}
                  selectedDate={selectedDate}
                />{" "}
              </Box>
            </Stack>
          </Stack>
        </Grid>

        <Grid item md={6}>
          {" "}
          <Stack spacing={2}>
            {" "}
            <DashboardCard data={totalMember} />
            <Stack direction={"row"} spacing={2}>
              {" "}
              <Box width={"100%"}>
                {" "}
                <DashboardCard isMobile data={activeMember} />{" "}
              </Box>{" "}
              <Box width={"100%"}>
                {" "}
                <DashboardCard isMobile data={premiumMember} />{" "}
              </Box>
              <Box width={"100%"}>
                {" "}
                <DashboardCard isMobile data={frozenMember} />{" "}
              </Box>
            </Stack>
          </Stack>
        </Grid>
        <Grid item md={6}>
          <Stack direction={"row"} spacing={2}>
            {" "}
            <Box width={"100%"}>
              {" "}
              <DashboardCard spacing data={products} />{" "}
            </Box>{" "}
            <Box width={"100%"}>
              {" "}
              <DashboardCard spacing data={requirements} />{" "}
            </Box>
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
