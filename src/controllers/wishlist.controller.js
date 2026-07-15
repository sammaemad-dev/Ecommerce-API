const User = require("../models/user.model");

const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        if (!user.wishList.includes(productId)) {
            user.wishList.push(productId);
        }

        await user.save();

        res.status(201).json({
            success: true,
            message: "Product added to wishlist successfully",
            data: { wishlist: user.wishList }
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("wishList");
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        res.status(200).json({
            success: true,
            message: "Wishlist retrieved successfully",
            data: { wishlist: user.wishList }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        user.wishList = user.wishList.filter(
            id => id.toString() !== productId
        );

        await user.save();

        res.status(200).json({
            success: true,
            message: "Product removed from wishlist successfully",
            data: { wishlist: user.wishList }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const clearWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        user.wishList = [];
        await user.save();

        res.status(200).json({
            success: true,
            message: "Wishlist cleared successfully",
            data: { wishlist: [] }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = {
    addToWishlist,
    getWishlist,
    removeFromWishlist,
    clearWishlist
};