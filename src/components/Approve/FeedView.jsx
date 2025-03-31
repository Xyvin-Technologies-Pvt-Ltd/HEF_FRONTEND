import React from "react";
import {
  Typography,
  Dialog,
  DialogContent,
  Box,
  IconButton,
  Paper,
  Grid,
  Avatar,
  Chip,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";

const FeedView = ({ open, onClose, data }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          zIndex: 10,
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            bgcolor: "rgba(255,255,255,0.8)",
            "&:hover": { bgcolor: "white" },
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
          size="small"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ padding: 0 }}>
        <Grid container>
          {data?.media && (
            <Grid item xs={12} md={7} sx={{ height: { md: "70vh" } }}>
              <Box
                sx={{
                  height: "100%",
                  width: "100%",
                  bgcolor: "#f0f0f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <img
                  src={data.media}
                  alt="Post"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
            </Grid>
          )}

          <Grid
            item
            xs={12}
            md={data?.media ? 5 : 12}
            sx={{
              p: 0,
              height: { md: data?.media ? "70vh" : "auto" },
              overflow: "auto",
            }}
          >
            <Box sx={{ p: 3, borderBottom: "1px solid #eaeaea" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Avatar 
                  src={data?.author?.image} 
                  alt={data?.author?.name}
                  sx={{ 
                    width: 48, 
                    height: 48, 
                    mr: 2,
                    border: "2px solid #fff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                  }}
                />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {data?.author?.name}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Chip 
                      size="small" 
                      label={data?.author?.memberId} 
                      sx={{ 
                        mr: 1, 
                        bgcolor: "#f2f7ff", 
                        color: "#3a68c9",
                        fontSize: "0.7rem",
                        height: 22
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {moment(data?.createdAt).format("MMM DD, YYYY • h:mm A")}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box sx={{ p: 3 }}>
              {data?.title && (
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 2, 
                    fontWeight: "bold",
                    color: "#333"
                  }}
                >
                  {data.title}
                </Typography>
              )}
              
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  bgcolor: "#f9f9f9",
                  borderRadius: "12px",
                  mb: 3,
                  border: "1px solid #eaeaea",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    whiteSpace: "pre-line",
                    lineHeight: 1.6,
                    color: "#444",
                  }}
                >
                  {data?.content}
                </Typography>
              </Paper>

           
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default FeedView;