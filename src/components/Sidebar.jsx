import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import api from "../api/axios";
import { LayoutDashboard, PlaneTakeoff, X, LogOut } from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { dispatch } = useContext(AdminContext);

  const handleLogout = async () => {
    try {
      await api.post("/users/logout");
      dispatch({ type: "LOGOUT" });
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const navLinks = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
    {
      name: "Add New Flight",
      path: "/add-flight",
      icon: <PlaneTakeoff size={20} />,
    },
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1E293B] border-r border-gray-800 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col`}
    >
      <div className="p-6 flex justify-between items-center border-b border-gray-800">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
          SkyAdmin
        </h2>
        <button
          onClick={toggleSidebar}
          className="md:hidden text-gray-400 hover:text-white"
        >
          <X />
        </button>
      </div>

      <nav className="flex-1 mt-6 px-4 space-y-2">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => window.innerWidth < 768 && toggleSidebar()}
              className={`flex items-center p-4 rounded-xl transition-all ${isActive ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-lg shadow-cyan-500/20" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
            >
              <span className="mr-3">{link.icon}</span> {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full p-3 text-red-400 bg-red-500/10 rounded-xl hover:bg-red-500/20 transition-colors font-bold"
        >
          <LogOut size={20} className="mr-2" /> Secure Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
