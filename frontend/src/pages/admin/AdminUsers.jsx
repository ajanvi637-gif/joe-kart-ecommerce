import axios from "axios";
import React, { useEffect, useState } from "react";
import { Search, Eye, Edit } from "lucide-react";
import UserLogo from "@/assets/joeuserLogo.png";
import bgPink from "@/assets/bgpink4.jpg";
import { Input } from "@/input";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/button";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const getAllUsers = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/user/all-user",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="  py-4 px-8  relative">

      {/* Background */}

      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: `url(${bgPink})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />


      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Users
          </h1>
          <p className="text-sm text-gray-600">
            Manage your platform users
          </p>
        </div>

        {/* SEARCH */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4" />

          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
          />
        </div>
      </div>

      {/* USERS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300"
          >

            {/* USER INFO */}
            <div className="flex items-center gap-4">
              <img
                src={user?.profilePic || UserLogo}
                alt="user"
                className="w-12 h-12 rounded-full object-cover"
              />

              <div className="flex-1">
                <h2 className="text-sm font-semibold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-xs text-gray-600 truncate">
                  {user?.email}
                </p>
              </div>
            </div>

            {/* DIVIDER */}
            <div className="h-px bg-gray-200 my-4" />

            {/* ACTIONS */}
            <div className="flex items-center justify-between">

              {/* EDIT → FIXED NAVIGATION */}
              <Button
                onClick={() => {
                  navigate(`/dashboard/users/${user._id}`);
                }}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-pink-600 border-pink-200 hover:bg-pink-50"
              >
                <Edit size={14} />
                Edit
              </Button>

              <Button
                variant="secondary"
                size="sm"
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                <Eye size={14} />
                Orders
              </Button>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
};

export default AdminUsers;