import React, { useEffect, useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import api from "../api/axios";
import {
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  Settings2,
  PlaneTakeoff,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";

const Dashboard = () => {
  // 1. Context se flights aur dispatch nikaalo
  const { flights = [], dispatch } = useContext(AdminContext);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const res = await api.get("/flights");

        // 2. CHECK: Backend se array aa raha hai ya object?
        // Agar res.data ek array hai toh wahi use karo, warna res.data.flights check karo
        const flightData = Array.isArray(res.data)
          ? res.data
          : res.data.flights || [];

        dispatch({ type: "SET_FLIGHTS", payload: flightData });
      } catch (error) {
        console.error("Failed to fetch flights", error);
        dispatch({ type: "SET_FLIGHTS", payload: [] }); // Error par empty array set karo
      }
    };
    fetchFlights();
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (
      window.confirm("Bhai, kya tum sach mein is flight ko udana chahte ho?")
    ) {
      try {
        await api.delete(`/flights/delete/${id}`);
        dispatch({ type: "DELETE_FLIGHT", payload: id });
      } catch (error) {
        alert("Delete failed!");
      }
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/flights/update-status/${id}`, { status });
      dispatch({ type: "UPDATE_STATUS", payload: { id, status } });
    } catch (error) {
      alert("Status update failed!");
    }
  };

  // 3. Helper for status styles
  const getStatusStyles = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]";
      case "Cancelled":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "Pending":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-7xl mx-auto p-4 md:p-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div className="flex items-center space-x-4">
          <div className="bg-cyan-500/10 p-3 rounded-2xl border border-cyan-500/20">
            <Settings2 className="text-cyan-400 h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              System Operations
            </h1>
            <p className="text-gray-500 text-sm font-medium">
              Manage active fleet and operational status
            </p>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-[#121A2F]/40 backdrop-blur-xl rounded-[2.5rem] border border-gray-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0B1120]/60 text-gray-400 text-[10px] uppercase font-black tracking-[0.2em] border-b border-gray-800">
                <th className="p-6">Flight Information</th>
                <th className="p-6">Route</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {/* 4. FINAL SAFETY CHECK: Map tabhi karo jab flights array ho */}
              {Array.isArray(flights) && flights.length > 0 ? (
                flights.map((f) => (
                  <tr
                    key={f._id}
                    className="hover:bg-blue-500/5 transition-all group"
                  >
                    <td className="p-6">
                      <div className="flex items-center space-x-4">
                        <img
                          src={f.image || "https://via.placeholder.com/150"}
                          alt="flight"
                          className="w-14 h-14 rounded-2xl object-cover border border-gray-700"
                        />
                        <div>
                          <p className="font-black text-white text-lg">
                            {f.airlineName}
                          </p>
                          <p className="text-xs font-bold text-cyan-400/70 tracking-widest uppercase">
                            {f.flightNumber}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center text-gray-200 font-black text-sm uppercase">
                        {f.source} <span className="mx-2 text-gray-600">➔</span>{" "}
                        {f.destination}
                      </div>
                    </td>
                    <td className="p-6">
                      <span
                        className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(f.status)}`}
                      >
                        {f.status}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center justify-end space-x-4">
                        <button
                          onClick={() => updateStatus(f._id, "Confirmed")}
                          className="text-gray-600 hover:text-green-400 transition-colors"
                        >
                          <CheckCircle size={20} />
                        </button>
                        <button
                          onClick={() => updateStatus(f._id, "Pending")}
                          className="text-gray-600 hover:text-yellow-400 transition-colors"
                        >
                          <Clock size={20} />
                        </button>
                        <button
                          onClick={() => updateStatus(f._id, "Cancelled")}
                          className="text-gray-600 hover:text-red-400 transition-colors"
                        >
                          <XCircle size={20} />
                        </button>
                        <div className="w-px h-6 bg-gray-800 mx-2"></div>
                        <button
                          onClick={() => handleDelete(f._id)}
                          className="text-gray-600 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-20 text-center">
                    <div className="flex flex-col items-center opacity-30">
                      <PlaneTakeoff size={60} className="mb-4 text-gray-500" />
                      <p className="text-gray-500 font-bold tracking-widest uppercase text-sm">
                        No active flights found.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
