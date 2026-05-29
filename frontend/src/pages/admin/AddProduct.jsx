import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/input";
import { Label } from "@/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/card";
import ImageUpload from "@/components/ImageUpload";
import { Button } from "@/components/button";
import { Loader2 } from "lucide-react";
import bgPink from "@/assets/pinkv.png";



const AddProduct = () => {
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();
  const { product } = useSelector((state) => state.product);
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState({
    productName: "",
    productPrice: 0,
    productDesc: "",
    productImg: [],
    brand: "",
    category: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("productName", productData.productName);
    formData.append("productPrice", productData.productPrice);
    formData.append("productDesc", productData.productDesc); // ✅ fixed
    formData.append("category", productData.category);
    formData.append("brand", productData.brand);

    if (productData.productImg.length === 0) {
      toast.error("Please select at least one product image.");
      return;
    }

    productData.productImg.forEach((img) => {
      formData.append("files", img);
    });

    try {
      setLoading(true);

      const res = await axios.post(
        `http://localhost:8000/api/v1/product/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        }
      );

      if (res.data.success) {
        // dispatch(setProduct(res.data.product)) // ✅ agar redux use kar rahe ho
        toast.success(res.data.message);
      }

    } catch (error) {
      console.log("ADD PRODUCT ERROR:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" py-4 px-8 ">

      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          backgroundImage: ` url(${bgPink})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />
      {/* ✅ form added */}
      <form onSubmit={submitHandler}>
        <Card className="w-full max-w-3xl mx-auto bg-white/40 backdrop-blur-md rounded-2xl shadow-md border border-pink-100">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Add Product
            </CardTitle>
            <CardDescription>
              Enter product details below
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">

            <div className="grid gap-2">
              <Label className="font-semibold text-gray-700">Product Name</Label>
              <Input
                className="border border-gray-300 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition"
                type="text"
                name="productName"
                placeholder="Ex: iPhone"
                value={productData.productName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label className="font-semibold text-gray-700">Price</Label>
              <Input
                className="border border-gray-300 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition"
                type="number"
                name="productPrice"
                value={productData.productPrice}
                onChange={handleChange}
                placeholder="Enter price"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">

              <div className="grid gap-2">
                <Label className="font-semibold text-gray-700">Brand</Label>
                <Input
                  className="border border-gray-300 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition"
                  type="text"
                  name="brand"
                  placeholder="Ex: Apple"
                  value={productData.brand}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label className="font-semibold text-gray-700">Category</Label>
                <Input
                  className="border border-gray-300 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition"
                  type="text"
                  name="category"
                  placeholder="Ex: Mobile"
                  value={productData.category}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            <div className="grid gap-2">
              <Label className="font-semibold text-gray-700">Description</Label>
              <Textarea
                name="productDesc"
                placeholder="Enter product description..."
                value={productData.productDesc}
                onChange={handleChange}
                className="resize-none border border-gray-300 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition"
              />
            </div>

            {/* Image upload______________________________ */}

            <div className="border-2 border-dashed border-pink-200 rounded-2xl p-5 bg-pink-50/50 hover:border-pink-400 hover:bg-pink-50 transition-all duration-300">

              <p className="text-sm font-semibold text-pink-600 mb-3 flex items-center gap-2">
                📸 Product Images
              </p>
              <div className="bg-white rounded-xl border border-pink-100 p-4 max-h-[300px] overflow-y-auto">
                <ImageUpload
                  productData={productData}
                  setProductData={setProductData}
                />
              </div>

            </div>

          </CardContent>

          <CardFooter className='flex-col gap-2'>
            <Button
              disabled={loading}
              type="submit"
              className="w-full mt-6 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition"
            >
              {
                loading ?
                  <span
                    className="flex-1 gap-1 items-center">
                    <Loader2 className="animate-spin" />
                    Please wait
                  </span> : 'Add Product'
              }

            </Button>
          </CardFooter>

        </Card>
      </form>
    </div>
  );
};

export default AddProduct;