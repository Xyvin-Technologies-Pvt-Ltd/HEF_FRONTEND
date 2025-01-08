import { useEffect, useState } from "react";
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
import { toast } from "react-toastify";
import moment from "moment";

const DATE_FORMAT = "DD-MM-YYYY";

const AddSubscription = ({
  open,
  onClose,
  data,
  onChange,
  id,
  currentExpiryDate,
}) => {
  const { handleSubmit, control, setValue, watch, reset } = useForm();
  const [expiryDate, setExpiryDate] = useState(null);
  const { addSubscription, updateSubscription } = useSubscriptionStore();

  useEffect(() => {
    if (currentExpiryDate) {
      const initialDate = moment(currentExpiryDate, DATE_FORMAT).format(
        DATE_FORMAT
      );
      if (moment(initialDate, DATE_FORMAT).isValid()) {
        setExpiryDate(initialDate);
        setValue("expiryDate", initialDate);
      }
    }
  }, [currentExpiryDate, setValue]);

  const onSubmit = async (formData) => {
    try {
      const newData = {
        expiryDate: formData.expiryDate,
        user: data,
      };
      if (currentExpiryDate && id) {
        await updateSubscription(id, newData);
      } else {
        await addSubscription(newData);
      }
      onChange();
      onClose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleClear = (event) => {
    event.preventDefault();
    setExpiryDate(null);
    reset();
    onClose();
  };

  const handleTimeMetricChange = (selectedOption) => {
    const value = watch("value");
    if (value) {
      calculateExpiryDate(selectedOption?.value, value);
    }
    setValue("timeMetric", selectedOption);
  };

  const handleValueChange = (e) => {
    const value = e.target.value;
    if (!value || isNaN(value) || value < 0) return;

    const timeMetric = watch("timeMetric");
    if (timeMetric?.value) {
      calculateExpiryDate(timeMetric.value, value);
    }
    setValue("value", value);
  };

  const calculateExpiryDate = (metric, value) => {
    if (!metric || !value || isNaN(parseInt(value, 10))) {
      setExpiryDate(null);
      setValue("expiryDate", null);
      return;
    }
  
    // Start from either the current expiry date or today
    let baseDate = currentExpiryDate
      ? moment(currentExpiryDate, DATE_FORMAT)
      : moment().startOf("day");
  
    if (!baseDate.isValid()) {
      baseDate = moment().startOf("day");
    }
  
    const numberValue = parseInt(value, 10);
    let newDate = baseDate.clone(); // Clone to avoid mutating the base date
  
    switch (metric) {
      case 1: // Year
        newDate = newDate.add(numberValue, "year");
        break;
      case 2: // Month
        newDate = newDate.add(numberValue, "month");
        break;
      case 3: // Week
        newDate = newDate.add(numberValue, "week"); // Use 'week' for week addition
        break;
      case 4: // Day
        newDate = newDate.add(numberValue, "day");
        break;
      default:
        return;
    }
  
    const formattedDate = newDate.format(DATE_FORMAT);
    setExpiryDate(formattedDate);
    setValue("expiryDate", formattedDate);
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
              Subscription
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
              type="number"
              min="0"
            />
            <Typography variant="h6" color={"#333333"}>
              New Expiry Date
            </Typography>
            <Controller
              name="expiryDate"
              control={control}
              defaultValue={""}
              render={({
                field: { onChange: fieldOnChange, ...restField },
              }) => (
                <StyledCalender
                  placeholder={"Select Date"}
                  value={expiryDate}
                  onChange={(date) => {
                    const formattedDate = moment(date).format(DATE_FORMAT);
                    fieldOnChange(formattedDate);
                    setExpiryDate(formattedDate);
                  }}
                  disabled
                  {...restField}
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
