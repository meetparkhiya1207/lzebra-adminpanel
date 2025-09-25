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

import { loginClient } from "src/api/clientApi"; // replace with your API call

import { Iconify } from "src/components/iconify";

export function SignInView() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  // Yup validation schema
  const signInSchema = Yup.object({
    mobile: Yup.string()
      .required("Mobile number is required")
      .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"),
    password: Yup.string().required("Password is required").min(3, "Password must be at least 3 characters long"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signInSchema),
  });

  const handleSignIn = useCallback(async (data: any) => {
    try {
      const res = await loginClient(data);
      if (res?.success) {
        toast.success(res?.message || "Login successful");
        sessionStorage.setItem("user", JSON.stringify(res?.data || {}));
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        toast.error(res?.message || "Invalid mobile number or password");
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  }, [router]);

  return (
    <>
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Welcome Back
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
          Sign in to your account 🚀
        </Typography>
      </Box>

      <Box sx={{ gap: 1.5, display: "flex", flexDirection: "column", alignItems: "center", mb: 5 }}>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Don’t have an account?{" "}
          <Link variant="subtitle2" sx={{ ml: 0.5 }} onClick={() => router.push("/sign-up")}>
            Get started
          </Link>
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit(handleSignIn)} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          fullWidth
          label="Mobile Number"
          {...register("mobile")}
          error={!!errors.mobile}
          helperText={errors.mobile?.message}
        />

        <TextField
          fullWidth
          label="Password"
          type={showPassword ? "text" : "password"}
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
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

        <Link variant="body2" color="inherit" sx={{ alignSelf: "flex-start" }} onClick={() => router.push("/forgot-password")}>
          Forgot password?
        </Link>

        <Button fullWidth size="large" type="submit" variant="contained" color="inherit">
          Sign in
        </Button>
      </Box>
    </>
  );
}
