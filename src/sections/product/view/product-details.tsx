import React, { useState } from "react";

import {
    Box,
    Tab,
    Tabs,
    Grid,
    Modal,
    Divider,
    Typography,
} from "@mui/material";

interface ProductImage {
    filename: string;
}

interface ProductDetails {
    productName: string;
    category: string;
    subCategory: string;
    price: number;
    discountPrice: number;
    images: (string | ProductImage)[];
    features: (string)[];
}

interface Props {
    productDetailOpen: boolean;
    setProductDetailOpen: (open: boolean) => void;
    detailsData: ProductDetails | null;
}

const ProductDetailsModel: React.FC<Props> = ({
    productDetailOpen,
    setProductDetailOpen,
    detailsData,
}) => {
    const [tab, setTab] = useState(0);

    const handleClose = () => {
        setProductDetailOpen(false);
        setTab(0);
    };

    console.log("detailsData", detailsData);

    return (
        <Modal open={productDetailOpen} onClose={handleClose}>
            <Box
                sx={{
                    bgcolor: "#FAF6F0",
                    p: 3,
                    borderRadius: 2,
                    maxWidth: 800,
                    mx: "auto",
                    my: "5%",
                    display: "flex",
                    flexDirection: "column",
                    maxHeight: "80vh", // full modal height limit
                }}
            >
                {detailsData && (
                    <>
                        {/* Sticky Header */}
                        <Box sx={{ flexShrink: 0 }}>
                            <Typography variant="h6" mb={2}>
                                Product Details
                            </Typography>

                            <Tabs value={tab} onChange={(e, v) => setTab(v)}>
                                <Tab label="Details" />
                                <Tab label="Images" />
                                <Tab label="Features" />
                            </Tabs>
                            <Divider sx={{ my: 2 }} />
                        </Box>

                        {/* Scrollable Content */}
                        <Box
                            sx={{
                                flexGrow: 1,
                                overflowY: "auto",
                                pr: 1, // padding right for scrollbar space
                            }}
                        >
                            {/* Tab 1 - Product Details */}
                            {tab === 0 && (
                                <Box>
                                    <Typography variant="body1" gutterBottom>
                                        Name : {detailsData?.productName}
                                    </Typography>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="body1" gutterBottom>
                                        Category : {detailsData?.category}
                                    </Typography>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="body1" gutterBottom>
                                        Sub Category : {detailsData?.subCategory}
                                    </Typography>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="body1">
                                        Price: ₹{detailsData?.price}
                                    </Typography>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="body1">
                                        Discount Price: ₹{detailsData?.discountPrice}
                                    </Typography>
                                </Box>
                            )}

                            {/* Tab 2 - Product Images */}
                            {tab === 1 && (
                                <Grid container spacing={2}>
                                    {(detailsData.images || []).map((img, i) => {
                                        const imgSrc =
                                            typeof img === "string"
                                                ? `http://localhost:5000/uploads/${img}`
                                                : `http://localhost:5000/uploads/${img.filename}`;

                                        return (
                                            <Grid size={6}>
                                                <Box
                                                    component="img"
                                                    src={imgSrc}
                                                    alt="product"
                                                    sx={{
                                                        width: "400px",
                                                        height: "400px",
                                                        objectFit: 'cover',
                                                    }}
                                                />
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            )}
                            {tab === 2 && (
                                <>
                                    {detailsData?.features?.map((val: string, index: number) => (
                                        <Box key={index}>
                                            <Typography variant="body1" gutterBottom>
                                                • {val}
                                            </Typography>
                                            <Divider sx={{ my: 2 }} />
                                        </Box>
                                    ))}
                                </>
                            )}

                        </Box>
                    </>
                )}
            </Box>
        </Modal>

    );
};

export default ProductDetailsModel;
