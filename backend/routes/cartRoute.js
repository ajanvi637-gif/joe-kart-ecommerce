import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateQuantity,
} from "../controllers/cartController.js";

const router = express.Router();

// 🛒 Get cart
router.get("/", isAuthenticated, getCart);

// ➕ Add to cart
router.post("/add", isAuthenticated, addToCart);

// 🔄 Update quantity
router.put("/update", isAuthenticated, updateQuantity);

// 🗑️ Remove item
router.delete("/remove", isAuthenticated, removeFromCart);

export default router;