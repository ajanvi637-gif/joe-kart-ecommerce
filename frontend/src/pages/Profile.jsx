import { Button } from "@/components/button"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/tabs"

import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import axios from "axios"
import { setUser } from "@/redux/userSlice"

import userLogo from "../assets/hero.png"
import bgPink from "../assets/pinkv.png"
import { useState } from "react"

/* FLOATING INPUT */
const FloatingInput = ({ label, name, value, onChange, disabled }) => (
  <div className="relative">
    <input
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder=" "
      className="peer w-full px-4 pt-5 pb-2 bg-white/80 border rounded-xl outline-none text-sm disabled:bg-gray-200 disabled:cursor-not-allowed"
    />
    <label className="absolute left-4 top-2 text-gray-500 text-xs transition-all 
      peer-placeholder-shown:top-3.5 
      peer-placeholder-shown:text-sm 
      peer-focus:top-2 
      peer-focus:text-xs">
      {label}
    </label>
  </div>
)

const Profile = () => {
  const { user } = useSelector(store => store.user)
  const { userId } = useParams()
  const dispatch = useDispatch()

  const [file, setFile] = useState(null)

  const [updateUser, setUpdateUser] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNo: user?.phoneNo || "",
    address: user?.address || "",
    city: user?.city || "",
    zipCode: user?.zipCode || "",
    profilePic: user?.profilePic || ""
  })

  const handleChange = (e) => {
    setUpdateUser({ ...updateUser, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const f = e.target.files[0]
    if (f) {
      setFile(f)
      setUpdateUser({
        ...updateUser,
        profilePic: URL.createObjectURL(f)
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem("accessToken")

    try {
      const formData = new FormData()
      Object.keys(updateUser).forEach(key => {
        formData.append(key, updateUser[key])
      })

      if (file) formData.append("file", file)

      const res = await axios.put(
        `http://localhost:8000/api/v1/user/update/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      )

      if (res.data.success) {
        toast.success("Profile Updated")
        dispatch(setUser(res.data.user))
      }

    } catch {
      toast.error("Update failed")
    }
  }

  return (
    <div className="relative min-h-screen pt-20">

      {/* 🌸 BACKGROUND */}
      <div
        className="fixed inset-0 bg-cover bg-center -z-20"
        style={{ backgroundImage: `url(${bgPink})` }}
      />
      <div className="fixed inset-0 bg-white/20" />

      <div className="relative z-10 max-w-5xl mx-auto px-4">

        <Tabs defaultValue="profile">

          {/* 🔹 Tabs */}
          <TabsList className="mb-6 bg-white/60 backdrop-blur-md p-1 rounded-xl">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          {/* ================= PROFILE ================= */}
          <TabsContent value="profile">

            <div className="flex justify-center">

              {/* 🔥 MAIN CARD -======================================== */}
              
              <div className="bg-white/40 backdrop-blur-xlO rounded-3xl shadow-xl w-full max-w-3xl p-8">

                {/* HEADER */}
                <div className="flex flex-col items-center mb-8">
                  <img
                    src={updateUser.profilePic || userLogo}
                    className="w-28 h-28 rounded-full object-cover border-4 border-white shadow"
                  />

                  <h2 className="mt-3 font-semibold text-xl">
                    {updateUser.firstName} {updateUser.lastName}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {updateUser.email}
                  </p>

                  <label className="mt-4 text-sm bg-pink-500 text-white px-4 py-1.5 rounded-full cursor-pointer">
                    Change Photo
                    <input type="file" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <FloatingInput
                    label="First Name"
                    name="firstName"
                    value={updateUser.firstName}
                    onChange={handleChange}
                  />

                  <FloatingInput
                    label="Last Name"
                    name="lastName"
                    value={updateUser.lastName}
                    onChange={handleChange}
                  />

                  <FloatingInput
                    label="Email"
                    name="email"
                    value={updateUser.email}
                    onChange={handleChange}
                    disabled
                  />

                  <FloatingInput
                    label="Phone"
                    name="phoneNo"
                    value={updateUser.phoneNo}
                    onChange={handleChange}
                  />

                  <FloatingInput
                    label="Address"
                    name="address"
                    value={updateUser.address}
                    onChange={handleChange}
                  />

                  <FloatingInput
                    label="City"
                    name="city"
                    value={updateUser.city}
                    onChange={handleChange}
                  />

                  <FloatingInput
                    label="Zip Code"
                    name="zipCode"
                    value={updateUser.zipCode}
                    onChange={handleChange}
                  />

                  {/* BUTTON FULL WIDTH */}
                  <div className="md:col-span-2">
                    <Button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl py-2.5">
                      Save Changes
                    </Button>
                  </div>

                </form>

              </div>
            </div>
          </TabsContent>

          {/* ================= ORDERS ================= */}
          <TabsContent value="orders">
            <div className="bg-white/60 backdrop-blur-lg p-6 rounded-xl text-center">
              <h2 className="text-lg font-semibold mb-2">Orders</h2>
              <p className="text-gray-500 text-sm">
                Your order history will appear here
              </p>
            </div>
          </TabsContent>

        </Tabs>

      </div>
    </div>
  )
}

export default Profile