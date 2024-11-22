import React from "react";
import { Box, Typography } from "@mui/material";

const CertificateBox = ({ certificate }) => {
  return (
    <Box
      borderRadius={"8px"}
      bgcolor={"white"}
      width={"390px"}
      border={"1px solid rgba(0, 0, 0, 0.12)"}
    >
      <Box
        component="img"
        src={certificate?.link}
        sx={{
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
          width: "390px",
          height: "260px",objectFit:"cover"
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
