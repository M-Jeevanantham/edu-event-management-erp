import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const InstitutionEventRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/institution/event-requests", {
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

  const handleApproveAndNavigate = async (id) => {
    try {
      await axios.post(
        `http://localhost:3001/api/institution/event-approve/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRequests((prev) =>
        prev.map((req) =>
          req._id === id ? { ...req, status: "approved" } : req
        )
      );

      navigate(`/institution/create-event/${id}`);
    } catch (err) {
      console.error("Error approving request", err);
      alert("Failed to approve the request.");
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.post(
        `http://localhost:3001/api/institution/event-reject/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRequests((prev) =>
        prev.map((req) =>
          req._id === id ? { ...req, status: "rejected" } : req
        )
      );
    } catch (err) {
      console.error("Error rejecting request", err);
      alert("Failed to reject the request.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-[#4E6766]">Student Event Requests</h2>

      {requests.length === 0 ? (
        <p>No event requests found.</p>
      ) : (
        <ul className="space-y-6">
          {requests.map((req) => (
            <li key={req._id} className="p-5 bg-white rounded shadow border border-[#4E6766]">
              <h3 className="text-xl font-semibold text-[#4E6766]">{req.title}</h3>
              <p className="text-sm text-gray-700">
                Preferred Date: {new Date(req.preferredDate).toLocaleDateString()}
              </p>
              <p className="text-sm mb-2 text-gray-700">Description: {req.description || "N/A"}</p>

              <div className="bg-[#F0EDEE] p-3 rounded mb-3">
                <h4 className="text-md font-semibold mb-1 text-[#4E6766]">Requested By:</h4>
                <p><strong>Name:</strong> {req.requestedBy?.name}</p>
                <p><strong>Email:</strong> {req.requestedBy?.email}</p>
                <p><strong>Role:</strong> {req.requestedBy?.role}</p>
              </div>

              <div className="mb-4">
                <h4 className="text-md font-semibold mb-1 text-[#4E6766]">Requested Resources:</h4>
                <ul className="list-disc ml-5 text-sm">
                  {req.requestedResources.map((r, idx) => (
                    <li key={idx}>{r.resource?.name || "Unknown"} - {r.quantity}</li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-4">
                {req.status === "pending" ? (
                  <>
                    <button
                      onClick={() => handleApproveAndNavigate(req._id)}
                      className="px-4 py-2 rounded text-white bg-[#4E6766] hover:bg-[#3a5150] transition-all"
                    >
                      Approve and Create Event
                    </button>
                    <button
                      onClick={() => handleReject(req._id)}
                      className="px-4 py-2 rounded text-white bg-red-600 hover:bg-red-700 transition-all"
                    >
                      Reject Request
                    </button>
                  </>
                ) : (
                  <span className={`px-4 py-2 rounded text-white ${req.status === "approved" ? "bg-green-500" : "bg-red-400"}`}>
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InstitutionEventRequestsPage;
