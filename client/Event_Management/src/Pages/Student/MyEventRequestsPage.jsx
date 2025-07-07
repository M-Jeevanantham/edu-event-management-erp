import React, { useEffect, useState } from "react";
import axios from "axios";

const MyEventRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/student/my-requests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(res.data);
      } catch (err) {
        console.error("Error fetching requests", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [token]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-[#4E6766]">My Event Requests</h2>

      {requests.length === 0 ? (
        <p>No event requests yet.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((req) => (
            <li
              key={req._id}
              className="border border-[#4E6766] rounded p-4 shadow-sm bg-white"
            >
              <h3 className="text-lg font-semibold text-[#4E6766]">{req.title}</h3>
              <p className="text-sm text-gray-700">
                Date: {new Date(req.preferredDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-700">
                Status:
                <span
                  className={`ml-2 font-medium ${
                    req.status === "approved"
                      ? "text-green-600"
                      : req.status === "rejected"
                      ? "text-red-500"
                      : "text-yellow-600"
                  }`}
                >
                  {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                </span>
              </p>

              <div className="mt-2">
                <p className="font-medium">Resources:</p>
                <ul className="list-disc ml-5 text-sm">
                  {req.requestedResources.map((r, i) => (
                    <li key={i}>
                      {r.resource?.name || "Unknown"} - {r.quantity}
                    </li>
                  ))}
                </ul>
              </div>

              {req.approvedEducator && (
                <div className="mt-3 bg-[#F0EDEE] p-3 rounded">
                  <h4 className="font-semibold text-[#4E6766] mb-1">Assigned Educator</h4>
                  <p><strong>Name:</strong> {req.approvedEducator.name}</p>
                  <p><strong>Email:</strong> {req.approvedEducator.email}</p>
                  {req.approvedEducator.contact && (
                    <p><strong>Contact:</strong> {req.approvedEducator.contact}</p>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyEventRequestsPage;
