import React, { useState } from "react";
import api from "../api/axios";
import { UploadCloud, PlaneTakeoff } from "lucide-react";

const AddFlight = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    flightNumber: "",
    airlineName: "",
    source: "",
    destination: "",
    departureTime: "",
    arrivalTime: "",
    economyPrice: "",
    businessPrice: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert("Please select a flight image!");

    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    data.append("image", image);

    try {
      await api.post("/flights/add", data);
      alert("Flight Published Successfully!");
      // Reset form
      setFormData({
        flightNumber: "",
        airlineName: "",
        source: "",
        destination: "",
        departureTime: "",
        arrivalTime: "",
        economyPrice: "",
        businessPrice: "",
      });
      setImage(null);
    } catch (err) {
      alert(err.response?.data?.message || "Error adding flight");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-[#1E293B] rounded-3xl p-8 border border-gray-800 shadow-2xl">
      <div className="flex items-center space-x-4 mb-8 border-b border-gray-800 pb-6">
        <div className="bg-cyan-500/10 p-3 rounded-xl">
          <PlaneTakeoff className="text-cyan-400 h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Add New Flight</h2>
          <p className="text-gray-400 text-sm">
            Upload flight details and image
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Image Upload Area */}
        <div className="md:col-span-2">
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-700 rounded-2xl cursor-pointer hover:bg-[#0B1120] transition-colors bg-[#0B1120]/50">
            <UploadCloud className="text-gray-400 mb-2 h-8 w-8" />
            <span className="text-gray-400 font-medium">
              {image ? image.name : "Click to upload flight display image"}
            </span>
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
              required
            />
          </label>
        </div>

        {/* Inputs */}
        {["flightNumber", "airlineName", "source", "destination"].map(
          (field, idx) => (
            <div key={idx}>
              <label className="text-xs text-gray-400 uppercase tracking-wider ml-1">
                {field.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type="text"
                name={field}
                required
                value={formData[field]}
                onChange={handleChange}
                className="w-full mt-1 bg-[#0B1120] text-white border border-gray-700 rounded-xl p-3 focus:outline-none focus:border-cyan-500"
              />
            </div>
          ),
        )}

        {["departureTime", "arrivalTime"].map((field, idx) => (
          <div key={idx}>
            <label className="text-xs text-gray-400 uppercase tracking-wider ml-1">
              {field.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type="datetime-local"
              name={field}
              required
              value={formData[field]}
              onChange={handleChange}
              className="w-full mt-1 bg-[#0B1120] text-white border border-gray-700 rounded-xl p-3 focus:outline-none focus:border-cyan-500 [color-scheme:dark]"
            />
          </div>
        ))}

        {["economyPrice", "businessPrice"].map((field, idx) => (
          <div key={idx}>
            <label className="text-xs text-gray-400 uppercase tracking-wider ml-1">
              {field.replace(/([A-Z])/g, " $1")} ($)
            </label>
            <input
              type="number"
              name={field}
              required
              value={formData[field]}
              onChange={handleChange}
              className="w-full mt-1 bg-[#0B1120] text-white border border-gray-700 rounded-xl p-3 focus:outline-none focus:border-cyan-500"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="md:col-span-2 mt-4 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 transition-all"
        >
          {loading ? "Uploading & Publishing..." : "Publish Flight"}
        </button>
      </form>
    </div>
  );
};

export default AddFlight;
