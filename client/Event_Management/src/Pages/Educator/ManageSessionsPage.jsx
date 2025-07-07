import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ManageSessionsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [assignedEvents, setAssignedEvents] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [loadingAssignedEvents, setLoadingAssignedEvents] = useState(true);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3001/api/educator/assignments/pending",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.assignments)
          ? res.data.assignments
          : [];

        setAssignments(data);
      } catch (err) {
        console.error("Error fetching assignments:", err);
      } finally {
        setLoadingAssignments(false);
      }
    };

    const fetchAssignedEvents = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3001/api/educator/event/assigned",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.events)
          ? res.data.events
          : [];

        setAssignedEvents(data);
      } catch (err) {
        console.error("Error fetching assigned events:", err);
      } finally {
        setLoadingAssignedEvents(false);
      }
    };

    fetchAssignments();
    fetchAssignedEvents();
  }, []);

  const handleResponse = async (assignmentId, decision) => {
    try {
      await axios.post(
        "http://localhost:3001/api/educator/event-response",
        {
          assignmentId,
          response: decision,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAssignments((prev) => prev.filter((a) => a._id !== assignmentId));
    } catch (err) {
      console.error("Error sending response:", err);
      alert("Failed to send response");
    }
  };

  return (
    <div className="text-gray-800">
      <h1 className="text-3xl font-bold text-[#4E6766] mb-6">
        Manage Sessions
      </h1>

      {/* Assignment Requests Section */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-[#4E6766] mb-3">
          Pending Assignments
        </h2>
        {loadingAssignments ? (
          <p>Loading assignments...</p>
        ) : assignments.length === 0 ? (
          <p className="text-gray-500">No assignments available.</p>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full text-sm">
              <thead className="bg-[#4E6766] text-white">
                <tr>
                  <th className="text-left px-6 py-3">Title</th>
                  <th className="text-left px-6 py-3">Date</th>
                  <th className="text-left px-6 py-3">Time</th>
                  <th className="text-left px-6 py-3">Location</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((session) => (
                  <tr key={session._id} className="border-t">
                    <td className="px-6 py-4">{session.title}</td>
                    <td className="px-6 py-4">{session.date}</td>
                    <td className="px-6 py-4">{session.time}</td>
                    <td className="px-6 py-4">{session.location}</td>
                    <td className="px-6 py-4 text-center space-x-2">
                      <button
                        onClick={() => handleResponse(session._id, "accepted")}
                        className="text-green-600 hover:underline"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleResponse(session._id, "rejected")}
                        className="text-red-600 hover:underline"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assigned Events Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-[#4E6766] mb-3">
          Your Assigned Events
        </h2>
        {loadingAssignedEvents ? (
          <p>Loading assigned events...</p>
        ) : assignedEvents.length === 0 ? (
          <p className="text-gray-500">You have no assigned events.</p>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full text-sm">
              <thead className="bg-[#f0edee] text-[#4E6766]">
                <tr>
                  <th className="text-left px-6 py-3">Title</th>
                  <th className="text-left px-6 py-3">Date</th>
                  <th className="text-left px-6 py-3">Time</th>
                  <th className="text-left px-6 py-3">Location</th>
                </tr>
              </thead>
              <tbody>
                {assignedEvents.map((event) => (
                  <tr
                    key={event._id}
                    className="border-t cursor-pointer hover:bg-gray-100 transition"
                    onClick={() =>
                      navigate(`/educator/events/${event._id}`)
                    }
                  >
                    <td className="px-6 py-4">{event.title}</td>
                    <td className="px-6 py-4">{event.date}</td>
                    <td className="px-6 py-4">{event.time}</td>
                    <td className="px-6 py-4">{event.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageSessionsPage;
