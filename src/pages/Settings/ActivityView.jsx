import {
  Typography,
  Dialog,
  DialogContent,
  Stack,
  DialogTitle,
  Box,
  Divider,
  Grid,
  Paper,
} from "@mui/material";
import { ReactComponent as CloseIcon } from "../../assets/icons/CloseIcon.svg";
import moment from "moment";

const ActivityView = ({ open, onClose, data }) => {
  const handleClear = (event) => {
    event.preventDefault();
    onClose();
  };
  const formatDate = (date) => {
    return date ? moment(date).format("DD-MM-YYYY") : "-";
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      PaperProps={{
        sx: { borderRadius: "12px" },
      }}
    >
      <DialogTitle
        sx={{
          height: "auto",
          padding: 3,
          bgcolor: "#f4f5f7",
          borderRadius: "12px",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" color="textPrimary" fontWeight="bold">
            Activity Details
          </Typography>
          <Box
            onClick={(event) => handleClear(event)}
            style={{ cursor: "pointer" }}
          >
            <CloseIcon />
          </Box>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ height: "auto", padding: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography
              variant="subtitle1"
              color="textSecondary"
              fontWeight="bold"
            >
              Type:
            </Typography>
            <Typography variant="h6" color="textPrimary">
              {data?.type}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              variant="subtitle1"
              color="textSecondary"
              fontWeight="bold"
            >
              Status:
            </Typography>
            <Typography variant="h6" color="textPrimary">
              {data?.status}
            </Typography>
          </Grid>
          <Grid item xs={12}sm={6}>
            <Typography
              variant="subtitle1"
              color="textSecondary"
              fontWeight="bold"
            >
              Description:
            </Typography>
            <Typography variant="h6" color="textPrimary">
              {data?.description}
            </Typography>
          </Grid>
          <Grid item xs={12}sm={6}>
            <Typography
              variant="subtitle1"
              color="textSecondary"
              fontWeight="bold"
            >
             Error:
            </Typography>
            <Typography variant="h6" color="textPrimary">
              {data?.errorMessage}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              variant="subtitle1"
              color="textSecondary"
              fontWeight="bold"
            >
              API Endpoint:
            </Typography>
            <Typography variant="h6" color="textPrimary">
              {data?.apiEndpoint}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              variant="subtitle1"
              color="textSecondary"
              fontWeight="bold"
            >
              HTTP Method:
            </Typography>
            <Typography variant="h6" color="textPrimary">
              {data?.httpMethod}
            </Typography>
          </Grid>

          <Grid item xs={12}sm={6}>
            <Typography
              variant="subtitle1"
              color="textSecondary"
              fontWeight="bold"
            >
              Host:
            </Typography>
            <Typography variant="h6" color="textPrimary">
              {data?.host}
            </Typography>
          </Grid>
          <Grid item xs={12}sm={6}>
            <Typography
              variant="subtitle1"
              color="textSecondary"
              fontWeight="bold"
            >
             Agent
            </Typography>
            <Typography variant="h6" color="textPrimary">
              {data?.agent}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              variant="subtitle1"
              color="textSecondary"
              fontWeight="bold"
            >
              Created At:
            </Typography>
            <Typography variant="h6" color="textPrimary">
              {formatDate(data?.createdAt)}
            </Typography>
          </Grid>
         
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityView;
