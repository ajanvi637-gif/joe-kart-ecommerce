import Sidebar from '@/components/Sidebar'
import React from 'react'
import { Outlet } from 'react-router-dom'

export const Dashboard = () => {
  return (
    <div className="flex">

      <Sidebar />

      <div className="ml-[280px] mt-[64px] w-full ">
        <Outlet />
      </div>

    </div>
  )
}

export default Dashboard