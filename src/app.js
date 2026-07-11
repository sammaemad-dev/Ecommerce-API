const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const authRoutes = require("./routes/auth.route");
const productRoutes = require("./routes/product.route");
const  wishlistRoutes= require("./routes/wishlist.route");

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use("/api/wishlist", wishlistRoutes);
module.exports = app;
