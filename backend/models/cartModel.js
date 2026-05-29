import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    // 👤 User reference
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // 🛒 Items array
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          default: 1,
        },

        price: {
          type: Number,
          required: true,
        },
      },
    ],

    // 💰 Total cart price
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true } // ✅ correct placement
);

// ✅ Model export
export const Cart = mongoose.model("Cart", cartSchema);