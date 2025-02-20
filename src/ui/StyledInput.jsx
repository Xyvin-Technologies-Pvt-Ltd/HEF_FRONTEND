import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { InputAdornment } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";

const StyledInput = ({
  placeholder,
  startIcon,
  endIcon,
  disabled,
  type,
  onChange,
  value,
}) => {
  return (
    <FormControl sx={{ width: "100%" }} variant="outlined">
      {type === "mobile" ? (
        <PhoneInput
          country={"in"}
          value={value}
          onChange={onChange}
          disabled={disabled}
          enableLongNumbers={true}
          international
          buttonStyle={{ borderRadius: "5px", padding: "3px" }}
          containerStyle={{ width: "100%" }}
          placeholder={placeholder}
          inputStyle={{ width: "100%", height: "58px" }}
        />
      ) : (
        <OutlinedInput
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          startAdornment={
            startIcon ? (
              <InputAdornment position="start" sx={{ marginLeft: "12px" }}>
                {startIcon}
              </InputAdornment>
            ) : null
          }
          endAdornment={
            endIcon ? (
              <InputAdornment
                position="end"
                sx={{ marginRight: "12px", cursor: "pointer" }}
                onClick={() => endIcon.props.onClick && endIcon.props.onClick()}
              >
                {endIcon}
              </InputAdornment>
            ) : null
          }
          sx={{
            width: "100%",
            padding: "3px",
            backgroundColor: "#ffffff",
            borderRadius: "5px",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(0, 0, 0, 0.2)",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(0, 0, 0, 0.2)",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(0, 0, 0, 0.2)",
            },
            "& .MuiInputBase-input": {
              padding: "14px",
            },
            "& input::placeholder": {
              color: "#000000",
              fontWeight: "400",
            },
          }}
        />
      )}
    </FormControl>
  );
};

export default StyledInput;
