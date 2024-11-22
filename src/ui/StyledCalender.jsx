import React from "react";
import { styled, ThemeProvider, createTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import moment from "moment";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"; 

const theme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(0, 0, 0, 0.2)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(0, 0, 0, 0.2)",
            borderWidth: "1px",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "rgba(0, 0, 0, 0.2)",
          "&.Mui-focused": {
            color: "rgba(0, 0, 0, 0.2)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          width: "100%",
          "& .MuiInputBase-input::placeholder": {
            color: "rgba(0, 0, 0, 0.2)",
            opacity: 1,
          },
        },
      },
    },
  },
});

const CustomTextField = styled(TextField)({
  width: "100%",
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#ffffff",
    "& fieldset": {
      borderColor: "rgba(0, 0, 0, 0.2)",
    },
  },
});

export const StyledCalender = ({ label, onChange, placeholder, value }) => {
  const [selectedDate, setSelectedDate] = React.useState(
    value ? moment(value) : null
  );

  React.useEffect(() => {
    if (value) {
      setSelectedDate(moment(value));
    }
  }, [value]);

  const handleDateChange = (date) => {
    if (date) {
      // Change the format to 'YYYY-MM-DD'
      const formattedDate = moment(date).format('YYYY-MM-DD'); 
      setSelectedDate(moment(date));
      if (onChange) {
        onChange(formattedDate); // Pass the formatted date
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DatePicker
          label={label}
          value={selectedDate}
          onChange={handleDateChange}
          renderInput={(params) => (
            <CustomTextField {...params} placeholder={placeholder} />
          )}
          sx={{ width: "100%" }}
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
};
