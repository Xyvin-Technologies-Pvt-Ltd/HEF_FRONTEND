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
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (currentExpiryDate) {
      const parsedDate = currentExpiryDate
        ? new Date(currentExpiryDate)
        : new Date();
      if (!isNaN(parsedDate)) {
        setExpiryDate(parsedDate);
        setValue("expiryDate", parsedDate.toISOString());
      }
    }
  }, [currentExpiryDate, setValue]);

  const onSubmit = async (formData) => {
    setLoading(true);
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
      setExpiryDate(null);
      reset();
      onChange();
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = (event) => {
    event.preventDefault();
    onClose();
    setExpiryDate(null);
    reset();
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
    if (!metric || !value || isNaN(parseInt(value, 10))) {
      setExpiryDate(null);
      setValue("expiryDate", null); // Reset expiry date if inputs are invalid
      return;
    }

    // Use currentExpiryDate if available, else default to the current date
    const baseDate = currentExpiryDate
      ? new Date(currentExpiryDate)
      : new Date();

    const numberValue = parseInt(value, 10);

    switch (metric) {
      case 1: // Year
        baseDate.setFullYear(baseDate.getFullYear() + numberValue);
        break;
      case 2: // Month
        baseDate.setMonth(baseDate.getMonth() + numberValue);
        break;
      case 3: // Week
        baseDate.setDate(baseDate.getDate() + numberValue * 7);
        break;
      case 4: // Day
        baseDate.setDate(baseDate.getDate() + numberValue);
        break;
      default:
        break;
    }

    if (!isNaN(baseDate)) {
      setExpiryDate(baseDate);
      const formattedDate = baseDate.toISOString().split("T")[0]; // Format as 'YYYY-MM-DD'
      setValue("expiryDate", formattedDate);
      setExpiryDate(formattedDate); // Update expiryDate to formatted string
    } else {
      setExpiryDate(null);
      setValue("expiryDate", null);
    }
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
                  value={expiryDate}
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
            disabled={loading}
          />
          <StyledButton variant="primary" name={loading ? "Saving..." : "Save"} type="submit"disabled={loading} />
        </Stack>
      </form>
    </Dialog>
  );
};

export default AddSubscription;
