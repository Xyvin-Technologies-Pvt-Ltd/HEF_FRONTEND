import { Box, Stack, Tab, Tabs, Typography } from "@mui/material";
import React, { useState } from "react";
import MemberList from "./MemberList";
import MemberAccess from "./MemberAccess";
import { StyledButton } from "../../ui/StyledButton";

import { ReactComponent as AddIcon } from "../../assets/icons/AddIcon.svg";
import { useNavigate } from "react-router-dom";
import { getMember } from "../../api/memberapi";

const MemberPage = () => {
  const storedTab = localStorage.getItem("memberTab");

  const [selectedTab, setSelectedTab] = useState(
    storedTab ? Number(storedTab) : 0
  );
  const handleChange = (event, newValue) => {
    localStorage.setItem("memberTab", newValue);
    setSelectedTab(newValue);
  };
  const navigate = useNavigate();

  return (
    <>
      <Stack
        direction={"row"}
        padding={"10px"}
        bgcolor={"#fff"}
        height={"70px"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Stack>
          <Typography variant="h4" color="textSecondary">
            Users
          </Typography>
        </Stack>
        <Stack direction={"row"} spacing={2}>
          <StyledButton
            variant={"primary"}
            name={
              <>
                <AddIcon />
                Add User
              </>
            }
            onClick={() => {
              navigate("/members/member");
            }}
          />
        </Stack>
      </Stack>
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
          marginTop: "20px",
          bgcolor: "white",
          paddingTop: "4px",
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
        <Tab label="User Details" />

        <Tab label="Accesses" />
      </Tabs>
      <Box padding="15px" marginBottom={4}>
        {selectedTab === 0 && <MemberList />}
        {selectedTab === 1 && <MemberAccess />}
      </Box>
    </>
  );
};

export default MemberPage;
