import React, { useEffect, useState } from "react";
import { Box, Divider, Grid, Stack, Typography } from "@mui/material";
import { usePaymentStore } from "../../store/paymentStore";
import AppSubscriptionCard from "../../components/payment/AddSubscriptionCard";
import AddSubscriptionCard from "../../components/payment/AddSubscriptionCard";
import MemberSubscriptionCard from "../../components/payment/MemberSubscriptionCard";

const Subscription = ({ id }) => {
  const { fetchPaymentById, payment, refreshMember } = usePaymentStore();

  useEffect(() => {
    fetchPaymentById(id);
  }, [refreshMember]);

  return (
    <>
      <Grid container>
        <Stack direction={"column"} spacing={3}>
          <AddSubscriptionCard
            payment={payment?.find((p) => p?.category === "app")}
          />

          <MemberSubscriptionCard
            payment={payment.find((p) => p.category === "membership")}
           
          />
        </Stack>
      </Grid>
    </>
  );
};

export default Subscription;
