import { Box, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import DashboardSelect from "../../ui/DashboardSelect";

const ActivityCharts = ({ data }) => {
  const [value, setValue] = useState("Monthly");
  const handleSelectChange = (event) => {
    setValue(event.target.value);
  };

  const options = [
    { value: "Daily", label: "Daily" },
    { value: "Weekly", label: "Weekly" },
    { value: "Monthly", label: "Monthly" },
    { value: "Yearly", label: "Yearly" },
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
      <Stack direction={"row"} justifyContent={"space-between"}>
        <Typography variant="h7">Activity Chart</Typography>
        {/* Dropdown (optional) */}
        {/* <DashboardSelect
          options={options}
          value={value}
          onChange={handleSelectChange}
        /> */}
      </Stack>

      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          barSize={30}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: "12px", fill: "#637381", fontWeight: "500" }}
          />
          <YAxis
            tickFormatter={(value) =>
              value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : value
            }
          />
          <Tooltip
            formatter={(val, name) =>
              name === "Amount"
                ? `${val.toLocaleString()} (₹)`
                : val.toLocaleString()
            }
          />
          <Legend />

          {/* Amount bar */}
          <Bar
            dataKey="value"
            fill="#FB923C"
            radius={[5, 5, 0, 0]}
            name="Amount"
          />

          {/* Count bar (number of activities) */}
          <Bar
            dataKey="count"
            fill="#3B82F6"
            radius={[5, 5, 0, 0]}
            name="Count"
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ActivityCharts;
