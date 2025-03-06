import {
  Typography,
  Dialog,
  DialogContent,
  Stack,
  DialogTitle,
  Box,
} from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";
import { StyledButton } from "../../ui/StyledButton";
import StyledSelectField from "../../ui/StyledSelectField";
import { ReactComponent as CloseIcon } from "../../assets/icons/CloseIcon.svg";
import { StyledCalender } from "../../ui/StyledCalender";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { usePaymentStore } from "../../store/paymentStore";

const ParentSub = ({ open, onClose, sub, isUpdate }) => {
  const { handleSubmit, control, setValue, reset } = useForm();
  const { addParentSubscription, editParentSub, setRefreshMember } =
    usePaymentStore();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (sub && isUpdate) {
      setValue("from", {
        value: sub?.academicYear?.split("-")[0],
        label: sub?.academicYear?.split("-")[0],
      });
      setValue("to", {
        value: sub?.academicYear?.split("-")[1],
        label: sub?.academicYear?.split("-")[1],
      });
      setValue("expiryDate", sub?.expiryDate);
    }
  }, [sub, isUpdate, setValue]);
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = {
        academicYear: `${data?.from.value}-${data?.to.value}`,
        expiryDate: data?.expiryDate,
      };
      if (isUpdate) {
        await editParentSub(sub?._id, formData);
      } else {
        await addParentSubscription(formData);
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
    reset();
    onClose();
  };
  const fromOptions = Array.from({ length: 2033 - 2023 + 1 }, (_, i) => ({
    value: `${2023 + i}`,
    label: `${2023 + i}`,
  }));

  const fromValue = useWatch({ control, name: "from" });
  const toValue = useWatch({ control, name: "to" });

  const toOptions = fromValue
    ? Array.from({ length: 1 }, (_, i) => ({
        value: `${parseInt(fromValue.value) + i + 1}`,
        label: `${parseInt(fromValue.value) + i + 1}`,
      }))
    : [];
  useEffect(() => {
    if (toValue) {
      const expiryDate = `${toValue.value}-03-31T00:00:00.000Z`;
      setValue("expiryDate", expiryDate);
    }
  }, [toValue, setValue]);
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
              Date
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
          sx={{ height: "400px", width: "430px", backgroundColor: "#FFF" }}
        >
          <Stack spacing={2} paddingTop={2}>
            <Stack direction={"row"} spacing={2}>
              <Stack width={"50%"}>
                <Typography variant="h6" color={"#333333"}>
                  From Year
                </Typography>
                <Controller
                  name="from"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <StyledSelectField options={fromOptions} {...field} />
                    </>
                  )}
                />{" "}
              </Stack>
              <Stack width={"50%"}>
                <Typography variant="h6" color={"#333333"}>
                  To Year
                </Typography>
                <Controller
                  name="to"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <StyledSelectField options={toOptions} {...field} />
                    </>
                  )}
                />
              </Stack>
            </Stack>
            <Typography variant="h6" color={"#333333"}>
              Month
            </Typography>
            <Controller
              name="expiryDate"
              control={control}
              defaultValue={""}
              rules={{ required: "Date is required" }}
              render={({ field }) => (
                <StyledCalender placeholder={"Select Date"} {...field} />
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

export default ParentSub;
