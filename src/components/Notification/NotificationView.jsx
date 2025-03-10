import {
  Typography,
  Dialog,
  DialogContent,
  Box,
  IconButton,
  Avatar,
  Chip,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { format } from "date-fns";

const NotificationView = ({ open, onClose, data }) => {
  if (!data) return null;

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy • h:mm a");
    } catch {
      return "N/A";
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          overflow: "hidden",
        },
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        {data.media && (
          <Box
            sx={{
              position: "relative",
              height: "200px",
              overflow: "hidden",
            }}
          >
            <img
              src={data.media}
              alt="Notification"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                m: 1.5,
              }}
            >
              <IconButton
                onClick={onClose}
                sx={{
                  backgroundColor: "rgba(255,255,255,0.8)",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
                }}
                size="small"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        )}

        <Box
          sx={{
            p: 3,
            position: "relative",
          }}
        >
          {!data.media && (
            <Box
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
              }}
            >
              <IconButton onClick={onClose} size="small">
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          )}

          <Chip
            label={data.type || "notification"}
            size="small"
            color="primary"
            sx={{
              textTransform: "capitalize",
              borderRadius: "6px",
              height: "24px",
              mb: 2,
            }}
          />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: 1.5,
              lineHeight: 1.2,
            }}
          >
            {data.subject || "No Subject"}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {data.content || "No Content"}
          </Typography>
          <Divider sx={{ my: 2 }} />
          {data.users && data.users.length > 0 && (
            <>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                Recipients
              </Typography>
              <List disablePadding>
                {data.users.map((userObj, index) => (
                  <ListItem
                    key={index}
                    disablePadding
                    disableGutters
                    sx={{ mb: 1 }}
                  >
                    <ListItemAvatar sx={{ minWidth: 40 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: "grey.200",
                          color: "text.primary",
                          fontSize: "14px",
                        }}
                      >
                        {userObj.user?.name?.[0] || "U"}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={userObj.user?.name || "Unknown"}
                      primaryTypographyProps={{
                        variant: "body2",
                        fontWeight: 500,
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}

          <Box sx={{ mt: 2 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              sx={{ mb: 0.5 }}
            >
              Created: {formatDate(data.createdAt)}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationView;
