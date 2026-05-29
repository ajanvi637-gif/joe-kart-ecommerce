import { Input } from '@/input'
import { Search, Edit, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/select"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"



import { useSelector, useDispatch } from 'react-redux'
import { setProducts } from '@/redux/productSlice'
import { Card } from '@/card'
import { Label } from '@/label'
import { Button } from '@/components/button'
import { Textarea } from "@/components/ui/textarea"
import ImageUpload from "@/components/ImageUpload"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import bgPink from "@/assets/bgpink4.jpg";

const AdminProduct = () => {
  const { products } = useSelector(store => store.product)
  const dispatch = useDispatch()
  // when product is updated, after this close the edit dialog automatically
  const [open, setOpen] = useState(false)
  const [sortOrder, setSortOrder] = useState("")

  // filters
  const [searchTerm, setSearchTerm] = useState("")
  const [editProduct, setEditProduct] = useState(null)
  const accessToken = localStorage.getItem("accessToken")
  let filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (sortOrder === 'lowToHigh') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.productPrice - b.productPrice)
  }
  if (sortOrder === 'highToLow') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.productPrice - a.productPrice)
  }

  // ✅ FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/v1/product/getallproducts')
        if (res.data.success) {
          dispatch(setProducts(res.data.products))
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }
    fetchProducts()
  }, [dispatch])

  // ✅ HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target
    setEditProduct(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // ✅ UPDATE PRODUCT
  const handleSave = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("productName", editProduct.productName)
    formData.append("productDesc", editProduct.productDesc)
    formData.append("productPrice", editProduct.productPrice)
    formData.append("category", editProduct.category)
    formData.append("brand", editProduct.brand)

    const existingImages = editProduct.productImg
      ?.filter(img => !(img instanceof File) && img.public_id)
      .map(img => img.public_id)

    formData.append("existingImages", JSON.stringify(existingImages))

    editProduct.productImg
      ?.filter(img => img instanceof File)
      .forEach(file => formData.append("files", file))

    try {
      const res = await axios.put(
        `http://localhost:8000/api/v1/product/update/${editProduct._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      if (res.data.success) {
        toast.success("Product updated successfully")

        const updatedProducts = products.map(p =>
          p._id === editProduct._id ? res.data.product : p
        )

        dispatch(setProducts(updatedProducts))
        setOpen(false)
      }
    } catch (error) {
      console.log(error)
      toast.error("Update failed")
    }
  }



  // ✅ DELETE PRODUCT
  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/product/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      if (res.data.success) {
        toast.success("Product deleted successfully")
        const updatedProducts = products.filter(p => p._id !== id)
        dispatch(setProducts(updatedProducts))
      }
    } catch (error) {
      console.log(error)
      toast.error("Delete failed")
    }
  }

  return (

    <div className=" ">
      {/* 🌸 BACKGROUND IMAGE */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: `url(${bgPink})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />

      <div className='pt-1  px-8 flex flex-col gap-4'>

        {/* SEARCH + SORT */}
        <div className="bg-transparent p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between gap-4">

            {/* 🔍 Search Bar */}
            <div className="relative w-full max-w-md">
              <Input
                type="text"
                values={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Product..."
                className="w-full pl-4 pr-10 py-2 rounded-xl border border-pink-200 bg-white focus:border-pink-500 outline-none"
              />
              <Search
                className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-400 w-4 h-4"
              />
            </div>
            {/* 💰 Sort Button */}
            <Select onValueChange={(value) => setSortOrder(value)}>
              <SelectTrigger className="w-44 bg-white border border-gray-300 rounded-xl px-4 py-2 text-sm shadow-sm hover:border-pink-400 focus:ring-2 focus:ring-pink-300 transition">
                <SelectValue placeholder="Sort by Price" />
              </SelectTrigger>

              <SelectContent className="bg-white rounded-xl shadow-lg border border-gray-200 p-1">

                <SelectItem
                  value="lowToHigh"
                  className="px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-pink-50 focus:bg-pink-100 transition"
                >
                  Low to High
                </SelectItem>

                <SelectItem
                  value="highToLow"
                  className="px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-pink-50 focus:bg-pink-100 transition"
                >
                  High to Low
                </SelectItem>

              </SelectContent>
            </Select>

          </div>

        </div>

        {/* PRODUCTS SECTION */}
        <div className='flex flex-col gap-3'>

          {
            products && products.length > 0 ? (
              filteredProducts.map((product, index) => {
                return (
                  <Card key={index} className="bg-white/90 backdrop-blur-md rounded-2xl border border-pink-100 shadow-sm hover:shadow-md transition-all duration-300 ">
                    {/* py-2 for box heigh */}
                    <div className='flex items-center justify-between p-3 gap-3'>

                      {/* LEFT - PRODUCT INFO */}
                      <div className='flex gap-4 items-center flex-1 min-w-0'>
                        <div className='relative group flex-shrink-0'>
                          {product.productImg && product.productImg[0] ? (
                            <img
                              src={product.productImg[0].url}
                              alt="product"
                              // img styling
                              className="w-23 h-23 object-cover rounded-b-sm border border-gray-200 shadow-sm group-hover:scale-105 transition" />
                          ) : (
                            <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300  flex items-center justify-center shadow-md">
                              <span className="text-gray-500 text-xs">No Image</span>
                            </div>
                          )}
                        </div>

                        <div className='flex-1 min-w-0'>
                          <h3 className='font-semibold text-base text-gray-800 mb-1 line-clamp-1'>{product.productName}</h3>
                          <p className='text-xl font-semibold text-gray-600 mb-1'>₹{product.productPrice.toLocaleString()}</p>
                          <div className='flex gap-3 text-sm text-gray-600'>
                            <span>Stock: <span className='font-semibold text-gray-700'>{product.stock || 0}</span></span>
                            {product.category && (
                              <span className="px-2 py-0.5 text-xs bg-pink-50 text-pink-600 rounded-full">
                                {product.category}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className='flex gap-3 flex-shrink-0'>

                        {/* EDIT */}
                        <Dialog open={open} onOpenChange={setOpen} >
                          <DialogTrigger asChild>
                            <button
                              className="p-2 rounded-lg bg-pink-50 hover:bg-pink-100 transition"
                              onClick={() => { setOpen(true); setEditProduct(product) }}
                            >
                              <Edit className="text-pink-600 w-5 h-5" />
                            </button>
                          </DialogTrigger>

                          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl">
                            <DialogHeader className="border-b pb-4">
                              <DialogTitle className="text-2xl"> Edit Product</DialogTitle>
                              <DialogDescription>
                                Update product details and images
                              </DialogDescription>
                            </DialogHeader>

                            {editProduct && (
                              <form onSubmit={handleSave} className="space-y-5 py-4">

                                <div className='grid grid-cols-2 gap-4'>
                                  <div>
                                    <Label className="text-gray-700 font-semibold mb-2 block">Product Name</Label>
                                    <Input
                                      name="productName"
                                      value={editProduct.productName}
                                      onChange={handleChange}
                                      className="border-2 border-gray-200 rounded-lg focus:border-pink-500"
                                    />
                                  </div>

                                  <div>
                                    <Label className="text-gray-700 font-semibold mb-2 block">Price</Label>
                                    <Input
                                      type="number"
                                      name="productPrice"
                                      value={editProduct.productPrice}
                                      onChange={handleChange}
                                      className="border-2 border-gray-200 rounded-lg focus:border-pink-500"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <Label className="text-gray-700 font-semibold mb-2 block">Description</Label>
                                  <Textarea
                                    name="productDesc"
                                    value={editProduct.productDesc}
                                    onChange={handleChange}
                                    className="border-2 border-gray-200 rounded-lg focus:border-pink-500 min-h-32"
                                  />
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                  <ImageUpload
                                    productData={editProduct}
                                    setProductData={setEditProduct}
                                  />
                                </div>

                                <DialogFooter className="border-t pt-4 gap-3">
                                  <DialogClose asChild>
                                    <Button variant="outline" className="border-2 hover:bg-gray-100">Cancel</Button>
                                  </DialogClose>

                                  <Button type="submit" className="bg-pink-600 hover:bg-pink-700 text-white px-6">Save Changes</Button>
                                </DialogFooter>

                              </form>
                            )}
                          </DialogContent>
                        </Dialog>

                        {/* DELETE */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              className="p-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-300"
                              title="Delete Product"
                            >
                              <Trash2 className="text-red-600 w-5 h-5" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-xl">🗑️ Delete Product?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This product will be permanently deleted from the system.
                                <br /><strong>This action cannot be undone.</strong>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-2 hover:bg-gray-100">Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(product._id)} className="bg-red-600 hover:bg-red-700 text-white">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                      </div>

                    </div>
                  </Card>

                )
              })
            ) : (
              <div className='flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-md border-2 border-dashed border-gray-300'>
                <p className='text-6xl mb-4'>📦</p>
                <p className='text-gray-700 text-2xl font-bold'>No products available</p>
                <p className='text-gray-500 text-base mt-2'>Add your first product to get started</p>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default AdminProduct      