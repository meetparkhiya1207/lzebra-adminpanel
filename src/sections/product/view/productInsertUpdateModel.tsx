import { toast } from 'react-toastify'
import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'

import DeleteIcon from '@mui/icons-material/Delete'
import {
  Box, Grid, Chip, Select, Button,
  MenuItem, TextField, InputLabel, Typography, IconButton, FormControl
} from '@mui/material'

import { createProduct, updateProduct } from 'src/api/productApi'

const ProductInsertUpdateModel = ({ setUserInsertUpdateModelOpen, rowData, modalType }: any) => {
  const categories = {
    'Cotton Fabric': ['Plain Cotton', 'Printed Cotton', 'Organic Cotton'],
    'Silk Fabric': ['Raw Silk', 'Banarasi Silk', 'Tussar Silk'],
    'Linen Fabric': ['Plain Linen', 'Embroidered Linen', 'Blended Linen'],
  }

  type CategoryKey = keyof typeof categories
  type FormValues = {
    productName: string
    category: CategoryKey | ""
    subCategory: string
    inStock: string
    price: string
    discountPrice: string
    tags: string[]
    description: string,
    features: string[],
    paintMeter: string,
    shirtMeter: string,
  }

  const [images, setImages] = useState<File[]>([])
  const [preview, setPreview] = useState<string[]>([])
  const [backendImages, setBackendImages] = useState<any[]>([]);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("")

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      productName: modalType === 'Edit' && rowData ? rowData?.productName : "",
      category: modalType === 'Edit' && rowData ? rowData?.category : "" as CategoryKey | "",
      subCategory: modalType === 'Edit' && rowData ? rowData?.subCategory : "",
      inStock: modalType === 'Edit' && rowData ? rowData?.inStock : "Yes",
      price: modalType === 'Edit' && rowData ? rowData?.price : "",
      discountPrice: modalType === 'Edit' && rowData ? rowData?.discountPrice : "",
      tags: modalType === 'Edit' && rowData ? rowData?.tags || [] : [],
      description: modalType === 'Edit' && rowData ? rowData?.description : "",
      features: modalType === 'Edit' && rowData ? rowData?.features || [] : [],
      paintMeter: modalType === 'Edit' && rowData ? rowData?.paintMeter : "",
      shirtMeter: modalType === 'Edit' && rowData ? rowData?.shirtMeter : "",
    }
  })
  console.log("rowDatarowData", rowData);

  const selectedCategory = watch("category")

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)

      // ✅ total check (existing backend + new)
      if (filesArray.length + backendImages.length + images.length > 5) {
        alert("You can only upload up to 5 images.")
        return
      }

      // ✅ merge new images with existing
      const newImages = [...images, ...filesArray]
      setImages(newImages)

      // ✅ backend preview + new preview merge
      const newPreview = [
        ...backendImages.map((img: any) => `${import.meta.env.VITE_BACKEND_URL}/uploads/${img.filename}`),
        ...newImages.map((file) => URL.createObjectURL(file))
      ]

      setPreview(newPreview)
    }
  }



  useEffect(() => {
    if (modalType === "Edit" && rowData?.images?.length > 0) {
      setBackendImages(rowData.images) // DB ની images track કરવી
      console.log("rowDatarowData",rowData);
      
      const backendPreview = rowData.images.map(
        (img: any) => img?.url
      )
      setPreview(backendPreview)
    }
  }, [modalType, rowData])

  const handleRemoveImage = (index: number) => {
    if (modalType === "Edit" && backendImages[index]) {
      setDeletedImages((prev) => [...prev, backendImages[index].filename])

      setBackendImages((prevBackend) => {
        const updatedBackend = prevBackend.filter((_, i) => i !== index)
        const updatedPreview = [
          ...updatedBackend.map((img: any) => img?.url),
          ...images.map((file) => URL.createObjectURL(file))
        ]
        setPreview(updatedPreview)
        return updatedBackend
      })
    } else {
      const newIndex = index - backendImages.length
      setImages((prevImages) => {
        const updatedImages = prevImages.filter((_, i) => i !== newIndex)
        const updatedPreview = [
          ...backendImages.map((img: any) =>img?.url),
          ...updatedImages.map((file) => URL.createObjectURL(file))
        ]
        setPreview(updatedPreview)
        return updatedImages
      })
    }
  }


  const onSubmit = async (data: FormValues) => {
    if (modalType !== "Edit") {
      try {
        const res = await createProduct(data, images);

        if (res?.success) {
          toast.success(res?.message);
          reset();
          setImages([]);
          setPreview([]);
          setUserInsertUpdateModelOpen(false);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to add product");
      }
    } else {
      try {
        const payload = { id: rowData?.product_id, ...data }
        const res = await updateProduct(payload, images, deletedImages)
        console.log("✅ Product Updated:", res);
        if (res?.success) {
          toast.success(res?.message);
          reset();
          setImages([]);
          setPreview([]);
          setUserInsertUpdateModelOpen(false);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to update product ❌");
      }
    }
  };


  return (
    <FormControl fullWidth component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={4}>
        <Grid size={6}>
          <Controller
            name="productName"
            control={control}
            // rules={{ required: "Product Name is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Product Name"
                fullWidth
                error={!!errors.productName}
                helperText={errors.productName?.message}
              />
            )}
          />
        </Grid>
        <Grid size={6}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Controller
              name="category"
              control={control}
              // rules={{ required: "Category is required" }}
              render={({ field }) => (
                <Select {...field} label="Category">
                  {Object.keys(categories).map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.category && (
              <Typography color="error" variant="caption">
                {errors.category.message}
              </Typography>
            )}
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={4} sx={{ marginTop: 4 }}>
        <Grid size={6}>
          <FormControl fullWidth disabled={!selectedCategory}>
            <InputLabel>Sub Category</InputLabel>
            <Controller
              name="subCategory"
              control={control}
              // rules={{ required: "Sub Category is required" }}
              render={({ field }) => (
                <Select {...field} label="Sub Category">
                  {selectedCategory &&
                    categories[selectedCategory].map((sub) => (
                      <MenuItem key={sub} value={sub}>
                        {sub}
                      </MenuItem>
                    ))}
                </Select>
              )}
            />
            {errors.subCategory && (
              <Typography color="error" variant="caption">
                {errors.subCategory.message}
              </Typography>
            )}
          </FormControl>
        </Grid>
        <Grid size={6}>
          <FormControl fullWidth>
            <InputLabel>In Stock</InputLabel>
            <Controller
              name="inStock"
              control={control}
              render={({ field }) => (
                <Select {...field} label="In Stock">
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={4} sx={{ marginTop: 4 }}>
        <Grid size={6}>
          <Controller
            name="price"
            control={control}
            // rules={{ required: "Price is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Price"
                fullWidth
                error={!!errors.price}
                helperText={errors.price?.message}
              />
            )}
          />
        </Grid>
        <Grid size={6}>
          <Controller
            name="discountPrice"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Discount Price" fullWidth />
            )}
          />
        </Grid>
      </Grid>
      <Grid container spacing={4} sx={{ marginTop: 4 }}>
        <Grid size={6}>
          <Controller
            name="paintMeter"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Paint Meter" fullWidth />
            )}
          />
        </Grid>

        <Grid size={6}>
          <Controller
            name="shirtMeter"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Shirt Meter" fullWidth />
            )}
          />
        </Grid>
      </Grid>

      <Grid size={6} sx={{ marginTop: 4 }}>
        {/* <Typography variant="subtitle1" gutterBottom>
          Features
        </Typography> */}

        <Controller
          name="features"
          control={control}
          render={({ field }) => {

            const handleAdd = () => {
              if (inputValue.trim() !== "") {
                field.onChange([...(field.value || []), inputValue.trim()])
                setInputValue("")
              }
            }

            const handleRemove = (index: number) => {
              const updated = field.value.filter((_: any, i: number) => i !== index)
              field.onChange(updated)
            }

            return (
              <Box>
                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                  <TextField
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    label="Features"
                    fullWidth
                  />
                  <Button
                    variant="contained"
                    sx={{ bgcolor: "#5A3A1B", color: "#fff" }}
                    onClick={handleAdd}
                  >
                    Add
                  </Button>
                </Box>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {field.value?.map((feature: string, index: number) => (
                    <Chip
                      key={index}
                      label={feature}
                      onDelete={() => handleRemove(index)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )
          }}
        />
      </Grid>
      <Grid container spacing={4} sx={{ marginTop: 4 }}>
        <Grid size={6}>
          <FormControl fullWidth>
            <InputLabel>Tags</InputLabel>
            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  multiple
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {(selected || []).map((value: any) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {['New Arrival', 'Best Seller', 'Limited Edition', 'Discount', 'Trending'].map((tag) => (
                    <MenuItem key={tag} value={tag}>
                      {tag}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Grid>
        <Grid size={6} sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ display: "flex", flexDirection: "row", gap: 2, alignItems: "center" }}>
            <Typography variant="subtitle1">Upload Images (Max 5)</Typography>
            <Button variant="outlined" color="inherit" component="label">
              Select Images
              <input
                hidden
                accept="image/*"
                multiple
                type="file"
                onChange={handleImageChange}
              />
            </Button>
          </Box>
        </Grid>
        {preview?.map((src, index) => (
          <Box key={index} sx={{ position: "relative" }}>
            <img
              src={src}
              alt={`preview-${index}`}
              style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 8 }}
            />
            <IconButton
              size="small"
              sx={{
                position: "absolute",
                top: -10,
                right: -10,
                background: "white",
                boxShadow: 1
              }}
              onClick={() => handleRemoveImage(index)}
            >
              <DeleteIcon fontSize="small" color="error" />
            </IconButton>
          </Box>
        ))}
      </Grid>


      <Grid size={12} sx={{ marginTop: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          Description
        </Typography>
        <Controller
          name="description"
          control={control}
          // rules={{ required: "Description is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              multiline
              rows={4}
              placeholder="Enter product description"
              variant="outlined"
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          )}
        />
      </Grid>

      <Box
        sx={{
          my: 5,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end"
        }}
      >
        <Button
          variant="outlined"
          sx={{ mr: 2, border: "1px solid #5A3A1B", color: "#5A3A1B" }}
          onClick={() => { reset(); setUserInsertUpdateModelOpen(false); }}
        >
          Cancel
        </Button>
        <Button type="submit" variant="contained" sx={{ bgcolor: "#5A3A1B", color: "#fff" }}>
          Submit
        </Button>
      </Box>
    </FormControl>
  )
}

export default ProductInsertUpdateModel
