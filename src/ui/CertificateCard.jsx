import React from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";

const CertificateCard = ({ certificate }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  return (
    <Box
      borderRadius="8px"
      bgcolor="white"
      width={isMobile ? "100%" : "268px"}
      border="1px solid rgba(0, 0, 0, 0.12)"
      boxShadow="0px 4px 12px rgba(0, 0, 0, 0.08)"
      sx={{
        
        overflow: "hidden", // This prevents image from overflowing
      
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "160px",
          overflow: "hidden"
        }}
      >
        <Box
          component="img"
          src={certificate?.link}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
           
          }}
          alt={certificate?.name}
        />
      </Box>
      
      <Box padding="16px">
        <Typography
          variant="h5"
          color="#333333"
          textAlign="center"
          sx={{ 
            fontSize: "1.1rem",
            fontWeight: 600,
            marginBottom: "8px"
          }}
        >
          {certificate?.name}
        </Typography>
        
        {certificate?.issuer && (
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{ fontSize: "0.875rem" }}
          >
            {certificate.issuer}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default CertificateCard;