import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AssignEducatorPage = () => {
  const [events, setEvents] = useState([]);
  const [educators, setEducators] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedEducatorId, setSelectedEducatorId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const [eventRes, educatorRes] = await Promise.all([
          axios.get("http://localhost:3001/api/institution/events", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3001/api/institution/educators", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setEvents(eventRes.data || []);
        setEducators(educatorRes.data.educators || educatorRes.data || []);
      } catch (err) {
        console.error("Failed to fetch events or educators:", err);
      }
    };

    fetchData();
  }, []);

  const handleAssign = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:3001/api/institution/events/assign-educator",
        {
          eventId: selectedEventId,
          educatorId: selectedEducatorId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Educator assigned successfully!");
      navigate("/institution/events");
    } catch (err) {
      console.error("Assignment failed:", err);
      alert("Failed to assign educator.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-[#4E6766] mb-4">Assign Educator to Event</h1>

      <div className="bg-white p-6 rounded shadow space-y-4 max-w-xl">
        <div>
          <label className="block mb-1 font-medium text-[#4E6766]">Select Event:</label>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Choose Event --</option>
            {events.map((e) => (
              <option key={e._id} value={e._id}>
                {e.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium text-[#4E6766]">Select Educator:</label>
          <select
            value={selectedEducatorId}
            onChange={(e) => setSelectedEducatorId(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Choose Educator --</option>
            {educators.map((e) => (
              <option key={e._id} value={e._id}>
                {e.name} ({e.email})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleAssign}
          className="w-full bg-[#4E6766] text-white py-2 rounded hover:bg-[#3d5252] transition"
        >
          Assign Educator
        </button>
      </div>
    </div>
  );
};

export default AssignEducatorPage;
