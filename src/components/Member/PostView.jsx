import {
    Typography,
    Dialog,
    DialogContent,
    Stack,
    DialogTitle,
    Box,
    Divider,
  } from "@mui/material";
  import { useForm } from "react-hook-form";
  import { StyledButton } from "../ui/StyledButton";
  import { ReactComponent as CloseIcon } from "../assets/icons/CloseIcon.svg";
  import { useApprovalStore } from "../store/approval-store";
  
  const PostView = ({ open, onClose,  data }) => {
    const { handleSubmit } = useForm();
    const onSubmit = async () => {
     
      onClose();
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
              <Typography variant="h3" color={"#4F4F4F"}>
                Requirement detail
              </Typography>
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
          <DialogContent sx={{ height: "auto", width: "500px", padding: 0 }}>
            <Stack
              spacing={2}
              padding={2}
              direction={"row"}
              justifyContent={"center"}
            >
              <img src={data?.image} width={"417px"} height={"262px"} />
            </Stack>{" "}
            <Divider />
            <Stack spacing={2} padding={2} justifyContent={"space-between"}>
              <Typography variant="h7" color={"#2C2829"} fontWeight={700}>
                Description
              </Typography>
              <Typography variant="h6" color={"#4A4647"}>
                {data?.content}
              </Typography>
            </Stack>{" "}
            <Divider />
          </DialogContent>
          <Stack direction={"row"} spacing={2} padding={2} justifyContent={"end"}>
            <StyledButton
              variant="secondary"
              name="Deny"
              onClick={(event) => handleClear(event)}
            />
            <StyledButton variant="primary" name="Approve" type="submit" />
          </Stack>
        </form>
      </Dialog>
    );
  };
  
  export default PostView;
  