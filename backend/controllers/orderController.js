import razorpayInstance from "../config/razorpay.js"
import { Cart } from "../models/cartModel.js"
import crypto from "crypto"
import Order from "../models/orderModel.js"

// ================= CREATE ORDER ===============

export const createOrder = async (req, res) => {

  console.log("BODY 👉", req.body)
  console.log("USER 👉", req.id)
  try {
    const { products, amount, tax = 0, shipping = 0, currency = "INR" } = req.body

    // 🔥 VALIDATION (VERY IMPORTANT)
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Products required"
      })
    }

    if (!amount || isNaN(amount)) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount"
      })
    }

    // 🔥 FILTER INVALID PRODUCTS (CRASH FIX)
    const validProducts = products.filter(p => p?.productId && p?.quantity)

    if (!validProducts.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid product data"
      })
    }

    // 🔥 RAZORPAY ORDER
    const finalAmount = Math.round(Number(amount))

    const options = {
      amount: finalAmount * 100,
      currency,
      receipt: `receipt_${Date.now()}`
    }

    const razorpayOrder = await razorpayInstance.orders.create(options)

    // 🔥 SAVE DB ORDER
    const newOrder = await Order.create({
      user: req.id,
      products: validProducts,
      amount,
      tax,
      shipping,
      currency,
      status: "Pending",
      razorpayOrderId: razorpayOrder.id
    })

    return res.status(200).json({
      success: true,
      order: razorpayOrder,
      dbOrder: newOrder
    })

  } catch (error) {
    console.error("❌ Error in createOrder:", error)

    return res.status(500).json({
      success: false,
      message: error.message || "Server error"
    })
  }
}


// ================= VERIFY PAYMENT =================
export const verifyPayment = async (req, res) => {
  console.log("🔥 VERIFY PAYMENT HIT");
  console.log("BODY 👉", req.body)
  console.log("USER ID 👉", req.id)
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentFailed
    } = req.body

    const userId = req.id

    if (!userId) {
      console.log("❌ USER ID MISSING")
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      })
    }
    // ❌ PAYMENT FAILED
    if (paymentFailed) {
      const order = await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: "Failed" },
        { new: true }
      )

      return res.status(200).json({
        success: false,
        message: "Payment failed",
        order
      })
    }

    // 🔥 VALIDATION
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment details"
      })
    }

    // 🔥 SIGNATURE VERIFY
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`

    console.log("SECRET 👉", process.env.RAZORPAY_SECRET)
    console.log("SIGN 👉", sign)

    if (!process.env.RAZORPAY_SECRET) {
      throw new Error("RAZORPAY_SECRET is missing");
    }

    const expectedSignature = crypto

      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign)
      .digest("hex")

    console.log("EXPECTED SIGNATURE 👉", expectedSignature)
    console.log("RECEIVED SIGNATURE 👉", razorpay_signature)



    // ✅ SUCCESS
    if (expectedSignature === razorpay_signature) {

      const order = await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          status: "Paid",
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature
        },
        { new: true }
      )

      // 🛒 CLEAR CART
      await Cart.findOneAndUpdate(
        { user: userId },
        { $set: { items: [], totalPrice: 0 } },
        { upsert: true }
      )

      return res.status(200).json({
        success: true,
        message: "Payment Successful",
        order
      })
    }

    // ❌ SIGNATURE FAIL
    else {
      const order = await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: "Failed" },
        { new: true }
      )

      return res.status(400).json({
        success: false,
        message: "Invalid signature",
        order
      })
    }
  } catch (error) {
    console.log("❌ VERIFY ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};