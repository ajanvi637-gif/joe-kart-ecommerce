import React from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Verify from './pages/Verify'
import VerifyEmail from './pages/VerifyEmail'
import Profile from './pages/profile'
import Products from './pages/products'
import Cart from './pages/Cart'
import Dashboard from './pages/Dashboard'
import AdminSales from './pages/admin/AdminSales'
import AdminOrders from './pages/admin/AdminOrders'
import AdminUsers from './pages/admin/AdminUsers'
import AddProduct from './pages/admin/AddProduct'
import AdminProduct from './pages/admin/AdminProduct'
import UserInfo from './pages/admin/UserInfo'
import ShowUserOrders from './pages/admin/ShowUserOrders'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SingleProduct from './pages/SingleProduct'
import AddressForm from './pages/AddressForm'


const router = createBrowserRouter([
  {
    path: '/home',
    element: (
      <>
        <Navbar />
        <Home />
        <Footer />
      </>
    )
  },

  {
    path: '/signup',
    element: (
      <>
        <Signup />
      </>
    )
  },

  {
    path: '/login',
    element: (
      <>
        <Login />
      </>
    )
  },

  {
    path: '/verify',
    element: (
      <>
        <Verify />
      </>
    )
  },

  {
    path: '/verify/:token',
    element: (
      <>
        <VerifyEmail />
      </>
    )
  },

  {
    path: '/',
    element: <Navigate to="/home" />
  },

  {
    path: '/profile/:userId',
    element: (
      <ProtectedRoute>
        <>
          <Navbar />
          <Profile />
        </>
      </ProtectedRoute>
    )
  },

  {
    path: '/products',
    element: (
      <>
        <Navbar />
        <Products />
        <Footer />
      </>
    )
  },

  {
    path: '/products/:id',
    element: (
      <>
        <Navbar />
        <SingleProduct />
        <Footer />
      </>
    )
  },

  {
    path: '/cart',
    element: (
      <ProtectedRoute>
        <Navbar />
        <Cart />
      </ProtectedRoute>
    )
  },
  {
    path: '/address',
    element: (
      <ProtectedRoute>
      <AddressForm/>
      </ProtectedRoute>
    )
  },

  {
    path: '/dashboard',
    element: (
      <ProtectedRoute adminOnly={true}>
        <Navbar/>
        <Dashboard />
      </ProtectedRoute>
    ),

    children: [
      {
        path: 'sales',
        element: <AdminSales />
      },
      {
        path: 'add-product',
        element: <AddProduct />
      },
      {
        path: 'products',
        element: <AdminProduct />
      },
      {
        path: 'orders',
        element: <AdminOrders />
      },
      {
        path: 'user/orders/:userId',
        element: <ShowUserOrders />
      },
      {
        path: 'users',
        element: <AdminUsers />
      },
      {
        path: 'users/:id',
        element: <UserInfo />
      }
    ]
  }
])


const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App