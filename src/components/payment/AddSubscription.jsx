import {
  Typography,
  Dialog,
  DialogContent,
  Stack,
  DialogTitle,
  Box,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { StyledButton } from "../../ui/StyledButton";
import StyledSelectField from "../../ui/StyledSelectField";
import { ReactComponent as CloseIcon } from "../../assets/icons/CloseIcon.svg";

import { useParams } from "react-router-dom";
import StyledInput from "../../ui/StyledInput";
import { usePaymentStore } from "../../store/paymentStore";

const AddSubscription = ({ open, onClose, payment, category, isUpdate }) => {
  const { handleSubmit, control, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const {
    addPayments,
    setRefreshMember,
    subscriptions,
    fetchParentSub,
    updatePayment,
  } = usePaymentStore();
  const { id } = useParams();
  useEffect(() => {
    fetchParentSub();
  }, []);
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = {
        user: id,
        parentSub: data?.academicYear?.value,
        category: category,
        status: "active",
        amount: data?.amount,
      };
      if (isUpdate) {
        await updatePayment(payment?._id, formData);
      } else {
        await addPayments(formData);
      }
      setRefreshMember();
      reset();
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = (event) => {
    event.preventDefault();
    onClose();
  };

  const option =
    subscriptions?.map((item) => ({
      value: item?._id,
      label: item?.academicYear,
    })) || [];

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
              Add
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
              Academic Year
            </Typography>
            <Controller
              name="academicYear"
              control={control}
              defaultValue="" // Default value for the academic year
              render={({ field }) => (
                <StyledSelectField
                  {...field}
                  placeholder="Year"
                  options={option}
                />
              )}
            />

            <Typography variant="h6" color={"#333333"}>
              Amount
            </Typography>
            <Controller
              name="amount"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <>
                  <StyledInput placeholder={"amount"} {...field} />
                </>
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
          <StyledButton
            variant="primary"
            name={loading ? "Saving..." : "Save"}
            type="submit"
            disabled={loading}
          />
        </Stack>
      </form>
    </Dialog>
  );
};

export default AddSubscription;
