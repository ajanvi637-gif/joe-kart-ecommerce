import { Button } from '@/components/button'
import { ArrowLeft } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import userLogo from "@/assets/hero.png"
import { useSelector } from 'react-redux'
import axios from 'axios'
import { Label } from '@/label'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from 'sonner'
import { useDispatch } from "react-redux"
import { setUser } from "@/redux/userSlice"
import bgPink from "@/assets/bgpink4.jpg"



const UserInfo = () => {
  const navigate = useNavigate()
  const [updateUser, setUpdateUser] = useState({})
  const [file, setFile] = useState(null)
  const { user } = useSelector(store => store.user)
  const params = useParams()
  const userId = params.id
  const dispatch = useDispatch()

  useEffect(() => {
    getUserDetails()
  }, [])

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

  const getUserDetails = async () => {
    try {

      const res = await axios.get(`http://localhost:8000/api/v1/user/get-user/${userId}`)
      if (res.data.success) {
        setUpdateUser(res.data.user)
      }
    } catch (error) {
      console.log(error);

    }
  }

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

  return (
    <div className="relative min-h-screen flex items-center justify-center">

      {/* 🌸 BACKGROUND IMAge */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: `url(${bgPink})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />

      <div className="w-full max-w-6xl px-4">
        <div className='max-w-7xl mx-auto'>
               
                {/* Header___ */}
          <div className='flex flex-col justify-center items-center min-h-screen '>

                  {/* Header___2nd */}
            <div className="flex items-center gap-4 mb-6 ">
              <Button onClick={() => navigate(-1)} className="rounded-full ">
                <ArrowLeft />
              </Button>

              <h1 className="text-2xl font-bold text-gray-800">
                Update Profile
              </h1>
              <div className="bg-white/70   shadow-2xl w-full max-w-4xl p-8 border border-white/40">


                {/* header Profile image section */}
                <div className="flex flex-col items-center mb-8 border-rose-300 border-2 rounded-4xl  ">
                  <img
                    src={updateUser?.profilePic || userLogo}
                    className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
                  />

                  <h2 className="mt-3 font-semibold text-xl text-gray-800">
                    {updateUser.firstName} {updateUser.lastName}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {updateUser.email}
                  </p>

                  <label className="mt-4 text-sm bg-gradient-to-r from-pink-500 to-pink-600 text-white px-5 py-2 rounded-full cursor-pointer shadow hover:scale-105 transition mb-2">
                    Change Photo
                    <input type="file" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <FloatingInput
                    className="peer w-full px-4 pt-5 pb-2 bg-white/90 border border-gray-200 rounded-xl outline-none text-sm shadow-sm focus:ring-2 focus:ring-pink-400 transition"
                    label="First Name"
                    name="firstName"
                    value={updateUser.firstName || ""}
                    onChange={handleChange}
                  />

                  <FloatingInput
                    className="peer w-full px-4 pt-5 pb-2 bg-white/90 border border-gray-200 rounded-xl outline-none text-sm shadow-sm focus:ring-2 focus:ring-pink-400 transition"
                    label="Last Name"
                    name="lastName"
                    value={updateUser.lastName || ""}
                    onChange={handleChange}
                  />

                  <FloatingInput
                    className="peer w-full px-4 pt-5 pb-2 bg-white/90 border border-gray-200 rounded-xl outline-none text-sm shadow-sm focus:ring-2 focus:ring-pink-400 transition"
                    label="Email"
                    name="email"
                    value={updateUser.email || ""}
                    onChange={handleChange}
                    disabled
                  />

                  <FloatingInput

                    className="peer w-full px-4 pt-5 pb-2 bg-white/90 border border-gray-200 rounded-xl outline-none text-sm shadow-sm focus:ring-2 focus:ring-pink-400 transition"
                    label="Phone"
                    name="phoneNo"
                    value={updateUser.phoneNo || ""}
                    onChange={handleChange}
                  />

                  <FloatingInput
                    className="peer w-full px-4 pt-5 pb-2 bg-white/90 border border-gray-200 rounded-xl outline-none text-sm shadow-sm focus:ring-2 focus:ring-pink-400 transition"
                    label="Address"
                    name="address"
                    value={updateUser.address || ""}
                    onChange={handleChange}
                  />

                  <FloatingInput
                    className="peer w-full px-4 pt-5 pb-2 bg-white/90 border border-gray-200 rounded-xl outline-none text-sm shadow-sm focus:ring-2 focus:ring-pink-400 transition"
                    label="City"
                    name="city"
                    value={updateUser.city || ""}
                    onChange={handleChange}
                  />

                  <FloatingInput
                    className="peer w-full px-4 pt-5 pb-2 bg-white/90 border border-gray-200 rounded-xl outline-none text-sm shadow-sm focus:ring-2 focus:ring-pink-400 transition"
                    label="Zip Code"
                    name="zipCode"
                    value={updateUser.zipCode || ""}
                    onChange={handleChange}
                  />

                  <div className='flex gap-3 items-center'>
                    <Label className="block text-sm font-medium" >Role :</Label>
                    <RadioGroup
                      className="flex items-center"
                      value={updateUser?.role}
                      onValueChange={(value) => setUpdateUser({ ...updateUser, role: value })}
                    >
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value="user" id="user" />
                        <Label htmlFor="user" >User</Label>
                      </div>


                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value="admin" id="admin" />
                        <Label htmlFor="admin" >Admin</Label>
                      </div>
                    </RadioGroup>
                  </div>


                  {/* BUTTON FULL WIDTH */}
                  <div className="md:col-span-2">
                    <Button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl py-3 text-base font-semibold shadow-md hover:scale-[1.02] transition">
                      Update Profile
                    </Button>
                  </div>

                </form>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default UserInfo