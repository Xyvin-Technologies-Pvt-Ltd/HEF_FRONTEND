import { Box, Grid, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { StyledButton } from "../../ui/StyledButton";
import PromotionItem from "./PromotionItem";
import { ReactComponent as AddIcon } from "../../assets/icons/AddIcon.svg";
import { useAdminStore } from "../../store/adminStore";
export default function Promotionpage() {
  const navigate = useNavigate();
  const { singleAdmin } = useAdminStore();
  return (
    <>
      {" "}
      <Box
        padding={"10px"}
        bgcolor={"#FFFFFF"}
        height={"70px"}
        display={"flex"}
        alignItems={"center"}
      >
        <Grid container alignItems="center">
          <Grid item xs={6}>
            <Typography variant="h4" color={"textSecondary"}>
              Promotions
            </Typography>
          </Grid>
          <Grid item xs={6} container justifyContent="flex-end" spacing={2}>
            <Grid item>
              {singleAdmin?.role?.permissions?.includes(
                "promotionManagement_modify"
              ) && (
                <StyledButton
                  name={
                    <>
                      <AddIcon /> Add Promotion
                    </>
                  }
                  variant="primary"
                  onClick={() => navigate("/promotions/promotion")}
                />
              )}
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <>
        <PromotionItem />
      </>
    </>
  );
}
