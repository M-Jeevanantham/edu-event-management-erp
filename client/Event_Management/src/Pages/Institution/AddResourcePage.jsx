import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const AddResourcePage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    type: "",
    description: "",
    total: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!form.name || !form.type || !form.total) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3001/api/institution/resources",
        {
          ...form,
          total: Number(form.total),
          available: Number(form.total),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Resource added successfully");
      navigate("/institution/resources");
    } catch (err) {
      console.error("Failed to add resource", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 text-[#4E6766]">
        <button onClick={() => navigate(-1)} className="hover:text-[#2c4140]">
          <FaArrowLeft />
        </button>
        <h2 className="text-2xl font-bold">Add New Resource</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {["name", "type", "description", "total"].map((field) => (
          <div key={field}>
            <label className="block font-semibold capitalize text-gray-700">
              {field} {field !== "description" && <span className="text-red-500">*</span>}
            </label>
            <input
              type={field === "total" ? "number" : "text"}
              name={field}
              value={form[field]}
              onChange={handleChange}
              required={field !== "description"}
              className="w-full border rounded px-3 py-2 mt-1"
              placeholder={`Enter ${field}`}
            />
          </div>
        ))}

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          className="bg-[#4E6766] text-white px-6 py-2 rounded hover:bg-[#3d5252] transition"
        >
          Add Resource
        </button>
      </form>
    </div>
  );
};

export default AddResourcePage;
