import { Box, Dialog, Divider, Grid, Stack, Typography } from "@mui/material";
import React from "react";
import { StyledButton } from "../../ui/StyledButton";
import { useForm } from "react-hook-form";
import { ReactComponent as CloseIcon } from "../../assets/icons/CloseIcon.svg";

const SendNotification = ({ open, onClose, onChange }) => {
  const { handleSubmit, reset } = useForm();
  const handleClear = (event) => {
    event.preventDefault();
    onClose();
    reset();
  };
  const onSubmit = (data) => {};
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { borderRadius: "12px" },
      }}
    >
      {" "}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid
          container
          spacing={2}
          //   margin={"20px"}
          //   bgcolor={"white"}
          //   borderRadius={"16px"}
          padding={"20px"}
          border={"1px solid rgba(0, 0, 0, 0.12)"}
        >
          <Grid item xs={12}>
            <Stack direction={"row"} justifyContent={"space-between"}>
              <Typography variant="h5" color={"#686465"} marginBottom={2}>
                Subscription Notification
              </Typography>{" "}
              <Typography
                onClick={(event) => handleClear(event)}
                color="#E71D36"
                style={{ cursor: "pointer" }}
              >
                <CloseIcon />
              </Typography>
            </Stack>
          </Grid>
          <Grid item md={12}>
            <Stack
              spacing={2}
              padding={2}
              direction={"row"}
              justifyContent={"space-between"}
            >
              <Typography variant="h7" color={"#686465"} fontWeight={700}>
                Subscription Status
              </Typography>
            </Stack>
            <Divider />
            <Stack
              spacing={2}
              padding={2}
              direction={"row"}
              justifyContent={"space-between"}
            >
              <Typography variant="h7" color={"#686465"} fontWeight={700}>
                Last Renewed date and time
              </Typography>
              <Typography variant="h8" color="#2C2829"></Typography>
            </Stack>
            <Divider />{" "}
            <Stack
              spacing={2}
              padding={2}
              direction={"row"}
              justifyContent={"space-between"}
            >
              <Typography variant="h7" color={"#686465"} fontWeight={700}>
                Expiry Date
              </Typography>
              <Typography variant="h8" color="#2C2829"></Typography>
            </Stack>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Grid container justifyContent="flex-end">
              <Grid item xs={7}>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <StyledButton
                    name="Cancel"
                    variant="secondary"
                    onClick={(e) => handleClear(e)}
                  />
                  <StyledButton
                    name="Renew"
                    variant="primary"
                    onClick={() => setOpen(true)}
                  />
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>{" "}
    </Dialog>
  );
};

export default SendNotification;
