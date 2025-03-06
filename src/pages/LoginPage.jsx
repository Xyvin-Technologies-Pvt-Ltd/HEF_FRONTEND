import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Stack,
  Link,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Phone from "@mui/icons-material/Phone";
import Lock from "@mui/icons-material/Lock";
import { useNavigate } from "react-router-dom";
import { getLogin } from "../api/adminapi";
import Logo from "../assets/images/logo.png";
import { StyledButton } from "../ui/StyledButton";

function LoginPage() {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showOTP, setShowOTP] = useState(true);
  const [loginError, setLoginError] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = {
        email: data.phone,
        password: data.otp,
      };
      const user = await getLogin(formData);
      localStorage.setItem("4ZbQwXtY8uVrN5mP7kL3JhF6", user.data);
      navigate("/dashboard");
    } catch (error) {
      setLoginError(true);
      console.error("Login error", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (localStorage.getItem("4ZbQwXtY8uVrN5mP7kL3JhF6")) {
      navigate("/dashboard");
    }
  }, []);
  return (
    <Grid container justifyContent="center" alignItems="center" height="100vh">
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Box sx={{ p: 4, bgcolor: "#FFFFFF", borderRadius: 5, boxShadow: 2 }}>
          <Stack spacing={3} justifyContent="center" alignItems={"center"}>
            <img src={Logo} alt="Logo" width={"60px"} height="57px" />
          </Stack>

          <Stack
            direction={"column"}
            spacing={2}
            sx={{ marginTop: 8, marginBottom: 5 }}
          >
            <Typography variant="h5" align="left">
              Sign In
            </Typography>
            <Typography variant="body2" color="text.secondary" align="left">
              Login to your account to continue the process
            </Typography>
          </Stack>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              {/* Phone Number Input */}
              <Controller
                name="phone"
                control={control}
                defaultValue=""
                rules={{ required: "Email is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Enter your Email"
                    variant="outlined"
                    error={!!errors.phone}
                    helperText={errors.phone ? errors.phone.message : ""}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone color="action" />
                        </InputAdornment>
                      ),
                      sx: {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(0, 0, 0, 0.2)",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(0, 0, 0, 0.2)",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(0, 0, 0, 0.2)",
                        },
                      },
                    }}
                    InputLabelProps={{
                      sx: {
                        color: "#888888",
                        "&.Mui-focused": {
                          color: "#000000",
                        },
                      },
                    }}
                  />
                )}
              />
              <Controller
                name="otp"
                control={control}
                defaultValue=""
                rules={{ required: "Password is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Enter Password"
                    variant="outlined"
                    type={showOTP ? "password" : "text"}
                    error={!!errors.otp}
                    helperText={errors.otp ? errors.otp.message : ""}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowOTP(!showOTP)}
                            edge="end"
                          >
                            {showOTP ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(0, 0, 0, 0.2)",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(0, 0, 0, 0.2)",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(0, 0, 0, 0.2)",
                        },
                      },
                    }}
                    InputLabelProps={{
                      sx: {
                        color: "#888888",
                        "&.Mui-focused": {
                          color: "#000000",
                        },
                      },
                    }}
                  />
                )}
              />

              {/* Error Message */}
              {loginError && (
                <Typography color="error" variant="body2">
                  Email or Password is Incorrect
                </Typography>
              )}

              {/* Submit Button */}
              <StyledButton
                name={loading ? "Signing In..." : "Sign In"}
                variant="primary"
                type="submit"
                disabled={loading}
              >
                Sign In
              </StyledButton>
            </Stack>
          </form>

          {/* Forgot Password Link */}
          <Grid marginTop={2}>
            <Link href="#" variant="body2" align="center">
              Forgot Your Password?
            </Link>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}

export default LoginPage;
