import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AssignResourcePage = () => {
  const [events, setEvents] = useState([]);
  const [resources, setResources] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedResource, setSelectedResource] = useState("");
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const [eventRes, resourceRes] = await Promise.all([
          axios.get("http://localhost:3001/api/institution/events", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3001/api/institution/resources", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setEvents(eventRes.data || []);
        const available = (resourceRes.data.resources || resourceRes.data || []).filter(
          (r) => r.available > 0
        );
        setResources(available);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const handleAssign = async () => {
    const token = localStorage.getItem("token");

    if (!selectedEventId || !selectedResource || quantity <= 0) {
      alert("Please fill all fields with valid values.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3001/api/institution/resources/assign",
        {
          eventId: selectedEventId,
          resources: [
            {
              resourceId: selectedResource,
              quantity: parseInt(quantity),
            },
          ],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Resource assigned successfully!");
      navigate("/institution/resources");
    } catch (err) {
      console.error("Assignment failed:", err);
      alert("Failed to assign resource.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-[#4E6766] mb-4">
        Assign Resource to Event
      </h1>

      <div className="bg-white p-6 rounded shadow space-y-4 max-w-xl">
        <div>
          <label className="block mb-1 font-medium text-[#4E6766]">
            Select Event:
          </label>
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
          <label className="block mb-1 font-medium text-[#4E6766]">
            Select Resource:
          </label>
          <select
            value={selectedResource}
            onChange={(e) => setSelectedResource(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Choose Resource --</option>
            {resources.map((r) => (
              <option key={r._id} value={r._id}>
                {r.name} (Available: {r.available})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium text-[#4E6766]">Quantity:</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          onClick={handleAssign}
          className="w-full bg-[#4E6766] text-white py-2 rounded hover:bg-[#3d5252] transition"
        >
          Assign Resource
        </button>
      </div>
    </div>
  );
};

export default AssignResourcePage;
