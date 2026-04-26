import React, { useState, useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import Sidebar from "../components/Sidebar";
import { Menu } from "lucide-react";

const AdminLayout = () => {
  const { adminUser } = useContext(AdminContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Agar user logged in nahi hai, ya admin nahi hai, toh bhaga do
  if (!adminUser || adminUser.email !== "priyanshu.code01@gmail.com") {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-white flex">
      {/* Sidebar (Responsive) */}
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen transition-all duration-300">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-[#1E293B] border-b border-gray-800 sticky top-0 z-40">
          <h1 className="text-xl font-bold text-cyan-400">SkyAdmin</h1>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 bg-gray-800 rounded-lg text-white"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Page Content goes here */}
        <div className="p-4 md:p-8 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminLayout;
