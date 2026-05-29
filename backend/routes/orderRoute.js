import express from "express"
import { createOrder, verifyPayment } from "../controllers/orderController.js"
import { isAuthenticated, isAdmin } from "../middleware/isAuthenticated.js"
const router = express.Router()

// ✅ ROUTES
router.post("/create-order", isAuthenticated, createOrder)
router.post("/verify-payment", isAuthenticated, verifyPayment)

export default router