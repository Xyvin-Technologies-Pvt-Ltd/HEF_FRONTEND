import { Box } from "@mui/material";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const ActivityCharts = () => {
  const data = [
    { name: "Zone 1", value: 450 },
    { name: "Zone 2", value: 550 },
    { name: "Zone 3", value: 340 },
    { name: "Zone 4", value: 300 },
    { name: "Zone 5", value: 430 },
    { name: "Zone 6", value: 320 },
    { name: "Zone 7", value: 150 },
  ];

  return (
    <Box
      width={"100%"}
      height={400}
      padding={2}
      bgcolor={"#fff"}
      border={"1px solid rgba(0, 0, 0, 0.25)"}
      borderRadius={"10px"}
    >
      <h3 style={{ textAlign: "left", marginLeft: "10px" }}>Activity Chart</h3>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          barSize={30}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: "12px", fill: "#637381", fontWeight: "500" }} // Custom tick styles
          />
          {/* Configure the YAxis ticks explicitly */}
          <YAxis
            domain={[0, 700]} // Y-axis range from 0 to 700
            ticks={[0, 100, 200, 300, 400, 500, 600, 700]} // Explicit tick values
          />
          <Tooltip />
          <Bar dataKey="value" fill="#FB923C" radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ActivityCharts;
