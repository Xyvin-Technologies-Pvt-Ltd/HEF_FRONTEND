import { Typography, Dialog, DialogContent, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { StyledButton } from "../../ui/StyledButton";
import { useProductStore } from "../../store/productStore";
import { useState } from "react";

const ApproveApproval = ({ open, onClose, setIsChange, id }) => {
  const { handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const { updateProduct } = useProductStore();
  const onSubmit = async () => {
    setLoading(true);
    try {
      const formData = {
        status: "accepted",
      };
      await updateProduct(id, formData);
      setIsChange((prev) => !prev);
    } catch (error) {
      console.error("Error approving feed:", error);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const handleClear = (event) => {
    event.preventDefault();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { borderRadius: "12px", padding: 2 },
      }}
    >
      {" "}
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ height: "auto", width: "330px" }}>
          <Stack
            // direction={"row"}
            spacing={2}
            paddingTop={2}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Typography
              variant="h3"
              color={"textTertiary"}
              textAlign={"center"}
            >
              Are you sure you want to approve?
            </Typography>
            <Typography
              variant="h7"
              color={"textSecondary"}
              textAlign={"center"}
            >
              {/* Lorem ipsum dolor sit amet consectetur. Eget in ac urna
              suspendisse.{" "} */}
            </Typography>
          </Stack>
        </DialogContent>
        <Stack
          direction={"row"}
          spacing={2}
          paddingBottom={2}
          justifyContent={"end"}
        >
          <StyledButton
            variant="secondary"
            name="Cancel"
            onClick={(event) => handleClear(event)}
          />
          <StyledButton
            variant="primary"
            name={loading ? "Approving..." : "Approve"}
            disabled={loading}
            type="submit"
          />
        </Stack>
      </form>
    </Dialog>
  );
};

export default ApproveApproval;
