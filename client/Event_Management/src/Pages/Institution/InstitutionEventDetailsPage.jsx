import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiEdit3, FiArrowLeft } from "react-icons/fi";

const InstitutionEventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    capacity: "",
    description: "",
  });
  const [educators, setEducators] = useState([]);
  const [selectedEducatorId, setSelectedEducatorId] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventRes = await axios.get(`http://localhost:3001/api/institution/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const eventData = eventRes.data;
        setEvent(eventData);
        setForm({
          title: eventData.title,
          date: eventData.date?.slice(0, 10),
          location: eventData.location,
          capacity: eventData.capacity,
          description: eventData.description || "",
        });
        setSelectedEducatorId(eventData.assignedEducator?.educator?._id || "");
      } catch (err) {
        console.error("Failed to fetch event:", err);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (isEditing) {
      axios
        .get("http://localhost:3001/api/institution/educators", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setEducators(res.data))
        .catch((err) => console.error("Error fetching educators:", err));
    }
  }, [isEditing]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      // 1. Update event basic fields
      await axios.put(`http://localhost:3001/api/institution/events/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 2. Assign educator separately
      if (selectedEducatorId) {
        await axios.post(
          "http://localhost:3001/api/institution/events/assign-educator",
          { eventId: id, educatorId: selectedEducatorId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      alert("✅ Event updated successfully.");
      setIsEditing(false);
      window.location.reload();
    } catch (err) {
      console.error("Error updating event or assigning educator:", err);
      alert("❌ Something went wrong.");
    }
  };

  if (!event) return <p className="p-6">Loading event...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto relative">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-black flex items-center gap-1"
        >
          <FiArrowLeft className="text-xl" />
          Back
        </button>

        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="text-gray-700 hover:text-black">
            <FiEdit3 className="text-2xl" />
          </button>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-4 text-[#4E6766]">Event Full Details</h2>

      <div className="space-y-4">
        {Object.entries(form).map(([key, value]) => (
          <div key={key}>
            <label className="block font-semibold capitalize text-gray-700">{key}</label>
            <input
              type={key === "date" ? "date" : "text"}
              name={key}
              value={value}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>
        ))}

        <div>
          <label className="block font-semibold text-gray-700">Assign Educator</label>
          {isEditing ? (
            <select
              className="w-full border rounded px-3 py-2 mt-1"
              value={selectedEducatorId}
              onChange={(e) => setSelectedEducatorId(e.target.value)}
            >
              <option value="">Select Educator</option>
              {educators.map((edu) => (
                <option key={edu._id} value={edu._id}>
                  {edu.name} ({edu.email})
                </option>
              ))}
            </select>
          ) : (
            <p className="bg-gray-100 px-3 py-2 rounded">
              {event.assignedEducator?.educator?.name || "Not Assigned"} (
              {event.assignedEducator?.status || "Unassigned"})
            </p>
          )}
        </div>

        <div>
          <label className="block font-semibold text-gray-700">Status</label>
          <p className="bg-gray-100 px-3 py-2 rounded">{event.status}</p>
        </div>

        <div>
          <label className="block font-semibold text-gray-700">Created By</label>
          <p className="bg-gray-100 px-3 py-2 rounded">
            {event.createdBy?.name} ({event.createdBy?.email})
          </p>
        </div>

        <div>
          <label className="block font-semibold text-gray-700">Assigned Resources</label>
          {event.assignedResources?.length > 0 ? (
            <ul className="list-disc list-inside">
              {event.assignedResources.map((res, i) => (
                <li key={i}>
                  {res.resource?.name || "Unknown"} × {res.quantity}
                </li>
              ))}
            </ul>
          ) : (
            <p className="bg-gray-100 px-3 py-2 rounded">None</p>
          )}
        </div>

        <div>
          <label className="block font-semibold text-gray-700">Registered Students</label>
          {event.registeredStudents?.length > 0 ? (
            <ul className="list-disc list-inside">
              {event.registeredStudents.map((s, i) => (
                <li key={i}>{s.name || "Pending"}</li>
              ))}
            </ul>
          ) : (
            <p className="bg-gray-100 px-3 py-2 rounded">0</p>
          )}
        </div>

        <div>
          <label className="block font-semibold text-gray-700">Approved Students</label>
          {event.approvedStudents?.length > 0 ? (
            <ul className="list-disc list-inside">
              {event.approvedStudents.map((s, i) => (
                <li key={i}>{s.name || "Unknown"}</li>
              ))}
            </ul>
          ) : (
            <p className="bg-gray-100 px-3 py-2 rounded">0</p>
          )}
        </div>

        <div>
          <label className="block font-semibold text-gray-700">Attendance</label>
          {event.registeredStudentsAttendance?.length > 0 ? (
            <ul className="list-disc list-inside">
              {event.registeredStudentsAttendance.map((entry, i) => (
                <li key={i}>
                  {entry.student?.name || "Unknown"} -{" "}
                  <span className={entry.present ? "text-green-600" : "text-red-500"}>
                    {entry.present ? "Present" : "Absent"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="bg-gray-100 px-3 py-2 rounded">No attendance data</p>
          )}
        </div>

        <div>
          <label className="block font-semibold text-gray-700">Feedbacks</label>
          {event.feedbacks?.length > 0 ? (
            <ul className="list-disc list-inside">
              {event.feedbacks.map((f, i) => (
                <li key={i}>{f.comment || "Feedback given"}</li>
              ))}
            </ul>
          ) : (
            <p className="bg-gray-100 px-3 py-2 rounded">0 feedbacks</p>
          )}
        </div>

        {isEditing && (
          <div className="mt-6 flex gap-4">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstitutionEventDetailsPage;
