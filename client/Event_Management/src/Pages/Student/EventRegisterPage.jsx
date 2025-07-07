import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EventRegisterPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/student/event/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvent(res.data);
      } catch (err) {
        console.error("Failed to fetch event", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleRegister = async () => {
    try {
      await axios.post(
        `http://localhost:3001/api/student/register`,
        { eventId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("\u2705 Registered successfully!");
      navigate("/student");
    } catch (err) {
      console.error("Registration error:", err);
      alert("\u274C Registration failed.");
    }
  };

  if (loading) return <p>Loading event details...</p>;
  if (!event) return <p>Event not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-[#4E6766] mb-2">{event.title}</h2>
      <p>Date: {new Date(event.date).toLocaleDateString()}</p>
      <p>Location: {event.location}</p>
      <p>Description: {event.description}</p>
      <p>Educator: {event.assignedEducator?.educator?.name || "Not Assigned"}</p>

      <button
        onClick={handleRegister}
        className="mt-4 px-4 py-2 bg-[#4E6766] text-white rounded hover:bg-[#3a5150]"
      >
        Register for this Event
      </button>
    </div>
  );
};

export default EventRegisterPage;
