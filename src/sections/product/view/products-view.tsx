import { ToastContainer } from "react-toastify";
import DataTable from "react-data-table-component";
import { useState, useEffect, useCallback } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button, Popover, MenuList, MenuItem, IconButton, menuItemClasses, CircularProgress } from "@mui/material";

import { DashboardContent } from "src/layouts/dashboard";
import { getProducts, deleteProduct } from "src/api/productApi";

import { Label } from "src/components/label";
import { Iconify } from "src/components/iconify";

import ProductDetailsModel from "./product-details";
import ProductInsertUpdateModel from "./productInsertUpdateModel";

export function ProductsView() {
  const [userInsertUpdateModelOpen, setUserInsertUpdateModelOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState<any>(null);
  const [detailsData, setDetailsData] = useState<any>(null);
  const [productDetailOpen, setProductDetailOpen] = useState(false);
  const [modalType, setModalType] = useState<any>('');

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
        setProducts(data || []);
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
        }>{row.productName}</Typography>
      )
    },
    {
      name: "Category",
      selector: (row: any) => row.category,
      sortable: true,

    },
    {
      name: "Sub Category",
      selector: (row: any) => row.subCategory,
      sortable: true,
    },
    {
      name: "Price",
      selector: (row: any) => `₹${row.price}`,
      sortable: true,
    },
    {
      name: "Discount Price",
      selector: (row: any) => `₹${row.discountPrice}`,
      sortable: true,
    },
    {
      name: "In Stock",
      selector: (row: any) => row.inStock,
      sortable: true,
      cell: (row: any) => (
        <Label color={(row.inStock === 'No' && 'error') || 'success'}>{row.inStock == "Yes" ? "In Stock" : "Out of Stock"}</Label>
      ),
    },
    {
      name: "Created",
      selector: (row: any) => new Date(row.createdAt).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row: any) => (
        <IconButton
          onClick={(e) => {
            e.currentTarget.dataset.row = JSON.stringify(row);
            handleOpenPopover(e);
          }}
        >
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      ),
    }

  ];

  const customStyles = {
    table: {
      style: {
        backgroundColor: "#faf6f0c2",
        fontFamily: "'Poppins', sans-serif",
      },
    },
    headRow: {
      style: {
        backgroundColor: "#faf6f0c2",
        color: "#5A3A1B",
        fontWeight: "bold",
        fontFamily: "'Poppins', sans-serif",
      },
    },
    rows: {
      style: {
        backgroundColor: "#faf6f0c2",
        color: "#5A3A1B",
        fontFamily: "'Poppins', sans-serif",
      },
      stripedStyle: {
        backgroundColor: "#faf6f0c2",
        fontFamily: "'Poppins', sans-serif",
      },
    },
    pagination: {
      style: {
        backgroundColor: "#faf6f0c2",
        color: "#5A3A1B",
        fontFamily: "'Poppins', sans-serif",
      },
    },
  };

  return (
    <DashboardContent>
      <ToastContainer />
      <Box
        sx={{
          mb: 5,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" sx={{ flexGrow: 1, color: "#5A3A1B", fontFamily: "'Poppins', sans-serif", }}>
          {userInsertUpdateModelOpen ? modalType === 'Edit' ? "Edit Product" : "Add Product" : "Products"}
        </Typography>
        <Button
          variant="contained"
          startIcon={
            userInsertUpdateModelOpen ? "" : <Iconify icon="mingcute:add-line" />
          }
          onClick={() => {
            setUserInsertUpdateModelOpen(!userInsertUpdateModelOpen)
            setModalType('');
            setRowData(null);
          }
          }
          sx={{ bgcolor: "#5A3A1B", color: "#fff", fontFamily: "'Poppins', sans-serif" }}
        >
          {userInsertUpdateModelOpen ? "Back to Products" : "New Product"}
        </Button>
      </Box>

      {userInsertUpdateModelOpen ? (
        <ProductInsertUpdateModel
          setUserInsertUpdateModelOpen={setUserInsertUpdateModelOpen}
          rowData={rowData}
          modalType={modalType}
        />
      ) : loading ? (
        <CircularProgress />
      ) : (
        <DataTable
          columns={columns}
          data={products || []}
          pagination
          highlightOnHover
          customStyles={customStyles}

          striped
        />
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
              const res = await deleteProduct(row.product_id); // 👈 backend ma product_id pass karo
              if (res.success) {
                // UI update: remove deleted product from state
                setProducts((prev) => prev.filter((p:any) => p?.product_id !== row.product_id));
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
