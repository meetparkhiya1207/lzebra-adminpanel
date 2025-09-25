import { ToastContainer } from "react-toastify";
import DataTable from "react-data-table-component";
import { useMemo, useState, useEffect, useCallback } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Card, Button, Select, Popover, MenuList, MenuItem, CardContent, OutlinedInput, menuItemClasses, CircularProgress } from "@mui/material";

import { DashboardContent } from "src/layouts/dashboard";
import { getProducts, deleteProduct } from "src/api/productApi";

import { Label } from "src/components/label";
import { Iconify } from "src/components/iconify";

import ProductDetailsModel from "./product-details";
import ProductInsertUpdateModel from "./productInsertUpdateModel";

export function ProductsView() {
  const [userInsertUpdateModelOpen, setUserInsertUpdateModelOpen] = useState(false);
  const [products, setProducts] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState<any>(null);
  const [detailsData, setDetailsData] = useState<any>(null);
  const [productDetailOpen, setProductDetailOpen] = useState(false);
  const [modalType, setModalType] = useState<any>('');
  const [search, setSearch] = useState<any>('');
  const [selectedCategory, setSelectedCategory] = useState<any>("");
  const [allProducts, setAllProducts] = useState<any[]>([]);


  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setAllProducts(data || []); // store master list
        setProducts(data || []);    // also initialize filtered list
      } catch (error) {
        console.error("❌ Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [userInsertUpdateModelOpen]);

  const columns = [
    {
      name: "Image",
      width: "120px",
      cell: (row: any) => (
        row.images && row.images.length > 0 ? (
          <img
            src={row?.images[0]?.url}
            alt={row.productName}
            style={{
              width: 80,
              height: 80,
              objectFit: "cover",
              borderRadius: 6,
              marginTop: 6,
              marginBottom: 6,
            }}
          />
        ) : (
          <span>No Image</span>
        )
      ),
      sortable: false,
    },
    {
      name: "Name",
      // selector: (row: any) => row.productName,
      sortable: true,
      cell: (row: any) => (
        <Typography variant="caption" onClick={() => { setDetailsData(row); setProductDetailOpen(true) }
        }>{row?.productName}</Typography>
      )
    },
    {
      name: "Category",
      selector: (row: any) => row?.category,
      sortable: true,

    },
    {
      name: "Sub Category",
      selector: (row: any) => row.subCategory,
      sortable: true,
    },
    {
      name: "Price",
      width: "80px",
      selector: (row: any) => `₹${row.price}`,
      sortable: true,
    },
    {
      name: "Discount Price",
      selector: (row: any) => `₹${row.discountPrice}`,
      sortable: true,
      width: "130px",
    },
    {
      name: "In Stock",
      width: "100px",
      selector: (row: any) => row.inStock,
      sortable: true,
      cell: (row: any) => (
        <Label color={(row.inStock === 'No' && 'error') || 'success'}>{row.inStock == "Yes" ? "In Stock" : "Out of Stock"}</Label>
      ),
    },
    {
      width: "120px",
      name: "Created",
      selector: (row: any) => new Date(row.createdAt).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Actions",
      width: "200px",
      cell: (row: any) => (
        <>
          <Iconify icon={"mdi:eye-outline" as any} sx={{ color: "blue", mx: 1 }} width={22} height={22} />

          <Iconify icon={"mdi:pencil-outline" as any} sx={{ color: "green", mx: 1 }} width={22} height={22} onClick={() => {
            setModalType('Edit');
            setRowData(row);
            setUserInsertUpdateModelOpen(true);
            handleClosePopover();
          }} />

          <Iconify icon={"mdi:trash-can-outline" as any} sx={{ color: "red", mx: 1 }} width={22} height={22} onClick={async () => {

            try {
              const res = await deleteProduct(row.product_id); // 👈 backend ma product_id pass karo
              if (res.success) {
                // UI update: remove deleted product from state
                setProducts((prev: any) => prev.filter((p: any) => p?.product_id !== row.product_id));
              }
            } catch (error) {
              console.error("Delete failed:", error);
            }
          }} />


        </>
      ),
    }

  ];

  // Search filter
  useEffect(() => {
    let filtered = [...allProducts]; // 👈 use master list

    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.productName.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase()) ||
          p.subCategory.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setProducts(filtered);
  }, [search, selectedCategory, allProducts]);

  const categories = useMemo(
    () =>
      [...new Set(products.map((p: any) => p.category))].map((cat) => ({
        id: cat,
        name: cat,
      })),
    [products]
  );


  // const customStyles = {
  //   table: {
  //     style: {
  //       backgroundColor: "#faf6f0c2",
  //       fontFamily: "'Poppins', sans-serif",
  //     },
  //   },
  //   headRow: {
  //     style: {
  //       backgroundColor: "#faf6f0c2",
  //       color: "#5A3A1B",
  //       fontWeight: "bold",
  //       fontFamily: "'Poppins', sans-serif",
  //     },
  //   },
  //   rows: {
  //     style: {
  //       backgroundColor: "#faf6f0c2",
  //       color: "#5A3A1B",
  //       fontFamily: "'Poppins', sans-serif",
  //     },
  //     stripedStyle: {
  //       backgroundColor: "#faf6f0c2",
  //       fontFamily: "'Poppins', sans-serif",
  //     },
  //   },
  //   pagination: {
  //     style: {
  //       backgroundColor: "#faf6f0c2",
  //       color: "#5A3A1B",
  //       fontFamily: "'Poppins', sans-serif",
  //     },
  //   },
  // };

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
              flexDirection: { xs: "column", sm: "row" }, // 👈 mobile = column, tablet+ = row
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
              {userInsertUpdateModelOpen
                ? modalType === "Edit"
                  ? "Edit Product"
                  : "Add Product"
                : "Products"}
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
              {
                !userInsertUpdateModelOpen && (
                  <>
                    <OutlinedInput
                      placeholder="Search products..."
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
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <MenuItem value="">All Categories</MenuItem>
                      {categories?.map((cat: any) => (
                        <MenuItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </>
                )
              }
              <Button
                variant="contained"
                startIcon={
                  userInsertUpdateModelOpen ? "" : <Iconify icon="mingcute:add-line" />
                }
                onClick={() => {
                  setUserInsertUpdateModelOpen(!userInsertUpdateModelOpen);
                  setModalType("");
                  setRowData(null);
                }}
                sx={{
                  bgcolor: "#5A3A1B",
                  color: "#fff",
                  // fontFamily: "'Poppins', sans-serif",
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                {userInsertUpdateModelOpen ? "Back to Products" : "New Product"}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {userInsertUpdateModelOpen ? (
        <ProductInsertUpdateModel
          setUserInsertUpdateModelOpen={setUserInsertUpdateModelOpen}
          rowData={rowData}
          modalType={modalType}
        />
      ) : loading ? (
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
      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            fontFamily: "'Poppins', sans-serif",
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem
            onClick={() => {
              setModalType('Edit');
              setRowData(openPopover?.dataset?.row ? JSON.parse(openPopover.dataset.row) : null);
              setUserInsertUpdateModelOpen(true);
              handleClosePopover();
            }}
            sx={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem onClick={async () => {
            handleClosePopover();
            const row = openPopover?.dataset?.row ? JSON.parse(openPopover.dataset.row) : null;

            try {
              const res = await deleteProduct(row.product_id);
              if (res.success) {
                setProducts((prev: any) => prev.filter((p: any) => p?.product_id !== row.product_id));
              }
            } catch (error) {
              console.error("Delete failed:", error);
            }
          }} sx={{ color: 'error.main', fontFamily: "'Poppins', sans-serif" }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>

      {
        productDetailOpen && (
          <ProductDetailsModel productDetailOpen={productDetailOpen} setProductDetailOpen={setProductDetailOpen} detailsData={detailsData} />
        )
      }
    </DashboardContent>
  );
}
