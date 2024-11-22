import React from "react";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";

const CustomTextField = styled(TextField)(({ theme }) => ({
  width: "100%",
  backgroundColor: "white",
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "rgba(0, 0, 0, 0.2)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(0, 0, 0, 0.2)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "rgba(0, 0, 0, 0.2)",
    },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(0, 0, 0, 0.2)",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "rgba(0, 0, 0, 0.2)",
  },
  "& .MuiInputBase-input::placeholder": {
    color: "#79747E",
    opacity: 1,
  },
}));

export const StyledMultilineTextField = ({
  label,
  placeholder,
  rows = 4,
  onChange,
  value,
  maxLength,  // Add a maxLength prop
  errorMessage, // Add an optional error message prop
}) => {
  const [error, setError] = React.useState(false);

  const handleChange = (e) => {
    if (maxLength && e.target.value.length > maxLength) {
      setError(true);
    } else {
      setError(false);
    }
    onChange(e);
  };

  return (
    <div>
      <CustomTextField
        label={label}
        placeholder={placeholder}
        multiline
        rows={rows}
        value={value}
        onChange={handleChange}
        variant="outlined"
        fullWidth
        error={error}
        helperText={error ? errorMessage || `Limit of ${maxLength} characters exceeded` : ""}
      />
    </div>
  );
};
