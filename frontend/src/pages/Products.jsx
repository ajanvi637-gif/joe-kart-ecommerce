import React, { useState, useEffect } from "react";

import FilterSidebar from "../components/FilterSidebar";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../select";

import ProductCard from "../components/ProductCard";
import { setProducts } from "../redux/productSlice";

import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";

import bgPink from "../assets/bgpink4.jpg";

const Products = () => {

    const { products } = useSelector((state) => state.product)
    const [allProducts, setAllProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("")
    const [category, setCategory] = useState("All")
    const [brand, setBrand] = useState("All")
    const [priceRange, setPriceRange] = useState([0, 999999])
    const [sortOrder, setsortOrder] = useState("")

    const dispatch = useDispatch()

    const getAllProducts = async () => {
        try {
            setLoading(true)
            const res = await axios.get(
                "http://localhost:8000/api/v1/products/getallproducts"
            )
            if (res.data.success) {
                setAllProducts(res.data.products)
                dispatch(setProducts(res.data.products))
            }
        } catch (error) {
            console.log("FULL ERROR 👉", error)
            toast.error(error.response?.data?.message || error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllProducts()
    }, [])

    useEffect(() => {
        if (allProducts.length === 0) return;

        let filtered = [...allProducts];

        if (search.trim() !== "") {
            filtered = filtered.filter(p =>
                p.productName?.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (category !== "All") {
            filtered = filtered.filter(p => p.category === category);
        }

        if (brand !== "All") {
            filtered = filtered.filter(p => p.brand === brand);
        }

        filtered = filtered.filter(
            p =>
                p.productPrice >= priceRange[0] &&
                p.productPrice <= priceRange[1]
        );

        if (sortOrder === "lowToHigh") {
            filtered.sort((a, b) => a.productPrice - b.productPrice);
        } else if (sortOrder === "highToLow") {
            filtered.sort((a, b) => b.productPrice - a.productPrice);
        }

        dispatch(setProducts(filtered));

    }, [search, category, brand, sortOrder, priceRange, allProducts, dispatch])


    return (
        <div
            className="relative pt-20 pb-10 min-h-screen w-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${bgPink})` }}
        >

            {/* 🌸 LIGHT overlay (fix) */}
            <div className="absolute inset-0 bg-white/30"></div>

            <div className="relative z-10">

                <div className='max-w-7xl mx-auto flex gap-7 items-start'>

                    {/* sidebar */}
                    <FilterSidebar
                        search={search}
                        setSearch={setSearch}
                        brand={brand}
                        setBrand={setBrand}
                        category={category}
                        setCategory={setCategory}
                        allProducts={allProducts}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                    />

                    {/* Main product section */}
                    <div className='flex flex-col flex-1'>

                        <div className='flex justify-end mb-4'>
                            <Select onValueChange={(value) => setsortOrder(value)} >
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Sort by Price" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="lowToHigh">Price : Low to High</SelectItem>
                                        <SelectItem value="highToLow">Price : High to Low</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-7'>
                            {
                                products.map((product) => (
                                    <ProductCard key={product._id} product={product} loading={loading} />
                                ))
                            }
                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}

export default Products