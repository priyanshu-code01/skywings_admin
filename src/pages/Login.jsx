import React, { useState, useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { dispatch, loading } = useContext(AdminContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await api.post("/users/login", { email, password });
      const user = response.data.user;

      // Strict Check: Sirf Admin ko allow karo
      if (user.email !== "admin@skywings.com") {
        setError("Access Denied: Authorized personnel only.");
        dispatch({ type: "SET_LOADING", payload: false });
        return;
      }

      dispatch({ type: "LOGIN", payload: user });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1120] p-4">
      <div className="bg-[#1E293B] p-10 rounded-3xl shadow-2xl shadow-cyan-900/20 w-full max-w-md border border-gray-800">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-red-500/10 p-4 rounded-full mb-4 border border-red-500/20">
            <ShieldAlert className="text-red-400 h-8 w-8" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-wide">
            Admin Portal
          </h2>
          <p className="text-gray-400 text-sm">SkyWings Restricted Access</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0B1120] text-white border border-gray-700 rounded-xl p-3 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0B1120] text-white border border-gray-700 rounded-xl p-3 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-lg text-center border border-red-500/20">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-cyan-500/30 transition-all"
          >
            {loading ? "Authenticating..." : "Secure Login ➔"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
