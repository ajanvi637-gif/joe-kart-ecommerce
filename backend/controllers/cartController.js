import { Cart } from "../models/cartModel.js";
import { Product } from "../models/productModel.js";


// 🛒 Get Cart
export const getCart = async (req, res) => {
    try {
        const userId = req.id;

        const cart = await Cart.findOne({ userId })
            .populate("items.productId");

        if (!cart) {
            return res.status(200).json({ success: true, cart: [] });
        }

        return res.status(200).json({ success: true, cart });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ➕ Add to Cart
export const addToCart = async (req, res) => {
    console.log("API CALL");
    try {
        const userId = req.id;
        const { productId } = req.body;

        // ❗ validation add kiya
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required",
            });
        }

        // 🔍 check product exists
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            // 🆕 create cart
            cart = new Cart({
                userId,
                items: [
                    {
                        productId,
                        quantity: 1,
                        price: product.productPrice,
                    },
                ],
                totalPrice: product.productPrice,
            });
        } else {
            // 🔍 check item exists
            const itemIndex = cart.items.findIndex(
                item => item.productId.toString() === productId
            );

            if (itemIndex > -1) {
                // ➕ increase quantity
                cart.items[itemIndex].quantity += 1;
            } else {
                // ➕ add new item
                cart.items.push({
                    productId,
                    quantity: 1,
                    price: product.productPrice,
                });
            }

            // 🔄 recalculate total
            cart.totalPrice = cart.items.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );
        }

        // 💾 save cart
        await cart.save();

        // 🔁 populate before sending
        const populatedCart = await Cart.findById(cart._id)
            .populate("items.productId");

        return res.status(200).json({
            success: true,
            message: "Product added to cart",
            cart: populatedCart,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const updateQuantity = async (req, res) => {
    try {
        const userId = req.id;
        const { productId, type } = req.body;

        // 🛒 find cart
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        // 🔍 find item in cart
        const item = cart.items.find(
            item => item.productId.toString() === productId
        );

        // ❌ litem → ✔️ item
        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found",
            });
        }

        // ➕ increase
        if (type === "increase") {
            item.quantity += 1;
        }

        // ➖ decrease (min 1)
        if (type === "decrease" && item.quantity > 1) {
            item.quantity -= 1;
        }

        // 💰 recalculate total price
        cart.totalPrice = cart.items.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );

        // 💾 save
        await cart.save();

        // 🔁 populate
        cart = await cart.populate("items.productId");

        // ❌ thue → ✔️ true
        return res.status(200).json({
            success: true,
            cart,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const userId = req.id;
        const { productId } = req.body;

        // 🛒 find cart
        let cart = await Cart.findOne({ userId });

        // ❌ Icart → ✔️ !cart
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        // 🔍 remove item
        cart.items = cart.items.filter(
            item => item.productId.toString() !== productId
        );

        // 💰 recalculate total
        cart.totalPrice = cart.items.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );

        // 💾 save
        await cart.save();

        // 🔁 optional: populate
        cart = await cart.populate("items.productId");

        // ❌ 2ee → ✔️ 200
        return res.status(200).json({
            success: true,
            cart,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

