import { ShoppingBag, ShoppingCart, Trophy } from 'lucide-react'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from "./Button";
import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../redux/userSlice';





const Navbar = () => {

    const { user } = useSelector((state) => state.user)
    const { cart } = useSelector((state) => state.product)
    const accessToken = localStorage.getItem('accessToken')
    const admin = user?.role === "admin" ? true : false
    const dispatch = useDispatch()
    const navigate = useNavigate()


    const logoutHandler = async () => {
        // Implement logout logic here
        try {
            const res = await axios.post(
                "http://localhost:8000/api/v1/user/logout",
                {},
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            )
            if (res.data.success) {
                dispatch(setUser(null))
                localStorage.removeItem("accessToken") // ⭐ ADD THIS
                toast.success(res.data.message)
            }
        } catch (error) {
            // Handle logout error silently
        }
    }

    return (
        <header className='bg-pink-50 fixed w-full z-20 border-b border-pink-200 shadow-sm'>
            <div className='max-w-7xl mx-auto flex items-center justify-between h-13.75 px-20 '>
                {/* logo section */}

                <div className="flex items-center gap-2  cursor-pointer hover:scale-105 transition-transform duration-300">


                    <img src="/logo-removebg-preview.png" alt="logo"
                        className=' w-10 h-10 object-contain ' />
                    <span
                        className="text-xl sm:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500">
                        JoeKART</span>

                </div >
                {/* nav section */}

                <nav className=' flex gap-4 sm:gap-6 items-center '>

                    <ul className=' flex gap-6 items-center text-base sm:text-sm font-semibold'>
                        <Link to={'/'}><li>Home</li> </Link>
                        <Link to={'/products'}><li>Products</li> </Link>

                        {
                            user && <Link to={`/profile/${user._id}`} >

                                <li className='hidden sm:block'>
                                    Hello, {user.firstName}</li> </Link>
                        }
                        {
                            admin && <Link to={`/dashboard/sales`} >
                                <li>Dashboard</li> </Link>
                        }
                    </ul>

                    <Link to={'/cart'} className='relative' >

                        <ShoppingCart className='w-6 h-6' />

                        <span className='bg-pink-600 rounded-full absolute text-white text-xs  -top-2  -right-2  px-1.5 '>{cart?.items?.length || 0}</span>

                    </Link>

                    {
                        user ? <Button onClick={logoutHandler} className='bg-pink-600 text-white text-sm cursor-pointer px-4 py-1.5'> Logout </Button> :
                            < Button onClick={() => navigate('/login')}
                                className='bg-linear-to-tl from-blue-600 to-purple-600 text-white px-4 py-1.5 text-sm cursor-pointer'>Login</Button>
                    }

                </nav>

            </div>
        </header>
    )
}

export default Navbar