import type { RouteObject } from "react-router";

import { lazy, Suspense } from "react";
import { varAlpha } from "minimal-shared/utils";
import { Outlet, Navigate } from "react-router-dom";

import Box from "@mui/material/Box";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";

import { AuthLayout } from "src/layouts/auth";
import { DashboardLayout } from "src/layouts/dashboard";
// import { useAuth } from "src/context/AuthContext"; // 👈 create this file separately

// ----------------------------------------------------------------------
// Lazy loaded pages
export const DashboardPage = lazy(() => import("src/pages/dashboard"));
export const BlogPage = lazy(() => import("src/pages/blog"));
export const UserPage = lazy(() => import("src/pages/user"));
export const SignInPage = lazy(() => import("src/pages/sign-in"));
export const SignUpPage = lazy(() => import("src/pages/sign-up"));
export const OrdersPage = lazy(() => import("src/pages/orders"));
export const ProductsPage = lazy(() => import("src/pages/products"));
export const Page404 = lazy(() => import("src/pages/page-not-found"));

// ----------------------------------------------------------------------
// Fallback loader
const renderFallback = () => (
  <Box
    sx={{
      display: "flex",
      flex: "1 1 auto",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) =>
          varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: "text.primary" },
      }}
    />
  </Box>
);

// ----------------------------------------------------------------------
// Protected Route wrapper
function ProtectedRoute() {
  const user = sessionStorage.getItem("user");
  // const { user } = useAuth(); // 👈 from AuthContext

  if (!user) {
  return <Navigate to="/sign-in" replace />;
  }

  return <Outlet />;
}

// ----------------------------------------------------------------------
// Routes
export const routesSection: RouteObject[] = [
  {
    element: <ProtectedRoute />, // 👈 check authentication
    children: [
      {
        element: (
          <DashboardLayout>
            <Suspense fallback={renderFallback()}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        ),
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "user", element: <UserPage /> },
          { path: "products", element: <ProductsPage /> },
          { path: "blog", element: <BlogPage /> },
          { path: "orders", element: <OrdersPage /> },
        ],
      },
    ],
  },
  {
    path: "sign-in",
    element: (
      <AuthLayout>
        <SignInPage />
      </AuthLayout>
    ),
  },
  {
    path: "sign-up",
    element: (
      <AuthLayout>
        <SignUpPage />
      </AuthLayout>
    ),
  },
  {
    path: "404",
    element: <Page404 />,
  },
  { path: "*", element: <Page404 /> },
];
