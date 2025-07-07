import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUserPlus } from "react-icons/fa";

const InstitutionEducatorsPage = () => {
  const [educators, setEducators] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEducators = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:3001/api/institution/educators", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEducators(res.data || []);
      } catch (err) {
        console.error("Failed to load educators", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEducators();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#4E6766] hover:text-[#2c4140]"
        >
          <FaArrowLeft /> Back
        </button>
        <h1 className="text-3xl font-bold text-[#4E6766]">Educators</h1>
        <button
          onClick={() => navigate("/institution/assign-educator")}
          className="flex items-center gap-2 bg-[#4E6766] text-white px-4 py-2 rounded hover:bg-[#3d5252] transition"
        >
          <FaUserPlus /> Assign Educator
        </button>
      </div>

      {/* Educator Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full table-auto text-left">
          <thead className="bg-[#f0edee] text-[#4E6766]">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Expertise</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center px-6 py-6 text-gray-500">
                  Loading educators...
                </td>
              </tr>
            ) : educators.length > 0 ? (
              educators.map((edu) => (
                <tr key={edu._id} className="border-t">
                  <td className="px-6 py-4">{edu.name}</td>
                  <td className="px-6 py-4">{edu.email}</td>
                  <td className="px-6 py-4">{edu.expertise || "N/A"}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => navigate(`/institution/assign-educator?educatorId=${edu._id}`)}
                      className="bg-[#4E6766] hover:bg-[#3d5252] text-white px-3 py-1 rounded text-sm"
                    >
                      Assign to Event
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center px-6 py-6 text-gray-500">
                  No educators found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InstitutionEducatorsPage;
