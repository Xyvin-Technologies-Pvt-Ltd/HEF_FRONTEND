import React from "react";
import { Box, Typography } from "@mui/material";

const CertificateBox = ({ certificate }) => {
  return (
    <Box
      borderRadius={"8px"}
      bgcolor={"white"}
      width={"320px"}
      border={"1px solid rgba(0, 0, 0, 0.12)"}
    >
      <Box
        component="img"
        src={certificate?.link}
        sx={{
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
          width: "320px",
          height: "240px",objectFit:"cover"
        }}
        alt={certificate?.name}
      />
      <Box borderRadius={"8px"} bgcolor={"white"} padding={"10px"}>
        <Typography
          variant="h5"
          color={"#333333"}
          textAlign={"center"}
          sx={{ marginBottom: "10px" }}
        >
          {certificate?.name}
        </Typography>
      </Box>
    </Box>
  );
};

export default CertificateBox;
