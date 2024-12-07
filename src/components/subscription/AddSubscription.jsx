import { useState } from "react";
import {
  Typography,
  Dialog,
  DialogContent,
  Stack,
  DialogTitle,
  Box,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { StyledButton } from "../../ui/StyledButton";
import StyledSelectField from "../../ui/StyledSelectField";
import { ReactComponent as CloseIcon } from "../../assets/icons/CloseIcon.svg";
import { StyledCalender } from "../../ui/StyledCalender";
import StyledInput from "../../ui/StyledInput";
import useSubscriptionStore from "../../store/subscriptionStore";

const AddSubscription = ({ open, onClose, data , onChange}) => {
  const { handleSubmit, control, setValue, watch } = useForm();
  const [expiryDate, setExpiryDate] = useState(null);
  const { addSubscription } = useSubscriptionStore();
  const onSubmit = async (formData) => {
    try {
      const newData = {
        expiryDate: formData.expiryDate,
        user: data,
      };
      await addSubscription(newData);
      onChange();
      onClose();
    } catch (error) {
      console.error("Error adding subscription:", error);
    }
  };

  const handleClear = (event) => {
    event.preventDefault();
    onClose();
  };

  const handleTimeMetricChange = (selectedOption) => {
    const value = watch("value");
    calculateExpiryDate(selectedOption?.value, value);
    setValue("timeMetric", selectedOption);
  };

  const handleValueChange = (e) => {
    const value = e.target.value;
    const timeMetric = watch("timeMetric");
    calculateExpiryDate(timeMetric?.value, value);
    setValue("value", value);
  };

  const calculateExpiryDate = (metric, value) => {
    if (!metric || !value) {
      setExpiryDate(null);
      return;
    }

    const currentDate = new Date();
    const numberValue = parseInt(value, 10);

    switch (metric) {
      case 1: // Year
        currentDate.setFullYear(currentDate.getFullYear() + numberValue);
        break;
      case 2: // Month
        currentDate.setMonth(currentDate.getMonth() + numberValue);
        break;
      case 3: // Week
        currentDate.setDate(currentDate.getDate() + numberValue * 7);
        break;
      case 4: // Day
        currentDate.setDate(currentDate.getDate() + numberValue);
        break;
      default:
        break;
    }

    setExpiryDate(currentDate);
    setValue("expiryDate", currentDate.toISOString());
  };

  const option = [
    { value: 1, label: "Year" },
    { value: 2, label: "Month" },
    { value: 3, label: "Week" },
    { value: 4, label: "Day" },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { borderRadius: "12px" },
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle sx={{ height: "auto", padding: 3 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h3" color={"#4F4F4F"}>
              Change subscription
            </Typography>
            <Typography
              onClick={(event) => handleClear(event)}
              color="#E71D36"
              style={{ cursor: "pointer" }}
            >
              <CloseIcon />
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent
          sx={{ height: "auto", width: "430px", backgroundColor: "#FFF" }}
        >
          <Stack spacing={2} paddingTop={2}>
            <Typography variant="h6" color={"#333333"}>
              Time metric
            </Typography>
            <StyledSelectField
              placeholder={"Select Time Metric"}
              options={option}
              onChange={handleTimeMetricChange}
            />
            <Typography variant="h6" color={"#333333"}>
              Value
            </Typography>
            <StyledInput
              placeholder={"Enter Value"}
              onChange={handleValueChange}
            />
            <Typography variant="h6" color={"#333333"}>
              New Expiry Date
            </Typography>
            <Controller
              name="expiryDate"
              control={control}
              defaultValue={""}
              render={({ field }) => (
                <StyledCalender
                  placeholder={"Select Date"}
                  value={expiryDate ? new Date(expiryDate) : null}
                  disabled
                  {...field}
                />
              )}
            />
          </Stack>
        </DialogContent>
        <Stack direction={"row"} spacing={2} padding={2} justifyContent={"end"}>
          <StyledButton
            variant="secondary"
            name="Cancel"
            onClick={(event) => handleClear(event)}
          />
          <StyledButton variant="primary" name="Confirm" type="submit" />
        </Stack>
      </form>
    </Dialog>
  );
};

export default AddSubscription;
