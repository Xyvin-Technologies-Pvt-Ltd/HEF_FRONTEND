import React, { useState } from "react";
import { Grid, Stack, Typography, Box } from "@mui/material";
import { ReactComponent as EmailIcon } from "../assets/icons/EmailIcon.svg";
import { ReactComponent as PhoneIcon } from "../assets/icons/PhoneIcon.svg";
import { ReactComponent as LocationIcon } from "../assets/icons/LocationIcon.svg";
import { StyledButton } from "./StyledButton";
import BlockProfile from "../components/Member/BlockProfile";
import { useParams } from "react-router-dom";
import image from "../assets/images/image.png";
import UnBlockProfile from "../components/Member/UnBlockProfile";

const UserCard = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [unopen, setUnOpen] = useState(false);
  const { id } = useParams();
  const handleBlock = () => {
    setOpen(true);
  };
  const handleUnBlock = () => {
    setUnOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleUnClose = () => {
    setUnOpen(false);
  };
  return (
    <Grid
      container
      spacing={2}
      bgcolor={"white"}
      borderRadius={"12px"}
      padding={"10px"}
      minHeight={"420px"}
      position="relative"
    >
      <Grid item md={6} xs={12}>
        <img
          src={user?.image || image}
          alt="img"
          width={"216px"}
          height={"216px"}
          style={{ borderRadius: "12px", objectFit: "cover" }}
        />
      </Grid>
      <Grid
        item
        md={6}
        xs={12}
        // lg={6}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Stack spacing={"10px"}>
          <Typography
            variant="h7"
            color="white"
            fontWeight="bold"
            sx={{
              backgroundColor: "orange",
              padding: "0px 6px",
              borderRadius: "12px",
              width: "fit-content",
            }}
          >
            {user?.role}
          </Typography>
          <Typography variant="h5" color={"textPrimary"}>
            {user?.name?.first} {user?.name?.middle} {user?.name?.last}
          </Typography>
          <Typography variant="h7" color={"textPrimary"}>
            {user?.college?.collegeName}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Stack>
              <PhoneIcon />{" "}
            </Stack>
            <Typography variant="h7" color={"textPrimary"}>
              {user?.phone}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Stack>
              {" "}
              <EmailIcon />{" "}
            </Stack>
            <Typography variant="h7" color={"textPrimary"}>
              {user?.email}
            </Typography>
          </Stack>
          {user?.address && (
            <Stack direction="row" alignItems="center" spacing={2}>
              <Stack>
                <LocationIcon />{" "}
              </Stack>
              <Typography variant="h7" color={"textPrimary"}>
                {user?.address}
              </Typography>
            </Stack>
          )}{" "}
          {user?.status === "active" && (
            <Stack direction="row" alignItems="center" spacing={2}>
              <StyledButton
                variant={"primary"}
                name={"Block"}
                onClick={handleBlock}
              />
            </Stack>
          )}
          {user?.status === "blocked" && (
            <Stack direction="row" alignItems="center" spacing={2}>
              <StyledButton
                variant={"secondary"}
                name={"UnBlock"}
                onClick={handleUnBlock}
              />
            </Stack>
          )}
        </Stack>
      </Grid>

      <Grid
        item
        md={12}
        xs={12}
        display={"flex"}
        alignItems={"flex-start"}
        flexDirection={"column"}
      >
        {user?.bio && (
          <>
            <Typography variant="h7" color={"textPrimary"} fontWeight={700}>
              Bio
            </Typography>
            <Typography variant="h7" color={"textPrimary"}>
              {user?.bio}
            </Typography>
          </>
        )}
      </Grid>
      <BlockProfile open={open} onClose={handleClose} id={id} />
      <UnBlockProfile open={unopen} onClose={handleUnClose} id={id} />
    </Grid>
  );
};

export default UserCard;
