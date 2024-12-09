import React, { useEffect, useState } from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";
import StyledSwitch from "../../ui/StyledSwitch";
import { getAccess, updateAccess } from "../../api/accessapi";

const MemberAccess = () => {
  const [accessData, setAccessData] = useState({});

  useEffect(() => {
    const fetchAccess = async () => {
      try {
        const response = await getAccess();
        setAccessData(response.data[0]);
      } catch (error) {
        console.error("Failed to fetch access data", error);
      }
    };
    fetchAccess();
  }, []);

  const handleSwitchChange = async (key, value) => {
    try {
      const updatedData = { ...accessData, [key]: value };
      await updateAccess(accessData?._id, { [key]: value });

      setAccessData(updatedData);
    } catch (error) {
      console.error("Failed to update access data", error);
    }
  };

  return (
    <Grid container spacing={2} minHeight={"420px"}>
      <Box
        width={"50%"}
        bgcolor={"white"}
        padding={4}
        margin={2}
        borderRadius={"12px"}
      >
        <Typography variant="h4" color="#00" mb={3}>
          User Access
        </Typography>
        <Stack direction={"row"} mb={2} justifyContent={"space-between"}>
          <Typography variant="h6" color="#6F7782">
            Send Notifications
          </Typography>
          <StyledSwitch
            checked={accessData?.sendNotification}
            onChange={(e) =>
              handleSwitchChange("sendNotification", e.target.checked)
            }
          />
        </Stack>
        <Stack direction={"row"} mb={2} justifyContent={"space-between"}>
          <Typography variant="h6" color="#6F7782">
            Post Requirements
          </Typography>
          <StyledSwitch
            checked={accessData?.postRequirement}
            onChange={(e) =>
              handleSwitchChange("postRequirement", e.target.checked)
            }
          />
        </Stack>
        <Stack direction={"row"} mb={2} justifyContent={"space-between"}>
          <Typography variant="h6" color="#6F7782">
            Add Awards
          </Typography>
          <StyledSwitch
            checked={accessData?.addReward}
            onChange={(e) => handleSwitchChange("addReward", e.target.checked)}
          />
        </Stack>
        <Stack direction={"row"} mb={2} justifyContent={"space-between"}>
          <Typography variant="h6" color="#6F7782">
            Add Certificates
          </Typography>
          <StyledSwitch
            checked={accessData?.addCertificate}
            onChange={(e) =>
              handleSwitchChange("addCertificate", e.target.checked)
            }
          />
        </Stack>
        <Stack direction={"row"} mb={2} justifyContent={"space-between"}>
          <Typography variant="h6" color="#6F7782">
            Add Social Media Handles
          </Typography>
          <StyledSwitch
            checked={accessData?.addSocialmedia}
            onChange={(e) =>
              handleSwitchChange("addSocialmedia", e.target.checked)
            }
          />
        </Stack>
      </Box>
    </Grid>
  );
};

export default MemberAccess;
