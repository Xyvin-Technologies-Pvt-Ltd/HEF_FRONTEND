import { Grid, Stack, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const OrganinserCard = ({ data }) => {
  const navigate = useNavigate();
  return (
    <Grid
      container
      spacing={2}
      bgcolor={"white"}
      borderRadius={"12px"}
      minHeight={"220px"}
      padding={"16px"}
      position="relative"
    >
      <Typography variant="h7" color="textSecondary">
        Coordinators
      </Typography>
      {data?.coordinator?.map((speaker, index) => (
        <Grid item xs={12} key={index}>
          <Stack justifyContent={"space-between"} direction={"row"}>
            <Stack direction={"row"} alignItems={"center"}>
              {" "}
              <Typography
                variant="h7"
                color="textSecondary"
                style={{ marginRight: "8px" }}
              >
                {index + 1}.
              </Typography>
              <img
                src={speaker?.image}
                alt={speaker?.name}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginRight: "8px",
                }}
              />
              <Typography variant="h7" color="textSecondary">
                {speaker?.name}
              </Typography>
            </Stack>
            <Typography
              variant="h7"
              color="#F58220"
              sx={{
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                navigate(`/members/${speaker?._id}`);
              }}
            >
              view full profile
            </Typography>
          </Stack>
        </Grid>
      ))}
    </Grid>
  );
};

export default OrganinserCard;
