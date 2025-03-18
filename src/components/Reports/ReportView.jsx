import React from "react";
import {
  Typography,
  Dialog,
  DialogContent,
  Stack,
  DialogTitle,
  Box,
  Divider,
  Avatar,
  Chip,
  IconButton,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FlagIcon from "@mui/icons-material/Flag";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import InventoryIcon from "@mui/icons-material/Inventory";
import MessageIcon from "@mui/icons-material/Message";
import FeedIcon from "@mui/icons-material/Feed";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

const ReportView = ({ open, onClose, data }) => {
  const getReportTypeIcon = (type) => {
    switch (type) {
      case "Feeds":
        return <FeedIcon color="primary" />;
      case "Message":
        return <MessageIcon color="primary" />;
      case "Product":
        return <ShoppingBagIcon color="primary" />;
      default:
        return <FlagIcon color="primary" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "16px",
          minWidth: { xs: "90%", sm: 600, md: 750 },
          maxWidth: 800,
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          padding: 3,
          // color: "primary.contrastText"
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h3">Report Details</Typography>
          <Typography
            onClick={onClose}
            color="#000"
            style={{ cursor: "pointer" }}
          >
            <CloseIcon />
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ padding: 0 }}>
        <Box sx={{ p: 3 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Chip
                label={data?.reportType || "Unknown Type"}
                color="primary"
                variant="outlined"
                icon={getReportTypeIcon(data?.reportType)}
              />
            </Box>
            <Box>
              <Chip
                icon={<CalendarTodayIcon fontSize="small" />}
                label={formatDate(data?.content?.createdAt)}
                size="small"
                variant="outlined"
              />
            </Box>
          </Box>

          <Paper
            elevation={0}
            sx={{ bgcolor: "grey.50", p: 2, mb: 3, borderRadius: 2 }}
          >
            {/* Reported By */}
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <PersonIcon color="action" fontSize="small" />
              <Typography variant="h6" color="textSecondary">
                Reported By
              </Typography>
            </Box>
            <Typography variant="body1" fontWeight="medium" pl={3}>
              {data?.reportBy?.name || "Unknown User"}
            </Typography>

            {data?.reportType === "Product" && (
              <>
                <Box display="flex" alignItems="center" gap={1} mt={2} mb={1}>
                  <PersonIcon color="action" fontSize="small" />
                  <Typography variant="h6" color="textSecondary">
                    Reported To
                  </Typography>
                </Box>
                <Typography variant="body1" fontWeight="medium" pl={3}>
                  {data?.content?.seller?.name || "Unknown User"}
                </Typography>
              </>
            )}
              {data?.reportType === "Feeds" && (
              <>
                <Box display="flex" alignItems="center" gap={1} mt={2} mb={1}>
                  <PersonIcon color="action" fontSize="small" />
                  <Typography variant="h6" color="textSecondary">
                    Reported To
                  </Typography>
                </Box>
                <Typography variant="body1" fontWeight="medium" pl={3}>
                  {data?.content?.author?.name || "Unknown User"}
                </Typography>
              </>
            )}
          </Paper>

          {data?.reportType === "Feeds" && (
            <Paper
              elevation={0}
              sx={{ bgcolor: "grey.50", p: 2, mb: 3, borderRadius: 2 }}
            >
              <Typography variant="h6" color="textSecondary" mb={2}>
                Reported Content
              </Typography>

              <Box display="flex" gap={2} mb={2}>
                {data?.content?.media && (
                  <Avatar
                    src={data?.content?.media}
                    alt="Content Image"
                    variant="rounded"
                    sx={{ width: 80, height: 80 }}
                  />
                )}
                <Box flex={1}>
                  <Typography variant="body1">
                    {data?.content?.content || "No content available"}
                  </Typography>
                </Box>
              </Box>

              <Box mt={2} display="flex" justifyContent="flex-end">
                <Chip
                  label={data?.content?.status || "Unknown"}
                  //   color={getStatusColor(data?.content?.status)}
                  size="small"
                />
              </Box>
            </Paper>
          )}

          {data?.reportType === "Message" && (
            <Paper
              elevation={0}
              sx={{ bgcolor: "grey.50", p: 2, mb: 3, borderRadius: 2 }}
            >
              <Typography variant="h6" color="textSecondary" mb={2}>
                Message Information
              </Typography>

              <Box
                sx={{
                  p: 2,
                  bgcolor: "background.paper",
                  borderRadius: 1,
                  mb: 2,
                }}
              >
                <Typography variant="body1">
                  {data?.content?.content || "No message content available"}
                </Typography>
              </Box>

              <Box display="flex" flexWrap="wrap" gap={3}>
                <Box flex="1 0 45%">
                  <Typography variant="h6" color="textSecondary">
                    From:
                  </Typography>
                  <Typography variant="body2">
                    {data?.content?.from?.name || "Unknown"}
                  </Typography>
                </Box>

                <Box flex="1 0 45%">
                  <Typography variant="h6" color="textSecondary">
                    To:
                  </Typography>
                  <Typography variant="body2">
                    {data?.content?.to?.name || "Unknown"}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          )}

          {data?.reportType === "Product" && (
            <Paper
              elevation={0}
              sx={{ bgcolor: "grey.50", p: 2, mb: 3, borderRadius: 2 }}
            >
              <Typography variant="h6" color="textSecondary" mb={2}>
                Product Details
              </Typography>

              <Box display="flex" gap={2} mb={3}>
                <Avatar
                  src={data?.content?.image}
                  alt="Product Image"
                  variant="rounded"
                  sx={{ width: 100, height: 100 }}
                />
                <Box>
                  <Typography variant="body1" fontWeight="medium">
                    {data?.content?.name || "No product name"}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mt: 1 }}
                  >
                    {data?.content?.description || "No description available"}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={2}>
                <Box display="flex" flexWrap="wrap" gap={2}>
                  <Box
                    flex="1 0 45%"
                    display="flex"
                    alignItems="center"
                    gap={1}
                  >
                    <AttachMoneyIcon color="action" fontSize="small" />
                    <Typography variant="h6" color="textSecondary">
                      Price:
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      ${data?.content?.price || "N/A"}
                    </Typography>
                  </Box>

                  <Box
                    flex="1 0 45%"
                    display="flex"
                    alignItems="center"
                    gap={1}
                  >
                    <LocalOfferIcon color="action" fontSize="small" />
                    <Typography variant="h6" color="textSecondary">
                      Offer:
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      ${data?.content?.offerPrice || "N/A"}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" flexWrap="wrap" gap={2}>
                  <Box
                    flex="1 0 45%"
                    display="flex"
                    alignItems="center"
                    gap={1}
                  >
                    <InventoryIcon color="action" fontSize="small" />
                    <Typography variant="h6" color="textSecondary">
                      MOQ:
                    </Typography>
                    <Typography variant="body1">
                      {data?.content?.moq || "N/A"}
                    </Typography>
                  </Box>

                  <Box
                    flex="1 0 45%"
                    display="flex"
                    alignItems="center"
                    gap={1}
                  >
                    <Typography variant="h6" color="textSecondary">
                      Units:
                    </Typography>
                    <Typography variant="body1">
                      {data?.content?.units || "N/A"}
                    </Typography>
                  </Box>
                </Box>
              </Stack>

              <Box mt={3} display="flex" justifyContent="flex-end">
                <Chip
                  label={data?.content?.status || "Unknown"}
                  //   color={getStatusColor(data?.content?.status)}
                  size="small"
                />
              </Box>
            </Paper>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ReportView;
