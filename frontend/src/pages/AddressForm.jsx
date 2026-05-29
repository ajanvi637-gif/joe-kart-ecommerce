import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addAddress, deleteAddress, setCart } from "@/redux/productSlice"
import { Input } from "@/input"
import { Label } from "@/label"
import { Button } from "@/components/button"
import { Trash2 } from "lucide-react"
import bgPink from "@/assets/bgpink4.jpg"
import axios from "axios"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

const AddressForm = () => {

    // ================= STATE =================
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        country: ""
    })

    const { cart = { items: [], totalPrice: 0 }, addresses = [] } =
        useSelector((store) => store.product || {})

    const [showForm, setShowForm] = useState(addresses.length === 0)
    const [selectedAddress, setSelectedAddress] = useState(null)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    // ================= INPUT =================
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    // ================= VALIDATION =================
    const validateForm = () => {
        const { fullName, phone, email, address, city, state, zip, country } = formData

        if (!fullName || !phone || !email || !address || !city || !state || !zip || !country) {
            toast.error("All fields are required ❗")
            return false
        }

        if (phone.length < 10) {
            toast.error("Invalid phone number ❗")
            return false
        }

        return true
    }

    // ================= SAVE =================
    const handleSave = () => {
        if (!validateForm()) return

        dispatch(addAddress(formData))
        setShowForm(false)

        toast.success("Address saved ✅")
    }

    // ================= DELETE =================
    const handleDelete = (index) => {
        dispatch(deleteAddress(index))
        toast.success("Address deleted 🗑️")
    }

    // ================= PRICE =================
    const subtotal = cart.totalPrice || 0
    const shipping = subtotal > 499 ? 0 : 50
    const tax = +(subtotal * 0.05).toFixed(2)
    const total = subtotal + shipping + tax

    // ================= PAYMENT =================
    const handlePayment = async () => {

        if (!cart.items.length) {
            return toast.error("Cart is empty ❌")
        }

        if (selectedAddress === null) {
            return toast.error("Select address first ❗")
        }

        const accessToken = localStorage.getItem("accessToken")

        if (!accessToken) {
            return toast.error("Login required ❌")
        }

        try {
            // CREATE ORDER
            const { data } = await axios.post(

                `${import.meta.env.VITE_URL}/api/v1/orders/create-order`,

                {
                    products: cart.items
                        .map(item => ({
                            productId: item.productId?._id || item.productId,
                            quantity: item.quantity
                        }))
                        .filter(p => p.productId),
                    amount: total,
                    tax,
                    shipping,
                    currency: "INR"
                },
                {
                    headers: { Authorization: `Bearer ${accessToken}` }
                }
            )

            console.log("ORDER DATA 👉", data)
            console.log("RAZORPAY ORDER 👉", data.order)
            if (!data?.success) {
                return toast.error("Order creation failed ❌")
            }

            // RAZORPAY OPTIONS
            const options = {

                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data.order.amount,
                currency: "INR",
                order_id: data.order.id,
                name: "JoeKart",
                description: "Order Payment",




                handler: async function (response) {
                    try {
                        const verify = await axios.post(
                            `${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`,



                            {
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature
                            },

                            {

                                headers: {
                                    Authorization: `Bearer ${accessToken}`
                                }
                            }
                        )

                        if (verify.data.success) {
                            toast.success("Payment Successful ✅")

                            dispatch(setCart({ items: [], totalPrice: 0 }))

                            navigate("/order-success")
                        } else {
                            toast.error("Verification failed ❌")
                        }
                    } catch (err) {
                        console.log(err)
                        toast.error("Verification error ❌")
                    }
                },

                modal: {
                    ondismiss: async () => {
                        await axios.post(
                            `${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`,
                            {
                                razorpay_order_id: data.order.id,
                                paymentFailed: true
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${accessToken}`
                                }
                            }
                        )
                        toast.error("Payment cancelled ❌")
                    }
                },

                prefill: {
                    name: formData.fullName,
                    email: formData.email,
                    contact: formData.phone
                },

                theme: { color: "#ec4899" }
            }

            const rzp = new window.Razorpay(options)

            rzp.on("payment.failed", async () => {
                await axios.post(
                    `${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`,
                    {
                        razorpay_order_id: data.order.id,
                        paymentFailed: true
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    }
                )

                toast.error("Payment failed ❌")
            })

            rzp.open()

        } catch (error) {
            console.log("FULL ERROR 👉", error)
            toast.error(error.response?.data?.message || "Server error ❌")
        }
    }


    return (
        <div className="relative min-h-screen px-4 py-10">

            {/* 🌸 BACKGROUND */}
            <div
                className="fixed inset-0 -z-10"
                style={{
                    backgroundImage: `url(${bgPink})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}
            />

            {/* MAIN GRID */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* ================= LEFT (ADDRESS) ================= */}
                <div className="lg:col-span-2">
                    <div className="bg-white/60 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 sm:p-10 border border-white/40">

                        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-transparent">
                            Address Section
                        </h1>

                        {showForm ? (
                            <form className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                                {[
                                    { label: "Full Name", name: "fullName", placeholder: "John Doe" },
                                    { label: "Phone", name: "phone", placeholder: "+91 9876543210" },
                                    { label: "Email", name: "email", placeholder: "john@example.com" },
                                    { label: "Address", name: "address", placeholder: "23 Street" },
                                    { label: "City", name: "city", placeholder: "Kolkata" },
                                    { label: "State", name: "state", placeholder: "West Bengal" },
                                    { label: "Zip Code", name: "zip", placeholder: "700001" },
                                    { label: "Country", name: "country", placeholder: "India" }
                                ].map((field) => (
                                    <div key={field.name}>
                                        <Label>{field.label}</Label>
                                        <Input
                                            name={field.name}
                                            value={formData[field.name]}
                                            onChange={handleChange}
                                            placeholder={field.placeholder}
                                            className="bg-white/90 border border-rose-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-pink-400"
                                        />
                                    </div>
                                ))}

                                <div className="sm:col-span-2 mt-4">
                                    <Button
                                        type="button"
                                        onClick={handleSave}
                                        className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 rounded-xl"
                                    >
                                        Save Address
                                    </Button>
                                </div>

                            </form>

                        ) : (

                            <div className="space-y-6">

                                <h2 className="text-xl font-bold text-gray-800">
                                    Saved Addresses
                                </h2>

                                <div className="grid gap-4">

                                    {addresses.map((addr, index) => (
                                        <div
                                            key={index}
                                            onClick={() => setSelectedAddress(index)}
                                            className={`relative p-5 rounded-2xl cursor-pointer border transition-all

                                                          ${selectedAddress === index
                                                    ? "border-pink-500 bg-pink-50"
                                                    : "border-gray-200 bg-white hover:border-pink-300"
                                                }`}
                                        >

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleDelete(index)
                                                }}
                                                className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 size={16} />
                                            </button>

                                            <p className="font-semibold">{addr.fullName}</p>
                                            <p>{addr.phone}</p>
                                            <p>{addr.email}</p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {addr.address}, {addr.city}, {addr.state}, {addr.zip}, {addr.country}
                                            </p>

                                        </div>
                                    ))}

                                </div>

                                <Button
                                    onClick={() => setShowForm(true)}
                                    className="w-full  text-white rounded-xl py-2 bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500"
                                >
                                    + Add New Address
                                </Button>

                                {/* ✅ PAYMENT BUTTON */}

                                <Button
                                    disabled={selectedAddress === null}
                                    onClick={handlePayment}
                                    className="w-full bg-pink-600 text-white py-3 rounded-xl disabled:opacity-50"
                                >
                                    Proceed To Payment
                                </Button>

                            </div>
                        )}
                    </div>
                </div>

                {/* ================= RIGHT (ORDER SUMMARY) ================= */}
                <div className="lg:col-span-1">

                    <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/40 sticky top-10">

                        <h2 className="text-lg font-semibold mb-4 text-gray-800">
                            Order Summary
                        </h2>

                        <div className="space-y-3 text-sm">

                            <div className="flex justify-between">
                                <span>Subtotal ({cart?.items?.length || 0} items)</span>
                                <span>₹{subtotal.toLocaleString("en-IN")}</span>
                            </div>

                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>₹{shipping}</span>
                            </div>

                            <div className="flex justify-between">
                                <span>Tax</span>
                                <span>₹{tax}</span>
                            </div>

                            <hr />

                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>₹{total}</span>
                            </div>

                            <div className="text-xs text-gray-500 pt-3 space-y-1">
                                <p>• Free shipping over ₹499</p>
                                <p>• 30-day return policy</p>
                                <p>• Secure checkout (SSL)</p>
                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </div>
    )
}

export default AddressForm