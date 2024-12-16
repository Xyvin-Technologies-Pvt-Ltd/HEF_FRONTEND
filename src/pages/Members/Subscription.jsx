import React, { useEffect, useState } from "react";

import { ReactComponent as AddIcon } from "../../assets/icons/AddIcon.svg";
import { StyledButton } from "../../ui/StyledButton";
import AddSubscription from "../../components/subscription/AddSubscription";
import useSubscriptionStore from "../../store/subscriptionStore";
import { Box, Divider, Grid, Stack, Typography } from "@mui/material";
import moment from "moment";
import SendNotification from "../../components/subscription/SendNotification";

const Subscription = ({ id }) => {
  const [open, setOpen] = useState(false);
  const [notiOpen, setNotiOpen] = useState(false);
  const [isChange, setIsChange] = useState(false);
  const { fetchSubscriptionById, subscription } = useSubscriptionStore();

  useEffect(() => {
    fetchSubscriptionById(id);
  }, [id, isChange, fetchSubscriptionById]);
  const formatDate = (date) => {
    return moment(date).format("DD-MM-YYYY");
  };
  return (
    <>
      {subscription ? (
        <>
          <Grid
            container
            spacing={2}
            width={"70%"}
            margin={"20px"}
            bgcolor={"white"}
            borderRadius={"16px"}
            padding={"20px"}
            border={"1px solid rgba(0, 0, 0, 0.12)"}
          >
            <Grid item xs={12}>
              <Box textAlign="center">
                <Typography variant="h5" color={"#686465"} marginBottom={2}>
                  App Subscription
                </Typography>
              </Box>
            </Grid>
            <Grid item md={12}>
              <Stack
                spacing={2}
                padding={2}
                direction={"row"}
                justifyContent={"space-between"}
              >
                <Typography variant="h7" color={"#686465"} fontWeight={700}>
                  Subscription Status
                </Typography>
                {subscription?.status && (
                  <Typography
                    variant="h8"
                    color="#FF9500"
                    sx={{
                      padding: "0px 6px",
                      borderRadius: "12px",
                      border: "1px solid #FF9500",
                    }}
                  >
                    {subscription?.status}
                  </Typography>
                )}
              </Stack>
              <Divider />
              <Stack
                spacing={2}
                padding={2}
                direction={"row"}
                justifyContent={"space-between"}
              >
                <Typography variant="h7" color={"#686465"} fontWeight={700}>
                  Last Renewed date and time
                </Typography>
                <Typography variant="h8" color="#2C2829"></Typography>
              </Stack>
              <Divider />{" "}
              <Stack
                spacing={2}
                padding={2}
                direction={"row"}
                justifyContent={"space-between"}
              >
                <Typography variant="h7" color={"#686465"} fontWeight={700}>
                  Expiry Date
                </Typography>
                <Typography variant="h8" color="#2C2829">
                  {formatDate(subscription?.expiryDate)}
                </Typography>
              </Stack>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <Grid container justifyContent="flex-end">
                <Grid item xs={7}>
                  <Stack direction="row" spacing={2} justifyContent="flex-end">
                    {/* <StyledButton
                      name="Send Notification"
                      variant="secondary"
                      onClick={() => setNotiOpen(true)}
                    /> */}
                    <StyledButton
                      name="Renew"
                      variant="primary"
                      onClick={() => setOpen(true)}
                    />
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          <StyledButton
            variant={"primary"}
            name={
              <>
                <AddIcon />
                Add Subscription
              </>
            }
            onClick={() => setOpen(true)}
          />
        </>
      )}{" "}
      <AddSubscription
        open={open}
        onClose={() => setOpen(false)}
        data={id}
        onChange={() => setIsChange(!isChange)}
        id={subscription?._id}
        currentExpiryDate={formatDate(subscription?.expiryDate)}
      />
      <SendNotification
        open={notiOpen}
        onClose={() => setNotiOpen(false)}
        onChange={() => setIsChange(!isChange)}
      />
    </>
  );
};

export default Subscription;
