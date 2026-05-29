import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true // ❌ Reqired → required fix
            }
        }
    ],

    amount: { type: Number, required: true },
    tax: { type: Number, required: true },        // ❌ require → required
    shipping: { type: Number, required: true },   // ❌ require → required

    currency: { type: String, default: "INR" },

    status: {
        type: String,
        enum: ["Pending", "Paid", "Failed"], // keep consistent case
        default: "Pending"
    },

    // Razorpay Fields
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String

}, { timestamps: true })


const Order = mongoose.model("Order", orderSchema)
export default Order