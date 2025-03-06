import { Typography, Dialog, DialogContent, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { StyledButton } from "../../ui/StyledButton";
import { useMemberStore } from "../../store/Memberstore";
import { toast } from "react-toastify";
import { useState } from "react";

const DeleteProfile = ({ open, onClose, onChange, id }) => {
  const { handleSubmit } = useForm();
  const { deleteMembers } = useMemberStore();
  const [loading, setLoading] = useState(false);
  const onSubmit = async () => {
    setLoading(true);
    try {
      await deleteMembers(id);
      toast.success("Profile deleted successfully");
      onChange();
    } catch (error) {
      toast.error(error.message);
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
              Are you sure you want to delete the profile ?{" "}
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
            disabled={loading}
          />
          <StyledButton
            variant="primary"
            name={loading ? "Deleting..." : "Delete"}
            disabled={loading}
            type="submit"
          />
        </Stack>
      </form>
    </Dialog>
  );
};

export default DeleteProfile;
