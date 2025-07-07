import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const InstitutionEventsPage = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
   const token = localStorage.getItem("token");

  const fetchEvents = async () => {
  try {
    const { data } = await axios.get("http://localhost:3001/api/institution/events", {
       headers: {
    Authorization: `Bearer ${token}`,
  },
    });

    if (Array.isArray(data)) {
      setEvents(data);
    } else if (Array.isArray(data.events)) {
      setEvents(data.events);
    } else {
      console.error("Unexpected data format:", data);
      setEvents([]);
    }
  } catch (err) {
    console.error("Failed to fetch events", err);
    setEvents([]);
  }
};


  const deleteEvent = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/institution/events/${id}`, {
        headers: {
    Authorization: `Bearer ${token}`,
  },
      });
      fetchEvents();
    } catch (err) {
      console.error("Failed to delete event", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div>
      {/* Page Title */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#4E6766]">Manage Events</h1>
        <button
          onClick={() => navigate("/institution/events/create")}
          className="flex items-center gap-2 bg-[#4E6766] text-white px-4 py-2 rounded hover:bg-[#3d5252] transition"
        >
          <FaPlus /> Add Event
        </button>
      </div>

      {/* Events Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full table-auto text-left">
          <thead className="bg-[#f0edee] text-[#4E6766]">
            <tr>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Location</th>
              <th className="px-6 py-3">Capacity</th>
              <th className="px-6 py-3">Educator</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {events.map((event) => (
              <tr key={event._id} className="border-t">
                <td className="px-6 py-4">{event.title}</td>
                <td className="px-6 py-4">{new Date(event.date).toLocaleDateString()}</td>
                <td className="px-6 py-4">{event.location}</td>
                <td className="px-6 py-4">{event.capacity}</td>
                <td className="px-6 py-4">
                  {event.assignedEducator?.educator?.name || "Not Assigned"}
                </td>
                <td className="px-6 py-4 text-center space-x-3">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => navigate(`/institution/events/${event._id}`)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => deleteEvent(event._id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center px-6 py-6 text-gray-500">
                  No events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InstitutionEventsPage;
