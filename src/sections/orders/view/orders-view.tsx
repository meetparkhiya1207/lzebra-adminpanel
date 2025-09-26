import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import DataTable from "react-data-table-component";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import {
  Card,
  Grid,
  Select,
  Button,
  Dialog,
  Divider,
  MenuItem,
  CardContent,
  DialogTitle,
  OutlinedInput,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";

import { getAllOrdes } from "src/api/ordersApi";
import { DashboardContent } from "src/layouts/dashboard";

import { Label } from "src/components/label";
import { Iconify } from "src/components/iconify";

export function OrdersView() {
  const [products, setProducts] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState<any>("");
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");

  // date filters
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Order details modal
  const [openModal, setOpenModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Fetch orders
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllOrdes();
        setAllUsers(data?.order || []);
        setProducts(data?.order || []);
      } catch (error) {
        console.error("❌ Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#9E9E9E";
      case "confirmed":
        return "#1976D2";
      case "processing":
        return "#FFA000";
      case "shipped":
        return "#0288D1";
      case "delivered":
        return "#2E7D32";
      case "cancelled":
        return "#D32F2F";
      default:
        return "#757575";
    }
  };

  const columns = [
    {
      name: "Order Date",
      sortable: true,
      cell: (row: any) => {
        const date = new Date(row?.createdAt);
        return (
          <Typography variant="caption">
            {date.toLocaleDateString("en-GB")}
          </Typography>
        );
      },
    },
    {
      name: "Name",
      sortable: true,
      cell: (row: any) => (
        <Typography variant="caption">
          {row?.shippingForm?.firstName + " " + row?.shippingForm?.lastName}
        </Typography>
      ),
    },
    {
      name: "Email",
      selector: (row: any) => row?.shippingForm?.email,
    },
    {
      name: "Phone",
      selector: (row: any) => row?.shippingForm?.phone,
    },
    {
      name: "Status",
      selector: (row: any) => row.status,
      cell: (row: any) => {
        const statusColors: any = {
          pending: "warning",
          processing: "info",
          delivered: "success",
          cancelled: "error",
          // confirmed
          // shipped
        };
        return (
          <Label sx={{ bgcolor: getStatusColor(row.status), color: "#fff" }}>
            {row.status}
          </Label>
        );
      },
    },
    {
      name: "Actions",
      cell: (row: any) => (
        <Iconify icon={"mdi:eye-outline" as any} sx={{ color: "blue", mx: 1 }} width={22} height={22} onClick={() => {
          setSelectedOrder(row);
          setOpenModal(true);
        }} />
      ),
    },
  ];

  // filtering
  useEffect(() => {
    let filtered = [...allUsers];

    if (search) {
      filtered = filtered.filter(
        (u) =>
          (u.customer_firstName + " " + u.customer_lastName)
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          u.customer_email?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((u) => u.order_status === statusFilter);
    }

    if (startDate && endDate) {
      filtered = filtered.filter((u) => {
        const orderDate = new Date(u.createdAt);
        return orderDate >= startDate && orderDate <= endDate;
      });
    }

    setProducts(filtered);
  }, [search, statusFilter, startDate, endDate, allUsers]);

  return (
    <DashboardContent>
      <ToastContainer />
      <Card
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          mb: 2,
          bgcolor: "#fff",
          pt: 1,
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "flex-start", md: "center" },
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Typography
              variant="h4"
              sx={{ flexGrow: 1, color: "#5A3A1B" }}
            >
              Orders
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "stretch", sm: "center" },
                gap: 2,
                // mt:2,
                width: { xs: "100%", md: "auto" }
              }}
            >
              {/* Search */}
              <OutlinedInput
                placeholder="Search orders..."
                size="small"
                sx={{ flex: 1, minWidth: { xs: "100%", sm: 190, md: 400 } }}
                onChange={(e) => setSearch(e.target.value)}
              />

              {/* Status Filter */}
              <Select
                size="small"
                displayEmpty
                sx={{ flex: 1, minWidth: { xs: "100%", sm: "50%", md: "180px" } }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="processing">Processing</MenuItem>
                <MenuItem value="dispatched">Dispatched</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>

              {/* Date Pickers */}
              {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                />
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                />
              </LocalizationProvider> */}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ height: "70vh" }}>
          <Card>
            <CardContent sx={{ p: 0 }}>
              <DataTable
                columns={columns}
                data={products || []}
                pagination
                highlightOnHover
                striped
                fixedHeader
                fixedHeaderScrollHeight="65vh"
              />
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Order Details Modal */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          <Typography
            variant="h4"
            sx={{ flexGrow: 1, color: "#5A3A1B" }}
          >
            Order Details
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          {selectedOrder ? (
            <Box>
              {/* Customer Info */}
              <Typography variant="h6" gutterBottom>
                User Information
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography>
                    <b>Name:</b> {selectedOrder?.shippingForm?.firstName}{" "}
                    {selectedOrder?.shippingForm?.lastName}
                  </Typography>
                  <Typography>
                    <b>Email:</b> {selectedOrder?.shippingForm?.email}
                  </Typography>
                  <Typography>
                    <b>Phone:</b> {selectedOrder?.shippingForm?.phone}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography>
                    <b>Address:</b> {selectedOrder?.shippingForm?.address}
                  </Typography>
                  <Typography>
                    <b>City:</b> {selectedOrder?.shippingForm?.city}
                  </Typography>
                  <Typography>
                    <b>State:</b> {selectedOrder?.shippingForm?.state}
                  </Typography>
                  <Typography>
                    <b>Pincode:</b> {selectedOrder?.shippingForm?.zipCode}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              {/* Products */}
              <Typography variant="h6" gutterBottom>
                Purchased Products
              </Typography>
              {selectedOrder.orderItems?.map((p: any, idx: number) => (
                <Box
                  key={idx}
                  sx={{
                    mb: 1,
                    p: 1.5,
                    border: "1px solid #eee",
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  {/* Product Image */}
                  <img
                    src={p.images[0]?.url || "/no-image.png"}
                    alt={p.productName}
                    style={{
                      width: 60,
                      height: 60,
                      objectFit: "cover",
                      borderRadius: 8,
                      border: "1px solid #ddd",
                    }}
                  />

                  {/* Product Details */}
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600 }}
                    >
                      {p.productName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Qty: {p.quantity} × ₹{p.price} ={" "}
                      <b>₹{p.quantity * p.price}</b>
                    </Typography>
                  </Box>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              {/* Billing Summary */}
              <Typography variant="h6" gutterBottom>
                Billing Summary
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Typography>
                  Subtotal: ₹{selectedOrder?.subtotal}
                </Typography>
                <Typography>
                  Discount: ₹{selectedOrder?.discount || 0}
                </Typography>
                <Typography>
                  Tax: ₹{selectedOrder?.tax || 0}
                </Typography>
                <Typography
                  sx={{ fontWeight: 600, fontSize: "1.1rem" }}
                >
                  Total: ₹{selectedOrder?.total}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Typography>No order details available.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
