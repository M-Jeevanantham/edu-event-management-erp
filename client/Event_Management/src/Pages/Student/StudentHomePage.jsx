import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StudentHomePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/student/events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [token]);

  const goToRegisterPage = (eventId) => {
    navigate(`/student/event-register/${eventId}`);
  };

  if (loading) return <p>Loading events...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-[#4E6766]">Available Events</h2>
      {events.length === 0 ? (
        <p>No upcoming events found.</p>
      ) : (
        <ul className="space-y-6">
          {events.map((event) => (
            <li
              key={event._id}
              className="bg-white p-4 rounded shadow border border-[#4E6766]"
            >
              <h3 className="text-xl font-semibold text-[#4E6766]">
                {event.title}
              </h3>
              <p className="text-gray-700">Date: {new Date(event.date).toLocaleDateString()}</p>
              <p className="text-gray-700">Location: {event.location}</p>
              <p className="text-gray-700">Educator: {event.assignedEducator?.educator?.name || "TBD"}</p>

              <button
                onClick={() => goToRegisterPage(event._id)}
                className="mt-3 px-4 py-2 bg-[#4E6766] text-white rounded hover:bg-[#3a5150]"
              >
                Register
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentHomePage;
