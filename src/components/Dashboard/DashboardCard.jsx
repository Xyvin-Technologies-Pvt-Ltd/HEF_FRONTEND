import React, { useState } from "react";
import { Stack, Typography, IconButton } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

export const DashboardCard = ({
  isMobile,
  data,
  isDate,
  spacing,
  height,
  onDateChange,
  selectedDate,
}) => {
  return (
    <Stack
      bgcolor={"white"}
      borderRadius={"10px"}
      padding={spacing ? "25px" : "15px"}
      spacing={spacing ? 18 : 2}
      justifyContent={"space-between"}
      border={"1px solid rgba(0, 0, 0, 0.25)"}
      height={height}
    >
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems="center"
      >
        <Stack spacing={1}>
          {data?.icon && <data.icon />}

          <Typography fontWeight={400} fontSize={isMobile ? "12px" : "14px"}>
            {data?.title}
          </Typography>
        </Stack>
        {isDate && (
          <Stack>
            <DatePicker
              selected={selectedDate}
              onChange={onDateChange}
              dateFormat="MMM, yyyy"
              showMonthYearPicker
              customInput={
                <Typography
                  fontWeight={400}
                  fontSize={isMobile ? "12px" : "14px"}
                  color="rgba(0, 0, 0, 0.6)"
                >
                  {moment(selectedDate).format("MMM, YYYY")}
                  <IconButton size="small" sx={{ padding: 0, color: "blue" }}>
                    <ArrowDropDownIcon fontSize="small" />
                  </IconButton>
                </Typography>
              }
            />
          </Stack>
        )}
      </Stack>

      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        display={"flex"}
        alignItems={"center"}
      >
        <Typography fontWeight={700} fontSize={isMobile ? "24px" : "45px"}>
          {data?.amount !== null && data?.amount !== undefined
            ? data.amount
            : "_"}
        </Typography>
        {data?.percentage && (
          <Typography
            color={
              data?.percentage?.includes("+")
                ? "rgba(27, 210, 17, 0.98)"
                : "rgba(210, 17, 17, 0.98)"
            }
            fontSize={isMobile ? "12px" : "16px"}
            fontWeight={400}
          >
            {data?.percentage}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
};
