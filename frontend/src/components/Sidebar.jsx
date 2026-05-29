import { LayoutDashboard, PackagePlus, Users, BadgeCheck } from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {

  const baseStyle =
    "flex items-center gap-3 px-4 py-3 rounded-xl w-full text-sm font-medium transition-all duration-300";

  const getClass = (isActive) =>
    `${baseStyle} ${isActive
      ? "bg-gradient-to-r from-pink-500 to-pink-400 text-white shadow-md"
      : "text-gray-600 hover:bg-pink-50 hover:text-pink-600"
    }`;

  return (
    <div className="hidden md:flex flex-col fixed top-[64px] left-0 w-[260px] 
    h-[calc(100vh-64px)] 
    bg-white/70 backdrop-blur-lg 
    border-r border-gray-200 
    shadow-sm px-5 py-6 ">

      {/* LOGO */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-pink-600 tracking-wide ">
          JoeKART
        </h1>
        <p className="text-xs text-gray-400 mt-1 pl-4">Admin Panel</p>
      </div>

      {/* MENU */}
      <div className="flex flex-col gap-2 flex-1">

        <NavLink to="/dashboard/sales" className={({ isActive }) => getClass(isActive)}>
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink to="/dashboard/add-product" className={({ isActive }) => getClass(isActive)}>
          <PackagePlus size={18} />
          Add Product
        </NavLink>

        <NavLink to="/dashboard/products" className={({ isActive }) => getClass(isActive)}>
          <PackagePlus size={18} />
          Products
        </NavLink>

        <NavLink to="/dashboard/users" className={({ isActive }) => getClass(isActive)}>
          <Users size={18} />
          Users
        </NavLink>

        <NavLink to="/dashboard/orders" className={({ isActive }) => getClass(isActive)}>
          <BadgeCheck size={18} />
          Orders
        </NavLink>

      </div>

      {/* FOOTER */}
      <div className="pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-400 text-center">
          © 2026 JoeKART
        </p>
      </div>

    </div>
  );
};

export default Sidebar;