import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import DataTable from "react-data-table-component";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Card, Select, MenuItem, CardContent, OutlinedInput, CircularProgress } from "@mui/material";

import { getAllUsers } from "src/api/userApi";
import { DashboardContent } from "src/layouts/dashboard";

import { Label } from "src/components/label";

export function UserView() {
  const [products, setProducts] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState<any>('');
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllUsers();
        setAllUsers(data || []);
        setProducts(data || []);
      } catch (error) {
        console.error("❌ Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const columns = [
    {
      name: "Name",
      sortable: true,
      cell: (row: any) => (
        <Typography variant="caption" >{row?.customer_firstName + " " + row?.customer_lastName}</Typography>
      )
    },
    {
      name: "Email",
      selector: (row: any) => row?.customer_email,
    },
    {
      name: "Status",
      selector: (row: any) => row.isActive,
      cell: (row: any) => (
        <Label color={(row.isActive === false && 'error') || 'success'}>{row.isActive == true ? "Active" : "Offline"}</Label>
      ),
    },
  ];

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
      filtered = filtered.filter((u) =>
        statusFilter === "active" ? u.isActive === true : u.isActive === false
      );
    }

    setProducts(filtered);
  }, [search, statusFilter, allUsers]);

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
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              gap: 2,
            }}
          >
            {/* Left side title */}
            <Typography
              variant="h4"
              sx={{
                flexGrow: 1,
                color: "#5A3A1B",
                // fontFamily: "'Poppins', sans-serif",
              }}
            >
              Users
            </Typography>

            {/* Right side actions (search + button) */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 1.5,
                width: { xs: "100%", sm: "auto" },
              }}
            >
              <OutlinedInput
                placeholder="Search users..."
                size="small"
                sx={{
                  width: { xs: "100%", sm: 300, md: 400 },
                  // fontFamily: "'Poppins', sans-serif",
                }}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Select
                size="small"
                displayEmpty
                sx={{ width: { xs: "100%", sm: "180px" } }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All Users</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="offline">Offline</MenuItem>
              </Select>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
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
    </DashboardContent>
  );
}
