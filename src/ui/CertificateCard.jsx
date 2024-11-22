import React from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";

const CertificateCard = ({ certificate }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box
      borderRadius={"8px"}
      bgcolor={"white"}
      width={isMobile ? "100%" : "268px"}
      border={"1px solid rgba(0, 0, 0, 0.12)"}
    >
      <Box
        component="img"
        src={certificate?.link}
        sx={{
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
          width: isMobile ? "100%" : "268px",
          height: "160px",
          objectFit: "cover",
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

export default CertificateCard;
