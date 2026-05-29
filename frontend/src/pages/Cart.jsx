import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Card, CardHeader, CardTitle, CardContent } from "../card";

import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import userLogo from "../assets/joeuserLogo.png";
import empty2 from "../assets/empty2.png";
import bgPink from "../assets/bgpink4.jpg";

import { toast } from "sonner";

import { Separator } from "../separator";
import { Input } from "../input";

import { setCart } from "../redux/productSlice";
import { Button } from "@/components/button";


const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cart } = useSelector((store) => store.product);

  const API = "http://localhost:8000/api/v1/cart";
  const accessToken = localStorage.getItem("accessToken");


  // 📦 LOAD CART fuction ---- to same product add in card successfully then cart me update ho jayega without refresh page

  const loadCart = async () => {
    try {
      const res = await axios.get(API, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // ✅ SUCCESS → Redux me cart set
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
      }

    } catch (error) {
      console.log("Load cart error:", error);
    }
  };

  //  QUANTITY UPDATE
  const handleUpdateQuantity = async (productId, type) => {
    try {
      const res = await axios.put(
        `${API}/update`,
        { productId, type },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },

        }
      );

      if (res.data.success) {
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      console.log(error);
    }
  };

  //  REMOVE ITEM (HANDLER USE KIYA)
  const handleRemove = async (productId) => {
    try {
      const res = await axios.delete(`${API}/remove`, {
        data: { productId },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },

      });

      if (res.data.success) {
        dispatch(setCart(res.data.cart));
        toast.success("Item removed from cart");
      }
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    loadCart();
  }, [dispatch]);


  //  CALCULATIONS
  const subtotal = cart?.totalPrice || 0;
  const shipping = subtotal > 299 ? 0 : 10;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  return (
    <div className="relative min-h-screen pt-24 px-4 pb-10 mr-20">

      {/* BG */}
      <div
        className="fixed inset-0 bg-cover bg-center -z-20"
        style={{ backgroundImage: `url(${bgPink})` }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">

        {cart?.items?.length > 0 ? (

          <div className="flex gap-8 flex-col lg:flex-row">

            {/* LEFT */}
            <div className="flex-1 flex flex-col gap-5">

              {cart.items
                .filter(item => item?.productId) // 🚀 remove null products
                .map((product) => (
                  <Card key={product?._id} className="p-5 rounded-2xl bg-white/90 backdrop-blur-md shadow-sm">

                    <div className="flex justify-between items-center gap-6">

                      {/* LEFT */}
                      <div className="flex items-center gap-5 w-[65%]">

                        <div className="flex items-center justify-center 
                        bg-white border border-gray-200 shadow-sm w-90 h-25
                        hover:shadow-md transition">

                          <img
                            src={product?.productId?.productImg?.[0]?.url || userLogo}
                            className="h-50 w-80 object-contain hover:scale-105 transition"
                          />
                        </div>

                        <div>
                          <h2 className="text-sm font-semibold text-gray-800 line-clamp-2">
                            {product?.productId?.productName}
                          </h2>

                          <p className="text-xs text-gray-400 mt-1">Price</p>

                          <p className="text-base font-semibold">
                            ₹{product?.productId?.productPrice}
                          </p>
                        </div>
                      </div>

                      {/* RIGHT */}
                      <div className="flex items-center gap-6">

                        {/* QUANTITY */}
                        <div className="flex gap-3 items-center">

                          <Button
                            variant="outline"
                            onClick={() =>
                              product?.productId?._id &&
                              handleUpdateQuantity(product.productId._id, "decrease")
                            }
                          >
                            -
                          </Button>

                          <span>{product.quantity}</span>

                          <Button
                            variant="outline"
                            onClick={() =>
                              product?.productId?._id &&
                              handleUpdateQuantity(product.productId._id, "increase")
                            }
                          >
                            +
                          </Button>

                        </div>

                        {/* TOTAL */}
                        <p>
                          ₹
                          {(product?.productId?.productPrice || 0) *
                            (product?.quantity || 0)}
                        </p>

                        {/* ✅ REMOVE (HANDLER USE KIYA) */}
                        <p
                          onClick={() =>
                            product?.productId?._id &&
                            handleRemove(product.productId._id)
                          }
                          className="flex text-red-500 items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </p>

                      </div>
                    </div>
                  </Card>
                ))}
            </div>

            {/* RIGHT (SUMMARY) */}
            <div>
              <Card className="w-100 bg-white/70 ">

                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">

                  <div className="flex justify-between">
                    <span>Subtotal ({cart?.items?.length || 0} items)</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₹{shipping}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Tax (5%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Input placeholder="Promo Code" />
                    <Button variant="outline">Apply</Button>
                  </div>

                  <Button
                    onClick={() => navigate(`/address`)}
                    className="w-full bg-pink-600 text-white">
                    PLACE ORDER
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => navigate("/products")}
                  >
                    Continue Shopping
                  </Button>

                </CardContent>
              </Card>
            </div>

          </div>

        ) : (

          <div className="flex flex-col items-center justify-center h-[80vh] text-center">

            <img src={empty2} className="w-64 mb-6" />

            <h1 className="text-2xl font-semibold">
              Your shopping bag is empty!
            </h1>

            <Button onClick={() => navigate("/products")}>
              Start Shopping
            </Button>

          </div>
        )}

      </div>
    </div>
  );
};

export default Cart;