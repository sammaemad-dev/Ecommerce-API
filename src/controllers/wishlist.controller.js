const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        const user = await User.findById(req.user.id);

        if (!user.wishlist.includes(productId)) {
            user.wishlist.push(productId);
        }

        await user.save();

        res.status(200).json({
            message: "Product added successfully",
            wishlist: user.wishlist
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getWishlist = async (req, res) => {

    const user = await User.findById(req.user.id)
        .populate("wishlist");

    res.json(user.wishlist);

};

const removeFromWishlist = async (req, res) => {

    const { productId } = req.params;

    const user = await User.findById(req.user.id);

    user.wishlist = user.wishlist.filter(
        id => id.toString() !== productId
    );

    await user.save();

    res.json({
        message: "Product removed"
    });

};

const clearWishlist = async (req, res) => {

    const user = await User.findById(req.user.id);

    user.wishlist = [];

    await user.save();

    res.json({
        message: "Wishlist cleared"
    });

};

module.exports = {
    addToWishlist,
    getWishlist,
    removeFromWishlist,
    clearWishlist
};