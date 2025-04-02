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
import StyledPosterTable from "../../components/Promotion/StyledPosterTable";
import StyledBannerTable from "../../components/Promotion/StyledBannerTable";
import StyledVideoTable from "../../components/Promotion/StyledVideoTable";
import StyledNoticeTable from "../../components/Promotion/StyledNoticeTable";
import { useLocation } from "react-router-dom";
const tabMapping = {
  banner: 0,
  video: 1,
  poster: 2,
  notice: 3,
};
const PromotionItem = () => {
  const location = useLocation();
  const storedTab = localStorage.getItem("promotionTab");
  const { type } = location?.state || {};

  const [selectedTab, setSelectedTab] = useState(
    storedTab !== null ? Number(storedTab) : tabMapping[type] ?? 0
  );

  useEffect(() => {
    if (type && tabMapping.hasOwnProperty(type)) {
      setSelectedTab(tabMapping[type]);
      localStorage.setItem("promotionTab", tabMapping[type]);
    }
  }, [type]);
  const handleChange = (event, newValue) => {
    localStorage.setItem("promotionTab", newValue);
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
          paddingTop: "0px",
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
        <Tab label="Banner" />
        <Tab label="Video" />
        <Tab label="Poster" />
        <Tab label="Notice" />
      </Tabs>
      <Divider />
      <Box padding="15px" marginBottom={4}>
        {selectedTab === 0 && (
          <Grid>
            <StyledBannerTable />
          </Grid>
        )}
        {selectedTab === 1 && (
          <Grid>
            <StyledVideoTable />
          </Grid>
        )}
        {selectedTab === 2 && (
          <Grid>
            <StyledPosterTable />
          </Grid>
        )}
        {selectedTab === 3 && (
          <Grid>
            <StyledNoticeTable />
          </Grid>
        )}
      </Box>
    </>
  );
};

export default PromotionItem;
