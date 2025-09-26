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

const ProductDetailsModel = ({
    productDetailOpen,
    setProductDetailOpen,
    detailsData,
}: any) => {
    const [tab, setTab] = useState(0);

    const handleClose = () => {
        setProductDetailOpen(false);
        setTab(0);
    };

    return (
        <Modal open={productDetailOpen} onClose={handleClose}>
            <Box
                sx={{
                    bgcolor: "#FAF6F0",
                    p: { xs: 2, sm: 3 },
                    borderRadius: 2,
                    width: { xs: "95%", sm: "90%", md: "80%", lg: "70%" }, // responsive width
                    mx: "auto",
                    my: { xs: "10%", sm: "5%" },
                    display: "flex",
                    flexDirection: "column",
                    maxHeight: "85vh", // limit height
                }}
            >
                {detailsData && (
                    <>
                        {/* Sticky Header */}
                        <Box sx={{ flexShrink: 0 }}>
                            <Typography
                                variant="h6"
                                mb={2}
                                sx={{ textAlign: { xs: "center", sm: "left" } }}
                            >
                                Product Details
                            </Typography>

                            <Tabs
                                value={tab}
                                onChange={(e, v) => setTab(v)}
                                variant="scrollable"
                                scrollButtons
                                allowScrollButtonsMobile
                            >
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
                                pr: 1,
                            }}
                        >
                            {/* Tab 1 - Product Details */}
                            {tab === 0 && (
                                <Box>
                                    <Typography variant="body1" gutterBottom>
                                        <b>Name:</b> {detailsData?.productName}
                                    </Typography>
                                    <Divider sx={{ my: 1 }} />

                                    <Typography variant="body1" gutterBottom>
                                        <b>Category:</b> {detailsData?.category}
                                    </Typography>
                                    <Divider sx={{ my: 1 }} />

                                    <Typography variant="body1" gutterBottom>
                                        <b>Sub Category:</b> {detailsData?.subCategory}
                                    </Typography>
                                    <Divider sx={{ my: 1 }} />

                                    <Typography variant="body1" gutterBottom>
                                        <b>Price:</b> ₹{detailsData?.price}
                                    </Typography>
                                    <Divider sx={{ my: 1 }} />

                                    <Typography variant="body1" gutterBottom>
                                        <b>Discount Price:</b> ₹{detailsData?.discountPrice}
                                    </Typography>
                                </Box>
                            )}

                            {/* Tab 2 - Product Images */}
                            {tab === 1 && (
                                <Grid container spacing={2}>
                                    {(detailsData.images || []).map((img: any, i: any) => {
                                        const imgSrc = img?.url;

                                        return (
                                            <Grid size={{ xs: 12, sm: 6 }}>
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

                            {/* Tab 3 - Product Features */}
                            {tab === 2 && (
                                <>
                                    {detailsData?.features?.map((val: string, index: number) => (
                                        <Box key={index}>
                                            <Typography variant="body1" gutterBottom>
                                                • {val}
                                            </Typography>
                                            <Divider sx={{ my: 1 }} />
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
