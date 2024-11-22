import { Stack, Typography } from "@mui/material";
import React from "react";

const AnalyticCard = ({ data }) => {
  return (
    <Stack
      bgcolor={"#fff"}
      height={"210px"}
      width={"210px"}justifyContent={"space-between"}
      borderRadius={"5.4px"}
      padding={"20px"}
    >
      <Typography variant="h5" color="#686465">
        {data?.title}
      </Typography>
      <Typography  color={data?.color} fontSize={'43px'} fontweight={900}fontStyle={'italic'}> 
        {data?.value}
      </Typography>
    </Stack>
  );
};

export default AnalyticCard;
