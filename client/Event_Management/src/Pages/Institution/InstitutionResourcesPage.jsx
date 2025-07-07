import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaTools } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const InstitutionResourcesPage = () => {
  const [availableResources, setAvailableResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvailableResources = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:3001/api/institution/resources", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const filtered = (res.data.resources || res.data).filter(
          (resource) => resource.available > 0
        );
        setAvailableResources(filtered);
      } catch (error) {
        console.error("Failed to fetch resources:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableResources();
  }, []);

  return (
    <div className="p-6 space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-[#4E6766] hover:text-[#2c4140] flex items-center gap-2"
        >
          <FaArrowLeft /> Back
        </button>
        <h1 className="text-3xl font-bold text-[#4E6766]">Available Resources</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/institution/add/resource")}
            className="flex items-center gap-2 bg-[#4E6766] text-white px-4 py-2 rounded hover:bg-[#3d5252] transition"
          >
            <FaPlus /> Add Resource
          </button>
          <button
            onClick={() => navigate("/institution/assign-resource")}
            className="flex items-center gap-2 bg-[#4E6766] text-white px-4 py-2 rounded hover:bg-[#3d5252] transition"
          >
            <FaTools /> Assign Resource
          </button>
        </div>
      </div>

      {/* Available Resources Table */}
      <div>
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="w-full table-auto text-left">
            <thead className="bg-[#f0edee] text-[#4E6766]">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Available</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center px-6 py-6 text-gray-500">
                    Loading resources...
                  </td>
                </tr>
              ) : availableResources.length > 0 ? (
                availableResources.map((res) => (
                  <tr key={res._id} className="border-t">
                    <td className="px-6 py-4">{res.name}</td>
                    <td className="px-6 py-4">{res.type}</td>
                    <td className="px-6 py-4">{res.total}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-sm rounded-full ${
                          res.available > 0
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {res.available}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center space-x-3">
                      <button className="text-blue-600 hover:text-blue-800">
                        <FaEdit />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center px-6 py-6 text-gray-500">
                    No available resources found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InstitutionResourcesPage;
