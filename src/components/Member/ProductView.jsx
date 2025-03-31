import {
  Typography,
  Dialog,
  DialogContent,
  Stack,
  DialogTitle,
  Box,
  Divider,
  Avatar,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { ReactComponent as CloseIcon } from "../../assets/icons/CloseIcon.svg";
import { StyledButton } from "../../ui/StyledButton";
import { useNewsStore } from "../../store/newsStore";
import { toast } from "react-toastify";
import { useProductStore } from "../../store/productStore";
import { useNavigate } from "react-router-dom";

const ProductView = ({ open, onClose, onChange, data, onEdit, view }) => {
  const { handleSubmit } = useForm();
  const { deleteProduct } = useProductStore();
  const navigate = useNavigate();
  const onSubmit = async () => {
    navigate(`/products/${data?._id}`, {
      state: { productId: data?._id, isUpdate: true },
    });
  };

  const handleClear = (event) => {
    event.preventDefault();
    onClose();
  };
  const handleEdit = (event) => {
    event.preventDefault();
    onEdit();
    onClose();
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
      {" "}
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle sx={{ height: "auto", padding: 3 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h3" color={"textTertiary"}>
              Product Preview
            </Typography>{" "}
            <Typography
              onClick={(event) => handleClear(event)}
              color="#E71D36"
              style={{ cursor: "pointer" }}
            >
              <CloseIcon />
            </Typography>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ height: "auto", padding: 0 }}>
          <Stack spacing={2} padding={2} justifyContent={"center"}>
            <Box display="flex" justifyContent="center">
              <img src={data?.image} width={"461px"} height={"262px"} />
            </Box>

            <Typography variant="h5" color={"textTertiary"}>
              {data?.name}
            </Typography>
            <Typography variant="h7" color={"textSecondary"}>
              {data?.description}
            </Typography>
            <Typography variant="h4" color="textSecondary">
              <span
                style={{
                  textDecoration: "line-through",
                  color: "#EB5860",
                  marginRight: "8px",
                }}
              >
                ₹{data?.price}
              </span>
              ₹{data?.offerPrice} per {data?.units}
            </Typography>
            {view && (
              <>
                <Divider />
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" color="textTertiary" sx={{ mb: 1 }}>
                    Seller Details
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                      src={data?.seller?.image}
                      alt={data?.seller?.name}
                      sx={{ width: 56, height: 56 }}
                    />
                    <Box>
                      <Typography variant="subtitle1" color="textPrimary">
                        {data?.seller?.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Member ID: {data?.seller?.memberId}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </>
            )}
          </Stack>{" "}
        </DialogContent>
        {!view && (
          <Stack
            direction={"row"}
            spacing={2}
            padding={2}
            justifyContent={"end"}
          >
            <StyledButton
              variant="secondary"
              name="Delete"
              onClick={async (event) => {
                event.preventDefault();
                try {
                  await deleteProduct(data?._id);
                  onChange();
                  toast.success("Deleted successfully");
                  onClose();
                } catch (error) {
                  toast.error(error.message);
                } finally {
                  onClose();
                }
              }}
            />
            <StyledButton variant="primary" name={"Edit"} type="submit" />
          </Stack>
        )}
      </form>
    </Dialog>
  );
};

export default ProductView;
