import React from "react";
import { MenuItem, Select, FormControl, Box } from "@mui/material";

const DashboardSelect = ({ options, value, onChange }) => {
  return (
    <Box>
      <FormControl
        variant="outlined"
        sx={{
          width: "120px",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#DFE4EA",
            },
            "&:hover fieldset": {
              borderColor: "#DFE4EA",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#DFE4EA",
            },
          },
          "& .MuiInputBase-root": {
            height: "30px",
            fontSize: "14px",
          },
        }}
      >
        <Select
          labelId="select-label"
          value={value}
          onChange={onChange}
          displayEmpty
        >
          {options?.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default DashboardSelect;
