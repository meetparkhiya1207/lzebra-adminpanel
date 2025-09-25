import * as Yup from "yup";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useState, useCallback } from "react";
import { yupResolver } from "@hookform/resolvers/yup";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";

import { useRouter } from "src/routes/hooks";

import { createClient } from "src/api/clientApi";

import { Iconify } from "src/components/iconify";

export function SignUpView() {
  const router = useRouter();

  const signUpSchema = Yup.object({
    companyName: Yup.string()
      .required("Company name is required")
      .min(3, "Company name must be at least 3 characters long"),

    mobile: Yup.string()
      .required("Mobile number is required")
      .matches(
        /^[0-9]{10}$/,
        "Mobile number must be exactly 10 digits"
      ),

    email: Yup.string()
      .required("Email address is required")
      .email("Invalid email address"),

    password: Yup.string()
      .required("Password is required")
      .min(3, "Password must be at least 3 characters long"),
    // .matches(
    //   /^(?=.*[A-Z])(?=.*\d)/,
    //   "Password must contain at least one uppercase letter and one number"
    // ),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), ""], "Passwords must match")
      .required("Confirm password is required"),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(signUpSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignUp = useCallback(async (data: any) => {
    try {
      const res = await createClient(data);
      if (res?.success) {
        toast.success(res?.message);
        setTimeout(() => {
          router.push('/sign-in');
        }, 2000);
      } else {
        toast.error(res?.message || "Sign up failed");

      }
    } catch (error) {
      console.error("❌ Create Client Error:", error);
      throw error;
    }
  }, []);

  return (
    <>
      {/* Welcome Section */}
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Welcome to Lzebra
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
          Create your account and get started 🚀
        </Typography>
      </Box>

      {/* Form Header */}
      <Box sx={{ gap: 1.5, display: "flex", flexDirection: "column", alignItems: "center", mb: 5 }}>
        {/* <Typography variant="h5">Register</Typography> */}
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Already have an account? <Link variant="subtitle2" sx={{ ml: 0.5 }}>Sign in</Link>
        </Typography>
      </Box>

      {/* Registration Form */}
      <Box component="form" onSubmit={handleSubmit(handleSignUp)} sx={{ display: "flex", flexDirection: "column" }}>
        <TextField
          fullWidth
          label="Company Name"
          {...register("companyName")}
          error={!!errors.companyName}
          helperText={errors.companyName?.message}
          sx={{ mb: 3 }}
        />

        <TextField
          fullWidth
          label="Mobile Number"
          {...register("mobile")}
          error={!!errors.mobile}
          helperText={errors.mobile?.message}
          sx={{ mb: 3 }}
        />

        <TextField
          fullWidth
          label="Email Address"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
          sx={{ mb: 3 }}
        />

        <TextField
          fullWidth
          label="Password"
          type={showPassword ? "text" : "password"}
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
          sx={{ mb: 3 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? "solar:eye-bold" : "solar:eye-closed-bold"} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          {...register("confirmPassword")}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          sx={{ mb: 3 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                  <Iconify icon={showConfirmPassword ? "solar:eye-bold" : "solar:eye-closed-bold"} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button fullWidth size="large" type="submit" variant="contained" color="inherit">
          Register
        </Button>
      </Box>
    </>
  );
}
