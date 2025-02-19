import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Box,
    Button,
    Stack,
  } from "@mui/material";
  import { ReactComponent as CloseIcon } from "../../assets/icons/CloseIcon.svg";
  const PaymentView = ({ open, onClose, data }) => {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: { borderRadius: "12px", width: "400px", padding: "16px" },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", fontSize: "16px" }}>
          <Stack direction={"row"} justifyContent={"space-between"}>
            {" "}
            Payment Details
            <Typography
              onClick={onClose}
              color="#E71D36"
              style={{ cursor: "pointer" }}
            >
              <CloseIcon />
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Typography variant="h6">
              <strong>Amount:</strong> ₹{data.amount}
            </Typography>
            <Typography variant="h6">
              <strong>Category:</strong> {data.category}
            </Typography>
            {data.receipt && (
              <>
                {" "}
                <Typography variant="body1" sx={{ marginBottom: "8px" }}>
                  <strong>Receipt:</strong>
                </Typography>
                <img
                  src={data.receipt}
                  alt="Receipt"
                  style={{ maxWidth: "100%", borderRadius: "8px" }}
                />
              </>
            )}
          </Stack>
        </DialogContent>
      </Dialog>
    );
  };
  
  export default PaymentView;
  